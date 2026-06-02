const LeagueScreen = ({ game }) => {
  const teams = [
    {
      name: game.club.clubName,
      pts:
        game.record.wins * 3 +
        game.record.draws,
      played:
        game.record.wins +
        game.record.draws +
        game.record.losses
    },

    {
      name: "Mahalle Yıldızları",
      pts: 14,
      played: 6
    },

    {
      name: "Demirspor",
      pts: 11,
      played: 6
    },

    {
      name: "Şehir Gençlik",
      pts: 9,
      played: 6
    },

    {
      name: "Kuzey Gücü",
      pts: 7,
      played: 6
    }
  ].sort((a, b) => b.pts - a.pts);

  return (
    <div className="screen">
      <div className="panel">
        <h2>🏆 {game.league.name}</h2>

        <p>
          Sezon {game.season}
        </p>
      </div>

      <div
        className="panel"
        style={{
          marginTop: "14px"
        }}
      >
        <table
          style={{
            width: "100%"
          }}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Takım</th>
              <th>O</th>
              <th>P</th>
            </tr>
          </thead>

          <tbody>
            {teams.map(
              (team, index) => (
                <tr key={team.name}>
                  <td>{index + 1}</td>

                  <td>
                    {team.name}
                  </td>

                  <td>
                    {team.played}
                  </td>

                  <td>
                    {team.pts}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div
        className="panel"
        style={{
          marginTop: "14px"
        }}
      >
        <h2>📈 Kulüp İstatistikleri</h2>

        <p>
          ✅ Galibiyet:
          {" "}
          {game.record.wins}
        </p>

        <p>
          🤝 Beraberlik:
          {" "}
          {game.record.draws}
        </p>

        <p>
          ❌ Mağlubiyet:
          {" "}
          {game.record.losses}
        </p>

        <p>
          ⚽ Atılan Gol:
          {" "}
          {game.record.goalsScored}
        </p>

        <p>
          🥅 Yenilen Gol:
          {" "}
          {game.record.goalsConceded}
        </p>
      </div>
    </div>
  );
};

export default LeagueScreen;