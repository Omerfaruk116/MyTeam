import React from "react";

export default function StoreScreen({
  game,
  storeItems,
  sponsor,
  money,
  onBuyStoreItem,
  onSellStoreDay,
  onAcceptSponsor,
  onRejectSponsor,
}) {
  return (
    <div className="h-full overflow-hidden p-4">
      <div className="mx-auto flex h-full max-w-md flex-col gap-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
          <h1 className="text-2xl font-black">Store</h1>
          <p className="mt-1 text-sm text-slate-400">Gelir: {money(game.storeRevenue)}</p>
        </div>

        {sponsor && (
          <div className="rounded-3xl border border-emerald-400/30 bg-[#111] p-4 shadow-[0_0_15px_rgba(16,185,129,0.12)]">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Sponsor</div>
            <div className="mt-2 text-lg font-bold text-white">{sponsor.company}</div>
            <div className="text-sm text-slate-400">{sponsor.title}</div>
            <div className="mt-3 rounded-2xl bg-slate-950 px-4 py-3 text-lg font-black">{money(sponsor.amount)}</div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={onAcceptSponsor}
                className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-400 px-4 py-3 text-sm font-semibold text-white"
              >
                Kabul Et
              </button>
              <button
                onClick={onRejectSponsor}
                className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white"
              >
                Reddet
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 rounded-3xl border border-slate-800 bg-[#111] p-4">
          <h2 className="mb-3 text-lg font-bold">Ürünler</h2>

          <div className="space-y-3">
            {storeItems.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-950 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-xs text-slate-500">Stok: {game.stock[item.id]}</div>
                  </div>
                  <button
                    onClick={() => onBuyStoreItem(item.id)}
                    className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
                  >
                    {money(item.buy)}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onSellStoreDay}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-4 text-base font-semibold text-white"
          >
            Günlük Satış Yap
          </button>
        </div>
      </div>
    </div>
  );
}