const MatchScreen = ({
  homeGoals = 0,
  awayGoals = 0,
  events = []
}) => {
  return (
    <div
      style={{
        padding: "20px",
        color: "white"
      }}
    >
      <h1>Maç Merkezi</h1>

      <div
        style={{
          background: "#1e293b",
          borderRadius: "20px",
          padding: "25px",
          marginTop: "20px",
          textAlign: "center"
        }}
      >
        <h2
          style={{
            fontSize: "42px",
            margin: 0
          }}
        >
          {homeGoals} - {awayGoals}
        </h2>

        <p
          style={{
            color: "#94a3b8",
            marginTop: "10px"
          }}
        >
          Canlı Maç Sonucu
        </p>
      </div>

      <div
        style={{
          marginTop: "25px",
          background: "#1e293b",
          borderRadius: "20px",
          padding: "20px",
          maxHeight: "500px",
          overflowY: "auto"
        }}
      >
        <h2>Maç Olayları</h2>

        {events.length === 0 ? (
          <p
            style={{
              color: "#94a3b8"
            }}
          >
            Henüz olay bulunmuyor.
          </p>
        ) : (
          events.map((event, index) => (
            <div
              key={index}
              style={{
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "10px",
                background: "#334155"
              }}
            >
              <strong>{event.minute}'</strong> — {event.player}
              <br />
              <span
                style={{
                  color: "#cbd5e1"
                }}
              >
                {event.text}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MatchScreen;