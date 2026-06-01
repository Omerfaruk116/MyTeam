const HistoryScreen = ({ club }) => {
  return (
    <div
      style={{
        padding: "20px",
        color: "white"
      }}
    >
      <h1>Kulüp Tarihi</h1>

      <div
        style={{
          marginTop: "20px",
          background: "#1e293b",
          borderRadius: "16px",
          padding: "25px"
        }}
      >
        <h2>{club.clubName}</h2>

        <p>📅 Kuruluş Sezonu: 1</p>

        <p>🏆 Toplam Kupa: {club.trophies}</p>

        <p>⚽ Toplam Gol: {club.goalsScored}</p>

        <p>🥅 Yenilen Gol: {club.goalsConceded}</p>

        <p>✅ Galibiyet: {club.wins}</p>

        <p>🤝 Beraberlik: {club.draws}</p>

        <p>❌ Mağlubiyet: {club.losses}</p>

        <p>⭐ Prestij: {club.prestige}</p>

        <p>👥 Taraftar: {club.fans.toLocaleString()}</p>
      </div>

      <div
        style={{
          marginTop: "20px",
          background: "#1e293b",
          borderRadius: "16px",
          padding: "20px"
        }}
      >
        <h3>Kulüp Efsanesi</h3>

        <p>
          Bu bölüm ileride kulübün en golcü oyuncuları,
          en büyük transferleri ve en önemli başarılarını
          gösterecek.
        </p>
      </div>
    </div>
  );
};

export default HistoryScreen;