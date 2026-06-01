import Avatar from "./Avatar";

const PlayerCard = ({ player }) => {
  const rarityColors = {
    common: "#94a3b8",
    rare: "#3b82f6",
    epic: "#a855f7",
    legendary: "#f59e0b",
    mvp: "#ef4444"
  };

  return (
    <div
      style={{
        background: "#1e293b",
        border: `2px solid ${rarityColors[player.rarity]}`,
        borderRadius: "16px",
        padding: "12px",
        color: "white",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        marginBottom: "10px"
      }}
    >
      <Avatar player={player} />

      <div style={{ flex: 1 }}>
        <h3
          style={{
            margin: 0,
            fontSize: "18px"
          }}
        >
          {player.name}
        </h3>

        <p
          style={{
            margin: "4px 0",
            color: "#cbd5e1"
          }}
        >
          {player.position} • {player.nationality}
        </p>

        <p
          style={{
            margin: "4px 0",
            color: "#cbd5e1"
          }}
        >
          Yaş: {player.age}
        </p>
      </div>

      <div
        style={{
          textAlign: "center"
        }}
      >
        <div
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: rarityColors[player.rarity]
          }}
        >
          {player.rating}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#94a3b8"
          }}
        >
          GENEL
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;