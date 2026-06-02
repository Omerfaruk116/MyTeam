import { sponsors } from "../data/sponsors";

const SponsorScreen = ({
  game,
  onSignSponsor
}) => {
  return (
    <div className="screen">
      <div className="hero-panel">
        <div>
          <p className="small-title">
            SPONSORLAR
          </p>

          <h1>🤝 Sponsorluklar</h1>

          <p>
            Kulübünü büyütmek için
            sponsor anlaşmaları yap.
          </p>
        </div>
      </div>

      <div
        className="player-grid"
        style={{
          marginTop: "14px"
        }}
      >
        {sponsors.map((sponsor) => {
          const available =
            game.club.prestige >=
              sponsor.prestigeRequired &&
            game.club.fans >=
              sponsor.fansRequired &&
            game.club.stadiumLevel >=
              sponsor.stadiumRequired;

          return (
            <div
              key={sponsor.id}
              className="player-card"
            >
              <h3>{sponsor.name}</h3>

              <p>
                💰 Haftalık:
                {" "}
                $
                {sponsor.weeklyIncome.toLocaleString()}
              </p>

              <p>
                ⭐ Prestij:
                {" "}
                {sponsor.prestigeRequired}
              </p>

              <p>
                👥 Taraftar:
                {" "}
                {sponsor.fansRequired.toLocaleString()}
              </p>

              <p>
                🏟️ Stadyum:
                {" "}
                {sponsor.stadiumRequired}
              </p>

              <p>
                🎯 Görev:
                {" "}
                {sponsor.bonusGoal}
              </p>

              <p>
                🎁 Bonus:
                {" "}
                $
                {sponsor.bonusReward.toLocaleString()}
              </p>

              <button
                className={
                  available
                    ? "primary-btn"
                    : "secondary-btn"
                }
                disabled={!available}
                style={{
                  width: "100%",
                  marginTop: "12px"
                }}
                onClick={() =>
                  onSignSponsor(sponsor)
                }
              >
                {available
                  ? "Anlaşma Yap"
                  : "Şartlar Sağlanmadı"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SponsorScreen;