const LeagueScreen = ({ game }) => {
  const teams = [...game.leagueTable].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;

    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;

    return diffB - diffA;
  });

  const scorers = [...game.players]
    .sort((a, b) => (b.goals || 0) - (a.goals || 0))
    .slice(0, 10);

  const assists = [...game.players]
    .sort((a, b) => (b.assists || 0) - (a.assists || 0))
    .slice(0, 10);

  return (
    <div className="screen">
      <div className="hero-panel">
        <div>
          <p className="small-title">LİG MERKEZİ</p>
          <h1>🏆 {game.league.name}</h1>
          <p>
            Sezon {game.season} • Hafta {game.week}
          </p>
        </div>
      </div>

      <div
        className="panel"
        style={{ marginTop: "14px" }}
      >
        <h2>📊 Puan Durumu</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Takım</th>
              <th>O</th>
              <th>G</th>
              <th>B</th>
              <th>M</th>
              <th>AV</th>
              <th>P</th>
            </tr>
          </thead>

          <tbody>
            {teams.map((team, index) => (
              <tr
                key={team.id}
                style={{
                  background: team.isUser
                    ? "rgba(34,197,94,0.18)"
                    : "transparent"
                }}
              >
                <td>{index + 1}</td>
                <td>{team.name}</td>
                <td>{team.played}</td>
                <td>{team.wins}</td>
                <td>{team.draws}</td>
                <td>{team.losses}</td>
                <td>
                  {team.goalsFor - team.goalsAgainst}
                </td>
                <td>
                  <strong>{team.pts}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
          marginTop: "14px"
        }}
      >
        <div className="panel">
          <h2>⚽ Gol Krallığı</h2>

          {scorers.map((player, index) => (
            <div
              key={player.id}
              className="mini-player"
            >
              <span>
                {index + 1}. {player.name}
              </span>

              <strong>
                {player.goals || 0} Gol
              </strong>
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>🎯 Asist Krallığı</h2>

          {assists.map((player, index) => (
            <div
              key={player.id}
              className="mini-player"
            >
              <span>
                {index + 1}. {player.name}
              </span>

              <strong>
                {player.assists || 0} Asist
              </strong>
            </div>
          ))}
        </div>
      </div>

      <div
        className="panel"
        style={{ marginTop: "14px" }}
      >
        <h2>📅 Fikstür</h2>

        {game.fixtures.map((fixture) => (
          <div
            key={fixture.week}
            className="mini-player"
          >
            <span>
              Hafta {fixture.week}
            </span>

            <strong>
              {fixture.home} vs {fixture.away}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeagueScreen;