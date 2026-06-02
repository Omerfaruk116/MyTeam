import PlayerCard from "./PlayerCard";

const YouthAcademyScreen = ({
  game,
  onPromoteYouth
}) => {
  return (
    <div className="screen">
      <div className="hero-panel">
        <div>
          <p className="small-title">
            ALTYAPI AKADEMİSİ
          </p>

          <h1>🌱 Genç Yetenekler</h1>

          <p>
            Kulübün geleceği burada yetişiyor.
          </p>
        </div>
      </div>

      <div
        className="panel"
        style={{
          marginTop: "14px"
        }}
      >
        <h2>📋 Akademi Bilgisi</h2>

        <p>
          Her sezon yeni genç oyuncular gelir.
        </p>

        <p>
          Genç oyuncuların potansiyeli daha yüksektir.
        </p>

        <p>
          Bedava yetişirler ve kulübün geleceğini oluştururlar.
        </p>
      </div>

      <div
        className="player-grid"
        style={{
          marginTop: "14px"
        }}
      >
        {game.youthPlayers.map((player) => (
          <div key={player.id}>
            <PlayerCard player={player} />

            <button
              className="primary-btn"
              style={{
                width: "100%",
                marginTop: "8px"
              }}
              onClick={() =>
                onPromoteYouth(player.id)
              }
            >
              ⬆️ A Takıma Yükselt
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouthAcademyScreen;