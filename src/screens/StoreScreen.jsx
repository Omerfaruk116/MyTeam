import React, { useState } from "react";

export default function StoreScreen({
  game,
  fanStoreItems,
  cashShop,
  sponsor,
  money,
  onBuyFanStoreStock,
  onCollectFanStoreRevenue,
  onAcceptSponsor,
  onRejectSponsor,
}) {
  const [tab, setTab] = useState("fan");

  return (
    <div className="h-full overflow-hidden p-4">
      <div className="mx-auto flex h-full max-w-md flex-col gap-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
          <h1 className="text-2xl font-black">Store</h1>
          <p className="mt-1 text-sm text-slate-400">Taraftar mağazası + cash shop</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setTab("fan")}
              className={`rounded-2xl px-3 py-3 text-sm font-semibold ${tab === "fan" ? "bg-white text-black" : "bg-[#111] text-slate-300"}`}
            >
              Taraftar Mağazası
            </button>
            <button
              onClick={() => setTab("cash")}
              className={`rounded-2xl px-3 py-3 text-sm font-semibold ${tab === "cash" ? "bg-white text-black" : "bg-[#111] text-slate-300"}`}
            >
              Cash Shop
            </button>
          </div>
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

        {tab === "fan" && (
          <div className="flex-1 rounded-3xl border border-slate-800 bg-[#111] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">Taraftar Mağazası</h2>
              <div className="text-sm text-slate-400">Gelir: {money(game.storeRevenue)}</div>
            </div>

            <div className="space-y-3">
              {fanStoreItems.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-xs text-slate-500">
                        Stok maliyeti: {money(item.stockCost)} • Satış fiyatı: {money(item.sellPrice)}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">Stok: {game.stock[item.id]}</div>
                    </div>

                    <button
                      onClick={() => onBuyFanStoreStock(item.id)}
                      className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Stokla
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onCollectFanStoreRevenue}
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-4 text-base font-semibold text-white"
            >
              Günlük Geliri Topla
            </button>
          </div>
        )}

        {tab === "cash" && (
          <div className="flex-1 rounded-3xl border border-slate-800 bg-[#111] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">Cash Shop</h2>
              <div className="text-sm text-slate-400">Elmas: {game.gems}</div>
            </div>

            <div className="mb-4">
              <div className="mb-2 text-sm font-semibold text-slate-300">Elmas Paketleri</div>
              <div className="space-y-3">
                {cashShop.gems.map((pack) => (
                  <div key={pack.id} className={`rounded-2xl p-4 ${pack.featured ? "bg-emerald-950/40 border border-emerald-400/20" : "bg-slate-950"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{pack.title}</div>
                        <div className="text-xs text-slate-500">{pack.gems} elmas</div>
                      </div>
                      <button className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white">
                        {pack.priceLabel}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold text-slate-300">El Turco Özel Teklifleri</div>
              <div className="space-y-3">
                {cashShop.elTurco.map((offer) => (
                  <div key={offer.id} className={`rounded-2xl p-4 ${offer.featured ? "bg-yellow-950/30 border border-yellow-400/20" : "bg-slate-950"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{offer.title}</div>
                        <div className="text-xs text-slate-500">
                          {offer.featured ? "Kampanya teklifi" : "Premium özel oyuncu"}
                        </div>
                      </div>
                      <button className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white">
                        {offer.priceLabel}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-950 px-3 py-3 text-xs text-slate-500">
              Not: Gerçek ödeme sistemi mobil aşamada bağlanacak.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}