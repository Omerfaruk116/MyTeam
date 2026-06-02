import { stadiumLevels } from "../data/stadiums";

const StadiumScreen = ({
  game,
  onUpgradeStadium,
  updateGame
}) => {
  const stadium =
    stadiumLevels.find(
      (item) =>
        item.level === game.club.stadiumLevel
    ) || stadiumLevels[0];

  const changeTicketPrice = (value) => {
    updateGame({
      ...game,
      club: {
        ...game.club,
        ticketPrice: Number(value)
      }
    });
  };

  return (
    <div className="screen">
      <div className="panel">
        <h2>🏟️ {stadium.name}</h2>

        <div
          className="stadium-visual"
          style={{
            marginTop: "14px"
          }}
        >
          <div className="stadium-field" />
        </div>
      </div>

      <div
        className="stat-grid"
        style={{
          marginTop: "14px"
        }}
      >
        <div className="stat-card">
          <span>👥 Kapasite</span>
          <strong>
            {stadium.capacity.toLocaleString()}
          </strong>
        </div>

        <div className="stat-card">
          <span>🔥 Atmosfer</span>
          <strong>
            {stadium.atmosphere}
          </strong>
        </div>

        <div className="stat-card">
          <span>⭐ Prestij</span>
          <strong>
            {stadium.prestige}
          </strong>
        </div>

        <div className="stat-card">
          <span>🏠 Ev Sahibi Bonusu</span>
          <strong>
            +{stadium.homeBonus}
          </strong>
        </div>
      </div>

      <div
        className="panel"
        style={{
          marginTop: "14px"
        }}
      >
        <h2>🎟️ Bilet Sistemi</h2>

        <p>
          Önerilen Fiyat:
          {" "}
          $
          {stadium.recommendedTicketPrice}
        </p>

        <input
          type="range"
          min="1"
          max="250"
          value={game.club.ticketPrice}
          onChange={(e) =>
            changeTicketPrice(
              e.target.value
            )
          }
          style={{
            width: "100%",
            marginTop: "12px"
          }}
        />

        <p
          style={{
            marginTop: "10px"
          }}
        >
          Mevcut Bilet Fiyatı:
          {" "}
          $
          {game.club.ticketPrice}
        </p>

        <p>
          Çok yükseltirsen taraftar azalır.
        </p>

        <p>
          Çok düşürürsen stadyum dolar.
        </p>
      </div>

      <div
        className="panel"
        style={{
          marginTop: "14px"
        }}
      >
        <h2>🏗️ Stadyum Geliştirme</h2>

        <p>
          Sonraki yükseltme:
          {" "}
          $
          {stadium.upgradeCost.toLocaleString()}
        </p>

        <button
          className="primary-btn"
          onClick={onUpgradeStadium}
          style={{
            marginTop: "12px"
          }}
        >
          Stadyumu Geliştir
        </button>
      </div>
    </div>
  );
};

export default StadiumScreen;