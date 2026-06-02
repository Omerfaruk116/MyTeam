import { useMemo, useState } from "react";

const slots = [
  { id: "ST", label: "ST", group: "ATT", x: 50, y: 13 },
  { id: "LW", label: "LW", group: "ATT", x: 23, y: 25 },
  { id: "RW", label: "RW", group: "ATT", x: 77, y: 25 },

  { id: "CM1", label: "CM", group: "MID", x: 32, y: 47 },
  { id: "CAM", label: "CAM", group: "MID", x: 50, y: 40 },
  { id: "CM2", label: "CM", group: "MID", x: 68, y: 47 },

  { id: "LB", label: "LB", group: "DEF", x: 18, y: 70 },
  { id: "CB1", label: "CB", group: "DEF", x: 38, y: 74 },
  { id: "CB2", label: "CB", group: "DEF", x: 62, y: 74 },
  { id: "RB", label: "RB", group: "DEF", x: 82, y: 70 },

  { id: "GK", label: "GK", group: "GK", x: 50, y: 91 }
];

const positionGroups = {
  GK: ["GK"],
  DEF: ["LB", "CB", "RB"],
  MID: ["CDM", "CM", "CAM"],
  ATT: ["LW", "RW", "ST"]
};

const FormationScreen = ({ game, updateGame }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  const getPlayer = (id) => game.players.find((player) => player.id === id);
  const selectedPlayer = getPlayer(selectedPlayerId);

  const startingPlayers = useMemo(() => {
    return slots.map((slot, index) => getPlayer(game.startingXI[index]));
  }, [game.startingXI, game.players]);

  const benchPlayers = game.bench.map((id) => getPlayer(id)).filter(Boolean);

  const squadOutside = game.players.filter(
    (player) =>
      !game.startingXI.includes(player.id) &&
      !game.bench.includes(player.id)
  );

  const canPlace = (slot) => {
    if (!selectedPlayer) return false;
    return positionGroups[slot.group].includes(selectedPlayer.position);
  };

  const selectPlayer = (player) => {
    if (player.injured || player.suspended) return;
    setSelectedPlayerId(player.id);
  };

  const placePlayer = (slotIndex) => {
    const slot = slots[slotIndex];

    if (!selectedPlayer) return;
    if (!canPlace(slot)) return;

    const oldPlayerInSlot = game.startingXI[slotIndex];

    const nextStartingXI = [...game.startingXI];
    const nextBench = game.bench.filter((id) => id !== selectedPlayer.id);

    const oldIndex = nextStartingXI.findIndex((id) => id === selectedPlayer.id);
    if (oldIndex !== -1) {
      nextStartingXI[oldIndex] = null;
    }

    if (oldPlayerInSlot && oldPlayerInSlot !== selectedPlayer.id) {
      nextBench.unshift(oldPlayerInSlot);
    }

    nextStartingXI[slotIndex] = selectedPlayer.id;

    updateGame({
      ...game,
      startingXI: nextStartingXI.filter(Boolean).slice(0, 11),
      bench: nextBench.slice(0, 7)
    });

    setSelectedPlayerId(null);
  };

  const autoBestXI = () => {
    const available = [...game.players]
      .filter((player) => !player.injured && !player.suspended);

    const usedIds = [];

    const pickBest = (validPositions) => {
      const player = available
        .filter(
          (item) =>
            validPositions.includes(item.position) &&
            !usedIds.includes(item.id)
        )
        .sort((a, b) => b.rating - a.rating)[0];

      if (player) usedIds.push(player.id);
      return player?.id || null;
    };

    const nextStartingXI = slots.map((slot) =>
      pickBest(positionGroups[slot.group])
    );

    const nextBench = available
      .filter((player) => !usedIds.includes(player.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 7)
      .map((player) => player.id);

    updateGame({
      ...game,
      startingXI: nextStartingXI.filter(Boolean),
      bench: nextBench
    });

    setSelectedPlayerId(null);
  };

  const renderPlayerRow = (player) => (
    <div
      key={player.id}
      className="mini-player"
      onClick={() => selectPlayer(player)}
      style={{
        cursor: player.injured || player.suspended ? "not-allowed" : "pointer",
        opacity: player.injured || player.suspended ? 0.45 : 1,
        outline: selectedPlayerId === player.id ? "2px solid #22c55e" : "none"
      }}
    >
      <span>{player.name}</span>
      <strong>{player.position}</strong>
      <small>{player.rating}</small>
    </div>
  );

  return (
    <div className="screen">
      <div className="hero-panel">
        <div>
          <p className="small-title">DİZİLİŞ 2.0</p>
          <h1>⚽ Gerçek Saha Yönetimi</h1>
          <p>Oyuncu seç, sahadaki uygun pozisyona yerleştir.</p>
        </div>

        <button className="primary-btn" onClick={autoBestXI}>
          En İyi 11 Kur
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "14px",
          marginTop: "14px"
        }}
      >
        <div
          style={{
            position: "relative",
            height: "620px",
            borderRadius: "24px",
            overflow: "hidden",
            border: "3px solid #86efac",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(180deg, #166534, #14532d)",
            backgroundSize: "12.5% 100%, 100% 100%"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "18px",
              border: "3px solid rgba(255,255,255,0.75)",
              borderRadius: "18px"
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "120px",
              height: "120px",
              border: "3px solid rgba(255,255,255,0.65)",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)"
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "0",
              width: "3px",
              height: "100%",
              background: "rgba(255,255,255,0.35)"
            }}
          />

          {slots.map((slot, index) => {
            const player = startingPlayers[index];
            const allowed = selectedPlayer ? canPlace(slot) : true;

            return (
              <button
                key={slot.id}
                onClick={() => placePlayer(index)}
                style={{
                  position: "absolute",
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: "118px",
                  minHeight: "78px",
                  borderRadius: "16px",
                  border: selectedPlayer
                    ? allowed
                      ? "2px solid #22c55e"
                      : "2px solid #ef4444"
                    : "1px solid rgba(255,255,255,0.35)",
                  background: player
                    ? "rgba(15, 23, 42, 0.88)"
                    : "rgba(255,255,255,0.12)",
                  color: "white",
                  cursor: selectedPlayer && allowed ? "pointer" : "default",
                  opacity: selectedPlayer && !allowed ? 0.35 : 1,
                  padding: "8px",
                  textAlign: "center"
                }}
              >
                <strong>{slot.label}</strong>

                <div style={{ fontSize: "12px", marginTop: "4px" }}>
                  {player ? player.name : "Boş"}
                </div>

                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    color: "#fbbf24"
                  }}
                >
                  {player ? player.rating : "-"}
                </div>
              </button>
            );
          })}
        </div>

        <div
          className="panel"
          style={{
            maxHeight: "620px",
            overflowY: "auto"
          }}
        >
          <h2>📋 Kadro Yönetimi</h2>

          <p style={{ marginBottom: "12px" }}>
            Seçili oyuncu:{" "}
            <strong>
              {selectedPlayer
                ? `${selectedPlayer.name} (${selectedPlayer.position})`
                : "Yok"}
            </strong>
          </p>

          <h3>İlk 11</h3>
          {startingPlayers.filter(Boolean).map(renderPlayerRow)}

          <h3 style={{ marginTop: "14px" }}>Yedekler</h3>
          {benchPlayers.map(renderPlayerRow)}

          <h3 style={{ marginTop: "14px" }}>Kadro Dışı</h3>
          {squadOutside.map(renderPlayerRow)}
        </div>
      </div>
    </div>
  );
};

export default FormationScreen;