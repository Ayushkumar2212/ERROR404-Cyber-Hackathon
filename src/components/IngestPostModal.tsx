import React, { useState } from 'react';
import { X, Send, Building2, MapPin } from 'lucide-react';
import { CitizenPost, MasterTicket, Platform } from '../types/civic';
import { analyzeCivicPostText, clusterIntoMasterTicket } from '../utils/nlpTriage';

interface IngestPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterTickets: MasterTicket[];
  onCommitNewReport: (post: CitizenPost, masterTicket: MasterTicket, isNewCluster: boolean) => void;
}

export const IngestPostModal: React.FC<IngestPostModalProps> = ({
  isOpen,
  onClose,
  masterTickets,
  onCommitNewReport,
}) => {
  const [platform, setPlatform] = useState<Platform>('X');
  const [authorHandle, setAuthorHandle] = useState<string>('@patna_citizen_99');
  const [rawText, setRawText] = useState<string>(
    'Dak bungalow chowk ke paas open manhole hai barish me dikh nahi raha, accident ho sakta hai! @PatnaMunicipal'
  );
  const [mediaUrl, setMediaUrl] = useState<string>(
    'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80'
  );
  const [landmark, setLandmark] = useState<string>('Dak Bungalow Chowk');
  const [ward, setWard] = useState<string>('Ward 22');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const triage = analyzeCivicPostText(rawText, 25, 8);
    if (mediaUrl) {
      triage.computerVision = {
        hasVisualProof: true,
        defectsDetected: [
          {
            label: triage.department.includes('Road') ? 'pothole' :
                   triage.department.includes('Electricity') ? 'exposed_wire' :
                   triage.department.includes('Jal') ? 'waterlogging' : 'garbage_dump',
            confidence: 0.94,
            bbox: [30, 25, 45, 40],
            metrics: 'Defect verification confirmed'
          }
        ],
        pHash: 'a8b79921f06de104',
        isDuplicateMedia: false,
        similarityScore: 0.05
      };
    }

    const newPost: CitizenPost = {
      id: `post-${Date.now()}`,
      platform,
      authorHandle,
      authorName: authorHandle.replace('@', '').split('_')[0],
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rawText,
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaUrl ? 'image' : 'none',
      timestamp: new Date().toISOString(),
      likes: 25,
      shares: 8,
      comments: 3,
      location: {
        lat: 25.6105,
        lng: 85.1376,
        address: `${landmark}, Patna`,
        landmark,
        ward,
        city: 'Patna',
        locationCriticality: 9
      },
      triage
    };

    const cluster = clusterIntoMasterTicket(newPost, masterTickets);
    newPost.clusteredMasterTicketId = cluster.masterTicket.id;

    onCommitNewReport(newPost, cluster.masterTicket, cluster.isNewCluster);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-300 rounded-xl w-full max-w-lg p-5 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Log Public Grievance</h3>
            <p className="text-[11px] text-slate-500">Record citizen complaint from social handles or direct report</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-700 font-medium block mb-1">Source Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs"
              >
                <option value="X">X (Twitter)</option>
                <option value="Meta">Meta (Instagram/FB)</option>
                <option value="YouTube">YouTube</option>
                <option value="KioskDirect">Kiosk Direct</option>
              </select>
            </div>
            <div>
              <label className="text-slate-700 font-medium block mb-1">Citizen Handle / ID</label>
              <input
                type="text"
                value={authorHandle}
                onChange={(e) => setAuthorHandle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-medium block mb-1">Complaint Content (Hinglish/Hindi/English)</label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="text-slate-700 font-medium block mb-1">Site Photograph URL (Optional)</label>
            <input
              type="text"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-700 font-medium block mb-1">Landmark / Mohalla</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="text-slate-700 font-medium block mb-1">Municipal Ward</label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-semibold bg-blue-800 hover:bg-blue-900 text-white flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Process & Record Grievance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
