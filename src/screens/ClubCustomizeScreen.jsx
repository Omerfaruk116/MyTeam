import { useState } from "react";

const logoOptions = ["🦁", "🦅", "🐺", "🐯", "🛡️", "🦉"];
const colorOptions = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#7c3aed",
  "#f97316",
  "#0f172a",
  "#facc15",
  "#ec4899",
];

export default function ClubCustomizeScreen({ data, onSave, onBack }) {
  const [name, setName] = useState(data.club.name);
  const [logo, setLogo] = useState(data.club.logo || "🦁");
  const [primaryColor, setPrimaryColor] = useState(
    data.club.primaryColor || "#2563eb"
  );
  const [logoColor, setLogoColor] = useState(
    data.club.logoColor || "#facc15"
  );

  const saveClub = () => {
    const cleanName = name.trim();

    if (!cleanName) {
      alert("Önce takım adını yaz.");
      return;
    }

    onSave({
      name: cleanName,
      logo,
      primaryColor,
      logoColor,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-sky-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-3xl bg-slate-900/90 p-6 shadow-xl">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Kulüp Kimliği
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">
            Kulübünü Özelleştir
          </h1>
          <p className="mt-3 text-slate-300">
            Takım adını, logonu ve renklerini burada belirleyebilirsin.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl">
            <div className="mb-6">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                Takım Adı
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-lg font-semibold text-white outline-none"
              />
            </div>

            <div className="mb-6">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                Logo Simgesi
              </p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {logoOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLogo(item)}
                    className={`rounded-2xl p-4 text-3xl ${
                      logo === item
                        ? "bg-emerald-400 text-slate-950"
                        : "bg-slate-800"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                Forma Ana Rengi
              </p>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setPrimaryColor(color)}
                    className={`h-12 w-12 rounded-full border-4 ${
                      primaryColor === color
                        ? "border-white"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                Logo Rengi
              </p>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setLogoColor(color)}
                    className={`h-12 w-12 rounded-full border-4 ${
                      logoColor === color
                        ? "border-white"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={saveClub}
                className="rounded-3xl bg-emerald-400 px-6 py-4 text-lg font-black text-slate-950 shadow-lg"
              >
                Kulübü Kaydet
              </button>

              <button
                type="button"
                onClick={onBack}
                className="rounded-3xl bg-slate-700 px-6 py-4 text-lg font-bold text-white"
              >
                Geri Dön
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 shadow-xl backdrop-blur">
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-300">
              Önizleme
            </p>

            <div className="rounded-3xl bg-slate-900/90 p-6 shadow-lg">
              <div
                className="mb-6 rounded-3xl p-8 text-center"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="text-7xl" style={{ color: logoColor }}>
                  {logo}
                </div>
                <h2 className="mt-4 text-2xl font-black text-white">
                  {name}
                </h2>
              </div>

              <div className="grid gap-3">
                <div className="rounded-2xl bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">
                    Seçilen Logo
                  </p>
                  <p
                    className="mt-1 text-2xl font-black"
                    style={{ color: logoColor }}
                  >
                    {logo}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">
                    Forma Ana Rengi
                  </p>
                  <div
                    className="mt-2 h-8 w-24 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                </div>

                <div className="rounded-2xl bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">
                    Logo Rengi
                  </p>
                  <div
                    className="mt-2 h-8 w-24 rounded-full"
                    style={{ backgroundColor: logoColor }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}