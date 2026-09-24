import React, { useState } from 'react';
import { Check, ShieldCheck, Sparkles, CreditCard, Lock, Award, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessPay: () => void;
  userName?: string;
}

export const PaymentGateModal: React.FC<PaymentGateModalProps> = ({
  isOpen,
  onClose,
  onSuccessPay,
  userName = 'Ezeugo',
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'po'>('bank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [schoolOrg, setSchoolOrg] = useState('Apex Academy District');
  const [transferRef, setTransferRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaidSuccess(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        onSuccessPay();
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-bold text-slate-900">
              SynapseClass AI Premium Pass
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isPaidSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">$100 Payment Confirmed!</h3>
            <p className="text-xs text-slate-600">
              Welcome, {userName}! Your full-access class license and 100 automated AI grading power credits
              have been activated.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5 text-xs">
            {/* Price Badge */}
            <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 block">
                  All-Access Class License
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Full Instructor &amp; Student Suite
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  100 AI Rubric Evaluations &amp; Automated Progress Tracking
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900">$100</span>
                <span className="text-xs font-bold text-indigo-700 block">₦150,000</span>
                <span className="text-[10px] text-slate-500 block">one-time / term</span>
              </div>
            </div>

            {/* Inclusions */}
            <div className="space-y-2 pt-1">
              <span className="font-semibold text-slate-800 block">Included with your $100 Pass:</span>
              <ul className="space-y-1.5 text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Assignment Creation with Custom Attached Rubrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automated AI Rubric Auto-Grading with Justification &amp; Evidence Citing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time Student Progress Trajectory &amp; Early Warning Diagnostics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Student Pre-Flight Check with Formative Rubric Alignment Guidance</span>
                </li>
              </ul>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    paymentMethod === 'bank'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Moniepoint</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('po')}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    paymentMethod === 'po'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>School PO</span>
                </button>
              </div>

              {paymentMethod === 'bank' ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-semibold text-slate-900">Direct Bank Transfer</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">Moniepoint</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Bank Name:</span>
                      <span className="font-bold text-slate-900">Moniepoint Microfinance Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Account Number:</span>
                      <span className="font-bold text-indigo-700 select-all text-sm">574 771 9665</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Account Name:</span>
                      <span className="font-bold text-slate-900">God gift onyinyechi</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Transfer Reference / Sender Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                      placeholder="e.g. Ezeugo Transfer"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs focus:outline-none focus:border-indigo-500 font-sans"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    After transferring ₦150,000 ($100 equivalent) to the Moniepoint account above, click "Confirm Moniepoint Transfer &amp; Unlock".
                  </p>
                </div>
              ) : paymentMethod === 'card' ? (
                <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Security CVC
                      </label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-[11px] font-medium text-slate-600">
                    School / Institution Purchase Order Number
                  </label>
                  <input
                    type="text"
                    value={schoolOrg}
                    onChange={(e) => setSchoolOrg(e.target.value)}
                    placeholder="e.g. PO-84920-EDU"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-400">
                    Billed directly to your academic institution under education discount.
                  </p>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Processing Transfer...' : paymentMethod === 'bank' ? 'Confirm Moniepoint Transfer & Unlock' : 'Pay $100 & Unlock Immediate Access'}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>256-Bit Encrypted · 100% Satisfaction Educational Guarantee</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
