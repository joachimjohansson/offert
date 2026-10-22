import React, { useState } from 'react';
import { TradeProject } from '../types/offert';
import { calculateProjectTotals, formatKr } from '../utils/calc';

interface BankIdReviewViewProps {
  project: TradeProject;
  onOpenBankIdModal: () => void;
  onOpenPdfPreview: () => void;
  onUpdateProject: (updated: Partial<TradeProject>) => void;
}

export const BankIdReviewView: React.FC<BankIdReviewViewProps> = ({
  project,
  onOpenBankIdModal,
  onOpenPdfPreview,
  onUpdateProject,
}) => {
  const [signingMethod, setSigningMethod] = useState<'direct_qr' | 'remote_email_sms'>(
    'remote_email_sms'
  );
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const totals = calculateProjectTotals(project);
  const isAlreadySigned = project.status === 'signerad';

  const handleSendEmailOffer = () => {
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setShowToast(true);
      onUpdateProject({ status: 'skickad' });
      setTimeout(() => setShowToast(false), 5000);
    }, 900);
  };

  return (
    <div className="flex flex-col w-full pb-28 animate-fadeIn">
      {/* Top Security Banner */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
            {isAlreadySigned ? 'Offert Signerad' : 'Klar för digital signering'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e8e8ed] text-[#44474d] text-[11px] font-semibold">
          <span className="material-symbols-outlined text-[15px]">verified_user</span>
          <span>256-bit krypterad</span>
        </div>
      </div>

      {/* Offertförhandsvisning Card */}
      <div className="px-4 mb-3.5">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-[#e8e8ed] overflow-hidden">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#eeedf3] flex items-center justify-center text-[#4d5c78] shrink-0">
                <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
              </div>
              <div>
                <div className="font-display text-[15px] text-[#1a1c20] font-bold tracking-tight">
                  Offert {project.quoteNumber}.pdf
                </div>
                <div className="text-xs text-[#555e72]">
                  {project.category} • 4 sidor entreprenad
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenPdfPreview}
              className="px-2.5 py-1 rounded-lg bg-[#f3f3f9] hover:bg-[#e8e8ed] text-[#44474d] text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isAlreadySigned ? 'verified' : 'lock'}
              </span>
              <span>{isAlreadySigned ? 'Signerad' : 'Signeras'}</span>
            </button>
          </div>

          {/* Mini PDF representation inside card */}
          <div className="w-full rounded-lg overflow-hidden border border-[#e8e8ed] shadow-xs">
            {/* Header of mock PDF */}
            <div className="p-3 bg-[#4d5c78] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display text-xs font-extrabold tracking-wider text-[#d5e3ff]">
                  NORDIC BYGG &amp; EL
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-bold">
                  OFFERT
                </span>
              </div>
              <span className="text-xs text-[#dae2f9]">{project.quoteDate}</span>
            </div>

            {/* Body of mock PDF */}
            <div className="p-3.5 flex flex-col gap-2.5 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#75777e] font-semibold block">Beställare</span>
                  <span className="font-display text-[15px] text-[#1a1c20] font-bold">
                    {project.clientName}
                  </span>
                  <span className="text-xs text-[#555e72] block">{project.address}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#75777e] font-semibold block">
                    Att betala (efter ROT)
                  </span>
                  <span className="font-display text-[20px] text-[#4d5c78] font-black font-mono-numbers">
                    {formatKr(totals.customerPayable)}
                  </span>
                </div>
              </div>

              {/* 2 Attached Photo Thumbnails */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {project.photos.slice(0, 2).map((photo, i) => (
                  <div
                    key={photo.id}
                    className="relative h-20 rounded-lg overflow-hidden bg-[#e8e8ed] border border-[#e8e8ed]"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-[#64557e]/90 backdrop-blur-xs text-white text-[10px] font-semibold">
                      Bilaga {i + 1}: {photo.tag.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial specification summary */}
              <div className="rounded-lg bg-[#f3f3f9] p-2.5 flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between items-center text-[#1a1c20]">
                  <span>Arbetskostnad ({totals.workSubtotal / 750 || 38} tim)</span>
                  <span className="font-bold font-mono-numbers">
                    {formatKr(totals.workSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[#1a1c20]">
                  <span>Material &amp; ställning (Specificerat)</span>
                  <span className="font-bold font-mono-numbers">
                    {formatKr(totals.materialSubtotal)}
                  </span>
                </div>

                {project.rotEnabled && (
                  <div className="flex justify-between items-center text-emerald-800 font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Godkänt ROT-avdrag ({project.rotPercent}% arbete)
                    </span>
                    <span className="font-bold font-mono-numbers">
                      -{formatKr(totals.rotDeduction)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[#555e72] pt-1 border-t border-[#e2e2e7] text-[11px]">
                  <span>Moms ({project.momsPercent}% ingår med {formatKr(totals.momsAmount)})</span>
                  <span className="font-bold text-[#1a1c20]">Totalt inkl. moms &amp; ROT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Välj Signeringsmetod Selector */}
      <div className="px-4 mb-3.5">
        <h3 className="font-display text-[15px] text-[#1a1c20] font-bold mb-2">
          Välj signeringsmetod
        </h3>

        <div className="flex flex-col gap-2.5">
          {/* Option 1: Remote E-post / SMS (from mobile mockup) */}
          <div
            onClick={() => setSigningMethod('remote_email_sms')}
            className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
              signingMethod === 'remote_email_sms'
                ? 'border-[#4d5c78] bg-[#d7e0f6]/20'
                : 'border-[#e8e8ed] bg-white hover:border-[#bec6dd]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  signingMethod === 'remote_email_sms'
                    ? 'bg-[#4d5c78] text-white'
                    : 'bg-[#eeedf3] text-[#555e72]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">forward_to_inbox</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-[#1a1c20]">
                    E-postas för BankID-signering
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      signingMethod === 'remote_email_sms'
                        ? 'bg-[#4d5c78] text-white'
                        : 'border border-[#c5c6ce]'
                    }`}
                  >
                    {signingMethod === 'remote_email_sms' && (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    )}
                  </span>
                </div>
                <p className="text-xs text-[#555e72] mt-1 leading-relaxed">
                  Kunden får en krypterad signeringslänk skickad direkt till sin inkorg och signerar
                  smidigt med Mobilt BankID hemma i lugn och ro.
                </p>
                <div className="mt-2 p-2 rounded-lg bg-white border border-[#e8e8ed] flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="material-symbols-outlined text-[#4d5c78] text-[16px]">
                      mail
                    </span>
                    <span className="font-semibold text-[#1a1c20] truncate">
                      {project.clientEmail}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d7e0f6] text-[#0a1c34] shrink-0">
                    Bekräftad
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Option 2: Direct On-Site with QR Code (Recommended on field) */}
          <div
            onClick={() => setSigningMethod('direct_qr')}
            className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
              signingMethod === 'direct_qr'
                ? 'border-[#4d5c78] bg-[#d7e0f6]/20'
                : 'border-[#e8e8ed] bg-white hover:border-[#bec6dd]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  signingMethod === 'direct_qr'
                    ? 'bg-[#4d5c78] text-white'
                    : 'bg-[#eeedf3] text-[#555e72]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-display text-sm font-bold text-[#1a1c20]">
                      Signera direkt på plats
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Rekommenderas ute på fältet
                    </span>
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      signingMethod === 'direct_qr'
                        ? 'bg-[#4d5c78] text-white'
                        : 'border border-[#c5c6ce]'
                    }`}
                  >
                    {signingMethod === 'direct_qr' && (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    )}
                  </span>
                </div>
                <p className="text-xs text-[#555e72] mt-1 leading-relaxed">
                  Kunden öppnar BankID direkt via dynamisk QR-kod på din surfplatta/mobil eller
                  öppnar BankID på samma enhet. Direkt avslut utan administrativ väntetid.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BankID-verifiering Box */}
      <div className="px-4 mb-4">
        <div className="rounded-xl bg-white shadow-sm overflow-hidden border border-[#e8e8ed]">
          {/* Navy Header */}
          <div className="bg-[#002244] p-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[20px]">fingerprint</span>
              </div>
              <div>
                <div className="font-display text-sm font-bold text-white">BankID Verifiering</div>
                <div className="text-[11px] text-white/80">
                  Elektroniskt ID och bindande signatur
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-semibold">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isAlreadySigned ? 'bg-emerald-400' : 'bg-emerald-400 animate-pulse'
                }`}
              ></span>
              <span>{isAlreadySigned ? 'Signerad' : 'Redo'}</span>
            </div>
          </div>

          <div className="p-3.5 flex flex-col gap-3">
            {/* Identified Customer */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-[#75777e] uppercase tracking-wider font-bold">
                Identifierad beställare
              </span>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f3f3f9]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#e8e8ed] flex items-center justify-center text-[#4d5c78]">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>
                  <div>
                    <span className="font-display text-xs text-[#1a1c20] block font-bold">
                      {project.clientName}
                    </span>
                    <span className="text-[11px] text-[#75777e] font-mono-numbers">
                      {project.clientSsn}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#d7e0f6] text-[#0a1c34] text-[10px] font-bold">
                  Folkbokförd ägare
                </span>
              </div>
            </div>

            {/* Legal security text */}
            <div className="p-3 rounded-lg bg-[#f3f3f9] flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[#4d5c78] text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">gavel</span>
                <span>Juridisk säkerhetstext i BankID</span>
              </div>
              <div className="text-xs text-[#1a1c20] p-2 rounded bg-white font-mono leading-relaxed border border-[#e8e8ed]">
                "Offertbelopp: {formatKr(totals.customerPayable)} inkl. ROT &amp; moms. Godkännande av
                entreprenad avseende {project.category.toLowerCase()} enligt Offert{' '}
                {project.quoteNumber}."
              </div>
              <p className="text-[11px] text-[#75777e]">
                Signeringen är juridiskt bindande enligt eIDAS förordning och svensk avtalsrätt.
              </p>
            </div>

            {/* Fortnox & Visma sync note */}
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#eeedf3]">
              <div className="w-7 h-7 rounded-full bg-[#4d5c78] flex items-center justify-center text-white shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">sync_alt</span>
              </div>
              <div className="text-[#1a1c20] text-xs">
                <span className="font-bold block">Automatiserad affärssynk</span>
                <p className="text-[11px] text-[#555e72] mt-0.5">
                  Vid genomförd signering skapas orderunderlag och arkiveras PDF tillsammans med
                  fältfoton direkt i <strong className="text-[#1a1c20]">Fortnox</strong> &amp;{' '}
                  <strong className="text-[#1a1c20]">Visma eEkonomi</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button Action */}
      <div className="px-4 flex flex-col gap-2 pt-1">
        {signingMethod === 'direct_qr' ? (
          <button
            type="button"
            onClick={onOpenBankIdModal}
            className="w-full min-h-[52px] py-3.5 px-4 rounded-xl bg-[#002244] hover:bg-[#001730] text-white font-display text-[15px] font-bold flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
            <span>
              {isAlreadySigned ? 'Visa BankID-signerat avtal' : 'Starta Mobilt BankID för kund'}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSendEmailOffer}
            disabled={isSendingEmail}
            className="w-full min-h-[52px] py-3.5 px-4 rounded-xl bg-[#002244] hover:bg-[#001730] text-white font-display text-[15px] font-bold flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] transition-all"
          >
            {isSendingEmail ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[22px]">
                  progress_activity
                </span>
                <span>Skickar signeringslänk...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[22px]">mark_email_read</span>
                <span>E-posta offert (BankID-signering)</span>
              </>
            )}
          </button>
        )}

        <p className="text-center text-[11px] text-[#75777e]">
          Länken är aktiv i {project.validDays} dagar med BankID-verifiering vid öppning
        </p>

        {/* Secondary View PDF button */}
        <button
          type="button"
          onClick={onOpenPdfPreview}
          className="mt-1 w-full py-2.5 rounded-xl bg-white hover:bg-[#f3f3f9] text-[#4d5c78] font-bold text-xs border border-[#c5c6ce] flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          <span>Förhandsgranska fullständigt underlag (PDF)</span>
        </button>
      </div>

      {/* Toast Notification on Email Send */}
      {showToast && (
        <div className="fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto bg-[#657592] text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slideUp">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">check</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-sm font-bold">Offert skickad via e-post!</div>
            <div className="text-xs text-white/90 truncate">
              Säker signeringslänk skickad till {project.clientEmail}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
