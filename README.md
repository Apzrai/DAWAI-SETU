### 💊 DAWAI-SETU Drug Availability Watch & Inter - facility Transfer utility

From one empty shelf to regional shortage - detect it early, understand how it could spread , and act before it becomes a crisis 

 🌐Live Demo App: https://dawai-setu.netlify.app/
---


## 📌 Problem Statement

A healthcare facility running out of an essential medicine may initially look like an isolated inventory problem, but declining stock at several facilities can be an early signal of a wider supply disruption.

Consumption patterns, replenishment delays, uneven inventories, and geographic constraints can cause shortages to spread before health authorities have enough time to respond.

Without a shared view of demand and supply:

- A facility approaching stockout may not be visible to nearby facilities.
- Surplus medicine at one facility may remain unused while another facility faces a shortage.
- Increasing consumption may go unnoticed until inventory becomes critical.
- Delayed replenishment can turn a manageable shortage into a serious disruption.
- Decision-makers may lack visibility into whether a shortage is isolated or spreading across the region.

The challenge is therefore not only to identify where medicine is unavailable today, but to understand:

**How a local shortage could develop into a wider regional disruption — and what can be done before it happens.**

---

## 💡 Solution Overview
  ## 📸 System Previews

<img width="1280" height="768" alt="image" src="https://github.com/user-attachments/assets/87153408-d1bc-4540-bf0c-c52cf82ae931" />

<img width="1264" height="764" alt="image" src="https://github.com/user-attachments/assets/814405bb-6881-4a2f-a72a-a94ebe93d1a4" />

### Why DAWAI-SETU?

Medicine shortages should be addressed before the shelf becomes empty.

DAWAI-SETU focuses on reducing the time between an early shortage signal and an informed intervention.

Instead of looking at inventory in isolation, the system brings together:

**Stock + Consumption + Demand Trends + Replenishment + Geography**

to provide a regional picture of medicine availability and identify opportunities for early action.

### What is DAWAI-SETU?

DAWAI-SETU is a healthcare supply intelligence and coordination platform that:

- Monitors medicine and blood-bank availability across healthcare facilities.
- Scores stockout risk from stock levels, consumption trend, and replenishment lead time.
- Tracks incoming replenishment and whether it will arrive in time.
- Flags when the same medicine is trending toward shortage across multiple facilities.
- Communicates risk with a plain-language explanation, not just a red flag.
- Identifies nearby facilities with available surplus.
- Recommends and supports inter-facility medicine and blood transfers.
- Tracks every transfer from request through delivery.
- Maintains an alert and transfer history for follow-up.

The goal is to move healthcare supply management from:

**Reactive stockout response → Proactive shortage prevention.**

### How Does It Work?

```
INVENTORY & BLOOD BANK DATA
            │
            ▼
   CONSUMPTION / DEMAND TREND
            │
            ▼
   DAYS-OF-STOCK PROJECTION
            │
   ┌────────┴─────────┐
   ▼                   ▼
REPLENISHMENT      NEARBY-FACILITY
& LEAD TIME        RISK CORROBORATION
   │                   │
   └────────┬──────────┘
            ▼
 STOCKOUT RISK SCORE + CONFIDENCE
            │
            ▼
   GEOGRAPHIC / NETWORK CONTEXT
            │
            ▼
   SURPLUS IDENTIFICATION
            │
            ▼
 REDISTRIBUTION RECOMMENDATION
            │
            ▼
   TRANSFER WORKFLOW
 (Request → Approve → Transit → Receive)
            │
            ▼
     RISK RE-EVALUATION
```

### Impact

DAWAI-SETU aims to create impact at both the facility level and the regional healthcare-network level.

**Earlier Shortage Detection**
Identify potential stockouts before inventory reaches zero, giving decision-makers more time to intervene.

**Better Use of Existing Stock**
A shortage at one facility may be solvable using surplus that already exists elsewhere in the network. DAWAI-SETU helps make that surplus visible.

**Reduced Risk of Regional Disruption**
By analyzing the same medicine across multiple facilities, the system can surface early signals of a wider shortage rather than treating each facility in isolation.

**Smarter Redistribution**
Recommendations consider both urgency and geography, helping identify practical, nearby sources of supply.

**Replenishment-Aware Decisions**
A facility may not need emergency redistribution if replenishment is arriving in time. Conversely, a delayed shipment may require immediate intervention.

**Explainable Decision Support**
Instead of simply showing a red warning, the system provides context around:
- Why is this facility at risk?
- When could it run out?
- Is the problem spreading?
- What intervention could help?

**Better Regional Coordination**
DAWAI-SETU creates a shared intelligence layer across hospitals, pharmacies, labs/blood banks, and dealers — enabling stakeholders to move from isolated inventory management toward coordinated regional supply management.

---

## ⚙️ Key Functionalities

**📊 Regional Command Dashboard**
Role-specific dashboards (Hospital, Pharmacy, Lab/Blood Bank, Dealer, Regional Admin) giving KPIs, at-risk stock, pending transfers, and network alerts at a glance.

**💊 Medicine & Inventory Monitoring**
Tracks medicine stock per facility using: quantity available, average daily consumption, consumption trend, incoming shipments, replenishment lead time, criticality (Essential / Life-saving), batch expiry, and data confidence.

**🚨 Stockout Risk Detection**
A weighted risk-scoring model projects days-of-stock remaining against replenishment lead time, factors in consumption trend, incoming supply, medicine criticality, expiry, and corroborating risk at sibling facilities — producing a Safe / At Risk / High Risk / Critical score for every medicine at every facility.

**📦 Replenishment & Lead-Time Awareness**
Evaluates whether incoming stock is expected to arrive before the projected stockout window closes.

**🌐 Regional Shortage Analysis**
Aggregates risk for the same medicine (and blood group) across the network to distinguish an isolated dip from a shortage pattern spreading across multiple facilities.

**🧠 Confidence-Aware Risk Scoring**
Each risk score is paired with a confidence note (High / Moderate / Low) based on how recently a facility's consumption data was updated.

**🗺️ Geographic Supply Mapping**
An interactive regional map of the Mangaluru–Udupi–Manipal network, filterable by facility type, with facilities auto-classified as urban or rural based on nearby facility density.

**🔄 Surplus-to-Shortage Matching**
Surfaces which nearby facilities are holding surplus of a medicine or blood group that another facility is running low on.

**💡 Redistribution Recommendations**
Ranks potential transfer sources by shortage urgency, surplus availability, and distance.

**🩸 Blood Bank Module**
Applies the same stock/demand/expiry risk model specifically to blood units per blood group, per facility.

**🚚 Inter-Facility Transfer Workflow**
A full transfer lifecycle — **Requested → Approved → Pickup Scheduled → Picked Up → In Transit → Delivered → Received** — with a simulated delivery partner, live tracker, and an inbox for incoming requests.

**🔔 Persistent Alert & Transfer History**
Maintains a running log of shortage alerts and completed/ongoing transfers for review and follow-up.

**🔐 Guided Facility Onboarding**
A sign-in flow where a user selects their facility type, verifies via a (simulated) OTP, detects their location, and lands on a dashboard scoped to their role.

---

## 🏗️ System Architecture

This build is a **self-contained frontend prototype**: the intelligence layer (risk scoring, forecasting, surplus matching) runs client-side against a realistic, seeded synthetic dataset, so the full demo works without any backend or live hospital data.

```
┌─────────────────────────────────────────┐
│                 FRONTEND                 │
│                                          │
│  Dashboard • Inventory • Blood Bank      │
│  Map • Network • Redistribution          │
│  Shortage Intelligence • Transfers       │
│  Inbox • Alerts • History                │
│                                          │
│     React 19 + Vite + Tailwind CSS       │
│         (client-side risk engine)        │
└──────────────────┬────────────────────────┘
                    │
                    │  seeded synthetic
                    │  facility / inventory /
                    │  blood / transfer data
                    ▼
┌─────────────────────────────────────────┐
│         SIMULATED DATA LAYER             │
│                                          │
│  Facilities • Medicines • Inventory      │
│  Blood Stock • Transfers • Alerts        │
│                                          │
│   Deterministic seeded generator (in-app)│
└─────────────────────────────────────────┘
```

**Planned production architecture** (not yet built) would move the intelligence layer to a real backend and persist data in a database:

```
Frontend (React)  →  REST API  →  Backend (Node.js/Express)  →  Database (PostgreSQL)
```

with facility inventory, demand history, replenishment, and transfer records persisted per facility, and the risk/forecasting logic exposed as backend services rather than running client-side on synthetic data.

---

## 🚀 Getting Started

```bash
git clone https://github.com/<your-username>/dawai-setu.git
cd dawai-setu
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

**Demo login:** pick a facility type → pick any facility (look for "(Rural)" for the rural-logistics scenario) → enter any name/contact → verification code `1234` → allow the simulated location check.

```bash
npm run build     # production build
npm run preview   # preview the production build
npm run lint       # run oxlint
```

---

## 🛠️ Tech Stack

### Current build (this prototype)
- React 19
- Vite
- Tailwind CSS
- Recharts
- Lucide Icons

### Risk & Forecasting Logic (in-app)
- Days-of-stock projection (stock ÷ average daily consumption)
- Lead-time-relative risk thresholds
- Consumption trend weighting
- Criticality and expiry weighting
- Cross-facility risk corroboration
- Confidence scoring based on data recency

### Planned for a production version
- **Backend:** Node.js, Express, TypeScript, Zod, Pino
- **Database:** PostgreSQL with Drizzle ORM / Drizzle Kit
- **API layer:** REST, OpenAPI, Zod validation, generated API client
- **Forecasting:** exponentially weighted demand estimation, linear trend analysis, replenishment-aware stockout projection, regional risk aggregation

---

## 👥 Meet the Team (Team Name)

* **[Sumukh](https://github.com/sumukhsjec2029):** System Architecture & Backend Logic
* **[Apeksha](https://github.com/Apzrai):** Frontend Development & UI/UX Design
* **[Nireeksha](https://github.com/nireekshashettyy):** Geospatial Integration & Data Modeling

---
