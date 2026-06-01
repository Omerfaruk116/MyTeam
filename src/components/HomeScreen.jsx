const HomeScreen = ({ club }) => {
  return (
    <div
      style={{
        color: "white",
        padding: "20px"
      }}
    >
      <h1
        style={{
          marginBottom: "20px"
        }}
      >
        {club.clubName}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px"
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "16px"
          }}
        >
          <h3>💰 Para</h3>
          <p>${club.money.toLocaleString()}</p>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "16px"
          }}
        >
          <h3>👥 Taraftar</h3>
          <p>{club.fans.toLocaleString()}</p>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "16px"
          }}
        >
          <h3>⭐ Prestij</h3>
          <p>{club.prestige}</p>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "16px"
          }}
        >
          <h3>🏟️ Stadyum</h3>
          <p>Seviye {club.stadiumLevel}</p>
        </div>
      </div>

      <div
        style={{
          marginTop: "25px",
          background: "#1e293b",
          padding: "20px",
          borderRadius: "16px"
        }}
      >
        <h2>Kulüp Bilgileri</h2>

        <p>🏆 Kupa Sayısı: {club.trophies}</p>
        <p>⚽ Atılan Gol: {club.goalsScored}</p>
        <p>🥅 Yenilen Gol: {club.goalsConceded}</p>
        <p>📅 Sezon: {club.season}</p>
      </div>
    </div>
  );
};

export default HomeScreen;