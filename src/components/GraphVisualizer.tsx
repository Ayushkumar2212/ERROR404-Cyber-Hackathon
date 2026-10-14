import React, { useState } from 'react';
import { 
  Database, 
  Share2, 
  Layers, 
  MapPin, 
  Sliders, 
  Play, 
  Check, 
  Copy,
  ThumbsUp,
  FileCode
} from 'lucide-react';
import { CitizenPost, MasterTicket } from '../types/civic';

interface GraphVisualizerProps {
  masterTickets: MasterTicket[];
  citizenPosts: CitizenPost[];
  onAddSimulatedSpike: (ticketId: string, count: number) => void;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  masterTickets,
  citizenPosts,
  onAddSimulatedSpike,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(masterTickets[0]?.id || 'AK-9042');
  const [spatialRadius, setSpatialRadius] = useState<number>(100);
  const [temporalHours, setTemporalHours] = useState<number>(72);
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [isSimulatingSpike, setIsSimulatingSpike] = useState(false);

  const activeTicket = masterTickets.find(t => t.id === selectedTicketId) || masterTickets[0];

  // Cypher Query
  const cypherQuery = `// Neo4j Spatial Deduplication Match
MATCH (p:CitizenPost)
WHERE p.department = '${activeTicket?.department}'
  AND point.distance(
        p.coordinates, 
        point({latitude: ${activeTicket?.coordinates.lat}, longitude: ${activeTicket?.coordinates.lng}})
      ) <= ${spatialRadius} // 100 meters threshold
  AND duration.inHours(datetime(p.timestamp), datetime('${activeTicket?.createdAt}')).hours <= ${temporalHours}

MERGE (m:MasterTicket {id: '${activeTicket?.id}'})
ON MATCH SET 
  m.citizenUpvotes = m.citizenUpvotes + 1,
  m.updatedAt = datetime()

MERGE (p)-[r:CLUSTERS_INTO]->(m)
SET r.distanceMeters = round(point.distance(p.coordinates, point({latitude: ${activeTicket?.coordinates.lat}, longitude: ${activeTicket?.coordinates.lng}})));`;

  const handleCopyCypher = () => {
    navigator.clipboard.writeText(cypherQuery);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  const triggerSpike = () => {
    setIsSimulatingSpike(true);
    onAddSimulatedSpike(activeTicket.id, 12);
    setTimeout(() => setIsSimulatingSpike(false), 1200);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Graph Telemetry */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Spatial & Temporal Deduplication Engine
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Portal Anti-Choke Active
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Merges duplicate social media complaints occurring within 100m radius into a single actionable Master Ticket
            </p>
          </div>
        </div>

        {/* Choke Reduction Metric */}
        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Duplicate Reduction</span>
            <span className="text-emerald-700 font-mono font-bold text-base">
              94.2% Consolidated
            </span>
          </div>
          <div className="h-7 w-[1px] bg-slate-200" />
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Citizen Upvotes</span>
            <span className="text-blue-800 font-mono font-bold text-base">
              +{activeTicket?.citizenUpvotesCount || 1}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Graph (7 cols) + Controls & Cypher (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Visual Graph View (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          {/* Graph Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-blue-700" />
                Cluster Graph Visualizer
              </span>
              <span className="text-[11px] font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Ticket #{activeTicket?.id}
              </span>
            </div>

            {/* Select ticket cluster */}
            <select
              value={selectedTicketId}
              onChange={(e) => setSelectedTicketId(e.target.value)}
              className="bg-slate-50 text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer font-medium"
            >
              {masterTickets.map(t => (
                <option key={t.id} value={t.id}>
                  #{t.id} ({t.citizenUpvotesCount} upvotes) - {t.department.split('/')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* SVG Graph Canvas (Light Mode) */}
          <div className="relative w-full h-[400px] bg-slate-50 rounded-lg border border-slate-200 my-3 overflow-hidden select-none flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 600 400">
              {/* 100m Spatial Threshold Ring */}
              <circle cx="300" cy="200" r={spatialRadius * 1.3} fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="5 3" />
              <text x="300" y="200 - spatialRadius * 1.3 - 8" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="bold">
                100m Geographic Proximity Perimeter
              </text>

              {/* Connecting Edges */}
              <line x1="300" y1="200" x2="300" y2="65" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="300" y1="200" x2="120" y2="330" stroke="#7c3aed" strokeWidth="2" strokeDasharray="3 3" />

              {/* Citizen Post Edges */}
              <line x1="300" y1="200" x2="140" y2="150" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="300" y1="200" x2="190" y2="260" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="300" y1="200" x2="440" y2="130" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="300" y1="200" x2="470" y2="240" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="300" y1="200" x2="380" y2="320" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Citizen Post Satellite Nodes */}
              <g transform="translate(140, 150)">
                <circle r="18" fill="#ffffff" stroke="#64748b" strokeWidth="2" />
                <text textAnchor="middle" dy="4" fill="#334155" fontSize="9" fontWeight="bold">Post 1</text>
              </g>
              <g transform="translate(190, 260)">
                <circle r="18" fill="#ffffff" stroke="#64748b" strokeWidth="2" />
                <text textAnchor="middle" dy="4" fill="#334155" fontSize="9" fontWeight="bold">Post 2</text>
              </g>
              <g transform="translate(440, 130)">
                <circle r="18" fill="#ffffff" stroke="#64748b" strokeWidth="2" />
                <text textAnchor="middle" dy="4" fill="#334155" fontSize="9" fontWeight="bold">Post 3</text>
              </g>
              <g transform="translate(470, 240)">
                <circle r="18" fill="#ffffff" stroke="#64748b" strokeWidth="2" />
                <text textAnchor="middle" dy="4" fill="#334155" fontSize="9" fontWeight="bold">Post 4</text>
              </g>
              <g transform="translate(380, 320)">
                <circle r="20" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
                <text textAnchor="middle" dy="4" fill="#dc2626" fontSize="10" fontWeight="bold">
                  +{activeTicket?.citizenUpvotesCount}
                </text>
              </g>

              {/* Department Node (Top) */}
              <g transform="translate(300, 65)">
                <rect x="-85" y="-18" width="170" height="36" rx="8" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" />
                <text textAnchor="middle" dy="4" fill="#0369a1" fontSize="10" fontWeight="bold">
                  Department: {activeTicket?.department.split('/')[0]}
                </text>
              </g>

              {/* Location Node (Bottom Left) */}
              <g transform="translate(120, 330)">
                <rect x="-70" y="-16" width="140" height="32" rx="8" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="2" />
                <text textAnchor="middle" dy="4" fill="#6d28d9" fontSize="10" fontWeight="bold">
                  {activeTicket?.ward} ({activeTicket?.landmark.split(',')[0]})
                </text>
              </g>

              {/* Center Master Incident Node */}
              <g transform="translate(300, 200)">
                <circle r="36" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="4" />
                <text textAnchor="middle" dy="-3" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  #{activeTicket?.id}
                </text>
                <text textAnchor="middle" dy="13" fill="#93c5fd" fontSize="9" fontWeight="bold">
                  MASTER TICKET
                </text>
              </g>
            </svg>

            {/* In-canvas Legend */}
            <div className="absolute bottom-2 left-2 bg-white/95 border border-slate-200 rounded p-2 text-[10px] text-slate-600 space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-900" /> Master Incident Node (:MasterTicket)</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Citizen Reports (:CitizenPost - Upvotes)</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-sky-200 border border-sky-600" /> Department Unit</div>
            </div>
          </div>

          {/* Graph Footer Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
            <span>Graph Database: <strong>Neo4j 5.x</strong></span>
            <span>Spatial Engine: <strong>Cypher point.distance()</strong></span>
            <span>Current Cluster: <strong>{activeTicket?.citizenUpvotesCount} Citizen Upvotes</strong></span>
          </div>
        </div>

        {/* Graph Deduplication Controls & Live Cypher (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Controls Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-700" />
              Spatio-Temporal Deduplication Rules
            </h3>

            {/* Spatial Radius Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-700" />
                  Spatial Distance Threshold:
                </span>
                <span className="font-mono font-bold text-blue-900">{spatialRadius} meters</span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="10"
                value={spatialRadius}
                onChange={(e) => setSpatialRadius(Number(e.target.value))}
                className="w-full accent-blue-700 bg-slate-200 h-2 rounded cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                PostGIS & Haversine merges reports within this radius into one master ticket.
              </span>
            </div>

            {/* Temporal Window Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  Temporal Window Threshold:
                </span>
                <span className="font-mono font-bold text-amber-800">{temporalHours} hours</span>
              </div>
              <input
                type="range"
                min="12"
                max="168"
                step="6"
                value={temporalHours}
                onChange={(e) => setTemporalHours(Number(e.target.value))}
                className="w-full accent-amber-600 bg-slate-200 h-2 rounded cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                Subsequent complaints within 72 hours automatically escalate ticket severity without duplicating.
              </span>
            </div>

            {/* Spike Simulator Button */}
            <div className="pt-2">
              <button
                onClick={triggerSpike}
                disabled={isSimulatingSpike}
                className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold bg-blue-800 hover:bg-blue-900 text-white flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                {isSimulatingSpike ? 'Consolidating 12 Incoming Posts into Master Node...' : 'Test Consolidation (12 Posts -> 1 Master Ticket)'}
              </button>
            </div>
          </div>

          {/* Live Neo4j Cypher Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-blue-700" />
                Neo4j Cypher Deduplication Script
              </span>
              <button
                onClick={handleCopyCypher}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer border border-slate-200"
              >
                {copiedQuery ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedQuery ? 'Copied' : 'Copy'}
              </button>
            </div>

            <pre className="p-3 bg-slate-50 rounded-lg text-[11px] font-mono text-slate-800 overflow-x-auto max-h-56 scrollbar-thin border border-slate-200 leading-relaxed">
              {cypherQuery}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
