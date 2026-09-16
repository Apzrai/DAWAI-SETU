import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutDashboard, Pill, Droplet, Repeat, AlertTriangle, Map as MapIcon,
  Network, Inbox as InboxIcon, Truck, Bell, History as HistoryIcon, Search,
  ChevronRight, ChevronDown, CheckCircle2, Circle, TrendingUp, TrendingDown,
  MapPin, Building2, X, LogOut, ShieldCheck, ArrowRight, Package, Send,
  ThumbsUp, ThumbsDown, RefreshCw, Clock, Loader2, Landmark, FlaskConical,
  Store, Warehouse, Info, ArrowLeftRight, ChevronLeft, Bike
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

/* ============================================================================
   TOKENS
============================================================================ */
const T = {
  paper: "#F5F6F1",
  paperDim: "#ECEEE7",
  ink: "#152521",
  tealDeep: "#0E2E2A",
  teal: "#1C4A45",
  tealSoft: "#DCE7E3",
  amber: "#C1863C",
  amberSoft: "#F1E1C9",
  line: "#DBE1D8",
  safe: "#2E8B57",
  safeSoft: "#DFF0E5",
  atrisk: "#C99A2E",
  atriskSoft: "#F5EBD1",
  highrisk: "#D97F32",
  highriskSoft: "#F6E4D2",
  critical: "#C24B44",
  criticalSoft: "#F5DEDB",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap');`;

/* ============================================================================
   UTILITIES
============================================================================ */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1337);
const ri = (a, b) => Math.floor(rand() * (b - a + 1)) + a;
const rf = (a, b, d = 1) => +(rand() * (b - a) + a).toFixed(d);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const uid = (() => { let n = 0; return (p = "id") => `${p}-${(++n).toString(36)}`; })();
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function addDays(days) { const d = new Date(); d.setDate(d.getDate() + days); return d; }
function fmtDate(d) { return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
function fmtDateTime(d) { return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); }
function daysUntil(d) { return Math.round((d - new Date()) / 86400000); }

/* ============================================================================
   STATIC POOLS
============================================================================ */
const TOWNS = [
  { name: "Mangaluru", cx: 190, cy: 430, spread: 95 },
  { name: "Udupi", cx: 470, cy: 220, spread: 60 },
  { name: "Manipal", cx: 555, cy: 265, spread: 45 },
];

const HOSPITAL_NAMES = [
  "Fr Muller Medical College Hospital", "KMC Hospital Attavar", "Yenepoya Medical College Hospital",
  "A.J. Hospital & Research Centre", "Unity Hospital", "Kasturba Medical College Hospital",
  "Manipal Tiger Circle Hospital", "Govt. Wenlock District Hospital", "City Multispeciality Hospital",
  "Cana Charitable Hospital", "Shirdi Sai Baba Hospital", "Coastal Institute of Medical Sciences",
];
const PHARMACY_NAMES = [
  "Apollo Pharmacy", "MedPlus Health Services", "Janatha Medical Store", "Wellness Forever Pharmacy",
  "Konkan Chemists", "Health First Pharmacy", "City Medicos", "Shree Pharma Retail",
  "Coastal Pharmacy", "Sanjeevini Medicals", "Care Plus Pharmacy", "Sunrise Chemists",
];
const LAB_NAMES = [
  "SRL Diagnostics", "Metropolis Healthcare Labs", "KMC Diagnostic Centre", "Thyrocare Collection Centre",
  "Lifeline Labs & Blood Bank", "Coastal Regional Blood Bank", "District Blood Transfusion Centre",
  "Manipal Diagnostic & Blood Services",
];
const DEALER_NAMES = [
  "Konkan Medical Suppliers", "Sunrise Pharma Distributors", "Coastal Drug House",
  "Karnataka Medical Agencies", "United Pharma Distributors", "Southern Drug Corporation",
  "Malabar Medical Supplies", "Tulunadu Pharma Traders",
];

const MEDICINE_CATALOG = [
  { name: "Amoxicillin 500mg", category: "Antibiotic", criticality: "Essential", unit: "strips" },
  { name: "Azithromycin 250mg", category: "Antibiotic", criticality: "Essential", unit: "strips" },
  { name: "Ceftriaxone 1g Injection", category: "Antibiotic", criticality: "Life-saving", unit: "vials" },
  { name: "Metronidazole 400mg", category: "Antibiotic", criticality: "Essential", unit: "strips" },
  { name: "Cefixime 200mg", category: "Antibiotic", criticality: "Essential", unit: "strips" },
  { name: "Doxycycline 100mg", category: "Antibiotic", criticality: "Essential", unit: "strips" },
  { name: "Ceftazidime Injection", category: "Antibiotic", criticality: "Life-saving", unit: "vials" },
  { name: "Paracetamol 500mg", category: "Analgesic", criticality: "Routine", unit: "strips" },
  { name: "Diclofenac 50mg", category: "Analgesic", criticality: "Routine", unit: "strips" },
  { name: "Tramadol 50mg", category: "Analgesic", criticality: "Essential", unit: "strips" },
  { name: "Ondansetron 4mg Injection", category: "Analgesic", criticality: "Essential", unit: "vials" },
  { name: "Insulin Glargine", category: "Antidiabetic", criticality: "Life-saving", unit: "vials" },
  { name: "Metformin 500mg", category: "Antidiabetic", criticality: "Essential", unit: "strips" },
  { name: "Glimepiride 2mg", category: "Antidiabetic", criticality: "Essential", unit: "strips" },
  { name: "Atorvastatin 20mg", category: "Cardiac", criticality: "Essential", unit: "strips" },
  { name: "Clopidogrel 75mg", category: "Cardiac", criticality: "Life-saving", unit: "strips" },
  { name: "Heparin Injection", category: "Cardiac", criticality: "Life-saving", unit: "vials" },
  { name: "Warfarin 5mg", category: "Cardiac", criticality: "Essential", unit: "strips" },
  { name: "Furosemide 40mg", category: "Cardiac", criticality: "Essential", unit: "strips" },
  { name: "Amlodipine 5mg", category: "Antihypertensive", criticality: "Essential", unit: "strips" },
  { name: "Telmisartan 40mg", category: "Antihypertensive", criticality: "Essential", unit: "strips" },
  { name: "Losartan 50mg", category: "Antihypertensive", criticality: "Essential", unit: "strips" },
  { name: "Salbutamol Inhaler", category: "Respiratory", criticality: "Life-saving", unit: "inhalers" },
  { name: "Budesonide Nebulizer Solution", category: "Respiratory", criticality: "Essential", unit: "vials" },
  { name: "Oseltamivir 75mg", category: "Antiviral", criticality: "Essential", unit: "strips" },
  { name: "Acyclovir 400mg", category: "Antiviral", criticality: "Essential", unit: "strips" },
  { name: "Vitamin D3 60000IU", category: "Vitamin", criticality: "Routine", unit: "sachets" },
  { name: "Vitamin B12 Injection", category: "Vitamin", criticality: "Routine", unit: "vials" },
  { name: "Iron Sucrose Injection", category: "Vitamin", criticality: "Essential", unit: "vials" },
  { name: "Normal Saline 500ml IV", category: "IV Fluid", criticality: "Life-saving", unit: "bottles" },
  { name: "Ringer Lactate 500ml IV", category: "IV Fluid", criticality: "Life-saving", unit: "bottles" },
  { name: "Dextrose 5% IV", category: "IV Fluid", criticality: "Essential", unit: "bottles" },
  { name: "Tetanus Toxoid Vaccine", category: "Vaccine", criticality: "Essential", unit: "vials" },
  { name: "Hepatitis B Vaccine", category: "Vaccine", criticality: "Essential", unit: "vials" },
  { name: "Rabies Vaccine", category: "Vaccine", criticality: "Life-saving", unit: "vials" },
  { name: "Lignocaine 2% Injection", category: "Anesthetic", criticality: "Essential", unit: "vials" },
  { name: "Propofol Injection", category: "Anesthetic", criticality: "Life-saving", unit: "vials" },
  { name: "Pantoprazole 40mg", category: "Gastro", criticality: "Essential", unit: "strips" },
  { name: "Ranitidine 150mg", category: "Gastro", criticality: "Routine", unit: "strips" },
  { name: "ORS Sachets", category: "Gastro", criticality: "Essential", unit: "sachets" },
  { name: "Human Albumin 20%", category: "Critical Care", criticality: "Life-saving", unit: "vials" },
  { name: "Methotrexate Injection", category: "Oncology", criticality: "Life-saving", unit: "vials" },
  { name: "Chlorhexidine Solution", category: "Antiseptic", criticality: "Routine", unit: "bottles" },
  { name: "Povidone Iodine Solution", category: "Antiseptic", criticality: "Routine", unit: "bottles" },
  { name: "Surgical Gloves (Box)", category: "Consumable", criticality: "Essential", unit: "boxes" },
  { name: "N95 Masks (Box)", category: "Consumable", criticality: "Essential", unit: "boxes" },
];

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

/* ============================================================================
   DATA GENERATION (deterministic, once per module load)
============================================================================ */
const NO_BLOOD_BANK_HOSPITAL = "Cana Charitable Hospital";
const RURAL_OUTLIER_SPOTS = [
  { x: 690, y: 520 }, { x: 60, y: 180 }, { x: 740, y: 150 }, { x: 50, y: 560 }, { x: 760, y: 400 },
];
function nearestTownName(pt) {
  let best = TOWNS[0], bd = Infinity;
  TOWNS.forEach((t) => { const d = Math.hypot(pt.x - t.cx, pt.y - t.cy); if (d < bd) { bd = d; best = t; } });
  return best.name;
}

function buildFacilities() {
  const list = [];
  const specs = [
    { type: "Hospital", names: HOSPITAL_NAMES },
    { type: "Pharmacy", names: PHARMACY_NAMES },
    { type: "Laboratory", names: LAB_NAMES },
    { type: "Medicine Dealer", names: DEALER_NAMES },
  ];
  specs.forEach(({ type, names }) => {
    names.forEach((name) => {
      const town = pick(TOWNS);
      const ang = rand() * Math.PI * 2;
      const r = rand() * town.spread;
      const x = clamp(town.cx + Math.cos(ang) * r, 40, 760);
      const y = clamp(town.cy + Math.sin(ang) * r, 40, 560);
      list.push({
        id: uid("fac"),
        name, type, town: town.name, x, y,
        isBloodBank: type === "Laboratory" || (type === "Hospital" && name !== NO_BLOOD_BANK_HOSPITAL),
        phone: `+91 ${ri(70000, 99999)}${ri(10000, 99999)}`,
      });
    });
  });
  // Deliberately relocate a handful of facilities to genuinely isolated spots (>65 units from
  // every other facility) so at least one Hospital, Pharmacy, Laboratory and Medicine Dealer
  // reliably classify as Rural for demo purposes — nearby-density classification below then
  // applies naturally, it isn't a fake label.
  const ruralPlan = [
    { type: "Hospital", count: 2 },
    { type: "Pharmacy", count: 1 },
    { type: "Laboratory", count: 1 },
    { type: "Medicine Dealer", count: 1 },
  ];
  let spotIdx = 0;
  ruralPlan.forEach(({ type, count }) => {
    const idxs = list.map((f, i) => ({ f, i })).filter((o) => o.f.type === type).slice(-count).map((o) => o.i);
    idxs.forEach((i) => {
      const spot = RURAL_OUTLIER_SPOTS[spotIdx++];
      list[i] = { ...list[i], x: spot.x, y: spot.y, town: nearestTownName(spot) };
    });
  });
  return list;
}

function classifyAreas(facilities) {
  return facilities.map((f) => {
    const near = facilities.filter((o) => o.id !== f.id && dist(o, f) < 65).length;
    const area = near >= 9 ? "Urban" : near >= 4 ? "Semi-Urban" : "Rural";
    return { ...f, area, nearbyDensity: near };
  });
}

function buildInventory(facilities) {
  const rows = [];
  facilities.forEach((f) => {
    let count;
    if (f.type === "Hospital") count = ri(20, 30);
    else if (f.type === "Medicine Dealer") count = ri(26, 36);
    else if (f.type === "Pharmacy") count = ri(15, 24);
    else count = ri(6, 12);
    const idxPool = [...Array(MEDICINE_CATALOG.length).keys()];
    for (let i = idxPool.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [idxPool[i], idxPool[j]] = [idxPool[j], idxPool[i]];
    }
    const chosen = idxPool.slice(0, count);
    chosen.forEach((mi) => {
      const med = MEDICINE_CATALOG[mi];
      const baseScale = f.type === "Medicine Dealer" ? 6 : f.type === "Hospital" ? 2.2 : 1;
      const avgDailyConsumption = rf(0.8, 40, 1) * (f.type === "Hospital" ? 1.6 : 1);
      const stockDaysTendency = rf(0.6, 14, 1); // how many days worth they tend to hold
      const stock = Math.round(avgDailyConsumption * stockDaysTendency * baseScale * rf(0.4, 1.3, 2));
      const trendPct = ri(-22, 38);
      const leadTimeDays = f.type === "Medicine Dealer" ? ri(2, 5) : ri(3, 10);
      const incoming = rand() < 0.4 ? ri(20, 400) : 0;
      const supplier = f.type === "Medicine Dealer" ? "Central Manufacturer Direct" : pick(DEALER_NAMES);
      const expiry = addDays(ri(12, 640));
      const confRoll = rand();
      const dataConfidence = confRoll < 0.62 ? "High" : confRoll < 0.86 ? "Moderate" : "Low";
      const lastUpdatedDaysAgo = dataConfidence === "High" ? ri(0, 1) : dataConfidence === "Moderate" ? ri(2, 5) : ri(6, 12);
      rows.push({
        id: uid("row"), facilityId: f.id, medicineIndex: mi, name: med.name, category: med.category,
        criticality: med.criticality, unit: med.unit, stock, avgDailyConsumption, trendPct,
        leadTimeDays, incoming, supplier, expiry, dataConfidence, lastUpdatedDaysAgo,
      });
    });
  });
  return rows;
}

function buildBlood(facilities) {
  const rows = [];
  facilities.filter((f) => f.isBloodBank).forEach((f) => {
    BLOOD_GROUPS.forEach((bg) => {
      const demandPerDay = rf(0.4, 6, 1);
      const units = ri(0, 46);
      const incoming = rand() < 0.3 ? ri(4, 30) : 0;
      const expiry = addDays(ri(4, 40));
      rows.push({ id: uid("bl"), facilityId: f.id, bloodGroup: bg, units, demandPerDay, incoming, expiry, reserved: ri(0, Math.min(6, units)) });
    });
  });
  return rows;
}

const FACILITIES = classifyAreas(buildFacilities());
const INVENTORY_BASE = buildInventory(FACILITIES);
const BLOOD_BASE = buildBlood(FACILITIES);
const facilityById = Object.fromEntries(FACILITIES.map((f) => [f.id, f]));

function buildSeedTransfers() {
  const txs = [];
  for (let i = 0; i < 7; i++) {
    const row = pick(INVENTORY_BASE);
    let dest = pick(FACILITIES);
    while (dest.id === row.facilityId) dest = pick(FACILITIES);
    const src = facilityById[row.facilityId];
    const statuses = ["Requested", "Approved", "Pickup Scheduled", "Picked Up", "In Transit", "Delivered", "Received"];
    const statusIdx = ri(0, statuses.length - 1);
    const d = Math.round(dist(src, dest) / 8);
    txs.push({
      id: uid("TXN"), medicineName: row.name, unit: row.unit, qty: ri(20, 300),
      sourceId: src.id, destId: dest.id, distanceKm: d,
      etaMins: clamp(d * 3 + ri(15, 60), 20, 400),
      status: statuses[statusIdx], createdAt: addDays(-ri(0, 6)),
      kind: "Redistribution",
    });
  }
  return txs;
}
const TRANSFERS_SEED = buildSeedTransfers();

/* ============================================================================
   RISK ENGINE
============================================================================ */
// Rural facilities sit far from the supply corridor, so a shipment that has "left the
// dealer" still needs several more days of last-mile transport to actually arrive. We add
// that buffer to the lead time, which makes rural sites cross the alert threshold earlier —
// an advance warning rather than a late one.
const RURAL_BUFFER_DAYS = 3;

function computeRisk(row, siblingRows) {
  const fac = facilityById[row.facilityId];
  const isRural = fac?.area === "Rural";
  const ruralBuffer = isRural ? RURAL_BUFFER_DAYS : 0;
  const effectiveLeadTime = row.leadTimeDays + ruralBuffer;

  const daysOfStock = row.stock / Math.max(row.avgDailyConsumption, 0.15);
  let score = 0;
  if (daysOfStock <= effectiveLeadTime * 0.5) score += 42;
  else if (daysOfStock <= effectiveLeadTime) score += 27;
  else if (daysOfStock <= effectiveLeadTime * 1.6) score += 12;
  else score += 2;
  if (row.trendPct >= 20) score += 20;
  else if (row.trendPct >= 8) score += 11;
  else if (row.trendPct <= -15) score -= 6;
  if (row.incoming === 0) score += 13; else if (row.incoming < row.avgDailyConsumption * 3) score += 5;
  if (row.criticality === "Life-saving") score += 14; else if (row.criticality === "Essential") score += 7;
  const expDays = daysUntil(row.expiry);
  if (expDays < 21) score += 9;
  const nearbyDeclining = siblingRows.filter((s) => s.id !== row.id && s.trendPct > 12).length;
  score += Math.min(nearbyDeclining * 4, 12);
  if (row.dataConfidence === "Low") score += 4;
  // Raise rural sites earlier: a thin margin over the rural resupply window is already urgent.
  const advanceAlert = isRural && daysOfStock <= effectiveLeadTime + 2;
  if (advanceAlert) score += 9;
  score = clamp(Math.round(score), 3, 97);

  let level, color, soft, label;
  if (score >= 68) { level = "critical"; color = T.critical; soft = T.criticalSoft; label = "Critical / Stockout Risk"; }
  else if (score >= 48) { level = "high"; color = T.highrisk; soft = T.highriskSoft; label = "High Risk"; }
  else if (score >= 28) { level = "atrisk"; color = T.atrisk; soft = T.atriskSoft; label = "At Risk"; }
  else { level = "safe"; color = T.safe; soft = T.safeSoft; label = "Safe"; }

  const reasons = [];
  reasons.push(`${row.trendPct >= 0 ? "Consumption increased" : "Consumption fell"} ${Math.abs(row.trendPct)}% over the last 2 weeks`);
  reasons.push(`${daysOfStock.toFixed(1)} days of stock remain against a ${row.leadTimeDays}-day replenishment lead time`);
  if (isRural) reasons.push(`Rural site — add about ${ruralBuffer} days of last-mile transport, so the realistic resupply window is ${effectiveLeadTime} days door-to-door`);
  reasons.push(row.incoming > 0 ? `${row.incoming} ${row.unit} already incoming from ${row.supplier}` : "No incoming shipment currently scheduled");
  if (nearbyDeclining > 0) reasons.push(`${nearbyDeclining} other facility record${nearbyDeclining > 1 ? "s" : ""} for this medicine show rising consumption too`);
  if (expDays < 60) reasons.push(`Current batch expires in ${expDays} days`);

  const confidence = row.dataConfidence;
  const confidenceNote = confidence === "High" ? "Consumption data updated within the last day"
    : confidence === "Moderate" ? `Moderate confidence — consumption data last updated ${row.lastUpdatedDaysAgo} days ago`
    : `Low confidence — consumption data has not refreshed for ${row.lastUpdatedDaysAgo} days`;

  const outIn = Math.max(1, Math.round(daysOfStock));
  const dayWord = (n) => `${n} day${n === 1 ? "" : "s"}`;

  let windowText;
  if (isRural) {
    const ruralTail = `restocking takes ${dayWord(row.leadTimeDays)} plus about ${dayWord(ruralBuffer)} of rural last-mile transport (${effectiveLeadTime} days door-to-door)`;
    if (daysOfStock <= effectiveLeadTime) {
      windowText = `Could run out in about ${dayWord(outIn)} — ${ruralTail}, so a new shipment may not arrive in time`;
    } else if (advanceAlert) {
      windowText = `Could run out in about ${dayWord(outIn)} — ${ruralTail}, leaving almost no margin, so order now`;
    } else {
      windowText = `Not expected to run out soon — current stock (${daysOfStock.toFixed(1)} days' worth) covers the ${effectiveLeadTime}-day rural resupply window (${ruralTail})`;
    }
  } else if (daysOfStock <= row.leadTimeDays) {
    windowText = `Could run out in about ${dayWord(outIn)} — restocking usually takes ${dayWord(row.leadTimeDays)}, so a new shipment may not arrive in time`;
  } else {
    windowText = `Not expected to run out soon — current stock (${daysOfStock.toFixed(1)} days' worth) comfortably covers the usual ${row.leadTimeDays}-day restocking time`;
  }

  return {
    score, level, color, soft, label, daysOfStock, reasons, confidence, confidenceNote, windowText,
    isRural, ruralBuffer, effectiveLeadTime, advanceAlert,
  };
}

function computeBloodRisk(entry) {
  const daysOfStock = entry.units / Math.max(entry.demandPerDay, 0.2);
  let score = 0;
  if (daysOfStock < 1.5) score += 55; else if (daysOfStock < 3) score += 32; else if (daysOfStock < 5) score += 14; else score += 2;
  if (entry.incoming === 0) score += 10;
  const expDays = daysUntil(entry.expiry);
  if (expDays < 7) score += 10;
  score = clamp(score, 3, 97);
  let level, color, soft;
  if (score >= 60) { level = "critical"; color = T.critical; soft = T.criticalSoft; }
  else if (score >= 38) { level = "high"; color = T.highrisk; soft = T.highriskSoft; }
  else if (score >= 20) { level = "atrisk"; color = T.atrisk; soft = T.atriskSoft; }
  else { level = "safe"; color = T.safe; soft = T.safeSoft; }
  return { score, level, color, soft, daysOfStock };
}

/* ============================================================================
   SMALL UI ATOMS
============================================================================ */
function StatusPill({ level, color, soft, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: soft, color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function RuralAdvanceBadge({ risk }) {
  if (!risk?.advanceAlert) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap"
      style={{ background: T.amberSoft, color: T.amber }} title={`Rural site — ${risk.effectiveLeadTime}-day door-to-door resupply window, so this alert is raised early`}>
      <Bike size={10} />RURAL · ADVANCE ALERT
    </span>
  );
}

function KpiCard({ label, value, sub, accent, icon: Icon }) {
  return (
    <div className="rounded-xl border p-4 bg-white flex flex-col gap-2" style={{ borderColor: T.line }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide uppercase text-stone-500">{label}</span>
        {Icon && <Icon size={16} style={{ color: accent || T.teal }} />}
      </div>
      <div className="font-mono text-2xl font-semibold" style={{ color: T.ink }}>{value}</div>
      {sub && <div className="text-xs text-stone-500">{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, sub, right }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h2 className="text-lg font-bold" style={{ color: T.ink }}>{title}</h2>
        {sub && <p className="text-sm text-stone-500 mt-0.5 max-w-2xl">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", icon: Icon, disabled }) {
  const base = "inline-flex items-center gap-1.5 rounded-lg font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed";
  const sizes = size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm";
  const styles = {
    primary: { background: T.teal, color: "white" },
    amber: { background: T.amber, color: "white" },
    outline: { background: "white", color: T.teal, border: `1px solid ${T.teal}` },
    ghost: { background: "transparent", color: T.ink },
    danger: { background: T.criticalSoft, color: T.critical },
  }[variant];
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${sizes}`} style={styles}>
      {Icon && <Icon size={size === "sm" ? 13 : 15} />}
      {children}
    </button>
  );
}

function FacilityTypeIcon({ type, size = 15 }) {
  const map = { Hospital: Landmark, Pharmacy: Store, Laboratory: FlaskConical, "Medicine Dealer": Warehouse };
  const I = map[type] || Building2;
  return <I size={size} />;
}

/* ============================================================================
   LOGIN / REGISTRATION FLOW
============================================================================ */
function LoginFlow({ onDone }) {
  const [step, setStep] = useState("form"); // form -> otp -> location -> role
  const [facilityType, setFacilityType] = useState("Hospital");
  const [managerName, setManagerName] = useState("");
  const [facilityId, setFacilityId] = useState("");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpErr, setOtpErr] = useState("");
  const [locState, setLocState] = useState("idle"); // idle -> detecting -> done

  const optionsForType = useMemo(() => FACILITIES.filter((f) => f.type === facilityType), [facilityType]);
  const chosenFacility = facilityById[facilityId];

  const canSend = managerName.trim().length > 1 && contact.trim().length > 4 && (facilityType === "Regional Admin" || facilityId);

  const otpRefs = useRef([]);

  function handleOtpChange(i, v) {
    if (!/^[0-9]?$/.test(v)) return;
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 3) otpRefs.current[i + 1]?.focus();
  }
  function verifyOtp() {
    if (otp.join("") === "1234" || otp.join("").length === 4) {
      setOtpErr("");
      setStep(facilityType === "Regional Admin" ? "role" : "location");
    } else setOtpErr("Enter the 4-digit demo code (hint: 1234)");
  }
  function detectLocation() {
    setLocState("detecting");
    setTimeout(() => setLocState("done"), 1100);
  }

  const roleMap = { Hospital: "Hospital Manager", Pharmacy: "Pharmacy/Dealer", "Medicine Dealer": "Pharmacy/Dealer", Laboratory: "Lab/Blood Bank", "Regional Admin": "Regional Admin" };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6" style={{ background: T.tealDeep }}>
      <style>{FONT_IMPORT}</style>
      <div className="w-full max-w-4xl grid md:grid-cols-5 rounded-2xl overflow-hidden shadow-2xl" style={{ fontFamily: "Manrope, sans-serif" }}>
        {/* Left brand panel */}
        <div className="md:col-span-2 p-8 flex flex-col justify-between" style={{ background: `linear-gradient(160deg, ${T.tealDeep}, #123632)` }}>
          <div>
            <div className="flex items-center gap-2 text-white">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: T.amber }}>
                <ArrowLeftRight size={18} color="white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">DAWAI-SETU</span>
            </div>
            <p className="text-white/60 text-xs mt-1 tracking-wide">Drug Availability Watch &amp; Inter-facility Transfer Utility</p>
          </div>
          <div className="my-8">
            <h1 className="text-white text-2xl font-bold leading-snug">Bridging facilities before shortages become crises.</h1>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">Detect early stockout risk, find nearby surplus, and move stock across the Mangaluru–Udupi–Manipal network before a local shortage turns regional.</p>
          </div>
          <div className="space-y-2">
            {["Detect", "Explain", "Predict", "Find surplus", "Redistribute", "Track", "Prevent"].map((s, i) => (
              <div key={s} className="flex items-center gap-2 text-white/70 text-xs">
                <span className="h-5 w-5 rounded-full flex items-center justify-center font-mono text-[10px]" style={{ background: "rgba(255,255,255,0.1)" }}>{i + 1}</span>
                {s}
              </div>
            ))}
          </div>
          <p className="text-white/35 text-[10px] mt-6">All facilities, inventory and network data shown are simulated for this demonstration.</p>
        </div>

        {/* Right form panel */}
        <div className="md:col-span-3 bg-white p-8">
          {step === "form" && (
            <div>
              <h2 className="text-xl font-bold" style={{ color: T.ink }}>Sign in to your network account</h2>
              <p className="text-sm text-stone-500 mt-1 mb-6">Select the simulated facility you manage to join the regional network.</p>

              <label className="text-xs font-semibold text-stone-500">Facility type</label>
              <div className="grid grid-cols-5 gap-2 mt-1.5 mb-4">
                {["Hospital", "Pharmacy", "Laboratory", "Medicine Dealer", "Regional Admin"].map((t) => (
                  <button key={t} onClick={() => { setFacilityType(t); setFacilityId(""); }}
                    className="flex flex-col items-center gap-1.5 rounded-lg border py-2.5 text-[10px] font-semibold text-center leading-tight px-1"
                    style={{ borderColor: facilityType === t ? T.teal : T.line, background: facilityType === t ? T.tealSoft : "white", color: facilityType === t ? T.teal : T.ink }}>
                    {t === "Regional Admin" ? <ShieldCheck size={15} /> : <FacilityTypeIcon type={t} />}
                    {t}
                  </button>
                ))}
              </div>

              <label className="text-xs font-semibold text-stone-500">{facilityType === "Regional Admin" ? "Name" : "Manager / user name"}</label>
              <input value={managerName} onChange={(e) => setManagerName(e.target.value)} placeholder="e.g. Dr. Ramesh Shetty"
                className="w-full mt-1.5 mb-4 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2" style={{ borderColor: T.line }} />

              {facilityType === "Regional Admin" ? (
                <div className="rounded-lg p-3 mb-4 text-xs" style={{ background: T.amberSoft, color: T.amber }}>
                  Regional Admin accounts oversee the full Mangaluru–Udupi–Manipal network rather than a single facility — no facility selection needed.
                </div>
              ) : (
                <>
                  <label className="text-xs font-semibold text-stone-500">Facility / company name</label>
                  <select value={facilityId} onChange={(e) => setFacilityId(e.target.value)}
                    className="w-full mt-1.5 mb-1 rounded-lg border px-3 py-2 text-sm outline-none bg-white" style={{ borderColor: T.line }}>
                    <option value="">Select your facility (demo directory)</option>
                    {optionsForType.map((f) => <option key={f.id} value={f.id}>{f.name} — {f.town} ({f.area})</option>)}
                  </select>
                  <p className="text-[11px] text-stone-400 mb-4">Look for "(Rural)" to try the rural-logistics demo — every facility type has at least one.</p>
                </>
              )}

              <label className="text-xs font-semibold text-stone-500">Email or phone number</label>
              <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="you@facility.org or 98xxxxxxxx"
                className="w-full mt-1.5 mb-6 rounded-lg border px-3 py-2 text-sm outline-none" style={{ borderColor: T.line }} />

              <Btn disabled={!canSend} onClick={() => setStep("otp")} icon={Send}>Send verification code</Btn>
            </div>
          )}

          {step === "otp" && (
            <div>
              <button onClick={() => setStep("form")} className="text-xs text-stone-400 flex items-center gap-1 mb-4"><ChevronLeft size={14} />Back</button>
              <h2 className="text-xl font-bold" style={{ color: T.ink }}>Enter verification code</h2>
              <p className="text-sm text-stone-500 mt-1 mb-1">Sent (simulated) to <span className="font-semibold" style={{ color: T.ink }}>{contact}</span>.</p>
              <p className="text-xs mb-6" style={{ color: T.amber }}>Demo mode — use code 1234, or any 4 digits.</p>
              <div className="flex gap-2 mb-6">
                {otp.map((v, i) => (
                  <input key={i} ref={(el) => (otpRefs.current[i] = el)} value={v} maxLength={1}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="h-12 w-12 text-center text-lg font-mono rounded-lg border outline-none focus:ring-2" style={{ borderColor: T.line }} />
                ))}
              </div>
              {otpErr && <p className="text-xs mb-3" style={{ color: T.critical }}>{otpErr}</p>}
              <Btn onClick={verifyOtp} icon={ShieldCheck}>Verify &amp; continue</Btn>
            </div>
          )}

          {step === "location" && (
            <div>
              <h2 className="text-xl font-bold" style={{ color: T.ink }}>Account verified</h2>
              <p className="text-sm text-stone-500 mt-1 mb-6">Allow location access so DAWAI-SETU can classify your area and factor distance into redistribution and logistics.</p>
              {locState === "idle" && <Btn onClick={detectLocation} icon={MapPin}>Allow location access</Btn>}
              {locState === "detecting" && (
                <div className="flex items-center gap-2 text-sm" style={{ color: T.teal }}><Loader2 size={16} className="animate-spin" />Detecting nearby facility density…</div>
              )}
              {locState === "done" && chosenFacility && (
                <div>
                  <div className="rounded-lg p-4 mb-5" style={{ background: T.tealSoft }}>
                    <p className="text-sm font-semibold" style={{ color: T.teal }}>Location detected: {chosenFacility.town}</p>
                    <p className="text-xs mt-1 text-stone-600">{chosenFacility.nearbyDensity} healthcare facilities found nearby → classified as <strong>{chosenFacility.area}</strong>.</p>
                  </div>
                  <Btn onClick={() => setStep("role")} icon={ArrowRight}>Continue</Btn>
                </div>
              )}
            </div>
          )}

          {step === "role" && (
            <div>
              <h2 className="text-xl font-bold" style={{ color: T.ink }}>You're all set, {managerName.split(" ")[0]}</h2>
              {facilityType === "Regional Admin" ? (
                <div className="rounded-lg border p-4 my-5" style={{ borderColor: T.line }}>
                  <div className="flex items-center gap-2 font-semibold" style={{ color: T.ink }}><ShieldCheck size={16} />Regional Admin</div>
                  <div className="text-xs text-stone-500 mt-1">Full visibility across all {FACILITIES.length} facilities in Mangaluru, Udupi and Manipal</div>
                </div>
              ) : chosenFacility && (
                <div className="rounded-lg border p-4 my-5" style={{ borderColor: T.line }}>
                  <div className="flex items-center gap-2 font-semibold" style={{ color: T.ink }}><FacilityTypeIcon type={chosenFacility.type} />{chosenFacility.name}</div>
                  <div className="text-xs text-stone-500 mt-1">{chosenFacility.type} · {chosenFacility.town} · {chosenFacility.area}</div>
                  <div className="text-xs text-stone-500 mt-1">Role: {roleMap[chosenFacility.type]}</div>
                </div>
              )}
              <Btn onClick={() => onDone({ managerName, contact, facility: chosenFacility || null, role: roleMap[facilityType] })} icon={ArrowRight}>
                Enter DAWAI-SETU
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   NAV CONFIG
============================================================================ */
function navFor(role, isAdmin) {
  if (isAdmin) return [
    { key: "dashboard", label: "Regional Dashboard", icon: LayoutDashboard },
    { key: "redistribution", label: "Regional Redistribution", icon: Repeat },
    { key: "shortage", label: "Shortage Intelligence", icon: AlertTriangle },
    { key: "map", label: "Regional Map", icon: MapIcon },
    { key: "network", label: "Facility Network", icon: Network },
    { key: "transfers", label: "Transfers", icon: Truck },
    { key: "alerts", label: "Alerts", icon: Bell },
    { key: "history", label: "History", icon: HistoryIcon },
  ];
  if (role === "Hospital Manager") return [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "inventory", label: "Medicines", icon: Pill, group: "My Hospital" },
    { key: "blood", label: "Blood Bank", icon: Droplet, group: "My Hospital" },
    { key: "redistribution", label: "Regional Redistribution", icon: Repeat },
    { key: "shortage", label: "Shortage Intelligence", icon: AlertTriangle },
    { key: "map", label: "Regional Map", icon: MapIcon },
    { key: "network", label: "Facility Network", icon: Network },
    { key: "inbox", label: "Inbox", icon: InboxIcon },
    { key: "transfers", label: "Transfers", icon: Truck },
    { key: "alerts", label: "Alerts", icon: Bell },
    { key: "history", label: "History", icon: HistoryIcon },
  ];
  if (role === "Lab/Blood Bank") return [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "blood", label: "Blood Bank", icon: Droplet },
    { key: "redistribution", label: "Regional Blood Network", icon: Repeat },
    { key: "map", label: "Regional Map", icon: MapIcon },
    { key: "network", label: "Facility Network", icon: Network },
    { key: "inbox", label: "Inbox", icon: InboxIcon },
    { key: "transfers", label: "Transfers", icon: Truck },
    { key: "alerts", label: "Alerts", icon: Bell },
    { key: "history", label: "History", icon: HistoryIcon },
  ];
  // Pharmacy/Dealer
  return [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "inventory", label: "Inventory", icon: Pill },
    { key: "redistribution", label: "Regional Redistribution", icon: Repeat },
    { key: "shortage", label: "Shortage Intelligence", icon: AlertTriangle },
    { key: "map", label: "Regional Map", icon: MapIcon },
    { key: "network", label: "Facility Network", icon: Network },
    { key: "inbox", label: "Inbox / Requests", icon: InboxIcon },
    { key: "transfers", label: "Transfers", icon: Truck },
    { key: "alerts", label: "Alerts", icon: Bell },
    { key: "history", label: "History", icon: HistoryIcon },
  ];
}

/* ============================================================================
   SIDEBAR + TOPBAR
============================================================================ */
function Sidebar({ user, nav, active, setActive, onLogout, alertCount }) {
  const grouped = [];
  let cur = null;
  nav.forEach((item) => {
    if (item.group) {
      if (!cur || cur.group !== item.group) { cur = { group: item.group, items: [] }; grouped.push(cur); }
      cur.items.push(item);
    } else { grouped.push({ group: null, items: [item] }); cur = null; }
  });
  return (
    <div className="w-64 shrink-0 h-screen sticky top-0 flex flex-col text-white" style={{ background: T.tealDeep }}>
      <div className="p-5 flex items-center gap-2 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: T.amber }}>
          <ArrowLeftRight size={16} color="white" />
        </div>
        <div>
          <div className="font-extrabold text-sm tracking-tight leading-none">DAWAI-SETU</div>
          <div className="text-[10px] text-white/45 mt-0.5">Simulated regional network</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {grouped.map((g, gi) => (
          <div key={gi}>
            {g.group && <div className="text-[10px] font-semibold text-white/35 px-2 mb-1">{g.group}</div>}
            <div className="space-y-0.5">
              {g.items.map((item) => {
                const isActive = active === item.key;
                return (
                  <button key={item.key} onClick={() => setActive(item.key)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition relative"
                    style={{ background: isActive ? "rgba(255,255,255,0.1)" : "transparent", color: isActive ? "white" : "rgba(255,255,255,0.62)" }}>
                    <item.icon size={15} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.key === "alerts" && alertCount > 0 && (
                      <span className="text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center" style={{ background: T.critical }}>{alertCount}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: T.amber }}>
            {user.managerName?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">{user.managerName}</div>
            <div className="text-[10px] text-white/45 truncate">{user.role}</div>
          </div>
          <button onClick={onLogout} title="Log out"><LogOut size={14} className="text-white/50 hover:text-white" /></button>
        </div>
      </div>
    </div>
  );
}

function TopBar({ facility, title }) {
  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b px-6 py-3.5 flex items-center justify-between" style={{ borderColor: T.line }}>
      <div>
        <h1 className="font-bold text-base" style={{ color: T.ink }}>{title}</h1>
        {facility && <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
          <FacilityTypeIcon type={facility.type} size={12} /> {facility.name} · {facility.town} · {facility.area}
        </p>}
      </div>
      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: T.amberSoft, color: T.amber }}>SIMULATED DEMO DATA</span>
    </div>
  );
}

/* ============================================================================
   MAIN
============================================================================ */
export default function App() {
  const [user, setUser] = useState(null);
  const [nav, setNav] = useState("dashboard");
  const [inventory, setInventory] = useState(INVENTORY_BASE);
  const [blood, setBlood] = useState(BLOOD_BASE);
  const [transfers, setTransfers] = useState(TRANSFERS_SEED);
  const [drawerRow, setDrawerRow] = useState(null);
  const [mapSelected, setMapSelected] = useState(null);
  const [redistroSearch, setRedistroSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [coordLog, setCoordLog] = useState([]);
  const [notifyTarget, setNotifyTarget] = useState(null);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 3200); }

  // Changing section should feel like a fresh page: scroll back to the top and drop any
  // open drawer or leftover search so nothing carries over from the previous view.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [nav, user]);

  function goNav(key) {
    setNav(key);
    setDrawerRow(null);
    setMapSelected(null);
    setRedistroSearch("");
  }

  // Requesting a medicine is the one case where the search term must survive the jump,
  // so it sets the search directly instead of going through goNav.
  function goRequestMedicine(name) {
    setDrawerRow(null);
    setRedistroSearch(name);
    setNav("redistribution");
  }

  function handleLogin(u) {
    setUser(u);
    setNav("dashboard");
    setDrawerRow(null);
    setMapSelected(null);
    setRedistroSearch("");
    setNotifyTarget(null);
    setToast(null);
  }

  function handleLogout() {
    setUser(null);
    setNav("dashboard");
    setDrawerRow(null);
    setMapSelected(null);
    setRedistroSearch("");
    setNotifyTarget(null);
    setToast(null);
  }

  function logCoordination(entry) {
    setCoordLog((prev) => [{ id: uid("ACT"), at: new Date(), ...entry }, ...prev]);
  }

  useEffect(() => {
    if (!user || !user.facility) return;
    const fac = user.facility;
    setTransfers((prev) => {
      if (prev.some((t) => t.demoSeedFor === fac.id)) return prev;
      const others = FACILITIES.filter((f) => f.id !== fac.id);
      const pickOther = (exclude) => {
        const pool = others.filter((f) => !exclude.includes(f.id));
        return pool[Math.floor(Math.random() * pool.length)];
      };
      const other1 = pickOther([]);
      const other2 = pickOther([other1.id]);
      const other3 = pickOther([other1.id, other2.id]);

      const myMedRows = INVENTORY_BASE.filter((r) => r.facilityId === fac.id);
      const pool = myMedRows.length ? myMedRows : INVENTORY_BASE;
      const medFor = () => pool[Math.floor(Math.random() * pool.length)];
      const reqMed = medFor(), delMed = medFor(), transitMed = medFor();

      const mk = (o) => ({ id: uid("TXN"), createdAt: new Date(), kind: "Redistribution", demoSeedFor: fac.id, ...o });
      const requested = mk({
        medicineName: reqMed.name, unit: reqMed.unit, qty: ri(20, 80),
        sourceId: fac.id, destId: other1.id, distanceKm: Math.round(dist(fac, other1) / 8),
        etaMins: ri(30, 90), status: "Requested",
      });
      const delivered = mk({
        medicineName: delMed.name, unit: delMed.unit, qty: ri(30, 120),
        sourceId: other2.id, destId: fac.id, distanceKm: Math.round(dist(fac, other2) / 8),
        etaMins: 0, status: "Delivered",
      });
      const inTransit = mk({
        medicineName: transitMed.name, unit: transitMed.unit, qty: ri(20, 90),
        sourceId: other3.id, destId: fac.id, distanceKm: Math.round(dist(fac, other3) / 8),
        etaMins: ri(15, 45), status: "In Transit",
      });
      return [requested, delivered, inTransit, ...prev];
    });
  }, [user]);

  if (!user) return <LoginFlow onDone={handleLogin} />;

  const isAdmin = user.role === "Regional Admin";
  const facility = user.facility;
  const myRows = facility ? inventory.filter((r) => r.facilityId === facility.id) : [];
  const rowsByMedIdx = (idx) => inventory.filter((r) => r.medicineIndex === idx);
  const myBlood = facility ? blood.filter((b) => b.facilityId === facility.id) : [];

  const enrichedMyRows = myRows.map((r) => ({ ...r, risk: computeRisk(r, rowsByMedIdx(r.medicineIndex)) }));
  const alertRows = isAdmin
    ? inventory.map((r) => ({ ...r, risk: computeRisk(r, rowsByMedIdx(r.medicineIndex)) })).filter((r) => r.risk.level === "critical" || r.risk.level === "high")
    : enrichedMyRows.filter((r) => r.risk.level === "critical" || r.risk.level === "high");

  const navItems = navFor(user.role, isAdmin);

  function createTransfer({ medicineName, unit, qty, sourceId, destId, kind }) {
    const src = facilityById[sourceId], dst = facilityById[destId];
    const d = Math.round(dist(src, dst) / 8);
    const t = {
      id: uid("TXN"), medicineName, unit, qty, sourceId, destId, distanceKm: d,
      etaMins: clamp(d * 3 + ri(15, 60), 20, 400), status: "Requested", createdAt: new Date(), kind,
    };
    setTransfers((prev) => [t, ...prev]);
    showToast(`${kind === "Offer" ? "Offer" : "Request"} sent for ${qty} ${unit} of ${medicineName}`);
  }

  function advanceTransfer(id) {
    const order = ["Requested", "Approved", "Pickup Scheduled", "Picked Up", "In Transit", "Delivered", "Received"];
    setTransfers((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const i = order.indexOf(t.status);
      const next = order[Math.min(i + 1, order.length - 1)];
      if (next === "Received" && i + 1 === order.length - 1) {
        setInventory((inv) => inv.map((row) => {
          if (row.facilityId === t.destId && row.name === t.medicineName) return { ...row, stock: row.stock + t.qty };
          if (row.facilityId === t.sourceId && row.name === t.medicineName) return { ...row, stock: Math.max(0, row.stock - t.qty) };
          return row;
        }));
        showToast(`${t.medicineName} received — inventory updated, risk recalculated`);
      }
      return { ...t, status: next };
    }));
  }
  function rejectTransfer(id) {
    setTransfers((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Rejected" } : t)));
  }

  // A medicine counts as "handled" for a facility once a live inbound transfer exists for it.
  // Urgent lists use this to drop what has already been requested and pull up the next item.
  function isHandled(medicineName, facilityId) {
    return transfers.some((t) => t.medicineName === medicineName && t.destId === facilityId && t.status !== "Rejected");
  }

  /* ---- Regional Admin coordination ---- */
  function approveBudget({ shortage, amount }) {
    const fac = facilityById[shortage.facilityId];
    logCoordination({ type: "Budget", medicineName: shortage.name, facilityId: fac.id, detail: `Emergency budget of ₹${amount.toLocaleString("en-IN")} approved for ${shortage.name} at ${fac.name}` });
    showToast(`Emergency budget approved — ₹${amount.toLocaleString("en-IN")} released to ${fac.name}`);
  }

  function orderFromSupplier({ shortage, dealer, qty }) {
    const fac = facilityById[shortage.facilityId];
    createTransfer({ medicineName: shortage.name, unit: shortage.unit, qty, sourceId: dealer.id, destId: fac.id, kind: "Supplier Order" });
    logCoordination({ type: "Supplier Order", medicineName: shortage.name, facilityId: fac.id, detail: `Order placed with ${dealer.name} for ${qty} ${shortage.unit} to ${fac.name}` });
  }

  function arrangeLogistics({ shortage, hub, qty, partner }) {
    const fac = facilityById[shortage.facilityId];
    createTransfer({ medicineName: shortage.name, unit: shortage.unit, qty, sourceId: hub.id, destId: fac.id, kind: "Logistics Transfer" });
    logCoordination({ type: "Logistics", medicineName: shortage.name, facilityId: fac.id, detail: `${partner} assigned to move ${qty} ${shortage.unit} from ${hub.name} to ${fac.name}` });
  }

  function sendFacilityMessage({ facilityId, medicineName, body }) {
    const fac = facilityById[facilityId];
    logCoordination({ type: "Message", medicineName, facilityId, detail: `Alert sent to ${fac.name}: ${body.slice(0, 80)}…` });
    showToast(`Message sent to ${fac.name}`);
    setNotifyTarget(null);
  }

  const views = {
    dashboard: isAdmin
      ? <AdminDashboardView inventory={inventory} blood={blood} transfers={transfers} setNav={goNav} onRequestMedicine={goRequestMedicine} isHandled={isHandled} />
      : <DashboardView facility={facility} rows={enrichedMyRows} blood={myBlood} transfers={transfers} setNav={goNav} onRequestMedicine={goRequestMedicine} isHandled={isHandled} />,
    inventory: <InventoryView rows={enrichedMyRows} onOpen={setDrawerRow} />,
    blood: <BloodBankView facility={facility} entries={myBlood} allBlood={blood} allTransfers={transfers} onRequest={createTransfer} />,
    redistribution: <RedistributionView facility={facility} isAdmin={isAdmin} inventory={inventory} blood={blood} transfers={transfers} search={redistroSearch} setSearch={setRedistroSearch} onAction={createTransfer} coordLog={coordLog} onApproveBudget={approveBudget} onOrderSupplier={orderFromSupplier} onArrangeLogistics={arrangeLogistics} onNotify={setNotifyTarget} />,
    shortage: <ShortageView inventory={inventory} />,
    map: <MapView facilities={FACILITIES} inventory={inventory} selected={mapSelected} setSelected={setMapSelected} />,
    network: <NetworkView facilities={FACILITIES} inventory={inventory} />,
    inbox: <InboxView facility={facility} transfers={transfers} onApprove={advanceTransfer} onReject={rejectTransfer} onReceive={advanceTransfer} />,
    transfers: <TransfersView facility={facility} isAdmin={isAdmin} transfers={transfers} onAdvance={advanceTransfer} onReject={rejectTransfer} />,
    alerts: <AlertsView rows={alertRows} onOpen={setDrawerRow} setNav={goNav} showFacility={isAdmin} isAdmin={isAdmin} onRequestMedicine={goRequestMedicine} onNotify={setNotifyTarget} isHandled={isHandled} facility={facility} />,
    history: <HistoryView facility={facility} transfers={transfers} />,
  };

  const titles = {
    dashboard: "Dashboard", inventory: "Medicine Inventory", blood: "Blood Bank", redistribution: user.role === "Lab/Blood Bank" ? "Regional Blood Network" : "Regional Redistribution",
    shortage: "Regional Shortage Intelligence", map: "Regional Map", network: "Facility Network", inbox: "Inbox", transfers: "Transfers & Delivery", alerts: "Alerts", history: "History & Audit Trail",
  };

  return (
    <div className="flex min-h-screen w-full" style={{ background: T.paper, fontFamily: "Manrope, sans-serif", color: T.ink }}>
      <style>{FONT_IMPORT}{`.font-mono{font-family:'IBM Plex Mono',monospace;}
        @keyframes toastIn{from{opacity:0;transform:translate(-50%,-14px);}to{opacity:1;transform:translate(-50%,0);}}
        .toast-in{animation:toastIn .22s ease-out;}`}</style>
      <Sidebar user={user} nav={navItems} active={nav} setActive={goNav} onLogout={handleLogout} alertCount={alertRows.length} />
      <div className="flex-1 min-w-0">
        <TopBar facility={facility} title={titles[nav]} />
        {/* Keyed on the section so each view remounts with clean internal state (filters,
            search boxes, selections) instead of inheriting the previous section's. */}
        <div key={`${user.facility?.id || user.role}-${nav}`} className="p-6 max-w-[1400px] mx-auto">{views[nav]}</div>
      </div>
      {drawerRow && <MedicineDrawer row={drawerRow} allRows={rowsByMedIdx(drawerRow.medicineIndex)} onClose={() => setDrawerRow(null)} />}
      {notifyTarget && (
        <NotifyModal target={notifyTarget} onClose={() => setNotifyTarget(null)} onSend={sendFacilityMessage} senderName={user.managerName} />
      )}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-xl z-[60] flex items-center gap-2 toast-in"
          style={{ background: T.teal }}>
          <CheckCircle2 size={15} />{toast}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   DASHBOARD
============================================================================ */
function AdminDashboardView({ inventory, blood, transfers, setNav, onRequestMedicine, isHandled }) {
  const enriched = inventory.map((r) => ({ ...r, risk: computeRisk(r, inventory.filter((s) => s.medicineIndex === r.medicineIndex)) }));
  const critical = enriched.filter((r) => r.risk.level === "critical").length;
  const high = enriched.filter((r) => r.risk.level === "high").length;
  const surplus = enriched.filter((r) => r.risk.daysOfStock > r.leadTimeDays * 2.2).length;
  const active = transfers.filter((t) => !["Received", "Rejected"].includes(t.status)).length;
  const byMed = {};
  inventory.forEach((r) => { byMed[r.medicineIndex] = byMed[r.medicineIndex] || []; byMed[r.medicineIndex].push(r); });
  const shortageClusters = Object.values(byMed).filter((rows) => {
    const risky = rows.map((r) => computeRisk(r, rows)).filter((x) => x.level === "critical" || x.level === "high");
    return risky.length >= 3;
  }).length;
  // Anything already under a live transfer drops out and the next highest-risk record takes its slot.
  const rankedAll = [...enriched].sort((a, b) => b.risk.score - a.risk.score);
  const openItems = rankedAll.filter((r) => !isHandled(r.name, r.facilityId));
  const worst = openItems.slice(0, 6);
  const handledCount = rankedAll.length - openItems.length;
  const bloodCritical = blood.filter((b) => computeBloodRisk(b).level === "critical").length;
  const ruralAdvance = enriched.filter((r) => r.risk.advanceAlert).length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-5 flex items-start gap-3" style={{ background: T.tealSoft }}>
        <Info size={18} style={{ color: T.teal }} className="mt-0.5 shrink-0" />
        <p className="text-sm" style={{ color: T.teal }}>
          <strong>{shortageClusters} emerging regional shortage{shortageClusters === 1 ? "" : "s"}</strong> detected across {FACILITIES.length} network facilities.
          {worst.length > 0 && <> Most urgent: <strong>{worst[0].name}</strong> at {facilityById[worst[0].facilityId].name} ({worst[0].risk.score}% risk).</>}
          {bloodCritical > 0 && <> {bloodCritical} blood group record{bloodCritical > 1 ? "s are" : " is"} critical.</>}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Network Facilities" value={FACILITIES.length} icon={Network} />
        <KpiCard label="Critical Items" value={critical} accent={T.critical} icon={AlertTriangle} />
        <KpiCard label="High Risk Items" value={high} accent={T.highrisk} icon={TrendingUp} />
        <KpiCard label="Surplus Items" value={surplus} accent={T.safe} icon={Package} />
        <KpiCard label="Active Transfers" value={active} icon={Truck} />
        <KpiCard label="Shortage Clusters" value={shortageClusters} accent={T.amber} icon={AlertTriangle} />
        <KpiCard label="Rural Advance Alerts" value={ruralAdvance} accent={T.amber} icon={Bike} sub={`Raised ~${RURAL_BUFFER_DAYS}d early`} />
      </div>

      <div className="rounded-xl border bg-white p-5" style={{ borderColor: T.line }}>
        <SectionHeader title="Most urgent across the network" sub="Ranked by AI stockout risk score, all facilities" right={<Btn size="sm" variant="outline" onClick={() => setNav("shortage")}>Shortage Intelligence<ChevronRight size={13} /></Btn>} />
        <div className="space-y-3">
          {worst.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: T.line }}>
              <div className="min-w-0">
                <div className="text-sm font-semibold flex items-center gap-2 flex-wrap">{r.name}<RuralAdvanceBadge risk={r.risk} /></div>
                <div className="text-xs text-stone-500">{facilityById[r.facilityId].name} · {r.risk.windowText}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusPill {...r.risk} />
                <Btn size="sm" variant="outline" icon={ArrowLeftRight} onClick={() => onRequestMedicine(r.name)}>Request</Btn>
              </div>
            </div>
          ))}
          {worst.length === 0 && <p className="text-sm text-stone-400">Nothing left to action — every urgent record has a transfer in progress.</p>}
        </div>
        {handledCount > 0 && (
          <p className="text-xs mt-3 flex items-center gap-1.5" style={{ color: T.safe }}>
            <CheckCircle2 size={12} />{handledCount} record{handledCount === 1 ? "" : "s"} already under an active transfer and cleared from this list
          </p>
        )}
      </div>
      <Btn variant="amber" size="sm" onClick={() => setNav("redistribution")} icon={Repeat}>Coordinate help &amp; review redistributions</Btn>
    </div>
  );
}

function DashboardView({ facility, rows, blood, transfers, setNav, onRequestMedicine, isHandled }) {
  const critical = rows.filter((r) => r.risk.level === "critical").length;
  const atrisk = rows.filter((r) => r.risk.level === "high" || r.risk.level === "atrisk").length;
  const surplus = rows.filter((r) => r.risk.daysOfStock > r.leadTimeDays * 2.2).length;
  const expiring = rows.filter((r) => daysUntil(r.expiry) < 45).length;
  const active = transfers.filter((t) => facility && (t.sourceId === facility.id || t.destId === facility.id) && !["Received", "Rejected"].includes(t.status));
  const incoming = active.filter((t) => t.destId === facility.id).length;
  const outgoing = active.filter((t) => t.sourceId === facility.id).length;

  // Once a medicine has been requested it drops off this list and the next highest-risk
  // item moves up into its place, so the card always shows three things still to act on.
  const ranked = [...rows].sort((a, b) => b.risk.score - a.risk.score);
  const worst = ranked.filter((r) => !isHandled(r.name, facility.id)).slice(0, 3);
  const handledCount = ranked.length - ranked.filter((r) => !isHandled(r.name, facility.id)).length;
  const bloodCritical = blood.filter((b) => computeBloodRisk(b).level === "critical").length;
  const ruralAdvance = rows.filter((r) => r.risk.advanceAlert).length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-5 flex items-start gap-3" style={{ background: T.tealSoft }}>
        <Info size={18} style={{ color: T.teal }} className="mt-0.5 shrink-0" />
        <p className="text-sm" style={{ color: T.teal }}>
          <strong>{critical + atrisk} medicine{critical + atrisk === 1 ? "" : "s"}</strong> at your facility need attention{worst.length > 0 && <> — most urgent is <strong>{worst[0].name}</strong> ({worst[0].risk.score}% stockout risk)</>}.
          {" "}Regional Redistribution shows nearby facilities with surplus that could help cover projected shortages.
          {bloodCritical > 0 && <> {bloodCritical} blood group{bloodCritical > 1 ? "s are" : " is"} also critical.</>}
        </p>
      </div>

      {facility?.area === "Rural" && (
        <div className="rounded-xl p-5 flex items-start gap-3" style={{ background: T.amberSoft }}>
          <Bike size={18} style={{ color: T.amber }} className="mt-0.5 shrink-0" />
          <p className="text-sm" style={{ color: T.amber }}>
            <strong>Rural advance alerting is on.</strong> Deliveries here need roughly {RURAL_BUFFER_DAYS} extra days of last-mile
            transport on top of the supplier's own lead time, so a medicine with 6 days of stock and a 4-day restock is already
            flagged — you are warned while there is still time to order.
            {ruralAdvance > 0 && <> <strong>{ruralAdvance} item{ruralAdvance === 1 ? " is" : "s are"}</strong> currently inside that early-warning window.</>}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total Medicines" value={rows.length} icon={Pill} />
        <KpiCard label="Critical" value={critical} accent={T.critical} icon={AlertTriangle} sub="Need immediate action" />
        <KpiCard label="At Risk" value={atrisk} accent={T.highrisk} icon={TrendingUp} />
        <KpiCard label="Surplus" value={surplus} accent={T.safe} icon={Package} sub="Could help others" />
        <KpiCard label="Expiring Soon" value={expiring} accent={T.amber} icon={Clock} sub="Within 45 days" />
        <KpiCard label="Active Transfers" value={active.length} icon={Truck} />
        <KpiCard label="Incoming Requests" value={incoming} icon={ArrowLeftRight} />
        <KpiCard label="Outgoing Offers" value={outgoing} icon={Send} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-5" style={{ borderColor: T.line }}>
          <SectionHeader title="Most urgent medicines" sub="Ranked by AI stockout risk score" right={<Btn size="sm" variant="outline" onClick={() => setNav("inventory")}>View all<ChevronRight size={13} /></Btn>} />
          <div className="space-y-3">
            {worst.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: T.line }}>
                <div className="min-w-0">
                  <div className="text-sm font-semibold flex items-center gap-2 flex-wrap">{r.name}<RuralAdvanceBadge risk={r.risk} /></div>
                  <div className="text-xs text-stone-500">{r.risk.windowText} · {r.risk.daysOfStock.toFixed(1)}d stock left</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusPill {...r.risk} />
                  <Btn size="sm" variant="outline" icon={ArrowLeftRight} onClick={() => onRequestMedicine(r.name)}>Request</Btn>
                </div>
              </div>
            ))}
            {worst.length === 0 && <p className="text-sm text-stone-400">Nothing left to action — every urgent medicine has a request in progress.</p>}
          </div>
          {handledCount > 0 && (
            <p className="text-xs mt-3 flex items-center gap-1.5" style={{ color: T.safe }}>
              <CheckCircle2 size={12} />{handledCount} medicine{handledCount === 1 ? "" : "s"} already requested and cleared from this list
            </p>
          )}
        </div>
        <div className="rounded-xl border bg-white p-5" style={{ borderColor: T.line }}>
          <SectionHeader title="Regional shortage alerts" sub="Emerging multi-facility patterns" right={<Btn size="sm" variant="outline" onClick={() => setNav("shortage")}>Details<ChevronRight size={13} /></Btn>} />
          <p className="text-sm text-stone-500">Open Regional Shortage Intelligence to see facility-level risk that may be developing into a regional shortage, and what happens with vs. without intervention.</p>
          <Btn variant="amber" size="sm" onClick={() => setNav("redistribution")} icon={Repeat}>Go to Regional Redistribution</Btn>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   INVENTORY
============================================================================ */
function InventoryView({ rows, onOpen }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = rows.filter((r) => (filter === "all" || r.risk.level === filter) && r.name.toLowerCase().includes(q.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => b.risk.score - a.risk.score);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search medicines…"
            className="w-full pl-8 pr-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: T.line }} />
        </div>
        {["all", "critical", "high", "atrisk", "safe"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize"
            style={{ background: filter === f ? T.teal : "white", color: filter === f ? "white" : T.ink, border: `1px solid ${filter === f ? T.teal : T.line}` }}>
            {f === "atrisk" ? "At Risk" : f}
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: T.line }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-stone-400 border-b" style={{ borderColor: T.line }}>
              <th className="px-4 py-3 font-semibold">Medicine</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Days Left</th>
              <th className="px-4 py-3 font-semibold">Trend</th>
              <th className="px-4 py-3 font-semibold">Lead Time</th>
              <th className="px-4 py-3 font-semibold">Expiry</th>
              <th className="px-4 py-3 font-semibold">Risk</th>
              <th className="px-4 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-b last:border-0 hover:bg-stone-50 cursor-pointer" style={{ borderColor: T.line }} onClick={() => onOpen(r)}>
                <td className="px-4 py-3">
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-xs text-stone-400">{r.category} · {r.criticality}</div>
                </td>
                <td className="px-4 py-3 font-mono">{r.stock} {r.unit}</td>
                <td className="px-4 py-3 font-mono">{r.risk.daysOfStock.toFixed(1)}d</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 font-mono" style={{ color: r.trendPct >= 0 ? T.critical : T.safe }}>
                    {r.trendPct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{Math.abs(r.trendPct)}%
                  </span>
                </td>
                <td className="px-4 py-3 font-mono">{r.leadTimeDays}d</td>
                <td className="px-4 py-3 text-xs text-stone-500">{fmtDate(r.expiry)}</td>
                <td className="px-4 py-3"><StatusPill {...r.risk} /></td>
                <td className="px-4 py-3"><ChevronRight size={14} className="text-stone-300" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && <p className="text-center text-sm text-stone-400 py-10">No medicines match this filter.</p>}
      </div>
    </div>
  );
}

function MedicineDrawer({ row, allRows, onClose }) {
  const risk = computeRisk(row, allRows);
  const others = allRows.filter((r) => r.id !== row.id && r.facilityId !== row.facilityId)
    .map((r) => ({ ...r, facility: facilityById[r.facilityId], risk: computeRisk(r, allRows) }))
    .sort((a, b) => a.risk.score - b.risk.score)
    .slice(0, 4);
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl p-6" style={{ fontFamily: "Manrope, sans-serif" }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg" style={{ color: T.ink }}>{row.name}</h3>
            <p className="text-xs text-stone-500">{row.category} · {row.criticality} · {facilityById[row.facilityId]?.name}</p>
          </div>
          <button onClick={onClose}><X size={18} className="text-stone-400" /></button>
        </div>

        <div className="rounded-xl p-4 mb-4" style={{ background: risk.soft }}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-sm" style={{ color: risk.color }}>{risk.label}</span>
            <span className="font-mono font-bold text-lg" style={{ color: risk.color }}>{risk.score}%</span>
          </div>
          <p className="text-xs mb-2" style={{ color: risk.color }}>{risk.windowText}</p>
          <ul className="space-y-1.5 mt-3">
            {risk.reasons.map((r, i) => (
              <li key={i} className="text-xs flex gap-1.5" style={{ color: T.ink }}><span>•</span>{r}</li>
            ))}
          </ul>
          <p className="text-[11px] mt-3 italic text-stone-500">{risk.confidenceNote}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border p-3" style={{ borderColor: T.line }}><div className="text-[10px] text-stone-400 uppercase font-semibold">Current stock</div><div className="font-mono font-bold">{row.stock} {row.unit}</div></div>
          <div className="rounded-lg border p-3" style={{ borderColor: T.line }}><div className="text-[10px] text-stone-400 uppercase font-semibold">Avg daily use</div><div className="font-mono font-bold">{row.avgDailyConsumption.toFixed(1)} {row.unit}/day</div></div>
          <div className="rounded-lg border p-3" style={{ borderColor: T.line }}><div className="text-[10px] text-stone-400 uppercase font-semibold">Incoming</div><div className="font-mono font-bold">{row.incoming || "None"}</div></div>
          <div className="rounded-lg border p-3" style={{ borderColor: T.line }}><div className="text-[10px] text-stone-400 uppercase font-semibold">Supplier</div><div className="font-semibold text-xs">{row.supplier}</div></div>
        </div>

        <h4 className="text-xs font-bold uppercase tracking-wide text-stone-400 mb-2">Recommended action</h4>
        <p className="text-sm rounded-lg border p-3 mb-5" style={{ borderColor: T.line }}>
          {risk.level === "critical" ? "Request emergency redistribution or expedited replenishment now." :
           risk.level === "high" ? "Initiate a redistribution request from nearby surplus facilities." :
           risk.level === "atrisk" ? "Monitor closely and confirm the next replenishment shipment." :
           "No action needed — stock levels are healthy."}
        </p>

        {others.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-stone-400 mb-2">Nearby facilities for this medicine</h4>
            <div className="space-y-2">
              {others.map((o) => (
                <div key={o.id} className="flex items-center justify-between border rounded-lg p-2.5" style={{ borderColor: T.line }}>
                  <div>
                    <div className="text-xs font-semibold">{o.facility?.name}</div>
                    <div className="text-[11px] text-stone-400">{o.stock} {o.unit} · {o.risk.daysOfStock.toFixed(1)}d</div>
                  </div>
                  <StatusPill {...o.risk} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   BLOOD BANK
============================================================================ */
function BloodBankView({ facility, entries, allBlood, allTransfers, onRequest }) {
  if (!facility.isBloodBank) {
    return <p className="text-sm text-stone-500">This facility does not currently operate a blood bank.</p>;
  }
  return (
    <div className="space-y-6">
      <BloodShortageSection allBlood={allBlood} />
      <SectionHeader title="Your blood inventory" sub="Live stock by group, with nearby-bank recommendations for anything at risk" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {entries.map((e) => {
          const risk = computeBloodRisk(e);
          const nearby = allBlood.filter((b) => b.facilityId !== facility.id && b.bloodGroup === e.bloodGroup && computeBloodRisk(b).level === "safe" && b.units > 15)
            .map((b) => ({ ...b, facility: facilityById[b.facilityId] }))
            .sort((a, b) => dist(facility, a.facility) - dist(facility, b.facility))[0];
          return (
            <div key={e.id} className="rounded-xl border bg-white p-4" style={{ borderColor: T.line }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-extrabold text-xl" style={{ color: T.teal }}>{e.bloodGroup}</span>
                <StatusPill {...risk} label={risk.level === "critical" ? "Critical" : risk.level === "high" ? "High Risk" : risk.level === "atrisk" ? "At Risk" : "Safe"} />
              </div>
              <div className="text-sm font-mono font-bold">{e.units} units</div>
              <div className="text-xs text-stone-500">Demand {e.demandPerDay.toFixed(1)}/day · {risk.daysOfStock.toFixed(1)}d left</div>
              <div className="text-xs text-stone-400 mt-1">Expiry {fmtDate(e.expiry)} · {e.incoming ? `${e.incoming} incoming` : "none incoming"}</div>
              {(risk.level === "critical" || risk.level === "high") && nearby && (
                <Btn size="sm" variant="amber" onClick={() => onRequest({ medicineName: `${e.bloodGroup} Blood`, unit: "units", qty: Math.min(20, nearby.units - 10), sourceId: nearby.facilityId, destId: facility.id, kind: "Request" })} icon={ArrowLeftRight}>
                  Request from {nearby.facility.name.split(" ")[0]}
                </Btn>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   REGIONAL REDISTRIBUTION
============================================================================ */
/* ============================================================================
   REGIONAL ADMIN COORDINATION
============================================================================ */
const LOGISTICS_COMPANIES = [
  "Coastal Cold Chain Logistics", "Tulunadu Medi-Freight", "Karnataka Health Logistics", "SwiftMed Distribution Services",
];
const UNIT_COST = { "Life-saving": 420, Essential: 85, Routine: 25 };

// Defined outside CoordinationModal on purpose: declaring it inline would create a new
// component type on every render, remounting the inputs and losing focus mid-typing.
function CoordStep({ isDone, n, title, blurb, children }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: isDone ? T.safe : T.line, background: isDone ? T.safeSoft : "white" }}>
      <div className="flex items-start gap-2.5">
        <span className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: isDone ? T.safe : T.tealSoft, color: isDone ? "white" : T.teal }}>
          {isDone ? <CheckCircle2 size={13} /> : n}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-sm" style={{ color: T.ink }}>{title}</h4>
          <p className="text-xs text-stone-500 mt-0.5">{blurb}</p>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CoordinationModal({ shortage, inventory, onApproveBudget, onOrderSupplier, onArrangeLogistics, onClose }) {
  const needFacility = facilityById[shortage.facilityId];
  const risk = shortage.risk;
  const qtyNeeded = Math.max(20, Math.ceil(shortage.avgDailyConsumption * ((risk.effectiveLeadTime || shortage.leadTimeDays) + 7)));
  const unitCost = UNIT_COST[shortage.criticality] || 60;
  const suggestedBudget = qtyNeeded * unitCost;

  const dealers = useMemo(() => FACILITIES.filter((f) => f.type === "Medicine Dealer").map((d) => {
    const row = inventory.find((r) => r.facilityId === d.id && r.medicineIndex === shortage.medicineIndex);
    return { ...d, stock: row ? row.stock : 0, km: Math.round(dist(d, needFacility) / 8) };
  }).sort((a, b) => (b.stock > 0) - (a.stock > 0) || a.km - b.km), [inventory, shortage.medicineIndex, needFacility]);

  const hubs = useMemo(() => inventory.filter((r) => r.medicineIndex === shortage.medicineIndex && r.facilityId !== needFacility.id)
    .map((r) => ({ ...r, fac: facilityById[r.facilityId], km: Math.round(dist(facilityById[r.facilityId], needFacility) / 8) }))
    .sort((a, b) => b.stock - a.stock).slice(0, 6), [inventory, shortage.medicineIndex, needFacility]);

  const [budget, setBudget] = useState(suggestedBudget);
  const [dealerId, setDealerId] = useState(dealers[0]?.id || "");
  const [orderQty, setOrderQty] = useState(qtyNeeded);
  const [hubRowId, setHubRowId] = useState(hubs[0]?.id || "");
  const [moveQty, setMoveQty] = useState(Math.round(qtyNeeded * 0.6));
  const [partner, setPartner] = useState(LOGISTICS_COMPANIES[0]);
  const [done, setDone] = useState({});

  const mark = (k) => setDone((d) => ({ ...d, [k]: true }));
  const chosenDealer = dealers.find((d) => d.id === dealerId);
  const chosenHub = hubs.find((h) => h.id === hubRowId);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="w-full max-w-3xl my-8 rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b flex items-start justify-between gap-3" style={{ borderColor: T.line }}>
          <div className="min-w-0">
            <h3 className="font-bold flex items-center gap-2" style={{ color: T.ink }}><ShieldCheck size={16} />Coordinate help — {shortage.name}</h3>
            <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
              {needFacility.name} · {needFacility.town} · {needFacility.area} · {risk.daysOfStock.toFixed(1)}d left
              <StatusPill {...risk} /><RuralAdvanceBadge risk={risk} />
            </p>
          </div>
          <button onClick={onClose}><X size={18} className="text-stone-400" /></button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-xs text-stone-500">
            Estimated shortfall: <strong className="font-mono">{qtyNeeded} {shortage.unit}</strong> to cover the
            {" "}{risk.effectiveLeadTime || shortage.leadTimeDays}-day resupply window plus a week of buffer. Actions below are independent — use any combination.
          </p>

          <CoordStep isDone={done.budget} n="1" title="Approve emergency budget"
            blurb="Release funds so the facility can procure immediately without waiting for the normal purchase cycle.">
            <div className="flex flex-wrap items-end gap-2">
              <div>
                <label className="text-[11px] font-semibold text-stone-500">Amount (₹)</label>
                <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))}
                  className="block mt-1 w-40 rounded-lg border px-3 py-1.5 text-sm font-mono outline-none" style={{ borderColor: T.line }} />
              </div>
              <span className="text-[11px] text-stone-400 pb-2">≈ {qtyNeeded} {shortage.unit} × ₹{unitCost} ({shortage.criticality})</span>
              {!done.budget && (
                <Btn size="sm" variant="primary" icon={ThumbsUp}
                  onClick={() => { onApproveBudget({ shortage, amount: budget }); mark("budget"); }}>Approve allocation</Btn>
              )}
            </div>
          </CoordStep>

          <CoordStep isDone={done.order} n="2" title="Place order with a regional supplier"
            blurb="Raise a purchase order directly with a medicine dealer in the network and have it shipped to the facility.">
            <div className="flex flex-wrap items-end gap-2">
              <div className="min-w-[230px]">
                <label className="text-[11px] font-semibold text-stone-500">Medicine dealer</label>
                <select value={dealerId} onChange={(e) => setDealerId(e.target.value)}
                  className="block mt-1 w-full rounded-lg border px-3 py-1.5 text-sm outline-none bg-white" style={{ borderColor: T.line }}>
                  {dealers.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.km} km{d.stock > 0 ? ` · ${d.stock} in stock` : " · to be sourced"}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-500">Qty ({shortage.unit})</label>
                <input type="number" value={orderQty} onChange={(e) => setOrderQty(Number(e.target.value))}
                  className="block mt-1 w-28 rounded-lg border px-3 py-1.5 text-sm font-mono outline-none" style={{ borderColor: T.line }} />
              </div>
              {!done.order && chosenDealer && (
                <Btn size="sm" variant="amber" icon={Package}
                  onClick={() => { onOrderSupplier({ shortage, dealer: chosenDealer, qty: orderQty }); mark("order"); }}>Place order</Btn>
              )}
            </div>
          </CoordStep>

          <CoordStep isDone={done.logistics} n="3" title="Arrange a logistics transfer from a hub"
            blurb="Fastest option when stock already exists nearby — assign a logistics company to move it from a larger hub to this site.">
            <div className="flex flex-wrap items-end gap-2">
              <div className="min-w-[230px]">
                <label className="text-[11px] font-semibold text-stone-500">Source hub</label>
                <select value={hubRowId} onChange={(e) => setHubRowId(e.target.value)}
                  className="block mt-1 w-full rounded-lg border px-3 py-1.5 text-sm outline-none bg-white" style={{ borderColor: T.line }}>
                  {hubs.map((h) => <option key={h.id} value={h.id}>{h.fac.name} — {h.stock} {h.unit} · {h.km} km</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-500">Qty</label>
                <input type="number" value={moveQty} onChange={(e) => setMoveQty(Number(e.target.value))}
                  className="block mt-1 w-24 rounded-lg border px-3 py-1.5 text-sm font-mono outline-none" style={{ borderColor: T.line }} />
              </div>
              <div className="min-w-[200px]">
                <label className="text-[11px] font-semibold text-stone-500">Logistics partner</label>
                <select value={partner} onChange={(e) => setPartner(e.target.value)}
                  className="block mt-1 w-full rounded-lg border px-3 py-1.5 text-sm outline-none bg-white" style={{ borderColor: T.line }}>
                  {LOGISTICS_COMPANIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              {!done.logistics && chosenHub && (
                <Btn size="sm" variant="primary" icon={Truck}
                  onClick={() => { onArrangeLogistics({ shortage, hub: chosenHub.fac, qty: moveQty, partner }); mark("logistics"); }}>Dispatch</Btn>
              )}
            </div>
            {hubs.length === 0 && <p className="text-xs text-stone-400">No other facility in the network is holding this medicine.</p>}
          </CoordStep>
        </div>

        <div className="px-5 py-3 border-t flex justify-end" style={{ borderColor: T.line }}>
          <Btn size="sm" variant="outline" onClick={onClose}>Done</Btn>
        </div>
      </div>
    </div>
  );
}

function RedistributionView({ facility, isAdmin, inventory, blood, transfers, search, setSearch, onAction, coordLog = [], onApproveBudget, onOrderSupplier, onArrangeLogistics, onNotify }) {
  const [coordTarget, setCoordTarget] = useState(null);
  const myRows = facility ? inventory.filter((r) => r.facilityId === facility.id) : [];

  function surplusScore(row, siblings) {
    const risk = computeRisk(row, siblings);
    return risk.daysOfStock - row.leadTimeDays * 1.4; // positive = safely surplus
  }
  function bloodSurplusScore(entry) {
    return computeBloodRisk(entry).daysOfStock - 3;
  }
  function isPending(medicineName, sourceId, destId) {
    return transfers.some((t) => t.medicineName === medicineName && t.sourceId === sourceId && t.destId === destId && t.status !== "Rejected");
  }
  function ActionOrDone({ pending, doneLabel, children }) {
    if (!pending) return children;
    return <span className="text-xs font-semibold flex items-center gap-1 shrink-0" style={{ color: T.safe }}><CheckCircle2 size={13} />{doneLabel}</span>;
  }

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    const matchedBloodGroup = BLOOD_GROUPS.find((bg) => bg.toLowerCase() === q);
    const matches = inventory.filter((r) => r.name.toLowerCase().includes(q));
    const grouped = {};
    matches.forEach((r) => { grouped[r.name] = grouped[r.name] || []; grouped[r.name].push(r); });
    const refPoint = facility || { x: 400, y: 300 };

    let bloodBlock = null;
    if (matchedBloodGroup) {
      const bloodRows = blood.filter((b) => b.bloodGroup === matchedBloodGroup);
      const rankedBlood = bloodRows.map((b) => {
        const risk = computeBloodRisk(b);
        const fac = facilityById[b.facilityId];
        const d = Math.round(dist(refPoint, fac) / 8);
        const surplus = bloodSurplusScore(b);
        const rankScore = (facility && fac.id === facility.id ? -9999 : 0) + risk.score * 0.4 + Math.max(0, surplus) * 3 - d * 0.6;
        return { ...b, fac, risk, d, surplus, rankScore };
      }).sort((a, b) => b.rankScore - a.rankScore);
      bloodBlock = (
        <div className="rounded-xl border bg-white p-5" style={{ borderColor: T.line }}>
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: T.ink }}><Droplet size={15} style={{ color: T.critical }} />{matchedBloodGroup} Blood</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead><tr className="text-left text-[11px] uppercase text-stone-400 border-b" style={{ borderColor: T.line }}>
                <th className="py-2 pr-3">Blood Bank</th><th className="py-2 pr-3">Distance</th><th className="py-2 pr-3">Units</th>
                <th className="py-2 pr-3">Days Left</th><th className="py-2 pr-3">Risk</th><th className="py-2 pr-3">Expiry</th><th className="py-2 pr-3">ETA</th><th className="py-2 pr-3"></th>
              </tr></thead>
              <tbody>
                {rankedBlood.map((b) => {
                  const isMine = facility && b.facilityId === facility.id;
                  const canRequest = facility && !isMine && b.surplus > 3;
                  const pending = facility && isPending(`${matchedBloodGroup} Blood`, b.facilityId, facility.id);
                  return (
                    <tr key={b.id} className="border-b last:border-0" style={{ borderColor: T.line, background: isMine ? T.tealSoft : "transparent" }}>
                      <td className="py-2.5 pr-3">
                        <div className="font-semibold flex items-center gap-1"><FacilityTypeIcon type={b.fac.type} size={12} />{b.fac.name}{isMine && " (You)"}</div>
                        <div className="text-xs text-stone-400">{b.fac.town} · {b.fac.area}</div>
                      </td>
                      <td className="py-2.5 pr-3 font-mono">{b.d} km</td>
                      <td className="py-2.5 pr-3 font-mono">{b.units} units</td>
                      <td className="py-2.5 pr-3 font-mono">{b.risk.daysOfStock.toFixed(1)}d</td>
                      <td className="py-2.5 pr-3"><StatusPill {...b.risk} label={b.risk.level === "critical" ? "Critical" : b.risk.level === "high" ? "High Risk" : b.risk.level === "atrisk" ? "At Risk" : "Safe"} /></td>
                      <td className="py-2.5 pr-3 text-xs">{fmtDate(b.expiry)}</td>
                      <td className="py-2.5 pr-3 text-xs">{clamp(Math.round(b.d * 3 + 20), 20, 300)} min</td>
                      <td className="py-2.5 pr-3">
                        {canRequest && (
                          <ActionOrDone pending={pending} doneLabel="Requested">
                            <Btn size="sm" variant="outline" icon={ArrowLeftRight} onClick={() => onAction({ medicineName: `${matchedBloodGroup} Blood`, unit: "units", qty: Math.round(Math.min(b.surplus * 3, b.units * 0.3)) || 10, sourceId: b.facilityId, destId: facility.id, kind: "Request" })}>Request Units</Btn>
                          </ActionOrDone>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <SearchBar search={search} setSearch={setSearch} />
        {bloodBlock}
        {Object.entries(grouped).map(([name, rows]) => {
          const siblings = rows;
          const ranked = rows.map((r) => {
            const risk = computeRisk(r, siblings);
            const fac = facilityById[r.facilityId];
            const d = Math.round(dist(refPoint, fac) / 8);
            const surplus = surplusScore(r, siblings);
            const urgency = risk.score;
            const rankScore = (facility && fac.id === facility.id ? -9999 : 0) + urgency * 0.4 + Math.max(0, surplus) * 3 - d * 0.6 - (daysUntil(r.expiry) < 60 ? 10 : 0);
            return { ...r, fac, risk, d, surplus, rankScore };
          }).sort((a, b) => b.rankScore - a.rankScore);
          return (
            <div key={name} className="rounded-xl border bg-white p-5" style={{ borderColor: T.line }}>
              <h3 className="font-bold mb-3" style={{ color: T.ink }}>{name}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[760px]">
                  <thead><tr className="text-left text-[11px] uppercase text-stone-400 border-b" style={{ borderColor: T.line }}>
                    <th className="py-2 pr-3">Facility</th><th className="py-2 pr-3">Distance</th><th className="py-2 pr-3">Stock</th>
                    <th className="py-2 pr-3">Days Left</th><th className="py-2 pr-3">Risk</th><th className="py-2 pr-3">Expiry</th><th className="py-2 pr-3">ETA</th><th className="py-2 pr-3"></th>
                  </tr></thead>
                  <tbody>
                    {ranked.map((r) => {
                      const isMine = facility && r.facilityId === facility.id;
                      const canRequest = facility && !isMine && r.surplus > 5;
                      const pending = facility && isPending(name, r.facilityId, facility.id);
                      return (
                        <tr key={r.id} className="border-b last:border-0" style={{ borderColor: T.line, background: isMine ? T.tealSoft : "transparent" }}>
                          <td className="py-2.5 pr-3">
                            <div className="font-semibold flex items-center gap-1"><FacilityTypeIcon type={r.fac.type} size={12} />{r.fac.name}{isMine && " (You)"}</div>
                            <div className="text-xs text-stone-400">{r.fac.town} · {r.fac.area}</div>
                          </td>
                          <td className="py-2.5 pr-3 font-mono">{r.d} km</td>
                          <td className="py-2.5 pr-3 font-mono">{r.stock} {r.unit}</td>
                          <td className="py-2.5 pr-3 font-mono">{r.risk.daysOfStock.toFixed(1)}d</td>
                          <td className="py-2.5 pr-3"><StatusPill {...r.risk} /></td>
                          <td className="py-2.5 pr-3 text-xs">{fmtDate(r.expiry)}</td>
                          <td className="py-2.5 pr-3 text-xs">{clamp(Math.round(r.d * 3 + 20), 20, 300)} min</td>
                          <td className="py-2.5 pr-3">
                            {canRequest && (
                              <ActionOrDone pending={pending} doneLabel="Requested">
                                <Btn size="sm" variant="outline" onClick={() => onAction({ medicineName: name, unit: r.unit, qty: Math.round(Math.min(r.surplus * r.avgDailyConsumption * 0.4, r.stock * 0.3)) || 20, sourceId: r.facilityId, destId: facility.id, kind: "Request" })} icon={ArrowLeftRight}>Request Units</Btn>
                              </ActionOrDone>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
        {Object.keys(grouped).length === 0 && !bloodBlock && <p className="text-sm text-stone-400">No medicine or blood group matches "{search}".</p>}
      </div>
    );
  }

  // No search, admin: network-wide shortage → surplus matching
  if (!facility) {
    const byMed = {};
    inventory.forEach((r) => { byMed[r.medicineIndex] = byMed[r.medicineIndex] || []; byMed[r.medicineIndex].push(r); });
    const matches = [];
    Object.values(byMed).forEach((rows) => {
      const withRisk = rows.map((r) => ({ ...r, risk: computeRisk(r, rows), surplus: surplusScore(r, rows) }));
      const shortages = withRisk.filter((r) => r.risk.level === "critical" || r.risk.level === "high").sort((a, b) => b.risk.score - a.risk.score);
      const surpluses = withRisk.filter((r) => r.surplus > 4);
      shortages.forEach((s) => {
        const best = surpluses.filter((su) => su.facilityId !== s.facilityId)
          .sort((a, b) => dist(facilityById[s.facilityId], facilityById[a.facilityId]) - dist(facilityById[s.facilityId], facilityById[b.facilityId]))[0];
        if (best) matches.push({ shortage: s, surplus: best });
      });
    });
    const top = matches.sort((a, b) => b.shortage.risk.score - a.shortage.risk.score).slice(0, 10);
    return (
      <div className="space-y-5">
        <SearchBar search={search} setSearch={setSearch} />

        <div className="rounded-xl p-5 flex items-start gap-3" style={{ background: T.tealSoft }}>
          <ShieldCheck size={18} style={{ color: T.teal }} className="mt-0.5 shrink-0" />
          <p className="text-sm" style={{ color: T.teal }}>
            You see risk across the whole network before any single facility does. For each shortage below you can
            <strong> message the facility</strong>, <strong>approve an emergency budget</strong>, <strong>place an order with a regional
            medicine dealer</strong>, or <strong>arrange a logistics company</strong> to move stock from a larger hub to the site that needs it.
          </p>
        </div>

        <SectionHeader title="Recommended redistributions" sub="Every at-risk medicine matched to the nearest facility with confirmed surplus" />
        <div className="space-y-3">
          {top.map(({ shortage: s, surplus: su }, i) => {
            const dFac = facilityById[s.facilityId], sFac = facilityById[su.facilityId];
            const d = Math.round(dist(dFac, sFac) / 8);
            const pending = isPending(s.name, su.facilityId, s.facilityId);
            return (
              <div key={i} className="rounded-xl border bg-white p-4 flex items-start justify-between gap-3 flex-wrap" style={{ borderColor: T.line }}>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-semibold flex items-center gap-2 flex-wrap ${pending ? "line-through text-stone-400" : ""}`}>
                    {s.name}<RuralAdvanceBadge risk={s.risk} />
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-1 flex-wrap">{dFac.name} is at risk <StatusPill {...s.risk} /></div>
                  <div className="text-xs text-stone-400 mt-1">{sFac.name} has surplus · {d} km away</div>
                </div>
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <Btn size="sm" variant="outline" icon={Send} onClick={() => onNotify && onNotify({ row: s, facility: dFac })}>Message</Btn>
                  <Btn size="sm" variant="outline" icon={ShieldCheck} onClick={() => setCoordTarget(s)}>Coordinate</Btn>
                  <ActionOrDone pending={pending} doneLabel="Initiated">
                    <Btn size="sm" variant="amber" icon={Repeat} onClick={() => onAction({ medicineName: s.name, unit: s.unit, qty: Math.round(Math.min(su.surplus * su.avgDailyConsumption * 0.4, su.stock * 0.3)) || 40, sourceId: su.facilityId, destId: s.facilityId, kind: "Admin-Initiated" })}>
                      Redistribute
                    </Btn>
                  </ActionOrDone>
                </div>
              </div>
            );
          })}
          {top.length === 0 && <p className="text-sm text-stone-400">No unresolved shortages detected across the network right now.</p>}
        </div>

        {coordLog.length > 0 && (
          <div>
            <SectionHeader title="Coordination log" sub="Budget approvals, supplier orders, logistics dispatches and alerts you have issued" />
            <div className="rounded-xl border bg-white divide-y" style={{ borderColor: T.line }}>
              {coordLog.slice(0, 12).map((a) => {
                const tone = a.type === "Budget" ? T.teal : a.type === "Supplier Order" ? T.amber : a.type === "Logistics" ? T.safe : T.critical;
                const Icon = a.type === "Budget" ? ThumbsUp : a.type === "Supplier Order" ? Package : a.type === "Logistics" ? Truck : Send;
                return (
                  <div key={a.id} className="p-3.5 flex items-start gap-3">
                    <Icon size={15} style={{ color: tone }} className="mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm">{a.detail}</div>
                      <div className="text-[11px] text-stone-400 mt-0.5">{a.type} · {fmtDateTime(a.at)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {coordTarget && (
          <CoordinationModal shortage={coordTarget} inventory={inventory}
            onApproveBudget={onApproveBudget} onOrderSupplier={onOrderSupplier} onArrangeLogistics={onArrangeLogistics}
            onClose={() => setCoordTarget(null)} />
        )}
      </div>
    );
  }

  // No search: We Can Help / We Need Help
  const weCanHelp = [], weNeedHelp = [];
  myRows.forEach((row) => {
    const siblings = inventory.filter((r) => r.medicineIndex === row.medicineIndex);
    const risk = computeRisk(row, siblings);
    const surplus = surplusScore(row, siblings);
    if (surplus > 4) {
      const needers = siblings.filter((s) => s.facilityId !== facility.id).map((s) => ({ ...s, risk: computeRisk(s, siblings) })).filter((s) => s.risk.level === "critical" || s.risk.level === "high");
      if (needers.length) weCanHelp.push({ row, risk, needers: needers.sort((a, b) => b.risk.score - a.risk.score) });
    }
    if (risk.level === "critical" || risk.level === "high") {
      const helpers = siblings.filter((s) => s.facilityId !== facility.id).map((s) => ({ ...s, risk: computeRisk(s, siblings), surplus: surplusScore(s, siblings) })).filter((s) => s.surplus > 4).sort((a, b) => b.surplus - a.surplus);
      if (helpers.length) weNeedHelp.push({ row, risk, helpers });
    }
  });

  const myBloodRows = facility.isBloodBank ? blood.filter((b) => b.facilityId === facility.id) : [];
  const bloodCanHelp = [], bloodNeedHelp = [];
  myBloodRows.forEach((row) => {
    const siblings = blood.filter((b) => b.bloodGroup === row.bloodGroup);
    const risk = computeBloodRisk(row);
    const surplus = bloodSurplusScore(row);
    if (surplus > 3) {
      const needers = siblings.filter((s) => s.facilityId !== facility.id).map((s) => ({ ...s, risk: computeBloodRisk(s) })).filter((s) => s.risk.level === "critical" || s.risk.level === "high");
      if (needers.length) bloodCanHelp.push({ row, risk, needers: needers.sort((a, b) => b.risk.score - a.risk.score) });
    }
    if (risk.level === "critical" || risk.level === "high") {
      const helpers = siblings.filter((s) => s.facilityId !== facility.id).map((s) => ({ ...s, risk: computeBloodRisk(s), surplus: bloodSurplusScore(s) })).filter((s) => s.surplus > 3).sort((a, b) => b.surplus - a.surplus);
      if (helpers.length) bloodNeedHelp.push({ row, risk, helpers });
    }
  });

  return (
    <div className="space-y-6">
      <SearchBar search={search} setSearch={setSearch} />
      <div className="grid lg:grid-cols-2 gap-5">
        <div>
          <SectionHeader title="We Can Help" sub="Your surplus that nearby facilities need" />
          <div className="space-y-3">
            {weCanHelp.map(({ row, needers }) => (
              <div key={row.id} className="rounded-xl border bg-white p-4" style={{ borderColor: T.line }}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">{row.name}</div>
                  <span className="text-xs font-mono text-stone-400">{row.stock} {row.unit} on hand</span>
                </div>
                <p className="text-xs text-stone-500 mt-1">You have surplus stock that nearby facilities need.</p>
                {needers.slice(0, 2).map((n) => {
                  const pending = isPending(row.name, facility.id, n.facilityId);
                  return (
                    <div key={n.id} className="flex items-center justify-between mt-2 border-t pt-2" style={{ borderColor: T.line }}>
                      <span className={`text-xs ${pending ? "line-through text-stone-400" : ""}`}>{facilityById[n.facilityId].name}</span>
                      <ActionOrDone pending={pending} doneLabel="Resolved">
                        <Btn size="sm" variant="amber" icon={Send} onClick={() => onAction({ medicineName: row.name, unit: row.unit, qty: 60, sourceId: facility.id, destId: n.facilityId, kind: "Offer" })}>Resolve</Btn>
                      </ActionOrDone>
                    </div>
                  );
                })}
              </div>
            ))}
            {weCanHelp.length === 0 && <p className="text-sm text-stone-400">No surplus opportunities detected right now.</p>}
          </div>
        </div>
        <div>
          <SectionHeader title="We Need Help" sub="Nearby surplus that could cover your risk" />
          <div className="space-y-3">
            {weNeedHelp.map(({ row, risk, helpers }) => (
              <div key={row.id} className="rounded-xl border bg-white p-4" style={{ borderColor: T.line }}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">{row.name}</div>
                  <StatusPill {...risk} />
                </div>
                <p className="text-xs text-stone-500 mt-1">A nearby facility has surplus stock you may need.</p>
                {helpers.slice(0, 2).map((h) => {
                  const pending = isPending(row.name, h.facilityId, facility.id);
                  return (
                    <div key={h.id} className="flex items-center justify-between mt-2 border-t pt-2" style={{ borderColor: T.line }}>
                      <span className={`text-xs ${pending ? "line-through text-stone-400" : ""}`}>{facilityById[h.facilityId].name} · {Math.round(dist(facility, facilityById[h.facilityId]) / 8)} km</span>
                      <ActionOrDone pending={pending} doneLabel="Requested">
                        <Btn size="sm" variant="outline" icon={ArrowLeftRight} onClick={() => onAction({ medicineName: row.name, unit: row.unit, qty: 60, sourceId: h.facilityId, destId: facility.id, kind: "Request" })}>Request Units</Btn>
                      </ActionOrDone>
                    </div>
                  );
                })}
              </div>
            ))}
            {weNeedHelp.length === 0 && <p className="text-sm text-stone-400">No unresolved shortages detected right now.</p>}
          </div>
        </div>
      </div>

      {facility.isBloodBank && (
        <div>
          <SectionHeader title="Blood Bank" sub="Same surplus/shortage matching, for your blood groups" />
          <div className="grid lg:grid-cols-2 gap-5">
            <div>
              <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5" style={{ color: T.ink }}><Droplet size={14} style={{ color: T.critical }} />We Can Help</h3>
              <div className="space-y-3">
                {bloodCanHelp.map(({ row, needers }) => (
                  <div key={row.id} className="rounded-xl border bg-white p-4" style={{ borderColor: T.line }}>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm font-mono">{row.bloodGroup}</div>
                      <span className="text-xs font-mono text-stone-400">{row.units} units on hand</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">You have surplus units that nearby banks need.</p>
                    {needers.slice(0, 2).map((n) => {
                      const pending = isPending(`${row.bloodGroup} Blood`, facility.id, n.facilityId);
                      return (
                        <div key={n.id} className="flex items-center justify-between mt-2 border-t pt-2" style={{ borderColor: T.line }}>
                          <span className={`text-xs ${pending ? "line-through text-stone-400" : ""}`}>{facilityById[n.facilityId].name}</span>
                          <ActionOrDone pending={pending} doneLabel="Resolved">
                            <Btn size="sm" variant="amber" icon={Send} onClick={() => onAction({ medicineName: `${row.bloodGroup} Blood`, unit: "units", qty: 15, sourceId: facility.id, destId: n.facilityId, kind: "Offer" })}>Resolve</Btn>
                          </ActionOrDone>
                        </div>
                      );
                    })}
                  </div>
                ))}
                {bloodCanHelp.length === 0 && <p className="text-sm text-stone-400">No blood surplus opportunities right now.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5" style={{ color: T.ink }}><Droplet size={14} style={{ color: T.critical }} />We Need Help</h3>
              <div className="space-y-3">
                {bloodNeedHelp.map(({ row, risk, helpers }) => (
                  <div key={row.id} className="rounded-xl border bg-white p-4" style={{ borderColor: T.line }}>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm font-mono">{row.bloodGroup}</div>
                      <StatusPill {...risk} label={risk.level === "critical" ? "Critical" : "High Risk"} />
                    </div>
                    <p className="text-xs text-stone-500 mt-1">A nearby bank has surplus units you may need.</p>
                    {helpers.slice(0, 2).map((h) => {
                      const pending = isPending(`${row.bloodGroup} Blood`, h.facilityId, facility.id);
                      return (
                        <div key={h.id} className="flex items-center justify-between mt-2 border-t pt-2" style={{ borderColor: T.line }}>
                          <span className={`text-xs ${pending ? "line-through text-stone-400" : ""}`}>{facilityById[h.facilityId].name} · {Math.round(dist(facility, facilityById[h.facilityId]) / 8)} km</span>
                          <ActionOrDone pending={pending} doneLabel="Requested">
                            <Btn size="sm" variant="outline" icon={ArrowLeftRight} onClick={() => onAction({ medicineName: `${row.bloodGroup} Blood`, unit: "units", qty: 15, sourceId: h.facilityId, destId: facility.id, kind: "Request" })}>Request Units</Btn>
                          </ActionOrDone>
                        </div>
                      );
                    })}
                  </div>
                ))}
                {bloodNeedHelp.length === 0 && <p className="text-sm text-stone-400">No unresolved blood shortages right now.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function SearchBar({ search, setSearch }) {
  const [open, setOpen] = useState(false);
  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    const bloodMatches = BLOOD_GROUPS.filter((bg) => bg.toLowerCase().startsWith(q)).map((bg) => ({ name: bg, category: "Blood Group" }));
    const starts = MEDICINE_CATALOG.filter((m) => m.name.toLowerCase().startsWith(q));
    const startWords = MEDICINE_CATALOG.filter((m) => !starts.includes(m) && m.name.toLowerCase().split(" ").some((w) => w.startsWith(q)));
    const includes = MEDICINE_CATALOG.filter((m) => !starts.includes(m) && !startWords.includes(m) && m.name.toLowerCase().includes(q));
    return [...bloodMatches, ...starts, ...startWords, ...includes].slice(0, 6);
  }, [search]);
  return (
    <div className="relative max-w-md">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
      <input value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)} placeholder="Search a medicine or blood group (e.g. O+) across the region…"
        className="w-full pl-8 pr-3 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: T.line }} />
      {open && search.trim() && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border bg-white shadow-lg overflow-hidden" style={{ borderColor: T.line }}>
          {suggestions.map((m) => (
            <button key={m.name} onMouseDown={() => { setSearch(m.name); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-stone-50 flex items-center justify-between">
              <span>{m.name}</span>
              <span className="text-[10px] text-stone-400 ml-2 shrink-0">{m.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   REGIONAL SHORTAGE INTELLIGENCE
============================================================================ */
function ShortageSimulationCard({ title, subtitle, badgeLabel, stats, riskyCount, interventions }) {
  const chartData = [1, 2, 3, 4, 5, 6, 7, 8].map((day) => ({
    day: `Day ${day}`,
    doNothing: clamp(30 + day * 9 + riskyCount * 2, 0, 100),
    withAction: clamp(30 + day * 9 - (day >= 3 ? (day - 2) * 14 : 0), 0, 100),
  }));
  return (
    <div className="rounded-xl border bg-white p-5" style={{ borderColor: T.line }}>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="font-bold" style={{ color: T.ink }}>{title}</h3>
          {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
        </div>
        <StatusPill level="critical" color={T.critical} soft={T.criticalSoft} label={badgeLabel} />
      </div>
      <div className="grid sm:grid-cols-4 gap-3 my-4">
        {stats.map((s, i) => <KpiCard key={i} label={s.label} value={s.value} accent={s.accent} />)}
      </div>
      <div className="h-52 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke={T.line} vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="doNothing" name="If we do nothing" stroke={T.critical} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="withAction" name="With redistribution" stroke={T.safe} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 text-xs text-stone-600 mb-4">
        <div className="rounded-lg p-3" style={{ background: T.criticalSoft }}>
          <strong style={{ color: T.critical }}>Without intervention:</strong> Day 1 at-risk → Day 3 high risk → Day 4 critical → Day 6 more facilities affected → Day 8 regional shortage confirmed.
        </div>
        <div className="rounded-lg p-3" style={{ background: T.safeSoft }}>
          <strong style={{ color: T.safe }}>With recommended redistribution:</strong> Transfer initiated → stock received → risk decreases within 2–3 days.
        </div>
      </div>
      <h4 className="text-xs font-bold uppercase tracking-wide text-stone-400 mb-2">Recommended interventions</h4>
      <ul className="text-sm space-y-1.5">
        {interventions.map((it, i) => (
          <li key={i} className="flex gap-2"><CheckCircle2 size={14} className="mt-0.5" style={{ color: T.teal }} />{it}</li>
        ))}
      </ul>
    </div>
  );
}

function ShortageView({ inventory }) {
  const byMed = {};
  inventory.forEach((r) => { byMed[r.medicineIndex] = byMed[r.medicineIndex] || []; byMed[r.medicineIndex].push(r); });
  const clusters = Object.entries(byMed).map(([idx, rows]) => {
    const risky = rows.map((r) => ({ ...r, risk: computeRisk(r, rows) })).filter((r) => r.risk.level === "critical" || r.risk.level === "high");
    return { idx, name: rows[0].name, rows, risky };
  }).filter((c) => c.risky.length >= 3).sort((a, b) => b.risky.length - a.risky.length).slice(0, 3);

  return (
    <div className="space-y-6">
      {clusters.length === 0 && <p className="text-sm text-stone-400">No emerging regional shortages detected at this time.</p>}
      {clusters.map((c) => {
        const facilitiesAffected = c.risky.map((r) => facilityById[r.facilityId]);
        const towns = [...new Set(facilitiesAffected.map((f) => f.town))];
        return (
          <ShortageSimulationCard key={c.idx}
            title={c.name}
            subtitle="Facility-level risk is progressing toward an emerging regional shortage."
            badgeLabel="Emerging Regional Shortage"
            riskyCount={c.risky.length}
            stats={[
              { label: "Facilities Affected", value: c.risky.length, accent: T.critical },
              { label: "Towns", value: towns.join(", ") },
              { label: "Regional Stock", value: c.rows.reduce((s, r) => s + r.stock, 0) },
              { label: "Avg Days Left", value: (c.risky.reduce((s, r) => s + r.risk.daysOfStock, 0) / c.risky.length).toFixed(1) },
            ]}
            interventions={[
              "Redistribute from facilities with confirmed surplus in the region",
              "Request emergency replenishment from a regional medicine dealer",
              "Escalate to regional authority if more than 5 facilities are affected",
            ]}
          />
        );
      })}
    </div>
  );
}

function computeBloodClusters(allBlood) {
  const byGroup = {};
  allBlood.forEach((b) => { byGroup[b.bloodGroup] = byGroup[b.bloodGroup] || []; byGroup[b.bloodGroup].push(b); });
  return Object.entries(byGroup).map(([bg, rows]) => {
    const risky = rows.map((r) => ({ ...r, risk: computeBloodRisk(r) })).filter((r) => r.risk.level === "critical" || r.risk.level === "high");
    return { bg, rows, risky };
  }).filter((c) => c.risky.length >= 2).sort((a, b) => b.risky.length - a.risky.length).slice(0, 3);
}

function BloodShortageSection({ allBlood }) {
  const clusters = computeBloodClusters(allBlood);
  if (clusters.length === 0) return null;
  return (
    <div>
      <SectionHeader title="Regional Blood Shortage Simulation" sub="Cross-bank blood-group risk, and what happens with vs. without redistribution" />
      <div className="space-y-6">
        {clusters.map((c) => {
          const banks = c.risky.map((r) => facilityById[r.facilityId]);
          const towns = [...new Set(banks.map((f) => f.town))];
          return (
            <ShortageSimulationCard key={c.bg}
              title={`${c.bg} Blood`}
              subtitle="Multiple blood banks are declining together for this group."
              badgeLabel="Emerging Regional Shortage"
              riskyCount={c.risky.length}
              stats={[
                { label: "Blood Banks Affected", value: c.risky.length, accent: T.critical },
                { label: "Towns", value: towns.join(", ") },
                { label: "Regional Units", value: c.rows.reduce((s, r) => s + r.units, 0) },
                { label: "Avg Days Left", value: (c.risky.reduce((s, r) => s + r.risk.daysOfStock, 0) / c.risky.length).toFixed(1) },
              ]}
              interventions={[
                "Redistribute from blood banks with confirmed surplus units in the region",
                "Issue an urgent donor call for this blood group",
                "Escalate to the Regional Blood Transfusion Council if 3+ banks are affected",
              ]}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   REGIONAL MAP
============================================================================ */
function MapView({ facilities, inventory, selected, setSelected }) {
  const [typeFilter, setTypeFilter] = useState("all");
  function facilityStatus(f) {
    // Medicine dealers are the supply side of the network — they hold bulk stock and are the
    // source facilities redistribution draws from, so they always show as available (green).
    if (f.type === "Medicine Dealer") return "safe";
    const rows = inventory.filter((r) => r.facilityId === f.id);
    if (rows.length === 0) return "safe";
    const risks = rows.map((r) => computeRisk(r, inventory.filter((s) => s.medicineIndex === r.medicineIndex)));
    if (risks.some((r) => r.level === "critical")) return "critical";
    if (risks.some((r) => r.level === "high")) return "atrisk";
    return "safe";
  }
  const colorMap = { critical: T.critical, atrisk: T.atrisk, safe: T.safe };
  const visible = facilities.filter((f) => typeFilter === "all" || f.type === typeFilter);
  const sel = selected && facilityById[selected];
  const selRows = sel ? inventory.filter((r) => r.facilityId === sel.id).map((r) => ({ ...r, risk: computeRisk(r, inventory.filter((s) => s.medicineIndex === r.medicineIndex)) })).sort((a, b) => b.risk.score - a.risk.score).slice(0, 6) : [];

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 rounded-xl border bg-white p-3" style={{ borderColor: T.line }}>
        <div className="flex flex-wrap gap-1.5 mb-2 px-1">
          {["all", "Hospital", "Pharmacy", "Laboratory", "Medicine Dealer"].map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)} className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ background: typeFilter === t ? T.teal : T.paperDim, color: typeFilter === t ? "white" : T.ink }}>{t}</button>
          ))}
        </div>
        <svg viewBox="0 0 800 600" className="w-full h-[520px] rounded-lg" style={{ background: T.paperDim }}>
          {TOWNS.map((t) => (
            <g key={t.name}>
              <circle cx={t.cx} cy={t.cy} r={t.spread + 15} fill="white" opacity="0.5" />
              <text x={t.cx} y={t.cy - t.spread - 20} textAnchor="middle" fontSize="14" fontWeight="700" fill={T.teal}>{t.name}</text>
            </g>
          ))}
          {visible.map((f) => {
            const status = facilityStatus(f);
            const isSel = selected === f.id;
            const isDealer = f.type === "Medicine Dealer";
            const size = isSel ? 9 : 6;
            return (
              <g key={f.id} onClick={() => setSelected(f.id)} style={{ cursor: "pointer" }}>
                {isDealer ? (
                  <rect x={f.x - size} y={f.y - size} width={size * 2} height={size * 2} rx="2"
                    fill={T.safe} stroke="white" strokeWidth="1.5" />
                ) : (
                  <circle cx={f.x} cy={f.y} r={size} fill={colorMap[status]} stroke="white" strokeWidth="1.5" />
                )}
                {f.area === "Rural" && (
                  <circle cx={f.x} cy={f.y} r={size + 5} fill="none" stroke={T.amber} strokeWidth="1.5" strokeDasharray="2 2" />
                )}
                {isSel && <circle cx={f.x} cy={f.y} r={16} fill="none" stroke={isDealer ? T.safe : colorMap[status]} strokeWidth="1.5" opacity="0.5" />}
              </g>
            );
          })}
        </svg>
        <div className="flex flex-wrap gap-x-4 gap-y-1 px-2 pt-2 text-xs text-stone-500">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: T.safe }} />Surplus / Adequate</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: T.atrisk }} />At Risk</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: T.critical }} />Critical / Stockout</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: T.safe }} />Medicine Dealer (supply hub)</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border border-dashed" style={{ borderColor: T.amber }} />Rural — advance alerts</span>
        </div>
      </div>
      <div className="rounded-xl border bg-white p-4" style={{ borderColor: T.line }}>
        {!sel && <p className="text-sm text-stone-400">Click a facility marker to see its inventory, risk and transfer opportunities.</p>}
        {sel && (
          <div>
            <div className="flex items-center gap-2 font-bold" style={{ color: T.ink }}><FacilityTypeIcon type={sel.type} />{sel.name}</div>
            <p className="text-xs text-stone-500 mb-3">{sel.type} · {sel.town} · {sel.area}</p>
            {sel.type === "Medicine Dealer" && (
              <div className="rounded-lg p-2.5 mb-3 text-xs" style={{ background: T.safeSoft, color: T.safe }}>
                Supply hub — bulk distributor the region orders from and redistributes through.
              </div>
            )}
            {sel.area === "Rural" && (
              <div className="rounded-lg p-2.5 mb-3 text-xs" style={{ background: T.amberSoft, color: T.amber }}>
                Rural site — about {RURAL_BUFFER_DAYS} extra days of last-mile transport, so alerts here are raised early.
              </div>
            )}
            <h4 className="text-xs font-bold uppercase text-stone-400 mb-2">Top risk items</h4>
            <div className="space-y-2">
              {selRows.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-2 border-b pb-1.5" style={{ borderColor: T.line }}>
                  <span className="text-xs min-w-0">{r.name}</span>
                  <StatusPill {...r.risk} />
                </div>
              ))}
              {selRows.length === 0 && <p className="text-xs text-stone-400">No inventory data.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   FACILITY NETWORK
============================================================================ */
function NetworkView({ facilities, inventory }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const rows = facilities.filter((f) => typeFilter === "all" || f.type === typeFilter).map((f) => {
    const fr = inventory.filter((r) => r.facilityId === f.id).map((r) => ({ ...r, risk: computeRisk(r, inventory.filter((s) => s.medicineIndex === r.medicineIndex)) }));
    const critical = fr.filter((r) => r.risk.level === "critical").length;
    const surplus = fr.filter((r) => r.risk.daysOfStock > r.leadTimeDays * 2.2).length;
    return { ...f, critical, surplus, total: fr.length };
  });
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {["all", "Hospital", "Pharmacy", "Laboratory", "Medicine Dealer"].map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)} className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{ background: typeFilter === t ? T.teal : "white", color: typeFilter === t ? "white" : T.ink, border: `1px solid ${typeFilter === t ? T.teal : T.line}` }}>{t}</button>
        ))}
      </div>
      <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: T.line }}>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase text-stone-400 border-b" style={{ borderColor: T.line }}>
            <th className="px-4 py-3">Facility</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Area</th>
            <th className="px-4 py-3">Items Tracked</th><th className="px-4 py-3">Critical</th><th className="px-4 py-3">Surplus</th><th className="px-4 py-3">Status</th>
          </tr></thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id} className="border-b last:border-0" style={{ borderColor: T.line }}>
                <td className="px-4 py-2.5 font-semibold">{f.name}<div className="text-xs text-stone-400 font-normal">{f.town}</div></td>
                <td className="px-4 py-2.5 text-xs">{f.type}</td>
                <td className="px-4 py-2.5 text-xs">{f.area}</td>
                <td className="px-4 py-2.5 font-mono">{f.total}</td>
                <td className="px-4 py-2.5 font-mono" style={{ color: f.critical ? T.critical : T.ink }}>{f.critical}</td>
                <td className="px-4 py-2.5 font-mono" style={{ color: f.surplus ? T.safe : T.ink }}>{f.surplus}</td>
                <td className="px-4 py-2.5">
                  {f.critical > 0 ? <StatusPill level="critical" color={T.critical} soft={T.criticalSoft} label="Needs Help" /> : f.surplus > 0 ? <StatusPill level="safe" color={T.safe} soft={T.safeSoft} label="Has Surplus" /> : <StatusPill level="safe" color={T.ink} soft={T.paperDim} label="Stable" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================================
   INBOX
============================================================================ */
function InboxView({ facility, transfers, onApprove, onReject, onReceive }) {
  const incomingRequests = transfers.filter((t) => t.sourceId === facility.id && t.status === "Requested");
  const outgoingAwaiting = transfers.filter((t) => t.destId === facility.id && t.status === "Delivered");
  return (
    <div className="space-y-6">
      <div>
        <SectionHeader title="Requests awaiting your approval" sub="Facilities asking to draw from your stock" />
        <div className="space-y-2">
          {incomingRequests.map((t) => (
            <div key={t.id} className="rounded-xl border bg-white p-4 flex items-center justify-between" style={{ borderColor: T.line }}>
              <div>
                <div className="text-sm font-semibold">{facilityById[t.destId].name} requests {t.qty} {t.unit} of {t.medicineName}</div>
                <div className="text-xs text-stone-400">{fmtDateTime(t.createdAt)} · {t.distanceKm} km away</div>
              </div>
              <div className="flex gap-2">
                <Btn size="sm" variant="outline" icon={ThumbsUp} onClick={() => onApprove(t.id)}>Approve</Btn>
                <Btn size="sm" variant="danger" icon={ThumbsDown} onClick={() => onReject(t.id)}>Reject</Btn>
              </div>
            </div>
          ))}
          {incomingRequests.length === 0 && <p className="text-sm text-stone-400">Nothing awaiting approval.</p>}
        </div>
      </div>
      <div>
        <SectionHeader title="Delivered — confirm receipt" sub="Mark as received to update your inventory" />
        <div className="space-y-2">
          {outgoingAwaiting.map((t) => (
            <div key={t.id} className="rounded-xl border bg-white p-4 flex items-center justify-between" style={{ borderColor: T.line }}>
              <div>
                <div className="text-sm font-semibold">{t.qty} {t.unit} of {t.medicineName} from {facilityById[t.sourceId].name}</div>
                <div className="text-xs text-stone-400">Delivered — awaiting confirmation</div>
              </div>
              <Btn size="sm" variant="primary" icon={CheckCircle2} onClick={() => onReceive(t.id)}>Mark Received</Btn>
            </div>
          ))}
          {outgoingAwaiting.length === 0 && <p className="text-sm text-stone-400">Nothing awaiting receipt confirmation.</p>}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   TRANSFERS
============================================================================ */
const TRANSFER_STEPS = ["Requested", "Approved", "Pickup Scheduled", "Picked Up", "In Transit", "Delivered", "Received"];
const DELIVERY_PARTNER_NAMES = ["Naveen Kumar", "Suresh Poojary", "Ramesh Shetty", "Praveen Rai", "Ganesh Achar", "Vikram Nayak", "Deepak Salian", "Anil Bhandary", "Manoj Kotian", "Sandeep Amin"];
function partnerFor(id) {
  let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const name = DELIVERY_PARTNER_NAMES[h % DELIVERY_PARTNER_NAMES.length];
  return { name, initials: name.split(" ").map((w) => w[0]).join(""), vehicle: `KA ${20 + (h % 7)} X ${1000 + (h % 8999)}` };
}
function DeliveryTracker({ t }) {
  const idx = TRANSFER_STEPS.indexOf(t.status);
  const src = facilityById[t.sourceId], dst = facilityById[t.destId];
  const partner = partnerFor(t.id);
  const pct = idx < 3 ? 0 : idx >= 5 ? 100 : ((idx - 3) / 2) * 100;
  const showRider = idx >= 3;
  const messages = [
    "Request sent — waiting for facility approval",
    "Approved — shipment being prepared for pickup",
    `Pickup scheduled${t.distanceKm < 15 ? " · Swiggy Genie last-mile (simulated)" : ""}`,
    `${partner.name} picked up the package from ${src.name}`,
    `${partner.name} is on the way — about ${t.etaMins} min to ${dst.name}`,
    "Delivered to destination — awaiting confirmation",
    "Received — inventory updated on both sides",
  ];
  return (
    <div className="rounded-xl border p-4 mb-2" style={{ borderColor: T.line, background: T.paperDim }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {showRider ? (
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-[11px] shrink-0" style={{ background: T.amber }}>
              {partner.initials}
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0" style={{ background: T.tealSoft }}>
              <Package size={14} style={{ color: T.teal }} />
            </div>
          )}
          <div>
            <div className="text-xs font-semibold">{showRider ? partner.name : "Preparing shipment"}</div>
            {showRider && <div className="text-[10px] text-stone-400">{partner.vehicle} · delivery partner (simulated)</div>}
          </div>
        </div>
        {idx < 6 && <span className="text-xs font-mono text-stone-500 shrink-0">{t.distanceKm} km{idx < 5 ? ` · ETA ${t.etaMins} min` : ""}</span>}
      </div>

      <p className="text-sm font-medium mb-3" style={{ color: T.ink }}>{messages[idx]}</p>

      <div className="relative mb-2 px-3 pt-3">
        <div className="h-1.5 rounded-full" style={{ background: T.line }} />
        <div className="absolute top-3 left-3 h-1.5 rounded-full transition-all duration-700" style={{ background: T.safe, width: `calc(${pct}% - ${pct > 0 ? 24 : 0}px)`, maxWidth: "calc(100% - 24px)" }} />
        <div className="absolute -top-0.5 flex flex-col items-center transition-all duration-700" style={{ left: `calc(${pct}% * 0.94)` }}>
          {showRider ? (
            <div className={`h-6 w-6 rounded-full flex items-center justify-center shadow ${idx === 4 ? "animate-pulse" : ""}`} style={{ background: T.amber }}>
              <Bike size={13} color="white" />
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full flex items-center justify-center" style={{ background: "white", border: `1.5px solid ${T.line}` }}>
              <Clock size={11} className="text-stone-400" />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] text-stone-400 px-1 mt-2">
        <span className="flex items-center gap-1 truncate"><Package size={11} className="shrink-0" />{src.name}</span>
        <span className="flex items-center gap-1 truncate justify-end">{dst.name}<Building2 size={11} className="shrink-0" /></span>
      </div>
    </div>
  );
}
function TransferTimeline({ status }) {
  const idx = TRANSFER_STEPS.indexOf(status);
  return (
    <div className="flex items-center flex-wrap gap-1">
      {TRANSFER_STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex items-center gap-1">
            {i <= idx ? <CheckCircle2 size={13} style={{ color: T.safe }} /> : <Circle size={13} className="text-stone-300" />}
            <span className="text-[11px]" style={{ color: i <= idx ? T.ink : "#a8a29e" }}>{s}</span>
          </div>
          {i < TRANSFER_STEPS.length - 1 && <div className="h-px w-3" style={{ background: i < idx ? T.safe : T.line }} />}
        </React.Fragment>
      ))}
    </div>
  );
}
function TransfersView({ facility, isAdmin, transfers, onAdvance, onReject }) {
  const mine = facility ? transfers.filter((t) => t.sourceId === facility.id || t.destId === facility.id) : transfers;
  return (
    <div className="space-y-3">
      {mine.map((t) => {
        const src = facilityById[t.sourceId], dst = facilityById[t.destId];
        const isSource = facility && t.sourceId === facility.id;
        const isDest = facility && t.destId === facility.id;
        return (
          <div key={t.id} className="rounded-xl border bg-white p-4" style={{ borderColor: T.line }}>
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <div className="text-sm font-semibold">{t.qty} {t.unit} · {t.medicineName}</div>
                <div className="text-xs text-stone-400 flex items-center gap-1">{src.name} <ArrowRight size={11} /> {dst.name} · {t.distanceKm} km · ~{t.etaMins} min{t.distanceKm < 15 && " (simulated Swiggy Genie last-mile)"}</div>
              </div>
              {t.status === "Rejected" ? <StatusPill level="critical" color={T.critical} soft={T.criticalSoft} label="Rejected" /> :
                t.status === "Received" ? <StatusPill level="safe" color={T.safe} soft={T.safeSoft} label="Completed" /> :
                <StatusPill level="atrisk" color={T.amber} soft={T.amberSoft} label={t.status} />}
            </div>
            {t.status !== "Rejected" && <DeliveryTracker t={t} />}
            {t.status !== "Rejected" && <TransferTimeline status={t.status} />}
            <div className="flex gap-2 mt-3">
              {t.status === "Requested" && isSource && <>
                <Btn size="sm" variant="primary" onClick={() => onAdvance(t.id)} icon={ThumbsUp}>Approve</Btn>
                <Btn size="sm" variant="danger" onClick={() => onReject(t.id)} icon={ThumbsDown}>Reject</Btn>
              </>}
              {["Approved", "Pickup Scheduled", "Picked Up", "In Transit"].includes(t.status) && (isAdmin || isSource || isDest) && <Btn size="sm" variant="outline" onClick={() => onAdvance(t.id)} icon={RefreshCw}>Advance status (demo)</Btn>}
              {t.status === "Delivered" && isDest && <Btn size="sm" variant="primary" onClick={() => onAdvance(t.id)} icon={CheckCircle2}>Mark Received</Btn>}
              {t.status === "Delivered" && isAdmin && <Btn size="sm" variant="outline" onClick={() => onAdvance(t.id)} icon={CheckCircle2}>Confirm receipt (demo)</Btn>}
            </div>
          </div>
        );
      })}
      {mine.length === 0 && <p className="text-sm text-stone-400">No transfers yet — start one from Regional Redistribution.</p>}
    </div>
  );
}

/* ============================================================================
   ADMIN → FACILITY MESSAGE
============================================================================ */
function defaultMessageFor({ row, facility }, senderName) {
  const risk = row.risk;
  const days = risk.daysOfStock.toFixed(1);
  const supplyLine = risk.isRural
    ? `You have roughly ${days} days of stock left. Because you are a rural site, a resupply realistically takes about ${risk.effectiveLeadTime} days door-to-door (${row.leadTimeDays}-day supplier lead time plus around ${risk.ruralBuffer} days of last-mile transport), so this is an advance alert — the window to order is closing now.`
    : `You have roughly ${days} days of stock left against a ${row.leadTimeDays}-day restocking lead time.`;

  return `Dear Team at ${facility.name},

Regional monitoring has flagged ${row.name} at your facility as ${risk.label} (${risk.score}% stockout risk).

${supplyLine}

Please confirm within 24 hours whether you can cover this locally. If you cannot, reply to this alert and the regional office will act on your behalf — we can release emergency budget, place an order with a regional medicine dealer, or arrange a logistics transfer from a larger hub nearby.

— ${senderName || "Regional Admin"}
Regional Admin, DAWAI-SETU`;
}

function NotifyModal({ target, onClose, onSend, senderName }) {
  const [body, setBody] = useState(() => defaultMessageFor(target, senderName));
  const [channel, setChannel] = useState("SMS + Email");
  const [priority, setPriority] = useState(target.row.risk.level === "critical" ? "Urgent" : "High");

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b flex items-start justify-between gap-3" style={{ borderColor: T.line }}>
          <div className="min-w-0">
            <h3 className="font-bold flex items-center gap-2" style={{ color: T.ink }}><Send size={15} />Message {target.facility.name}</h3>
            <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <FacilityTypeIcon type={target.facility.type} size={11} />
              {target.facility.type} · {target.facility.town} · {target.facility.area} · re: {target.row.name}
              <RuralAdvanceBadge risk={target.row.risk} />
            </p>
          </div>
          <button onClick={onClose}><X size={18} className="text-stone-400" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-500">Channel</label>
              <select value={channel} onChange={(e) => setChannel(e.target.value)}
                className="w-full mt-1.5 rounded-lg border px-3 py-2 text-sm outline-none bg-white" style={{ borderColor: T.line }}>
                {["SMS + Email", "SMS only", "Email only", "In-app notification"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}
                className="w-full mt-1.5 rounded-lg border px-3 py-2 text-sm outline-none bg-white" style={{ borderColor: T.line }}>
                {["Urgent", "High", "Routine"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-500">Message — pre-filled from this alert, edit freely</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={11}
              className="w-full mt-1.5 rounded-lg border px-3 py-2.5 text-sm outline-none leading-relaxed" style={{ borderColor: T.line }} />
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button onClick={() => setBody(defaultMessageFor(target, senderName))}
              className="text-xs font-semibold flex items-center gap-1" style={{ color: T.teal }}>
              <RefreshCw size={12} />Reset to suggested wording
            </button>
            <div className="flex gap-2">
              <Btn variant="outline" size="sm" onClick={onClose}>Cancel</Btn>
              <Btn variant="amber" size="sm" icon={Send}
                onClick={() => onSend({ facilityId: target.facility.id, medicineName: target.row.name, body, channel, priority })}>
                Send {priority === "Urgent" ? "urgent " : ""}alert
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   ALERTS
============================================================================ */
function AlertsView({ rows, onOpen, setNav, showFacility, isAdmin, onRequestMedicine, onNotify, isHandled }) {
  const [scope, setScope] = useState("all");
  const ranked = [...rows].sort((a, b) => b.risk.score - a.risk.score);
  const ruralCount = ranked.filter((r) => r.risk.advanceAlert).length;
  const sorted = scope === "rural" ? ranked.filter((r) => r.risk.advanceAlert) : ranked;

  return (
    <div className="space-y-2">
      {ruralCount > 0 && (
        <div className="rounded-xl p-4 flex items-start gap-3 mb-3" style={{ background: T.amberSoft }}>
          <Bike size={17} style={{ color: T.amber }} className="mt-0.5 shrink-0" />
          <p className="text-sm" style={{ color: T.amber }}>
            <strong>{ruralCount} rural advance alert{ruralCount === 1 ? "" : "s"}.</strong> Rural sites are warned earlier because a
            delivery there needs roughly {RURAL_BUFFER_DAYS} extra days of last-mile transport — a medicine with 6 days of stock and a
            4-day restock is already too tight to leave alone.
          </p>
        </div>
      )}

      {ruralCount > 0 && (
        <div className="flex gap-2 pb-2">
          {[{ k: "all", l: `All alerts (${ranked.length})` }, { k: "rural", l: `Rural advance (${ruralCount})` }].map((o) => (
            <button key={o.k} onClick={() => setScope(o.k)} className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: scope === o.k ? T.teal : "white", color: scope === o.k ? "white" : T.ink, border: `1px solid ${scope === o.k ? T.teal : T.line}` }}>
              {o.l}
            </button>
          ))}
        </div>
      )}

      {sorted.map((r) => {
        const targetFacility = facilityById[r.facilityId];
        const handled = isHandled ? isHandled(r.name, r.facilityId) : false;
        return (
          <div key={r.id} onClick={() => onOpen(r)} className="rounded-xl border bg-white p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50" style={{ borderColor: T.line }}>
            <div className="flex items-center gap-3 min-w-0">
              <AlertTriangle size={16} style={{ color: r.risk.color }} className="shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-semibold flex items-center gap-2 flex-wrap">
                  {r.name}<RuralAdvanceBadge risk={r.risk} />
                </div>
                <div className="text-xs text-stone-500">{showFacility && `${targetFacility.name} · `}{r.risk.windowText}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusPill {...r.risk} />
              {isAdmin ? (
                <Btn size="sm" variant="amber" icon={Send} onClick={(e) => { e.stopPropagation(); onNotify({ row: r, facility: targetFacility }); }}>
                  Message Facility
                </Btn>
              ) : handled ? (
                <span className="text-xs font-semibold flex items-center gap-1" style={{ color: T.safe }}><CheckCircle2 size={13} />Requested</span>
              ) : (
                <Btn size="sm" variant="outline" icon={ArrowLeftRight} onClick={(e) => { e.stopPropagation(); onRequestMedicine(r.name); }}>Request</Btn>
              )}
            </div>
          </div>
        );
      })}
      {sorted.length === 0 && scope === "rural" && (
        <p className="text-center text-sm text-stone-400 py-10">No rural advance alerts right now.</p>
      )}
      {ranked.length === 0 && (
        <div className="text-center py-14">
          <ShieldCheck size={28} className="mx-auto mb-2" style={{ color: T.safe }} />
          <p className="text-sm text-stone-500">No active alerts{showFacility ? " across the network" : " at your facility"} right now.</p>
          <Btn size="sm" variant="outline" onClick={() => setNav("redistribution")}>Check regional redistribution</Btn>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   HISTORY
============================================================================ */
function HistoryView({ facility, transfers }) {
  const mine = facility ? transfers.filter((t) => t.sourceId === facility.id || t.destId === facility.id) : transfers;
  return (
    <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: T.line }}>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-[11px] uppercase text-stone-400 border-b" style={{ borderColor: T.line }}>
          <th className="px-4 py-3">Transfer ID</th><th className="px-4 py-3">Medicine</th><th className="px-4 py-3">Source</th>
          <th className="px-4 py-3">Destination</th><th className="px-4 py-3">Qty</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th>
        </tr></thead>
        <tbody>
          {mine.map((t) => (
            <tr key={t.id} className="border-b last:border-0" style={{ borderColor: T.line }}>
              <td className="px-4 py-2.5 font-mono text-xs">{t.id}</td>
              <td className="px-4 py-2.5">{t.medicineName}</td>
              <td className="px-4 py-2.5 text-xs">{facilityById[t.sourceId].name}</td>
              <td className="px-4 py-2.5 text-xs">{facilityById[t.destId].name}</td>
              <td className="px-4 py-2.5 font-mono">{t.qty} {t.unit}</td>
              <td className="px-4 py-2.5 text-xs">{fmtDate(t.createdAt)}</td>
              <td className="px-4 py-2.5">
                {t.status === "Rejected" ? <StatusPill level="critical" color={T.critical} soft={T.criticalSoft} label="Rejected" /> :
                 t.status === "Received" ? <StatusPill level="safe" color={T.safe} soft={T.safeSoft} label="Completed" /> :
                 <StatusPill level="atrisk" color={T.amber} soft={T.amberSoft} label={t.status} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {mine.length === 0 && <p className="text-center text-sm text-stone-400 py-10">No transfer history yet.</p>}
    </div>
  );
}
