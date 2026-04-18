import React from "react";

export default function ClubScreen({
  game,
  equipment,
  currentEq,
  nextEq,
  money,
  onUpdateManager,
  onUpdateClub,
  onBuyEquipment,
  onResetGame,
}) {
  return (
    <div className="h-full overflow-hidden p-4">
      <div className="mx-auto flex h-full max-w-md flex-col gap-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
          <h1 className="text-2xl font-black">Kulüp</h1>
          <p className="mt-1 text-sm text-slate-400">Kulüp kimliği ve ekipman</p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#111] p-4">
          <label className="mb-2 block text-sm font-medium text-slate-400">Menajer Adı</label>
          <input
            value={game.manager}
            onChange={(e) => onUpdateManager(e.target.value)}
            className="mb-4 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none"
          />

          <label className="mb-2 block text-sm font-medium text-slate-400">Kulüp Adı</label>
          <input
            value={game.club}
            onChange={(e) => onUpdateClub(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none"
          />
        </div>

        <div className="flex-1 rounded-3xl border border-slate-800 bg-[#111] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">Ekipman</h2>
            <span className="text-sm text-slate-400">{currentEq.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {equipment.map((eq) => {
              const active = eq.id === game.eq;
              const disabled = eq.id < game.eq || game.cash < eq.price;

              return (
                <button
                  key={eq.id}
                  onClick={() => onBuyEquipment(eq.id)}
                  disabled={active || disabled}
                  className={`rounded-2xl px-3 py-3 text-sm font-semibold ${
                    active
                      ? "bg-white text-black"
                      : disabled
                      ? "bg-slate-900 text-slate-500"
                      : "bg-slate-800 text-white"
                  }`}
                >
                  <div>{eq.name}</div>
                  <div className="mt-1 text-xs">{money(eq.price)}</div>
                </button>
              );
            })}
          </div>

          {nextEq && (
            <div className="mt-4 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-300">
              Sonraki seviye: <span className="text-white">{nextEq.name}</span> • {money(nextEq.price)}
            </div>
          )}

          <button
            onClick={onResetGame}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-rose-600 to-rose-400 px-5 py-4 text-base font-semibold text-white"
          >
            Oyunu Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
}