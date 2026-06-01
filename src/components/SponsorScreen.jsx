import { sponsors } from "../data/sponsors";

const SponsorScreen = ({ club }) => {
  return (
    <div
      style={{
        padding: "20px",
        color: "white"
      }}
    >
      <h1>Sponsorlar</h1>

      <div
        style={{
          marginTop: "20px"
        }}
      >
        {sponsors.map((sponsor) => {
          const available =
            club.prestige >= sponsor.prestigeRequired;

          return (
            <div
              key={sponsor.id}
              style={{
                background: "#1e293b",
                padding: "20px",
                borderRadius: "16px",
                marginBottom: "15px",
                border: available
                  ? "2px solid #22c55e"
                  : "2px solid #475569"
              }}
            >
              <h2>{sponsor.name}</h2>

              <p>
                💰 Haftalık Gelir: $
                {sponsor.weeklyIncome.toLocaleString()}
              </p>

              <p>
                ⭐ Gerekli Prestij:
                {" "}
                {sponsor.prestigeRequired}
              </p>

              <button
                disabled={!available}
                style={{
                  marginTop: "10px",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: available
                    ? "pointer"
                    : "not-allowed",
                  background: available
                    ? "#22c55e"
                    : "#475569",
                  color: "white",
                  fontWeight: "bold"
                }}
              >
                Anlaşma Yap
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SponsorScreen;