import { useEffect, useMemo, useRef, useState } from "react";
import TopBar from "../components/TopBar";

const POSITION_ORDER = [
  "GK",
  "LB",
  "CB",
  "CB",
  "SB",
  "CM",
  "CM",
  "CAM",
  "LW",
  "ST",
  "RW",
];

const DEFAULT_BENCH = [
  "Remzi",
  "Efe",
  "Hakan",
  "Burak",
  "Kaan",
  "Selim",
  "Musa",
];

const ABILITIES = [
  { icon: "⚔️", name: "Bire Bir Golcü" },
  { icon: "🎯", name: "Bitirici" },
  { icon: "🧱", name: "Güçlü Defans" },
  { icon: "🎩", name: "Oyun Kurucu" },
  { icon: "🧤", name: "Refleks Canavarı" },
  { icon: "🥅", name: "Penaltı Ustası" },
];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildPlayer(name, position) {
  const overall = randomBetween(66, 86);
  const stamina = randomBetween(55, 100);

  let abilities = [];
  if (overall >= 80) {
    abilities = [
      randomItem(ABILITIES),
      randomItem(ABILITIES.filter((a) => a.icon !== abilities[0]?.icon)),
    ];
  } else if (overall >= 75) {
    abilities = [randomItem(ABILITIES)];
  }

  return {
    id: `${name}-${position}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    position,
    overall,
    stamina,
    yellowCard: false,
    injured: false,
    abilities,
  };
}

function buildSquad(data) {
  const starters = (data?.starters || []).slice(0, 11);
  const benchNames = (data?.bench || DEFAULT_BENCH).slice(0, 7);

  const lineup = POSITION_ORDER.map((pos, index) => {
    const name = starters[index] || `Oyuncu ${index + 1}`;
    return buildPlayer(name, pos);
  });

  const benchPositions = ["GK", "CB", "CM", "CM", "LW", "ST", "SB"];
  const bench = benchNames.map((name, index) =>
    buildPlayer(name, benchPositions[index] || "CM")
  );

  return { lineup, bench };
}

function badgeClass(type) {
  if (type === "goal") return "bg-emerald-500 text-white animate-pulse";
  if (type === "yellow") return "bg-yellow-400 text-slate-950";
  if (type === "injury") return "bg-rose-500 text-white";
  if (type === "sub") return "bg-sky-500 text-white";
  return "bg-slate-700 text-white";
}

export default function MatchScreen({ data, onBackHome }) {
  const initialSquad = useMemo(() => buildSquad(data), [data]);

  const [lineup, setLineup] = useState(initialSquad.lineup);
  const [bench, setBench] = useState(initialSquad.bench);

  const [minute, setMinute] = useState(0);
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [tempo, setTempo] = useState("Dengeli");
  const [events, setEvents] = useState([]);
  const [selectedOutId, setSelectedOutId] = useState("");
  const [selectedInId, setSelectedInId] = useState("");
  const [motm, setMotm] = useState("-");
  const intervalRef = useRef(null);

  function resetMatch() {
    const squad = buildSquad(data);
    setLineup(squad.lineup);
    setBench(squad.bench);
    setMinute(0);
    setScore({ home: 0, away: 0 });
    setRunning(false);
    setStarted(false);
    setFinished(false);
    setEvents([]);
    setSelectedOutId("");
    setSelectedInId("");
    setMotm("-");
  }

  function autoBestLineup() {
    const allPlayers = [...lineup, ...bench].map((p) => ({
      ...p,
      sortScore: p.overall + p.stamina * 0.35,
    }));

    const newLineup = [];
    const usedIds = new Set();

    POSITION_ORDER.forEach((pos) => {
      const best = allPlayers
        .filter((p) => !usedIds.has(p.id))
        .sort((a, b) => {
          const posBonusA = a.position === pos ? 8 : 0;
          const posBonusB = b.position === pos ? 8 : 0;
          return b.sortScore + posBonusB - (a.sortScore + posBonusA);
        })[0];

      if (best) {
        usedIds.add(best.id);
        newLineup.push({ ...best });
      }
    });

    const newBench = allPlayers
      .filter((p) => !usedIds.has(p.id))
      .slice(0, 7)
      .map((p) => ({ ...p }));

    setLineup(newLineup);
    setBench(newBench);

    setEvents((prev) => [
      {
        id: crypto.randomUUID(),
        minute,
        type: "sub",
        title: "OTOMATİK KADRO",
        text: "En iyi kadro kondisyon ve güce göre kuruldu.",
      },
      ...prev,
    ]);
  }

  function addEvent(type, title, text) {
    setEvents((prev) => [
      {
        id: crypto.randomUUID(),
        minute: minute + 1,
        type,
        title,
        text,
      },
      ...prev,
    ]);
  }

  function doSubstitution() {
    if (!selectedOutId || !selectedInId) return;

    const outPlayer = lineup.find((p) => p.id === selectedOutId);
    const inPlayer = bench.find((p) => p.id === selectedInId);

    if (!outPlayer || !inPlayer) return;

    const newLineup = lineup.map((p) =>
      p.id === outPlayer.id ? { ...inPlayer, position: outPlayer.position } : p
    );
    const newBench = bench.map((p) =>
      p.id === inPlayer.id ? { ...outPlayer, position: inPlayer.position } : p
    );

    setLineup(newLineup);
    setBench(newBench);
    addEvent(
      "sub",
      `🔄 ${outPlayer.name} çıktı`,
      `${outPlayer.name} çıktı, ${inPlayer.name} girdi.`
    );

    setSelectedOutId("");
    setSelectedInId("");
  }

  useEffect(() => {
    if (!running || finished) return;

    const delay = 1000 / speed;

    intervalRef.current = setInterval(() => {
      setMinute((prevMinute) => {
        const nextMinute = prevMinute + 1;

        setLineup((prevLineup) =>
          prevLineup.map((p) => ({
            ...p,
            stamina: Math.max(0, p.stamina - randomBetween(0, 2)),
          }))
        );

        if (nextMinute <= 90) {
          const attackBoost = tempo === "Hücum" ? 0.07 : tempo === "Defans" ? -0.04 : 0;
          const randomRoll = Math.random();

          if (randomRoll < 0.18 + attackBoost) {
            const attacker = randomItem(lineup);
            const isHomeGoal = Math.random() < 0.62 + attackBoost;

            if (isHomeGoal) {
              setScore((s) => ({ ...s, home: s.home + 1 }));
              addEvent(
                "goal",
                `⚽ ${attacker.name} GOL`,
                `${attacker.name} vurdu ve GOOOOOLLLL!`
              );
            } else {
              setScore((s) => ({ ...s, away: s.away + 1 }));
              addEvent(
                "goal",
                `⚽ ${data.nextMatch.opponent} GOL`,
                `${data.nextMatch.opponent} kontra ataktan golü buldu.`
              );
            }
          } else if (randomRoll < 0.26) {
            const booked = randomItem(lineup);
            setLineup((prevLineup) =>
              prevLineup.map((p) =>
                p.id === booked.id ? { ...p, yellowCard: true } : p
              )
            );
            addEvent(
              "yellow",
              `🟨 ${booked.name} sarı kart`,
              `${booked.name} sert müdahale sonrası sarı kart gördü.`
            );
          } else if (randomRoll < 0.30) {
            const injured = randomItem(lineup);
            setLineup((prevLineup) =>
              prevLineup.map((p) =>
                p.id === injured.id ? { ...p, injured: true, stamina: 0 } : p
              )
            );
            addEvent(
              "injury",
              `🩹 ${injured.name} sakatlandı`,
              `${injured.name} yerde kaldı. Değişiklik gerekebilir.`
            );
          } else if (randomRoll < 0.42) {
            const chancePlayer = randomItem(lineup);
            addEvent(
              "normal",
              `🎯 ${chancePlayer.name} denedi`,
              `${chancePlayer.name} tehlikeli bir pozisyon yakaladı ama sonuç çıkmadı.`
            );
          }
        }

        if (nextMinute >= 90) {
          setRunning(false);
          setFinished(true);
          const best = [...lineup].sort((a, b) => b.overall - a.overall)[0];
          setMotm(best?.name || "-");
          addEvent("normal", "🏁 MAÇ BİTTİ", "Hakem son düdüğü çaldı.");
          return 90;
        }

        return nextMinute;
      });
    }, delay);

    return () => clearInterval(intervalRef.current);
  }, [running, finished, speed, lineup, tempo, data.nextMatch.opponent, minute]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-sky-950 text-white">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6">
          <TopBar
            money={data.club.money}
            premiumCash={data.club.premiumCash}
          />
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Canlı Maç Merkezi
            </p>
            <h1 className="text-3xl font-black">
              {data.club.name} vs {data.nextMatch.opponent}
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={resetMatch}
              className="rounded-2xl bg-slate-700 px-5 py-3 font-bold text-white"
            >
              Maçı Sıfırla
            </button>
            <button
              onClick={onBackHome}
              className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-900"
            >
              Ana Ekrana Dön
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl">
              <div className="mb-5 grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
                <div className="text-center">
                  <p className="text-sm text-slate-400">Ev Sahibi</p>
                  <h2 className="text-2xl font-black">{data.club.name}</h2>
                </div>

                <div className="rounded-3xl bg-slate-800 px-8 py-5 text-center">
                  <p className="text-sm uppercase text-slate-400">Dakika</p>
                  <p className="text-4xl font-black">{minute}'</p>
                  <p className="mt-2 text-5xl font-black">
                    {score.home} - {score.away}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-400">Rakip</p>
                  <h2 className="text-2xl font-black">
                    {data.nextMatch.opponent}
                  </h2>
                </div>
              </div>

              <div className="mb-5 flex flex-wrap gap-3">
                {!started && (
                  <button
                    onClick={() => {
                      setStarted(true);
                      setRunning(true);
                    }}
                    className="rounded-3xl bg-emerald-400 px-6 py-4 text-lg font-black text-slate-950"
                  >
                    Maçı Başlat
                  </button>
                )}

                {started && !finished && (
                  <>
                    <button
                      onClick={() => setRunning(true)}
                      className="rounded-2xl bg-emerald-500 px-5 py-3 font-bold text-white"
                    >
                      Devam Et
                    </button>
                    <button
                      onClick={() => setRunning(false)}
                      className="rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white"
                    >
                      Durdur
                    </button>
                  </>
                )}

                {[1, 2, 4].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSpeed(value)}
                    className={`rounded-2xl px-4 py-3 font-bold ${
                      speed === value
                        ? "bg-yellow-400 text-slate-950"
                        : "bg-slate-800 text-white"
                    }`}
                  >
                    {value}x
                  </button>
                ))}
              </div>

              <div className="mb-5 flex flex-wrap gap-3">
                {["Defans", "Dengeli", "Hücum"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setTempo(item)}
                    className={`rounded-2xl px-4 py-3 font-bold ${
                      tempo === item
                        ? "bg-sky-400 text-slate-950"
                        : "bg-slate-800 text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {finished && (
                <div className="mb-5 rounded-3xl bg-slate-800 p-5">
                  <p className="text-sm uppercase text-slate-400">Maç Sonu</p>
                  <p className="mt-2 text-xl font-black">Maçın Oyuncusu: {motm}</p>
                </div>
              )}

              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                <p className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-300">
                  Maç Olayları
                </p>

                <div className="max-h-[420px] space-y-3 overflow-y-auto pr-2">
                  {events.length === 0 ? (
                    <div className="rounded-2xl bg-slate-800/90 p-4 text-sm text-slate-200">
                      Maç henüz başlamadı.
                    </div>
                  ) : (
                    events.map((event) => (
                      <div
                        key={event.id}
                        className={`rounded-2xl p-4 ${badgeClass(event.type)}`}
                      >
                        <p className="font-black">{event.title}</p>
                        <p className="mt-1 text-sm font-medium">{event.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-900/90 p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  Maç Öncesi Kadro
                </p>
                <button
                  onClick={autoBestLineup}
                  className="rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950"
                >
                  En İyi Kadroyu Kur
                </button>
              </div>

              <div className="space-y-3">
                {lineup.map((player, index) => (
                  <div
                    key={player.id}
                    className="rounded-2xl bg-slate-800 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase text-slate-400">
                          {POSITION_ORDER[index]}
                        </p>
                        <p className="text-lg font-bold">{player.name}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold">{player.overall}</p>
                        <p className="text-xs text-slate-400">
                          Kondisyon {player.stamina}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {player.abilities.map((a, idx) => (
                        <span
                          key={`${player.id}-${idx}`}
                          className="rounded-full bg-slate-700 px-2 py-1 text-xs font-bold"
                          title={a.name}
                        >
                          {a.icon}
                        </span>
                      ))}
                      {player.yellowCard && (
                        <span className="rounded-full bg-yellow-400 px-2 py-1 text-xs font-black text-slate-950">
                          🟨
                        </span>
                      )}
                      {player.injured && (
                        <span className="rounded-full bg-rose-500 px-2 py-1 text-xs font-black text-white">
                          🩹
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900/90 p-5 shadow-xl">
              <p className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-400">
                Yedek Kulübesi
              </p>

              <div className="space-y-3">
                {bench.map((player) => (
                  <div key={player.id} className="rounded-2xl bg-slate-800 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase text-slate-400">
                          {player.position}
                        </p>
                        <p className="font-bold">{player.name}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold">{player.overall}</p>
                        <p className="text-xs text-slate-400">
                          Kondisyon {player.stamina}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900/90 p-5 shadow-xl">
              <p className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-400">
                Oyuncu Değişikliği
              </p>

              <div className="space-y-3">
                <select
                  value={selectedOutId}
                  onChange={(e) => setSelectedOutId(e.target.value)}
                  className="w-full rounded-2xl bg-slate-800 p-4 outline-none"
                >
                  <option value="">Çıkacak oyuncuyu seç</option>
                  {lineup.map((p, index) => (
                    <option key={p.id} value={p.id}>
                      {POSITION_ORDER[index]} - {p.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedInId}
                  onChange={(e) => setSelectedInId(e.target.value)}
                  className="w-full rounded-2xl bg-slate-800 p-4 outline-none"
                >
                  <option value="">Girecek oyuncuyu seç</option>
                  {bench.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.position} - {p.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={doSubstitution}
                  className="w-full rounded-3xl bg-sky-500 px-5 py-4 font-black text-white"
                >
                  Değişikliği Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}