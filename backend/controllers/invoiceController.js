import Invoice from '../models/Invoice.js';
import Product from '../models/Product.js';

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private/Admin
export const getInvoices = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { invoiceNo: { $regex: search, $options: 'i' } },
        { 'customerDetails.customerName': { $regex: search, $options: 'i' } },
        { 'customerDetails.firmName': { $regex: search, $options: 'i' } }
      ];
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: invoices.length, invoices });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single invoice by ID
// @route   GET /api/invoices/:id
// @access  Private/Admin
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('items.product', 'title category image');
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    return res.json({ success: true, invoice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Private/Admin
export const createInvoice = async (req, res) => {
  try {
    const { 
      challanNo, poNo, poDate, dispatchThrough, vehicleNo, transportName, 
      lrNo, destination, paymentTerms, customerDetails, items,
      freightCharges, packingCharges, otherCharges, paymentStatus, status, additionalNotes, bankDetails 
    } = req.body;

    if (!customerDetails || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer details and items are required' });
    }

    // Auto-generate Invoice Number
    const count = await Invoice.countDocuments();
    const currentYear = new Date().getFullYear();
    const invoiceNo = `GST-${currentYear}-${String(count + 1).padStart(4, '0')}`;

    // GST Calculation Engine
    let taxableAmount = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    
    const calculatedItems = [];
    const isLocal = customerDetails.stateCode === '24'; // Shop is in Gujarat (code 24)

    for (const item of items) {
      const quantity = Number(item.quantity) || 1;
      const rate = Number(item.rate) || 0; // base price before tax
      const discountPercent = Number(item.discount) || 0;
      const taxRate = Number(item.taxRate) || 18; // default 18%

      // Row discount
      const discountAmount = (rate * discountPercent) / 100;
      const discountedRate = rate - discountAmount;
      const rowTaxable = discountedRate * quantity;

      // Row taxes
      const rowTax = (rowTaxable * taxRate) / 100;
      const rowTotal = rowTaxable + rowTax;

      taxableAmount += rowTaxable;
      
      if (isLocal) {
        cgst += rowTax / 2;
        sgst += rowTax / 2;
      } else {
        igst += rowTax;
      }

      calculatedItems.push({
        product: item.product,
        title: item.title,
        hsnCode: item.hsnCode || '8437',
        quantity,
        unit: item.unit || 'PCS',
        rate,
        discount: discountPercent,
        taxRate,
        taxAmount: rowTax,
        totalAmount: rowTotal,
        
        // Specs
        machineModel: item.machineModel,
        serialNo: item.serialNo,
        motorNo: item.motorNo,
        colour: item.colour,
        warrantyNo: item.warrantyNo,
        installationDate: item.installationDate
      });

      // Decrement product stock if this invoice is finalized and product exists
      if (status !== 'Draft' && item.product) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock = Math.max(0, product.stock - quantity);
          await product.save();
        }
      }
    }

    // Extra charges
    const freight = Number(freightCharges) || 0;
    const packing = Number(packingCharges) || 0;
    const other = Number(otherCharges) || 0;

    const rawGrandTotal = taxableAmount + cgst + sgst + igst + freight + packing + other;
    const roundedGrandTotal = Math.round(rawGrandTotal);
    const roundOff = roundedGrandTotal - rawGrandTotal;

    const invoice = await Invoice.create({
      invoiceNo,
      challanNo,
      poNo,
      poDate,
      dispatchThrough,
      vehicleNo,
      transportName,
      lrNo,
      destination,
      paymentTerms,
      customerDetails,
      items: calculatedItems,
      taxableAmount: Math.round(taxableAmount * 100) / 100,
      cgst: Math.round(cgst * 100) / 100,
      sgst: Math.round(sgst * 100) / 100,
      igst: Math.round(igst * 100) / 100,
      freightCharges: freight,
      packingCharges: packing,
      otherCharges: other,
      roundOff: Math.round(roundOff * 100) / 100,
      grandTotal: roundedGrandTotal,
      paymentStatus: paymentStatus || 'Unpaid',
      status: status || 'Saved',
      additionalNotes,
      bankDetails
    });

    return res.status(201).json({ success: true, invoice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an invoice
// @route   PUT /api/invoices/:id
// @access  Private/Admin
export const updateInvoice = async (req, res) => {
  try {
    const { 
      challanNo, poNo, poDate, dispatchThrough, vehicleNo, transportName, 
      lrNo, destination, paymentTerms, customerDetails, items,
      freightCharges, packingCharges, otherCharges, paymentStatus, status, additionalNotes, bankDetails 
    } = req.body;

    let invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Recalculate
    let taxableAmount = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    
    const calculatedItems = [];
    const isLocal = customerDetails.stateCode === '24';

    for (const item of items) {
      const quantity = Number(item.quantity) || 1;
      const rate = Number(item.rate) || 0;
      const discountPercent = Number(item.discount) || 0;
      const taxRate = Number(item.taxRate) || 18;

      const discountAmount = (rate * discountPercent) / 100;
      const discountedRate = rate - discountAmount;
      const rowTaxable = discountedRate * quantity;

      const rowTax = (rowTaxable * taxRate) / 100;
      const rowTotal = rowTaxable + rowTax;

      taxableAmount += rowTaxable;
      
      if (isLocal) {
        cgst += rowTax / 2;
        sgst += rowTax / 2;
      } else {
        igst += rowTax;
      }

      calculatedItems.push({
        product: item.product,
        title: item.title,
        hsnCode: item.hsnCode || '8437',
        quantity,
        unit: item.unit || 'PCS',
        rate,
        discount: discountPercent,
        taxRate,
        taxAmount: rowTax,
        totalAmount: rowTotal,
        machineModel: item.machineModel,
        serialNo: item.serialNo,
        motorNo: item.motorNo,
        colour: item.colour,
        warrantyNo: item.warrantyNo,
        installationDate: item.installationDate
      });
    }

    const freight = Number(freightCharges) || 0;
    const packing = Number(packingCharges) || 0;
    const other = Number(otherCharges) || 0;

    const rawGrandTotal = taxableAmount + cgst + sgst + igst + freight + packing + other;
    const roundedGrandTotal = Math.round(rawGrandTotal);
    const roundOff = roundedGrandTotal - rawGrandTotal;

    const updateData = {
      challanNo,
      poNo,
      poDate,
      dispatchThrough,
      vehicleNo,
      transportName,
      lrNo,
      destination,
      paymentTerms,
      customerDetails,
      items: calculatedItems,
      taxableAmount: Math.round(taxableAmount * 100) / 100,
      cgst: Math.round(cgst * 100) / 100,
      sgst: Math.round(sgst * 100) / 100,
      igst: Math.round(igst * 100) / 100,
      freightCharges: freight,
      packingCharges: packing,
      otherCharges: other,
      roundOff: Math.round(roundOff * 100) / 100,
      grandTotal: roundedGrandTotal,
      paymentStatus: paymentStatus || 'Unpaid',
      status: status || 'Saved',
      additionalNotes,
      bankDetails
    };

    invoice = await Invoice.findByIdAndUpdate(req.params.id, updateData, { new: true });
    return res.json({ success: true, invoice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
// @access  Private/Admin
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    await Invoice.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Duplicate an invoice
// @route   POST /api/invoices/:id/duplicate
// @access  Private/Admin
export const duplicateInvoice = async (req, res) => {
  try {
    const original = await Invoice.findById(req.params.id);
    if (!original) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const count = await Invoice.countDocuments();
    const currentYear = new Date().getFullYear();
    const invoiceNo = `GST-${currentYear}-${String(count + 1).padStart(4, '0')}`;

    const duplicated = await Invoice.create({
      invoiceNo,
      challanNo: original.challanNo,
      poNo: original.poNo,
      poDate: original.poDate,
      dispatchThrough: original.dispatchThrough,
      vehicleNo: original.vehicleNo,
      transportName: original.transportName,
      lrNo: original.lrNo,
      destination: original.destination,
      paymentTerms: original.paymentTerms,
      customerDetails: original.customerDetails,
      items: original.items,
      taxableAmount: original.taxableAmount,
      cgst: original.cgst,
      sgst: original.sgst,
      igst: original.igst,
      freightCharges: original.freightCharges,
      packingCharges: original.packingCharges,
      otherCharges: original.otherCharges,
      roundOff: original.roundOff,
      grandTotal: original.grandTotal,
      paymentStatus: 'Unpaid',
      status: 'Draft', // save duplicates as draft by default
      additionalNotes: original.additionalNotes,
      bankDetails: original.bankDetails
    });

    return res.status(201).json({ success: true, invoice: duplicated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
