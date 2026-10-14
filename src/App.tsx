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

  const handleCommitNewReport = (
    post: CitizenPost,
    masterTicket: MasterTicket,
    isNewCluster: boolean
  ) => {
    setCitizenPosts((prev) => [post, ...prev]);

    setMasterTickets((prev) => {
      if (isNewCluster) {
        return [masterTicket, ...prev];
      }
      return prev.map((t) => (t.id === masterTicket.id ? masterTicket : t));
    });
  };

  const handleResolveTicket = (
    ticketId: string,
    evidence: {
      afterImageUrl: string;
      officerName: string;
      officerBadge: string;
      notes: string;
      botReplyText: string;
    }
  ) => {
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
  };

  const handleAddSimulatedSpike = (ticketId: string, count: number) => {
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
          <div>
            Civic Kiosk • Municipal Grievance Redressal & Infrastructure Operations System (Nagar Nigam)
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>PostGIS EPSG:4326</span>
            <span>•</span>
            <span>100m Spatial Clustering</span>
            <span>•</span>
            <span>Field SLA Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
