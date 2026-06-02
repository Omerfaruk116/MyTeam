import PlayerCard from "./PlayerCard";

const TeamScreen = ({ game, onSellPlayer }) => {
  return (
    <div className="screen">
      <div className="panel">
        <h2>👥 A Takım Kadrosu</h2>

        <div
          style={{
            marginTop: "10px"
          }}
        >
          Toplam Oyuncu: {game.players.length}
        </div>
      </div>

      <div
        className="player-grid"
        style={{
          marginTop: "14px"
        }}
      >
        {game.players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            showSellButton
            onSell={onSellPlayer}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamScreen;