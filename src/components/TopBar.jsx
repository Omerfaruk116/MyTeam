const TopBar = ({ game }) => {
  const club = game.club;

  return (
    <header className="top-bar">
      <div className="top-brand">
        <h2>{club.clubName}</h2>
        <small>{game.league.name}</small>
      </div>

      <div className="top-stats">
        <div>💰 ${club.money.toLocaleString()}</div>
        <div>👥 {club.fans.toLocaleString()}</div>
        <div>⭐ {club.prestige}</div>
        <div>📅 S{game.season} / H{game.week}</div>
      </div>
    </header>
  );
};

export default TopBar;