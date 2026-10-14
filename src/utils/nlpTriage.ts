import { CitizenPost, DepartmentType, MasterTicket, PriorityTier, TriageResult } from '../types/civic';

// Hardcoded Emergency Overrides defined in AI Kiosk Specification
export const EMERGENCY_KEYWORDS = [
  'current lag gaya',
  'live wire',
  'open manhole',
  'khula manhole',
  'cylinder leak',
  'short circuit',
  'bachha gir gaya',
  'chhota bachha gir gaya',
  'high tension taar',
  'sparks nikal rahe',
  'aag lag gayi',
  'transformer blast',
  'danger of electrocution'
];

export const NOISE_PATTERNS = [
  /modi.*vs.*rahul/i,
  /free giveaway/i,
  /follow for follow/i,
  /subscribe to my channel/i,
  /crypto|bitcoin|forex/i,
  /watch full video link/i,
  /ipl match live/i,
  /movie leak/i,
  /political dalal/i
];

export const MOHALLA_DATABASE = [
  { name: 'Kankarbagh', lat: 25.5941, lng: 85.1583, ward: 'Ward 45', crit: 7 },
  { name: 'Dak Bungalow Chowk', lat: 25.6105, lng: 85.1376, ward: 'Ward 22', crit: 10 },
  { name: 'Boring Road', lat: 25.6178, lng: 85.1189, ward: 'Ward 18', crit: 8 },
  { name: 'Bailey Road (Near AIIMS)', lat: 25.5843, lng: 85.0442, ward: 'Ward 08', crit: 10 },
  { name: 'Fraser Road', lat: 25.6087, lng: 85.1342, ward: 'Ward 21', crit: 9 },
  { name: 'Rajendra Nagar', lat: 25.6002, lng: 85.1611, ward: 'Ward 43', crit: 7 },
  { name: 'Patliputra Colony', lat: 25.6312, lng: 85.1092, ward: 'Ward 14', crit: 6 },
  { name: 'Danapur Cantonment', lat: 25.6321, lng: 85.0392, ward: 'Ward 02', crit: 8 },
  { name: 'Ashok Rajpath', lat: 25.6210, lng: 85.1689, ward: 'Ward 35', crit: 8 },
  { name: 'Gandhi Maidan', lat: 25.6180, lng: 85.1432, ward: 'Ward 20', crit: 9 }
];

/**
 * Calculates Haversine distance in meters between two GPS coordinates
 */
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Computes Hamming Distance between two 64-bit Hex Perceptual Hashes (pHash)
 */
export function computeHammingDistance(hash1: string, hash2: string): number {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) return 64;
  let dist = 0;
  for (let i = 0; i < hash1.length; i++) {
    const v1 = parseInt(hash1[i], 16);
    const v2 = parseInt(hash2[i], 16);
    let xor = v1 ^ v2;
    while (xor > 0) {
      dist += xor & 1;
      xor >>= 1;
    }
  }
  return dist;
}

/**
 * Comprehensive NLP & Civics Triage Function
 */
export function analyzeCivicPostText(
  text: string,
  likes = 12,
  shares = 4,
  userLocationInput?: { lat?: number; lng?: number; address?: string; crit?: number }
): TriageResult {
  const lower = text.toLowerCase();

  // 1. Binary Noise Filter
  let isNoise = false;
  let noiseCategory: 'meme' | 'political_rant' | 'promotional_spam' | 'general_chat' | null = null;

  for (const pattern of NOISE_PATTERNS) {
    if (pattern.test(lower)) {
      isNoise = true;
      noiseCategory = 'political_rant';
      break;
    }
  }

  // Also check if completely un-civic
  const civicKeywords = [
    'sadak', 'road', 'gaddha', 'pothole', 'taar', 'wire', 'bijli', 'power', 'transformer',
    'kachra', 'garbage', 'sewage', 'naala', 'water', 'paani', 'manhole', 'overflow',
    'pipe', 'leak', 'chauraha', 'nagar', 'ward', 'pwd', 'discom', 'municipal', 'light',
    'tooti', 'broken', 'accident', 'danger', 'sparks', 'jam', 'waterlogging'
  ];

  const matchedCivicCount = civicKeywords.filter(k => lower.includes(k)).length;
  if (!isNoise && matchedCivicCount === 0 && text.length > 20) {
    // Check if it's general promotional or spam
    if (lower.includes('crypto') || lower.includes('win cash') || lower.includes('dm for promo')) {
      isNoise = true;
      noiseCategory = 'promotional_spam';
    } else {
      isNoise = true;
      noiseCategory = 'general_chat';
    }
  }

  // 2. Language Detection
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  const hinglishWords = ['hai', 'ke', 'ka', 'ki', 'paas', 'mein', 'ho', 'gaya', 'kar', 'rahe', 'kuch', 'bahut', 'jaldi', 'samne'];
  const hinglishHits = hinglishWords.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(lower)).length;
  
  let languageDetected: 'Hinglish' | 'Hindi' | 'English' | 'Mixed' = 'English';
  if (hasDevanagari && hinglishHits > 0) languageDetected = 'Mixed';
  else if (hasDevanagari) languageDetected = 'Hindi';
  else if (hinglishHits >= 2) languageDetected = 'Hinglish';

  // 3. Emergency Overrides
  const foundEmergencies = EMERGENCY_KEYWORDS.filter(k => lower.includes(k));
  const isEmergencyOverride = foundEmergencies.length > 0;

  // 4. Department Classification
  let dept: DepartmentType = 'Unassigned';
  let deptConfidence = 0.5;

  const pwdScore = (lower.match(/pothole|sadak|gaddha|khadda|divider|bridge|flyover|asphalt|tooti sadak|crater/g) || []).length;
  const discomScore = (lower.match(/wire|taar|bijli|power|transformer|spark|light|current|pole|voltage|blackout|electrocution/g) || []).length;
  const jalScore = (lower.match(/water|paani|pipe|leakage|burst|sewage|ganda paani|drain|naala|contamination|pipeline|waterlogging/g) || []).length;
  const municipalScore = (lower.match(/kachra|garbage|dump|waste|dustbin|badbu|smell|dead animal|toilet|sweeping|cleaning/g) || []).length;

  const maxScore = Math.max(pwdScore, discomScore, jalScore, municipalScore);
  if (maxScore > 0) {
    if (pwdScore === maxScore) {
      dept = 'PWD / Road Construction';
      deptConfidence = Math.min(0.98, 0.70 + pwdScore * 0.1);
    } else if (discomScore === maxScore) {
      dept = 'DISCOM / Electricity Board';
      deptConfidence = Math.min(0.99, 0.75 + discomScore * 0.1);
    } else if (jalScore === maxScore) {
      dept = 'Jal Board / PHED';
      deptConfidence = Math.min(0.96, 0.72 + jalScore * 0.1);
    } else {
      dept = 'Municipal Corporation / Waste';
      deptConfidence = Math.min(0.97, 0.71 + municipalScore * 0.1);
    }
  } else if (!isNoise) {
    dept = 'Municipal Corporation / Waste';
    deptConfidence = 0.65;
  }

  // 5. Civic NER (Mohalla, Landmark, Road, Ward)
  const landmarks: string[] = [];
  const mohallas: string[] = [];
  const roads: string[] = [];
  let wardNumber: string | undefined;

  // Search mohallas in text
  for (const item of MOHALLA_DATABASE) {
    if (lower.includes(item.name.toLowerCase().split(' ')[0])) {
      mohallas.push(item.name);
      wardNumber = item.ward;
    }
  }

  // Extract landmarks
  const landmarkRegex = /(tempo stand|metro pillar \d+|chauraha|chowk|mandir|hospital|chouraha|railway station|overbridge|bus stop)/gi;
  let match;
  while ((match = landmarkRegex.exec(text)) !== null) {
    landmarks.push(match[0]);
  }

  // Extract roads
  const roadRegex = /([a-zA-Z]+ road|[a-zA-Z]+ path|[a-zA-Z]+ marg|nh-\d+|nh\d+)/gi;
  while ((match = roadRegex.exec(text)) !== null) {
    roads.push(match[0]);
  }

  // Extract ward
  const wardRegex = /ward\s*(?:no\.?|number)?\s*(\d+)/i;
  const wardMatch = text.match(wardRegex);
  if (wardMatch) {
    wardNumber = `Ward ${wardMatch[1]}`;
  }

  // Action Intent
  let actionIntent: 'Immediate Emergency' | 'High Action Request' | 'Routine Grievance' | 'Informational' = 'Routine Grievance';
  if (isEmergencyOverride) {
    actionIntent = 'Immediate Emergency';
  } else if (lower.includes('urgent') || lower.includes('jaldi') || lower.includes('kisi ki jaan') || lower.includes('danger')) {
    actionIntent = 'High Action Request';
  } else if (isNoise) {
    actionIntent = 'Informational';
  }

  // 6. Dynamic Priority Matrix
  // S (Severity: 1-10)
  let severity = 5;
  if (isEmergencyOverride) severity = 10;
  else if (dept === 'DISCOM / Electricity Board' && (lower.includes('spark') || lower.includes('wire'))) severity = 9.2;
  else if (dept === 'PWD / Road Construction' && (lower.includes('accident') || lower.includes('deep') || lower.includes('bada gaddha'))) severity = 8.0;
  else if (dept === 'Jal Board / PHED' && (lower.includes('burst') || lower.includes('submerged'))) severity = 7.5;
  else if (dept === 'Municipal Corporation / Waste' && lower.includes('dead animal')) severity = 7.0;
  else severity = 4.5;

  // V (Volume Spike: 1-10)
  const volume = 4.0; // default baseline volume

  // E (Engagement Velocity: 1-10)
  const totalEng = likes + shares * 3;
  const engagement = Math.min(10, Math.max(1, Math.round((totalEng / 40) * 10) / 10 + 1));

  // L (Location Criticality: 1-10)
  let locationCriticality = userLocationInput?.crit || 6;
  if (landmarks.some(l => l.toLowerCase().includes('hospital') || l.toLowerCase().includes('aiims'))) {
    locationCriticality = 10;
  } else if (landmarks.some(l => l.toLowerCase().includes('metro') || l.toLowerCase().includes('station'))) {
    locationCriticality = 9;
  }

  // Priority formula: (S * 0.40) + (V * 0.25) + (E * 0.20) + (L * 0.15)
  let computedScore = Math.round(((severity * 0.40) + (volume * 0.25) + (engagement * 0.20) + (locationCriticality * 0.15)) * 10) / 10;
  
  if (isEmergencyOverride) {
    computedScore = 10.0;
  }

  let priorityTier: PriorityTier = 'LOW_P3';
  let slaHours = 72;

  if (computedScore >= 8.5 || isEmergencyOverride) {
    priorityTier = 'CRITICAL_P0';
    slaHours = 2;
  } else if (computedScore >= 6.8) {
    priorityTier = 'HIGH_P1';
    slaHours = 6;
  } else if (computedScore >= 4.5) {
    priorityTier = 'MEDIUM_P2';
    slaHours = 24;
  } else {
    priorityTier = 'LOW_P3';
    slaHours = 72;
  }

  return {
    isCivicComplaint: !isNoise,
    noiseCategory: isNoise ? noiseCategory : null,
    noiseConfidence: isNoise ? 0.94 : 0.08,
    languageDetected,
    department: dept,
    departmentConfidence: deptConfidence,
    entities: {
      landmarks,
      mohallas: mohallas.length > 0 ? mohallas : ['Central Patna'],
      roads,
      wardNumber: wardNumber || 'Ward 22',
      emergencyKeywords: foundEmergencies
    },
    actionIntent,
    dynamicPriority: {
      severity,
      volume,
      engagement,
      locationCriticality,
      computedScore,
      isEmergencyOverride,
      overrideReason: isEmergencyOverride ? `Emergency trigger: "${foundEmergencies.join(', ')}"` : undefined,
      priorityTier,
      slaHours
    }
  };
}

/**
 * Spatio-temporal clustering algorithm
 * Rule: same category, coordinates within 100 meters, timestamp within 72 hours
 */
export function clusterIntoMasterTicket(
  newPost: CitizenPost,
  existingTickets: MasterTicket[]
): { masterTicket: MasterTicket; isNewCluster: boolean } {
  const postLat = newPost.location.lat;
  const postLng = newPost.location.lng;
  const postTime = new Date(newPost.timestamp).getTime();
  const seventyTwoHoursMs = 72 * 60 * 60 * 1000;

  // Find existing ticket within 100m, <= 72h, and same department
  const match = existingTickets.find(ticket => {
    if (ticket.department !== newPost.triage.department) return false;
    const timeDiff = Math.abs(new Date(ticket.createdAt).getTime() - postTime);
    if (timeDiff > seventyTwoHoursMs) return false;
    const distMeters = calculateDistanceMeters(postLat, postLng, ticket.coordinates.lat, ticket.coordinates.lng);
    return distMeters <= 100;
  });

  if (match) {
    // Cluster into existing master ticket (Upvote escalation)
    const updatedTicket: MasterTicket = {
      ...match,
      citizenUpvotesCount: match.citizenUpvotesCount + 1,
      linkedPostIds: [...match.linkedPostIds, newPost.id],
      updatedAt: new Date().toISOString(),
      // Recalculate priority if upvotes push volume up
      priorityScore: Math.min(10, Math.round((match.priorityScore + 0.3) * 10) / 10)
    };
    return { masterTicket: updatedTicket, isNewCluster: false };
  }

  // Create brand new Master Ticket
  const ticketId = `AK-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const slaDate = new Date(now.getTime() + newPost.triage.dynamicPriority.slaHours * 60 * 60 * 1000);

  const categoryMap: Record<DepartmentType, MasterTicket['category']> = {
    'PWD / Road Construction': 'Pothole / Road Damage',
    'DISCOM / Electricity Board': 'Live Wire / Sparking',
    'Jal Board / PHED': 'Sewage / Pipe Burst',
    'Municipal Corporation / Waste': 'Garbage Dump Overflow',
    'Unassigned': 'Garbage Dump Overflow'
  };

  const newTicket: MasterTicket = {
    id: ticketId,
    department: newPost.triage.department,
    title: `${newPost.triage.department.split('/')[0].trim()} Issue: ${newPost.location.landmark || newPost.location.address}`,
    summaryHinglish: newPost.rawText.slice(0, 120) + (newPost.rawText.length > 120 ? '...' : ''),
    summaryEnglish: `Automated verified report for ${newPost.triage.department} at ${newPost.location.address}`,
    category: categoryMap[newPost.triage.department] || 'Pothole / Road Damage',
    coordinates: { lat: postLat, lng: postLng },
    address: newPost.location.address,
    landmark: newPost.location.landmark,
    ward: newPost.location.ward,
    priorityScore: newPost.triage.dynamicPriority.computedScore,
    priorityTier: newPost.triage.dynamicPriority.priorityTier,
    status: 'INGESTED',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    slaDueAt: slaDate.toISOString(),
    citizenUpvotesCount: 1,
    linkedPostIds: [newPost.id],
    primaryImageUrl: newPost.mediaUrl,
    defectsDetected: newPost.triage.computerVision?.defectsDetected
  };

  return { masterTicket: newTicket, isNewCluster: true };
}
