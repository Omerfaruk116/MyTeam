const TopBar = ({ club }) => {
  return (
    <div
      style={{
        height: "70px",
        background: "#0f172a",
        borderBottom: "2px solid #1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        color: "white"
      }}
    >
      <div>
        <h2
          style={{
            margin: 0
          }}
        >
          {club.clubName}
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          gap: "25px",
          alignItems: "center"
        }}
      >
        <div>
          💰 ${club.money.toLocaleString()}
        </div>

        <div>
          👥 {club.fans.toLocaleString()}
        </div>

        <div>
          ⭐ {club.prestige}
        </div>
      </div>
    </div>
  );
};

export default TopBar;