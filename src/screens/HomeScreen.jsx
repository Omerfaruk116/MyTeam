import TopBar from "../components/TopBar";
import ManagerCard from "../components/ManagerCard";
import MenuTile from "../components/MenuTile";

export default function HomeScreen({ data, onMenuClick, onResetCareer }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-900 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <div className="mb-6">
          <TopBar
            money={data.club.money}
            premiumCash={data.club.premiumCash}
          />
        </div>

        <div className="mb-4 flex flex-wrap justify-end gap-3">
          <button
            onClick={onResetCareer}
            className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-bold text-white"
          >
            Kariyeri Sıfırla
          </button>
        </div>

        <div className="mb-6">
          <ManagerCard manager={data.manager} club={data.club} />
        </div>

        <div className="mb-6 rounded-3xl bg-white/10 p-5 shadow-lg backdrop-blur">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
            Sonraki Maç
          </p>

          <div className="mt-3 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-800/90 p-4">
              <p className="text-xs uppercase text-slate-400">Tarih</p>
              <p className="mt-2 text-xl font-black">{data.nextMatch.date}</p>
            </div>

            <div className="rounded-2xl bg-slate-800/90 p-4">
              <p className="text-xs uppercase text-slate-400">Tür</p>
              <p className="mt-2 text-xl font-black">{data.nextMatch.type}</p>
            </div>

            <div className="rounded-2xl bg-slate-800/90 p-4">
              <p className="text-xs uppercase text-slate-400">Rakip</p>
              <p className="mt-2 text-xl font-black">
                {data.nextMatch.opponent}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-300">
            Kulüp Menüsü
          </p>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.menu.map((item) => (
              <MenuTile
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                onClick={() => onMenuClick(item.title)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}