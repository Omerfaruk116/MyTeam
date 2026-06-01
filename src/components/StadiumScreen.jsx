import { stadiumLevels } from "../data/stadiums";

const StadiumScreen = ({ club }) => {
  const currentStadium =
    stadiumLevels.find((stadium) => stadium.level === club.stadiumLevel) ||
    stadiumLevels[0];

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Stadyum</h1>

      <div
        style={{
          marginTop: "20px",
          background: "linear-gradient(135deg, #064e3b, #0f172a)",
          borderRadius: "24px",
          padding: "30px",
          border: "2px solid #22c55e"
        }}
      >
        <h2>{currentStadium.name}</h2>

        <p>🏟️ Seviye: {currentStadium.level}</p>
        <p>👥 Kapasite: {currentStadium.capacity.toLocaleString()}</p>
        <p>💰 Maç Geliri: ${currentStadium.income.toLocaleString()}</p>
        <p>⭐ Prestij Katkısı: {currentStadium.prestige}</p>

        <button
          style={{
            marginTop: "20px",
            background: "#f59e0b",
            color: "black",
            border: "none",
            padding: "12px 20px",
            borderRadius: "12px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Geliştir
        </button>
      </div>
    </div>
  );
};

export default StadiumScreen;