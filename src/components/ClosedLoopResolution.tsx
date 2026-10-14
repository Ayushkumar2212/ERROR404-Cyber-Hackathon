import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Send, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Building2,
  AlertCircle
} from 'lucide-react';
import { MasterTicket } from '../types/civic';

interface ClosedLoopResolutionProps {
  masterTickets: MasterTicket[];
  onResolveTicket: (
    ticketId: string, 
    evidence: {
      afterImageUrl: string;
      officerName: string;
      officerBadge: string;
      notes: string;
      botReplyText: string;
    }
  ) => void;
}

const REPAIR_AFTER_PHOTOS: Record<string, string> = {
  'Pothole / Road Damage': 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80',
  'Live Wire / Sparking': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
  'Garbage Dump Overflow': 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
  'Sewage / Pipe Burst': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
};

export const ClosedLoopResolution: React.FC<ClosedLoopResolutionProps> = ({
  masterTickets,
  onResolveTicket,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(masterTickets[0]?.id || 'AK-9042');
  const [officerName, setOfficerName] = useState<string>('Er. Vikramaditya Prasad');
  const [officerBadge, setOfficerBadge] = useState<string>('PAT-MUNICIPAL-402');
  const [resolutionNotes, setResolutionNotes] = useState<string>(
    'Field squad dispatched to site. Defect repaired and site cleared. Traffic flow restored safely.'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [dispatchedReply, setDispatchedReply] = useState<string | null>(null);

  const activeTicket = masterTickets.find(t => t.id === selectedTicketId) || masterTickets[0];
  const isAlreadyResolved = activeTicket?.status === 'RESOLVED_VERIFIED';

  const defaultAfterPhoto = REPAIR_AFTER_PHOTOS[activeTicket?.category || 'Pothole / Road Damage'] || 
    'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80';
  const [afterImageUrl, setAfterImageUrl] = useState<string>(defaultAfterPhoto);

  const handleExecuteResolution = async () => {
    if (!activeTicket) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/dispatch-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: activeTicket.id,
          citizenHandle: '@bihar_vigilant',
          department: activeTicket.department,
          landmark: activeTicket.landmark,
          resolutionNotes,
          officerBadge,
        }),
      });

      const data = await res.json();
      const botText = data.replyText || `Issue resolved under Municipal Ticket #${activeTicket.id}. Field verification completed by ${activeTicket.department} (Officer ${officerBadge}). Site clear. Thank you for reporting!`;

      setDispatchedReply(botText);
      onResolveTicket(activeTicket.id, {
        afterImageUrl,
        officerName,
        officerBadge,
        notes: resolutionNotes,
        botReplyText: botText,
      });
    } catch {
      const fallbackText = `Issue resolved under Municipal Ticket #${activeTicket.id}. Field verification completed by ${activeTicket.department}. Thank you for reporting!`;
      setDispatchedReply(fallbackText);
      onResolveTicket(activeTicket.id, {
        afterImageUrl,
        officerName,
        officerBadge,
        notes: resolutionNotes,
        botReplyText: fallbackText,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Field Resolution & Citizen Feedback Loop
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                SLA Compliance Desk
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Ward field squads upload verified restoration photographs. The system closes the ticket and dispatches resolution status to the citizen.
            </p>
          </div>
        </div>

        {/* SLA Status Pill */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-slate-600 font-sans">Monthly SLA Compliance:</span>
          <strong className="text-emerald-700">96.8%</strong>
        </div>
      </div>

      {/* Main Grid: Ticket List (4 cols) + Inspection & Resolution (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Ticket Selector Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-blue-700" />
            Field Dispatch Queue ({masterTickets.length})
          </h3>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {masterTickets.map((ticket) => {
              const isSelected = activeTicket?.id === ticket.id;
              const isResolved = ticket.status === 'RESOLVED_VERIFIED';

              return (
                <div
                  key={ticket.id}
                  onClick={() => {
                    setSelectedTicketId(ticket.id);
                    setAfterImageUrl(REPAIR_AFTER_PHOTOS[ticket.category] || defaultAfterPhoto);
                    setDispatchedReply(ticket.resolutionEvidence?.botReplyText || null);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-300 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-blue-900">#{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isResolved
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : ticket.priorityTier === 'CRITICAL_P0'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {isResolved ? 'RESOLVED' : ticket.priorityTier}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-900 mt-1 truncate">
                    {ticket.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {ticket.landmark} • {ticket.ward}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
                    <span>{ticket.citizenUpvotesCount} Citizen Reports</span>
                    <span className="text-amber-700 font-mono">SLA: 2h Target</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resolution Inspection & Before/After Comparison (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    #{activeTicket?.id}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    {activeTicket?.department}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {activeTicket?.title}
                </h3>
              </div>

              {isAlreadyResolved && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  CLOSED & CITIZEN NOTIFIED
                </span>
              )}
            </div>

            {/* Before vs After Visual Verification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* BEFORE: Citizen Defect Report */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-bold text-red-700 text-[11px]">
                    BEFORE: Citizen Defect Report
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Original Upload</span>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-slate-200 h-44">
                  {activeTicket?.primaryImageUrl ? (
                    <img 
                      src={activeTicket.primaryImageUrl} 
                      alt="Before repair" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No Photo Available
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 bg-white/95 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[10px] font-semibold shadow-xs">
                    Reported Hazard
                  </span>
                </div>
              </div>

              {/* AFTER: Field Repair Proof */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-bold text-emerald-800 text-[11px]">
                    AFTER: Field Restoration Proof
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Site Inspection</span>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-emerald-200 h-44">
                  <img 
                    src={afterImageUrl} 
                    alt="After repair proof" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-white/95 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold shadow-xs">
                    Repair Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Officer Details & Resolution Notes */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Field Engineer / Squad Officer
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  disabled={isAlreadyResolved}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Official Badge / Municipal Squad ID
                </label>
                <input
                  type="text"
                  value={officerBadge}
                  onChange={(e) => setOfficerBadge(e.target.value)}
                  disabled={isAlreadyResolved}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">
                Resolution Action & Materials Audit Notes:
              </label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                disabled={isAlreadyResolved}
                rows={2}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
              />
            </div>

            {/* Official Citizen Feedback Dispatch Preview */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-800">
                <span className="flex items-center gap-1.5 font-bold">
                  <Building2 className="w-3.5 h-3.5 text-blue-700" />
                  Official Citizen Notification Dispatch
                </span>
                <span className="text-[11px] text-slate-500">Automated Notification</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed flex items-start gap-2.5 shadow-xs">
                <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                  MC
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-[11px] mb-0.5">
                    Municipal Corporation Grievance Desk <span className="text-slate-500 font-normal">@PatnaMunicipalGov</span>
                  </div>
                  <p className="text-slate-700 italic text-[11px]">
                    "{dispatchedReply || `Issue resolved under Municipal Ticket #${activeTicket?.id}. Field verification completed by ${activeTicket?.department} (${officerBadge}). Site clear and restored. Thank you for reporting!`}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={handleExecuteResolution}
              disabled={isSubmitting || isAlreadyResolved}
              className="w-full py-2.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Closing Ticket & Dispatching Citizen Notice...</span>
                </>
              ) : isAlreadyResolved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Issue Resolved & Citizens Notified</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Close Issue & Dispatch Citizen Notification (Ticket #{activeTicket?.id})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
