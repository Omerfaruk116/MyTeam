export default function TopBar({ money = 0, premiumCash = 0 }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-slate-900/90 p-4 shadow-lg">
      <div className="flex flex-wrap gap-3">
        <div className="rounded-2xl bg-amber-400 px-4 py-3 text-sm font-bold text-slate-900 shadow">
          Para: ${money.toLocaleString()}
        </div>

        <div className="rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-900 shadow">
          Nakit: {premiumCash}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="rounded-2xl bg-slate-700 px-4 py-3 text-sm font-semibold text-white">
          Ses
        </button>
        <button className="rounded-2xl bg-slate-700 px-4 py-3 text-sm font-semibold text-white">
          Menü
        </button>
        <button className="rounded-2xl bg-slate-700 px-4 py-3 text-sm font-semibold text-white">
          Kupa
        </button>
      </div>
    </div>
  );
}