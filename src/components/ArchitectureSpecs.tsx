import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  Layers, 
  Server,
  Terminal,
  FileText
} from 'lucide-react';

export const ArchitectureSpecs: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const POSTGIS_DDL = `-- Municipal Civic Grievance Platform - PostgreSQL 16 + PostGIS 3.4 DDL Schema
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Departments Dimension
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    sla_p0_hours INT DEFAULT 2,
    sla_p1_hours INT DEFAULT 6,
    sla_p2_hours INT DEFAULT 24,
    escalation_email VARCHAR(255)
);

-- Master Incident Tickets (Deduplicated Aggregation Nodes)
CREATE TABLE master_tickets (
    id VARCHAR(32) PRIMARY KEY, -- e.g. 'AK-9042'
    department_id INT REFERENCES departments(id),
    category VARCHAR(64) NOT NULL,
    priority_tier VARCHAR(16) NOT NULL CHECK (priority_tier IN ('CRITICAL_P0', 'HIGH_P1', 'MEDIUM_P2', 'LOW_P3')),
    hazard_score NUMERIC(4,2) NOT NULL, -- Calculated: (S*0.4 + V*0.25 + E*0.2 + L*0.15)
    geom GEOMETRY(Point, 4326) NOT NULL, -- EPSG:4326 (WGS84 GPS Coordinates)
    address TEXT,
    landmark VARCHAR(255),
    ward_number VARCHAR(64),
    status VARCHAR(32) DEFAULT 'INGESTED' CHECK (status IN ('INGESTED', 'TRIAGED', 'ASSIGNED_TO_FIELD', 'WORK_IN_PROGRESS', 'RESOLVED_VERIFIED', 'CITIZEN_NOTIFIED')),
    citizen_upvotes_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    sla_due_at TIMESTAMPTZ NOT NULL
);

-- Spatial GIST Index for Sub-millisecond Proximity Queries (< 100 meters)
CREATE INDEX idx_master_tickets_geom ON master_tickets USING GIST(geom);
CREATE INDEX idx_master_tickets_status ON master_tickets(status);

-- Citizen Social Ingestion Posts (OSINT Stream)
CREATE TABLE citizen_posts (
    id VARCHAR(64) PRIMARY KEY,
    platform VARCHAR(32) NOT NULL CHECK (platform IN ('X', 'META', 'YOUTUBE', 'DIRECT_KIOSK')),
    author_handle VARCHAR(128) NOT NULL,
    raw_text TEXT NOT NULL,
    language VARCHAR(32) DEFAULT 'Hinglish',
    media_url TEXT,
    media_phash VARCHAR(64), -- 64-bit DCT perceptual hash
    geom GEOMETRY(Point, 4326),
    master_ticket_id VARCHAR(32) REFERENCES master_tickets(id),
    is_noise BOOLEAN DEFAULT FALSE,
    noise_category VARCHAR(64),
    likes_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    ingested_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_citizen_posts_ticket ON citizen_posts(master_ticket_id);
CREATE INDEX idx_citizen_posts_phash ON citizen_posts(media_phash);

-- Closed-Loop Resolution Audit Log
CREATE TABLE resolution_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    master_ticket_id VARCHAR(32) REFERENCES master_tickets(id),
    officer_name VARCHAR(128) NOT NULL,
    officer_badge VARCHAR(64) NOT NULL,
    resolution_notes TEXT NOT NULL,
    before_image_url TEXT,
    after_image_url TEXT NOT NULL,
    bot_reply_dispatched BOOLEAN DEFAULT TRUE,
    bot_reply_text TEXT,
    resolved_at TIMESTAMPTZ DEFAULT NOW()
);`;

  const NEO4J_CYPHER = `// Spatio-Temporal Graph Schema & 100m Clustering Logic in Neo4j
CREATE CONSTRAINT FOR (m:MasterTicket) REQUIRE m.id IS UNIQUE;
CREATE CONSTRAINT FOR (p:CitizenPost) REQUIRE p.id IS UNIQUE;
CREATE POINT INDEX FOR (m:MasterTicket) ON (m.coordinates);

// Ingestion & Clustering Transaction (Python Driver Hook)
MATCH (m:MasterTicket {category: $category})
WHERE point.distance(m.coordinates, point({latitude: $lat, longitude: $lng})) <= 100
  AND duration.inHours(m.createdAt, datetime()).hours <= 72
WITH m ORDER BY point.distance(m.coordinates, point({latitude: $lat, longitude: $lng})) ASC LIMIT 1

MERGE (p:CitizenPost {id: $postId})
SET p.rawText = $text, p.author = $author, p.timestamp = datetime()

MERGE (p)-[r:CLUSTERS_INTO]->(m)
SET r.distanceMeters = point.distance(m.coordinates, point({latitude: $lat, longitude: $lng})),
    m.citizenUpvotes = m.citizenUpvotes + 1,
    m.updatedAt = datetime();`;

  const FASTAPI_WORKER = `# FastAPI / Celery Microservices Architecture
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import imagehash
from PIL import Image

app = FastAPI(title="Municipal Civic Intelligence Engine", version="2.4.0")

class PostIngestPayload(BaseModel):
    platform: str
    author_handle: str
    raw_text: str
    media_url: str | None = None
    lat: float
    lng: float
    likes: int = 0
    shares: int = 0

@app.post("/api/v1/triage")
async def triage_civic_post(payload: PostIngestPayload, background_tasks: BackgroundTasks):
    # Step 1: Binary Noise Filter
    if is_political_spam_or_meme(payload.raw_text):
        return {"action": "DROPPED", "reason": "Noise/Spam Filter Triggered"}

    # Step 2: Hinglish NLP & Civic NER Extraction
    entities = indicbert_ner_pipeline(payload.raw_text)
    department = zero_shot_department_classifier(payload.raw_text)

    # Step 3: Spatio-Temporal Graph Check (PostGIS + Neo4j)
    master_ticket_id, is_new_cluster = check_spatio_temporal_cluster(
        lat=payload.lat, 
        lng=payload.lng, 
        dept=department, 
        radius_meters=100, 
        window_hours=72
    )

    # Step 4: Dynamic Priority Score Calculation
    # Priority = (Severity * 0.40) + (Volume * 0.25) + (Engagement * 0.20) + (Location_Crit * 0.15)
    priority_score = calculate_dynamic_hazard(payload, entities, master_ticket_id)

    return {
        "status": "PROCESSED",
        "master_ticket_id": master_ticket_id,
        "is_new_cluster": is_new_cluster,
        "priority_score": priority_score,
        "department": department
    }`;

  const MASTER_TECHNICAL_PROMPT = `You are a Principal Systems Architect and Lead Engineer specializing in Civic Technology, OSINT, and Distributed Multi-Modal Municipal Platforms.

I need you to architect and write a comprehensive, production-ready technical specification and reference implementation blueprint for an automated Civic Grievance & Social Media Intelligence Platform named "Civic Kiosk".

### 1. System Mission & Core Problem
Citizens report civic infrastructure deficiencies (potholes, sanitation hazards, water shortages, hanging live wires, sewage overflow) across social media (X/Twitter, Instagram, Facebook, YouTube) in code-mixed languages (Hinglish/Hindi/English). Municipal authorities struggle with manual triage, duplicate complaints, language barriers, and untracked response lifecycles.

The objective of "Civic Kiosk" is to ingest unstructured public social media feeds, validate visual evidence via computer vision, classify departments via NLP, deduplicate related reports into a single Master Ticket via spatio-temporal graph clustering, dynamically compute a hazard priority score, and provide an actionable GIS dashboard for authorities with a closed-loop citizen resolution bot.

### 2. Core Modules & Technical Specifications Required:

Provide modular architecture specifications, concrete algorithms, data structures, and implementation logic for each of the following:

1. Ingestion & OSINT Pipeline:
   - Webhook and polling handlers for social media APIs (X/Twitter, Meta Graph, YouTube).
   - Text, media (image/video), metadata, and comment extraction.
   - Noise filtering (filtering out memes, political rants, and spam without actionable civic intent).

2. Hinglish NLP & Entity Extraction Pipeline (Python):
   - Transformer pipeline handling code-mixed Hinglish, Hindi, and English (e.g., IndicBERT, RoBERTa).
   - Zero-shot / fine-tuned Department Classification (PWD/Roads, Electricity Board/DISCOM, Water/Sewerage Board, Municipal Solid Waste).
   - Civic Named Entity Recognition (NER) pipeline tuned for Indian urban entities (Landmarks, Mohallas, Ward Numbers, Road names) mapped to geocoding.
   - Sentiment and Action Intent detection (differentiating passive commentary vs. active assistance requests).

3. Computer Vision & Media Authenticity Engine (Python):
   - Object detection and defect segmentation (YOLOv8/v11 fine-tuned for potholes, garbage overflow, street damage, waterlogging).
   - Perceptual image hashing (pHash) and perceptual similarity checking to prevent fake reports, reposted internet stock photos, or old archives.
   - Verification confidence scoring combining text context and visual proof.

4. Spatio-Temporal Graph & Deduplication Engine (Neo4j & Python):
   - Graph Schema: Nodes (:CitizenPost, :MasterTicket, :Department, :Location) and Relationships (:REPORTS, :CLUSTERS_INTO, :LOCATED_AT).
   - Clustering logic: Python function taking GPS coordinates (within 100m radius), timestamp (within 72h window), and category to merge related posts into an existing Master Ticket or create a new one.
   - Mechanism treating subsequent related posts as citizen upvotes/severity escalators.

5. Dynamic Priority Matrix & Alerting Engine:
   - Mathematical formula: Priority = (Severity * 0.40) + (Volume * 0.25) + (Engagement * 0.20) + (Location_Criticality * 0.15).
   - Hardcoded emergency keyword overrides ("current lag gaya", "live wire", "open manhole", "cylinder leak").

6. System Architecture & Database Schemas:
   - Microservices architecture diagram and data flow (FastAPI, Redis Queue/Kafka, Celery workers, PostgreSQL + PostGIS, Neo4j, Mapbox GL).
   - PostgreSQL/PostGIS DDL schema for Tickets, Departments, Spatial coordinates, and Resolution audit logs.
   - Closed-loop automated feedback mechanism: generating automated resolution replies to citizen social handles with verification proof.`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              System Architecture & Production Specifications
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                Production-Grade
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              PostgreSQL / PostGIS DDL, Neo4j Graph Cypher, FastAPI Microservices & System Prompt Specification
            </p>
          </div>
        </div>

        <button
          onClick={() => copyToClipboard(MASTER_TECHNICAL_PROMPT, 'prompt')}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-800 hover:bg-blue-900 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {copiedKey === 'prompt' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedKey === 'prompt' ? 'Master Prompt Copied!' : 'Copy Master Technical Prompt'}
        </button>
      </div>

      {/* Visual System Architecture Dataflow */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-700" />
          System Architecture & Dataflow
        </h3>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 overflow-x-auto text-[11px] font-mono text-slate-700 leading-relaxed">
          <pre>{`[Citizens on Social Media (X/Twitter, Meta Graph, YouTube, Kiosk Webhook)]
                 │  (Filtered Stream / Webhooks)
                 ▼
     ┌─────────────────────────────────────────────────────────────┐
     │           OSINT INGESTION & BINARY NOISE FILTER             │
     │  • Drops memes, political rants, commercial promotional spam│
     │  • Redis Queue / Event Queue                                │
     └──────────────────────────────┬──────────────────────────────┘
                                    │
                                    ▼
     ┌─────────────────────────────────────────────────────────────┐
     │              DISTRIBUTED INFERENCE WORKERS                  │
     │  1. Hinglish/Mixed NLP: IndicBERT Zero-Shot Dept & Civic NER│
     │  2. YOLO Defect Inspection: Potholes / Live Wires / Sewage  │
     │  3. Media Authenticity: 64-bit DCT pHash Duplicate Check    │
     └──────────────────────────────┬──────────────────────────────┘
                                    │
                                    ▼
     ┌─────────────────────────────────────────────────────────────┐
     │      SPATIO-TEMPORAL DEDUPLICATION (POSTGIS + NEO4J)        │
     │  • Match Rule: ST_DWithin <= 100m AND Timestamp <= 72h      │
     │  • Collapses duplicate reports into Master Incident Node    │
     │  • Dynamic Priority: (S*0.4 + V*0.25 + E*0.2 + L*0.15)      │
     └──────────────────────────────┬──────────────────────────────┘
                                    │
                                    ▼
     ┌─────────────────────────────────────────────────────────────┐
     │          MUNICIPAL GIS COMMAND & FIELD RESOLUTION           │
     │  • PostGIS / Mapbox Tactical Command Map & SLA Countdown    │
     │  • Field Squad "Before & After" Photo Verification          │
     │  • Automated Citizen Notification Dispatch                  │
     └─────────────────────────────────────────────────────────────┘`}</pre>
        </div>
      </div>

      {/* Schemas: PostGIS DDL, Neo4j, FastAPI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PostGIS DDL */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-blue-700" />
              PostgreSQL 16 + PostGIS 3.4 DDL Schema
            </span>
            <button
              onClick={() => copyToClipboard(POSTGIS_DDL, 'postgis')}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono flex items-center gap-1 cursor-pointer border border-slate-200"
            >
              {copiedKey === 'postgis' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'postgis' ? 'Copied' : 'Copy SQL'}
            </button>
          </div>
          <pre className="p-3 bg-slate-50 rounded-lg text-[11px] font-mono text-slate-800 overflow-x-auto max-h-72 scrollbar-thin border border-slate-200">
            {POSTGIS_DDL}
          </pre>
        </div>

        {/* Neo4j Cypher & Graph Schema */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-700" />
              Neo4j Cypher Deduplication Queries
            </span>
            <button
              onClick={() => copyToClipboard(NEO4J_CYPHER, 'cypher')}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono flex items-center gap-1 cursor-pointer border border-slate-200"
            >
              {copiedKey === 'cypher' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'cypher' ? 'Copied' : 'Copy Cypher'}
            </button>
          </div>
          <pre className="p-3 bg-slate-50 rounded-lg text-[11px] font-mono text-slate-800 overflow-x-auto max-h-72 scrollbar-thin border border-slate-200">
            {NEO4J_CYPHER}
          </pre>
        </div>
      </div>

      {/* FastAPI Worker Reference */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-emerald-700" />
            FastAPI & Celery Microservice Reference
          </span>
          <button
            onClick={() => copyToClipboard(FASTAPI_WORKER, 'fastapi')}
            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono flex items-center gap-1 cursor-pointer border border-slate-200"
          >
            {copiedKey === 'fastapi' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            {copiedKey === 'fastapi' ? 'Copied' : 'Copy Python'}
          </button>
        </div>
        <pre className="p-3 bg-slate-50 rounded-lg text-[11px] font-mono text-slate-800 overflow-x-auto max-h-60 scrollbar-thin border border-slate-200">
          {FASTAPI_WORKER}
        </pre>
      </div>
    </div>
  );
};
