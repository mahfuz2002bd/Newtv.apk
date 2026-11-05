import React, { useState } from 'react';
import { 
  X, 
  Link2, 
  Upload, 
  Check, 
  Play, 
  AlertCircle, 
  Sparkles, 
  Radio, 
  RotateCcw,
  Film
} from 'lucide-react';
import { PLAYLIST_PRESETS } from '../data/defaultPlaylists';
import { PlaylistPreset } from '../types/iptv';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onLoadUrl: (url: string, name?: string) => void;
  onLoadFileContent: (content: string, name?: string) => void;
  onPlayDirectStream: (streamUrl: string, channelName?: string) => void;
  isLoading: boolean;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onLoadUrl,
  onLoadFileContent,
  onPlayDirectStream,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'url' | 'file' | 'direct'>('presets');
  const [inputUrl, setInputUrl] = useState<string>(currentUrl);
  const [directStreamUrl, setDirectStreamUrl] = useState<string>('');
  const [directStreamName, setDirectStreamName] = useState<string>('কাস্টম স্ট্রিম (Direct Stream)');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onLoadFileContent(content, file.name);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onLoadUrl(inputUrl.trim(), 'কাস্টম প্লেলিস্ট');
      onClose();
    }
  };

  const handleDirectStreamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (directStreamUrl.trim()) {
      onPlayDirectStream(directStreamUrl.trim(), directStreamName.trim() || 'Direct Stream');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                আইপিটিভি প্লেলিস্ট ও চ্যানেল সেটিংস
              </h3>
              <p className="text-[11px] text-slate-400">
                BDIX বা আপনার পছন্দের M3U / M3U8 লিংক যুক্ত করুন
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 px-4 pt-2 bg-slate-950/40 text-xs">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'presets'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            প্রিসেট প্লেলিস্ট
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'url'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            M3U লিংক
          </button>

          <button
            onClick={() => setActiveTab('file')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'file'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ফাইল আপলোড
          </button>

          <button
            onClick={() => setActiveTab('direct')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'direct'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            সিঙ্গেল স্ট্রিম
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
          {/* TAB 1: PRESET PLAYLISTS */}
          {activeTab === 'presets' && (
            <div className="space-y-2.5">
              <p className="text-[11px] text-slate-400 mb-2">
                নিচে দেওয়া প্রস্তুতকৃত প্লেলিস্ট থেকে নির্বাচন করুন:
              </p>
              {PLAYLIST_PRESETS.map((preset) => {
                const isSelected = currentUrl === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onLoadUrl(preset.url, preset.name);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="space-y-1 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-sm">
                          {preset.name}
                        </span>
                        {preset.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                            preset.isBdix 
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                              : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                          }`}>
                            {preset.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {preset.description}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                          <Play className="w-3.5 h-3.5 ml-0.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: CUSTOM URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  M3U বা M3U8 Playlist URL (ওয়েব লিংক)
                </label>
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com/bdix-iptv.m3u"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  যেকোনো সরাসরি M3U লিংক পেস্ট করুন। CORS প্রক্সি স্বয়ংক্রিয়ভাবে সক্রিয় হবে।
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300">ডিফল্ট BDIX লিংক:</span>
                <p className="font-mono text-slate-500 break-all select-all">
                  https://raw.githubusercontent.com/abusaeeidx/Mrgify-BDIX-IPTV/refs/heads/main/playlist.m3u
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>লোড হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>প্লেলিস্ট লোড করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: LOCAL FILE UPLOAD */}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50 hover:bg-slate-950">
                <Upload className="w-10 h-10 text-indigo-400 mb-2" />
                <span className="font-semibold text-slate-200 text-sm">
                  কম্পিউটার বা ডিভাইস থেকে .m3u ফাইল সিলেক্ট করুন
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  সাপোর্টেড ফরম্যাট: .m3u, .m3u8, .txt
                </span>
                <input
                  type="file"
                  accept=".m3u,.m3u8,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* TAB 4: DIRECT SINGLE STREAM */}
          {activeTab === 'direct' && (
            <form onSubmit={handleDirectStreamSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  চ্যানেলের নাম (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={directStreamName}
                  onChange={(e) => setDirectStreamName(e.target.value)}
                  placeholder="যেমন: My BDIX Sports"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  সরাসরি HLS Stream URL (.m3u8)
                </label>
                <input
                  type="url"
                  value={directStreamUrl}
                  onChange={(e) => setDirectStreamUrl(e.target.value)}
                  placeholder="https://example.com/live/channel.m3u8"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>সরাসরি স্ট্রিম চালান</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onLoadUrl(PLAYLIST_PRESETS[0].url, PLAYLIST_PRESETS[0].name);
              onClose();
            }}
            className="text-xs text-slate-400 hover:text-indigo-400 flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ডিফল্ট BDIX রিস্টোর করুন</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
