import { useState } from "react";
import PlayerCard from "./PlayerCard";

const positionGroups = {
  GK: ["GK"],
  DEF: ["LB", "CB", "RB"],
  MID: ["CDM", "CM", "CAM"],
  ATT: ["LW", "RW", "ST"]
};

const formationSlots = [
  { id: "ST1", label: "ST", group: "ATT" },
  { id: "LW", label: "LW", group: "ATT" },
  { id: "RW", label: "RW", group: "ATT" },

  { id: "CM1", label: "CM", group: "MID" },
  { id: "CM2", label: "CM", group: "MID" },
  { id: "CAM", label: "CAM", group: "MID" },

  { id: "LB", label: "LB", group: "DEF" },
  { id: "CB1", label: "CB", group: "DEF" },
  { id: "CB2", label: "CB", group: "DEF" },
  { id: "RB", label: "RB", group: "DEF" },

  { id: "GK", label: "GK", group: "GK" }
];

const FormationScreen = ({ game, updateGame }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  const getPlayer = (id) =>
    game.players.find((player) => player.id === id);

  const selectedPlayer = getPlayer(selectedPlayerId);

  const startingPlayers = game.startingXI
    .map((id) => getPlayer(id))
    .filter(Boolean);

  const benchPlayers = game.bench
    .map((id) => getPlayer(id))
    .filter(Boolean);

  const otherPlayers = game.players.filter(
    (player) =>
      !game.startingXI.includes(player.id) &&
      !game.bench.includes(player.id)
  );

  const canPlacePlayer = (slot) => {
    if (!selectedPlayer) return false;

    return positionGroups[slot.group].includes(
      selectedPlayer.position
    );
  };

  const handleSlotClick = (slot, currentPlayer) => {
    if (!selectedPlayer) return;
    if (!canPlacePlayer(slot)) return;

    const newStartingXI = game.startingXI.filter(
      (id) => id !== selectedPlayer.id
    );

    if (currentPlayer) {
      newStartingXI.push(currentPlayer.id);
    }

    const slotIndex = formationSlots.findIndex(
      (item) => item.id === slot.id
    );

    newStartingXI[slotIndex] = selectedPlayer.id;

    updateGame({
      ...game,
      startingXI: newStartingXI.slice(0, 11),
      bench: game.bench.filter(
        (id) => id !== selectedPlayer.id
      )
    });

    setSelectedPlayerId(null);
  };

  const handleAutoBestXI = () => {
    const sorted = [...game.players]
      .filter((player) => !player.injured && !player.suspended)
      .sort((a, b) => b.rating - a.rating);

    updateGame({
      ...game,
      startingXI: sorted.slice(0, 11).map((player) => player.id),
      bench: sorted.slice(11, 18).map((player) => player.id)
    });
  };

  return (
    <div className="screen">
      <div className="hero-panel">
        <div>
          <p className="small-title">DİZİLİŞ</p>
          <h1>⚽ İlk 11 Yönetimi</h1>
          <p>
            Oyuncu seç, sahadaki uygun mevkiye yerleştir.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={handleAutoBestXI}
        >
          En İyi 11 Kur
        </button>
      </div>

      <div
        className="field-layout"
        style={{ marginTop: "14px" }}
      >
        <div className="pitch">
          {formationSlots.map((slot, index) => {
            const player = startingPlayers[index];
            const allowed = canPlacePlayer(slot);

            return (
              <div
                key={slot.id}
                className="position-slot"
                onClick={() => handleSlotClick(slot, player)}
                style={{
                  opacity:
                    selectedPlayer && !allowed ? 0.35 : 1,
                  cursor:
                    selectedPlayer && allowed
                      ? "pointer"
                      : "default"
                }}
              >
                <strong>{slot.label}</strong>

                <br />

                {player ? (
                  <>
                    {player.name}
                    <br />
                    <span>{player.rating}</span>
                  </>
                ) : (
                  <span>Boş</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="panel">
          <h2>📋 Oyuncular</h2>

          <p style={{ marginBottom: "10px" }}>
            Seçili oyuncu:{" "}
            {selectedPlayer ? selectedPlayer.name : "Yok"}
          </p>

          <h3>İlk 11</h3>
          {startingPlayers.map((player) => (
            <div
              key={player.id}
              className="mini-player"
              onClick={() => setSelectedPlayerId(player.id)}
              style={{
                cursor: "pointer",
                outline:
                  selectedPlayerId === player.id
                    ? "2px solid #22c55e"
                    : "none"
              }}
            >
              <span>{player.name}</span>
              <strong>{player.position}</strong>
              <small>{player.rating}</small>
            </div>
          ))}

          <h3 style={{ marginTop: "12px" }}>Yedekler</h3>
          {benchPlayers.map((player) => (
            <div
              key={player.id}
              className="mini-player"
              onClick={() => setSelectedPlayerId(player.id)}
              style={{
                cursor: "pointer",
                outline:
                  selectedPlayerId === player.id
                    ? "2px solid #22c55e"
                    : "none"
              }}
            >
              <span>{player.name}</span>
              <strong>{player.position}</strong>
              <small>{player.rating}</small>
            </div>
          ))}

          <h3 style={{ marginTop: "12px" }}>Kadro Dışı</h3>
          {otherPlayers.map((player) => (
            <div
              key={player.id}
              className="mini-player"
              onClick={() => setSelectedPlayerId(player.id)}
              style={{
                cursor: "pointer",
                outline:
                  selectedPlayerId === player.id
                    ? "2px solid #22c55e"
                    : "none"
              }}
            >
              <span>{player.name}</span>
              <strong>{player.position}</strong>
              <small>{player.rating}</small>
            </div>
          ))}
        </div>
      </div>

      <div
        className="player-grid"
        style={{ marginTop: "14px" }}
      >
        {game.players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default FormationScreen;