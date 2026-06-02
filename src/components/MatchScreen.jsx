const MatchScreen = ({
  game,
  lastMatch,
  onPlayMatch
}) => {
  const formPlayers = [...game.players]
    .sort((a, b) => b.form - a.form)
    .slice(0, 5);

  return (
    <div className="screen">
      <div className="hero-panel">
        <div>
          <p className="small-title">
            MAÇ MERKEZİ
          </p>

          <h1>{game.league.name}</h1>

          <p>
            Hazır olduğunda maçı başlat.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={onPlayMatch}
        >
          ⚽ Maça Başla
        </button>
      </div>

      <div
        className="dashboard-grid"
        style={{
          marginTop: "14px"
        }}
      >
        <div className="panel">
          <h2>🔥 Kendini İyi Hissedenler</h2>

          {formPlayers.map((player) => (
            <div
              key={player.id}
              className="mini-player"
            >
              <span>{player.name}</span>

              <strong>
                {player.rating}
              </strong>

              <small>
                Form {player.form}
              </small>
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>📊 Son Maç</h2>

          {!lastMatch && (
            <p>
              Henüz maç oynanmadı.
            </p>
          )}

          {lastMatch && (
            <>
              <p>
                Rakip:
                {" "}
                {lastMatch.opponent.name}
              </p>

              <p>
                Skor:
                {" "}
                {lastMatch.homeGoals}
                {" - "}
                {lastMatch.awayGoals}
              </p>

              <p>
                Taraftar:
                {" "}
                {lastMatch.attendance.toLocaleString()}
              </p>

              <p>
                Gelir:
                {" "}
                $
                {lastMatch.income.toLocaleString()}
              </p>
            </>
          )}
        </div>

        <div className="panel wide-panel">
          <h2>📰 Maç Olayları</h2>

          {!lastMatch && (
            <p>
              Maç oynandığında olaylar burada
              görünecek.
            </p>
          )}

          {lastMatch &&
            lastMatch.events.map(
              (event, index) => (
                <div
                  key={index}
                  className="news-line"
                >
                  {event.minute}'
                  {" "}
                  {event.text}
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default MatchScreen;