export type Platform = 'X' | 'Meta' | 'YouTube' | 'KioskDirect';

export type DepartmentType =
  | 'PWD / Road Construction'
  | 'DISCOM / Electricity Board'
  | 'Jal Board / PHED'
  | 'Municipal Corporation / Waste'
  | 'Unassigned';

export type PriorityTier = 'CRITICAL_P0' | 'HIGH_P1' | 'MEDIUM_P2' | 'LOW_P3';

export type TicketStatus =
  | 'INGESTED'
  | 'TRIAGED'
  | 'ASSIGNED_TO_FIELD'
  | 'WORK_IN_PROGRESS'
  | 'RESOLVED_VERIFIED'
  | 'CITIZEN_NOTIFIED';

export interface DefectDetection {
  label: 'pothole' | 'garbage_dump' | 'waterlogging' | 'exposed_wire' | 'damaged_pole' | 'sewage_leak';
  confidence: number;
  bbox: [number, number, number, number]; // [top%, left%, width%, height%]
  metrics: string;
}

export interface GeocodedLocation {
  lat: number;
  lng: number;
  address: string;
  landmark: string;
  ward: string;
  city: string;
  locationCriticality: number; // 1 to 10
}

export interface TriageResult {
  isCivicComplaint: boolean;
  noiseCategory?: 'meme' | 'political_rant' | 'promotional_spam' | 'general_chat' | null;
  noiseConfidence: number;
  languageDetected: 'Hinglish' | 'Hindi' | 'English' | 'Mixed';
  department: DepartmentType;
  departmentConfidence: number;
  entities: {
    landmarks: string[];
    mohallas: string[];
    roads: string[];
    wardNumber?: string;
    emergencyKeywords: string[];
  };
  actionIntent: 'Immediate Emergency' | 'High Action Request' | 'Routine Grievance' | 'Informational';
  computerVision?: {
    hasVisualProof: boolean;
    defectsDetected: DefectDetection[];
    pHash: string;
    isDuplicateMedia: boolean;
    similarityScore: number;
  };
  dynamicPriority: {
    severity: number; // S (1-10)
    volume: number; // V (1-10)
    engagement: number; // E (1-10)
    locationCriticality: number; // L (1-10)
    computedScore: number; // (S * 0.40) + (V * 0.25) + (E * 0.20) + (L * 0.15)
    isEmergencyOverride: boolean;
    overrideReason?: string;
    priorityTier: PriorityTier;
    slaHours: number;
  };
}

export interface CitizenPost {
  id: string;
  platform: Platform;
  authorHandle: string;
  authorName: string;
  avatarUrl: string;
  rawText: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'none';
  timestamp: string;
  likes: number;
  shares: number;
  comments: number;
  location: GeocodedLocation;
  triage: TriageResult;
  clusteredMasterTicketId?: string;
}

export interface MasterTicket {
  id: string; // e.g. "AK-9042"
  department: DepartmentType;
  title: string;
  summaryHinglish: string;
  summaryEnglish: string;
  category: 'Pothole / Road Damage' | 'Live Wire / Sparking' | 'Garbage Dump Overflow' | 'Waterlogging' | 'Sewage / Pipe Burst';
  coordinates: { lat: number; lng: number };
  address: string;
  landmark: string;
  ward: string;
  priorityScore: number;
  priorityTier: PriorityTier;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  slaDueAt: string;
  citizenUpvotesCount: number;
  linkedPostIds: string[];
  primaryImageUrl?: string;
  defectsDetected?: DefectDetection[];
  resolutionEvidence?: {
    afterImageUrl: string;
    resolvedAt: string;
    officerName: string;
    officerBadge: string;
    notes: string;
    botReplyDispatched: boolean;
    botReplyText: string;
  };
}
