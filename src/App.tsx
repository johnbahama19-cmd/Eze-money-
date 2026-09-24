import React, { useState, useEffect } from 'react';
import { OmniSpecsDashboard } from './components/OmniSpecsDashboard';
import { PaymentGateModal } from './components/PaymentGateModal';
import { ShieldCheck, Glasses, Sparkles, Zap, BookOpen, Calculator, Compass, Tv } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY_PAID = 'omnispecs_paid_unlocked_v1';

export default function App() {
  const [isPaidUnlocked, setIsPaidUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAID);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PAID, String(isPaidUnlocked));
    } catch {}
  }, [isPaidUnlocked]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
              <Glasses className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm tracking-tight">
                  OmniSpecs 2026
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20">
                  AI Matrix
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Ray-Ban Meta · Display Glasses · Port Harcourt Import Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isPaidUnlocked
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              {isPaidUnlocked ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>$100 Pass Active (Moniepoint Verified)</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unlock $100 Pass (₦150,000)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main OmniSpecs Dashboard */}
      <main className="flex-1">
        <OmniSpecsDashboard
          isPaidUnlocked={isPaidUnlocked}
          onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">OmniSpecs 2026</span>
            <span>·</span>
            <span>AI Eyeglasses Intelligence &amp; Port Harcourt Import Gateway</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Market Share: <strong className="text-white">Ray-Ban Meta (69%)</strong></span>
            <span>·</span>
            <span>Status: <strong className="text-emerald-400">Online &amp; Verified</strong></span>
          </div>
        </div>
      </footer>

      {/* Payment Gate Modal ($100 / ₦150,000 Moniepoint Checkout) */}
      <PaymentGateModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        userName="Port Harcourt Collector"
        onSuccessPay={() => {
          setIsPaidUnlocked(true);
          try {
            confetti({ particleCount: 80, spread: 80, origin: { y: 0.2 } });
          } catch {}
        }}
      />
    </div>
  );
}
