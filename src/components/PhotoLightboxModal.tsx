import React from 'react';
import { SitePhoto } from '../types/offert';

interface PhotoLightboxModalProps {
  photo: SitePhoto | null;
  isOpen: boolean;
  onClose: () => void;
  onTogglePdfInclude: (photoId: string) => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  photo,
  isOpen,
  onClose,
  onTogglePdfInclude,
}) => {
  if (!isOpen || !photo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1a1c20] text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d5e3ff] text-[20px]">
              {photo.icon || 'photo_camera'}
            </span>
            <span className="font-display font-bold text-sm truncate">{photo.title}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Big Photo Container */}
        <div className="relative bg-black flex items-center justify-center overflow-hidden max-h-[50vh]">
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-full max-h-[50vh] object-contain"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-xs font-mono-numbers">
            Tid: {photo.timestamp}
          </div>
        </div>

        {/* Content & Details */}
        <div className="p-4 flex flex-col gap-3 overflow-y-auto">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Beskrivning &amp; fältobservation
            </span>
            <p className="text-sm text-slate-800 mt-0.5 leading-relaxed">
              {photo.description}
            </p>
          </div>

          {photo.annotation && (
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-blue-700 shrink-0">
                straighten
              </span>
              <div>
                <span className="font-bold block">Mätdata &amp; tolerans:</span>
                <span>{photo.annotation}</span>
              </div>
            </div>
          )}

          {/* Toggle PDF inclusion */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4d5c78] text-[20px]">
                picture_as_pdf
              </span>
              <span className="text-xs font-bold text-slate-900">
                Inkludera i offertunderlag (PDF)
              </span>
            </div>
            <input
              type="checkbox"
              checked={photo.selectedForPdf}
              onChange={() => onTogglePdfInclude(photo.id)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </label>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#4d5c78] hover:bg-[#3b537e] text-white font-bold text-xs rounded-xl transition-colors"
          >
            Tillbaka till fältprotokoll
          </button>
        </div>
      </div>
    </div>
  );
};
