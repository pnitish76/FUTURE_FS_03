import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaPrint, FaArrowLeft, FaFileInvoice } from 'react-icons/fa';
import api from '../utils/api';

// Indian Number to Words Converter Utility
const numberToWords = (num) => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const translate = (n) => {
    let w = '';
    if (n >= 100) {
      w += a[Math.floor(n / 100)] + 'Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      w += b[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      w += a[n] + ' ';
    }
    return w;
  };

  const convert = (n) => {
    if (n === 0) return 'Zero';
    let words = '';
    
    // Crore
    if (n >= 10000000) {
      words += translate(Math.floor(n / 10000000)) + 'Crore ';
      n %= 10000000;
    }
    // Lakh
    if (n >= 100000) {
      words += translate(Math.floor(n / 100000)) + 'Lakh ';
      n %= 100000;
    }
    // Thousand
    if (n >= 1000) {
      words += translate(Math.floor(n / 1000)) + 'Thousand ';
      n %= 1000;
    }
    // Remainder
    if (n > 0) {
      words += translate(n);
    }
    return words.trim();
  };

  return convert(Math.floor(num)) + ' Only';
};

// Category HSN Code mapping
const getHsnCode = (category) => {
  switch (category) {
    case 'Automatic Flour Mills': return '8437';
    case 'Power Tools': return '8467';
    case 'Hand Tools': return '8205';
    case 'Industrial Machinery': return '8458';
    case 'Welding Equipment': return '8515';
    case 'Safety Equipment': return '6506';
    case 'Hardware Accessories': return '7318';
    default: return '8437';
  }
};

export default function Invoice() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        if (res.data.success) {
          setOrder(res.data.order);
        } else {
          setError('Could not retrieve invoice details.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading invoice.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Loading Invoice details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 pt-36 pb-20 px-4">
        <div className="max-w-md mx-auto bg-white border border-slate-200 shadow-lg rounded-2xl p-8 text-center space-y-5">
          <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto shadow-inner">
            <FaFileInvoice className="text-2xl" />
          </div>
          <h2 className="font-heading font-black text-lg text-brand-navy">Invoice Not Found</h2>
          <p className="text-slate-500 text-xs leading-relaxed">{error || 'The requested order invoice details could not be loaded.'}</p>
          <button 
            onClick={() => navigate('/products')}
            className="px-6 py-2.5 bg-brand-navy hover:bg-brand-red text-white text-xs font-heading font-bold rounded-xl uppercase tracking-wider shadow cursor-pointer transition-colors inline-block"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  const dateObj = new Date(order.createdAt);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  // Subtotal calculations: back out 18% GST (9% CGST + 9% SGST)
  let subTotal = 0;
  const itemsWithRates = order.items.map((item) => {
    const itemRate = Math.round((item.price / 1.18) * 100) / 100;
    const itemAmount = Math.round((itemRate * item.quantity) * 100) / 100;
    subTotal += itemAmount;

    const [rateRs, ratePs] = itemRate.toFixed(2).split('.');
    const [amountRs, amountPs] = itemAmount.toFixed(2).split('.');

    return {
      ...item,
      rateRs,
      ratePs,
      amountRs,
      amountPs
    };
  });

  const cgst = Math.round((subTotal * 0.09) * 100) / 100;
  const sgst = Math.round((subTotal * 0.09) * 100) / 100;
  const totalRaw = subTotal + cgst + sgst;
  const totalPay = order.total;
  const roundOff = Math.round((totalPay - totalRaw) * 100) / 100;
  
  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // Render empty rows to maintain fixed height (matches printed invoice design)
  const emptyRowsCount = Math.max(0, 8 - order.items.length);
  const emptyRows = [...Array(emptyRowsCount)].map((_, i) => (
    <tr key={`empty-${i}`} className="h-10 align-top text-center border-b border-black">
      <td className="border-r border-black p-1">&nbsp;</td>
      <td className="border-r border-black p-1">&nbsp;</td>
      <td className="border-r border-black p-1">&nbsp;</td>
      <td className="border-r border-black p-1">&nbsp;</td>
      <td className="border-r border-black p-1">&nbsp;</td>
      <td className="border-r border-black p-1">&nbsp;</td>
      <td className="border-r border-black p-1">&nbsp;</td>
      <td className="border-r border-black p-1">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
  ));

  return (
    <div className="min-h-screen bg-brand-gray pt-32 pb-20 px-4 md:px-8">
      {/* Print custom styling overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .invoice-box {
            border: 2px solid black !important;
            border-radius: 0 !important;
          }
        }
      `}} />

      <div className="max-w-4xl mx-auto print-container">
        {/* Breadcrumb / Top Actions Row (Hidden on print) */}
        <div className="no-print mb-8 flex justify-between items-center">
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-heading font-bold text-brand-navy hover:text-brand-red uppercase tracking-wider transition-colors"
          >
            <FaArrowLeft /> Store Catalogue
          </Link>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-brand-navy text-white text-xs font-heading font-bold rounded-xl uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <FaPrint /> Print Invoice
          </button>
        </div>

        {/* Invoice Container Grid */}
        <div className="invoice-box bg-white border-2 border-black overflow-hidden print-shadow-none text-black font-sans leading-tight">
          
          {/* Main Title Banner */}
          <div className="text-center border-b-2 border-black py-2.5 bg-slate-100/80">
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider underline decoration-1">JAY BHAGWATI TOOLS & MACHINERY</h1>
            <p className="text-[10px] md:text-xs font-bold mt-1">Shop Number 2, Street Number 7, Station Road, opposite Bal Adalat</p>
            <p className="text-[10px] md:text-xs font-bold">Bhakti Nagar, Rajkot, Gujarat 360002</p>
          </div>

          {/* Tax Invoice / Copy indicator */}
          <div className="grid grid-cols-2 border-b-2 border-black text-center font-bold text-xs">
            <div className="py-1 border-r-2 border-black uppercase tracking-wider">TAX INVOICE</div>
            <div className="py-1 uppercase tracking-wider">ORIGINAL</div>
          </div>

          {/* Seller / Buyer details block */}
          <div className="grid grid-cols-2 border-b-2 border-black text-[11px] leading-tight">
            {/* Seller info */}
            <div className="p-2 border-r-2 border-black space-y-1">
              <p><strong>Name:-</strong> JAY BHAGWATI TOOLS AND MACHINERY</p>
              <p><strong>Address:-</strong> Shop Number 2, Street Number 7</p>
              <p className="pl-14">Station Road, opposite Bal Adalat,</p>
              <p className="pl-14">Bhakti Nagar, Rajkot, Gujarat 360002</p>
            </div>
            
            {/* Buyer info */}
            <div className="p-2 space-y-1">
              <p><strong>Address:-</strong> {order.shippingAddress}</p>
            </div>
          </div>

          {/* Contact and codes block */}
          <div className="grid grid-cols-2 border-b border-black text-[11px]">
            <div className="p-1.5 border-r-2 border-black">
              <strong>GST TIN NO. 24AAIFJ8080B1ZJ &nbsp;&nbsp;&nbsp;&nbsp; CODE :- GJ-24</strong>
            </div>
            <div className="p-1.5">
              <strong>MOBILE.</strong> +91 {order.phone}
            </div>
          </div>

          {/* Bill Book block */}
          <div className="grid grid-cols-2 border-b border-black text-[11px]">
            <div className="p-1.5 border-r-2 border-black">
              <strong>Bill Book No. :-</strong> 01
            </div>
            <div className="p-1.5">
              <strong>GST TIN NO.</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>CODE:- 24</strong>
            </div>
          </div>

          {/* Invoice No block */}
          <div className="grid grid-cols-2 border-b border-black text-[11px]">
            <div className="p-1.5 border-r-2 border-black">
              <strong>Invoice No. :-</strong> C-{order._id.substring(order._id.length - 4).toUpperCase()}
            </div>
            <div className="p-1.5">
              <strong>P.O. Date :-</strong>
            </div>
          </div>

          {/* Invoice Date block */}
          <div className="grid grid-cols-2 border-b-2 border-black text-[11px]">
            <div className="p-1.5 border-r-2 border-black">
              <strong>Invoice Date :-</strong> {formattedDate}
            </div>
            <div className="p-1.5">
              &nbsp;
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse border-b-2 border-black text-[11px]">
            <thead>
              <tr className="text-center font-bold border-b border-black bg-slate-50/50">
                <th className="border-r border-black p-1 w-12" rowSpan="2">Sr. No.</th>
                <th className="border-r border-black p-1 flex-grow" rowSpan="2">Particulars</th>
                <th className="border-r border-black p-1 w-20" rowSpan="2">HSN CODE</th>
                <th className="border-r border-black p-1 w-12" rowSpan="2">Qty.</th>
                <th className="border-r border-black p-1 w-28" colSpan="2">Rate</th>
                <th className="border-r border-black p-1 w-12" rowSpan="2">Per</th>
                <th className="p-1 w-28" colSpan="2">Amount</th>
              </tr>
              <tr className="text-center font-bold border-b-2 border-black bg-slate-50/50 text-[10px]">
                <th className="border-r border-black p-0.5 w-20">Rs.</th>
                <th className="border-r border-black p-0.5 w-8">Ps.</th>
                <th className="border-r border-black p-0.5 w-20">Rs.</th>
                <th className="p-0.5 w-8">Ps.</th>
              </tr>
            </thead>
            <tbody>
              {itemsWithRates.map((item, idx) => {
                const hsn = getHsnCode(item.product?.category);

                return (
                  <tr key={item._id || idx} className="align-top border-b border-black text-center h-14">
                    <td className="border-r border-black p-1.5 font-mono">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="border-r border-black p-1.5 text-left leading-tight">
                      <div className="font-bold">{item.product?.title.toUpperCase()}</div>
                      {item.product?.category === 'Automatic Flour Mills' ? (
                        <div className="text-[9px] text-slate-700 mt-1 space-y-0.5 font-semibold">
                          <p>Ele Motor 5 YEARS guarantee</p>
                          <p>SR,NO OF FLOUR MILL: F3652FF0{order._id.substring(order._id.length - 4).toUpperCase()}</p>
                          <p>SR,NOMOTOR: M830 210 2FF 144{order._id.substring(order._id.length - 2).toUpperCase()}</p>
                          <p>WARRANTY CARD NO: 2FF{order._id.substring(0, 4).toUpperCase()}</p>
                        </div>
                      ) : (
                        <div className="text-[9px] text-slate-700 mt-1 space-y-0.5 font-semibold">
                          <p>Heavy Duty Industrial Grade</p>
                          <p>WARRANTY COVERED: 1 YEAR</p>
                        </div>
                      )}
                    </td>
                    <td className="border-r border-black p-1.5 font-mono">{hsn}</td>
                    <td className="border-r border-black p-1.5 font-mono">{String(item.quantity).padStart(2, '0')}</td>
                    <td className="border-r border-black p-1.5 text-right font-mono pr-2">{item.rateRs}</td>
                    <td className="border-r border-black p-1.5 font-mono text-[9px] text-slate-500">{item.ratePs}</td>
                    <td className="border-r border-black p-1.5 font-mono">01</td>
                    <td className="border-r border-black p-1.5 text-right font-mono pr-2">{item.amountRs}</td>
                    <td className="p-1.5 font-mono text-[9px] text-slate-500">{item.amountPs}</td>
                  </tr>
                );
              })}
              {/* Empty rows to match paper bill book format */}
              {emptyRows}
            </tbody>
          </table>

          {/* Subtotal & Bank info bottom details */}
          <div className="grid grid-cols-12 border-b-2 border-black text-[11px]">
            {/* Left bottom details (Bank and transport) */}
            <div className="col-span-7 border-r-2 border-black p-2 space-y-2">
              <div className="space-y-0.5">
                <p><strong>Cases :-</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {String(totalQty).padStart(2, '0')}</p>
                <p><strong>Transport :-</strong> &nbsp;&nbsp;&nbsp;&nbsp; {order.deliveryMethod === 'Store Pickup' ? 'CUSTOMER PICKUP' : 'BY RIXA'}</p>
                <p><strong>Transport Mode :-</strong> By Road</p>
              </div>
              
              <div className="pt-2 border-t border-dotted border-black/50 space-y-0.5">
                <p className="font-bold">BANK DETAILS:-</p>
                <p><strong>Bank Name :-</strong> BANK OF BARODA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Branch :-</strong> Canal Road</p>
                <p><strong>A/c. No.</strong> 70920200000673 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>RTGS CODE :</strong> BARB0DBCAN</p>
              </div>
            </div>

            {/* Right bottom details (Tax calculations) */}
            <div className="col-span-5 flex flex-col justify-between">
              <table className="w-full text-[11px] border-collapse">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black">Pack. & Forwarding</td>
                    <td className="p-1 text-right font-mono">0.00</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black font-semibold">Sub Total</td>
                    <td className="p-1 text-right font-mono">{subTotal.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black">SGST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 9.0%</td>
                    <td className="p-1 text-right font-mono">{sgst.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black">CGST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 9.0%</td>
                    <td className="p-1 text-right font-mono">{cgst.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black">Round off</td>
                    <td className="p-1 text-right font-mono">{roundOff.toFixed(2)}</td>
                  </tr>
                  <tr className="font-bold text-xs bg-slate-100">
                    <td className="p-1.5 border-r border-black">Total Rs.</td>
                    <td className="p-1.5 text-right font-mono">₹{totalPay.toLocaleString('en-IN')}.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Amount in words */}
          <div className="p-2 border-b-2 border-black text-[11px]">
            <p><strong>Total Rs. In Words:-</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="font-bold uppercase">{numberToWords(totalPay)}</span></p>
          </div>

          {/* Terms and Signatures */}
          <div className="grid grid-cols-12 text-[9px] leading-tight">
            {/* Terms and conditions */}
            <div className="col-span-8 p-2 border-r border-black space-y-0.5">
              <p className="font-bold underline text-[10px]">Terms & Conditions :-</p>
              <p>(01) Subject to RAJKOT Jurisdiction. (2) Goods once delivered will not be taken back.</p>
              <p>(3) We do not accept responsibility for loss, Shortage Damage or Delay once goods left our premises.</p>
              <p>(4) Transport, Freight Insurance and Octroi on Purchasers A/c.</p>
              <p>(5) Interest @ 18 % Will be charged if the payment not received within.</p>
              <p className="font-bold italic uppercase tracking-wider text-slate-700">transport damage no guarantee No warranty</p>
            </div>

            {/* Signature Block */}
            <div className="col-span-4 flex flex-col justify-between p-2 text-right">
              <p className="font-bold text-[8px] uppercase tracking-wide">For, Jay Bhagwati Tools & Machinery</p>
              <p className="font-bold pt-8 pr-2">Partner</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
