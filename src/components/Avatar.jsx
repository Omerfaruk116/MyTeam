const Avatar = ({ player }) => {
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
        width: 70,
        height: 70,
        borderRadius: "50%",
        background: rarityColors[player.rarity],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "28px",
        fontWeight: "bold",
        color: "white",
        border: "3px solid rgba(255,255,255,0.3)"
      }}
    >
      {player.name.charAt(0)}
    </div>
  );
};

export default Avatar;