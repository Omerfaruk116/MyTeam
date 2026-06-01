import PlayerCard from "./PlayerCard";

const TeamScreen = ({ players }) => {
  return (
    <div
      style={{
        padding: "20px",
        color: "white"
      }}
    >
      <h1>Kadro</h1>

      <div
        style={{
          marginTop: "20px"
        }}
      >
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamScreen;