import PlayerCard from "./PlayerCard";

const TransferScreen = ({ transferMarket = [] }) => {
  return (
    <div
      style={{
        padding: "20px",
        color: "white"
      }}
    >
      <h1>Transfer Pazarı</h1>

      <div
        style={{
          marginTop: "20px"
        }}
      >
        {transferMarket.map((player) => (
          <div
            key={player.id}
            style={{
              marginBottom: "15px"
            }}
          >
            <PlayerCard player={player} />

            <div
              style={{
                background: "#1e293b",
                padding: "10px",
                borderRadius: "12px",
                marginTop: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span>
                💰 ${player.value.toLocaleString()}
              </span>

              <button
                style={{
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Satın Al
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransferScreen;