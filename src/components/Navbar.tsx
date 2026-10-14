import React from 'react';
import { 
  Building2, 
  MapPin, 
  Radio, 
  PlusCircle, 
  Layers, 
  CheckSquare, 
  FileText,
  Clock,
  PhoneCall,
  AlertCircle
} from 'lucide-react';
import { MasterTicket } from '../types/civic';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  masterTickets: MasterTicket[];
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  onOpenIngestModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  masterTickets,
  isStreaming,
  setIsStreaming,
  onOpenIngestModal,
}) => {
  const criticalTickets = masterTickets.filter(t => t.priorityTier === 'CRITICAL_P0' && t.status !== 'RESOLVED_VERIFIED');

  const navItems = [
    { id: 'gis', label: 'GIS Command & Ward Map', icon: MapPin },
    { id: 'feed', label: 'Public Grievance Feed (OSINT)', icon: Radio },
    { id: 'graph', label: 'Duplicate Deduplication (Graph)', icon: Layers },
    { id: 'workbench', label: 'Triage & Verification Desk', icon: CheckSquare },
    { id: 'resolution', label: 'Field Resolution & Citizen Feedback', icon: Clock },
    { id: 'architecture', label: 'System Specifications & DDL', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Official Government Top Bar */}
      <div className="bg-slate-900 text-white px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 font-semibold text-rose-300 shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>High-Priority Alerts:</span>
          </div>
          <div className="flex items-center gap-4 truncate text-[11px] text-slate-200">
            {criticalTickets.length > 0 ? (
              criticalTickets.map(t => (
                <span key={t.id} className="inline-flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  <span className="font-bold text-amber-300">[{t.id}]</span>
                  <span className="truncate max-w-[200px]">{t.title}</span>
                  <span className="text-rose-300 text-[10px]">({t.ward})</span>
                </span>
              ))
            ) : (
              <span className="text-slate-400">All emergency hazards triaged and assigned to field crews.</span>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-300 shrink-0 font-mono">
          <div className="flex items-center gap-1 text-slate-300">
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span>Civic Control Room: <strong>1800-345-6789</strong></span>
          </div>
          <span className="text-slate-600">|</span>
          <span>Patna Municipal Zone • Ward 01-75</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Department Branding */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">
                CIVIC KIOSK
              </h1>
              <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                MUNICIPAL OPERATIONS
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Nagar Nigam Automated Grievance Triage, Defect Verification & Field Resolution Portal
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
              isStreaming
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
            {isStreaming ? 'Live Stream On' : 'Stream Paused'}
          </button>

          <button
            onClick={onOpenIngestModal}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-800 hover:bg-blue-900 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Log Public Complaint</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 border-t border-slate-200">
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-900 border border-blue-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-700' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
