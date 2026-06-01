const SettingsScreen = () => {
  return (
    <div
      style={{
        padding: "20px",
        color: "white"
      }}
    >
      <h1>Ayarlar</h1>

      <div
        style={{
          marginTop: "20px",
          background: "#1e293b",
          borderRadius: "16px",
          padding: "20px"
        }}
      >
        <h3>🎮 Oyun Ayarları</h3>

        <p>🔊 Ses: Açık</p>
        <p>🎵 Müzik: Açık</p>
        <p>🌍 Dil: Türkçe</p>
      </div>

      <div
        style={{
          marginTop: "20px",
          background: "#1e293b",
          borderRadius: "16px",
          padding: "20px"
        }}
      >
        <h3>ℹ️ Bilgiler</h3>

        <p>Oyun: EL TURCO Football Manager</p>
        <p>Sürüm: 1.0</p>
        <p>Geliştirici: L.M. PRODUCTION</p>
      </div>
    </div>
  );
};

export default SettingsScreen;