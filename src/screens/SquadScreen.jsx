import React, { useMemo, useState } from "react";

function PlayerRow({ player }) {
  return (
    <div className="grid grid-cols-[40px_1fr_42px_42px] items-center gap-2 rounded-2xl bg-slate-950 px-3 py-2">
      <div className="text-sm font-black text-slate-400">#{player.number}</div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-white">{player.name}</div>
        <div className="text-[11px] text-slate-500">
          {player.role} • yaş {player.age}
        </div>
      </div>
      <div className="text-center text-sm font-bold text-white">{player.overall}</div>
      <div className="text-center text-xs text-slate-400">{Math.round(player.condition)}</div>
    </div>
  );
}

export default function SquadScreen({ players, lineup, bench }) {
  const [tab, setTab] = useState("lineup");

  const list = useMemo(() => {
    if (tab === "lineup") return lineup;
    if (tab === "bench") return bench;
    return players;
  }, [tab, lineup, bench, players]);

  return (
    <div className="h-full overflow-hidden p-4">
      <div className="mx-auto flex h-full max-w-md flex-col gap-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
          <h1 className="text-2xl font-black">Kadro</h1>
          <p className="mt-1 text-sm text-slate-400">Aşağı kaydırma yok, ekran sekmeli.</p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={() => setTab("lineup")}
              className={`rounded-2xl px-3 py-3 text-sm font-semibold ${tab === "lineup" ? "bg-white text-black" : "bg-[#111] text-slate-300"}`}
            >
              İlk 11
            </button>
            <button
              onClick={() => setTab("bench")}
              className={`rounded-2xl px-3 py-3 text-sm font-semibold ${tab === "bench" ? "bg-white text-black" : "bg-[#111] text-slate-300"}`}
            >
              Yedek
            </button>
            <button
              onClick={() => setTab("all")}
              className={`rounded-2xl px-3 py-3 text-sm font-semibold ${tab === "all" ? "bg-white text-black" : "bg-[#111] text-slate-300"}`}
            >
              Tümü
            </button>
          </div>
        </div>

        <div className="flex-1 rounded-3xl border border-slate-800 bg-[#111] p-4">
          <div className="mb-3 grid grid-cols-[40px_1fr_42px_42px] gap-2 px-3 text-[11px] uppercase tracking-[0.2em] text-slate-500">
            <div>No</div>
            <div>Oyuncu</div>
            <div className="text-center">OVR</div>
            <div className="text-center">KON</div>
          </div>

          <div className="space-y-2">
            {list.slice(0, tab === "all" ? 18 : 11).map((player) => (
              <PlayerRow key={player.number} player={player} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}