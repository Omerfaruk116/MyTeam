const menuItems = [
  { key: "home", label: "🏠 Ana Sayfa" },
  { key: "team", label: "👥 Kadro" },
  { key: "formation", label: "⚽ Diziliş" },
  { key: "match", label: "🎮 Maç Merkezi" },
  { key: "league", label: "🏆 Lig" },
  { key: "weekly", label: "⭐ Haftanın 11'i" },
  { key: "transfer", label: "💰 Transfer" },
  { key: "stadium", label: "🏟️ Stadyum" },
  { key: "sponsor", label: "🤝 Sponsor" },
  { key: "youth", label: "🌱 Altyapı" },
  { key: "history", label: "📖 Tarih" },
  { key: "achievements", label: "🏅 Başarılar" },
  { key: "settings", label: "⚙️ Ayarlar" }
];

const BottomNav = ({ screen, setScreen }) => {
  return (
    <aside className="side-nav">
      {menuItems.map((item) => (
        <button
          key={item.key}
          className={`nav-btn ${
            screen === item.key ? "active" : ""
          }`}
          onClick={() => setScreen(item.key)}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
};

export default BottomNav;