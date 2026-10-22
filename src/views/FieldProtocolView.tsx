import React, { useState, useEffect } from 'react';
import { TradeProject, SitePhoto } from '../types/offert';
import { formatDuration } from '../utils/calc';

interface FieldProtocolViewProps {
  project: TradeProject;
  onUpdateProject: (updated: Partial<TradeProject>) => void;
  onProceedToCalculator: () => void;
  onOpenPhotoLightbox: (photo: SitePhoto) => void;
}

export const FieldProtocolView: React.FC<FieldProtocolViewProps> = ({
  project,
  onUpdateProject,
  onProceedToCalculator,
  onOpenPhotoLightbox,
}) => {
  const [seconds, setSeconds] = useState(project.visitSeconds || 24 * 60 + 22);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [voiceToast, setVoiceToast] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Live visit timer
  useEffect(() => {
    if (!project.isTimerRunning) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        onUpdateProject({ visitSeconds: next });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [project.isTimerRunning]);

  // Voice memo recording timer
  useEffect(() => {
    let recTimer: any;
    if (isRecording) {
      setRecordSeconds(0);
      recTimer = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(recTimer);
  }, [isRecording]);

  const handleToggleVoiceMemo = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      setVoiceToast('Memo sparat & transkriberat via Whisper AI!');
      const newMemo = {
        id: 'vm_' + Date.now(),
        duration: `00:${recordSeconds < 10 ? '0' : ''}${recordSeconds} min`,
        recordedAt: 'Just nu',
        transcription:
          'Kunden önskar placering av fördelarskåp i städskrubben. Extra kulventil med avtappning krävs för golvvärmeslinga.',
      };
      onUpdateProject({
        voiceMemos: [newMemo, ...(project.voiceMemos || [])],
      });
      setTimeout(() => {
        setVoiceToast('');
      }, 4000);
    }
  };

  const handleToggleCheckItem = (id: string) => {
    const updated = project.checkList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    onUpdateProject({ checkList: updated });
  };

  const handleAddSamplePhoto = () => {
    const newPhoto: SitePhoto = {
      id: 'p_' + Date.now(),
      title: 'Detalj avstängningsventil',
      description: 'Nytt foto sparat under fältkontroll.',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBupfs7bnmRGpviqF5zxSwDabP627mvuW_64Hjl4YVq66tT8iUIsGpFmmvNzzCRa7Qfi9_LZWMvAy6nCYq8h9pwWWHmFGFFcC4Bae96aJGpvgsIK47hHTKVSJ_KOLpdeTm9-i3KNYcC3-PlU8KnFFf0IeibwOKRoWbZLoW-ACDPISbGJdDCTyA0cokDiu9QaMvv_Oc6cGuOu1_xgE5HeGrDTl7UV2fpgA3XpvAwZx78qE7HQ2-trSiC',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: 'Detalj ventil',
      icon: 'straighten',
      selectedForPdf: true,
      annotation: 'Mätning godkänd',
    };
    onUpdateProject({
      photos: [...project.photos, newPhoto],
    });
  };

  return (
    <div className="flex flex-col w-full pb-28 animate-fadeIn">
      {/* Top Protocol Badge on Desktop */}
      <div className="hidden lg:flex items-center justify-between px-4 py-2 text-xs text-[#555e72] border-b border-[#e8e8ed]">
        <div className="flex items-center gap-2 font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#4d5c78] animate-ping"></span>
          <span>FÄLTPROTOKOLL • PROTOKOLL-ID: FP-2025-0884 • HANDLÄGGARE: MARCUS EKSTRÖM</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Stämplat med GPS &amp; certifierad tidstämpel</span>
        </div>
      </div>

      {/* Main Hero Card (Villa Lindgren) */}
      <div className="px-4 pt-3 pb-3">
        <div className="bg-[#657592] text-white rounded-xl p-4 shadow-md relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full bg-[#555e72]/30 pointer-events-none blur-xl"></div>

          {/* Top Row: Tag & Live Stopwatch */}
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[#d5e3ff]">
              <span className="w-2 h-2 rounded-full bg-[#d5e3ff] animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Fältdokumentation
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-white">
              <span className="material-symbols-outlined text-[16px] text-[#dae2f9]">schedule</span>
              <span className="text-sm font-bold font-mono-numbers">{formatDuration(seconds)}</span>
            </div>
          </div>

          {/* Title & Location */}
          <div className="relative z-10 mt-1">
            <h2 className="font-display text-[24px] text-white font-bold tracking-tight">
              {project.title}
            </h2>
            <div className="flex items-center gap-1.5 text-[#d5e3ff] text-xs mt-0.5">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span>{project.address}</span>
              <span className="text-white/40">•</span>
              <span>Fastighet: {project.propertyDesignation}</span>
            </div>
          </div>

          {/* 3 Metric Summary Boxes */}
          <div className="mt-3.5 pt-2 grid grid-cols-3 gap-2 relative z-10 border-t border-white/10">
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <span className="block text-[11px] text-white/70">Typ</span>
              <span className="text-xs font-bold text-white">{project.category}</span>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <span className="block text-[11px] text-white/70">ROT</span>
              <span className="text-xs font-bold text-[#dae2f9]">
                {project.rotEnabled ? `Godkänd (${project.rotPercent}%)` : 'Ej vald'}
              </span>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <span className="block text-[11px] text-white/70">Status</span>
              <span className="text-xs font-bold text-white capitalize">
                {project.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Foton från platsen */}
      <section className="px-4 mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4d5c78] text-[22px]">
              photo_library
            </span>
            <h3 className="font-display text-[16px] text-[#1a1c20] font-bold">
              Foton från platsen
            </h3>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[#e8e8ed] text-[#1a1c20] font-semibold">
            {project.photos.length} tagna
          </span>
        </div>

        {/* 2x2 Photo Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          {project.photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onOpenPhotoLightbox(photo)}
              className="relative rounded-xl overflow-hidden bg-[#e8e8ed] shadow-sm group cursor-pointer aspect-[4/3] border border-[#e8e8ed]"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  // Fallback styled visual container
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1c34]/85 via-black/20 to-transparent flex items-end p-2.5">
                <span className="inline-flex items-center gap-1 text-xs text-white font-medium truncate">
                  <span className="material-symbols-outlined text-[15px] text-[#dae2f9]">
                    {photo.icon || 'straighten'}
                  </span>
                  <span className="truncate">{photo.tag || photo.title}</span>
                </span>
              </div>
              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-sm text-white text-[10px] font-mono-numbers">
                {photo.timestamp}
              </span>
              <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[14px]">zoom_in</span>
              </span>
            </div>
          ))}
        </div>

        {/* Add photo button */}
        <button
          type="button"
          onClick={handleAddSamplePhoto}
          className="w-full h-12 bg-white hover:bg-[#f3f3f9] active:bg-[#e8e8ed] text-[#4d5c78] rounded-xl flex items-center justify-center gap-2 border border-[#c5c6ce] shadow-sm text-xs font-bold transition-all"
        >
          <span className="material-symbols-outlined text-[#4d5c78] text-[20px]">add_a_photo</span>
          <span>Ta nytt foto / Välj bild</span>
        </button>
      </section>

      {/* Section: Kundens önskemål & anteckningar */}
      <section className="px-4 mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4d5c78] text-[22px]">
              description
            </span>
            <h3 className="font-display text-[16px] text-[#1a1c20] font-bold">
              Kundens önskemål &amp; anteckningar
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e8e8ed] p-4 shadow-sm mb-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f3f3f9]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#d7e0f6] flex items-center justify-center text-[#4d5c78]">
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
              </div>
              <span className="text-xs font-bold text-[#1a1c20]">Projektpunkter</span>
            </div>
            <span className="text-[11px] text-[#75777e]">Senast ändrad 11:42</span>
          </div>

          <ul className="space-y-2">
            {project.notes.map((note) => (
              <li
                key={note.id}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#f3f3f9] text-[#1a1c20]"
              >
                <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1a1c20] leading-tight">{note.title}</p>
                  <span className="text-[11px] text-[#555e72] mt-0.5 block">{note.subtitle}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Voice Memo Audio Player (if recorded) */}
          {project.voiceMemos && project.voiceMemos.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-[#eeedf3] border border-[#e2e2e7] flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1a1c20]">
                  <span className="material-symbols-outlined text-[#4d5c78] text-[18px]">mic</span>
                  <span>Röstmemo ({project.voiceMemos[0].duration})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="inline-flex items-center gap-1 text-[#4d5c78] hover:text-[#374762] text-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPlayingAudio ? 'pause_circle' : 'play_circle'}
                  </span>
                  <span>{isPlayingAudio ? 'Pausar' : 'Lyssna'}</span>
                </button>
              </div>
              <p className="text-xs italic text-[#44474d] bg-white p-2 rounded border border-[#e8e8ed]">
                "{project.voiceMemos[0].transcription}"
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#75777e]">
                <span>Transkriberad via Whisper AI</span>
                <span>{project.voiceMemos[0].recordedAt}</span>
              </div>
            </div>
          )}

          {/* Voice memo record button */}
          <div className="mt-3 pt-2">
            <button
              type="button"
              onClick={handleToggleVoiceMemo}
              className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 shadow-sm text-xs font-bold transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-[#4d5c78] hover:bg-[#3b537e] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isRecording ? 'stop_circle' : 'mic'}
              </span>
              <span>
                {isRecording
                  ? `Spelar in memo... (${recordSeconds}s) Tryck för att stoppa`
                  : 'Spela in röstmemo (AI transkribering)'}
              </span>
            </button>
          </div>

          {voiceToast && (
            <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold text-center animate-fadeIn">
              ✓ {voiceToast}
            </div>
          )}
        </div>
      </section>

      {/* Section: Checklista för fältkontroll */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4d5c78] text-[22px]">
              fact_check
            </span>
            <h3 className="font-display text-[16px] text-[#1a1c20] font-bold">
              Checklista för fältkontroll
            </h3>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Klar för offert
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#e8e8ed] p-2 shadow-sm space-y-1">
          {project.checkList.map((item) => (
            <label
              key={item.id}
              onClick={() => handleToggleCheckItem(item.id)}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#f3f3f9] active:bg-[#eeedf3] cursor-pointer select-none transition-colors"
            >
              <div
                className={`w-6 h-6 rounded flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                  item.checked ? 'bg-[#4d5c78] text-white' : 'border border-[#c5c6ce] bg-white'
                }`}
              >
                {item.checked && (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-[#1a1c20] block">{item.label}</span>
                <span className="text-[11px] text-[#555e72] block mt-0.5">{item.description}</span>
              </div>
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                verified
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-0 z-30 bg-[#f9f9fe]/95 backdrop-blur-md px-4 pt-2 pb-4 shadow-[0_-4px_16px_rgba(15,30,54,0.08)] border-t border-[#e8e8ed]">
        <button
          type="button"
          onClick={onProceedToCalculator}
          className="w-full h-14 bg-[#4d5c78] hover:bg-[#3b537e] text-white rounded-xl flex items-center justify-between px-4 shadow-md transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-[18px]">directions_car</span>
            </div>
            <span className="font-display text-[15px] font-bold text-left leading-tight text-white">
              Avsluta besök &amp; Bygg offert i bilen
            </span>
          </div>
          <span className="material-symbols-outlined text-[24px] text-[#dae2f9]">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
};
