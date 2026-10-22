import React from 'react';
import { ViewTab } from '../types/offert';

interface HeaderProps {
  currentTab: ViewTab;
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
  subtitle?: string;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onBack,
  showBack = false,
  title,
  subtitle,
  onProfileClick,
}) => {
  const getDefaultTitle = () => {
    switch (currentTab) {
      case 'booking':
        return 'Kund & Platsdetaljer';
      case 'protocol':
        return 'Kund & Platsdetaljer';
      case 'calculator':
        return 'OffertPro';
      case 'review':
        return 'Offertgranskning';
      case 'archive':
        return 'Offertarkiv';
      case 'settings':
        return 'Inställningar';
      default:
        return 'OffertPro';
    }
  };

  const displayTitle = title || getDefaultTitle();
  const isCalculator = currentTab === 'calculator';

  return (
    <header className="sticky top-0 w-full z-40 bg-[#f9f9fe]/90 backdrop-blur-xl border-b border-[#e8e8ed] pt-safe transition-all shadow-[0_1px_8px_rgba(15,30,54,0.04)]">
      <div className="h-16 px-4 flex items-center justify-between gap-3">
        {/* Left Side: Back button or Logo + Title */}
        <div className="flex items-center gap-2 min-w-0">
          {showBack && onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Tillbaka"
              className="w-10 h-10 -ml-1.5 rounded-xl flex items-center justify-center text-[#1a1c20] hover:bg-[#e8e8ed] active:bg-[#e2e2e7] transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}

          {/* Logo Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#1a1c20] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              <span className="tracking-tight">OP</span>
            </div>
            {isCalculator ? (
              <div className="flex flex-col">
                <span className="font-display text-[17px] font-bold text-[#1a1c20] leading-none">
                  OffertPro
                </span>
                <span className="text-[11px] text-[#555e72] font-semibold tracking-wider uppercase leading-none mt-1">
                  Ny Offert
                </span>
              </div>
            ) : (
              <h1 className="font-display text-[17px] font-bold text-[#1a1c20] tracking-tight truncate max-w-[200px] sm:max-w-none">
                {displayTitle}
              </h1>
            )}
          </div>
        </div>

        {/* Right Side: Sync status + User Profile */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#e8e8ed] rounded-full text-[#44474d] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-semibold">Synk OK</span>
          </div>

          <button
            type="button"
            onClick={onProfileClick}
            aria-label="Profil"
            className="w-8 h-8 rounded-full bg-[#4d5c78] hover:bg-[#3b537e] text-white flex items-center justify-center shrink-0 transition-colors shadow-sm text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
