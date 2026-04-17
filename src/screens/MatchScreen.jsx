import { useEffect, useMemo, useRef, useState } from "react";
import TopBar from "../components/TopBar";

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getUniqueMinutes(count, min, max) {
  const set = new Set();
  while (set.size < count) {
    set.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return [...set].sort((a, b) => a - b);
}

function generateScore(homeStrength, awayStrength) {
  const diff = homeStrength - awayStrength;

  if (diff >= 8) {
    return {
      home: 2 + Math.floor(Math.random() * 3),
      away: Math.floor(Math.random() * 2),
    };
  }

  if (diff >= 3) {
    return {
      home: 1 + Math.floor(Math.random() * 3),
      away: Math.floor(Math.random() * 2),
    };
  }

  if (diff <= -8) {
    return {
      home: Math.floor(Math.random() * 2),
      away: 2 + Math.floor(Math.random() * 3),
    };
  }

  if (diff <= -3) {
    return {
      home: Math.floor(Math.random() * 2),
      away: 1 + Math.floor(Math.random() * 3),
    };
  }

  return {
    home: Math.floor(Math.random() * 3),
    away: Math.floor(Math.random() * 3),
  };
}

function generateHomeGoalText(scorer, assist) {
  const options = [
    `${assist} harika bir orta açtı, ${scorer} boşta kalan topa vurdu ve GOOOOOLLLL!`,
    `${scorer} ceza sahası dışından sert vurdu... ve top ağlarda! GOOOOOLLLL!`,
    `${scorer} kaleciyle karşı karşıya kaldı, sakin vurdu ve GOOOOOLLLL!`,
    `${assist} ara pasını verdi, ${scorer} tek vuruşla ağları buldu! GOOOOOLLLL!`,
  ];

  return randomItem(options);
}

function generateAwayGoalText(opponent) {
  const options = [
    `${opponent} hızlı çıktı, savunma geç kaldı ve top ağlarla buluştu.`,
    `${opponent} ceza sahasında boş kaldı, sert vurdu ve gol geldi.`,
    `${opponent} uzaktan denedi, top filelere gitti.`,
  ];

  return randomItem(options);
}

function generateChanceText(player, opponent) {
  const options = [
    `${player} uzaktan şansını denedi ama top auta gitti.`,
    `${player} rakibini geçti, şutunda kaleci başarılı.`,
    `${opponent} tehlikeli geldi ama savunma son anda araya girdi.`,
    `${player} ceza sahasında vurdu, top direkten döndü!`,
  ];

  return randomItem(options);
}

function generateYellowText(player) {
  const options = [
    `${player} rakibini formasından çekti ve sarı kart gördü.`,
    `${player} geç kaldı, hakem sarı kartını çıkardı.`,
    `${player} sert müdahalesi sonrası sarı kart gördü.`,
  ];

  return randomItem(options);
}

function buildMatchEvents(data) {
  const players = data.starters || [];
  const opponent = data.nextMatch.opponent;
  const score = generateScore(
    data.club.strength || 60,
    data.nextMatch.opponentStrength || 60
  );

  const events = [];

  const homeGoalMinutes = getUniqueMinutes(score.home, 8, 88);
  const awayGoalMinutes = getUniqueMinutes(score.away, 10, 87);
  const chanceMinutes = getUniqueMinutes(5, 6, 84);
  const cardMinutes = getUniqueMinutes(2, 15, 80);

  homeGoalMinutes.forEach((minute) => {
    const scorer = randomItem(players);
    const assist = randomItem(players.filter((p) => p !== scorer) || players);

    events.push({
      minute,
      type: "goal-home",
      title: `${minute}' GOL - ${scorer}`,
      text: generateHomeGoalText(scorer, assist),
      scorer,
    });
  });

  awayGoalMinutes.forEach((minute) => {
    events.push({
      minute,
      type: "goal-away",
      title: `${minute}' GOL - ${opponent}`,
      text: generateAwayGoalText(opponent),
      scorer: opponent,
    });
  });

  chanceMinutes.forEach((minute) => {
    const player = randomItem(players);
    events.push({
      minute,
      type: "chance",
      title: `${minute}' TEHLİKE`,
      text: generateChanceText(player, opponent),
    });
  });

  cardMinutes.forEach((minute) => {
    const player = randomItem(players);
    events.push({
      minute,
      type: "yellow",
      title: `${minute}' SARI KART - ${player}`,
      text: generateYellowText(player),
      player,
    });
  });

  events.push({
    minute: 45,
    type: "half",
    title: "45' İLK YARI",
    text: "İlk yarı sona erdi.",
  });

  events.sort((a, b) => a.minute - b.minute);

  return { events, finalScore: score };
}

function NotificationBox({ notification }) {
  if (!notification) return null;

  const styleMap = {
    "goal-home": "bg-emerald-500 text-white",
    "goal-away": "bg-rose-500 text-white",
    yellow: "bg-yellow-400 text-slate-950",
    chance: "bg-sky-500 text-white",
    half: "bg-slate-700 text-white",
    final: "bg-violet-500 text-white",
  };

  return (
    <div
      className={`animate-pulse rounded-3xl px-5 py-4 text-center text-lg font-black shadow-lg ${
        styleMap[notification.type] || "bg-slate-700 text-white"
      }`}
    >
      {notification.title}
    </div>
  );
}

export default function MatchScreen({ data, onBackHome }) {
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [minute, setMinute] = useState(0);
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [commentary, setCommentary] = useState([]);
  const [notification, setNotification] = useState(null);
  const [finished, setFinished] = useState(false);
  const [summary, setSummary] = useState("");
  const [manOfTheMatch, setManOfTheMatch] = useState("-");

  const minuteRef = useRef(0);
  const homeGoalsRef = useRef(0);
  const awayGoalsRef = useRef(0);
  const eventIndexRef = useRef(0);
  const eventsRef = useRef([]);
  const finalScoreRef = useRef({ home: 0, away: 0 });
  const notificationTimeoutRef = useRef(null);

  const starters = useMemo(() => data.starters || [], [data.starters]);

  const clearNotificationLater = () => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }

    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 1300);
  };

  const resetLiveMatch = () => {
    const plan = buildMatchEvents(data);

    eventsRef.current = plan.events;
    finalScoreRef.current = plan.finalScore;
    eventIndexRef.current = 0;
    minuteRef.current = 0;
    homeGoalsRef.current = 0;
    awayGoalsRef.current = 0;

    setStarted(true);
    setRunning(true);
    setFinished(false);
    setMinute(0);
    setHomeGoals(0);
    setAwayGoals(0);
    setSummary("");
    setNotification({
      type: "chance",
      title: "Maç Başladı",
    });
    setCommentary(["0' Hakem ilk düdüğü çaldı, maç başladı."]);
    setManOfTheMatch("-");
    clearNotificationLater();
  };

  const finishMatch = () => {
    setRunning(false);
    setFinished(true);

    const finalHome = homeGoalsRef.current;
    const finalAway = awayGoalsRef.current;

    let finalSummary = "";
    if (finalHome > finalAway) {
      finalSummary = `${data.club.name} maçı kazandı ve moral depoladı.`;
    } else if (finalHome < finalAway) {
      finalSummary = `${data.club.name} sahadan mağlubiyetle ayrıldı.`;
    } else {
      finalSummary = `Karşılaşma beraberlikle sonuçlandı.`;
    }

    const motm =
      starters[Math.floor(Math.random() * starters.length)] || "Leo Vale";

    setManOfTheMatch(motm);
    setSummary(finalSummary);
    setNotification({
      type: "final",
      title: "MAÇ BİTTİ",
    });
    setCommentary((prev) => [...prev, "90+' Son düdük geldi, maç sona erdi."]);
    clearNotificationLater();
  };

  useEffect(() => {
    if (!started || !running || finished) return;

    const delay = 1000 / speed;

    const interval = setInterval(() => {
      if (minuteRef.current >= 90) {
        finishMatch();
        return;
      }

      const nextMinute = minuteRef.current + 1;
      minuteRef.current = nextMinute;
      setMinute(nextMinute);

      while (
        eventIndexRef.current < eventsRef.current.length &&
        eventsRef.current[eventIndexRef.current].minute === nextMinute
      ) {
        const event = eventsRef.current[eventIndexRef.current];
        eventIndexRef.current += 1;

        if (event.type === "goal-home") {
          homeGoalsRef.current += 1;
          setHomeGoals(homeGoalsRef.current);
        }

        if (event.type === "goal-away") {
          awayGoalsRef.current += 1;
          setAwayGoals(awayGoalsRef.current);
        }

        setCommentary((prev) => [...prev, `${event.minute}' ${event.text}`]);
        setNotification({
          type: event.type,
          title: event.title,
        });
        clearNotificationLater();
      }

      if (nextMinute >= 90) {
        finishMatch();
      }
    }, delay);

    return () => clearInterval(interval);
  }, [started, running, speed, finished, data.club.name, starters]);

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

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

          <button
            onClick={onBackHome}
            className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-900"
          >
            Ana Ekrana Dön
          </button>
        </div>

        <div className="mb-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
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
                  {homeGoals} - {awayGoals}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-400">Rakip</p>
                <h2 className="text-2xl font-black">
                  {data.nextMatch.opponent}
                </h2>
              </div>
            </div>

            <div className="mb-5">
              <NotificationBox notification={notification} />
            </div>

            <div className="mb-5 flex flex-wrap gap-3">
              {!started && (
                <button
                  onClick={resetLiveMatch}
                  className="rounded-3xl bg-emerald-400 px-6 py-4 text-lg font-black text-slate-950 shadow-lg"
                >
                  Maçı Başlat
                </button>
              )}

              {started && !finished && (
                <>
                  <button
                    onClick={() => setRunning(false)}
                    className="rounded-3xl bg-rose-500 px-5 py-3 font-bold text-white"
                  >
                    Durdur
                  </button>

                  <button
                    onClick={() => setRunning(true)}
                    className="rounded-3xl bg-emerald-500 px-5 py-3 font-bold text-white"
                  >
                    Devam Et
                  </button>
                </>
              )}

              {(started || finished) && (
                <button
                  onClick={resetLiveMatch}
                  className="rounded-3xl bg-slate-700 px-5 py-3 font-bold text-white"
                >
                  Yeni Maç
                </button>
              )}
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
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

            <div className="rounded-3xl bg-white/10 p-5 shadow-lg backdrop-blur">
              <p className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-300">
                Maç Anlatımı
              </p>

              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-2">
                {commentary.length === 0 ? (
                  <div className="rounded-2xl bg-slate-800/90 p-4 text-sm text-slate-200">
                    Maç henüz başlamadı.
                  </div>
                ) : (
                  commentary.map((line, index) => (
                    <div
                      key={`${line}-${index}`}
                      className="rounded-2xl bg-slate-800/90 p-4 text-sm text-slate-100"
                    >
                      {line}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-900/90 p-5 shadow-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Maç Bilgisi
              </p>

              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">Tarih</p>
                  <p className="mt-1 text-lg font-bold">{data.nextMatch.date}</p>
                </div>

                <div className="rounded-2xl bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">Tür</p>
                  <p className="mt-1 text-lg font-bold">{data.nextMatch.type}</p>
                </div>

                <div className="rounded-2xl bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">Takım Gücü</p>
                  <p className="mt-1 text-lg font-bold">
                    {data.club.strength} / {data.nextMatch.opponentStrength}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900/90 p-5 shadow-xl">
              <p className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-400">
                İlk 11
              </p>

              <div className="grid gap-3">
                {(data.starters || []).map((player, index) => (
                  <div
                    key={`${player}-${index}`}
                    className="rounded-2xl bg-slate-800 p-4"
                  >
                    <p className="text-xs uppercase text-slate-400">
                      Oyuncu {index + 1}
                    </p>
                    <p className="mt-1 font-bold">{player}</p>
                  </div>
                ))}
              </div>
            </div>

            {finished && (
              <div className="rounded-3xl bg-slate-900/90 p-5 shadow-xl">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  Maç Sonu
                </p>

                <div className="mt-4 rounded-2xl bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">
                    Maçın Oyuncusu
                  </p>
                  <p className="mt-1 text-xl font-black">{manOfTheMatch}</p>
                </div>

                <div className="mt-3 rounded-2xl bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">Özet</p>
                  <p className="mt-1 font-semibold">{summary}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}