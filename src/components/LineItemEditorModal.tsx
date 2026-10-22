import React, { useState, useEffect } from 'react';
import { LineItem } from '../types/offert';

interface LineItemEditorModalProps {
  item: LineItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: LineItem) => void;
  onDelete?: (id: string) => void;
}

export const LineItemEditorModal: React.FC<LineItemEditorModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'arbete' | 'material'>('arbete');
  const [volume, setVolume] = useState(10);
  const [unit, setUnit] = useState('tim');
  const [unitPrice, setUnitPrice] = useState(750);
  const [isRotEligible, setIsRotEligible] = useState(true);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setCategory(item.category);
      setVolume(item.volume);
      setUnit(item.unit);
      setUnitPrice(item.unitPrice);
      setIsRotEligible(item.isRotEligible);
      setDescription(item.description || '');
    } else {
      setTitle('');
      setCategory('arbete');
      setVolume(8);
      setUnit('tim');
      setUnitPrice(790);
      setIsRotEligible(true);
      setDescription('');
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: item ? item.id : 'li_' + Date.now(),
      title: title.trim(),
      category,
      volume: Number(volume),
      unit,
      unitPrice: Number(unitPrice),
      isRotEligible: category === 'arbete' ? isRotEligible : false,
      description: description.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-[#4d5c78] text-white p-4 flex items-center justify-between">
          <h3 className="font-display font-bold text-sm">
            {item ? 'Justera kalkylrad' : 'Lägg till kalkylrad'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3 text-xs">
          {/* Category tabs */}
          <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setCategory('arbete');
                setUnit('tim');
                setIsRotEligible(true);
              }}
              className={`flex-1 py-1.5 rounded-md font-bold transition-all ${
                category === 'arbete'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Arbetsmoment (Timmar)
            </button>
            <button
              type="button"
              onClick={() => {
                setCategory('material');
                setUnit('post');
                setIsRotEligible(false);
              }}
              className={`flex-1 py-1.5 rounded-md font-bold transition-all ${
                category === 'material'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Material &amp; Fast pris
            </button>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-700">Benämning / Arbete</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="t.ex. Snickeri & Montering"
              className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Volume and Unit Price */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-700">Volym</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                required
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono-numbers font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-700">Enhet</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="h-10 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="tim">tim</option>
                <option value="st">st</option>
                <option value="lpm">lpm</option>
                <option value="m²">m²</option>
                <option value="post">post</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-700">À-pris (kr)</label>
              <input
                type="number"
                min="0"
                step="10"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono-numbers font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* ROT Eligibility */}
          {category === 'arbete' && (
            <label className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 cursor-pointer text-emerald-900">
              <input
                type="checkbox"
                checked={isRotEligible}
                onChange={(e) => setIsRotEligible(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-xs">
                Berättigad till ROT-avdrag (30% skattereduktion)
              </span>
            </label>
          )}

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-700">Beskrivning / Specifikation</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beskriv momentet eller materialet för kunden..."
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          {/* Row Total preview */}
          <div className="p-2.5 bg-slate-100 rounded-lg flex justify-between items-center text-slate-800">
            <span className="font-medium">Total för raden:</span>
            <span className="font-bold text-sm font-mono-numbers">
              {(volume * unitPrice).toLocaleString('sv-SE')} kr
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            {item && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(item.id);
                  onClose();
                }}
                className="px-3 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
              >
                Ta bort
              </button>
            )}

            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#4d5c78] hover:bg-[#3b537e] text-white font-bold text-xs shadow-sm transition-colors"
            >
              Spara rad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
