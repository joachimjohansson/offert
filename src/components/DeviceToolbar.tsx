import React from 'react';
import { DeviceMode, TradeProject } from '../types/offert';
import { Smartphone, Tablet, Monitor, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';

interface DeviceToolbarProps {
  deviceMode: DeviceMode;
  onDeviceChange: (mode: DeviceMode) => void;
  projects: TradeProject[];
  activeProjectId: string;
  onProjectChange: (id: string) => void;
  onResetData: () => void;
  onOpenPdf: () => void;
}

export const DeviceToolbar: React.FC<DeviceToolbarProps> = ({
  deviceMode,
  onDeviceChange,
  projects,
  activeProjectId,
  onProjectChange,
  onResetData,
  onOpenPdf,
}) => {
  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="bg-[#1e232d] text-white border-b border-slate-700/60 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-[100] shadow-md select-none">
      {/* Device Mode Switcher */}
      <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
        <span className="text-[11px] font-semibold text-slate-400 px-1.5 uppercase tracking-wider">
          Enhet:
        </span>
        <button
          type="button"
          onClick={() => onDeviceChange('mobile')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
            deviceMode === 'mobile'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
          title="Mobilvy (390px)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobil (iPhone)</span>
        </button>
        <button
          type="button"
          onClick={() => onDeviceChange('tablet')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
            deviceMode === 'tablet'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
          title="Surfplattevy (820px)"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Surfplatta (iPad)</span>
        </button>
        <button
          type="button"
          onClick={() => onDeviceChange('desktop')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
            deviceMode === 'desktop'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
          title="Full skrivbordsvy"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Skrivbord (1280px)</span>
        </button>
      </div>

      {/* Trade Project Selector */}
      <div className="flex items-center gap-2">
        <span className="text-slate-400 text-[11px] hidden sm:inline">Projekt:</span>
        <select
          value={activeProjectId}
          onChange={(e) => onProjectChange(e.target.value)}
          className="bg-slate-800 text-white border border-slate-700 text-xs rounded-md px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.category}) {p.status === 'signerad' ? '✓ Signerad' : ''}
            </option>
          ))}
        </select>
        {activeProject?.status === 'signerad' && (
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            BankID Signerad
          </span>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenPdf}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          title="Visa Offert-PDF"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>Granska PDF</span>
        </button>

        <button
          type="button"
          onClick={onResetData}
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-[11px]"
          title="Återställ demo-data"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Återställ</span>
        </button>
      </div>
    </div>
  );
};
