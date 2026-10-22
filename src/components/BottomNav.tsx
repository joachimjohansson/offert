import React from 'react';
import { ViewTab } from '../types/offert';

interface BottomNavProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-[#f9f9fe]/95 backdrop-blur-xl border-t border-[#e8e8ed] shadow-[0_-2px_12px_rgba(15,30,54,0.06)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {/* Besök */}
        <button
          type="button"
          onClick={() => onTabChange('protocol')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] transition-colors active:scale-95 duration-150 ${
            currentTab === 'protocol' || currentTab === 'booking'
              ? 'text-[#4d5c78] font-bold'
              : 'text-[#75777e] hover:text-[#1a1c20]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'protocol' ? "'FILL' 1" : "'FILL' 0" }}
          >
            assignment_late
          </span>
          <span className="text-[11px] leading-none font-semibold">Besök</span>
        </button>

        {/* Ny Offert */}
        <button
          type="button"
          onClick={() => onTabChange('calculator')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] transition-colors active:scale-95 duration-150 ${
            currentTab === 'calculator' || currentTab === 'review'
              ? 'text-[#4d5c78] font-bold'
              : 'text-[#75777e] hover:text-[#1a1c20]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: currentTab === 'calculator' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            add_circle
          </span>
          <span className="text-[11px] leading-none font-semibold">Ny offert</span>
        </button>

        {/* Arkiv */}
        <button
          type="button"
          onClick={() => onTabChange('archive')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] transition-colors active:scale-95 duration-150 ${
            currentTab === 'archive'
              ? 'text-[#4d5c78] font-bold'
              : 'text-[#75777e] hover:text-[#1a1c20]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'archive' ? "'FILL' 1" : "'FILL' 0" }}
          >
            verified
          </span>
          <span className="text-[11px] leading-none font-semibold">Arkiv</span>
        </button>

        {/* Inställningar */}
        <button
          type="button"
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] transition-colors active:scale-95 duration-150 ${
            currentTab === 'settings'
              ? 'text-[#4d5c78] font-bold'
              : 'text-[#75777e] hover:text-[#1a1c20]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'settings' ? "'FILL' 1" : "'FILL' 0" }}
          >
            settings
          </span>
          <span className="text-[11px] leading-none font-semibold">Inställningar</span>
        </button>
      </div>
    </nav>
  );
};
