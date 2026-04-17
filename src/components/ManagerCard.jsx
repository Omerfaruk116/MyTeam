function getAvatarPieces(manager) {
  const look = manager?.look || {};

  const hairMap = {
    "Kısa": "🧑",
    "Orta": "🧔",
    "Uzun": "🧑‍🎤",
    "Fade": "😎",
    "Kel": "🦲",
  };

  const beardMap = {
    "Yok": "Temiz yüz",
    "Kısa Sakal": "Kısa sakal",
    "Bıyık": "Bıyık",
    "Tam Sakal": "Tam sakal",
  };

  const glassesMap = {
    "Yok": "Gözlüksüz",
    "Klasik": "Klasik gözlük",
    "Sport": "Sport gözlük",
    "Siyah": "Siyah gözlük",
  };

  const outfitMap = {
    "Siyah Takım": "Siyah takım",
    "Mavi Takım": "Mavi takım",
    "Gri Takım": "Gri takım",
    "Eşofman": "Eşofman",
  };

  return {
    hairIcon: hairMap[look.hair] || "👔",
    beardText: beardMap[look.beard] || "Temiz yüz",
    glassesText: glassesMap[look.glasses] || "Gözlüksüz",
    outfitText: outfitMap[look.outfit] || "Standart kıyafet",
  };
}

export default function ManagerCard({ manager, club }) {
  const avatar = getAvatarPieces(manager);

  return (
    <div className="grid gap-4 rounded-3xl bg-slate-900/90 p-5 text-white shadow-xl md:grid-cols-[260px_1fr]">
      <div className="flex flex-col items-center justify-center rounded-3xl bg-slate-800 p-4">
        <div className="mb-3 flex h-40 w-40 items-center justify-center rounded-full bg-slate-700 text-6xl shadow-inner">
          {avatar.hairIcon}
        </div>

        <div className="text-center">
          <h2 className="text-xl font-black">{manager?.name || "Menajer"}</h2>
          <p className="text-sm text-slate-300">
            {manager?.title || "Futbol Direktörü"}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {manager?.country || "Türkiye"}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Kulüp
          </p>

          <h1 className="mt-2 flex items-center gap-3 text-3xl font-black">
            <span style={{ color: club?.logoColor || "#facc15" }}>
              {club?.logo || "🦁"}
            </span>
            <span>{club?.name || "Blue Crescent FC"}</span>
          </h1>

          <p className="mt-1 text-slate-300">
            {club?.country || "Türkiye"} • {club?.league || "Alt Lig 3"}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-slate-800 p-4">
            <p className="text-xs uppercase text-slate-400">Seviye</p>
            <p className="mt-2 text-2xl font-black">{manager?.level ?? 1}</p>
          </div>

          <div className="rounded-2xl bg-slate-800 p-4">
            <p className="text-xs uppercase text-slate-400">Ün</p>
            <p className="mt-2 text-2xl font-black">
              {manager?.reputation ?? 52}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800 p-4">
            <p className="text-xs uppercase text-slate-400">Taraftar</p>
            <p className="mt-2 text-2xl font-black">{club?.fans ?? 2500}</p>
          </div>

          <div className="rounded-2xl bg-slate-800 p-4">
            <p className="text-xs uppercase text-slate-400">Lig Sırası</p>
            <p className="mt-2 text-2xl font-black">{club?.rank ?? 7}.</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: club?.primaryColor || "#2563eb" }}
          >
            <p className="text-sm font-semibold text-white">Kulüp Morali</p>
            <p className="mt-1 text-2xl font-black text-white">
              {club?.morale || "İyi"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800 p-4">
            <p className="text-xs uppercase text-slate-400">Menajer Görünümü</p>
            <p className="mt-2 text-sm font-semibold text-slate-200">
              {avatar.beardText}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-300">
              {avatar.glassesText}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-300">
              {avatar.outfitText}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs uppercase text-slate-400">
                Kulüp renkleri
              </span>
              <span
                className="h-5 w-5 rounded-full border border-white/20"
                style={{ backgroundColor: club?.primaryColor || "#2563eb" }}
              />
              <span
                className="h-5 w-5 rounded-full border border-white/20"
                style={{ backgroundColor: club?.logoColor || "#facc15" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}