import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Layers, 
  Building2, 
  Filter, 
  ArrowUpRight,
  Eye, 
  CheckCircle2, 
  Flame,
  ThumbsUp,
  ShieldAlert
} from 'lucide-react';
import { MasterTicket } from '../types/civic';

interface GISCommandCenterProps {
  masterTickets: MasterTicket[];
  onSelectTicket: (ticket: MasterTicket) => void;
  onOpenResolution: (ticket: MasterTicket) => void;
}

export const GISCommandCenter: React.FC<GISCommandCenterProps> = ({
  masterTickets,
  onSelectTicket,
  onOpenResolution,
}) => {
  const [selectedWard, setSelectedWard] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [activeTicket, setActiveTicket] = useState<MasterTicket | null>(masterTickets[0] || null);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);

  const filteredTickets = masterTickets.filter(ticket => {
    if (selectedWard !== 'ALL' && ticket.ward !== selectedWard) return false;
    if (selectedDept !== 'ALL' && ticket.department !== selectedDept) return false;
    return true;
  });

  const departmentCounts = {
    pwd: masterTickets.filter(t => t.department.includes('PWD')).length,
    discom: masterTickets.filter(t => t.department.includes('DISCOM')).length,
    jal: masterTickets.filter(t => t.department.includes('Jal')).length,
    waste: masterTickets.filter(t => t.department.includes('Municipal')).length,
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'CRITICAL_P0': return 'text-red-700 bg-red-50 border-red-200';
      case 'HIGH_P1': return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'MEDIUM_P2': return 'text-blue-800 bg-blue-50 border-blue-200';
      default: return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Master Incidents</span>
            <Layers className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {masterTickets.length}
            <span className="text-xs font-normal text-slate-500 ml-1.5">Master Tickets</span>
          </div>
          <div className="text-xs text-blue-700 mt-1.5 flex items-center gap-1 font-medium">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{masterTickets.reduce((acc, t) => acc + t.citizenUpvotesCount, 0)} Total Complaints Merged</span>
          </div>
        </div>

        <div className="bg-white border border-red-200 rounded-xl p-4 shadow-xs bg-red-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-800 uppercase tracking-wider">P0 Emergency Hazards</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-700 mt-1">
            {masterTickets.filter(t => t.priorityTier === 'CRITICAL_P0' && t.status !== 'RESOLVED_VERIFIED').length}
            <span className="text-xs font-normal text-red-600 ml-1.5">&lt; 2h SLA Target</span>
          </div>
          <div className="text-xs text-red-700 mt-1.5 font-medium">
            Severed Wires & Open Manholes
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">DISCOM Electrical Load</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {departmentCounts.discom}
            <span className="text-xs font-normal text-slate-500 ml-1.5">Assigned</span>
          </div>
          <div className="text-xs text-amber-700 mt-1.5 font-medium">
            Avg Triage Time: 4.2 mins
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Roads & Sanitation</span>
            <Building2 className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {departmentCounts.pwd + departmentCounts.waste}
            <span className="text-xs font-normal text-slate-500 ml-1.5">Assigned</span>
          </div>
          <div className="text-xs text-slate-600 mt-1.5 font-medium">
            100m Radius Auto-Clustered
          </div>
        </div>
      </div>

      {/* Main Command Map & Incident Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Tactical GIS Map (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          {/* Map Top Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-700" />
                Patna Municipal Corporation GIS Map
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                PostGIS WGS84
              </span>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="bg-transparent text-slate-700 outline-none text-xs cursor-pointer font-medium"
                >
                  <option value="ALL">All Wards (45 Wards)</option>
                  <option value="Ward 22">Ward 22 (Dak Bungalow / Maurya)</option>
                  <option value="Ward 45">Ward 45 (Kankarbagh Colony)</option>
                  <option value="Ward 21">Ward 21 (Fraser Road / Planetarium)</option>
                  <option value="Ward 08">Ward 08 (Bailey Road / AIIMS)</option>
                </select>
              </div>

              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                  showHeatmap 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Flame className="w-3 h-3 text-red-500" />
                Density Heatmap
              </button>
            </div>
          </div>

          {/* Tactical Vector Map Canvas (Light Mode) */}
          <div className="relative w-full h-[430px] bg-slate-50 rounded-lg border border-slate-200 my-3 overflow-hidden select-none">
            {/* Map Canvas */}
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="lightGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="riverGanga" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="#f8fafc" />
              <rect width="100%" height="100%" fill="url(#lightGrid)" />

              {/* River Ganga */}
              <path 
                d="M 0,35 Q 220,65 480,45 T 900,25 L 900,0 L 0,0 Z" 
                fill="url(#riverGanga)" 
                stroke="#0284c7" 
                strokeWidth="1.5"
              />
              <text x="360" y="28" fill="#0369a1" fontSize="10" fontWeight="600" fontFamily="sans-serif" opacity="0.8">
                ~ RIVER GANGA / GANGA DRIVE ~
              </text>

              {/* Major Arterial Roads */}
              {/* Bailey Road */}
              <line x1="50" y1="260" x2="680" y2="180" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
              <line x1="50" y1="260" x2="680" y2="180" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 4" />
              <text x="180" y="240" fill="#475569" fontSize="9" fontWeight="bold">BAILEY ROAD (NH-30)</text>

              {/* Fraser Road */}
              <line x1="450" y1="90" x2="490" y2="340" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
              <line x1="450" y1="90" x2="490" y2="340" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="5 3" />
              <text x="495" y="150" fill="#475569" fontSize="9" fontWeight="bold" transform="rotate(75, 495, 150)">FRASER ROAD</text>

              {/* Kankarbagh Main Road */}
              <line x1="420" y1="310" x2="780" y2="360" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
              <text x="560" y="340" fill="#475569" fontSize="9" fontWeight="bold">KANKARBAGH MAIN RD</text>

              {/* Ashok Rajpath */}
              <line x1="220" y1="90" x2="820" y2="70" stroke="#cbd5e1" strokeWidth="4" />
              <text x="650" y="85" fill="#475569" fontSize="9" fontWeight="bold">ASHOK RAJPATH</text>

              {/* Heatmap overlay circles if enabled */}
              {showHeatmap && (
                <>
                  <circle cx="460" cy="190" r="85" fill="rgba(239, 68, 68, 0.18)" />
                  <circle cx="580" cy="330" r="75" fill="rgba(245, 158, 11, 0.16)" />
                  <circle cx="475" cy="140" r="60" fill="rgba(59, 130, 246, 0.15)" />
                  <circle cx="160" cy="250" r="65" fill="rgba(16, 185, 129, 0.16)" />
                </>
              )}
            </svg>

            {/* Incident Pins */}
            {filteredTickets.map((ticket) => {
              let pinX = 460;
              let pinY = 190;
              if (ticket.id === 'AK-9042') { pinX = 460; pinY = 190; }
              else if (ticket.id === 'AK-8831') { pinX = 580; pinY = 330; }
              else if (ticket.id === 'AK-7619') { pinX = 475; pinY = 140; }
              else if (ticket.id === 'AK-6405') { pinX = 160; pinY = 250; }
              else {
                pinX = 350 + (ticket.coordinates.lat * 100) % 200;
                pinY = 150 + (ticket.coordinates.lng * 100) % 180;
              }

              const isSelected = activeTicket?.id === ticket.id;
              const isP0 = ticket.priorityTier === 'CRITICAL_P0';

              return (
                <div
                  key={ticket.id}
                  onClick={() => {
                    setActiveTicket(ticket);
                    onSelectTicket(ticket);
                  }}
                  style={{ left: `${pinX}px`, top: `${pinY}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Subtle 100m radius ring */}
                  <div className={`w-14 h-14 rounded-full border border-dashed -translate-x-1/4 -translate-y-1/4 pointer-events-none transition-all ${
                    isP0 ? 'border-red-400 bg-red-500/10' : 'border-blue-400 bg-blue-500/10'
                  }`} />

                  {/* Clean Government Pin */}
                  <div className={`absolute top-0 left-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold shadow-md transition-transform border ${
                    isSelected ? 'scale-125 ring-2 ring-blue-700 ring-offset-2' : 'group-hover:scale-110'
                  } ${
                    isP0 ? 'bg-red-600 text-white border-red-700' :
                    ticket.priorityTier === 'HIGH_P1' ? 'bg-amber-500 text-slate-900 border-amber-600' :
                    'bg-blue-700 text-white border-blue-800'
                  }`}>
                    {ticket.citizenUpvotesCount > 1 ? `+${ticket.citizenUpvotesCount}` : '!' }
                  </div>

                  {/* Hover Tag */}
                  <div className="absolute left-9 top-0 hidden group-hover:flex flex-col bg-white border border-slate-300 rounded-lg p-2.5 shadow-lg z-30 min-w-[210px] pointer-events-none">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-blue-800">#{ticket.id}</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                        isP0 ? 'text-red-700 bg-red-50' : 'text-amber-800 bg-amber-50'
                      }`}>
                        Priority {ticket.priorityScore.toFixed(1)}/10
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900 truncate mt-1">{ticket.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{ticket.landmark} • {ticket.ward}</div>
                  </div>
                </div>
              );
            })}

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 flex items-center gap-4 z-10 shadow-xs">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded bg-red-600" />
                <span>P0 Hazard (Emergency)</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>P1 High (Road Craters)</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded bg-blue-700" />
                <span>100m Cluster Radius</span>
              </div>
            </div>
          </div>

          {/* Map Footer Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
            <span>Spatial Threshold: <strong>100m radius</strong></span>
            <span>Cluster Window: <strong>72 hours max</strong></span>
            <span>Spatial Engine: <strong>PostGIS ST_DWithin</strong></span>
          </div>
        </div>

        {/* Selected Master Ticket Dossier (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          {activeTicket ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      #{activeTicket.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTierBadge(activeTicket.priorityTier)}`}>
                      {activeTicket.priorityTier}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                    {activeTicket.title}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl font-mono font-bold text-red-600">
                    {activeTicket.priorityScore.toFixed(1)}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Hazard Score</span>
                </div>
              </div>

              {/* Department & Ward */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-medium">Assigned Department</span>
                  <span className="font-semibold text-slate-900 truncate block mt-0.5">
                    {activeTicket.department}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-medium">Municipal Ward</span>
                  <span className="font-semibold text-slate-900 block mt-0.5">
                    {activeTicket.ward}
                  </span>
                </div>
              </div>

              {/* Citizen Grievance Summary */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Citizen Report Summary</span>
                  <span className="text-blue-800 text-[10px] font-normal">Hinglish / Hindi</span>
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{activeTicket.summaryHinglish}"
                </p>
              </div>

              {/* Visual Inspection Proof */}
              {activeTicket.primaryImageUrl && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-blue-700" />
                      Defect Inspection Proof
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                      pHash Authenticated
                    </span>
                  </div>

                  <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-40 group">
                    <img 
                      src={activeTicket.primaryImageUrl} 
                      alt="Defect visual" 
                      className="w-full h-40 object-cover"
                    />

                    {/* Defect Bounding Boxes */}
                    {activeTicket.defectsDetected?.map((defect, i) => (
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
                        <span className="bg-red-700 text-white text-[9px] font-mono px-1 py-0.5 self-start font-bold">
                          {defect.label} {(defect.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}

                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 p-2 text-[10px] font-mono text-white">
                      {activeTicket.defectsDetected?.[0]?.metrics || 'Site Inspection Proof'}
                    </div>
                  </div>
                </div>
              )}

              {/* Citizen Upvotes & SLA */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block font-medium">Public Reports Merged</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-700" />
                    {activeTicket.citizenUpvotesCount} Citizen Complaints
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block font-medium">Resolution Target</span>
                  <span className="text-amber-800 font-mono font-bold flex items-center gap-1 justify-end mt-0.5">
                    <Clock className="w-3 h-3 text-amber-600" />
                    1h 14m left
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => onOpenResolution(activeTicket)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Field Resolution
                </button>

                <button
                  onClick={() => onSelectTicket(activeTicket)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" />
                  Inspect Graph
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select any incident pin on the map to inspect municipal details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
