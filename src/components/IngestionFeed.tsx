import React, { useState } from 'react';
import { 
  Radio, 
  Filter, 
  Share2, 
  MessageSquare, 
  Heart, 
  MapPin, 
  AlertCircle, 
  CheckCircle, 
  Ban, 
  Layers, 
  ArrowRight
} from 'lucide-react';
import { CitizenPost } from '../types/civic';

interface IngestionFeedProps {
  posts: CitizenPost[];
  onInspectPost: (post: CitizenPost) => void;
  onViewOnMap: (postId: string) => void;
}

export const IngestionFeed: React.FC<IngestionFeedProps> = ({
  posts,
  onInspectPost,
  onViewOnMap,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CIVIC' | 'NOISE'>('CIVIC');
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'CIVIC' && !post.triage.isCivicComplaint) return false;
    if (activeFilter === 'NOISE' && post.triage.isCivicComplaint) return false;
    if (platformFilter !== 'ALL' && post.platform !== platformFilter) return false;
    return true;
  });

  const civicCount = posts.filter(p => p.triage.isCivicComplaint).length;
  const noiseCount = posts.filter(p => !p.triage.isCivicComplaint).length;

  return (
    <div className="space-y-4">
      {/* Feed Filters Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Public Grievance Monitoring Stream
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Monitoring
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Live citizen grievances from social media handles (@PatnaMunicipal, @PWD_Bihar, @ElectricityBihar), civic hashtags & municipal forms
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveFilter('CIVIC')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFilter === 'CIVIC'
                  ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-blue-700" />
              Civic Complaints ({civicCount})
            </button>

            <button
              onClick={() => setActiveFilter('NOISE')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFilter === 'NOISE'
                  ? 'bg-white text-red-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ban className="w-3.5 h-3.5 text-red-600" />
              Filtered Noise ({noiseCount})
            </button>

            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Feeds ({posts.length})
            </button>
          </div>

          {/* Platform Dropdown */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-transparent text-slate-700 outline-none text-xs cursor-pointer font-medium"
            >
              <option value="ALL">All Platforms</option>
              <option value="X">X (Twitter)</option>
              <option value="Meta">Meta (Instagram/FB)</option>
              <option value="YouTube">YouTube</option>
              <option value="KioskDirect">Kiosk Direct</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => {
          const isCivic = post.triage.isCivicComplaint;
          const isP0 = post.triage.dynamicPriority.priorityTier === 'CRITICAL_P0';

          return (
            <div
              key={post.id}
              className={`bg-white border rounded-xl p-4 flex flex-col justify-between shadow-xs transition-all hover:border-slate-300 ${
                !isCivic ? 'border-slate-200 bg-slate-50/70' : isP0 ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'
              }`}
            >
              {/* Card Header: Author, Platform & Ingestion Time */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.avatarUrl}
                      alt={post.authorName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{post.authorName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{post.authorHandle}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <span className="text-blue-700 font-semibold">{post.platform}</span>
                        <span>•</span>
                        <span>{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Classification Badge */}
                  <div className="flex flex-col items-end gap-1">
                    {isCivic ? (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isP0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        Priority: {post.triage.dynamicPriority.computedScore.toFixed(1)}/10
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                        <Ban className="w-2.5 h-2.5" />
                        DROPPED: {post.triage.noiseCategory?.toUpperCase() || 'SPAM'}
                      </span>
                    )}

                    <span className="text-[10px] text-slate-500 font-mono">
                      {post.triage.languageDetected}
                    </span>
                  </div>
                </div>

                {/* Raw Post Text */}
                <div className="mt-3 text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {post.rawText}
                </div>

                {/* Media with Defect Bounding Box */}
                {post.mediaUrl && isCivic && (
                  <div className="mt-2.5 relative rounded-lg overflow-hidden border border-slate-200">
                    <img 
                      src={post.mediaUrl} 
                      alt="Citizen defect proof" 
                      className="w-full h-36 object-cover"
                    />

                    {/* Defect Bounding Box */}
                    {post.triage.computerVision?.defectsDetected.map((defect, i) => (
                      <div
                        key={i}
                        style={{
                          top: `${defect.bbox[0]}%`,
                          left: `${defect.bbox[1]}%`,
                          width: `${defect.bbox[2]}%`,
                          height: `${defect.bbox[3]}%`,
                        }}
                        className="absolute border-2 border-red-600 bg-red-600/15 rounded pointer-events-none"
                      >
                        <span className="bg-red-700 text-white text-[8px] font-mono px-1 py-0.5 self-start font-bold">
                          {defect.label} {(defect.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}

                    <div className="absolute top-2 right-2 bg-white/95 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-mono shadow-xs">
                      pHash: {post.triage.computerVision?.pHash.slice(0, 8)}...
                      {post.triage.computerVision?.isDuplicateMedia && ' [DUPLICATE]'}
                    </div>
                  </div>
                )}

                {/* Department & Entities */}
                {isCivic && (
                  <div className="mt-3 space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] uppercase text-slate-500 font-bold">
                        Dept:
                      </span>
                      <span className="text-xs font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {post.triage.department}
                      </span>
                      <span className="text-[11px] text-blue-700 font-medium">
                        ({(post.triage.departmentConfidence * 100).toFixed(0)}% match)
                      </span>
                    </div>

                    {/* Entities */}
                    <div className="flex flex-wrap items-center gap-1 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      {post.triage.entities.mohallas.map((m, i) => (
                        <span key={i} className="bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.2 rounded text-[11px] font-medium">
                          {m}
                        </span>
                      ))}
                      {post.triage.entities.landmarks.map((l, i) => (
                        <span key={i} className="bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.2 rounded text-[11px]">
                          {l}
                        </span>
                      ))}
                      {post.triage.entities.wardNumber && (
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.2 rounded text-[11px] font-semibold">
                          {post.triage.entities.wardNumber}
                        </span>
                      )}
                    </div>

                    {/* Emergency Hazard Notice */}
                    {post.triage.entities.emergencyKeywords.length > 0 && (
                      <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-1 rounded text-xs font-medium text-red-700">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>Hazard Overrides:</span>
                        <strong className="text-red-800">"{post.triage.entities.emergencyKeywords.join(', ')}"</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer: Engagement & Deduplication */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5" /> {post.shares}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> {post.comments}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {post.clusteredMasterTicketId && (
                    <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1">
                      <Layers className="w-3 h-3 text-blue-700" />
                      Merged into #{post.clusteredMasterTicketId}
                    </span>
                  )}

                  <button
                    onClick={() => onInspectPost(post)}
                    className="px-2 py-1 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
