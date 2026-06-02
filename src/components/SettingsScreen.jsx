const SettingsScreen = ({
  onResetGame
}) => {
  const handleReset = () => {
    const confirmed = window.confirm(
      "Tüm kariyer silinsin mi?"
    );

    if (confirmed) {
      onResetGame();
    }
  };

  return (
    <div className="screen">
      <div className="hero-panel">
        <div>
          <p className="small-title">
            AYARLAR
          </p>

          <h1>⚙️ Oyun Ayarları</h1>

          <p>
            Kariyer ve kayıt işlemleri.
          </p>
        </div>
      </div>

      <div
        className="panel"
        style={{
          marginTop: "14px"
        }}
      >
        <h2>💾 Kayıt Sistemi</h2>

        <p>
          Oyun otomatik olarak kaydedilir.
        </p>

        <p>
          Tarayıcı kapansa bile kariyer devam eder.
        </p>
      </div>

      <div
        className="panel"
        style={{
          marginTop: "14px"
        }}
      >
        <h2>🚨 Tehlikeli İşlemler</h2>

        <button
          className="danger-btn"
          onClick={handleReset}
        >
          Kariyeri Sıfırla
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;