export default function MenuTile({ title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-3xl bg-white/95 p-5 text-left shadow-lg transition duration-200 hover:-translate-y-1 hover:bg-white active:scale-[0.99]"
    >
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
    </button>
  );
}