import React from "react";

const TABS = [
  { key: "home", label: "Ana" },
  { key: "squad", label: "Kadro" },
  { key: "match", label: "Maç" },
  { key: "store", label: "Store" },
  { key: "club", label: "Kulüp" },
];

export default function BottomNav({ currentScreen, onChange }) {
  return (
    <div className="border-t border-slate-800 bg-slate-950 px-3 py-3">
      <div className="grid grid-cols-5 gap-2">
        {TABS.map((tab) => {
          const active = currentScreen === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`rounded-2xl px-2 py-3 text-sm font-semibold transition-all ${
                active ? "bg-white text-black" : "bg-[#111] text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}