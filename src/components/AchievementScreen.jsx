const achievements = [
  {
    title: "İlk Galibiyet",
    description: "İlk maçını kazan.",
    completed: true
  },
  {
    title: "100 Taraftar",
    description: "100 taraftara ulaş.",
    completed: true
  },
  {
    title: "İlk Transfer",
    description: "Transfer yap.",
    completed: false
  },
  {
    title: "İlk Sponsor",
    description: "Sponsor anlaşması imzala.",
    completed: false
  },
  {
    title: "Şampiyonluk",
    description: "Ligi kazan.",
    completed: false
  },
  {
    title: "Dünya Devi",
    description: "100 prestije ulaş.",
    completed: false
  }
];

const AchievementScreen = () => {
  return (
    <div
      style={{
        padding: "20px",
        color: "white"
      }}
    >
      <h1>Başarımlar</h1>

      <div style={{ marginTop: "20px" }}>
        {achievements.map((achievement, index) => (
          <div
            key={index}
            style={{
              background: "#1e293b",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "15px",
              border: achievement.completed
                ? "2px solid #22c55e"
                : "2px solid #475569"
            }}
          >
            <h3>
              {achievement.completed ? "🏆" : "🔒"}{" "}
              {achievement.title}
            </h3>

            <p>{achievement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementScreen;