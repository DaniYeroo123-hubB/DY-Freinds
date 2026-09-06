import React, { useState } from 'react';
import { FriendshipProfile } from '../types';
import { X, Check, Heart, User, Calendar, MessageSquare } from 'lucide-react';

interface CustomizeModalProps {
  isOpen: boolean;
  profile: FriendshipProfile;
  onClose: () => void;
  onSave: (updated: FriendshipProfile) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<FriendshipProfile>({ ...profile });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div
      id="customize-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        id="customize-modal-content"
        className="w-full max-w-md bg-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-rose-500/10 text-white select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Heart className="w-4 h-4 fill-rose-400" />
            </div>
            <h3 className="text-lg font-serif font-bold">Personalize Friendship Story</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-zinc-400 font-medium mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Your Name (Friend 1)</span>
            </label>
            <input
              type="text"
              value={form.person1}
              onChange={(e) => setForm({ ...form, person1: e.target.value })}
              required
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition-colors"
              placeholder="e.g. Maya"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-400" />
              <span>Best Friend's Name (Friend 2)</span>
            </label>
            <input
              type="text"
              value={form.person2}
              onChange={(e) => setForm({ ...form, person2: e.target.value })}
              required
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-400 transition-colors"
              placeholder="e.g. Liam"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Meet Year</span>
              </label>
              <input
                type="number"
                value={form.startYear}
                onChange={(e) => setForm({ ...form, startYear: parseInt(e.target.value) || 2015 })}
                min="1980"
                max="2026"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Current Year</span>
              </label>
              <input
                type="number"
                value={form.currentYear}
                onChange={(e) => setForm({ ...form, currentYear: parseInt(e.target.value) || 2026 })}
                min="2015"
                max="2035"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Custom Friendship Motto</span>
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400 transition-colors"
              placeholder="e.g. Side by side or miles apart, friends are forever."
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold shadow-lg shadow-rose-500/20 hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Update Story</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
