const BottomNav = ({ currentScreen, setCurrentScreen }) => {
  const menuItems = [
    "Ana Sayfa",
    "Takım",
    "Diziliş",
    "Maç",
    "Lig",
    "Transfer",
    "Stadyum"
  ];

  return (
    <div
      style={{
        height: "80px",
        background: "#0f172a",
        borderTop: "2px solid #1e293b",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center"
      }}
    >
      {menuItems.map((item) => (
        <button
          key={item}
          onClick={() => setCurrentScreen(item)}
          style={{
            background:
              currentScreen === item
                ? "#22c55e"
                : "#1e293b",

            color: "white",

            border: "none",

            padding: "10px 14px",

            borderRadius: "10px",

            cursor: "pointer",

            fontWeight: "bold"
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default BottomNav;