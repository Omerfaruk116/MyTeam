const LeagueScreen = () => {
  const teams = [
    { name: "EL TURCO FC", pts: 12, played: 5 },
    { name: "Blue Lions", pts: 10, played: 5 },
    { name: "Red Eagles", pts: 9, played: 5 },
    { name: "Golden Stars", pts: 7, played: 5 },
    { name: "Black Wolves", pts: 4, played: 5 }
  ];

  return (
    <div
      style={{
        padding: "20px",
        color: "white"
      }}
    >
      <h1>Lig Tablosu</h1>

      <div
        style={{
          background: "#1e293b",
          borderRadius: "20px",
          marginTop: "20px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "60px 1fr 80px 80px",
            padding: "15px",
            background: "#334155",
            fontWeight: "bold"
          }}
        >
          <div>#</div>
          <div>Takım</div>
          <div>O</div>
          <div>P</div>
        </div>

        {teams.map((team, index) => (
          <div
            key={team.name}
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 80px 80px",
              padding: "15px",
              borderBottom: "1px solid #334155"
            }}
          >
            <div>{index + 1}</div>
            <div>{team.name}</div>
            <div>{team.played}</div>
            <div>{team.pts}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeagueScreen;