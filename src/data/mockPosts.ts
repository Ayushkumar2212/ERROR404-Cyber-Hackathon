import { CitizenPost, MasterTicket } from '../types/civic';

export const INITIAL_MASTER_TICKETS: MasterTicket[] = [
  {
    id: 'AK-9042',
    department: 'DISCOM / Electricity Board',
    title: '11KV Live Conductor Snap near Dak Bungalow Chowk',
    summaryHinglish: 'Dak bungalow chowk ke paas high tension taar toot ke gir gaya hai, sparks nikal rahe hain jaldi dekho!',
    summaryEnglish: 'Severed 11KV power cable sparking on sidewalk. Immediate risk of electrocution.',
    category: 'Live Wire / Sparking',
    coordinates: { lat: 25.6105, lng: 85.1376 },
    address: 'Near Hotel Maurya & Dak Bungalow Chauraha, Fraser Road, Patna',
    landmark: 'Dak Bungalow Chowk Pillar 4',
    ward: 'Ward 22',
    priorityScore: 10.0,
    priorityTier: 'CRITICAL_P0',
    status: 'ASSIGNED_TO_FIELD',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
    citizenUpvotesCount: 22,
    linkedPostIds: ['post-livewire-1', 'post-livewire-2', 'post-livewire-3'],
    primaryImageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
    defectsDetected: [
      {
        label: 'exposed_wire',
        confidence: 0.96,
        bbox: [28, 35, 42, 50],
        metrics: '11KV Live Conductor Snap | High electrocution hazard'
      }
    ]
  },
  {
    id: 'AK-8831',
    department: 'PWD / Road Construction',
    title: 'Dangerous Road Crater Opposite Kankarbagh Tempo Stand',
    summaryHinglish: 'Kankarbagh tempo stand ke samne 2 feet gehra gaddha hai, 3 bike wale gir chuke hain barish ke baad.',
    summaryEnglish: 'Large structural crater measuring ~2ft depth causing two-wheeler accidents on arterial lane.',
    category: 'Pothole / Road Damage',
    coordinates: { lat: 25.5941, lng: 85.1583 },
    address: 'Opposite Tempo Stand, Kankarbagh Main Road, Patna',
    landmark: 'Kankarbagh Tempo Stand',
    ward: 'Ward 45',
    priorityScore: 8.6,
    priorityTier: 'CRITICAL_P0',
    status: 'WORK_IN_PROGRESS',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    citizenUpvotesCount: 38,
    linkedPostIds: ['post-pothole-1', 'post-pothole-2'],
    primaryImageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    defectsDetected: [
      {
        label: 'pothole',
        confidence: 0.94,
        bbox: [40, 20, 50, 45],
        metrics: 'Area: 1.8m² | Severity Ratio: 8.4/10 | Water Accumulation: Yes'
      }
    ]
  },
  {
    id: 'AK-7619',
    department: 'Municipal Corporation / Waste',
    title: 'Solid Waste Heap Overflowing on Fraser Road Commercial Belt',
    summaryHinglish: 'Fraser road par kachra pichhle 5 din se nahi utha hai, badbu se market mein khada hona mushkil ho gaya hai.',
    summaryEnglish: 'Rotting open solid waste heap overflowing onto the roadway, blocking pedestrian walkway.',
    category: 'Garbage Dump Overflow',
    coordinates: { lat: 25.6087, lng: 85.1342 },
    address: 'Behind Planetarium, Fraser Road, Patna',
    landmark: 'Patna Planetarium Crossing',
    ward: 'Ward 21',
    priorityScore: 6.9,
    priorityTier: 'HIGH_P1',
    status: 'ASSIGNED_TO_FIELD',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 1 * 3600 * 1000).toISOString(),
    citizenUpvotesCount: 14,
    linkedPostIds: ['post-garbage-1', 'post-garbage-2'],
    primaryImageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    defectsDetected: [
      {
        label: 'garbage_dump',
        confidence: 0.92,
        bbox: [35, 15, 60, 55],
        metrics: 'Est. Volume: 4.8 m³ | Bio-hazard: Decomposing organic waste'
      }
    ]
  },
  {
    id: 'AK-6405',
    department: 'Jal Board / PHED',
    title: 'Pressurized Water Main Pipeline Fracture on Bailey Road',
    summaryHinglish: 'Bailey road AIIMS flyover ke paas drinking water line phat gayi hai, hazaron gallon swachh paani waste ho raha hai.',
    summaryEnglish: 'Main pressurized water conduit fracture flooding service lane near AIIMS medical corridor.',
    category: 'Sewage / Pipe Burst',
    coordinates: { lat: 25.5843, lng: 85.0442 },
    address: 'Near AIIMS Patna service lane, Bailey Road',
    landmark: 'AIIMS Patna Corridor',
    ward: 'Ward 08',
    priorityScore: 8.2,
    priorityTier: 'CRITICAL_P0',
    status: 'TRIAGED',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 16 * 3600 * 1000).toISOString(),
    citizenUpvotesCount: 19,
    linkedPostIds: ['post-water-1'],
    primaryImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    defectsDetected: [
      {
        label: 'waterlogging',
        confidence: 0.91,
        bbox: [45, 10, 50, 50],
        metrics: 'Flow Rate: ~120 LPM | Lane Submersion: 22cm'
      }
    ]
  },
  {
    id: 'AK-5120',
    department: 'Jal Board / PHED',
    title: 'Severe Sewage Backflow & Overflowing Manhole at Rajendra Nagar',
    summaryHinglish: 'Rajendra Nagar sector 3 me naala jaam hone se ganda paani gharon ke aage bhar gaya hai, machhar aur badbu fail rahi hai.',
    summaryEnglish: 'Choked storm sewer causing sewage blackwater backflow onto residential street.',
    category: 'Sewage / Pipe Burst',
    coordinates: { lat: 25.6002, lng: 85.1611 },
    address: 'Sector 3 Road, Near Rajendra Nagar Terminal, Patna',
    landmark: 'Rajendra Nagar Overbridge',
    ward: 'Ward 43',
    priorityScore: 7.4,
    priorityTier: 'HIGH_P1',
    status: 'ASSIGNED_TO_FIELD',
    createdAt: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 13 * 3600 * 1000).toISOString(),
    citizenUpvotesCount: 11,
    linkedPostIds: ['post-sewage-1'],
    primaryImageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    defectsDetected: [
      {
        label: 'sewage_leak',
        confidence: 0.89,
        bbox: [40, 20, 55, 60],
        metrics: 'Severe sanitation hazard | Stagnant contaminated water'
      }
    ]
  },
  {
    id: 'AK-4309',
    department: 'DISCOM / Electricity Board',
    title: 'Tilted Electric Pole & Hanging Wire near Gandhi Maidan Gate 4',
    summaryHinglish: 'Gandhi maidan gate 4 ke samne bijli ka khamba jhuk gaya hai aur taar latak rahi hai, tezz hawa me short circuit ho raha hai.',
    summaryEnglish: 'Structurally tilted distribution pole with low-hanging live service lines causing sparking.',
    category: 'Live Wire / Sparking',
    coordinates: { lat: 25.6180, lng: 85.1432 },
    address: 'Opposite Gate 4, Gandhi Maidan Marg, Patna',
    landmark: 'Gandhi Maidan Gate 4',
    ward: 'Ward 20',
    priorityScore: 7.9,
    priorityTier: 'HIGH_P1',
    status: 'TRIAGED',
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
    citizenUpvotesCount: 8,
    linkedPostIds: ['post-pole-1'],
    primaryImageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    defectsDetected: [
      {
        label: 'damaged_pole',
        confidence: 0.93,
        bbox: [20, 30, 45, 65],
        metrics: 'Pole inclination: 18 degrees | Ground anchor failure'
      }
    ]
  }
];

export const INITIAL_CITIZEN_POSTS: CitizenPost[] = [
  {
    id: 'post-livewire-1',
    platform: 'X',
    authorHandle: '@bihar_vigilant',
    authorName: 'Rohan Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rawText: 'Bhai Dak Bungalow chowk ke paas 11KV ka live wire toot ke gir gaya hai! Current lag gaya to kon jimmedar hoga? @PatnaMunicipal @ElectricityBihar jaldi team bhejo!!',
    mediaUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    likes: 94,
    shares: 48,
    comments: 21,
    location: {
      lat: 25.6105,
      lng: 85.1376,
      address: 'Dak Bungalow Chowk, Fraser Road, Patna',
      landmark: 'Dak Bungalow Chauraha',
      ward: 'Ward 22',
      city: 'Patna',
      locationCriticality: 10
    },
    clusteredMasterTicketId: 'AK-9042',
    triage: {
      isCivicComplaint: true,
      noiseCategory: null,
      noiseConfidence: 0.04,
      languageDetected: 'Hinglish',
      department: 'DISCOM / Electricity Board',
      departmentConfidence: 0.98,
      entities: {
        landmarks: ['Dak Bungalow Chowk'],
        mohallas: ['Dak Bungalow'],
        roads: ['Fraser Road'],
        wardNumber: 'Ward 22',
        emergencyKeywords: ['live wire', 'current lag gaya']
      },
      actionIntent: 'Immediate Emergency',
      computerVision: {
        hasVisualProof: true,
        defectsDetected: [
          {
            label: 'exposed_wire',
            confidence: 0.96,
            bbox: [28, 35, 42, 50],
            metrics: '11KV Live Conductor Snap | High hazard'
          }
        ],
        pHash: 'e7a1b3c9902ff104',
        isDuplicateMedia: false,
        similarityScore: 0.02
      },
      dynamicPriority: {
        severity: 10,
        volume: 8.5,
        engagement: 8.0,
        locationCriticality: 10,
        computedScore: 10.0,
        isEmergencyOverride: true,
        overrideReason: 'Emergency trigger: "live wire", "current lag gaya"',
        priorityTier: 'CRITICAL_P0',
        slaHours: 2
      }
    }
  },
  {
    id: 'post-livewire-2',
    platform: 'X',
    authorHandle: '@patna_updates',
    authorName: 'Patna Live Alert',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rawText: 'Avoid Maurya hotel turning! Electric cable snapped on road, sparking violently. Police barricading right now. #PatnaBijli',
    mediaUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    likes: 56,
    shares: 28,
    comments: 8,
    location: {
      lat: 25.6108,
      lng: 85.1378,
      address: 'Near Maurya Hotel, Fraser Road',
      landmark: 'Dak Bungalow Chowk',
      ward: 'Ward 22',
      city: 'Patna',
      locationCriticality: 10
    },
    clusteredMasterTicketId: 'AK-9042',
    triage: {
      isCivicComplaint: true,
      noiseCategory: null,
      noiseConfidence: 0.05,
      languageDetected: 'English',
      department: 'DISCOM / Electricity Board',
      departmentConfidence: 0.97,
      entities: {
        landmarks: ['Maurya Hotel'],
        mohallas: ['Dak Bungalow'],
        roads: ['Fraser Road'],
        wardNumber: 'Ward 22',
        emergencyKeywords: ['sparking', 'electric cable snapped']
      },
      actionIntent: 'Immediate Emergency',
      computerVision: {
        hasVisualProof: true,
        defectsDetected: [
          {
            label: 'exposed_wire',
            confidence: 0.95,
            bbox: [30, 32, 40, 52],
            metrics: 'pHash Match: 98.4% with primary post-livewire-1'
          }
        ],
        pHash: 'e7a1b3c9902ff104',
        isDuplicateMedia: true,
        similarityScore: 0.98
      },
      dynamicPriority: {
        severity: 10,
        volume: 9.0,
        engagement: 7.5,
        locationCriticality: 10,
        computedScore: 10.0,
        isEmergencyOverride: true,
        overrideReason: 'Graph Clustered into #AK-9042 (Distance: 38m < 100m)',
        priorityTier: 'CRITICAL_P0',
        slaHours: 2
      }
    }
  },
  {
    id: 'post-pothole-1',
    platform: 'Meta',
    authorHandle: '@priya_sharma_patna',
    authorName: 'Priya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rawText: 'Kankarbagh tempo stand ke samne itna bada gaddha ban chuka hai ki daily auto palatne ka khatra rehta hai. 3 din se barish ka paani bhara hua hai. @PWD_Bihar please repair this ASAP!! #Kankarbagh #SadakKharab',
    mediaUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    likes: 142,
    shares: 67,
    comments: 31,
    location: {
      lat: 25.5941,
      lng: 85.1583,
      address: 'Kankarbagh Main Road, Opposite Tempo Stand',
      landmark: 'Tempo Stand Kankarbagh',
      ward: 'Ward 45',
      city: 'Patna',
      locationCriticality: 7
    },
    clusteredMasterTicketId: 'AK-8831',
    triage: {
      isCivicComplaint: true,
      noiseCategory: null,
      noiseConfidence: 0.03,
      languageDetected: 'Hinglish',
      department: 'PWD / Road Construction',
      departmentConfidence: 0.94,
      entities: {
        landmarks: ['tempo stand'],
        mohallas: ['Kankarbagh'],
        roads: ['Kankarbagh Main Road'],
        wardNumber: 'Ward 45',
        emergencyKeywords: []
      },
      actionIntent: 'High Action Request',
      computerVision: {
        hasVisualProof: true,
        defectsDetected: [
          {
            label: 'pothole',
            confidence: 0.94,
            bbox: [40, 20, 50, 45],
            metrics: 'Surface Crater Ratio: 8.4/10'
          }
        ],
        pHash: 'b94f107c883a00f2',
        isDuplicateMedia: false,
        similarityScore: 0.05
      },
      dynamicPriority: {
        severity: 8.0,
        volume: 7.2,
        engagement: 8.8,
        locationCriticality: 7.0,
        computedScore: 8.6,
        isEmergencyOverride: false,
        priorityTier: 'CRITICAL_P0',
        slaHours: 2
      }
    }
  },
  {
    id: 'post-garbage-1',
    platform: 'YouTube',
    authorHandle: '@patna_civic_voice',
    authorName: 'Patna Civic Voice',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rawText: 'Fraser road par kachre ka dher pichhle 5 din se sada raha hai. Badbu ki wajah se dukan band karni pad rahi hai. Patna Municipal Corporation kab neend se jagega?',
    mediaUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    likes: 92,
    shares: 18,
    comments: 24,
    location: {
      lat: 25.6087,
      lng: 85.1342,
      address: 'Behind Planetarium, Fraser Road',
      landmark: 'Patna Planetarium',
      ward: 'Ward 21',
      city: 'Patna',
      locationCriticality: 8
    },
    clusteredMasterTicketId: 'AK-7619',
    triage: {
      isCivicComplaint: true,
      noiseCategory: null,
      noiseConfidence: 0.06,
      languageDetected: 'Hinglish',
      department: 'Municipal Corporation / Waste',
      departmentConfidence: 0.92,
      entities: {
        landmarks: ['Planetarium'],
        mohallas: ['Fraser Road'],
        roads: ['Fraser Road'],
        wardNumber: 'Ward 21',
        emergencyKeywords: []
      },
      actionIntent: 'High Action Request',
      computerVision: {
        hasVisualProof: true,
        defectsDetected: [
          {
            label: 'garbage_dump',
            confidence: 0.92,
            bbox: [35, 15, 60, 55],
            metrics: 'Est Volume: 4.8 m³'
          }
        ],
        pHash: 'aa73c1490288eb19',
        isDuplicateMedia: false,
        similarityScore: 0.03
      },
      dynamicPriority: {
        severity: 6.5,
        volume: 5.0,
        engagement: 6.2,
        locationCriticality: 8.0,
        computedScore: 6.9,
        isEmergencyOverride: false,
        priorityTier: 'HIGH_P1',
        slaHours: 6
      }
    }
  },
  {
    id: 'post-water-1',
    platform: 'X',
    authorHandle: '@aiims_patna_resident',
    authorName: 'Dr. Alok Nath',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rawText: 'Emergency on Bailey road service lane near AIIMS Patna! Main drinking water supply pipeline phat gaya hai, continuous flooding. Patients aur ambulances ko dikkat ho rahi hai @JalBoard @PatnaMunicipal',
    mediaUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    likes: 110,
    shares: 55,
    comments: 18,
    location: {
      lat: 25.5843,
      lng: 85.0442,
      address: 'Bailey Road Service Lane near AIIMS, Patna',
      landmark: 'AIIMS Patna Corridor',
      ward: 'Ward 08',
      city: 'Patna',
      locationCriticality: 10
    },
    clusteredMasterTicketId: 'AK-6405',
    triage: {
      isCivicComplaint: true,
      noiseCategory: null,
      noiseConfidence: 0.04,
      languageDetected: 'Hinglish',
      department: 'Jal Board / PHED',
      departmentConfidence: 0.96,
      entities: {
        landmarks: ['AIIMS Patna', 'Bailey Road Flyover'],
        mohallas: ['Bailey Road'],
        roads: ['Bailey Road'],
        wardNumber: 'Ward 08',
        emergencyKeywords: ['pipeline phat gaya']
      },
      actionIntent: 'Immediate Emergency',
      computerVision: {
        hasVisualProof: true,
        defectsDetected: [
          {
            label: 'waterlogging',
            confidence: 0.91,
            bbox: [45, 10, 50, 50],
            metrics: 'Flow Rate: ~120 LPM | Lane Submersion: 22cm'
          }
        ],
        pHash: 'cc81093f41289a01',
        isDuplicateMedia: false,
        similarityScore: 0.02
      },
      dynamicPriority: {
        severity: 8.5,
        volume: 6.0,
        engagement: 8.2,
        locationCriticality: 10.0,
        computedScore: 8.2,
        isEmergencyOverride: false,
        priorityTier: 'CRITICAL_P0',
        slaHours: 2
      }
    }
  },
  {
    id: 'post-sewage-1',
    platform: 'KioskDirect',
    authorHandle: '@rajendra_nagar_welfare',
    authorName: 'RWA Rajendra Nagar',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    rawText: 'Rajendra Nagar sector 3 road par 3 manholes choke hain, sewage ganda paani sadak aur park me overflow kar raha hai. Dengue bimari ka khatra hai. PHED / Nagar Nigam jaldi suction pump lagwayein.',
    mediaUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    timestamp: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
    likes: 62,
    shares: 24,
    comments: 14,
    location: {
      lat: 25.6002,
      lng: 85.1611,
      address: 'Sector 3 Road, Rajendra Nagar, Patna',
      landmark: 'Rajendra Nagar Overbridge',
      ward: 'Ward 43',
      city: 'Patna',
      locationCriticality: 7
    },
    clusteredMasterTicketId: 'AK-5120',
    triage: {
      isCivicComplaint: true,
      noiseCategory: null,
      noiseConfidence: 0.05,
      languageDetected: 'Hinglish',
      department: 'Jal Board / PHED',
      departmentConfidence: 0.92,
      entities: {
        landmarks: ['Rajendra Nagar Overbridge'],
        mohallas: ['Rajendra Nagar'],
        roads: ['Sector 3 Road'],
        wardNumber: 'Ward 43',
        emergencyKeywords: []
      },
      actionIntent: 'High Action Request',
      computerVision: {
        hasVisualProof: true,
        defectsDetected: [
          {
            label: 'sewage_leak',
            confidence: 0.89,
            bbox: [40, 20, 55, 60],
            metrics: 'Sewage overflow | Vector-borne risk'
          }
        ],
        pHash: 'ff901234ea567890',
        isDuplicateMedia: false,
        similarityScore: 0.03
      },
      dynamicPriority: {
        severity: 7.5,
        volume: 5.5,
        engagement: 6.0,
        locationCriticality: 7.0,
        computedScore: 7.4,
        isEmergencyOverride: false,
        priorityTier: 'HIGH_P1',
        slaHours: 6
      }
    }
  },
  {
    id: 'post-pole-1',
    platform: 'X',
    authorHandle: '@gandhimaidan_club',
    authorName: 'Patna Runners Club',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rawText: 'Gandhi maidan gate 4 ke samne bijli ka khamba dangerous angle par jhuka hua hai. Taar neeche latak rahe hain, subah runners ko accident ho sakta hai. DISCOM team urgently verify karein.',
    mediaUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    likes: 80,
    shares: 31,
    comments: 9,
    location: {
      lat: 25.6180,
      lng: 85.1432,
      address: 'Gate 4, Gandhi Maidan Marg, Patna',
      landmark: 'Gandhi Maidan Gate 4',
      ward: 'Ward 20',
      city: 'Patna',
      locationCriticality: 9
    },
    clusteredMasterTicketId: 'AK-4309',
    triage: {
      isCivicComplaint: true,
      noiseCategory: null,
      noiseConfidence: 0.04,
      languageDetected: 'Hinglish',
      department: 'DISCOM / Electricity Board',
      departmentConfidence: 0.95,
      entities: {
        landmarks: ['Gandhi Maidan Gate 4'],
        mohallas: ['Gandhi Maidan'],
        roads: ['Gandhi Maidan Marg'],
        wardNumber: 'Ward 20',
        emergencyKeywords: ['khamba jhuka hua hai']
      },
      actionIntent: 'High Action Request',
      computerVision: {
        hasVisualProof: true,
        defectsDetected: [
          {
            label: 'damaged_pole',
            confidence: 0.93,
            bbox: [20, 30, 45, 65],
            metrics: 'Pole inclination: 18 degrees | Fall hazard'
          }
        ],
        pHash: 'd3e4f5a6b7c89012',
        isDuplicateMedia: false,
        similarityScore: 0.04
      },
      dynamicPriority: {
        severity: 8.0,
        volume: 5.0,
        engagement: 7.0,
        locationCriticality: 9.0,
        computedScore: 7.9,
        isEmergencyOverride: false,
        priorityTier: 'HIGH_P1',
        slaHours: 6
      }
    }
  },
  {
    id: 'post-noise-1',
    platform: 'X',
    authorHandle: '@political_troll_99',
    authorName: 'Meme Central India',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    rawText: 'Dekho ye neta log sab chor hain modi vs rahul 2026 election kisko vote doge comment karo jaldi follow for follow!! #Politics #Meme',
    mediaType: 'none',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    likes: 310,
    shares: 19,
    comments: 110,
    location: {
      lat: 25.6120,
      lng: 85.1400,
      address: 'Patna Central',
      landmark: 'Unknown',
      ward: 'Ward 10',
      city: 'Patna',
      locationCriticality: 4
    },
    triage: {
      isCivicComplaint: false,
      noiseCategory: 'political_rant',
      noiseConfidence: 0.98,
      languageDetected: 'Hinglish',
      department: 'Unassigned',
      departmentConfidence: 0.05,
      entities: {
        landmarks: [],
        mohallas: [],
        roads: [],
        emergencyKeywords: []
      },
      actionIntent: 'Informational',
      dynamicPriority: {
        severity: 1,
        volume: 1,
        engagement: 6,
        locationCriticality: 3,
        computedScore: 1.8,
        isEmergencyOverride: false,
        priorityTier: 'LOW_P3',
        slaHours: 72
      }
    }
  }
];
