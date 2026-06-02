import { leagues } from "../data/gameData";
import { stadiumLevels } from "../data/stadiums";
import { sponsors } from "../data/sponsors";
import { generateYouthPlayers } from "./playerGenerator";

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

export const calculateTeamPower = (players = []) => {
  const availablePlayers = players
    .filter((player) => !player.injured && !player.suspended)
    .slice(0, 11);

  if (availablePlayers.length === 0) return 20;

  const total = availablePlayers.reduce((sum, player) => {
    const formBonus = (player.form - 50) / 10;
    const moraleBonus = (player.morale - 50) / 15;

    return sum + player.rating + formBonus + moraleBonus;
  }, 0);

  return Math.round(total / availablePlayers.length);
};

export const getCurrentStadium = (game) => {
  return (
    stadiumLevels.find(
      (stadium) => stadium.level === game.club.stadiumLevel
    ) || stadiumLevels[0]
  );
};

export const calculateAttendance = (game) => {
  const stadium = getCurrentStadium(game);

  const fairPrice = 10 + game.league.level * 4;
  const price = game.club.ticketPrice;

  let demand = game.club.fans;

  if (price > fairPrice) {
    demand *= Math.max(0.25, 1 - (price - fairPrice) * 0.05);
  }

  if (price < fairPrice) {
    demand *= Math.min(1.4, 1 + (fairPrice - price) * 0.03);
  }

  return Math.round(
    clamp(demand, 25, stadium.capacity)
  );
};

export const calculateMatchIncome = (game) => {
  const attendance = calculateAttendance(game);
  return attendance * game.club.ticketPrice;
};

const createOpponent = (league) => {
  const names = [
    "Mahalle Yıldızları",
    "Demirspor",
    "Kuzey Gücü",
    "Şehir Gençlik",
    "Anadolu Kartalları",
    "Mavi Ateş",
    "Kara Şahinler",
    "Altınordu FK"
  ];

  return {
    name: randomItem(names),
    power: randomNumber(league.minPower, league.maxPower)
  };
};

const createGoodFeelingPlayers = (players) => {
  return [...players]
    .filter((player) => !player.injured && !player.suspended)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map((player) => player.id);
};

const updatePlayerAfterMatch = (player, match, goodFeelingIds) => {
  const played = match.usedPlayerIds.includes(player.id);
  const goodFeeling = goodFeelingIds.includes(player.id);

  let ratingChange = 0;

  if (played && player.age <= 22) ratingChange += Math.random() < 0.35 ? 1 : 0;
  if (played && player.age >= 31) ratingChange -= Math.random() < 0.2 ? 1 : 0;
  if (goodFeeling && played) ratingChange += Math.random() < 0.25 ? 1 : 0;

  const nextRating = clamp(
    player.rating + ratingChange,
    10,
    player.maxRating
  );

  return {
    ...player,
    rating: nextRating,
    rarity:
      nextRating >= 90
        ? "mvp"
        : nextRating >= 80
        ? "legendary"
        : nextRating >= 68
        ? "epic"
        : nextRating >= 50
        ? "rare"
        : "common",
    form: clamp(player.form + randomNumber(-8, 10), 20, 100),
    morale: clamp(
      player.morale +
        (match.result === "win" ? randomNumber(4, 10) : randomNumber(-8, 4)),
      10,
      100
    ),
    matches: played ? player.matches + 1 : player.matches,
    goals: player.goals + (match.goalScorers[player.id] || 0),
    assists: player.assists + (match.assistPlayers[player.id] || 0),
    yellowCards: player.yellowCards + (match.yellowCards[player.id] || 0),
    redCards: player.redCards + (match.redCards[player.id] || 0),
    suspended:
      player.suspended ||
      (match.redCards[player.id] || 0) > 0 ||
      player.yellowCards + (match.yellowCards[player.id] || 0) >= 3,
    injured:
      player.injured ||
      ((match.injuryPlayerId === player.id) ? true : false)
  };
};

const makeEvents = (game, opponent, homeGoals, awayGoals, goodFeelingIds) => {
  const events = [];
  const players = game.players
    .filter((player) => !player.injured && !player.suspended)
    .slice(0, 11);

  const goalScorers = {};
  const assistPlayers = {};
  const yellowCards = {};
  const redCards = {};
  let injuryPlayerId = null;

  for (let i = 0; i < homeGoals; i++) {
    const scorer = randomItem(players);
    const assister = randomItem(players.filter((p) => p.id !== scorer.id)) || scorer;

    goalScorers[scorer.id] = (goalScorers[scorer.id] || 0) + 1;
    assistPlayers[assister.id] = (assistPlayers[assister.id] || 0) + 1;

    events.push({
      minute: randomNumber(1, 90),
      type: "goal",
      text: `GOOOL! ${scorer.name} ağları sarstı. ${assister.name} asist yaptı.`
    });
  }

  for (let i = 0; i < awayGoals; i++) {
    events.push({
      minute: randomNumber(1, 90),
      type: "opponent-goal",
      text: `${opponent.name} golü buldu. Savunma bu pozisyonda geç kaldı.`
    });
  }

  if (Math.random() < 0.45 && players.length > 0) {
    const player = randomItem(players);
    yellowCards[player.id] = 1;

    events.push({
      minute: randomNumber(10, 85),
      type: "yellow",
      text: `${player.name} sarı kart gördü.`
    });
  }

  if (Math.random() < 0.12 && players.length > 0) {
    const player = randomItem(players);
    redCards[player.id] = 1;

    events.push({
      minute: randomNumber(20, 88),
      type: "red",
      text: `${player.name} kırmızı kart gördü ve cezalı duruma düştü.`
    });
  }

  if (Math.random() < 0.18 && players.length > 0) {
    const player = randomItem(players);
    injuryPlayerId = player.id;

    events.push({
      minute: randomNumber(15, 90),
      type: "injury",
      text: `${player.name} sakatlandı. Sağlık ekibi sahada.`
    });
  }

  goodFeelingIds.forEach((id) => {
    const player = game.players.find((item) => item.id === id);

    if (player) {
      events.push({
        minute: randomNumber(1, 15),
        type: "form",
        text: `${player.name} bugün kendini çok iyi hissediyor.`
      });
    }
  });

  events.sort((a, b) => a.minute - b.minute);

  return {
    events,
    goalScorers,
    assistPlayers,
    yellowCards,
    redCards,
    injuryPlayerId
  };
};

export const playMatch = (game) => {
  const opponent = createOpponent(game.league);
  const goodFeelingIds = createGoodFeelingPlayers(game.players);

  const teamPower = calculateTeamPower(game.players);
  const attendance = calculateAttendance(game);
  const income = calculateMatchIncome(game);

  const fanEffect = attendance > game.club.fans * 0.6 ? 3 : -2;
  const goodFeelingBonus = goodFeelingIds.length;

  const finalTeamPower = teamPower + fanEffect + goodFeelingBonus;
  const opponentPower = opponent.power;

  const homeGoals = clamp(
    Math.floor(Math.random() * (finalTeamPower / 16)),
    0,
    6
  );

  const awayGoals = clamp(
    Math.floor(Math.random() * (opponentPower / 16)),
    0,
    6
  );

  const result =
    homeGoals > awayGoals ? "win" : homeGoals === awayGoals ? "draw" : "loss";

  const eventData = makeEvents(
    game,
    opponent,
    homeGoals,
    awayGoals,
    goodFeelingIds
  );

  const match = {
    opponent,
    homeGoals,
    awayGoals,
    result,
    attendance,
    income,
    goodFeelingIds,
    usedPlayerIds: game.players
      .filter((player) => !player.injured && !player.suspended)
      .slice(0, 11)
      .map((player) => player.id),
    ...eventData
  };

  const updatedPlayers = game.players.map((player) =>
    updatePlayerAfterMatch(player, match, goodFeelingIds)
  );

  const points = result === "win" ? 3 : result === "draw" ? 1 : 0;

  const newHistoryLine =
    result === "win"
      ? `${game.club.clubName}, ${opponent.name} karşısında ${homeGoals}-${awayGoals} kazandı.`
      : result === "draw"
      ? `${game.club.clubName}, ${opponent.name} ile ${homeGoals}-${awayGoals} berabere kaldı.`
      : `${game.club.clubName}, ${opponent.name} karşısında ${homeGoals}-${awayGoals} kaybetti.`;

  const nextGame = {
    ...game,
    players: updatedPlayers,
    week: game.week + 1,
    club: {
      ...game.club,
      money: game.club.money + income,
      fans: clamp(
        game.club.fans +
          (result === "win" ? randomNumber(20, 80) : result === "draw" ? randomNumber(0, 30) : -randomNumber(5, 30)),
        50,
        1000000
      ),
      prestige: clamp(
        game.club.prestige + (result === "win" ? 1 : 0),
        1,
        100
      )
    },
    record: {
      wins: game.record.wins + (result === "win" ? 1 : 0),
      draws: game.record.draws + (result === "draw" ? 1 : 0),
      losses: game.record.losses + (result === "loss" ? 1 : 0),
      goalsScored: game.record.goalsScored + homeGoals,
      goalsConceded: game.record.goalsConceded + awayGoals
    },
    history: [newHistoryLine, ...game.history],
    lastMessages: [
      `Maç geliri: $${income.toLocaleString()}`,
      `Stada gelen taraftar: ${attendance.toLocaleString()}`,
      newHistoryLine
    ],
    weeklyBestXI: createWeeklyBestXI(updatedPlayers)
  };

  return {
    game: nextGame,
    match
  };
};

export const createWeeklyBestXI = (players) => {
  return [...players]
    .sort((a, b) => {
      const scoreA =
        a.rating + a.goals * 5 + a.assists * 3 + a.form / 10;
      const scoreB =
        b.rating + b.goals * 5 + b.assists * 3 + b.form / 10;

      return scoreB - scoreA;
    })
    .slice(0, 11);
};

export const buyPlayer = (game, player) => {
  if (game.club.money < player.value) {
    return {
      success: false,
      message: "Bu transfer için yeterli paran yok."
    };
  }

  return {
    success: true,
    game: {
      ...game,
      club: {
        ...game.club,
        money: game.club.money - player.value
      },
      players: [...game.players, player],
      history: [
        `${player.name} transfer edildi. Bedel: $${player.value.toLocaleString()}`,
        ...game.history
      ]
    }
  };
};

export const sellPlayer = (game, playerId) => {
  if (game.players.length <= 16) {
    return {
      success: false,
      message: "Kadro çok dar. En az 16 oyuncu kalmalı."
    };
  }

  const player = game.players.find((item) => item.id === playerId);

  if (!player) {
    return {
      success: false,
      message: "Oyuncu bulunamadı."
    };
  }

  return {
    success: true,
    game: {
      ...game,
      club: {
        ...game.club,
        money: game.club.money + player.value
      },
      players: game.players.filter((item) => item.id !== playerId),
      history: [
        `${player.name} satıldı. Gelir: $${player.value.toLocaleString()}`,
        ...game.history
      ]
    }
  };
};

export const signSponsor = (game, sponsor) => {
  if (game.club.prestige < sponsor.prestigeRequired) {
    return {
      success: false,
      message: "Bu sponsor için prestijin yetersiz."
    };
  }

  return {
    success: true,
    game: {
      ...game,
      club: {
        ...game.club,
        sponsor,
        money: game.club.money + sponsor.weeklyIncome
      },
      history: [
        `${sponsor.name} ile sponsor anlaşması yapıldı.`,
        ...game.history
      ]
    }
  };
};

export const upgradeStadium = (game) => {
  const current = getCurrentStadium(game);
  const next = stadiumLevels.find(
    (stadium) => stadium.level === current.level + 1
  );

  if (!next) {
    return {
      success: false,
      message: "Stadyum zaten en üst seviyede."
    };
  }

  if (game.club.money < current.upgradeCost) {
    return {
      success: false,
      message: "Stadyum geliştirmek için yeterli paran yok."
    };
  }

  return {
    success: true,
    game: {
      ...game,
      club: {
        ...game.club,
        money: game.club.money - current.upgradeCost,
        stadiumLevel: next.level,
        prestige: clamp(game.club.prestige + next.prestige, 1, 100)
      },
      history: [
        `Stadyum geliştirildi: ${next.name}`,
        ...game.history
      ]
    }
  };
};

export const promoteYouthPlayer = (game, playerId) => {
  const player = game.youthPlayers.find((item) => item.id === playerId);

  if (!player) {
    return {
      success: false,
      message: "Altyapı oyuncusu bulunamadı."
    };
  }

  const promotedPlayer = {
    ...player,
    contractStatus: "profesyonel",
    academy: "Kendi Altyapımız",
    value: Math.round(player.value * 1.5)
  };

  return {
    success: true,
    game: {
      ...game,
      youthPlayers: game.youthPlayers.filter((item) => item.id !== playerId),
      players: [...game.players, promotedPlayer],
      history: [
        `${player.name} altyapıdan A takıma yükseldi.`,
        ...game.history
      ]
    }
  };
};

export const finishSeason = (game) => {
  const promoted =
    game.record.wins >= 8 || game.club.prestige >= game.league.level * 8;

  const nextLeague =
    promoted && game.league.level < leagues.length
      ? leagues[game.league.level]
      : game.league;

  const agedPlayers = game.players
    .map((player) => {
      const age = player.age + 1;
      const decline = age >= 33 ? randomNumber(1, 4) : 0;
      const growth =
        age <= 24 && player.rating < player.maxRating
          ? randomNumber(0, 3)
          : randomNumber(0, 1);

      const rating = clamp(
        player.rating + growth - decline,
        10,
        player.maxRating
      );

      return {
        ...player,
        age,
        rating,
        suspended: false,
        injured: false,
        yellowCards: 0,
        redCards: 0,
        form: randomNumber(45, 100),
        morale: randomNumber(45, 100)
      };
    })
    .filter((player) => player.age <= 36);

  const summary = {
    oldSeason: game.season,
    promoted,
    newLeague: nextLeague.name,
    retiredPlayers: game.players.filter((player) => player.age + 1 > 36)
  };

  const newTrophies = game.trophies.map((trophy) => {
    if (trophy.id === "promotion" && promoted) {
      return {
        ...trophy,
        count: trophy.count + 1
      };
    }

    return trophy;
  });

  return {
    summary,
    game: {
      ...game,
      season: game.season + 1,
      week: 1,
      league: nextLeague,
      players: agedPlayers,
      youthPlayers: generateYouthPlayers(5, nextLeague.level),
      trophies: newTrophies,
      record: {
        wins: 0,
        draws: 0,
        losses: 0,
        goalsScored: 0,
        goalsConceded: 0
      },
      history: [
        promoted
          ? `Sezon tamamlandı. Kulüp ${nextLeague.name} seviyesine yükseldi.`
          : "Sezon tamamlandı. Kulüp aynı ligde devam ediyor.",
        ...game.history
      ]
    }
  };
};