import { useState } from "react";

const countries = ["Türkiye", "Almanya", "Fransa", "Brezilya", "Arjantin"];
const hairs = ["Kısa", "Orta", "Uzun", "Fade", "Kel"];
const beards = ["Yok", "Kısa Sakal", "Bıyık", "Tam Sakal"];
const glassesList = ["Yok", "Klasik", "Sport", "Siyah"];
const outfits = ["Siyah Takım", "Mavi Takım", "Gri Takım", "Eşofman"];

function SelectButtons({ title, items, selected, onSelect }) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
        {title}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect(item)}
            className={`rounded-2xl px-4 py-3 text-left font-semibold transition ${
              selected === item
                ? "bg-emerald-400 text-slate-950 shadow-lg"
                : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ManagerCreateScreen({ onSave }) {
  const [name, setName] = useState("Ömer Faruk");
  const [country, setCountry] = useState("Türkiye");
  const [hair, setHair] = useState("Kısa");
  const [beard, setBeard] = useState("Yok");
  const [glasses, setGlasses] = useState("Yok");
  const [outfit, setOutfit] = useState("Siyah Takım");

  const saveManager = () => {
    const cleanName = name.trim();

    if (!cleanName) {
      alert("Önce menajer adını yaz.");
      return;
    }

    onSave({
      name: cleanName,
      title: "Futbol Direktörü",
      level: 1,
      reputation: 52,
      country,
      look: {
        hair,
        beard,
        glasses,
        outfit,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-sky-950 text-white">
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <div className="mb-6 rounded-3xl bg-slate-900/90 p-6 shadow-xl">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Kariyer Başlangıcı
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">
            Menajerini Oluştur
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Burada oluşturduğun menajer ana ekranda ve ileride kariyer
            ekranlarında görünecek.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl">
            <div className="mb-6">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                Menajer Adı
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 text-lg font-semibold text-white outline-none placeholder:text-slate-500"
                placeholder="Menajer adını yaz"
              />
            </div>

            <div className="mb-6">
              <SelectButtons
                title="Ülke"
                items={countries}
                selected={country}
                onSelect={setCountry}
              />
            </div>

            <div className="mb-6">
              <SelectButtons
                title="Saç"
                items={hairs}
                selected={hair}
                onSelect={setHair}
              />
            </div>

            <div className="mb-6">
              <SelectButtons
                title="Sakal"
                items={beards}
                selected={beard}
                onSelect={setBeard}
              />
            </div>

            <div className="mb-6">
              <SelectButtons
                title="Gözlük"
                items={glassesList}
                selected={glasses}
                onSelect={setGlasses}
              />
            </div>

            <div className="mb-6">
              <SelectButtons
                title="Kıyafet"
                items={outfits}
                selected={outfit}
                onSelect={setOutfit}
              />
            </div>

            <button
              type="button"
              onClick={saveManager}
              className="w-full rounded-3xl bg-emerald-400 px-6 py-4 text-lg font-black text-slate-950 shadow-lg"
            >
              Menajeri Kaydet
            </button>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 shadow-xl backdrop-blur">
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-300">
              Önizleme
            </p>

            <div className="rounded-3xl bg-slate-900/90 p-6 shadow-lg">
              <div className="mb-5 flex justify-center">
                <div className="flex h-48 w-48 items-center justify-center rounded-full bg-slate-800 text-7xl shadow-inner">
                  👔
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-black">{name || "Menajer"}</h2>
                <p className="mt-2 text-slate-300">{country}</p>
              </div>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">Saç</p>
                  <p className="mt-1 text-lg font-bold">{hair}</p>
                </div>

                <div className="rounded-2xl bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">Sakal</p>
                  <p className="mt-1 text-lg font-bold">{beard}</p>
                </div>

                <div className="rounded-2xl bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">Gözlük</p>
                  <p className="mt-1 text-lg font-bold">{glasses}</p>
                </div>

                <div className="rounded-2xl bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">Kıyafet</p>
                  <p className="mt-1 text-lg font-bold">{outfit}</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-blue-600/90 p-4">
                <p className="text-sm font-semibold">Başlangıç Durumu</p>
                <p className="mt-2 text-xl font-black">Seviye 1 • Ün 52</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}