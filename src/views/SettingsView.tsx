import React from 'react';

export const SettingsView: React.FC = () => {
  return (
    <div className="flex flex-col w-full pb-28 px-4 pt-3 animate-fadeIn">
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold text-[#1a1c20]">Inställningar</h2>
        <p className="text-xs text-[#555e72]">
          Företagsuppgifter, standardkalkyler och systemintegrationer
        </p>
      </div>

      <div className="space-y-4">
        {/* Company card */}
        <div className="bg-white rounded-xl border border-[#e8e8ed] p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#f3f3f9]">
            <span className="material-symbols-outlined text-[#4d5c78] text-[20px]">business</span>
            <h3 className="font-display font-bold text-sm text-[#1a1c20]">Företagsprofil</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block font-semibold">Företagsnamn</span>
              <span className="font-bold text-slate-900 block mt-0.5">Nordic Bygg &amp; El AB</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Organisationsnummer</span>
              <span className="font-mono-numbers text-slate-900 block mt-0.5">556912-4482</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">F-skattsedel</span>
              <span className="text-emerald-700 font-bold block mt-0.5">✓ Registrerad &amp; godkänd</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Handläggare / Fältsäljare</span>
              <span className="font-bold text-slate-900 block mt-0.5">Marcus Ekström</span>
            </div>
          </div>
        </div>

        {/* Calculation standards */}
        <div className="bg-white rounded-xl border border-[#e8e8ed] p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#f3f3f9]">
            <span className="material-symbols-outlined text-[#4d5c78] text-[20px]">tune</span>
            <h3 className="font-display font-bold text-sm text-[#1a1c20]">Kalkyl- och Skattestandarder</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#f9f9fe] p-2.5 rounded-lg border border-[#eeedf3]">
              <span className="text-slate-500 block">Standard ROT-avdrag</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 font-mono-numbers">30% på arbetskostnad</span>
            </div>
            <div className="bg-[#f9f9fe] p-2.5 rounded-lg border border-[#eeedf3]">
              <span className="text-slate-500 block">Mervärdesskatt (Moms)</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 font-mono-numbers">25%</span>
            </div>
            <div className="bg-[#f9f9fe] p-2.5 rounded-lg border border-[#eeedf3]">
              <span className="text-slate-500 block">Standard timpris snickeri</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 font-mono-numbers">750 kr/h</span>
            </div>
            <div className="bg-[#f9f9fe] p-2.5 rounded-lg border border-[#eeedf3]">
              <span className="text-slate-500 block">Standard timpris VVS &amp; El</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 font-mono-numbers">850 kr/h</span>
            </div>
          </div>
        </div>

        {/* Connected integrations */}
        <div className="bg-white rounded-xl border border-[#e8e8ed] p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#f3f3f9]">
            <span className="material-symbols-outlined text-[#4d5c78] text-[20px]">sync</span>
            <h3 className="font-display font-bold text-sm text-[#1a1c20]">Aktiva Integrationer</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f3f3f9]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-slate-900">Fortnox Order &amp; Fakturering</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Ansluten ✓
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f3f3f9]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-slate-900">Visma eEkonomi PDF-arkiv</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Ansluten ✓
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f3f3f9]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-slate-900">Mobilt BankID (Finansiell ID-Teknik)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                eIDAS Redo ✓
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f3f3f9]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-slate-900">Skatteverket ROT/RUT Kontrolltjänst</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Realtidssynk ✓
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
