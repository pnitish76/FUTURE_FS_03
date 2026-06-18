/**
 * Mock Razorpay Standard Checkout Overlay for local testing.
 * Simulates the exact look, feel, and API of the Razorpay SDK
 * when a placeholder key is used.
 */
export class MockRazorpay {
  constructor(options) {
    this.options = options;
    this.modalEl = null;
  }

  open() {
    // Prevent multiple modals
    if (document.getElementById('mock-razorpay-overlay')) return;

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'mock-razorpay-overlay';
    overlay.className = 'fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs';
    
    // Format amount
    const amountInRupees = (this.options.amount / 100).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    });

    overlay.innerHTML = `
      <div class="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <!-- Razorpay Header -->
        <div class="bg-[#2F347E] p-4 text-white flex justify-between items-start relative">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow">
              <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
            </div>
            <div>
              <h3 class="font-bold text-sm tracking-wide">${this.options.name || 'Merchant'}</h3>
              <p class="text-[10px] text-slate-300 font-medium">${this.options.description || 'Order Payment'}</p>
            </div>
          </div>
          <button id="mock-rzp-close" class="p-1 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer text-xl absolute top-3 right-3">&times;</button>
        </div>

        <!-- Price summary strip -->
        <div class="bg-slate-950/40 border-b border-slate-800 px-4 py-2.5 flex justify-between items-center text-xs font-semibold">
          <span class="text-slate-400 uppercase tracking-wider text-[9px]">Amount Payable</span>
          <span class="text-white font-extrabold text-sm">${amountInRupees}</span>
        </div>

        <!-- Main Body -->
        <div class="p-4" id="mock-rzp-body">
          <p class="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Razorpay Test Mode Simulator
          </p>
          
          <div class="space-y-2.5">
            <!-- Card Option -->
            <button id="mock-pay-card" class="w-full p-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer">
              <div class="flex items-center gap-3">
                <span class="text-lg text-slate-400">💳</span>
                <div>
                  <h4 class="text-xs font-bold text-white">Card</h4>
                  <p class="text-[9px] text-slate-400">Visa, Mastercard, RuPay, Maestro</p>
                </div>
              </div>
              <span class="text-[10px] text-slate-500 font-bold uppercase">&rarr;</span>
            </button>

            <!-- UPI Option -->
            <button id="mock-pay-upi" class="w-full p-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer">
              <div class="flex items-center gap-3">
                <span class="text-lg text-slate-400">📱</span>
                <div>
                  <h4 class="text-xs font-bold text-white">UPI / QR</h4>
                  <p class="text-[9px] text-slate-400">Google Pay, PhonePe, Paytm, BHIM</p>
                </div>
              </div>
              <span class="text-[10px] text-slate-500 font-bold uppercase">&rarr;</span>
            </button>

            <!-- Netbanking Option -->
            <button id="mock-pay-nb" class="w-full p-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer">
              <div class="flex items-center gap-3">
                <span class="text-lg text-slate-400">🏦</span>
                <div>
                  <h4 class="text-xs font-bold text-white">Netbanking</h4>
                  <p class="text-[9px] text-slate-400">SBI, HDFC, ICICI, Axis & more</p>
                </div>
              </div>
              <span class="text-[10px] text-slate-500 font-bold uppercase">&rarr;</span>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-slate-950 p-3 text-center border-t border-slate-850/80">
          <p class="text-[8px] tracking-wider text-slate-600 uppercase font-bold">
            Secured by Razorpay Mock Mode &bull; Safe Test Environment
          </p>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.modalEl = overlay;

    // Attach event listeners
    document.getElementById('mock-rzp-close').addEventListener('click', () => this.dismiss());
    document.getElementById('mock-pay-card').addEventListener('click', () => this.showCardScreen());
    document.getElementById('mock-pay-upi').addEventListener('click', () => this.showUPIScreen());
    document.getElementById('mock-pay-nb').addEventListener('click', () => this.showNetbankingScreen());
  }

  dismiss() {
    if (this.modalEl) {
      this.modalEl.remove();
      this.modalEl = null;
    }
    if (this.options.modal && typeof this.options.modal.ondismiss === 'function') {
      this.options.modal.ondismiss();
    }
  }

  showLoader(statusText) {
    const body = document.getElementById('mock-rzp-body');
    body.innerHTML = `
      <div class="flex flex-col items-center justify-center py-10 text-center gap-4">
        <div class="w-10 h-10 border-4 border-[#2F347E]/30 border-t-[#2F347E] rounded-full animate-spin"></div>
        <div>
          <h4 class="text-xs font-bold text-white">${statusText}</h4>
          <p class="text-[9px] text-slate-400 mt-1">Please do not close this window or click back.</p>
        </div>
      </div>
    `;
  }

  processPayment(methodDescription) {
    this.showLoader(`Authenticating via ${methodDescription}...`);
    
    setTimeout(() => {
      this.showLoader('Confirming transaction with banking gateway...');
      
      setTimeout(() => {
        // Generate mock razorpay_payment_id
        const mockPaymentId = 'pay_' + Math.random().toString(36).substring(2, 16).toUpperCase();
        
        // Clean up modal
        if (this.modalEl) {
          this.modalEl.remove();
          this.modalEl = null;
        }

        // Trigger success handler callback
        if (typeof this.options.handler === 'function') {
          this.options.handler({
            razorpay_payment_id: mockPaymentId
          });
        }
      }, 1500);
    }, 1500);
  }

  showCardScreen() {
    const body = document.getElementById('mock-rzp-body');
    body.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2">
          <button id="card-back" class="text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer">&larr; Back</button>
          <span class="text-xs font-bold text-white">Mock Card Payment</span>
        </div>
        
        <div class="space-y-3">
          <div>
            <label class="block text-[9px] uppercase tracking-wider text-slate-500 mb-1 font-bold">Card Number</label>
            <input type="text" placeholder="1111 2222 3333 4444" value="4111 1111 1111 1111" disabled class="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs font-semibold text-slate-300 outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-slate-500 mb-1 font-bold">Expiry Date</label>
              <input type="text" placeholder="MM/YY" value="12/30" disabled class="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs font-semibold text-slate-300 outline-none" />
            </div>
            <div>
              <label class="block text-[9px] uppercase tracking-wider text-slate-500 mb-1 font-bold">CVV</label>
              <input type="password" value="123" disabled class="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs font-semibold text-slate-300 outline-none" />
            </div>
          </div>
          <button id="card-pay-btn" class="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow cursor-pointer transition-colors mt-2">
            Simulate Success Payment
          </button>
        </div>
      </div>
    `;

    document.getElementById('card-back').addEventListener('click', () => this.resetBody());
    document.getElementById('card-pay-btn').addEventListener('click', () => this.processPayment('Card Gateway'));
  }

  showUPIScreen() {
    const body = document.getElementById('mock-rzp-body');
    body.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2">
          <button id="upi-back" class="text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer">&larr; Back</button>
          <span class="text-xs font-bold text-white">Mock UPI / QR</span>
        </div>
        
        <div class="space-y-3 text-center">
          <div class="w-32 h-32 bg-white rounded-xl p-2 mx-auto shadow flex items-center justify-center border border-slate-200">
            <!-- Simulated QR code -->
            <div class="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-2 rounded border border-slate-300 border-dashed">
              <span class="text-2xl">📱</span>
              <span class="text-[9px] font-bold text-slate-650 mt-1 uppercase">Scan QR Code</span>
              <span class="text-[7px] text-slate-500 mt-0.5">UPI ID: jaybhagwati@upi</span>
            </div>
          </div>
          <p class="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
            Scan using Google Pay, PhonePe, Paytm, or simulate success directly below.
          </p>
          <button id="upi-pay-btn" class="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow cursor-pointer transition-colors mt-2">
            Simulate Success Payment
          </button>
        </div>
      </div>
    `;

    document.getElementById('upi-back').addEventListener('click', () => this.resetBody());
    document.getElementById('upi-pay-btn').addEventListener('click', () => this.processPayment('UPI Mobile App'));
  }

  showNetbankingScreen() {
    const body = document.getElementById('mock-rzp-body');
    body.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2">
          <button id="nb-back" class="text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer">&larr; Back</button>
          <span class="text-xs font-bold text-white">Mock Netbanking</span>
        </div>
        
        <div class="grid grid-cols-2 gap-2">
          <button class="mock-bank-btn p-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-[10px] text-white font-bold cursor-pointer transition-colors">SBI</button>
          <button class="mock-bank-btn p-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-[10px] text-white font-bold cursor-pointer transition-colors">HDFC</button>
          <button class="mock-bank-btn p-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-[10px] text-white font-bold cursor-pointer transition-colors">ICICI</button>
          <button class="mock-bank-btn p-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-[10px] text-white font-bold cursor-pointer transition-colors">AXIS</button>
        </div>
        <p class="text-[10px] text-slate-400 text-center leading-relaxed">
          Select any popular bank listed above to proceed.
        </p>
      </div>
    `;

    document.getElementById('nb-back').addEventListener('click', () => this.resetBody());
    const btns = document.getElementsByClassName('mock-bank-btn');
    for (let btn of btns) {
      btn.addEventListener('click', (e) => this.processPayment(`${e.target.innerText} Netbanking`));
    }
  }

  resetBody() {
    const body = document.getElementById('mock-rzp-body');
    body.innerHTML = `
      <p class="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        Razorpay Test Mode Simulator
      </p>
      
      <div class="space-y-2.5">
        <!-- Card Option -->
        <button id="mock-pay-card" class="w-full p-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer">
          <div class="flex items-center gap-3">
            <span class="text-lg text-slate-400">💳</span>
            <div>
              <h4 class="text-xs font-bold text-white">Card</h4>
              <p class="text-[9px] text-slate-400">Visa, Mastercard, RuPay, Maestro</p>
            </div>
          </div>
          <span class="text-[10px] text-slate-500 font-bold uppercase">&rarr;</span>
        </button>

        <!-- UPI Option -->
        <button id="mock-pay-upi" class="w-full p-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer">
          <div class="flex items-center gap-3">
            <span class="text-lg text-slate-400">📱</span>
            <div>
              <h4 class="text-xs font-bold text-white">UPI / QR</h4>
              <p class="text-[9px] text-slate-400">Google Pay, PhonePe, Paytm, BHIM</p>
            </div>
          </div>
          <span class="text-[10px] text-slate-500 font-bold uppercase">&rarr;</span>
        </button>

        <!-- Netbanking Option -->
        <button id="mock-pay-nb" class="w-full p-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer">
          <div class="flex items-center gap-3">
            <span class="text-lg text-slate-400">🏦</span>
            <div>
              <h4 class="text-xs font-bold text-white">Netbanking</h4>
              <p class="text-[9px] text-slate-400">SBI, HDFC, ICICI, Axis & more</p>
            </div>
          </div>
          <span class="text-[10px] text-slate-500 font-bold uppercase">&rarr;</span>
        </button>
      </div>
    `;

    document.getElementById('mock-pay-card').addEventListener('click', () => this.showCardScreen());
    document.getElementById('mock-pay-upi').addEventListener('click', () => this.showUPIScreen());
    document.getElementById('mock-pay-nb').addEventListener('click', () => this.showNetbankingScreen());
  }
}
