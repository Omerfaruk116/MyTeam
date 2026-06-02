import Avatar from "./Avatar";

const PlayerCard = ({
  player,
  onBuy,
  onSell,
  showBuyButton = false,
  showSellButton = false
}) => {
  return (
    <div className="player-card">
      <div className="player-rating">
        {player.rating}
      </div>

      <Avatar avatar={player.avatar} />

      <div className="player-name">
        {player.name}
      </div>

      <div className="player-meta">
        {player.position} • {player.age} Yaş
      </div>

      <div className="player-meta">
        {player.nationality}
      </div>

      <div className="player-stats">
        <div>⚡ {player.stats.pace}</div>
        <div>🎯 {player.stats.shooting}</div>
        <div>🎮 {player.stats.passing}</div>
        <div>🛡️ {player.stats.defending}</div>
        <div>💪 {player.stats.physical}</div>
        <div>⭐ {player.potential}</div>
      </div>

      <div
        style={{
          marginTop: "10px",
          fontWeight: "bold"
        }}
      >
        💰 ${player.value.toLocaleString()}
      </div>

      {showBuyButton && (
        <button
          className="primary-btn"
          style={{
            width: "100%",
            marginTop: "10px"
          }}
          onClick={() => onBuy(player.id)}
        >
          Satın Al
        </button>
      )}

      {showSellButton && (
        <button
          className="danger-btn"
          style={{
            width: "100%",
            marginTop: "10px"
          }}
          onClick={() => onSell(player.id)}
        >
          Sat
        </button>
      )}
    </div>
  );
};

export default PlayerCard;