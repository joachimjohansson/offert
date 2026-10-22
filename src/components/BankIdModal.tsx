import React, { useState, useEffect } from 'react';
import { TradeProject } from '../types/offert';
import { calculateProjectTotals, formatKr } from '../utils/calc';
import confetti from 'canvas-confetti';

interface BankIdModalProps {
  project: TradeProject;
  isOpen: boolean;
  onClose: () => void;
  onSignComplete: () => void;
}

export const BankIdModal: React.FC<BankIdModalProps> = ({
  project,
  isOpen,
  onClose,
  onSignComplete,
}) => {
  const [step, setStep] = useState<'qr' | 'authenticating' | 'signing' | 'success'>('qr');
  const [countdown, setCountdown] = useState(30);

  const totals = calculateProjectTotals(project);

  useEffect(() => {
    if (!isOpen) {
      setStep('qr');
      setCountdown(30);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((c) => (c > 1 ? c - 1 : 30));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleSimulateSign = () => {
    setStep('authenticating');
    setTimeout(() => {
      setStep('signing');
      setTimeout(() => {
        setStep('success');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#002244', '#10b981', '#4d5c78', '#d5e3ff'],
        });
        onSignComplete();
      }, 1200);
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn">
        {/* Navy BankID Header */}
        <div className="bg-[#002244] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] text-white">fingerprint</span>
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white">BankID Signering</div>
              <div className="text-[11px] text-white/70">Säker elektronisk legitimering</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Stäng"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col items-center text-center">
          {step === 'qr' && (
            <>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d7e0f6] text-[#0a1c34] text-xs font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-[#4d5c78] animate-pulse"></span>
                <span>Offert {project.quoteNumber}</span>
              </div>

              <h3 className="font-display text-base font-bold text-slate-900 mb-1">
                Scanna med Mobilt BankID
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mb-4">
                Be beställaren öppna BankID-appen på sin mobil och rikta kameran mot QR-koden.
              </p>

              {/* Dynamic Animated QR Code Container */}
              <div className="relative p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner mb-3">
                <div className="w-48 h-48 bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Decorative QR code graphic using SVG */}
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-slate-900"
                    fill="currentColor"
                  >
                    {/* Corner Position Targets */}
                    <rect x="0" y="0" width="28" height="28" rx="4" />
                    <rect x="4" y="4" width="20" height="20" rx="2" fill="white" />
                    <rect x="8" y="8" width="12" height="12" rx="1" />

                    <rect x="72" y="0" width="28" height="28" rx="4" />
                    <rect x="76" y="4" width="20" height="20" rx="2" fill="white" />
                    <rect x="80" y="8" width="12" height="12" rx="1" />

                    <rect x="0" y="72" width="28" height="28" rx="4" />
                    <rect x="4" y="76" width="20" height="20" rx="2" fill="white" />
                    <rect x="8" y="80" width="12" height="12" rx="1" />

                    {/* Matrix grid cells */}
                    <rect x="36" y="8" width="8" height="8" />
                    <rect x="52" y="16" width="8" height="8" />
                    <rect x="36" y="28" width="8" height="8" />
                    <rect x="16" y="36" width="8" height="8" />
                    <rect x="48" y="40" width="12" height="12" rx="2" fill="#002244" />
                    <rect x="28" y="52" width="8" height="8" />
                    <rect x="40" y="60" width="8" height="8" />
                    <rect x="68" y="44" width="8" height="8" />
                    <rect x="76" y="60" width="8" height="8" />
                    <rect x="60" y="72" width="8" height="8" />
                    <rect x="80" y="84" width="8" height="8" />
                    <rect x="36" y="84" width="8" height="8" />
                    <rect x="52" y="84" width="8" height="8" />
                  </svg>

                  {/* Scanning beam animation */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-bounce opacity-80 pointer-events-none"></div>
                </div>

                <div className="mt-2 text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  <span>Session uppdateras om {countdown}s</span>
                </div>
              </div>

              {/* Order total info */}
              <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 text-left text-xs mb-4">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Beställare:</span>
                  <span>{project.clientName}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 mt-1">
                  <span>Totalt att signera:</span>
                  <span className="text-[#002244] font-mono-numbers text-sm">
                    {formatKr(totals.customerPayable)}
                  </span>
                </div>
              </div>

              {/* Simulation Action Buttons */}
              <button
                type="button"
                onClick={handleSimulateSign}
                className="w-full py-3.5 bg-[#002244] hover:bg-[#001730] text-white rounded-xl font-display font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">fingerprint</span>
                <span>Simulera godkännande i BankID</span>
              </button>
            </>
          )}

          {step === 'authenticating' && (
            <div className="py-12 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#002244]/10 flex items-center justify-center text-[#002244] mb-4 animate-spin">
                <span className="material-symbols-outlined text-[36px]">sync</span>
              </div>
              <h4 className="font-display font-bold text-slate-900 text-base mb-1">
                BankID startat på kundens enhet
              </h4>
              <p className="text-xs text-slate-500">
                Identifierar {project.clientName} ({project.clientSsn})...
              </p>
            </div>
          )}

          {step === 'signing' && (
            <div className="py-12 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#002244] mb-4 animate-pulse">
                <span className="material-symbols-outlined text-[36px]">security</span>
              </div>
              <h4 className="font-display font-bold text-slate-900 text-base mb-1">
                Godkänner entreprenadavtal
              </h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Kunden signerar med säkerhetskod/Face ID. eIDAS-tidsstämpel appliceras.
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm animate-scaleIn">
                <span className="material-symbols-outlined text-[36px]">check_circle</span>
              </div>
              <h4 className="font-display font-bold text-slate-900 text-lg mb-1">
                Avtal undertecknat med BankID!
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mb-4">
                Bindande avtal upprättat för <strong>{project.title}</strong> med belopp{' '}
                <strong>{formatKr(totals.customerPayable)}</strong>.
              </p>

              <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-700 text-left space-y-1.5 mb-5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Signerat av:</span>
                  <span className="font-semibold">{project.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tidstämpel:</span>
                  <span className="font-mono-numbers">{new Date().toLocaleString('sv-SE')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fortnox order:</span>
                  <span className="text-emerald-700 font-bold">✓ Skapad &amp; synkad</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Visma eEkonomi:</span>
                  <span className="text-emerald-700 font-bold">✓ PDF arkiverad</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-[#4d5c78] hover:bg-[#3b537e] text-white rounded-xl font-display font-bold text-sm shadow-md transition-all"
              >
                Klar – Visa signerad offert
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
