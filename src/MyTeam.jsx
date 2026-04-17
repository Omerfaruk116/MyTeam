import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

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
  { name: "Arda Nova", role: "Forvet", speed: 60, power: 55, stamina: 58, technique: 62 },
  { name: "Leo Vale", role: "Kanat", speed: 68, power: 52, stamina: 61, technique: 67 },
  { name: "Chris North", role: "Forvet", speed: 64, power: 66, stamina: 57, technique: 59 },
  { name: "Miran Fox", role: "Orta Saha", speed: 55, power: 57, stamina: 70, technique: 66 },
  { name: "Eren Pike", role: "Orta Saha", speed: 58, power: 59, stamina: 68, technique: 63 },
  { name: "Bora Steel", role: "Savunma", speed: 49, power: 71, stamina: 65, technique: 51 },
  { name: "Kaan Ridge", role: "Savunma", speed: 50, power: 69, stamina: 67, technique: 52 },
  { name: "Tuna Wall", role: "Kaleci", speed: 45, power: 63, stamina: 62, technique: 56 },
];

const money = (n) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function freshState() {
  return {
    manager: "Ömer",
    club: "Blue Crescent FC",
    started: false,
    cash: 500,
    fans: 120,
    morale: 62,
    eq: 0,
    players: START_PLAYERS,
    cup: { current: 0, total: 10, w: 0, d: 0, l: 0, gf: 0, ga: 0, done: false },
    lastMatch: null,
    log: ["Kulüp kuruldu.", "İlk hedef: 10 maçlık başlangıç kupasını tamamla."],
    sponsorsTaken: [],
    pendingSponsor: null,
    stock: { scarf: 0, shirt: 0, cap: 0 },
    storeRevenue: 0,
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
  const score =
    team.speed * 0.23 +
    team.power * 0.24 +
    team.stamina * 0.22 +
    team.technique * 0.31 -
    opp +
    (Math.random() * 12 - 6);

  let gf = 0;
  let ga = 0;

  if (score > 14) {
    gf = 3 + Math.floor(Math.random() * 3);
    ga = Math.floor(Math.random() * 2);
  } else if (score > 6) {
    gf = 2 + Math.floor(Math.random() * 2);
    ga = Math.floor(Math.random() * 2);
  } else if (score > -3) {
    gf = 1 + Math.floor(Math.random() * 2);
    ga = 1 + Math.floor(Math.random() * 2);
  } else if (score > -10) {
    gf = Math.floor(Math.random() * 2);
    ga = 1 + Math.floor(Math.random() * 2);
  } else {
    gf = Math.floor(Math.random() * 2);
    ga = 2 + Math.floor(Math.random() * 3);
  }

  const result = gf > ga ? "W" : gf === ga ? "D" : "L";
  const prize = result === "W" ? 160 + state.cup.current * 40 : result === "D" ? 80 : 35;
  const moraleShift = result === "W" ? 5 : result === "D" ? 1 : -4;
  const fanShift = result === "W" ? 45 : result === "D" ? 15 : -8;

  const lines = [
    `${state.club}, ${opponent} karşısında sahaya çıktı.`,
    `Hız ${team.speed}, teknik ${team.technique}, kondisyon ${team.stamina}.`,
    gf > ga
      ? "Baskı sonuç verdi ve takım öne geçti."
      : gf === ga
      ? "Maç dengeli geçti."
      : "Rakip kritik anlarda daha etkiliydi.",
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

function Bar({ label, value }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-slate-900" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function MyTeam() {
  const [game, setGame] = useState(freshState());

  useEffect(() => {
    const saved = localStorage.getItem("fm-demo-save");
    if (saved) {
      try {
        setGame(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("fm-demo-save", JSON.stringify(game));
  }, [game]);

  const team = useMemo(() => calcTeam(game.players, game.eq, game.morale), [game.players, game.eq, game.morale]);
  const stars = useMemo(() => calcStars(team), [team]);
  const eq = EQUIPMENT[game.eq];
  const nextEq = EQUIPMENT[game.eq + 1] || null;

  useEffect(() => {
    const open = SPONSORS.find(
      (s) => stars >= s.minStars && !game.sponsorsTaken.includes(s.id) && game.pendingSponsor !== s.id
    );
    if (open) {
      setGame((g) => ({ ...g, pendingSponsor: open.id }));
    }
  }, [stars]);

  const sponsor = SPONSORS.find((s) => s.id === game.pendingSponsor) || null;

  const playMatch = () => {
    if (!game.started || game.cup.done) return;
    setGame((g) => simulate(g));
  };

  const upgradeEquipment = () => {
    if (!nextEq || game.cash < nextEq.price) return;
    setGame((g) => ({
      ...g,
      cash: g.cash - nextEq.price,
      eq: g.eq + 1,
      log: [`${nextEq.name} seviyesine geçildi.`, ...g.log].slice(0, 5),
    }));
  };

  const acceptSponsor = () => {
    if (!sponsor) return;
    setGame((g) => ({
      ...g,
      cash: g.cash + sponsor.amount,
      pendingSponsor: null,
      sponsorsTaken: [...g.sponsorsTaken, sponsor.id],
      log: [`${sponsor.company} ile anlaşma yapıldı. +${money(sponsor.amount)}`, ...g.log].slice(0, 5),
    }));
  };

  const rejectSponsor = () => {
    if (!sponsor) return;
    setGame((g) => ({
      ...g,
      pendingSponsor: null,
      log: [`${sponsor.company} teklifi reddedildi.`, ...g.log].slice(0, 5),
    }));
  };

  const stockItem = (item) => {
    if (game.cash < item.buy) return;
    setGame((g) => ({
      ...g,
      cash: g.cash - item.buy,
      stock: { ...g.stock, [item.id]: g.stock[item.id] + 1 },
    }));
  };

  const sellStore = () => {
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
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-3xl bg-slate-900 p-6 text-white shadow-2xl"
        >
          <div className="grid gap-4 md:grid-cols-[1.6fr_1fr] md:items-center">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-slate-300">Futbol Menajer Demo</p>
              <h1 className="text-3xl font-black md:text-5xl">{game.club}</h1>
              <p className="mt-2 text-slate-300">
                Menajer: <span className="font-semibold text-white">{game.manager}</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-white/10 px-3 py-1">Bakiye: {money(game.cash)}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Taraftar: {game.fans}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Moral: {game.morale}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Takım Yıldızı: {stars.toFixed(1)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGame((g) => ({ ...g, started: true }))}
                className="rounded-2xl bg-white px-4 py-3 font-semibold text-slate-900"
              >
                {game.started ? "Kulüp Aktif" : "Kulübü Başlat"}
              </button>
              <button onClick={playMatch} className="rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950">
                Maç Simüle Et
              </button>
              <button onClick={() => alert("Kaydedildi")} className="rounded-2xl bg-slate-700 px-4 py-3 font-semibold text-white">
                Kaydet
              </button>
              <button onClick={() => setGame(freshState())} className="rounded-2xl bg-rose-500 px-4 py-3 font-semibold text-white">
                Sıfırla
              </button>
            </div>
          </div>
        </motion.div>

        {!game.started && (
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="mb-4 text-xl font-bold">Kulüp Kurulumu</h2>
              <label className="mb-2 block text-sm font-medium text-slate-600">Menajer Adı</label>
              <input
                value={game.manager}
                onChange={(e) => setGame((g) => ({ ...g, manager: e.target.value }))}
                className="mb-4 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
              <label className="mb-2 block text-sm font-medium text-slate-600">Kulüp Adı</label>
              <input
                value={game.club}
                onChange={(e) => setGame((g) => ({ ...g, club: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </div>

            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="mb-4 text-xl font-bold">Bu demoda neler var?</h2>
              <div className="space-y-2 text-sm text-slate-700">
                <div>• 10 maçlık başlangıç kupası</div>
                <div>• Metin tabanlı maç anlatımı</div>
                <div>• Takım yıldızı ve ekipman seviyesi</div>
                <div>• Sponsor teklifleri</div>
                <div>• Store geliri ve otomatik kayıt</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Takım Gücü</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">{stars.toFixed(1)} yıldız</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Bar label="Hız" value={team.speed} />
                <Bar label="Güç" value={team.power} />
                <Bar label="Kondisyon" value={team.stamina} />
                <Bar label="Teknik" value={team.technique} />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Oyuncu Kartları</h2>
                <span className="text-sm text-slate-500">{game.players.length} oyuncu</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {game.players.map((p) => (
                  <div key={p.name} className="rounded-3xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-bold">{p.name}</h3>
                        <p className="text-sm text-slate-500">{p.role}</p>
                      </div>
                      <span className={`h-4 w-4 rounded-full ${eq.dot}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                      <div>Hız: <span className="font-semibold">{p.speed}</span></div>
                      <div>Güç: <span className="font-semibold">{p.power}</span></div>
                      <div>Kondisyon: <span className="font-semibold">{p.stamina}</span></div>
                      <div>Teknik: <span className="font-semibold">{p.technique}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Başlangıç Kupası</h2>
                <span className="text-sm text-slate-500">
                  Maç {Math.min(game.cup.current + 1, game.cup.total)} / {game.cup.total}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-slate-100 p-4"><div className="text-sm text-slate-500">G</div><div className="text-2xl font-black">{game.cup.w}</div></div>
                <div className="rounded-2xl bg-slate-100 p-4"><div className="text-sm text-slate-500">B</div><div className="text-2xl font-black">{game.cup.d}</div></div>
                <div className="rounded-2xl bg-slate-100 p-4"><div className="text-sm text-slate-500">M</div><div className="text-2xl font-black">{game.cup.l}</div></div>
                <div className="rounded-2xl bg-slate-100 p-4"><div className="text-sm text-slate-500">Averaj</div><div className="text-2xl font-black">{game.cup.gf}-{game.cup.ga}</div></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Ekipman Seviyesi</h2>
                <div className="flex items-center gap-2">
                  <span className={`h-4 w-4 rounded-full ${eq.dot}`} />
                  <span className="text-sm text-slate-500">{eq.name}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-700">
                <div>Hız: <span className="font-semibold">{eq.bonus.speed >= 0 ? "+" : ""}{eq.bonus.speed}</span></div>
                <div>Güç: <span className="font-semibold">{eq.bonus.power >= 0 ? "+" : ""}{eq.bonus.power}</span></div>
                <div>Kondisyon: <span className="font-semibold">{eq.bonus.stamina >= 0 ? "+" : ""}{eq.bonus.stamina}</span></div>
                <div>Teknik: <span className="font-semibold">{eq.bonus.technique >= 0 ? "+" : ""}{eq.bonus.technique}</span></div>
              </div>
              {nextEq ? (
                <button onClick={upgradeEquipment} className="mt-5 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">
                  {nextEq.name} al ({money(nextEq.price)})
                </button>
              ) : (
                <div className="mt-5 rounded-2xl bg-yellow-50 p-4 text-sm text-yellow-900">En yüksek seviyeye ulaşıldı.</div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-5 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Store</h2>
                <span className="text-sm text-slate-500">Gelir: {money(game.storeRevenue)}</span>
              </div>
              <div className="space-y-3">
                {STORE.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-slate-500">Stok: {game.stock[item.id]}</div>
                    </div>
                    <button onClick={() => stockItem(item)} className="w-full rounded-2xl bg-slate-100 px-4 py-2 font-medium">
                      1 adet stokla ({money(item.buy)})
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={sellStore} className="mt-4 w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950">
                Günlük satış yap
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {sponsor && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-white p-5 shadow ring-2 ring-emerald-300"
              >
                <h2 className="mb-3 text-xl font-bold">Yeni Sponsor Teklifi</h2>
                <div className="font-semibold">{sponsor.company}</div>
                <div className="mb-3 text-sm text-slate-500">{sponsor.title}</div>
                <div className="mb-4 rounded-2xl bg-slate-100 p-4 text-lg font-black">{money(sponsor.amount)}</div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={acceptSponsor} className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">
                    Kabul Et
                  </button>
                  <button onClick={rejectSponsor} className="rounded-2xl bg-slate-100 px-4 py-3 font-semibold text-slate-900">
                    Reddet
                  </button>
                </div>
              </motion.div>
            )}

            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="mb-4 text-xl font-bold">Son Maç</h2>
              {game.lastMatch ? (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <div className="text-sm text-slate-500">Rakip</div>
                    <div className="text-lg font-bold">{game.lastMatch.opponent}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-slate-100 p-4"><div className="text-sm text-slate-500">Sen</div><div className="text-2xl font-black">{game.lastMatch.gf}</div></div>
                    <div className="rounded-2xl bg-slate-100 p-4"><div className="text-sm text-slate-500">Skor</div><div className="text-2xl font-black">{game.lastMatch.result}</div></div>
                    <div className="rounded-2xl bg-slate-100 p-4"><div className="text-sm text-slate-500">Rakip</div><div className="text-2xl font-black">{game.lastMatch.ga}</div></div>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
                    Maç geliri: {money(game.lastMatch.prize)}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">Henüz maç oynanmadı.</div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="mb-4 text-xl font-bold">Maç Anlatımı</h2>
              <div className="space-y-3">
                {game.log.map((line, i) => (
                  <div key={i} className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-700">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
