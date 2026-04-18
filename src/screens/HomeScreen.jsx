import React from "react";

function MetricCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111] p-4 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}

export default function HomeScreen({
  game,
  team,
  stars,
  money,
  onStartClub,
  onQuickMatch,
  onOpenMatch,
  sponsor,
}) {
  return (
    <div className="h-full overflow-hidden p-4">
      <div className="mx-auto flex h-full max-w-md flex-col gap-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 shadow-2xl shadow-cyan-500/10">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">EL TURCO L.M. PRODUCTION</p>
          <h1 className="mt-2 text-3xl font-black">{game.club}</h1>
          <p className="mt-1 text-sm text-slate-400">
            Menajer: <span className="text-white">{game.manager}</span>
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <MetricCard label="Bakiye" value={money(game.cash)} />
            <MetricCard label="Taraftar" value={game.fans} />
            <MetricCard label="Moral" value={game.morale} />
            <MetricCard label="Yıldız" value={stars.toFixed(1)} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={onStartClub}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-4 text-lg font-semibold text-white shadow-lg"
          >
            {game.started ? "Kulüp Aktif" : "Kulübü Başlat"}
          </button>

          <button
            onClick={onQuickMatch}
            className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-400 px-5 py-4 text-lg font-semibold text-white shadow-lg"
          >
            Hızlı Maç
          </button>

          <button
            onClick={onOpenMatch}
            className="rounded-2xl bg-gradient-to-r from-sky-600 to-sky-400 px-5 py-4 text-lg font-semibold text-white shadow-lg"
          >
            Maç Merkezi
          </button>

          <div className="rounded-2xl bg-[#111] px-5 py-4 text-left shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Son Hedef</div>
            <div className="mt-2 text-sm text-white">
              Lig 3'te kal, kupada 10 maçı tamamla.
            </div>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-[#111] p-4">
            <h2 className="mb-3 text-lg font-bold">Takım Gücü</h2>
            <div className="space-y-2 text-sm text-slate-300">
              <div>Hız: <span className="text-white">{team.speed}</span></div>
              <div>Güç: <span className="text-white">{team.power}</span></div>
              <div>Kondisyon: <span className="text-white">{team.stamina}</span></div>
              <div>Teknik: <span className="text-white">{team.technique}</span></div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#111] p-4">
            <h2 className="mb-3 text-lg font-bold">Son Maç</h2>
            {game.lastMatch ? (
              <div className="space-y-2 text-sm text-slate-300">
                <div>Rakip: <span className="text-white">{game.lastMatch.opponent}</span></div>
                <div>Skor: <span className="text-white">{game.lastMatch.gf}-{game.lastMatch.ga}</span></div>
                <div>Sonuç: <span className="text-white">{game.lastMatch.result}</span></div>
                <div>Ödül: <span className="text-white">{money(game.lastMatch.prize)}</span></div>
              </div>
            ) : (
              <div className="text-sm text-slate-400">Henüz maç oynanmadı.</div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#111] p-4 sm:col-span-2">
            <h2 className="mb-3 text-lg font-bold">Gündem</h2>
            {sponsor ? (
              <div className="text-sm text-slate-300">
                Yeni sponsor teklifi var: <span className="text-white">{sponsor.company}</span>
              </div>
            ) : (
              <div className="space-y-2">
                {game.log.slice(0, 3).map((line, i) => (
                  <div key={i} className="rounded-2xl bg-slate-950 px-3 py-2 text-sm text-slate-300">
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}