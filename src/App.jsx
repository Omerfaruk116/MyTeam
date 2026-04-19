import React, { useEffect, useMemo, useRef, useState } from "react";
import IntroScreen from "./IntroScreen";
import BottomNav from "./components/BottomNav";
import HomeScreen from "./screens/HomeScreen";
import SquadScreen from "./screens/SquadScreen";
import MatchScreen from "./screens/MatchScreen";
import StoreScreen from "./screens/StoreScreen";
import ClubScreen from "./screens/ClubScreen";

const EQUIPMENT = [
  { id: 0, name: "Eski Krampon", price: 0, bonus: { speed: 0, power: 0, stamina: 0, technique: 0 } },
  { id: 1, name: "Temel Krampon", price: 250, bonus: { speed: 1, power: 1, stamina: 0, technique: 1 } },
  { id: 2, name: "Lig Kramponu", price: 700, bonus: { speed: 2, power: 2, stamina: 1, technique: 2 } },
  { id: 3, name: "Pro Krampon", price: 1400, bonus: { speed: 3, power: 3, stamina: 2, technique: 3 } },
  { id: 4, name: "Elite Krampon", price: 2600, bonus: { speed: 4, power: 4, stamina: 3, technique: 4 } },
];

const SPONSORS = [
  { id: "local", minStars: 2.2, company: "Mahalle Market", title: "Yerel Sponsor", amount: 1200 },
  { id: "kit", minStars: 2.8, company: "North Stripe", title: "Forma Sponsorluğu", amount: 3500 },
  { id: "tv", minStars: 3.4, company: "Prime Sports TV", title: "Yayın Anlaşması", amount: 12000 },
];

const FAN_STORE_ITEMS = [
  { id: "scarf", name: "Kulüp Atkısı", stockCost: 10, sellPrice: 16, demand: 4 },
  { id: "shirt", name: "Kulüp Forması", stockCost: 22, sellPrice: 35, demand: 2 },
  { id: "cap", name: "Kulüp Şapkası", stockCost: 14, sellPrice: 22, demand: 3 },
];

const CASH_SHOP = {
  gems: [
    { id: "g10", title: "10 Elmas", priceLabel: "$0.99", gems: 10, featured: true },
    { id: "g50", title: "50 Elmas", priceLabel: "$4.50", gems: 50, featured: false },
  ],
  elTurco: [
    { id: "et1", title: "İlk El Turco Oyuncusu", priceLabel: "$0.99", featured: true },
    { id: "et2", title: "El Turco Premium Oyuncusu", priceLabel: "$9.00", featured: false },
  ],
};

const OPPONENTS = [
  "Sanayi Spor",
  "Belediye FK",
  "Liman FK",
  "Çay Spor",
  "Terminal Spor",
  "Fabrika Gücü",
  "Anadolu Ateşi",
  "Demirspor Anadolu",
  "Gençlik SK",
  "Marmara Birlik",
];

const FORMATION = ["GK", "LB", "CB", "CB", "SB", "CM", "CM", "CAM", "LW", "ST", "RW"];
const BENCH_SIZE = 7;
const MAX_SUBS = 3;

const FIRST_NAMES = [
  "Emir", "Yasin", "Kaan", "Mert", "Burak", "Selim", "Hakan", "Tuna", "Efe", "Kerem", "Arda", "Yusuf", "Musa",
  "Leo", "Chris", "Miran", "Bora", "Remzi"
];
const LAST_NAMES = [
  "Kaya", "Demir", "Aydın", "Kaplan", "Çelik", "Öztürk", "Şahin", "Aslan", "Yıldız", "Koç", "Keskin", "Durmaz"
];

const money = (n) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function calcOverall(p) {
  return Math.round((p.speed + p.power + p.stamina + p.technique) / 4);
}

function roleBase(role) {
  switch (role) {
    case "GK":
      return { speed: rand(33, 39), power: rand(36, 43), stamina: rand(34, 40), technique: rand(34, 41) };
    case "CB":
    case "DF":
      return { speed: rand(34, 40), power: rand(38, 45), stamina: rand(36, 42), technique: rand(33, 39) };
    case "LB":
    case "SB":
      return { speed: rand(36, 43), power: rand(35, 42), stamina: rand(37, 44), technique: rand(34, 40) };
    case "CM":
      return { speed: rand(35, 41), power: rand(35, 41), stamina: rand(37, 44), technique: rand(36, 43) };
    case "CAM":
      return { speed: rand(37, 43), power: rand(34, 40), stamina: rand(35, 42), technique: rand(38, 45) };
    case "LW":
    case "RW":
      return { speed: rand(38, 45), power: rand(34, 40), stamina: rand(35, 42), technique: rand(37, 44) };
    case "ST":
      return { speed: rand(37, 44), power: rand(37, 45), stamina: rand(35, 41), technique: rand(37, 44) };
    default:
      return { speed: rand(35, 41), power: rand(35, 41), stamina: rand(35, 41), technique: rand(35, 41) };
  }
}

function createRandomPlayer(role, usedNumbers) {
  const base = roleBase(role);
  let number = rand(2, 99);
  while (usedNumbers.has(number)) number = rand(2, 99);
  usedNumbers.add(number);

  const player = {
    name: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
    role,
    age: rand(18, 31),
    number,
    speed: base.speed,
    power: base.power,
    stamina: base.stamina,
    technique: base.technique,
    condition: 100,
    booked: false,
    injured: false,
    sentOff: false,
    abilities: [],
    xp: { speed: 0, power: 0, stamina: 0, technique: 0 },
  };

  player.overall = calcOverall(player);
  return player;
}

function createStartingPlayers() {
  const usedNumbers = new Set();
  const roles = ["GK", "LB", "CB", "CB", "SB", "CM", "CM", "CAM", "LW", "RW", "GK", "CB", "DF", "CM", "CAM", "LW", "RW"];
  const players = roles.map((role) => createRandomPlayer(role, usedNumbers));

  usedNumbers.add(55);
  const omer = {
    name: "Ömer Faruk BÜYÜK",
    role: "ST",
    age: 23,
    number: 55,
    speed: 44,
    power: 45,
    stamina: 41,
    technique: 43,
    condition: 100,
    booked: false,
    injured: false,
    sentOff: false,
    abilities: [{ icon: "⚔️", name: "Golcü" }],
    xp: { speed: 0, power: 0, stamina: 0, technique: 0 },
  };
  omer.overall = calcOverall(omer);

  players.push(omer);
  return players;
}

function buildBestXI(players) {
  const used = new Set();
  const lineup = [];

  FORMATION.forEach((role) => {
    const pick = [...players]
      .filter((p) => !used.has(p.number) && !p.injured && !p.sentOff)
      .sort((a, b) => {
        const roleBonusA = a.role === role || (role === "CB" && ["CB", "DF"].includes(a.role)) ? 8 : 0;
        const roleBonusB = b.role === role || (role === "CB" && ["CB", "DF"].includes(b.role)) ? 8 : 0;
        return b.overall + roleBonusB + b.condition * 0.1 - (a.overall + roleBonusA + a.condition * 0.1);
      })[0];

    if (pick) {
      used.add(pick.number);
      lineup.push(pick);
    }
  });

  const bench = players.filter((p) => !used.has(p.number) && !p.injured && !p.sentOff).slice(0, BENCH_SIZE);
  return { lineup, bench };
}

function calcTeam(lineup, eqIndex, morale) {
  const b = EQUIPMENT[eqIndex].bonus;
  const avgStat = (key) => Math.round(lineup.reduce((sum, p) => sum + p[key], 0) / Math.max(lineup.length, 1));

  const speed = clamp(avgStat("speed") + b.speed + Math.floor(morale * 0.03), 1, 99);
  const power = clamp(avgStat("power") + b.power + Math.floor(morale * 0.03), 1, 99);
  const stamina = clamp(avgStat("stamina") + b.stamina + Math.floor(morale * 0.03), 1, 99);
  const technique = clamp(avgStat("technique") + b.technique + Math.floor(morale * 0.03), 1, 99);
  const overall = Math.round((speed + power + stamina + technique) / 4);

  return { speed, power, stamina, technique, overall };
}

function calcStars(team) {
  return Math.round(clamp(team.overall / 18, 1, 5) * 10) / 10;
}

function applyXp(player, gains) {
  const updated = { ...player, xp: { ...player.xp } };
  const keys = ["speed", "power", "stamina", "technique"];

  keys.forEach((key) => {
    const add = gains[key] || 0;
    if (!add) return;
    updated.xp[key] += add;

    while (updated.xp[key] >= 1000) {
      updated.xp[key] -= 1000;
      updated[key] += 1;
    }
  });

  updated.overall = calcOverall(updated);
  return updated;
}

function addMatchXp(players, homeGoals, result) {
  return players.map((p) => {
    let gains = { speed: 0, power: 0, stamina: 0, technique: 0 };

    if (p.role === "ST") {
      gains.technique += homeGoals > 0 ? 240 : 70;
      gains.speed += 90;
      gains.power += 50;
      gains.stamina += 70;
    } else if (["LW", "RW", "CAM"].includes(p.role)) {
      gains.technique += homeGoals > 0 ? 160 : 60;
      gains.speed += 80;
      gains.stamina += 80;
      gains.power += 25;
    } else if (["CM"].includes(p.role)) {
      gains.technique += 80;
      gains.stamina += 90;
      gains.power += 35;
      gains.speed += 40;
    } else if (["LB", "SB", "CB", "DF"].includes(p.role)) {
      gains.power += result === "W" ? 110 : 70;
      gains.stamina += 70;
      gains.speed += 25;
      gains.technique += 20;
    } else if (p.role === "GK") {
      gains.power += 15;
      gains.stamina += 35;
      gains.technique += result !== "L" ? 80 : 40;
    }

    return applyXp(p, gains);
  });
}

function freshState() {
  const players = createStartingPlayers();
  return {
    manager: "Ömer",
    club: "El Turco FC",
    started: false,
    cash: 180,
    gems: 0,
    fans: 65,
    morale: 58,
    eq: 0,
    players,
    cup: { current: 0, total: 10, w: 0, d: 0, l: 0, gf: 0, ga: 0, done: false },
    lastMatch: null,
    log: ["Kulüp kuruldu.", "Lig 3'te ilk hedef: ayakta kalmak."],
    sponsorsTaken: [],
    pendingSponsor: null,
    stock: { scarf: 0, shirt: 0, cap: 0 },
    storeRevenue: 0,
    live: {
      prepared: false,
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
      injuriesThisMatch: 0,
      redsThisMatch: 0,
    },
  };
}

function sanitizeSave(raw) {
  const base = freshState();
  return {
    ...base,
    ...raw,
    stock: { ...base.stock, ...(raw?.stock || {}) },
    cup: { ...base.cup, ...(raw?.cup || {}) },
    live: { ...base.live, ...(raw?.live || {}) },
    players: Array.isArray(raw?.players) && raw.players.length ? raw.players : base.players,
    gems: typeof raw?.gems === "number" ? raw.gems : 0,
  };
}

function findByNumber(players, number) {
  return players.find((p) => p.number === number);
}

function chooseCardTarget(players) {
  const defenders = players.filter((p) => ["CB", "DF", "LB", "SB"].includes(p.role));
  const mids = players.filter((p) => ["CM", "CAM"].includes(p.role));
  const forwards = players.filter((p) => ["ST", "LW", "RW"].includes(p.role));

  const roll = Math.random();
  if (roll < 0.72 && defenders.length) return randomFrom(defenders);
  if (roll < 0.92 && mids.length) return randomFrom(mids);
  return forwards.length ? randomFrom(forwards) : randomFrom(players);
}

function simulateQuickMatch(state) {
  const { lineup } = buildBestXI(state.players);
  const team = calcTeam(lineup, state.eq, state.morale);
  const opponent = OPPONENTS[state.cup.current] || `Rakip ${state.cup.current + 1}`;
  const oppOverall = rand(37, 45) + Math.floor(state.cup.current * 0.2);
  const diff = team.overall - oppOverall + rand(-4, 4);

  let gf = 0;
  let ga = 0;

  if (diff >= 8) {
    gf = rand(1, 2);
    ga = rand(0, 1);
  } else if (diff >= 3) {
    gf = rand(0, 2);
    ga = rand(0, 1);
  } else if (diff >= -2) {
    gf = rand(0, 1);
    ga = rand(0, 1);
  } else {
    gf = rand(0, 1);
    ga = rand(1, 2);
  }

  const result = gf > ga ? "W" : gf === ga ? "D" : "L";
  const prize = result === "W" ? 70 : result === "D" ? 25 : 8;
  const moraleShift = result === "W" ? 3 : result === "D" ? 0 : -2;
  const fanShift = result === "W" ? 8 : result === "D" ? 2 : -3;

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
    bonus = 350;
  }

  const lines = [
    `${state.club}, ${opponent} karşısında sahaya çıktı.`,
    `Takım gücü ${team.overall}, rakip gücü ${oppOverall}.`,
    gf > ga ? "Maç planı tuttu." : gf === ga ? "Dengeli bir mücadele oldu." : "Rakip daha net oynadı.",
    `Skor: ${gf}-${ga}`,
  ];

  if (bonus) lines.push(`Başlangıç kupası tamamlandı. Ek ödül: ${money(bonus)}.`);

  const updatedPlayers = addMatchXp(
    state.players.map((p) => ({
      ...p,
      condition: clamp(p.condition - rand(3, 8), 60, 100),
      booked: false,
      injured: false,
      sentOff: false,
    })),
    gf,
    result
  );

  return {
    ...state,
    players: updatedPlayers,
    cash: state.cash + prize + bonus,
    morale: clamp(state.morale + moraleShift, 35, 95),
    fans: Math.max(30, state.fans + fanShift),
    cup,
    log: lines,
    lastMatch: { opponent, gf, ga, result, prize: prize + bonus },
  };
}

function createLivePackage(state) {
  const { lineup, bench } = buildBestXI(state.players);
  const opponent = OPPONENTS[state.cup.current] || `Rakip ${state.cup.current + 1}`;

  return {
    ...state.live,
    prepared: true,
    minute: 0,
    score: { home: 0, away: 0 },
    running: false,
    speed: 1,
    tempo: "Dengeli",
    events: [{ minute: 0, type: "normal", title: "Maç merkezi hazır", text: `${state.club} - ${opponent}` }],
    lineupIds: lineup.map((p) => p.number),
    benchIds: bench.map((p) => p.number),
    selectedOut: "",
    selectedIn: "",
    subsUsed: 0,
    opponent,
    finished: false,
    resultSummary: null,
    injuriesThisMatch: 0,
    redsThisMatch: 0,
  };
}

export default function App() {
  const [game, setGame] = useState(freshState());
  const [currentScreen, setCurrentScreen] = useState("home");
  const [showIntro, setShowIntro] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("elturco-mobile-save");
    if (saved) {
      try {
        setGame(sanitizeSave(JSON.parse(saved)));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("elturco-mobile-save", JSON.stringify(game));
  }, [game]);

  const { lineup: bestLineup, bench: bestBench } = useMemo(() => buildBestXI(game.players), [game.players]);
  const team = useMemo(() => calcTeam(bestLineup, game.eq, game.morale), [bestLineup, game.eq, game.morale]);
  const stars = useMemo(() => calcStars(team), [team]);
  const currentEq = EQUIPMENT[game.eq];
  const nextEq = EQUIPMENT[game.eq + 1] || null;
  const sponsor = SPONSORS.find((s) => s.id === game.pendingSponsor) || null;

  useEffect(() => {
    const open = SPONSORS.find(
      (s) => stars >= s.minStars && !game.sponsorsTaken.includes(s.id) && game.pendingSponsor !== s.id
    );
    if (open) {
      setGame((g) => ({ ...g, pendingSponsor: open.id }));
    }
  }, [stars]);

  useEffect(() => {
    if (!game.live.running) return;

    const delay = 900 / game.live.speed;

    timerRef.current = setInterval(() => {
      setGame((g) => {
        if (!g.live.running || g.live.finished) return g;

        const nextMinute = g.live.minute + 1;

        let next = {
          ...g,
          players: g.players.map((p) => {
            if (!g.live.lineupIds.includes(p.number)) return p;
            const drain = g.live.tempo === "Hücum" ? 1.2 : g.live.tempo === "Defans" ? 0.8 : 1.0;
            return { ...p, condition: clamp(p.condition - drain, 35, 100) };
          }),
          live: { ...g.live, minute: nextMinute },
        };

        const lineupPlayers = next.live.lineupIds.map((id) => findByNumber(next.players, id)).filter(Boolean);
        const benchPlayers = next.live.benchIds.map((id) => findByNumber(next.players, id)).filter(Boolean);

        const attackBoost = next.live.tempo === "Hücum" ? 0.006 : next.live.tempo === "Defans" ? -0.003 : 0;
        const homeGoalChance = 0.012 + attackBoost;
        const awayGoalChance = 0.010 + (next.live.tempo === "Hücum" ? 0.003 : 0);
        const yellowChance = 0.016;
        const redChance = next.live.redsThisMatch < 1 ? 0.002 : 0;
        const injuryChance = next.live.injuriesThisMatch < 1 ? 0.004 : 0;
        const infoChance = 0.05;

        const roll = Math.random();

        if (roll < homeGoalChance) {
          const scorerPool = lineupPlayers.filter((p) => ["ST", "LW", "RW", "CAM"].includes(p.role));
          const scorer = scorerPool.sort((a, b) => b.overall - a.overall)[0] || randomFrom(lineupPlayers);

          next.players = next.players.map((p) =>
            p.number === scorer.number
              ? applyXp(p, { technique: 260, speed: 60, stamina: 35, power: 50 })
              : p
          );

          next.live = {
            ...next.live,
            score: { ...next.live.score, home: next.live.score.home + 1 },
            events: [
              {
                minute: nextMinute,
                type: "goal",
                title: `${scorer.name} gol attı`,
                text: `${scorer.number} numaralı ${scorer.name} fileleri buldu.`,
              },
              ...next.live.events,
            ].slice(0, 8),
          };
        } else if (roll < homeGoalChance + awayGoalChance) {
          next.live = {
            ...next.live,
            score: { ...next.live.score, away: next.live.score.away + 1 },
            events: [
              {
                minute: nextMinute,
                type: "goal",
                title: `${next.live.opponent} gol attı`,
                text: `Rakip savunma arkasına sarktı ve golü buldu.`,
              },
              ...next.live.events,
            ].slice(0, 8),
          };
        } else if (roll < homeGoalChance + awayGoalChance + yellowChance) {
          const target = chooseCardTarget(lineupPlayers);
          if (target) {
            next.players = next.players.map((p) => (p.number === target.number ? { ...p, booked: true } : p));
            next.live = {
              ...next.live,
              events: [
                {
                  minute: nextMinute,
                  type: "yellow",
                  title: `${target.name} sarı kart`,
                  text: `${target.role} pozisyonundaki oyuncu sert müdahale yaptı.`,
                },
                ...next.live.events,
              ].slice(0, 8),
            };
          }
        } else if (roll < homeGoalChance + awayGoalChance + yellowChance + redChance) {
          const target = chooseCardTarget(lineupPlayers);
          if (target) {
            next.players = next.players.map((p) =>
              p.number === target.number ? { ...p, booked: false, sentOff: true, condition: 0 } : p
            );

            const lineupIds = next.live.lineupIds.filter((id) => id !== target.number);
            const benchIds = next.live.benchIds;

            next.live = {
              ...next.live,
              lineupIds,
              benchIds,
              redsThisMatch: next.live.redsThisMatch + 1,
              events: [
                {
                  minute: nextMinute,
                  type: "red",
                  title: `${target.name} kırmızı kart`,
                  text: `${target.role} oyuncusu oyun dışında kaldı.`,
                },
                ...next.live.events,
              ].slice(0, 8),
            };
          }
        } else if (roll < homeGoalChance + awayGoalChance + yellowChance + redChance + injuryChance) {
          const targetPool = lineupPlayers.filter((p) => p.role !== "GK");
          const injured = targetPool.length ? randomFrom(targetPool) : null;

          if (injured) {
            const replacement =
              benchPlayers.find((b) => b.role === injured.role) ||
              benchPlayers.sort((a, b) => b.overall - a.overall)[0];

            next.players = next.players.map((p) =>
              p.number === injured.number ? { ...p, injured: true, condition: 0 } : p
            );

            let events = [
              {
                minute: nextMinute,
                type: "injury",
                title: `${injured.name} sakatlandı`,
                text: `${injured.name} oyuna devam edemiyor.`,
              },
              ...next.live.events,
            ];

            let lineupIds = next.live.lineupIds;
            let benchIds = next.live.benchIds;
            let subsUsed = next.live.subsUsed;

            if (replacement && subsUsed < MAX_SUBS) {
              lineupIds = next.live.lineupIds.map((id) => (id === injured.number ? replacement.number : id));
              benchIds = next.live.benchIds.filter((id) => id !== replacement.number).concat(injured.number);
              subsUsed += 1;
              events = [
                {
                  minute: nextMinute,
                  type: "sub",
                  title: "Zorunlu değişiklik",
                  text: `${injured.name} çıktı, ${replacement.name} girdi.`,
                },
                ...events,
              ];
            }

            next.live = {
              ...next.live,
              lineupIds,
              benchIds,
              subsUsed,
              injuriesThisMatch: next.live.injuriesThisMatch + 1,
              events: events.slice(0, 8),
            };
          }
        } else if (roll < homeGoalChance + awayGoalChance + yellowChance + redChance + injuryChance + infoChance) {
          const infoTexts = [
            "Orta saha savaşı çok sert geçiyor.",
            "Maç dengede, iki takım da net pozisyon bulmakta zorlanıyor.",
            "Kanatlardan oyun kuruluyor.",
          ];

          next.live = {
            ...next.live,
            events: [
              { minute: nextMinute, type: "normal", title: "Maç akışı", text: randomFrom(infoTexts) },
              ...next.live.events,
            ].slice(0, 8),
          };
        }

        if (nextMinute >= 90) {
          const home = next.live.score.home;
          const away = next.live.score.away;
          const result = home > away ? "W" : home === away ? "D" : "L";
          const prize = result === "W" ? 70 : result === "D" ? 25 : 8;
          const moraleShift = result === "W" ? 3 : result === "D" ? 0 : -2;
          const fanShift = result === "W" ? 8 : result === "D" ? 2 : -3;

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
            bonus = 350;
          }

          next = {
            ...next,
            players: addMatchXp(
              next.players.map((p) => ({ ...p, booked: false, sentOff: false })),
              home,
              result
            ),
            cash: next.cash + prize + bonus,
            morale: clamp(next.morale + moraleShift, 35, 95),
            fans: Math.max(30, next.fans + fanShift),
            cup,
            lastMatch: { opponent: next.live.opponent, gf: home, ga: away, result, prize: prize + bonus },
            log: [`Canlı maç bitti: ${home}-${away}`, ...next.log].slice(0, 5),
            live: {
              ...next.live,
              running: false,
              finished: true,
              minute: 90,
              resultSummary: { home, away, result },
              events: [
                { minute: 90, type: "normal", title: "Maç bitti", text: `${next.club} ${home}-${away} ${next.live.opponent}` },
                ...next.live.events,
              ].slice(0, 8),
            },
          };
        }

        return next;
      });
    }, delay);

    return () => clearInterval(timerRef.current);
  }, [game.live.running, game.live.speed]);

  const prepareMatch = () => {
    if (!game.started || game.cup.done) return;
    setGame((g) => ({ ...g, live: createLivePackage(g) }));
    setCurrentScreen("match");
  };

  const startLiveMatch = () => {
    if (!game.started) return;
    setGame((g) => ({
      ...g,
      live: g.live.prepared ? { ...g.live, running: true } : { ...createLivePackage(g), running: true },
    }));
    setCurrentScreen("match");
  };

  const pauseLiveMatch = () => {
    setGame((g) => ({ ...g, live: { ...g.live, running: false } }));
  };

  const setLiveSpeed = (speed) => {
    setGame((g) => ({ ...g, live: { ...g.live, speed } }));
  };

  const setLiveTempo = (tempo) => {
    setGame((g) => ({ ...g, live: { ...g.live, tempo } }));
  };

  const setSelectedOut = (value) => {
    setGame((g) => ({ ...g, live: { ...g.live, selectedOut: value } }));
  };

  const setSelectedIn = (value) => {
    setGame((g) => ({ ...g, live: { ...g.live, selectedIn: value } }));
  };

  const doSub = () => {
    setGame((g) => {
      if (!g.live.selectedOut || !g.live.selectedIn || g.live.subsUsed >= MAX_SUBS) return g;

      const outNum = Number(g.live.selectedOut);
      const inNum = Number(g.live.selectedIn);

      const lineupIds = g.live.lineupIds.map((id) => (id === outNum ? inNum : id));
      const benchIds = g.live.benchIds.map((id) => (id === inNum ? outNum : id));

      const outPlayer = findByNumber(g.players, outNum);
      const inPlayer = findByNumber(g.players, inNum);

      return {
        ...g,
        live: {
          ...g.live,
          lineupIds,
          benchIds,
          subsUsed: g.live.subsUsed + 1,
          selectedOut: "",
          selectedIn: "",
          events: [
            {
              minute: g.live.minute,
              type: "sub",
              title: "Oyuncu değişikliği",
              text: `${outPlayer?.name || "Oyuncu"} çıktı, ${inPlayer?.name || "Oyuncu"} girdi.`,
            },
            ...g.live.events,
          ].slice(0, 8),
        },
      };
    });
  };

  const autoBestLineup = () => {
    setGame((g) => {
      const pkg = createLivePackage(g);
      return {
        ...g,
        live: {
          ...pkg,
          events: [
            { minute: g.live.minute, type: "sub", title: "Otomatik kadro", text: "En güçlü ilk 11 yeniden kuruldu." },
            ...pkg.events,
          ].slice(0, 8),
        },
      };
    });
  };

  const buyEquipment = (id) => {
    const eq = EQUIPMENT.find((e) => e.id === id);
    if (!eq || game.cash < eq.price || id <= game.eq) return;

    setGame((g) => ({
      ...g,
      cash: g.cash - eq.price,
      eq: id,
      log: [`${eq.name} alındı.`, ...g.log].slice(0, 5),
    }));
  };

  const buyFanStoreStock = (itemId) => {
    const item = FAN_STORE_ITEMS.find((s) => s.id === itemId);
    if (!item || game.cash < item.stockCost) return;

    setGame((g) => ({
      ...g,
      cash: g.cash - item.stockCost,
      stock: { ...g.stock, [itemId]: g.stock[itemId] + 1 },
    }));
  };

  const collectFanStoreRevenue = () => {
    let sold = 0;
    let income = 0;
    const newStock = { ...game.stock };

    FAN_STORE_ITEMS.forEach((item) => {
      const have = newStock[item.id];
      if (!have) return;
      const qty = Math.min(have, rand(0, item.demand));
      newStock[item.id] -= qty;
      sold += qty;
      income += qty * item.sellPrice;
    });

    setGame((g) => ({
      ...g,
      stock: newStock,
      cash: g.cash + income,
      fans: g.fans + Math.min(3, sold),
      storeRevenue: g.storeRevenue + income,
      log: [sold ? `Taraftar mağazası ${sold} ürün sattı. Gelir ${money(income)}.` : "Bugün taraftar mağazasında satış zayıftı.", ...g.log].slice(0, 5),
    }));
  };

  const acceptSponsor = () => {
    if (!sponsor) return;
    setGame((g) => ({
      ...g,
      cash: g.cash + sponsor.amount,
      pendingSponsor: null,
      sponsorsTaken: [...g.sponsorsTaken, sponsor.id],
      log: [`${sponsor.company} ile anlaşma yapıldı.`, ...g.log].slice(0, 5),
    }));
  };

  const rejectSponsor = () => {
    setGame((g) => ({
      ...g,
      pendingSponsor: null,
      log: ["Sponsor teklifi reddedildi.", ...g.log].slice(0, 5),
    }));
  };

  const updateManager = (manager) => {
    setGame((g) => ({ ...g, manager }));
  };

  const updateClub = (club) => {
    setGame((g) => ({ ...g, club }));
  };

  const resetGame = () => {
    const fresh = freshState();
    setGame(fresh);
    setCurrentScreen("home");
  };

  const lineupPlayers = game.live.prepared
    ? game.live.lineupIds.map((id) => findByNumber(game.players, id)).filter(Boolean)
    : bestLineup;

  const benchPlayers = game.live.prepared
    ? game.live.benchIds.map((id) => findByNumber(game.players, id)).filter(Boolean)
    : bestBench;

  const commonScreenProps = {
    game,
    team,
    stars,
    money,
  };

  let screenNode = null;

  if (currentScreen === "home") {
    screenNode = (
      <HomeScreen
        {...commonScreenProps}
        onStartClub={() => setGame((g) => ({ ...g, started: true }))}
        onQuickMatch={() => setGame((g) => simulateQuickMatch(g))}
        onOpenMatch={prepareMatch}
        sponsor={sponsor}
      />
    );
  }

  if (currentScreen === "squad") {
    screenNode = <SquadScreen players={game.players} lineup={bestLineup} bench={bestBench} />;
  }

  if (currentScreen === "match") {
    screenNode = (
      <MatchScreen
        game={game}
        lineup={lineupPlayers}
        bench={benchPlayers}
        money={money}
        onPrepareMatch={prepareMatch}
        onStartLiveMatch={startLiveMatch}
        onPauseLiveMatch={pauseLiveMatch}
        onSetLiveSpeed={setLiveSpeed}
        onSetLiveTempo={setLiveTempo}
        onSetSelectedOut={setSelectedOut}
        onSetSelectedIn={setSelectedIn}
        onDoSub={doSub}
        onAutoBestLineup={autoBestLineup}
      />
    );
  }

  if (currentScreen === "store") {
    screenNode = (
      <StoreScreen
        game={game}
        fanStoreItems={FAN_STORE_ITEMS}
        cashShop={CASH_SHOP}
        sponsor={sponsor}
        money={money}
        onBuyFanStoreStock={buyFanStoreStock}
        onCollectFanStoreRevenue={collectFanStoreRevenue}
        onAcceptSponsor={acceptSponsor}
        onRejectSponsor={rejectSponsor}
      />
    );
  }

  if (currentScreen === "club") {
    screenNode = (
      <ClubScreen
        game={game}
        equipment={EQUIPMENT}
        currentEq={currentEq}
        nextEq={nextEq}
        money={money}
        onUpdateManager={updateManager}
        onUpdateClub={updateClub}
        onBuyEquipment={buyEquipment}
        onResetGame={resetGame}
      />
    );
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-black text-white">
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}

      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-hidden">{screenNode}</div>
        <BottomNav currentScreen={currentScreen} onChange={setCurrentScreen} />
      </div>
    </div>
  );
}