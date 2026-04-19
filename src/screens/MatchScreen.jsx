import React, { useState } from "react";

function EventBox({ event }) {
  let boxClass = "bg-slate-950 text-slate-300";

  if (event.type === "goal") boxClass = "bg-emerald-500 text-white";
  if (event.type === "yellow") boxClass = "bg-yellow-400 text-slate-950";
  if (event.type === "red") boxClass = "bg-rose-600 text-white";
  if (event.type === "injury") boxClass = "bg-orange-500 text-white";
  if (event.type === "sub") boxClass = "bg-sky-500 text-white";

  return (
    <div className={`rounded-2xl px-3 py-3 ${boxClass}`}>
      <div className="text-sm font-semibold">
        {event.minute}' {event.title}
      </div>
      <div className="mt-1 text-xs opacity-90">{event.text}</div>
    </div>
  );
}

export default function MatchScreen({
  game,
  lineup,
  bench,
  money,
  onPrepareMatch,
  onStartLiveMatch,
  onPauseLiveMatch,
  onSetLiveSpeed,
  onSetLiveTempo,
  onSetSelectedOut,
  onSetSelectedIn,
  onDoSub,
  onAutoBestLineup,
}) {
  const [tab, setTab] = useState("center");

  return (
    <div className="h-full overflow-hidden p-4">
      <div className="mx-auto flex h-full max-w-md flex-col gap-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black">Maç Merkezi</h1>
              <p className="mt-1 text-sm text-slate-400">Rakip: {game.live.opponent || "Hazırlanmadı"}</p>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Skor</div>
              <div className="text-2xl font-black">
                {game.live.score.home} - {game.live.score.away}
              </div>
              <div className="text-sm text-slate-400">{game.live.minute}'</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={() => setTab("center")}
              className={`rounded-2xl px-3 py-3 text-sm font-semibold ${tab === "center" ? "bg-white text-black" : "bg-[#111] text-slate-300"}`}
            >
              Merkez
            </button>
            <button
              onClick={() => setTab("squad")}
              className={`rounded-2xl px-3 py-3 text-sm font-semibold ${tab === "squad" ? "bg-white text-black" : "bg-[#111] text-slate-300"}`}
            >
              Kadro
            </button>
            <button
              onClick={() => setTab("subs")}
              className={`rounded-2xl px-3 py-3 text-sm font-semibold ${tab === "subs" ? "bg-white text-black" : "bg-[#111] text-slate-300"}`}
            >
              Değişiklik
            </button>
          </div>
        </div>

        {tab === "center" && (
          <div className="flex flex-1 flex-col gap-4">
            <div className="rounded-3xl border border-slate-800 bg-[#111] p-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onPrepareMatch}
                  className="rounded-2xl bg-gradient-to-r from-sky-600 to-sky-400 px-4 py-4 text-base font-semibold text-white"
                >
                  Maçı Hazırla
                </button>

                <button
                  onClick={game.live.running ? onPauseLiveMatch : onStartLiveMatch}
                  className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-400 px-4 py-4 text-base font-semibold text-white"
                >
                  {game.live.running ? "Durdur" : "Başlat"}
                </button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {[1, 2, 4].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => onSetLiveSpeed(speed)}
                    className={`rounded-2xl px-3 py-3 text-sm font-semibold ${
                      game.live.speed === speed ? "bg-white text-black" : "bg-slate-950 text-slate-300"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {["Defans", "Dengeli", "Hücum"].map((tempo) => (
                  <button
                    key={tempo}
                    onClick={() => onSetLiveTempo(tempo)}
                    className={`rounded-2xl px-3 py-3 text-sm font-semibold ${
                      game.live.tempo === tempo ? "bg-white text-black" : "bg-slate-950 text-slate-300"
                    }`}
                  >
                    {tempo}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 rounded-3xl border border-slate-800 bg-[#111] p-4">
              <h2 className="mb-3 text-lg font-bold">Son Olaylar</h2>
              <div className="space-y-2">
                {game.live.events.slice(0, 6).map((e, i) => (
                  <EventBox key={`${e.minute}-${i}`} event={e} />
                ))}

                {!game.live.events.length && (
                  <div className="rounded-2xl bg-slate-950 px-3 py-3 text-sm text-slate-400">
                    Önce maçı hazırla.
                  </div>
                )}
              </div>

              {game.live.finished && game.lastMatch && (
                <div className="mt-3 rounded-2xl bg-emerald-950/40 px-3 py-3 text-sm text-emerald-300">
                  Maç geliri: {money(game.lastMatch.prize)}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "squad" && (
          <div className="flex-1 rounded-3xl border border-slate-800 bg-[#111] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">İlk 11</h2>
              <button
                onClick={onAutoBestLineup}
                className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
              >
                En İyi Kadro
              </button>
            </div>

            <div className="space-y-2">
              {lineup.map((player) => (
                <div key={player.number} className="grid grid-cols-[36px_1fr_40px] items-center gap-2 rounded-2xl bg-slate-950 px-3 py-2">
                  <div className="text-xs text-slate-500">#{player.number}</div>
                  <div>
                    <div className="text-sm font-semibold text-white">{player.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {player.role} • OVR {player.overall}
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400">{Math.round(player.condition)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "subs" && (
          <div className="flex flex-1 flex-col gap-4">
            <div className="rounded-3xl border border-slate-800 bg-[#111] p-4">
              <div className="mb-2 text-sm text-slate-400">
                Kullanılan değişiklik: {game.live.subsUsed} / 3
              </div>

              <select
                value={game.live.selectedOut}
                onChange={(e) => onSetSelectedOut(e.target.value)}
                className="mb-3 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none"
              >
                <option value="">Çıkacak oyuncu</option>
                {lineup.map((player) => (
                  <option key={player.number} value={player.number}>
                    #{player.number} {player.name}
                  </option>
                ))}
              </select>

              <select
                value={game.live.selectedIn}
                onChange={(e) => onSetSelectedIn(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none"
              >
                <option value="">Girecek oyuncu</option>
                {bench.map((player) => (
                  <option key={player.number} value={player.number}>
                    #{player.number} {player.name}
                  </option>
                ))}
              </select>

              <button
                onClick={onDoSub}
                className="mt-3 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-4 text-base font-semibold text-white"
              >
                Değişikliği Yap
              </button>
            </div>

            <div className="flex-1 rounded-3xl border border-slate-800 bg-[#111] p-4">
              <h2 className="mb-3 text-lg font-bold">Yedekler</h2>
              <div className="space-y-2">
                {bench.map((player) => (
                  <div key={player.number} className="grid grid-cols-[36px_1fr_40px] items-center gap-2 rounded-2xl bg-slate-950 px-3 py-2">
                    <div className="text-xs text-slate-500">#{player.number}</div>
                    <div>
                      <div className="text-sm font-semibold text-white">{player.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {player.role} • OVR {player.overall}
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-400">{Math.round(player.condition)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}