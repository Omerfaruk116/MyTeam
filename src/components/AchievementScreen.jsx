const AchievementScreen = ({ game }) => {
  const achievements = [
    {
      title: "İlk Galibiyet",
      completed: game.record.wins >= 1,
      reward: "$5.000"
    },
    {
      title: "10 Galibiyet",
      completed: game.record.wins >= 10,
      reward: "$50.000"
    },
    {
      title: "1000 Taraftar",
      completed: game.club.fans >= 1000,
      reward: "$25.000"
    },
    {
      title: "İlk Sponsor",
      completed: !!game.club.sponsor,
      reward: "$10.000"
    },
    {
      title: "Stadyum Seviye 5",
      completed: game.club.stadiumLevel >= 5,
      reward: "$250.000"
    },
    {
      title: "Üst Lige Yüksel",
      completed: game.league.level >= 2,
      reward: "$500.000"
    }
  ];

  return (
    <div className="screen">
      <div className="hero-panel">
        <div>
          <p className="small-title">BAŞARIMLAR</p>
          <h1>🏅 Kulüp Başarıları</h1>
          <p>Kulübünün ulaştığı kilometre taşları.</p>
        </div>
      </div>

      <div
        className="player-grid"
        style={{ marginTop: "14px" }}
      >
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="player-card"
          >
            <h3>{achievement.title}</h3>

            <p style={{ marginTop: "10px" }}>
              Ödül: {achievement.reward}
            </p>

            <div
              style={{
                marginTop: "15px",
                fontWeight: "bold",
                color: achievement.completed
                  ? "#22c55e"
                  : "#ef4444"
              }}
            >
              {achievement.completed
                ? "✅ Tamamlandı"
                : "❌ Kilitli"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementScreen;