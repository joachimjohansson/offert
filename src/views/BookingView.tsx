import React, { useState } from 'react';
import { TradeProject } from '../types/offert';

interface BookingViewProps {
  project: TradeProject;
  onUpdateProject: (updated: Partial<TradeProject>) => void;
  onProceedToProtocol: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  project,
  onUpdateProject,
  onProceedToProtocol,
}) => {
  const [searchQuery, setSearchQuery] = useState(project.address.split(',')[0] || 'Stor');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  const addressSuggestions = [
    {
      street: 'Storgatan 12, Nacka',
      distance: '1.2 km bort',
      postal: '131 40 Nacka · Fastighet: Sicklaön 38:4',
      propertyDesignation: 'Sicklaön 38:4',
    },
    {
      street: 'Storgatan 45, Stockholm',
      distance: '4.8 km bort',
      postal: '114 55 Stockholm · Östermalm',
      propertyDesignation: 'Stockholm 4:12',
    },
    {
      street: 'Storsvängen 8, Saltsjö-Duvnäs',
      distance: '3.1 km bort',
      postal: '131 52 Saltsjö-Duvnäs · Nacka kommun',
      propertyDesignation: 'Duvnäs 12:8',
    },
    {
      street: 'Storkärrsvägen 3, Gustavsberg',
      distance: '7.5 km bort',
      postal: '134 40 Gustavsberg · Värmdö',
      propertyDesignation: 'Värmdö 9:3',
    },
  ];

  const allCategories = ['Badrum', 'VVS', 'Snickeri', 'Målning', 'Elmontage'];

  const toggleCategory = (cat: string) => {
    const current = project.jobCategories || [];
    if (current.includes(cat)) {
      onUpdateProject({ jobCategories: current.filter((c) => c !== cat) });
    } else {
      onUpdateProject({ jobCategories: [...current, cat] });
    }
  };

  const handleSelectAddress = (index: number) => {
    setSelectedAddressIndex(index);
    const item = addressSuggestions[index];
    setSearchQuery(item.street);
    onUpdateProject({
      address: item.street,
      propertyDesignation: item.propertyDesignation,
    });
  };

  return (
    <div className="flex flex-col w-full pb-28 animate-fadeIn">
      {/* Progress Header */}
      <section className="px-4 pt-4 pb-2 flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#4d5c78] uppercase tracking-wider">Steg 1 av 2</span>
          <span className="text-[#44474d]">Kund &amp; Plats</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#e8e8ed] rounded-full overflow-hidden flex mt-1">
          <div className="w-1/2 h-full bg-[#4d5c78] rounded-full transition-all duration-300"></div>
          <div className="w-1/2 h-full bg-transparent"></div>
        </div>

        <div className="pt-2">
          <h2 className="font-display text-[22px] text-[#1a1c20] font-bold tracking-tight">
            Boka nytt kundbesök
          </h2>
          <p className="text-sm text-[#44474d] mt-0.5">
            Koppla adress och kontaktuppgifter inför platsbesiktning.
          </p>
        </div>
      </section>

      {/* Live Location Banner */}
      <section className="px-4 py-2">
        <div className="bg-[#d7e0f6]/50 border border-[#b7c7e7]/40 rounded-xl p-3 flex items-center gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#d7e0f6] flex items-center justify-center shrink-0 text-[#4d5c78]">
            <span className="material-symbols-outlined text-[18px]">my_location</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-[#0a1c34] font-bold leading-tight">
              Din position: Nacka / Stockholm
            </span>
            <span className="text-xs text-[#44474d] truncate">
              Närliggande adresser &amp; fastigheter prioriteras
            </span>
          </div>
        </div>
      </section>

      {/* Address Input & Live Autocomplete Section */}
      <section className="px-4 pt-2 flex flex-col gap-1.5">
        <label
          className="text-xs font-bold text-[#1a1c20] uppercase tracking-wide flex items-center justify-between"
          htmlFor="address-input"
        >
          <span>Arbetsplats / Fastighetsadress</span>
          <span className="text-xs text-[#4d5c78] font-semibold flex items-center gap-1 normal-case">
            <span className="material-symbols-outlined text-[15px]">near_me</span> GPS Aktiv
          </span>
        </label>

        {/* Interactive Active Input Field */}
        <div className="relative w-full">
          <div className="h-14 w-full bg-white rounded-xl border border-[#c5c6ce] flex items-center px-4 shadow-sm gap-2.5 focus-within:ring-2 focus-within:ring-[#4d5c78] focus-within:border-transparent transition-all">
            <span className="material-symbols-outlined text-[#4d5c78] text-[24px]">search</span>
            <input
              id="address-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sök gata eller fastighet..."
              className="w-full bg-transparent font-display text-[16px] text-[#1a1c20] font-semibold focus:outline-none placeholder:text-[#75777e]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Rensa text"
                className="w-8 h-8 rounded-full bg-[#f3f3f9] hover:bg-[#e8e8ed] flex items-center justify-center text-[#44474d] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions */}
          <div className="mt-2 bg-white rounded-xl border border-[#e8e8ed] shadow-md overflow-hidden flex flex-col divide-y divide-[#f3f3f9]">
            {addressSuggestions.map((item, idx) => {
              const isSelected = selectedAddressIndex === idx;
              return (
                <div
                  key={item.street}
                  onClick={() => handleSelectAddress(idx)}
                  className={`p-3.5 flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#d7e0f6]/30' : 'hover:bg-[#f9f9fe]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`material-symbols-outlined text-[22px] mt-0.5 ${
                        isSelected ? 'text-[#4d5c78]' : 'text-[#75777e]'
                      }`}
                    >
                      {idx === 0 ? 'apartment' : 'location_on'}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-display text-[15px] text-[#1a1c20] font-bold">
                          {item.street}
                        </span>
                        <span className="text-xs text-[#4d5c78] font-semibold">
                          ({item.distance})
                        </span>
                      </div>
                      <span className="text-xs text-[#44474d] mt-0.5">{item.postal}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#4d5c78] text-white text-[11px] font-bold shrink-0">
                      Vald
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form Details Card */}
      <section className="px-4 pt-4 flex flex-col gap-3">
        <div className="bg-white rounded-xl border border-[#e8e8ed] p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#f3f3f9]">
            <h3 className="font-display text-[16px] text-[#1a1c20] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4d5c78] text-[20px]">
                person_pin
              </span>
              Kunduppgifter
            </h3>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-md">
              ROT-berättigad
            </span>
          </div>

          {/* Name Field */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#44474d]" htmlFor="client-name">
              Namn / Beställare
            </label>
            <div className="h-12 bg-[#f3f3f9] rounded-xl px-3.5 flex items-center gap-2.5 border border-transparent focus-within:border-[#4d5c78] focus-within:bg-white transition-all">
              <span className="material-symbols-outlined text-[#75777e] text-[20px]">person</span>
              <input
                id="client-name"
                type="text"
                value={project.clientName}
                onChange={(e) => onUpdateProject({ clientName: e.target.value })}
                className="w-full bg-transparent text-sm text-[#1a1c20] font-semibold focus:outline-none"
              />
            </div>
          </div>

          {/* Phone & Email Inputs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#44474d]" htmlFor="client-phone">
                Telefonnummer
              </label>
              <div className="h-12 bg-[#f3f3f9] rounded-xl px-3.5 flex items-center gap-2.5 border border-transparent focus-within:border-[#4d5c78] focus-within:bg-white transition-all">
                <span className="material-symbols-outlined text-[#75777e] text-[20px]">call</span>
                <input
                  id="client-phone"
                  type="tel"
                  value={project.clientPhone}
                  onChange={(e) => onUpdateProject({ clientPhone: e.target.value })}
                  className="w-full bg-transparent text-sm text-[#1a1c20] font-semibold focus:outline-none font-mono-numbers"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#44474d]" htmlFor="client-email">
                E-postadress (för offertutskick)
              </label>
              <div className="h-12 bg-[#f3f3f9] rounded-xl px-3.5 flex items-center gap-2.5 border border-transparent focus-within:border-[#4d5c78] focus-within:bg-white transition-all">
                <span className="material-symbols-outlined text-[#75777e] text-[20px]">mail</span>
                <input
                  id="client-email"
                  type="email"
                  value={project.clientEmail}
                  onChange={(e) => onUpdateProject({ clientEmail: e.target.value })}
                  className="w-full bg-transparent text-sm text-[#1a1c20] font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job Scope / Category Selector */}
        <div className="bg-white rounded-xl border border-[#e8e8ed] p-4 shadow-sm flex flex-col gap-2">
          <label className="font-display text-[15px] text-[#1a1c20] font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4d5c78] text-[20px]">handyman</span>
            Typ av uppdrag
          </label>
          <p className="text-xs text-[#44474d]">
            Välj ett eller flera verksamhetsområden för besiktningen:
          </p>

          <div className="flex flex-wrap gap-2 pt-1.5">
            {allCategories.map((cat) => {
              const isSelected = project.jobCategories?.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                    isSelected
                      ? 'bg-[#4d5c78] text-white shadow-slate-300'
                      : 'bg-[#eeedf3] text-[#44474d] hover:bg-[#e2e2e7]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isSelected ? 'check' : 'add'}
                  </span>
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Booking Date & Time Field */}
        <div className="bg-white rounded-xl border border-[#e8e8ed] p-4 shadow-sm flex flex-col gap-2">
          <label className="font-display text-[15px] text-[#1a1c20] font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4d5c78] text-[20px]">
              calendar_today
            </span>
            Tid för kundbesök
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#44474d]">Datum</span>
              <div className="h-12 bg-[#f3f3f9] rounded-xl px-3.5 flex items-center justify-between border border-[#e8e8ed]">
                <span className="text-sm font-semibold text-[#1a1c20]">Idag, 24 Okt</span>
                <span className="material-symbols-outlined text-[#4d5c78] text-[20px]">event</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#44474d]">Starttid</span>
              <div className="h-12 bg-[#f3f3f9] rounded-xl px-3.5 flex items-center justify-between border border-[#e8e8ed]">
                <span className="text-sm font-semibold text-[#1a1c20] font-mono-numbers">13:30</span>
                <span className="material-symbols-outlined text-[#4d5c78] text-[20px]">
                  schedule
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Actions */}
      <footer className="sticky bottom-0 w-full bg-[#f9f9fe]/95 backdrop-blur-md px-4 pt-2.5 pb-4 mt-6 shadow-[0_-4px_16px_rgba(15,30,54,0.06)] border-t border-[#e8e8ed] flex flex-col gap-1.5 z-30">
        <div className="flex items-center justify-between text-xs text-[#44474d] px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4d5c78] inline-block animate-pulse"></span>
            Plats kopplad till {project.address.split(',')[0]}
          </span>
          <span className="font-bold text-[#1a1c20]">Steg 1 / 2</span>
        </div>
        <button
          type="button"
          onClick={onProceedToProtocol}
          className="w-full h-14 bg-[#4d5c78] hover:bg-[#3b537e] text-white rounded-xl font-display text-[16px] font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
        >
          <span>Spara och påbörja besök</span>
          <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};
