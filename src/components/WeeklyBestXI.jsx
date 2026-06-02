import PlayerCard from "./PlayerCard";

const WeeklyBestXI = ({ game }) => {
  const players = game.weeklyBestXI || [];

  return (
    <div className="screen">
      <div className="hero-panel">
        <div>
          <p className="small-title">
            HAFTANIN KADROSU
          </p>

          <h1>⭐ En İyi 11</h1>

          <p>
            Bu hafta en iyi performans
            gösteren futbolcular.
          </p>
        </div>
      </div>

      {players.length === 0 && (
        <div
          className="panel"
          style={{
            marginTop: "14px"
          }}
        >
          İlk maçı oynadıktan sonra
          haftanın kadrosu oluşacak.
        </div>
      )}

      <div
        className="player-grid"
        style={{
          marginTop: "14px"
        }}
      >
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
          />
        ))}
      </div>
    </div>
  );
};

export default WeeklyBestXI;