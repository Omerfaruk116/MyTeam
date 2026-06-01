const FormationScreen = ({ players }) => {
  const firstEleven = players.slice(0, 11);

  return (
    <div
      style={{
        padding: "20px",
        color: "white"
      }}
    >
      <h1>Diziliş</h1>

      <div
        style={{
          background: "#166534",
          borderRadius: "20px",
          minHeight: "600px",
          marginTop: "20px",
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px"
        }}
      >
        {firstEleven.map((player) => (
          <div
            key={player.id}
            style={{
              width: "120px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "10px",
              textAlign: "center"
            }}
          >
            <div
              style={{
                fontWeight: "bold"
              }}
            >
              {player.name}
            </div>

            <div
              style={{
                color: "#cbd5e1",
                marginTop: "5px"
              }}
            >
              {player.position}
            </div>

            <div
              style={{
                marginTop: "5px",
                color: "#fbbf24",
                fontWeight: "bold"
              }}
            >
              {player.rating}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormationScreen;