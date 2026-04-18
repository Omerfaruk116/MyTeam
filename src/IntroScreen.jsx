import React, { useEffect, useState } from "react";

export default function IntroScreen({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 250);
    const t2 = setTimeout(() => setStage(2), 1400);
    const t3 = setTimeout(() => onComplete?.(), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white">
      <div className={`text-center transition-all duration-700 ${stage >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <h1 className="text-4xl font-black tracking-[0.25em] md:text-6xl">EL TURCO</h1>
        <p className={`mt-4 text-sm tracking-[0.6em] text-slate-400 transition-opacity duration-700 ${stage >= 2 ? "opacity-100" : "opacity-0"}`}>
          L.M. PRODUCTION
        </p>

        <button
          onClick={onComplete}
          className="mt-8 rounded-2xl border border-slate-700 px-4 py-2 text-xs text-slate-300"
        >
          ATLA
        </button>
      </div>
    </div>
  );
}