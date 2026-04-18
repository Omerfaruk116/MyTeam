import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import IntroScreen from "./IntroScreen";

const EQUIPMENT = [
  { name: "Terlik", dot: "bg-slate-400", price: 0, bonus: { speed: -4, power: -3, stamina: -5, technique: -4 } },
  { name: "Bot", dot: "bg-amber-700", price: 120, bonus: { speed: -1, power: 0, stamina: -1, technique: -1 } },
  { name: "Spor Ayakkabı", dot: "bg-blue-500", price: 320, bonus: { speed: 2, power: 1, stamina: 2, technique: 1 } },
  { name: "Temel Krampon", dot: "bg-violet-500", price: 900, bonus: { speed: 4, power: 3, stamina: 3, technique: 3 } },
  { name: "Elit Krampon", dot: "bg-yellow-400", price: 2200, bonus: { speed: 8, power: 6, stamina: 7, technique: 6 } },
];

const SPONSORS = [
  { id: "boots", minStars: 2.2, company: "Falcon Boots", title: "Krampon Sponsorluğu", amount: 10000 },
  { id: "kit", minStars: 3.3, company: "North Stripe", title: "Forma Sponsorluğu", amount: 50000 },
  { id: "tv", minStars: 4.2, company: "Prime Sports TV", title: "Yayın Anlaşması", amount: 1000000 },
];

const STORE = [
  { id: "scarf", name: "Kulüp Atkısı", buy: 18, demand: 24 },
  { id: "shirt", name: "Kulüp Forması", buy: 52, demand: 12 },
  { id: "cap", name: "Kulüp Şapkası", buy: 25, demand: 15 },
];

const OPPONENTS = [
  "River Hawks",
  "Steel Union",
  "Red Harbor",
  "Blue Comets",
  "Iron Peak",
  "Crown Vale",
  "East Wolves",
  "Golden Yard",
  "Stone Athletic",
  "Northport FC",
];

const START_PLAYERS = [
  { name: "Arda Nova", role: "ST", speed: 60, power: 55, stamina: 58, technique: 62 },
  { name: "Leo Vale", role: "LW", speed: 68, power: 52, stamina: 61, technique: 67 },
  { name: "Chris North", role: "RW", speed: 64, power: 66, stamina: 57, technique: 59 },
  { name: "Miran Fox", role: "CAM", speed: 55, power: 57, stamina: 70, technique: 66 },
  { name: "Eren Pike", role: "CM", speed: 58, power: 59, stamina: 68, technique: 63 },
  { name: "Bora Steel", role: "CM", speed: 52, power: 63, stamina: 65, technique: 56 },
  { name: "Kaan Ridge", role: "LB", speed: 50, power: 69, stamina: 67, technique: 52 },
  { name: "Tuna Wall", role: "GK", speed: 45, power: 63, stamina: 62, technique: 56 },
  { name: "Mert Shield", role: "CB", speed: 49, power: 71, stamina: 65, technique: 51 },
  { name: "Yusuf Guard", role: "CB", speed: 51, power: 68, stamina: 66, technique: 50 },
  { name: "Kerem Wing", role: "SB", speed: 61, power: 58, stamina: 66, technique: 58 },
  { name: "Remzi Dash", role: "ST", speed: 70, power: 61, stamina: 72, technique: 60 },
  { name: "Efe Craft", role: "CAM", speed: 57, power: 55, stamina: 69, technique: 70 },
  { name: "Hakan Lock", role: "DF", speed: 48, power: 72, stamina: 63, technique: 49 },
  { name: "Burak Flash", role: "RW", speed: 73, power: 54, stamina: 68, technique: 61 },
  { name: "Kaan Save", role: "GK", speed: 44, power: 62, stamina: 60, technique: 55 },
  { name: "Selim Core", role: "CM", speed: 56, power: 58, stamina: 71, technique: 62 },
  { name: "Musa Wall", role: "CB", speed: 47, power: 70, stamina: 67, technique: 48 },
];

const FORMATION = ["GK", "LB", "CB", "CB", "SB", "CM", "CM", "CAM", "LW", "ST", "RW"];
const BENCH_SIZE = 7;
const MAX_SUBS = 3;
const MARKET_REFRESH_MS = 6 * 60 * 60 * 1000;
const MARKET_ROLES = ["ALL", "GK", "LB", "CB", "SB", "DF", "CM", "CAM", "LW", "RW", "ST"];
const MARKET_CLUBS = [
  "Karadenizspor",
  "Marmara Gücü",
  "Ege Kartalları",
  "Bozkurtspor",
  "Hilal Spor",
  "Sanayi Spor",
  "Anadolu Birlik",
  "Kuzey Yıldırım",
  "Akdeniz Gençlik",
  "Liman FK",
  "Doğu Yıldızları",
  "İç Anadolu FK",
];
const LOGO_SHAPES = ["shield", "round", "diamond", "badge"];
const LOGO_SYMBOLS = ["wolf", "crown", "star", "falcon"];
const CLUB_PALETTES = [
  { name: "Siyah Altın", bg: "#0a0a0a", primary: "#d4a93a", accent: "#ffffff" },
  { name: "Lacivert Altın", bg: "#0f172a", primary: "#eab308", accent: "#dbeafe" },
  { name: "Kırmızı Siyah", bg: "#111111", primary: "#ef4444", accent: "#f8fafc" },
  { name: "Zümrüt Siyah", bg: "#0b1210", primary: "#10b981", accent: "#ecfeff" },
];
const ABILITY_POOL = [
  { icon: "⚔️", name: "Bire Bir Golcü" },
  { icon: "🥅", name: "Penaltı Ustası" },
  { icon: "🧱", name: "Güçlü Defans" },
  { icon: "🎯", name: "Serbest Vuruş Ustası" },
  { icon: "🎩", name: "Oyun Kurucu" },
  { icon: "🧤", name: "Refleks Ustası" },
];

const money = (n) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const random = (xs) => xs[Math.floor(Math.random() * xs.length)];
const roleShort = (r) => (r === "ALL" ? "Tümü" : r);

function assignAbilities(players) {
  return players.map((p) => {
    const overall = Math.round((p.speed + p.power + p.stamina + p.technique) / 4);
    const picked = [];
    if (overall >= 75) picked.push(random(ABILITY_POOL));
    if (overall >= 80) {
      const remaining = ABILITY_POOL.filter((a) => !picked.find((x) => x.name === a.name));
      if (remaining.length) picked.push(random(remaining));
    }
    return { ...p, overall, abilities: picked, condition: p.stamina, booked: false, injured: false };
  });
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function createMarketPlayers(count = 10) {
  const firstNames = ["Emir", "Tuna", "Kuzey", "Aras", "Mete", "Ege", "Kaan", "Yaman", "Berk", "Doruk", "Miran", "Ata"];
  const lastNames = ["Ateş", "Yıldız", "Kaya", "Demir", "Şahin", "Aslan", "Kurt", "Aksoy", "Özkan", "Turan", "Sarp", "Güneş"];
  const roles = ["GK", "LB", "CB", "SB", "DF", "CM", "CAM", "LW", "RW", "ST"];

  return Array.from({ length: count }).map((_, index) => {
    const role = random(roles);
    const base = 60 + Math.floor(Math.random() * 24);
    const player = assignAbilities([
      {
        name: `${random(firstNames)} ${random(lastNames)}`,
        role,
        speed: clamp(base + Math.floor(Math.random() * 8) - 3, 40, 92),
        power: clamp(base + Math.floor(Math.random() * 8) - 3, 40, 92),
        stamina: clamp(base + Math.floor(Math.random() * 8) - 3, 40, 92),
        technique: clamp(base + Math.floor(Math.random() * 8) - 3, 40, 92),
      },
    ])[0];

    const overall = player.overall;
    const price = overall >= 82 ? 3200 + overall * 90 : overall >= 75 ? 1800 + overall * 65 : 700 + overall * 35;

    return {
      id: `market-${Date.now()}-${index}-${player.name.replace(/\s+/g, "-")}`,
      ...player,
      clubName: random(MARKET_CLUBS),
      age: 18 + Math.floor(Math.random() * 14),
      price,
    };
  }).sort((a, b) => b.overall - a.overall);
}

function freshState() {
  return {
    manager: "Ömer",
    club: "Blue Crescent FC",
    started: false,
    cash: 500,
    fans: 120,
    morale: 62,
    eq: 0,
    players: assignAbilities(START_PLAYERS),
    cup: { current: 0, total: 10, w: 0, d: 0, l: 0, gf: 0, ga: 0, done: false },
    lastMatch: null,
    log: ["Kulüp kuruldu.", "İlk hedef: 10 maçlık başlangıç kupasını tamamla."],
    sponsorsTaken: [],
    pendingSponsor: null,
    stock: { scarf: 0, shirt: 0, cap: 0 },
    storeRevenue: 0,
    identity: {
      shape: "shield",
      symbol: "wolf",
      paletteIndex: 0,
      shortName: "BCF",
      year: "2026",
    },
    market: {
      players: createMarketPlayers(),
      nextRefreshAt: Date.now() + MARKET_REFRESH_MS,
      filter: "ALL",
      boughtToday: 0,
    },
    live: {
      screen: false,
      minute: 0,
      score: { home: 0, away: 0 },
      running: false,
      speed: 1,
      tempo: "Dengeli",
      events: [],
      lineupIds: [],
      benchIds: [],
      selectedOut: "",
      selectedIn: "",
      subsUsed: 0,
      opponent: "",
      finished: false,
      resultSummary: null,
    },
  };
}

function calcTeam(players, eq, morale) {
  const b = EQUIPMENT[eq].bonus;
  return {
    speed: Math.round(clamp(avg(players.map((p) => p.speed)) + b.speed + morale * 0.06, 1, 99)),
    power: Math.round(clamp(avg(players.map((p) => p.power)) + b.power + morale * 0.05, 1, 99)),
    stamina: Math.round(clamp(avg(players.map((p) => p.stamina)) + b.stamina + morale * 0.07, 1, 99)),
    technique: Math.round(clamp(avg(players.map((p) => p.technique)) + b.technique + morale * 0.06, 1, 99)),
  };
}

function calcStars(team) {
  const raw = (team.speed + team.power + team.stamina + team.technique) / 4;
  return Math.round(clamp(raw / 18, 1, 5) * 10) / 10;
}

function simulate(state) {
  const team = calcTeam(state.players, state.eq, state.morale);
  const opponent = OPPONENTS[state.cup.current] || `Rakip ${state.cup.current + 1}`;
  const opp = 48 + state.cup.current * 2 + Math.floor(Math.random() * 8);
  const score = team.speed * 0.23 + team.power * 0.24 + team.stamina * 0.22 + team.technique * 0.31 - opp + (Math.random() * 12 - 6);

  let gf = 0;
  let ga = 0;
  if (score > 14) { gf = 3 + Math.floor(Math.random() * 3); ga = Math.floor(Math.random() * 2); }
  else if (score > 6) { gf = 2 + Math.floor(Math.random() * 2); ga = Math.floor(Math.random() * 2); }
  else if (score > -3) { gf = 1 + Math.floor(Math.random() * 2); ga = 1 + Math.floor(Math.random() * 2); }
  else if (score > -10) { gf = Math.floor(Math.random() * 2); ga = 1 + Math.floor(Math.random() * 2); }
  else { gf = Math.floor(Math.random() * 2); ga = 2 + Math.floor(Math.random() * 3); }

  const result = gf > ga ? "W" : gf === ga ? "D" : "L";
  const prize = result === "W" ? 160 + state.cup.current * 40 : result === "D" ? 80 : 35;
  const moraleShift = result === "W" ? 5 : result === "D" ? 1 : -4;
  const fanShift = result === "W" ? 45 : result === "D" ? 15 : -8;

  const lines = [
    `${state.club}, ${opponent} karşısında sahaya çıktı.`,
    `Hız ${team.speed}, teknik ${team.technique}, kondisyon ${team.stamina}.`,
    gf > ga ? "Baskı sonuç verdi ve takım öne geçti." : gf === ga ? "Maç dengeli geçti." : "Rakip kritik anlarda daha etkiliydi.",
    `Skor: ${gf}-${ga}`,
  ];

  const cup = {
    ...state.cup,
    current: state.cup.current + 1,
    w: state.cup.w + (result === "W" ? 1 : 0),
    d: state.cup.d + (result === "D" ? 1 : 0),
    l: state.cup.l + (result === "L" ? 1 : 0),
    gf: state.cup.gf + gf,
    ga: state.cup.ga + ga,
  };

  let bonus = 0;
  if (cup.current >= cup.total) {
    cup.done = true;
    bonus = 1500 + cup.w * 250;
    lines.push(`Başlangıç kupası tamamlandı. Ek ödül: ${money(bonus)}.`);
  }

  return {
    ...state,
    cash: state.cash + prize + bonus,
    morale: clamp(state.morale + moraleShift, 30, 95),
    fans: Math.max(50, state.fans + fanShift),
    cup,
    log: lines,
    lastMatch: { opponent, gf, ga, result, prize },
  };
}

function LogoSymbol({ symbol, color }) {
  if (symbol === "crown") {
    return (
      <path d="M40 70 L52 42 L64 60 L78 34 L92 60 L104 42 L116 70 Z M46 76 H110 V88 H46 Z" fill={color} />
    );
  }
  if (symbol === "star") {
    return (
      <path d="M78 36 L88 58 L112 60 L94 75 L100 98 L78 86 L56 98 L62 75 L44 60 L68 58 Z" fill={color} />
    );
  }
  if (symbol === "falcon") {
    return (
      <path d="M36 78 C58 52, 78 44, 118 46 C100 54, 92 64, 86 78 C82 88, 72 96, 58 98 C70 88, 76 82, 78 74 C60 74, 48 76, 36 78 Z" fill={color} />
    );
  }
  return (
    <path d="M44 96 C50 70, 54 52, 76 40 C88 34, 104 36, 112 44 C96 46, 90 54, 84 60 C94 58, 106 60, 114 68 C106 70, 98 74, 92 82 C86 90, 74 98, 58 100 Z" fill={color} />
  );
}

function LogoMark({ identity, clubName, size = 128 }) {
  const palette = CLUB_PALETTES[identity.paletteIndex] || CLUB_PALETTES[0];
  const shortName = (identity.shortName || initials(clubName)).slice(0, 3).toUpperCase();
  const viewBox = "0 0 156 156";

  const baseShape =
    identity.shape === "round"
      ? <circle cx="78" cy="78" r="58" fill={palette.bg} stroke={palette.primary} strokeWidth="8" />
      : identity.shape === "diamond"
        ? <path d="M78 16 L132 78 L78 140 L24 78 Z" fill={palette.bg} stroke={palette.primary} strokeWidth="8" />
        : identity.shape === "badge"
          ? <path d="M30 28 H126 V98 C126 120 108 136 78 144 C48 136 30 120 30 98 Z" fill={palette.bg} stroke={palette.primary} strokeWidth="8" />
          : <path d="M36 24 H120 V82 C120 110 100 132 78 142 C56 132 36 110 36 82 Z" fill={palette.bg} stroke={palette.primary} strokeWidth="8" />;

  return (
    <svg width={size} height={size} viewBox={viewBox} className="drop-shadow-[0_0_18px_rgba(255,255,255,0.08)]">
      {baseShape}
      <LogoSymbol symbol={identity.symbol} color={palette.primary} />
      <text x="78" y="118" textAnchor="middle" fill={palette.accent} fontSize="20" fontWeight="800" letterSpacing="4">
        {shortName}
      </text>
      <text x="78" y="26" textAnchor="middle" fill={palette.accent} fontSize="10" fontWeight="700" letterSpacing="3">
        {identity.year || "2026"}
      </text>
    </svg>
  );
}

function PremiumCard({ title, subtitle, children, right, className = "" }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-[#101010] p-5 shadow-[0_0_20px_rgba(255,255,255,0.04)] ${className}`}>
      {(title || right) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function PremiumButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

function Bar({ label, value }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm"><span className="text-slate-400">{label}</span><span className="font-semibold text-white">{value}</span></div>
      <div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-white" style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function RatingChip({ player }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
      <span className="rounded-full bg-slate-800 px-2 py-1 font-bold text-white">{player.role}</span>
      <span>OVR {player.overall}</span>
      <span>KON {Math.round(player.condition)}</span>
      {player.abilities?.length > 0 && (
        <span className="flex gap-1">{player.abilities.map((a) => <span key={a.name} title={a.name}>{a.icon}</span>)}</span>
      )}
    </div>
  );
}

function EventCard({ e, top }) {
  const color = e.type === "goal" ? "bg-emerald-500 text-white" : e.type === "yellow" ? "bg-yellow-400 text-slate-950" : e.type === "injury" ? "bg-rose-500 text-white" : e.type === "sub" ? "bg-sky-500 text-white" : "bg-[#171717] text-white border border-white/10";
  const pulse = e.type === "goal" && top ? "animate-pulse" : "";
  return (
    <div className={`rounded-2xl p-3 text-sm shadow ${color} ${pulse}`}>
      <div className="font-bold">{e.minute}' {e.title}</div>
      <div className="mt-1">{e.text}</div>
    </div>
  );
}

function rarityStyle(overall) {
  if (overall >= 82) return "border-yellow-400/40 shadow-[0_0_18px_rgba(250,204,21,0.18)]";
  if (overall >= 76) return "border-violet-400/30 shadow-[0_0_18px_rgba(167,139,250,0.14)]";
  if (overall >= 70) return "border-sky-400/30 shadow-[0_0_18px_rgba(56,189,248,0.12)]";
  return "border-white/10";
}

function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function App() {
  const [game, setGame] = useState(freshState());
  const [showIntro, setShowIntro] = useState(true);
  const [marketNow, setMarketNow] = useState(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("fm-demo-save");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.identity) parsed.identity = freshState().identity;
        if (!parsed.market) parsed.market = freshState().market;
        if (!parsed.market.players?.length || !parsed.market.nextRefreshAt || parsed.market.nextRefreshAt < Date.now()) {
          parsed.market = {
            ...freshState().market,
            filter: parsed.market?.filter || "ALL",
          };
        }
        setGame(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("fm-demo-save", JSON.stringify(game));
  }, [game]);

  useEffect(() => {
    const t = setInterval(() => setMarketNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (marketNow < game.market.nextRefreshAt) return;
    setGame((g) => ({
      ...g,
      market: {
        ...g.market,
        players: createMarketPlayers(),
        nextRefreshAt: Date.now() + MARKET_REFRESH_MS,
      },
    }));
  }, [marketNow, game.market.nextRefreshAt]);

  useEffect(() => {
    if (!game.live.running) return;

    const delay = 1200 / game.live.speed;
    timerRef.current = setInterval(() => {
      setGame((g) => {
        if (!g.live.running || g.live.finished) return g;
        const nextMinute = g.live.minute + 1;
        let next = {
          ...g,
          players: g.players.map((p) => {
            if (!g.live.lineupIds.includes(p.name)) return p;
            const drain = g.live.tempo === "Hücum" ? 1.8 : g.live.tempo === "Defans" ? 1.0 : 1.4;
            return { ...p, condition: clamp(p.condition - drain, 0, 100) };
          }),
          live: { ...g.live, minute: nextMinute },
        };

        const lineupPlayers = next.players.filter((p) => next.live.lineupIds.includes(p.name));
        const attacker = random(lineupPlayers.filter((p) => ["ST", "LW", "RW", "CAM"].includes(p.role)) || lineupPlayers);
        const creator = random(lineupPlayers.filter((p) => ["CAM", "CM", "LW", "RW"].includes(p.role)) || lineupPlayers);
        const defender = random(lineupPlayers.filter((p) => ["DF", "CB", "LB", "SB"].includes(p.role)) || lineupPlayers);
        const keeper = lineupPlayers.find((p) => p.role === "GK") || random(lineupPlayers);

        const eventRoll = Math.random();
        const attackBoost = next.live.tempo === "Hücum" ? 0.08 : next.live.tempo === "Defans" ? -0.03 : 0;

        if (eventRoll < 0.16 + attackBoost) {
          const scorer = attacker || random(lineupPlayers);
          const textOptions = [
            `${creator?.name || scorer.name} harika bir orta açtı, ${scorer.name} boşta kalan topa vurdu ve GOOOOOLLLL!`,
            `${scorer.name} kaleciyle karşı karşıya kaldı ve topu ağlara gönderdi.`,
            `${scorer.name} vurdu... ve GOOOOOLLLL!`,
          ];
          next.live = {
            ...next.live,
            score: { ...next.live.score, home: next.live.score.home + 1 },
            events: [{ minute: nextMinute, type: "goal", title: `${scorer.name} gol attı`, text: random(textOptions) }, ...next.live.events],
          };
        } else if (eventRoll < 0.24) {
          const booked = defender || random(lineupPlayers);
          next.players = next.players.map((p) => p.name === booked.name ? { ...p, booked: true } : p);
          next.live = {
            ...next.live,
            events: [{ minute: nextMinute, type: "yellow", title: `${booked.name} sarı kart`, text: `${booked.name} sert müdahale sonrası sarı kart gördü.` }, ...next.live.events],
          };
        } else if (eventRoll < 0.28) {
          const injured = random(lineupPlayers.filter((p) => p.role !== "GK") || lineupPlayers);
          next.players = next.players.map((p) => p.name === injured.name ? { ...p, injured: true, condition: 0 } : p);
          next.live = {
            ...next.live,
            running: false,
            events: [{ minute: nextMinute, type: "injury", title: `${injured.name} sakatlandı`, text: `${injured.name} oyuna devam edemeyecek gibi görünüyor.` }, ...next.live.events],
          };
        } else if (eventRoll < 0.39) {
          const chanceText = [
            `${attacker?.name || creator?.name} şutunu gönderdi ama kaleci ${keeper.name} kontrol etti.`,
            `${creator?.name || attacker?.name} tehlikeli pozisyon hazırladı.`,
            `${defender?.name || keeper.name} savunmada kritik müdahale yaptı.`,
          ];
          next.live = {
            ...next.live,
            events: [{ minute: nextMinute, type: "normal", title: "Pozisyon", text: random(chanceText) }, ...next.live.events],
          };
        }

        if (nextMinute >= 90) {
          const home = next.live.score.home;
          const away = next.live.score.away;
          const result = home > away ? "W" : home === away ? "D" : "L";
          const prize = result === "W" ? 220 + next.cup.current * 45 : result === "D" ? 110 : 40;
          const moraleShift = result === "W" ? 4 : result === "D" ? 1 : -3;
          const fanShift = result === "W" ? 42 : result === "D" ? 14 : -7;
          const cup = {
            ...next.cup,
            current: next.cup.current + 1,
            w: next.cup.w + (result === "W" ? 1 : 0),
            d: next.cup.d + (result === "D" ? 1 : 0),
            l: next.cup.l + (result === "L" ? 1 : 0),
            gf: next.cup.gf + home,
            ga: next.cup.ga + away,
          };
          let bonus = 0;
          if (cup.current >= cup.total) {
            cup.done = true;
            bonus = 1500 + cup.w * 250;
          }

          next = {
            ...next,
            cash: next.cash + prize + bonus,
            morale: clamp(next.morale + moraleShift, 30, 95),
            fans: Math.max(50, next.fans + fanShift),
            cup,
            lastMatch: { opponent: next.live.opponent, gf: home, ga: away, result, prize: prize + bonus },
            log: [`Canlı maç bitti: ${home}-${away}`, ...next.log].slice(0, 5),
            live: {
              ...next.live,
              running: false,
              finished: true,
              minute: 90,
              resultSummary: { home, away, result },
              events: [{ minute: 90, type: "normal", title: "Maç bitti", text: `${next.club} ${home}-${away} ${next.live.opponent}` }, ...next.live.events],
            },
          };
        }

        return next;
      });
    }, delay);

    return () => clearInterval(timerRef.current);
  }, [game.live.running, game.live.speed]);

  const team = useMemo(() => calcTeam(game.players, game.eq, game.morale), [game.players, game.eq, game.morale]);
  const stars = useMemo(() => calcStars(team), [team]);
  const eq = EQUIPMENT[game.eq];
  const nextEq = EQUIPMENT[game.eq + 1] || null;
  const palette = CLUB_PALETTES[game.identity.paletteIndex] || CLUB_PALETTES[0];
  const countdown = formatCountdown(game.market.nextRefreshAt - marketNow);
  const filteredMarketPlayers = game.market.players.filter((p) => game.market.filter === "ALL" || p.role === game.market.filter);

  useEffect(() => {
    const open = SPONSORS.find((s) => stars >= s.minStars && !game.sponsorsTaken.includes(s.id) && game.pendingSponsor !== s.id);
    if (open) setGame((g) => ({ ...g, pendingSponsor: open.id }));
  }, [stars]);

  const sponsor = SPONSORS.find((s) => s.id === game.pendingSponsor) || null;

  const playMatch = () => {
    if (!game.started || game.cup.done) return;
    setGame((g) => simulate(g));
  };

  const openLiveMatch = () => {
    if (!game.started || game.cup.done) return;
    const opponent = OPPONENTS[game.cup.current] || `Rakip ${game.cup.current + 1}`;

    const used = new Set();
    const finalLineup = [];
    FORMATION.forEach((role) => {
      const pick = [...game.players]
        .filter((p) => !used.has(p.name))
        .sort((a, b) => {
          const roleBonusA = a.role === role || (role === "CB" && ["CB", "DF"].includes(a.role)) ? 10 : 0;
          const roleBonusB = b.role === role || (role === "CB" && ["CB", "DF"].includes(b.role)) ? 10 : 0;
          return (b.overall + b.condition * 0.3 + roleBonusB) - (a.overall + a.condition * 0.3 + roleBonusA);
        })[0];
      if (pick) {
        used.add(pick.name);
        finalLineup.push(pick.name);
      }
    });

    const benchIds = game.players.filter((p) => !used.has(p.name)).slice(0, BENCH_SIZE).map((p) => p.name);

    setGame((g) => ({
      ...g,
      live: {
        ...g.live,
        screen: true,
        minute: 0,
        score: { home: 0, away: 0 },
        running: false,
        speed: 1,
        tempo: "Dengeli",
        events: [{ minute: 0, type: "normal", title: "Maç merkezi hazır", text: `${g.club} - ${opponent} karşılaşması başlamak üzere.` }],
        lineupIds: finalLineup,
        benchIds,
        selectedOut: "",
        selectedIn: "",
        subsUsed: 0,
        opponent,
        finished: false,
        resultSummary: null,
      },
    }));
  };

  const closeLiveMatch = () => {
    setGame((g) => ({ ...g, live: { ...g.live, screen: false, running: false } }));
  };

  const autoBestLineup = () => {
    setGame((g) => {
      const used = new Set();
      const finalLineup = [];
      FORMATION.forEach((role) => {
        const pick = [...g.players]
          .filter((p) => !used.has(p.name) && !p.injured)
          .sort((a, b) => {
            const roleBonusA = a.role === role || (role === "CB" && ["CB", "DF"].includes(a.role)) ? 10 : 0;
            const roleBonusB = b.role === role || (role === "CB" && ["CB", "DF"].includes(b.role)) ? 10 : 0;
            return (b.overall + b.condition * 0.35 + roleBonusB) - (a.overall + a.condition * 0.35 + roleBonusA);
          })[0];
        if (pick) {
          used.add(pick.name);
          finalLineup.push(pick.name);
        }
      });
      const benchIds = g.players.filter((p) => !used.has(p.name) && !p.injured).slice(0, BENCH_SIZE).map((p) => p.name);
      return {
        ...g,
        live: {
          ...g.live,
          lineupIds: finalLineup,
          benchIds,
          events: [{ minute: g.live.minute, type: "sub", title: "Otomatik kadro", text: "En iyi ve kondisyonu yüksek oyuncular ilk 11'e alındı." }, ...g.live.events],
        },
      };
    });
  };

  const doSub = () => {
    setGame((g) => {
      if (!g.live.selectedOut || !g.live.selectedIn || g.live.subsUsed >= MAX_SUBS) return g;
      const lineupIds = g.live.lineupIds.map((name) => name === g.live.selectedOut ? g.live.selectedIn : name);
      const benchIds = g.live.benchIds.map((name) => name === g.live.selectedIn ? g.live.selectedOut : name);
      return {
        ...g,
        live: {
          ...g.live,
          lineupIds,
          benchIds,
          subsUsed: g.live.subsUsed + 1,
          selectedOut: "",
          selectedIn: "",
          events: [{ minute: g.live.minute, type: "sub", title: "Oyuncu değişikliği", text: `${g.live.selectedOut} çıktı, ${g.live.selectedIn} girdi.` }, ...g.live.events],
        },
      };
    });
  };

  const buyMarketPlayer = (player) => {
    setGame((g) => {
      if (g.cash < player.price) return g;
      if (g.players.find((p) => p.name === player.name)) return g;
      return {
        ...g,
        cash: g.cash - player.price,
        players: [...g.players, { ...player }],
        market: {
          ...g.market,
          players: g.market.players.filter((p) => p.id !== player.id),
          boughtToday: g.market.boughtToday + 1,
        },
        log: [`${player.name} transfer edildi. Eski kulüp: ${player.clubName}.`, ...g.log].slice(0, 5),
      };
    });
  };

  if (showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

  if (game.live.screen) {
    const lineupPlayers = game.live.lineupIds.map((id) => game.players.find((p) => p.name === id)).filter(Boolean);
    const benchPlayers = game.live.benchIds.map((id) => game.players.find((p) => p.name === id)).filter(Boolean);

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl p-4 md:p-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-3xl border border-white/10 bg-[#101010] p-6 text-white shadow-2xl shadow-white/5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Canlı Maç Merkezi</p>
                <h1 className="text-3xl font-black md:text-5xl">{game.club}</h1>
                <p className="mt-2 text-slate-400">Rakip: <span className="font-semibold text-white">{game.live.opponent}</span></p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">Dakika</div>
                <div className="text-4xl font-black">{game.live.minute}'</div>
                <div className="mt-2 text-3xl font-black">{game.live.score.home} - {game.live.score.away}</div>
              </div>
            </div>
          </motion.div>

          <div className="mb-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <PremiumCard title="Maç Kontrolleri">
              <div className="mb-4 flex flex-wrap gap-2">
                <PremiumButton onClick={() => setGame((g) => ({ ...g, live: { ...g.live, running: true } }))}>Başlat</PremiumButton>
                <PremiumButton onClick={() => setGame((g) => ({ ...g, live: { ...g.live, running: false } }))} className="from-rose-600 to-rose-500">Durdur</PremiumButton>
                <PremiumButton onClick={closeLiveMatch} className="from-slate-700 to-slate-600">Geri Dön</PremiumButton>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {[1, 2, 4].map((s) => (
                  <button key={s} onClick={() => setGame((g) => ({ ...g, live: { ...g.live, speed: s } }))} className={`rounded-2xl px-4 py-2 font-semibold ${game.live.speed === s ? "bg-white text-black" : "bg-slate-900 text-white"}`}>{s}x</button>
                ))}
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {[{ key: "Defans", icon: "D" }, { key: "Dengeli", icon: "M" }, { key: "Hücum", icon: "A" }].map((t) => (
                  <button key={t.key} onClick={() => setGame((g) => ({ ...g, live: { ...g.live, tempo: t.key } }))} className={`rounded-2xl px-4 py-2 font-semibold ${game.live.tempo === t.key ? "bg-blue-600 text-white" : "bg-slate-900 text-white"}`}>{t.icon} {t.key}</button>
                ))}
              </div>

              <div className="rounded-3xl bg-[#181818] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold">Canlı Olaylar</h3>
                  <span className="text-sm text-slate-500">Yeni olay en üstte</span>
                </div>
                <div className="max-h-[480px] space-y-3 overflow-auto pr-1">
                  {game.live.events.map((e, i) => <EventCard key={`${e.minute}-${i}-${e.title}`} e={e} top={i === 0} />)}
                </div>
              </div>
            </PremiumCard>

            <div className="space-y-4">
              <PremiumCard title="Maç Öncesi Kadro" right={<PremiumButton onClick={autoBestLineup} className="px-4 py-2 text-sm from-emerald-500 to-emerald-400 text-black">En İyi Kadroyu Kur</PremiumButton>}>
                <div className="space-y-3">
                  {lineupPlayers.map((p, idx) => (
                    <div key={p.name} className="rounded-2xl border border-white/10 bg-[#181818] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold">{FORMATION[idx]} - {p.name}</div>
                          <RatingChip player={p} />
                        </div>
                        <div className="text-right text-xs">
                          {p.booked && <div className="rounded-full bg-yellow-400 px-2 py-1 font-bold text-slate-950">YC</div>}
                          {p.injured && <div className="mt-1 rounded-full bg-rose-500 px-2 py-1 font-bold text-white">INJ</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </PremiumCard>

              <PremiumCard title="Yedek Kulübesi">
                <div className="space-y-3">
                  {benchPlayers.map((p) => (
                    <div key={p.name} className="rounded-2xl border border-white/10 bg-[#181818] p-3">
                      <div className="font-bold">{p.name}</div>
                      <RatingChip player={p} />
                    </div>
                  ))}
                </div>
              </PremiumCard>

              <PremiumCard title="Oyuncu Değişikliği" subtitle={`Kullanılan değişiklik: ${game.live.subsUsed} / ${MAX_SUBS}`}>
                <div className="space-y-3">
                  <select value={game.live.selectedOut} onChange={(e) => setGame((g) => ({ ...g, live: { ...g.live, selectedOut: e.target.value } }))} className="w-full rounded-2xl border border-white/10 bg-[#181818] px-4 py-3 text-white outline-none">
                    <option value="">Çıkacak oyuncu</option>
                    {lineupPlayers.map((p, idx) => <option key={p.name} value={p.name}>{FORMATION[idx]} - {p.name}</option>)}
                  </select>
                  <select value={game.live.selectedIn} onChange={(e) => setGame((g) => ({ ...g, live: { ...g.live, selectedIn: e.target.value } }))} className="w-full rounded-2xl border border-white/10 bg-[#181818] px-4 py-3 text-white outline-none">
                    <option value="">Girecek oyuncu</option>
                    {benchPlayers.map((p) => <option key={p.name} value={p.name}>{p.role} - {p.name}</option>)}
                  </select>
                  <PremiumButton onClick={doSub} disabled={game.live.subsUsed >= MAX_SUBS} className="w-full">Değişikliği Yap</PremiumButton>
                </div>
              </PremiumCard>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#090909] to-[#111827] p-6 text-white shadow-2xl shadow-white/5">
          <div className="mb-4 flex flex-col items-center justify-center gap-4 text-center">
            <LogoMark identity={game.identity} clubName={game.club} size={120} />
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.5em] text-slate-400">EL TURCO L.M. PRODUCTION</p>
              <h1 className="text-3xl font-black text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.25)] md:text-5xl">{game.club}</h1>
              <p className="mt-2 text-slate-300">Menajer: <span className="font-semibold text-white">{game.manager}</span></p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm">Bakiye: <span className="font-bold">{money(game.cash)}</span></div>
            <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm">Taraftar: <span className="font-bold">{game.fans}</span></div>
            <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm">Moral: <span className="font-bold">{game.morale}</span></div>
            <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm">Takım Yıldızı: <span className="font-bold">{stars.toFixed(1)}</span></div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <PremiumButton onClick={() => setGame((g) => ({ ...g, started: true }))} className="w-full from-white to-slate-300 text-black">{game.started ? "Kulüp Aktif" : "Kulübü Başlat"}</PremiumButton>
            <PremiumButton onClick={playMatch} className="w-full from-emerald-500 to-emerald-400 text-black">Maç Simüle Et</PremiumButton>
            <PremiumButton onClick={openLiveMatch} className="w-full">Canlı Maça Gir</PremiumButton>
            <PremiumButton onClick={() => setGame(freshState())} className="w-full from-rose-600 to-rose-500">Sıfırla</PremiumButton>
          </div>
        </motion.div>

        {!game.started && (
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <PremiumCard title="Kulüp Kurulumu">
              <label className="mb-2 block text-sm font-medium text-slate-400">Menajer Adı</label>
              <input value={game.manager} onChange={(e) => setGame((g) => ({ ...g, manager: e.target.value }))} className="mb-4 w-full rounded-2xl border border-white/10 bg-[#181818] px-4 py-3 text-white outline-none" />
              <label className="mb-2 block text-sm font-medium text-slate-400">Kulüp Adı</label>
              <input value={game.club} onChange={(e) => setGame((g) => ({ ...g, club: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-[#181818] px-4 py-3 text-white outline-none" />
            </PremiumCard>
            <PremiumCard title="Bu sürümde neler var?">
              <div className="space-y-2 text-sm text-slate-300">
                <div>• 10 maçlık başlangıç kupası</div>
                <div>• Premium ana ekran</div>
                <div>• Kulüp kimliği stüdyosu</div>
                <div>• Kişisel transfer marketi</div>
                <div>• Canlı maç ekranı</div>
              </div>
            </PremiumCard>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.85fr_1fr]">
          <div className="space-y-6">
            <PremiumCard title="Takım Gücü" right={<span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">{stars.toFixed(1)} yıldız</span>}>
              <div className="grid gap-4 md:grid-cols-2">
                <Bar label="Hız" value={team.speed} />
                <Bar label="Güç" value={team.power} />
                <Bar label="Kondisyon" value={team.stamina} />
                <Bar label="Teknik" value={team.technique} />
              </div>
            </PremiumCard>

            <PremiumCard title="Oyuncu Kartları" subtitle={`${game.players.length} oyuncu`}>
              <div className="grid gap-4 md:grid-cols-2">
                {game.players.map((p) => (
                  <div key={p.name} className="rounded-3xl border border-white/10 bg-[#181818] p-4 shadow-[0_0_12px_rgba(255,255,255,0.03)]">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white">{p.name}</h3>
                        <RatingChip player={p} />
                      </div>
                      <span className={`h-4 w-4 rounded-full ${eq.dot}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                      <div>Hız: <span className="font-semibold text-white">{p.speed}</span></div>
                      <div>Güç: <span className="font-semibold text-white">{p.power}</span></div>
                      <div>Kondisyon: <span className="font-semibold text-white">{Math.round(p.condition)}</span></div>
                      <div>Teknik: <span className="font-semibold text-white">{p.technique}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </PremiumCard>

            <PremiumCard title="Başlangıç Kupası" subtitle={`Maç ${Math.min(game.cup.current + 1, game.cup.total)} / ${game.cup.total}`}>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-[#181818] p-4"><div className="text-sm text-slate-500">G</div><div className="text-2xl font-black">{game.cup.w}</div></div>
                <div className="rounded-2xl bg-[#181818] p-4"><div className="text-sm text-slate-500">B</div><div className="text-2xl font-black">{game.cup.d}</div></div>
                <div className="rounded-2xl bg-[#181818] p-4"><div className="text-sm text-slate-500">M</div><div className="text-2xl font-black">{game.cup.l}</div></div>
                <div className="rounded-2xl bg-[#181818] p-4"><div className="text-sm text-slate-500">Averaj</div><div className="text-2xl font-black">{game.cup.gf}-{game.cup.ga}</div></div>
              </div>
            </PremiumCard>

            <PremiumCard title="Transfer Market" subtitle={`Yeni oyuncular: ${countdown}`} right={<span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">Kişisel Market</span>}>
              <div className="mb-4 flex flex-wrap gap-2">
                {MARKET_ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => setGame((g) => ({ ...g, market: { ...g.market, filter: role } }))}
                    className={`rounded-full px-3 py-2 text-sm font-semibold ${game.market.filter === role ? "bg-white text-black" : "bg-[#181818] text-white"}`}
                  >
                    {roleShort(role)}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredMarketPlayers.length === 0 ? (
                  <div className="rounded-2xl bg-[#181818] p-4 text-sm text-slate-400">Bu filtre için oyuncu yok.</div>
                ) : (
                  filteredMarketPlayers.map((player, index) => (
                    <div key={player.id} className={`rounded-3xl border bg-[#181818] p-4 ${rarityStyle(player.overall)}`}>
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-[0.25em] text-slate-500">#{index + 1} • {player.clubName}</div>
                          <h3 className="mt-1 text-lg font-bold text-white">{player.name}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                            <span>{player.role}</span>
                            <span>•</span>
                            <span>{player.age} yaş</span>
                            <span>•</span>
                            <span>OVR {player.overall}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-400">Bonservis</div>
                          <div className="text-xl font-black text-white">{money(player.price)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                        <Bar label="Hız" value={player.speed} />
                        <Bar label="Güç" value={player.power} />
                        <Bar label="Kondisyon" value={player.stamina} />
                        <Bar label="Teknik" value={player.technique} />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                          {player.abilities?.map((a) => (
                            <span key={a.name} className="rounded-full bg-slate-800 px-2 py-1">{a.icon} {a.name}</span>
                          ))}
                        </div>
                        <PremiumButton onClick={() => buyMarketPlayer(player)} className="from-emerald-500 to-emerald-400 text-black">Satın Al</PremiumButton>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PremiumCard>
          </div>

          <div className="space-y-6">
            <PremiumCard title="Kulüp Kimliği" subtitle="Görev 8 — Logo sistemi">
              <div className="mb-5 flex justify-center">
                <LogoMark identity={game.identity} clubName={game.club} size={150} />
              </div>

              <label className="mb-2 block text-sm font-medium text-slate-400">Kısa Ad</label>
              <input
                value={game.identity.shortName}
                onChange={(e) => setGame((g) => ({ ...g, identity: { ...g.identity, shortName: e.target.value.slice(0, 3).toUpperCase() } }))}
                className="mb-4 w-full rounded-2xl border border-white/10 bg-[#181818] px-4 py-3 text-white outline-none"
              />

              <div className="mb-4">
                <div className="mb-2 text-sm font-medium text-slate-400">Şekil</div>
                <div className="grid grid-cols-2 gap-2">
                  {LOGO_SHAPES.map((shape) => (
                    <button key={shape} onClick={() => setGame((g) => ({ ...g, identity: { ...g.identity, shape } }))} className={`rounded-2xl px-3 py-3 text-sm font-semibold ${game.identity.shape === shape ? "bg-white text-black" : "bg-[#181818] text-white"}`}>{shape}</button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-2 text-sm font-medium text-slate-400">Sembol</div>
                <div className="grid grid-cols-2 gap-2">
                  {LOGO_SYMBOLS.map((symbol) => (
                    <button key={symbol} onClick={() => setGame((g) => ({ ...g, identity: { ...g.identity, symbol } }))} className={`rounded-2xl px-3 py-3 text-sm font-semibold ${game.identity.symbol === symbol ? "bg-white text-black" : "bg-[#181818] text-white"}`}>{symbol}</button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium text-slate-400">Renk Paketi</div>
                <div className="space-y-2">
                  {CLUB_PALETTES.map((item, idx) => (
                    <button key={item.name} onClick={() => setGame((g) => ({ ...g, identity: { ...g.identity, paletteIndex: idx } }))} className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold ${game.identity.paletteIndex === idx ? "bg-white text-black" : "bg-[#181818] text-white"}`}>
                      <span>{item.name}</span>
                      <span className="flex gap-2">
                        <span className="h-4 w-4 rounded-full" style={{ background: item.bg }} />
                        <span className="h-4 w-4 rounded-full" style={{ background: item.primary }} />
                        <span className="h-4 w-4 rounded-full" style={{ background: item.accent }} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </PremiumCard>

            <PremiumCard title="Ekipman Seviyesi" subtitle={eq.name} right={<span className={`h-4 w-4 rounded-full ${eq.dot}`} />}>
              <div className="space-y-2 text-sm text-slate-300">
                <div>Hız: <span className="font-semibold text-white">{eq.bonus.speed >= 0 ? "+" : ""}{eq.bonus.speed}</span></div>
                <div>Güç: <span className="font-semibold text-white">{eq.bonus.power >= 0 ? "+" : ""}{eq.bonus.power}</span></div>
                <div>Kondisyon: <span className="font-semibold text-white">{eq.bonus.stamina >= 0 ? "+" : ""}{eq.bonus.stamina}</span></div>
                <div>Teknik: <span className="font-semibold text-white">{eq.bonus.technique >= 0 ? "+" : ""}{eq.bonus.technique}</span></div>
              </div>
              {nextEq ? (
                <PremiumButton onClick={() => {
                  if (game.cash < nextEq.price) return;
                  setGame((g) => ({
                    ...g,
                    cash: g.cash - nextEq.price,
                    eq: g.eq + 1,
                    log: [`${nextEq.name} seviyesine geçildi.`, ...g.log].slice(0, 5),
                  }));
                }} className="mt-5 w-full from-violet-600 to-violet-500">
                  {nextEq.name} al ({money(nextEq.price)})
                </PremiumButton>
              ) : (
                <div className="mt-5 rounded-2xl bg-yellow-500/10 p-4 text-sm text-yellow-300">En yüksek seviyeye ulaşıldı.</div>
              )}
            </PremiumCard>

            <PremiumCard title="Store" subtitle={`Gelir: ${money(game.storeRevenue)}`}>
              <div className="space-y-3">
                {STORE.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-[#181818] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-sm text-slate-500">Stok: {game.stock[item.id]}</div>
                    </div>
                    <button onClick={() => {
                      if (game.cash < item.buy) return;
                      setGame((g) => ({ ...g, cash: g.cash - item.buy, stock: { ...g.stock, [item.id]: g.stock[item.id] + 1 } }));
                    }} className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white">1 adet stokla ({money(item.buy)})</button>
                  </div>
                ))}
              </div>
              <PremiumButton onClick={() => {
                let sold = 0;
                let income = 0;
                const newStock = { ...game.stock };
                STORE.forEach((item) => {
                  const have = newStock[item.id];
                  if (!have) return;
                  const qty = Math.min(have, Math.floor(Math.random() * item.demand));
                  newStock[item.id] -= qty;
                  sold += qty;
                  income += qty * item.buy;
                });
                setGame((g) => ({
                  ...g,
                  stock: newStock,
                  cash: g.cash + income,
                  fans: g.fans + Math.min(20, Math.floor(sold / 2)),
                  storeRevenue: g.storeRevenue + income,
                  log: [sold ? `Store ${sold} ürün sattı. Gelir ${money(income)}.` : "Store bugün satış yapamadı.", ...g.log].slice(0, 5),
                }));
              }} className="mt-4 w-full from-emerald-500 to-emerald-400 text-black">Günlük satış yap</PremiumButton>
            </PremiumCard>
          </div>

          <div className="space-y-6">
            {sponsor && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <PremiumCard title="Yeni Sponsor Teklifi" className="ring-2 ring-emerald-400/50">
                  <div className="font-semibold text-white">{sponsor.company}</div>
                  <div className="mb-3 text-sm text-slate-400">{sponsor.title}</div>
                  <div className="mb-4 rounded-2xl bg-[#181818] p-4 text-lg font-black text-white">{money(sponsor.amount)}</div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <PremiumButton onClick={() => setGame((g) => ({
                      ...g,
                      cash: g.cash + sponsor.amount,
                      pendingSponsor: null,
                      sponsorsTaken: [...g.sponsorsTaken, sponsor.id],
                      log: [`${sponsor.company} ile anlaşma yapıldı. +${money(sponsor.amount)}`, ...g.log].slice(0, 5),
                    }))}>Kabul Et</PremiumButton>
                    <PremiumButton onClick={() => setGame((g) => ({ ...g, pendingSponsor: null, log: [`${sponsor.company} teklifi reddedildi.`, ...g.log].slice(0, 5) }))} className="from-slate-700 to-slate-600">Reddet</PremiumButton>
                  </div>
                </PremiumCard>
              </motion.div>
            )}

            <PremiumCard title="Son Maç">
              {game.lastMatch ? (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-[#181818] p-4">
                    <div className="text-sm text-slate-500">Rakip</div>
                    <div className="text-lg font-bold text-white">{game.lastMatch.opponent}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-[#181818] p-4"><div className="text-sm text-slate-500">Sen</div><div className="text-2xl font-black">{game.lastMatch.gf}</div></div>
                    <div className="rounded-2xl bg-[#181818] p-4"><div className="text-sm text-slate-500">Skor</div><div className="text-2xl font-black">{game.lastMatch.result}</div></div>
                    <div className="rounded-2xl bg-[#181818] p-4"><div className="text-sm text-slate-500">Rakip</div><div className="text-2xl font-black">{game.lastMatch.ga}</div></div>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-300">Maç geliri: {money(game.lastMatch.prize)}</div>
                </div>
              ) : (
                <div className="rounded-2xl bg-[#181818] p-4 text-sm text-slate-400">Henüz maç oynanmadı.</div>
              )}
            </PremiumCard>

            <PremiumCard title="Maç Anlatımı">
              <div className="space-y-3">
                {game.log.map((line, i) => <div key={i} className="rounded-2xl bg-[#181818] p-3 text-sm text-slate-300">{line}</div>)}
              </div>
            </PremiumCard>
          </div>
        </div>
      </div>
    </div>
  );
}
