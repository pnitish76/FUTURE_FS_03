import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { FaPrint, FaArrowLeft, FaSpinner, FaFileInvoice } from 'react-icons/fa';

export default function InvoicePreview() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copyType, setCopyType] = useState('ORIGINAL FOR BUYER');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/invoices/${id}`);
        if (res.data.success) {
          setInvoice(res.data.invoice);
        }
      } catch (error) {
        showToast(error.response?.data?.message || 'Failed to fetch invoice details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  // Indian currency numbering format helper to convert numbers to words
  const convertNumberToWords = (num) => {
    const a = [
      '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
      'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
    ];
    const b = ['', '', 'Twenty ', 'Thirty ', 'Forty ', 'Fifty ', 'Sixty ', 'Seventy ', 'Eighty ', 'Ninety '];

    function numToWords(n, s) {
      let str = '';
      if (n > 19) {
        str += b[Math.floor(n / 10)] + a[n % 10];
      } else {
        str += a[n];
      }
      if (n) {
        str += s;
      }
      return str;
    }

    let amount = Math.floor(num);
    if (amount === 0) return 'Zero Rupees Only';

    let words = '';
    words += numToWords(Math.floor(amount / 10000000), 'Crore ');
    words += numToWords(Math.floor((amount / 100000) % 100), 'Lakh ');
    words += numToWords(Math.floor((amount / 1000) % 100), 'Thousand ');
    words += numToWords(Math.floor((amount / 100) % 10), 'Hundred ');

    if (amount > 100 && amount % 100) {
      words += 'and ';
    }
    words += numToWords(amount % 100, '');
    words += 'Rupees ';

    let paise = Math.round((num - amount) * 100);
    if (paise > 0) {
      words += 'and ' + numToWords(paise, '') + 'Paise ';
    }
    
    words += 'Only';
    return words;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 print:hidden">
        <FaSpinner className="animate-spin text-3xl text-brand-red" />
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Generating print sheet...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-24 print:hidden">
        <FaFileInvoice className="text-5xl text-slate-350 mx-auto mb-4" />
        <h3 className="font-heading font-bold text-sm text-slate-700 uppercase">Invoice Not Found</h3>
        <Link to="/admin/dashboard/invoices" className="text-xs text-brand-red hover:underline mt-2 inline-block font-bold">
          Return to Billing Book
        </Link>
      </div>
    );
  }

  const isLocal = invoice.customerDetails?.stateCode === '24';
  const totalTax = invoice.cgst + invoice.sgst + invoice.igst;
  const extraCharges = invoice.freightCharges + invoice.packingCharges + invoice.otherCharges;
  
  // Format dates
  const formattedInvoiceDate = new Date(invoice.invoiceDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  const formattedPoDate = invoice.poDate ? new Date(invoice.poDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : '';

  // Generate UPI payment URL for payment QR code
  const upiPayeeName = 'Jay Bhagwati Tools';
  const upiPayUrl = `upi://pay?pa=${invoice.bankDetails?.upiId || 'jaybhagwati@okaxis'}&pn=${encodeURIComponent(upiPayeeName)}&am=${invoice.grandTotal}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(upiPayUrl)}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in print:p-0 print:m-0 print:max-w-full print:bg-white">
      {/* 1. Print Toolbar Panel - Hidden on Print */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard/invoices"
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-brand-navy hover:bg-slate-50 transition-colors"
          >
            <FaArrowLeft className="text-sm" />
          </Link>
          <div>
            <h1 className="font-heading font-black text-brand-navy text-sm uppercase tracking-wide">
              Print Tax Invoice
            </h1>
            <p className="text-[11px] text-slate-500 font-semibold">
              Preview invoice and print A4 PDF sheet for client record.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={copyType}
            onChange={(e) => setCopyType(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          >
            <option value="ORIGINAL FOR BUYER">ORIGINAL FOR BUYER</option>
            <option value="DUPLICATE FOR TRANSPORTER">DUPLICATE FOR TRANSPORTER</option>
            <option value="TRIPLICATE FOR ASSESSEE">TRIPLICATE FOR ASSESSEE</option>
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-brand-red text-white hover:bg-red-700 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow shadow-red-200 cursor-pointer"
          >
            <FaPrint className="text-xs" /> Print Bill
          </button>
        </div>
      </div>

      {/* 2. Print sheet layout - A4 Style */}
      <div className="bg-white p-8 md:p-10 border border-slate-350 shadow-lg rounded-2xl print:shadow-none print:border-none print:p-0 print:rounded-none text-slate-900 font-sans leading-tight text-[11px]">
        {/* Style injection to enforce A4 margins and print details */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body {
              background-color: white !important;
              color: black !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            @page {
              size: A4;
              margin: 1.2cm 1cm 1.2cm 1cm;
            }
            header, footer, nav, aside {
              display: none !important;
            }
          }
          .double-border-bottom {
            border-bottom: 3px double #000;
          }
          .bill-table th, .bill-table td {
            border: 1px solid #000 !important;
            padding: 4px 6px;
          }
          .bill-table {
            border-collapse: collapse;
            width: 100%;
          }
          .bill-border {
            border: 1px solid #000;
          }
          .bill-border-r {
            border-right: 1px solid #000;
          }
          .bill-border-b {
            border-bottom: 1px solid #000;
          }
          .font-invoice-heading {
            font-family: 'Outfit', 'Inter', sans-serif;
          }
        `}} />

        <div className="bill-border flex flex-col">
          {/* TOP HEADER LABELS */}
          <div className="text-center font-bold border-b border-black py-1.5 uppercase text-xs tracking-wider font-invoice-heading bg-slate-50/50">
            Tax Invoice / GST Bill Book
          </div>

          {/* MAIN BRAND HEADER */}
          <div className="grid grid-cols-12 border-b border-black">
            {/* Seller Company Details */}
            <div className="col-span-8 p-4 bill-border-r space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black text-white rounded flex items-center justify-center font-black text-lg">
                  JB
                </div>
                <div>
                  <h1 className="text-base font-black uppercase font-invoice-heading tracking-wide">
                    Jay Bhagwati Tools & Machinery
                  </h1>
                  <p className="text-[9px] font-bold text-slate-655 tracking-wider uppercase italic">
                    Dealers in all kinds of Power Tools & Industrial Machinery
                  </p>
                </div>
              </div>
              
              <div className="text-[10px] text-slate-700 leading-normal pt-2">
                <p><strong>Address:</strong> Plot No. 12, G.I.D.C., Metoda, Rajkot - 360021, Gujarat, India</p>
                <p><strong>Contact:</strong> +91 98250 12345, +91 281 2345678 | <strong>Email:</strong> sales@jaybhagwatitools.com</p>
                <p><strong>Website:</strong> www.jaybhagwatitools.com</p>
              </div>
            </div>

            {/* Tax Info & Print Copy details */}
            <div className="col-span-4 p-4 flex flex-col justify-between text-right text-[10px]">
              <div>
                <span className="inline-block px-2.5 py-1 bg-black text-white font-bold text-[9px] tracking-wider uppercase rounded-sm mb-2">
                  {copyType}
                </span>
                <p className="mt-1"><strong>GSTIN:</strong> 24AAAFJ9028A1ZS</p>
                <p><strong>PAN No:</strong> AAAFJ9028A</p>
                <p><strong>State Code:</strong> 24 (Gujarat)</p>
              </div>
            </div>
          </div>

          {/* INVOICE AND LOGISTICS GRID */}
          <div className="grid grid-cols-12 border-b border-black text-[10px]">
            {/* Invoice metadata */}
            <div className="col-span-6 bill-border-r grid grid-cols-2">
              <div className="p-3 bill-border-r bill-border-b">
                <p className="text-[8px] text-slate-400 font-bold uppercase">Invoice Number</p>
                <p className="font-bold text-xs text-black">{invoice.invoiceNo}</p>
              </div>
              <div className="p-3 bill-border-b">
                <p className="text-[8px] text-slate-400 font-bold uppercase">Invoice Date</p>
                <p className="font-bold text-xs text-black">{formattedInvoiceDate}</p>
              </div>
              
              <div className="p-3 bill-border-r bill-border-b">
                <p className="text-[8px] text-slate-400 font-bold uppercase">Challan Number</p>
                <p className="font-bold text-slate-800">{invoice.challanNo || 'N/A'}</p>
              </div>
              <div className="p-3 bill-border-b">
                <p className="text-[8px] text-slate-400 font-bold uppercase">Terms of Payment</p>
                <p className="font-bold text-slate-800">{invoice.paymentTerms || 'COD / Credit'}</p>
              </div>

              <div className="p-3 bill-border-r">
                <p className="text-[8px] text-slate-400 font-bold uppercase">Buyer's PO Number</p>
                <p className="font-bold text-slate-800">{invoice.poNo || 'N/A'}</p>
              </div>
              <div className="p-3">
                <p className="text-[8px] text-slate-400 font-bold uppercase">PO Date</p>
                <p className="font-bold text-slate-800">{formattedPoDate || 'N/A'}</p>
              </div>
            </div>

            {/* Transport details */}
            <div className="col-span-6 grid grid-cols-2 p-1.5">
              <div className="p-1.5">
                <p className="text-[8px] text-slate-400 font-bold uppercase">Dispatch Through</p>
                <p className="font-bold text-slate-800">{invoice.dispatchThrough || 'N/A'}</p>
              </div>
              <div className="p-1.5">
                <p className="text-[8px] text-slate-400 font-bold uppercase">Vehicle Number</p>
                <p className="font-bold text-slate-850 font-mono">{invoice.vehicleNo || 'N/A'}</p>
              </div>
              
              <div className="p-1.5">
                <p className="text-[8px] text-slate-400 font-bold uppercase">Transport Company</p>
                <p className="font-bold text-slate-800">{invoice.transportName || 'N/A'}</p>
              </div>
              <div className="p-1.5">
                <p className="text-[8px] text-slate-400 font-bold uppercase">LR / Consignment No.</p>
                <p className="font-bold text-slate-800">{invoice.lrNo || 'N/A'}</p>
              </div>

              <div className="p-1.5 col-span-2 border-t border-slate-100">
                <p className="text-[8px] text-slate-400 font-bold uppercase">Destination Place</p>
                <p className="font-bold text-slate-800">{invoice.destination || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* CUSTOMER BILLING AND SHIPPING DETAILS */}
          <div className="grid grid-cols-12 border-b border-black text-[10px]">
            {/* Billing details */}
            <div className="col-span-6 p-4 bill-border-r space-y-1">
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Details of Receiver (Billed To):</p>
              <h3 className="font-bold text-xs text-black uppercase">{invoice.customerDetails?.firmName}</h3>
              <p className="font-bold text-slate-650">Attn: {invoice.customerDetails?.customerName}</p>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{invoice.customerDetails?.billingAddress}</p>
              <div className="pt-2 text-[9px] space-y-0.5">
                <p><strong>Phone:</strong> {invoice.customerDetails?.phone} | <strong>Email:</strong> {invoice.customerDetails?.email || 'N/A'}</p>
                <p><strong>GSTIN:</strong> <span className="font-mono font-bold text-black">{invoice.customerDetails?.gstin || 'UNREGISTERED'}</span></p>
                <p><strong>State Code:</strong> {invoice.customerDetails?.stateCode} ({invoice.customerDetails?.state})</p>
              </div>
            </div>

            {/* Shipping details */}
            <div className="col-span-6 p-4 space-y-1">
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Details of Consignee (Shipped To):</p>
              {invoice.customerDetails?.shippingAddress ? (
                <>
                  <h3 className="font-bold text-xs text-black uppercase">{invoice.customerDetails?.firmName}</h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{invoice.customerDetails?.shippingAddress}</p>
                  <p className="pt-1.5"><strong>State:</strong> {invoice.customerDetails?.state} (Code: {invoice.customerDetails?.stateCode})</p>
                </>
              ) : (
                <div className="text-slate-400 italic py-6 text-center text-[10px]">
                  Same as Billing Details listed on the left
                </div>
              )}
            </div>
          </div>

          {/* PRODUCT BREAKDOWN TABLE */}
          <table className="bill-table text-[9.5px]">
            <thead>
              <tr className="bg-slate-50/50 text-center font-bold">
                <th style={{ width: '4%' }}>Sr.</th>
                <th style={{ width: '42%' }}>Description of Goods & Machinery Specs</th>
                <th style={{ width: '10%' }}>HSN/SAC</th>
                <th style={{ width: '7%' }}>Qty</th>
                <th style={{ width: '6%' }}>Unit</th>
                <th style={{ width: '9%' }}>Rate (₹)</th>
                <th style={{ width: '6%' }}>Disc %</th>
                <th style={{ width: '6%' }}>GST %</th>
                <th style={{ width: '10%' }}>Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, idx) => (
                <tr key={idx} className="align-top">
                  <td className="text-center">{idx + 1}</td>
                  <td>
                    <div className="font-bold text-black text-[10px]">{item.title}</div>
                    
                    {/* Machinery details inline block */}
                    {(item.machineModel || item.serialNo || item.motorNo || item.colour || item.warrantyNo) && (
                      <div className="mt-1 text-[8.5px] leading-relaxed text-slate-650 grid grid-cols-2 gap-x-2 bg-slate-50 p-1.5 rounded border border-slate-100">
                        {item.machineModel && <span><strong>Model:</strong> {item.machineModel}</span>}
                        {item.serialNo && <span><strong>Serial No:</strong> {item.serialNo}</span>}
                        {item.motorNo && <span><strong>Motor No:</strong> {item.motorNo}</span>}
                        {item.colour && <span><strong>Color:</strong> {item.colour}</span>}
                        {item.warrantyNo && <span><strong>Warranty Card:</strong> {item.warrantyNo}</span>}
                        {item.installationDate && (
                          <span>
                            <strong>Installed:</strong>{' '}
                            {new Date(item.installationDate).toLocaleDateString('en-IN')}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="text-center font-mono">{item.hsnCode}</td>
                  <td className="text-center font-mono font-bold">{item.quantity}</td>
                  <td className="text-center">{item.unit || 'PCS'}</td>
                  <td className="text-right font-mono">
                    {item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-center font-mono">
                    {item.discount ? `${item.discount}%` : '-'}
                  </td>
                  <td className="text-center font-mono">
                    {item.taxRate}%
                  </td>
                  <td className="text-right font-mono font-bold">
                    {item.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}

              {/* Blank spacer rows to ensure standard height and feel of bill books */}
              {Array.from({ length: Math.max(0, 5 - (invoice.items?.length || 0)) }).map((_, spacerIdx) => (
                <tr key={`spacer-${spacerIdx}`} className="h-8 print:h-6">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}

              {/* Intermediate sub-total row */}
              <tr className="font-bold bg-slate-50/20">
                <td colSpan="3" className="text-right uppercase tracking-wider text-[8px]">Total Base Quantity / Taxable sum</td>
                <td className="text-center font-mono">
                  {invoice.items?.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                </td>
                <td></td>
                <td colSpan="3" className="text-right font-bold text-[9px] uppercase">Taxable Value:</td>
                <td className="text-right font-mono">
                  {invoice.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>

              {/* GST Splits */}
              {isLocal ? (
                <>
                  <tr>
                    <td colSpan="8" className="text-right font-bold text-[9px] uppercase">Central Tax (CGST @ {invoice.items?.[0]?.taxRate / 2 || 9}%)</td>
                    <td className="text-right font-mono font-bold">
                      {invoice.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="8" className="text-right font-bold text-[9px] uppercase">State Tax (SGST @ {invoice.items?.[0]?.taxRate / 2 || 9}%)</td>
                    <td className="text-right font-mono font-bold">
                      {invoice.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan="8" className="text-right font-bold text-[9px] uppercase text-blue-800">Integrated Tax (IGST @ {invoice.items?.[0]?.taxRate || 18}%)</td>
                  <td className="text-right font-mono font-bold text-blue-800">
                    {invoice.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )}

              {/* Extra Logistic Additions */}
              {extraCharges > 0 && (
                <tr>
                  <td colSpan="8" className="text-right font-bold text-[9px] uppercase">Freight, Packing & Shipping Charges</td>
                  <td className="text-right font-mono">
                    {extraCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )}

              {/* Round-off Adjustment */}
              {invoice.roundOff !== 0 && (
                <tr>
                  <td colSpan="8" className="text-right text-[8px] uppercase">Round-off Adjustment</td>
                  <td className="text-right font-mono">
                    {invoice.roundOff >= 0 ? '+' : ''}{invoice.roundOff.toFixed(2)}
                  </td>
                </tr>
              )}

              {/* Grand Total */}
              <tr className="bg-black text-white font-bold text-xs uppercase tracking-wide">
                <td colSpan="8" className="text-right py-2">Grand Total (Rupees In Words):</td>
                <td className="text-right py-2 font-mono">
                  ₹{invoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>

          {/* NUMBER IN WORDS DESCRIPTION */}
          <div className="p-3 border-b border-black font-semibold text-[10px]">
            <strong>Total Amount in Words:</strong> Indian Rupees {convertNumberToWords(invoice.grandTotal)}
          </div>

          {/* BOTTOM SECTION: BANK DATA, DYNAMIC QR CODE, OFFICIAL TERMS, SIGNATURES */}
          <div className="grid grid-cols-12 text-[10px]">
            {/* Bank details & QR Code Payment */}
            <div className="col-span-5 bill-border-r p-3 space-y-3">
              <div className="space-y-1">
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">JB Bank Account Credentials:</p>
                <p><strong>Bank:</strong> {invoice.bankDetails?.bankName}</p>
                <p><strong>Account:</strong> {invoice.bankDetails?.accountNumber}</p>
                <p><strong>IFSC Code:</strong> {invoice.bankDetails?.ifscCode}</p>
                <p><strong>UPI Address:</strong> {invoice.bankDetails?.upiId}</p>
              </div>

              {/* QR Code */}
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200">
                <img src={qrCodeUrl} alt="UPI QR Code" className="w-16 h-16 bg-white p-1 border border-slate-300" />
                <div>
                  <p className="font-bold text-[9px] uppercase tracking-wide text-brand-navy">Scan with UPI App</p>
                  <p className="text-[8px] text-slate-450 leading-tight mt-0.5">Quickly settle this tax bill using GPay, PhonePe, or BHIM.</p>
                </div>
              </div>
            </div>

            {/* Standard terms */}
            <div className="col-span-4 bill-border-r p-3 space-y-1 bg-slate-50/20 text-[8.5px] leading-relaxed text-slate-650">
              <p className="font-bold uppercase text-slate-450 text-[7.5px] tracking-wider mb-1">Standard Terms & Conditions:</p>
              <p>1. Goods once sold will not be taken back or exchanged.</p>
              <p>2. Subject to Rajkot (Gujarat) jurisdiction only.</p>
              <p>3. Standard machinery manufacturer warranty is applicable.</p>
              <p>4. Interest @ 18% p.a. will be charged for delayed payments after 30 days.</p>
              {invoice.additionalNotes && (
                <div className="mt-2 pt-1 border-t border-slate-200 text-slate-700">
                  <strong>Notes:</strong> {invoice.additionalNotes}
                </div>
              )}
            </div>

            {/* Signature Area */}
            <div className="col-span-3 flex flex-col justify-between p-3 text-center">
              <p className="text-[7.5px] font-bold uppercase tracking-wider text-slate-400">For Jay Bhagwati Tools</p>
              <div className="h-12 border-b border-dashed border-slate-300"></div>
              <p className="font-bold text-[9px] uppercase text-black pt-1">Authorized Signatory</p>
            </div>
          </div>
        </div>

        {/* Triple Copy Declarations bottom bar */}
        <div className="flex justify-between items-center text-[8px] text-slate-400 uppercase tracking-widest pt-3 border-t border-slate-200 mt-4 print:mt-2">
          <span>Printed on {new Date().toLocaleString('en-IN')}</span>
          <span>System Generated Invoice</span>
          <span>E. & O.E.</span>
        </div>
      </div>
    </div>
  );
}
