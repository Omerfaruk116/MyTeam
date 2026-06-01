export const simulateMatch = (homeTeamRating, awayTeamRating) => {
  const homeAdvantage = 5;

  const homePower = homeTeamRating + homeAdvantage;
  const awayPower = awayTeamRating;

  const homeGoals = Math.max(
    0,
    Math.floor(Math.random() * ((homePower / 20) + 1))
  );

  const awayGoals = Math.max(
    0,
    Math.floor(Math.random() * ((awayPower / 20) + 1))
  );

  return {
    homeGoals,
    awayGoals,
    winner:
      homeGoals > awayGoals
        ? "home"
        : awayGoals > homeGoals
        ? "away"
        : "draw"
  };
};

export const generateMatchEvents = (
  homeGoals,
  awayGoals,
  homePlayers,
  awayPlayers
) => {
  const events = [];

  const goalMessages = [
    "Muhteşem gol!",
    "Kaleci çaresiz kaldı!",
    "Harika bir vuruş!",
    "Taraftarlar ayağa kalktı!",
    "Müthiş organizasyon!"
  ];

  for (let i = 0; i < homeGoals; i++) {
    const player =
      homePlayers[Math.floor(Math.random() * homePlayers.length)];

    events.push({
      minute: Math.floor(Math.random() * 90) + 1,
      type: "goal",
      team: "home",
      player: player.name,
      text: goalMessages[Math.floor(Math.random() * goalMessages.length)]
    });
  }

  for (let i = 0; i < awayGoals; i++) {
    const player =
      awayPlayers[Math.floor(Math.random() * awayPlayers.length)];

    events.push({
      minute: Math.floor(Math.random() * 90) + 1,
      type: "goal",
      team: "away",
      player: player.name,
      text: goalMessages[Math.floor(Math.random() * goalMessages.length)]
    });
  }

  events.sort((a, b) => a.minute - b.minute);

  return events;
};

export const calculateTeamRating = (players) => {
  if (!players || players.length === 0) return 60;

  const total = players.reduce(
    (sum, player) => sum + player.rating,
    0
  );

  return Math.round(total / players.length);
};