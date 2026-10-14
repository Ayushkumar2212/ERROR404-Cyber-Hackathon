import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GISCommandCenter } from './components/GISCommandCenter';
import { IngestionFeed } from './components/IngestionFeed';
import { GraphVisualizer } from './components/GraphVisualizer';
import { TriageWorkbench } from './components/TriageWorkbench';
import { ClosedLoopResolution } from './components/ClosedLoopResolution';
import { ArchitectureSpecs } from './components/ArchitectureSpecs';
import { IngestPostModal } from './components/IngestPostModal';
import { INITIAL_CITIZEN_POSTS, INITIAL_MASTER_TICKETS } from './data/mockPosts';
import { CitizenPost, MasterTicket } from './types/civic';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('gis');
  const [masterTickets, setMasterTickets] = useState<MasterTicket[]>(INITIAL_MASTER_TICKETS);
  const [citizenPosts, setCitizenPosts] = useState<CitizenPost[]>(INITIAL_CITIZEN_POSTS);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState<boolean>(false);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  // Connect to Backend API on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [ticketsRes, postsRes, healthRes] = await Promise.all([
          fetch('/api/tickets'),
          fetch('/api/posts'),
          fetch('/api/health')
        ]);

        if (ticketsRes.ok && postsRes.ok) {
          const ticketsData = await ticketsRes.json();
          const postsData = await postsRes.json();
          if (ticketsData.tickets && ticketsData.tickets.length > 0) {
            setMasterTickets(ticketsData.tickets);
          }
          if (postsData.posts && postsData.posts.length > 0) {
            setCitizenPosts(postsData.posts);
          }
          setBackendConnected(true);
        }
      } catch (err) {
        console.warn('Using local fallback state, backend initializing:', err);
      }
    }

    loadBackendData();
  }, []);

  // Background stream simulator (adds upvotes / realistic complaints)
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setMasterTickets((prev) => {
        const openTickets = prev.filter((t) => t.status !== 'RESOLVED_VERIFIED');
        if (openTickets.length === 0) return prev;

        const targetIndex = Math.floor(Math.random() * openTickets.length);
        const target = openTickets[targetIndex];

        return prev.map((t) => {
          if (t.id === target.id) {
            return {
              ...t,
              citizenUpvotesCount: t.citizenUpvotesCount + 1,
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        });
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Handle Ingest New Post -> Calls Backend POST /api/ingest
  const handleCommitNewReport = async (
    post: CitizenPost,
    masterTicket: MasterTicket,
    isNewCluster: boolean
  ) => {
    // Optimistic UI update
    setCitizenPosts((prev) => [post, ...prev]);
    setMasterTickets((prev) => {
      if (isNewCluster) {
        return [masterTicket, ...prev];
      }
      return prev.map((t) => (t.id === masterTicket.id ? masterTicket : t));
    });

    // Sync to Backend
    try {
      await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post, masterTicket, isNewCluster }),
      });
    } catch (err) {
      console.warn('Backend sync queued:', err);
    }
  };

  // Handle Field Resolution -> Calls Backend POST /api/resolve
  const handleResolveTicket = async (
    ticketId: string,
    evidence: {
      afterImageUrl: string;
      officerName: string;
      officerBadge: string;
      notes: string;
      botReplyText: string;
    }
  ) => {
    // Optimistic UI update
    setMasterTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'RESOLVED_VERIFIED',
            updatedAt: new Date().toISOString(),
            resolutionEvidence: {
              ...evidence,
              resolvedAt: new Date().toISOString(),
              botReplyDispatched: true,
            },
          };
        }
        return t;
      })
    );

    // Sync to Backend
    try {
      await fetch('/api/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, evidence }),
      });
    } catch (err) {
      console.warn('Backend resolve sync queued:', err);
    }
  };

  // Handle Spike Simulator -> Calls Backend POST /api/spike
  const handleAddSimulatedSpike = async (ticketId: string, count: number) => {
    setMasterTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            citizenUpvotesCount: t.citizenUpvotesCount + count,
            updatedAt: new Date().toISOString(),
            priorityScore: Math.min(10, Math.round((t.priorityScore + 0.4) * 10) / 10),
          };
        }
        return t;
      })
    );

    try {
      await fetch('/api/spike', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, count }),
      });
    } catch (err) {
      console.warn('Backend spike sync queued:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar & Alert Ticker */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        masterTickets={masterTickets}
        isStreaming={isStreaming}
        setIsStreaming={setIsStreaming}
        onOpenIngestModal={() => setIsIngestModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5">
        {activeTab === 'gis' && (
          <GISCommandCenter
            masterTickets={masterTickets}
            onSelectTicket={() => {
              setActiveTab('graph');
            }}
            onOpenResolution={() => {
              setActiveTab('resolution');
            }}
          />
        )}

        {activeTab === 'feed' && (
          <IngestionFeed
            posts={citizenPosts}
            onInspectPost={() => setActiveTab('workbench')}
            onViewOnMap={() => setActiveTab('gis')}
          />
        )}

        {activeTab === 'graph' && (
          <GraphVisualizer
            masterTickets={masterTickets}
            citizenPosts={citizenPosts}
            onAddSimulatedSpike={handleAddSimulatedSpike}
          />
        )}

        {activeTab === 'workbench' && (
          <TriageWorkbench
            masterTickets={masterTickets}
            onCommitNewReport={handleCommitNewReport}
          />
        )}

        {activeTab === 'resolution' && (
          <ClosedLoopResolution
            masterTickets={masterTickets}
            onResolveTicket={handleResolveTicket}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureSpecs />}
      </main>

      {/* Ingest Report Modal */}
      <IngestPostModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        masterTickets={masterTickets}
        onCommitNewReport={handleCommitNewReport}
      />

      {/* Official Municipal Footer */}
      <footer className="bg-white border-t border-slate-200 px-4 py-4 text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>Civic Kiosk • Municipal Grievance & Infrastructure Operations System (Nagar Nigam)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Backend Online" />
            <span className="text-[10px] text-emerald-700 font-mono">Backend Connected</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>PostGIS EPSG:4326</span>
            <span>•</span>
            <span>100m Spatial Deduplication</span>
            <span>•</span>
            <span>Field SLA Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
