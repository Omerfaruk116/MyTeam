import React, { useEffect, useState } from "react";

export default function IntroScreen({ onComplete }) {
  const [stage, setStage] = useState(0);
  const [hitL, setHitL] = useState(false);
  const [hitM, setHitM] = useState(false);
  const [impactFlash, setImpactFlash] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    const t3 = setTimeout(() => {
      setHitL(true);
      setImpactFlash(true);
      setTimeout(() => setImpactFlash(false), 180);
    }, 2300);
    const t4 = setTimeout(() => {
      setHitM(true);
      setImpactFlash(true);
      setTimeout(() => setImpactFlash(false), 180);
    }, 3000);
    const t5 = setTimeout(() => setStage(3), 4200);
    const t6 = setTimeout(() => onComplete(), 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white transition-opacity duration-700 ${
        stage === 3 ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-white transition-opacity duration-200 ${
          impactFlash ? "opacity-10" : "opacity-0"
        }`}
      />

      <div
        className={`text-center transition-transform duration-150 ${
          impactFlash ? "scale-[1.02]" : "scale-100"
        }`}
      >
        <h1
          className={`text-5xl font-black tracking-[0.25em] transition-all duration-700 md:text-7xl ${
            stage >= 1 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          EL TURCO
        </h1>

        <div
          className={`relative mt-5 text-3xl font-semibold tracking-[1.2em] transition-all duration-700 md:text-4xl ${
            stage >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span className="relative inline-block px-8">
            <span className="mx-4">L</span>
            <span className="mx-4">M</span>

            {hitL && (
              <div className="absolute left-[18%] top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-black shadow-[0_0_12px_rgba(255,255,255,0.35)]">
                <div className="absolute left-1/2 top-1/2 h-8 w-[1px] -translate-x-1/2 -translate-y-1/2 rotate-12 bg-white/70" />
                <div className="absolute left-1/2 top-1/2 h-8 w-[1px] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white/70" />
                <div className="absolute left-1/2 top-1/2 h-6 w-[1px] -translate-x-1/2 -translate-y-1/2 rotate-90 bg-white/50" />
              </div>
            )}

            {hitM && (
              <div className="absolute right-[18%] top-1/2 h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-black shadow-[0_0_12px_rgba(255,255,255,0.35)]">
                <div className="absolute left-1/2 top-1/2 h-8 w-[1px] -translate-x-1/2 -translate-y-1/2 -rotate-12 bg-white/70" />
                <div className="absolute left-1/2 top-1/2 h-8 w-[1px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/70" />
                <div className="absolute left-1/2 top-1/2 h-6 w-[1px] -translate-x-1/2 -translate-y-1/2 rotate-90 bg-white/50" />
              </div>
            )}
          </span>
        </div>

        <p
          className={`mt-8 text-xs uppercase tracking-[0.6em] text-slate-400 transition-opacity duration-700 ${
            stage >= 2 ? "opacity-100" : "opacity-0"
          }`}
        >
          L.M. Production
        </p>
      </div>
    </div>
  );
}