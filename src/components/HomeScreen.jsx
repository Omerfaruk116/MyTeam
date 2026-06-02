const HomeScreen = ({ game, teamPower, onPlayMatch, onFinishSeason }) => {
  const club = game.club;

  const bestPlayers = [...game.players]
    .sort((a, b) => b.form - a.form)
    .slice(0, 4);

  return (
    <div className="screen home-screen">
      <div className="hero-panel">
        <div>
          <p className="small-title">SEZON {game.season} • HAFTA {game.week}</p>
          <h1>{club.clubName}</h1>
          <p>{game.league.name} • Takım Gücü: {teamPower}</p>
        </div>

        <div className="hero-actions">
          <button className="primary-btn" onClick={onPlayMatch}>
            Maça Başla
          </button>

          <button className="secondary-btn" onClick={onFinishSeason}>
            Sezonu Bitir
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span>💰 Para</span>
          <strong>${club.money.toLocaleString()}</strong>
        </div>

        <div className="stat-card">
          <span>👥 Taraftar</span>
          <strong>{club.fans.toLocaleString()}</strong>
        </div>

        <div className="stat-card">
          <span>⭐ Prestij</span>
          <strong>{club.prestige}</strong>
        </div>

        <div className="stat-card">
          <span>🏟️ Stadyum</span>
          <strong>Seviye {club.stadiumLevel}</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h2>🏆 Kupa Vitrini</h2>

          <div className="trophy-row">
            {game.trophies.map((trophy) => (
              <div className="trophy-card" key={trophy.id}>
                <div className="trophy-icon">{trophy.icon}</div>
                <strong>{trophy.name}</strong>
                <span>x{trophy.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>🔥 Formda Oyuncular</h2>

          {bestPlayers.map((player) => (
            <div className="mini-player" key={player.id}>
              <span>{player.name}</span>
              <strong>{player.rating}</strong>
              <small>Form: {player.form}</small>
            </div>
          ))}
        </div>

        <div className="panel wide-panel">
          <h2>📰 Kulüp Haberleri</h2>

          {game.lastMessages.map((message, index) => (
            <p key={index} className="news-line">
              {message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;