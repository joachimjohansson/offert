import React, { useState } from 'react';
import { TradeProject, LineItem } from '../types/offert';
import { calculateProjectTotals, formatKr } from '../utils/calc';

interface QuoteCalculatorViewProps {
  project: TradeProject;
  onUpdateProject: (updated: Partial<TradeProject>) => void;
  onProceedToReview: () => void;
  onOpenLineItemEditor: (item?: LineItem) => void;
}

export const QuoteCalculatorView: React.FC<QuoteCalculatorViewProps> = ({
  project,
  onUpdateProject,
  onProceedToReview,
  onOpenLineItemEditor,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [specModalItem, setSpecModalItem] = useState<LineItem | null>(null);

  const totals = calculateProjectTotals(project);

  const handleToggleRot = () => {
    onUpdateProject({ rotEnabled: !project.rotEnabled });
  };

  const handleGeneratePdfAndProceed = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      setIsGeneratingPdf(false);
      onProceedToReview();
    }, 600);
  };

  return (
    <div className="flex flex-col w-full pb-28 animate-fadeIn">
      {/* Stegindikator (Step 2 active) */}
      <div className="w-full bg-[#f3f3f9] px-4 py-3.5 border-b border-[#e8e8ed] shadow-xs">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Steg 1 */}
          <div className="flex items-center gap-1.5 opacity-80">
            <span className="w-6 h-6 rounded-full bg-[#e2e2e7] text-[#555e72] flex items-center justify-center text-xs font-bold">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check
              </span>
            </span>
            <span className="text-xs text-[#555e72] font-semibold">1. Uppgifter</span>
          </div>

          <span className="h-0.5 w-6 bg-[#bec6dd]/60"></span>

          {/* Steg 2 (Aktivt) */}
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-[#4d5c78] text-white flex items-center justify-center text-xs font-bold shadow-sm">
              2
            </span>
            <span className="text-xs text-[#4d5c78] font-bold tracking-tight">
              2. Kalkyl &amp; ROT
            </span>
          </div>

          <span className="h-0.5 w-6 bg-[#e2e2e7]"></span>

          {/* Steg 3 */}
          <div className="flex items-center gap-1.5 opacity-50">
            <span className="w-6 h-6 rounded-full bg-[#e2e2e7] text-[#75777e] flex items-center justify-center text-xs font-medium">
              3
            </span>
            <span className="text-xs text-[#75777e] font-medium">3. Signera</span>
          </div>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-3.5 mt-3.5">
        {/* Snabböverblick / Kundkabinett i bilen */}
        <div className="bg-white p-3.5 rounded-xl border border-[#e8e8ed] shadow-sm flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#eeedf3] text-[#4d5c78] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">roofing</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display text-[15px] text-[#1a1c20] font-bold truncate">
                  {project.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#d7e0f6] text-[#4d5c78] text-[11px] font-bold">
                  På plats
                </span>
              </div>
              <span className="text-xs text-[#555e72] flex items-center gap-1 mt-0.5 truncate">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {project.address} • {project.category}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenLineItemEditor()}
            aria-label="Redigera uppgifter"
            className="w-9 h-9 rounded-lg bg-[#f3f3f9] hover:bg-[#e8e8ed] flex items-center justify-center text-[#555e72] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>

        {/* Sektion: Kalkylposter */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1a1c20] uppercase tracking-wider">
                Kalkyl &amp; Arbetsmoment
              </span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#e8e8ed] text-[#555e72]">
                {project.lineItems.length} poster
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenLineItemEditor()}
              className="text-[#4d5c78] hover:text-[#374762] text-xs font-bold flex items-center gap-1 active:opacity-75"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Lägg till rad</span>
            </button>
          </div>

          {/* Line items list */}
          {project.lineItems.map((item) => {
            const isWork = item.category === 'arbete';
            const rowTotal = item.volume * item.unitPrice;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[#e8e8ed] p-3.5 shadow-sm flex flex-col gap-2.5 hover:border-[#bec6dd] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        isWork ? 'bg-[#4d5c78]' : 'bg-[#75777e]'
                      }`}
                    ></span>
                    <span className="font-display text-[15px] text-[#1a1c20] font-bold truncate">
                      {item.title}
                    </span>
                  </div>
                  <span className="font-display text-[16px] text-[#1a1c20] font-bold shrink-0 font-mono-numbers">
                    {formatKr(rowTotal)}
                  </span>
                </div>

                {isWork ? (
                  <div className="grid grid-cols-12 gap-2 pt-1 items-center bg-[#f3f3f9] p-2.5 rounded-lg">
                    <div className="col-span-5 flex flex-col">
                      <span className="text-[11px] text-[#75777e] font-semibold">Volym</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-sm font-bold text-[#1a1c20] font-mono-numbers">
                          {item.volume}
                        </span>
                        <span className="text-xs text-[#75777e]">{item.unit}</span>
                      </div>
                    </div>

                    <div className="col-span-5 flex flex-col">
                      <span className="text-[11px] text-[#75777e] font-semibold">À-pris</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-sm font-bold text-[#1a1c20] font-mono-numbers">
                          {item.unitPrice}
                        </span>
                        <span className="text-xs text-[#75777e]">kr/{item.unit}</span>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onOpenLineItemEditor(item)}
                        aria-label="Justera rad"
                        className="w-8 h-8 rounded-lg bg-white border border-[#e8e8ed] text-[#555e72] hover:text-[#1a1c20] flex items-center justify-center active:scale-95 shadow-xs transition-colors"
                      >
                        <span className="material-symbols-outlined text-[17px]">tune</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1 pl-4">
                    <span className="text-xs text-[#75777e] font-medium">
                      1 post • Fast nettopris
                    </span>
                    <button
                      type="button"
                      onClick={() => setSpecModalItem(item)}
                      className="text-[#4d5c78] hover:text-[#374762] text-xs font-bold flex items-center gap-0.5"
                    >
                      <span>Specifikation</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ROT-Avdrag Modul */}
        <div className="bg-white rounded-xl border border-[#e8e8ed] p-3.5 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#d7e0f6] text-[#4d5c78] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">percent</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[15px] text-[#1a1c20] font-bold">
                  ROT-avdrag
                </span>
                <span className="text-xs text-[#555e72]">
                  {project.rotPercent}% subvention på arbetskostnad
                </span>
              </div>
            </div>

            {/* Taktil iOS/Fält Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={project.rotEnabled}
                onChange={handleToggleRot}
                className="sr-only peer"
                id="rot-toggle"
              />
              <div className="w-12 h-7 bg-[#e2e2e7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#4d5c78]"></div>
            </label>
          </div>

          <div
            className={`rounded-lg p-3 flex items-center justify-between transition-colors ${
              project.rotEnabled
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-[#f3f3f9] border border-transparent opacity-60'
            }`}
          >
            <div className="flex flex-col">
              <span className="text-xs text-[#555e72] font-semibold">
                Underlag arbete ({formatKr(totals.rotEligibleBase)})
              </span>
              <span className="text-xs text-emerald-800 font-bold">
                {project.rotEnabled ? 'Automatisk skattereduktion' : 'Ej aktiverad'}
              </span>
            </div>
            <div className="text-right">
              <span className="font-display text-[17px] text-emerald-800 font-bold font-mono-numbers">
                {project.rotEnabled ? `-${formatKr(totals.rotDeduction)}` : '0 kr'}
              </span>
            </div>
          </div>
        </div>

        {/* Fältfoton Bilagor */}
        <div className="bg-white rounded-xl border border-[#e8e8ed] p-3.5 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#4d5c78]">
                photo_camera
              </span>
              <span className="text-xs font-bold text-[#1a1c20]">
                Dokumentationsfoton ({project.photos.filter((p) => p.selectedForPdf).length} st)
              </span>
            </div>
            <span className="text-xs text-[#4d5c78] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
              Bifogas i PDF
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {project.photos.slice(0, 2).map((photo) => (
              <div
                key={photo.id}
                className="relative rounded-lg overflow-hidden bg-[#e8e8ed] aspect-[4/3] group shadow-xs border border-[#e8e8ed]"
              >
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-xs text-white font-medium truncate">{photo.title}</span>
                </div>
                <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#4d5c78] text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totalsammanställning */}
        <div className="bg-[#eeedf3] rounded-xl p-4 shadow-sm flex flex-col gap-2 border border-[#e2e2e7]">
          <span className="text-xs font-bold text-[#1a1c20] tracking-tight uppercase">
            Kalkylsammandrag
          </span>

          <div className="flex items-center justify-between text-[#555e72] text-xs">
            <span>Arbete &amp; Material (exkl. moms)</span>
            <span className="font-semibold text-[#1a1c20] font-mono-numbers">
              {formatKr(totals.subtotalExMoms)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#555e72] text-xs">
            <span>Moms (25%)</span>
            <span className="font-semibold text-[#1a1c20] font-mono-numbers">
              {formatKr(totals.momsAmount)}
            </span>
          </div>

          {project.rotEnabled && (
            <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold pt-0.5">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                ROT-avdrag ({project.rotPercent}% arbete)
              </span>
              <span className="font-bold font-mono-numbers">
                -{formatKr(totals.rotDeduction)}
              </span>
            </div>
          )}

          <div className="h-px w-full bg-[#e2e2e7] my-1"></div>

          <div className="flex items-baseline justify-between pt-0.5">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1a1c20]">Att betala av kund</span>
              <span className="text-[11px] text-[#75777e]">
                Inkl. moms och {project.rotEnabled ? 'ROT' : 'utan ROT'}
              </span>
            </div>
            <div className="text-right">
              <span className="font-display text-[26px] text-[#1a1c20] font-extrabold tracking-tight font-mono-numbers">
                {formatKr(totals.customerPayable)}
              </span>
            </div>
          </div>
        </div>

        {/* Primär åtgärd: PDF & Signeringssätt */}
        <div className="flex flex-col gap-2 mt-1">
          <button
            type="button"
            onClick={handleGeneratePdfAndProceed}
            disabled={isGeneratingPdf}
            className="w-full h-14 bg-[#4d5c78] hover:bg-[#3b537e] text-white rounded-xl font-display text-[15px] font-bold flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98] transition-transform"
          >
            {isGeneratingPdf ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[22px]">
                  progress_activity
                </span>
                <span>Skapar PDF med foton...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
                <span>Generera snygg PDF &amp; Välj signeringssätt</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[#555e72] mt-0.5">
            <span className="material-symbols-outlined text-[16px] text-[#4d5c78]">
              verified_user
            </span>
            <span className="text-xs font-medium">
              Klar för omedelbar BankID- eller direktsignering
            </span>
          </div>
        </div>
      </div>

      {/* Specification Details Modal */}
      {specModalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-slate-900 text-sm">
                {specModalItem.title}
              </h3>
              <button
                type="button"
                onClick={() => setSpecModalItem(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="py-3 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">Inkluderat material:</p>
              <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {specModalItem.specificationDetails || specModalItem.description}
              </p>
              <div className="flex justify-between pt-2 text-slate-900 font-bold border-t border-slate-100">
                <span>Fast nettopris:</span>
                <span>{formatKr(specModalItem.volume * specModalItem.unitPrice)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSpecModalItem(null)}
              className="w-full mt-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Stäng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
