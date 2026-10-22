import React, { useState } from 'react';
import { TradeProject } from '../types/offert';
import { calculateProjectTotals, formatKr } from '../utils/calc';

interface PdfPreviewModalProps {
  project: TradeProject;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [activePage, setActivePage] = useState<number>(1);
  const totals = calculateProjectTotals(project);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-[#525659] text-white rounded-2xl max-w-3xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-700 overflow-hidden">
        {/* PDF Viewer Top Bar */}
        <div className="bg-[#323639] px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-400 text-[20px]">
              picture_as_pdf
            </span>
            <span className="text-xs font-bold truncate">
              Offert_{project.quoteNumber.replace('#', '')}_{project.title.replace(/\s+/g, '_')}.pdf
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Page navigation */}
            <div className="flex items-center gap-1 bg-[#212427] px-2 py-1 rounded text-xs">
              <button
                type="button"
                disabled={activePage === 1}
                onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                className="hover:text-blue-400 disabled:opacity-30 disabled:hover:text-white"
              >
                ◀
              </button>
              <span className="font-mono-numbers px-1">
                Sida {activePage} av 4
              </span>
              <button
                type="button"
                disabled={activePage === 4}
                onClick={() => setActivePage((p) => Math.min(4, p + 1))}
                className="hover:text-blue-400 disabled:opacity-30 disabled:hover:text-white"
              >
                ▶
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Skriv ut"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors ml-1"
              title="Stäng"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable PDF Document Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#525659] flex justify-center">
          {/* Simulated A4 Paper Sheet */}
          <div className="w-full max-w-[640px] bg-white text-[#1a1c20] shadow-2xl rounded-sm p-6 sm:p-8 min-h-[780px] flex flex-col justify-between text-xs font-sans border border-slate-300">
            {/* Page 1: Sammanfattning */}
            {activePage === 1 && (
              <div className="flex flex-col h-full justify-between">
                <div>
                  {/* Letterhead */}
                  <div className="flex justify-between items-start pb-4 border-b-2 border-[#4d5c78]">
                    <div>
                      <h2 className="text-xl font-bold font-display text-[#1a1c20]">
                        NORDIC BYGG &amp; EL AB
                      </h2>
                      <p className="text-[11px] text-[#555e72] mt-0.5">
                        Org.nr: 556912-4482 • F-skatt godkänd • Momsreg: SE556912448201
                      </p>
                      <p className="text-[11px] text-[#555e72]">
                        Hantverkarvägen 8, 131 52 Nacka • info@nordicbyggohel.se
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-[#4d5c78] font-display">OFFERT</span>
                      <p className="font-mono-numbers font-bold text-xs mt-0.5">
                        {project.quoteNumber}
                      </p>
                      <p className="text-[11px] text-[#555e72]">Datum: {project.quoteDate}</p>
                      <p className="text-[11px] text-[#555e72]">
                        Giltig: {project.validDays} dagar
                      </p>
                    </div>
                  </div>

                  {/* Customer & Site Details */}
                  <div className="grid grid-cols-2 gap-4 my-4 p-3 bg-slate-50 rounded border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Beställare
                      </span>
                      <span className="font-bold text-sm block mt-0.5">{project.clientName}</span>
                      <span className="text-slate-600 block">{project.address}</span>
                      <span className="text-slate-600 font-mono-numbers block">
                        {project.clientSsn}
                      </span>
                      <span className="text-slate-600 block">{project.clientEmail}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Arbetsplats / Fastighet
                      </span>
                      <span className="font-bold text-sm block mt-0.5">{project.title}</span>
                      <span className="text-slate-600 block">
                        Fastighetsbeteckning: {project.propertyDesignation}
                      </span>
                      <span className="text-slate-600 block">Uppdrag: {project.category}</span>
                      <span className="text-slate-600 block">
                        ROT-fördelning: {project.rotDistribution}
                      </span>
                    </div>
                  </div>

                  {/* Summary of Work */}
                  <div className="mb-4">
                    <h3 className="font-bold text-xs text-[#4d5c78] uppercase tracking-wide mb-1.5">
                      Entreprenadbeskrivning
                    </h3>
                    <p className="text-slate-700 leading-relaxed text-xs">
                      Offerten omfattar komplett fackmannamässigt utförande av {project.category.toLowerCase()} enligt upprättat fältprotokoll ({project.address}). Arbetet utförs i enlighet med gällande branschregler Säker Vatten, BBV samt Boverkets byggregler.
                    </p>
                  </div>

                  {/* Financial Summary Table */}
                  <div className="mt-4 border border-slate-300 rounded overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#4d5c78] text-white text-[11px]">
                          <th className="p-2">Beskrivning</th>
                          <th className="p-2 text-right">Belopp (exkl. moms)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="p-2">Arbetskostnad (specificerat på sid 2)</td>
                          <td className="p-2 text-right font-mono-numbers font-semibold">
                            {formatKr(totals.workSubtotal)}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2">Material och komponenter</td>
                          <td className="p-2 text-right font-mono-numbers font-semibold">
                            {formatKr(totals.materialSubtotal)}
                          </td>
                        </tr>
                        <tr className="bg-slate-50 font-bold">
                          <td className="p-2">Summa exkl. moms</td>
                          <td className="p-2 text-right font-mono-numbers">
                            {formatKr(totals.subtotalExMoms)}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2">Mervärdesskatt (25% moms)</td>
                          <td className="p-2 text-right font-mono-numbers">
                            {formatKr(totals.momsAmount)}
                          </td>
                        </tr>
                        {project.rotEnabled && (
                          <tr className="text-emerald-800 bg-emerald-50/70 font-semibold">
                            <td className="p-2">
                              ✓ Preliminär ROT-skattereduktion ({project.rotPercent}% på arbete)
                            </td>
                            <td className="p-2 text-right font-mono-numbers font-bold">
                              -{formatKr(totals.rotDeduction)}
                            </td>
                          </tr>
                        )}
                        <tr className="bg-[#eeedf3] text-sm font-bold border-t-2 border-[#4d5c78]">
                          <td className="p-2.5 text-[#1a1c20]">ATT BETALA AV BESTÄLLARE</td>
                          <td className="p-2.5 text-right font-mono-numbers text-[#4d5c78] font-black text-base">
                            {formatKr(totals.customerPayable)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer sign block on page 1 */}
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Offertproffesionell generering • eIDAS standard</span>
                  <span>Sida 1 av 4</span>
                </div>
              </div>
            )}

            {/* Page 2: Kalkyl & Specifikation */}
            {activePage === 2 && (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 mb-4">
                    <span className="font-bold text-xs text-slate-800">
                      Offert {project.quoteNumber} — Sida 2: Kalkylspecifikation
                    </span>
                    <span className="text-[11px] text-slate-500">{project.title}</span>
                  </div>

                  <h3 className="font-bold text-xs text-[#4d5c78] uppercase tracking-wide mb-2">
                    Specificerade Arbetsmoment &amp; Material
                  </h3>

                  <div className="border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                        <tr>
                          <th className="p-2">Post / Arbetsmoment</th>
                          <th className="p-2 text-center">Volym</th>
                          <th className="p-2 text-right">À-pris</th>
                          <th className="p-2 text-center">ROT</th>
                          <th className="p-2 text-right">Summa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {project.lineItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="p-2">
                              <span className="font-bold text-slate-900 block">{item.title}</span>
                              <span className="text-[11px] text-slate-500 block">
                                {item.description}
                              </span>
                            </td>
                            <td className="p-2 text-center font-mono-numbers">
                              {item.volume} {item.unit}
                            </td>
                            <td className="p-2 text-right font-mono-numbers">
                              {formatKr(item.unitPrice)}
                            </td>
                            <td className="p-2 text-center">
                              {item.isRotEligible ? (
                                <span className="text-emerald-700 font-bold">Ja</span>
                              ) : (
                                <span className="text-slate-400">Nej</span>
                              )}
                            </td>
                            <td className="p-2 text-right font-mono-numbers font-bold">
                              {formatKr(item.volume * item.unitPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Customer Notes */}
                  <div className="mt-5 p-3 rounded bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-xs text-slate-800 mb-1">
                      Överenskomna fältpunkter från besiktning:
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 text-xs">
                      {project.notes.map((n) => (
                        <li key={n.id}>
                          <strong>{n.title}:</strong> {n.subtitle}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Nordic Bygg &amp; El AB • Bilaga kalkyl</span>
                  <span>Sida 2 av 4</span>
                </div>
              </div>
            )}

            {/* Page 3: Fältfoton */}
            {activePage === 3 && (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 mb-4">
                    <span className="font-bold text-xs text-slate-800">
                      Offert {project.quoteNumber} — Sida 3: Fotodokumentation
                    </span>
                    <span className="text-[11px] text-slate-500">{project.title}</span>
                  </div>

                  <h3 className="font-bold text-xs text-[#4d5c78] uppercase tracking-wide mb-2">
                    Tidsstämplade fältfoton inför entreprenad
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {project.photos.map((photo, i) => (
                      <div
                        key={photo.id}
                        className="border border-slate-300 rounded overflow-hidden bg-slate-50 p-2 flex flex-col"
                      >
                        <div className="relative h-40 w-full overflow-hidden rounded bg-slate-200">
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1 left-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-[10px] font-mono-numbers">
                            {photo.timestamp}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="font-bold text-slate-900 block text-xs">
                            Bilaga {i + 1}: {photo.title}
                          </span>
                          <span className="text-[11px] text-slate-600 block mt-0.5 leading-snug">
                            {photo.description}
                          </span>
                          {photo.annotation && (
                            <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded inline-block mt-1">
                              Notering: {photo.annotation}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Fotodokumentation verifierad med GPS &amp; laser</span>
                  <span>Sida 3 av 4</span>
                </div>
              </div>
            )}

            {/* Page 4: Villkor & Signatur */}
            {activePage === 4 && (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 mb-4">
                    <span className="font-bold text-xs text-slate-800">
                      Offert {project.quoteNumber} — Sida 4: Villkor &amp; BankID-signering
                    </span>
                    <span className="text-[11px] text-slate-500">{project.title}</span>
                  </div>

                  <h3 className="font-bold text-xs text-[#4d5c78] uppercase tracking-wide mb-2">
                    Allmänna Avtalsvillkor (Hantverkarformuläret 17)
                  </h3>

                  <div className="space-y-2 text-slate-700 text-[11px] leading-relaxed border border-slate-200 p-3 rounded bg-slate-50 mb-4">
                    <p>
                      <strong>1. Omfattning:</strong> Entreprenören åtar sig att utföra arbetet fackmässigt och med tillbörlig omsorg enligt Konsumenttjänstlagen (1985:716).
                    </p>
                    <p>
                      <strong>2. ROT-avdrag:</strong> Entreprenören administrerar ansökan om skattereduktion till Skatteverket. Skulle Skatteverket avslå ansökan åligger det beställaren att ersätta entreprenören för resterande belopp.
                    </p>
                    <p>
                      <strong>3. Betalningsvillkor:</strong> Faktura 30 dagar netto efter slutbesiktning och godkänt arbete.
                    </p>
                    <p>
                      <strong>4. ÄTA-arbeten:</strong> Eventuella tillkommande arbeten ska överenskommas skriftligen innan påbörjande.
                    </p>
                  </div>

                  {/* Signatures box */}
                  <div className="border-2 border-[#002244] rounded-xl p-4 bg-slate-50">
                    <div className="flex items-center gap-2 mb-3 text-[#002244] font-bold">
                      <span className="material-symbols-outlined text-[20px]">fingerprint</span>
                      <span>Digital BankID-signatur (eIDAS bindande)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Entreprenör</span>
                        <span className="font-bold block text-xs mt-0.5">Nordic Bygg &amp; El AB</span>
                        <span className="text-slate-600 block text-[11px]">Handläggare: Marcus Ekström</span>
                        <span className="text-emerald-700 text-[10px] font-bold mt-2 block">
                          ✓ Signerat digitalt
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Beställare</span>
                        <span className="font-bold block text-xs mt-0.5">{project.clientName}</span>
                        <span className="text-slate-600 block text-[11px] font-mono-numbers">
                          {project.clientSsn}
                        </span>
                        {project.status === 'signerad' ? (
                          <span className="text-emerald-700 text-[10px] font-bold mt-2 block">
                            ✓ BankID Verifierad &amp; Signerad ({project.signatureData?.signedAt || new Date().toLocaleDateString('sv-SE')})
                          </span>
                        ) : (
                          <span className="text-blue-700 text-[10px] font-bold mt-2 block">
                            🔒 Väntar på BankID-signering
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Slutavstämning • OffertPro avtalssystem</span>
                  <span>Sida 4 av 4</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
