import { useMemo, useState } from "react";
import PlayerCard from "./PlayerCard";

const TransferScreen = ({
  transferMarket,
  onBuyPlayer
}) => {
  const [position, setPosition] = useState("ALL");
  const [minimumRating, setMinimumRating] =
    useState(0);

  const filteredPlayers = useMemo(() => {
    return transferMarket.filter((player) => {
      const positionMatch =
        position === "ALL"
          ? true
          : player.position === position;

      const ratingMatch =
        player.rating >= minimumRating;

      return positionMatch && ratingMatch;
    });
  }, [
    transferMarket,
    position,
    minimumRating
  ]);

  return (
    <div className="screen">
      <div className="panel">
        <h2>💰 Transfer Pazarı</h2>

        <div className="filter-bar">
          <select
            value={position}
            onChange={(e) =>
              setPosition(e.target.value)
            }
          >
            <option value="ALL">
              Tüm Mevkiler
            </option>

            <option value="GK">GK</option>
            <option value="LB">LB</option>
            <option value="CB">CB</option>
            <option value="RB">RB</option>
            <option value="CDM">CDM</option>
            <option value="CM">CM</option>
            <option value="CAM">CAM</option>
            <option value="LW">LW</option>
            <option value="RW">RW</option>
            <option value="ST">ST</option>
          </select>

          <input
            type="number"
            placeholder="Min Güç"
            value={minimumRating}
            onChange={(e) =>
              setMinimumRating(
                Number(e.target.value)
              )
            }
          />
        </div>
      </div>

      <div
        className="transfer-grid"
        style={{
          marginTop: "14px"
        }}
      >
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            showBuyButton
            onBuy={onBuyPlayer}
          />
        ))}
      </div>
    </div>
  );
};

export default TransferScreen;