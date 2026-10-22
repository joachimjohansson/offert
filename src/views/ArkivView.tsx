import React, { useState } from 'react';
import { TradeProject } from '../types/offert';
import { calculateProjectTotals, formatKr } from '../utils/calc';

interface ArkivViewProps {
  projects: TradeProject[];
  onSelectProject: (id: string) => void;
  onOpenPdf: (project: TradeProject) => void;
}

export const ArkivView: React.FC<ArkivViewProps> = ({
  projects,
  onSelectProject,
  onOpenPdf,
}) => {
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'signed'>('all');
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter((p) => {
    if (filter === 'signed' && p.status !== 'signerad') return false;
    if (filter === 'ongoing' && p.status === 'signerad') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.quoteNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-28 px-4 pt-3 animate-fadeIn">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-display text-xl font-bold text-[#1a1c20]">Offertarkiv</h2>
          <p className="text-xs text-[#555e72]">
            Samtliga fältprotokoll, offerter och BankID-signerade avtal
          </p>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#eeedf3] text-[#4d5c78]">
          {projects.length} ärenden
        </span>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-2.5 mb-4">
        <div className="h-11 bg-white rounded-xl border border-[#c5c6ce] px-3 flex items-center gap-2 shadow-xs">
          <span className="material-symbols-outlined text-[#75777e] text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök kund, adress eller offertnummer..."
            className="w-full bg-transparent text-xs text-[#1a1c20] font-semibold focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-[#75777e] hover:text-[#1a1c20] text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1.5 p-1 bg-[#eeedf3] rounded-xl border border-[#e2e2e7]">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-white text-[#1a1c20] shadow-xs'
                : 'text-[#555e72] hover:text-[#1a1c20]'
            }`}
          >
            Alla
          </button>
          <button
            type="button"
            onClick={() => setFilter('ongoing')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'ongoing'
                ? 'bg-white text-[#1a1c20] shadow-xs'
                : 'text-[#555e72] hover:text-[#1a1c20]'
            }`}
          >
            Aktiva &amp; På plats
          </button>
          <button
            type="button"
            onClick={() => setFilter('signed')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'signed'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-[#555e72] hover:text-[#1a1c20]'
            }`}
          >
            ✓ BankID-signerade
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex flex-col gap-3">
        {filteredProjects.map((p) => {
          const totals = calculateProjectTotals(p);
          const isSigned = p.status === 'signerad';

          return (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-[#e8e8ed] p-4 shadow-sm hover:border-[#bec6dd] transition-all flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-[#1a1c20]">
                      {p.title}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f3f3f9] text-[#555e72] border border-[#e8e8ed]">
                      {p.quoteNumber}
                    </span>
                  </div>
                  <div className="text-xs text-[#555e72] mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <span>{p.address}</span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isSigned
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#d7e0f6] text-[#0a1c34]'
                  }`}
                >
                  {isSigned ? '✓ Signerad' : 'Fältbesök aktivt'}
                </span>
              </div>

              {/* Price and Details row */}
              <div className="bg-[#f9f9fe] p-2.5 rounded-lg border border-[#eeedf3] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-[#75777e] block">Beställare</span>
                  <span className="font-bold text-[#1a1c20]">{p.clientName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#75777e] block">Att betala (efter ROT)</span>
                  <span className="font-display font-bold text-sm text-[#4d5c78] font-mono-numbers">
                    {formatKr(totals.customerPayable)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectProject(p.id)}
                  className="flex-1 py-2 rounded-lg bg-[#4d5c78] hover:bg-[#3b537e] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>Öppna kalkyl</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenPdf(p)}
                  className="px-3 py-2 rounded-lg bg-[#f3f3f9] hover:bg-[#e8e8ed] text-[#44474d] font-bold text-xs border border-[#e8e8ed] transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  <span>PDF</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
