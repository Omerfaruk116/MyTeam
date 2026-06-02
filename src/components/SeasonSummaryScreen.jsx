const SeasonSummaryScreen = ({ summary, onFinishSeason }) => {
  return (
    <div className="screen">
      <div className="hero-panel">
        <div>
          <p className="small-title">SEZON ÖZETİ</p>
          <h1>📅 Sezon Tamamlandı</h1>
          <p>
            {summary
              ? summary.promoted
                ? `Tebrikler! ${summary.newLeague} ligine yükseldin.`
                : "Bu sezon aynı ligde devam ediyorsun."
              : "Henüz sezon bitmedi."}
          </p>
        </div>

        <button className="primary-btn" onClick={onFinishSeason}>
          Yeni Sezonu Bitir
        </button>
      </div>

      <div className="panel" style={{ marginTop: "14px" }}>
        <h2>👴 Emekli Olan Oyuncular</h2>

        {!summary || summary.retiredPlayers.length === 0 ? (
          <p>Bu sezon emekli olan oyuncu yok.</p>
        ) : (
          summary.retiredPlayers.map((player) => (
            <p key={player.id}>{player.name} emekli oldu.</p>
          ))
        )}
      </div>
    </div>
  );
};

export default SeasonSummaryScreen;