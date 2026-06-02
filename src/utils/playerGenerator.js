import { firstNames, lastNames, nationalities, positions } from "../data/names";

const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getRarity = (rating) => {
  if (rating >= 90) return "mvp";
  if (rating >= 80) return "legendary";
  if (rating >= 68) return "epic";
  if (rating >= 50) return "rare";
  return "common";
};

const leagueRanges = {
  1: { min: 20, max: 35 },
  2: { min: 30, max: 45 },
  3: { min: 38, max: 55 },
  4: { min: 48, max: 65 },
  5: { min: 58, max: 72 },
  6: { min: 66, max: 78 },
  7: { min: 72, max: 84 },
  8: { min: 78, max: 90 },
  9: { min: 84, max: 96 }
};

const createValue = (rating, potential, age, isYouth = false) => {
  let value = rating * rating * 120;

  if (potential >= rating + 20) value *= 1.8;
  if (age <= 20) value *= 1.5;
  if (age >= 30) value *= 0.55;
  if (isYouth) value *= 0.35;

  return Math.round(value);
};

export const generatePlayer = (id, leagueLevel = 1, options = {}) => {
  const range = leagueRanges[leagueLevel] || leagueRanges[1];

  const age = options.age ?? randomNumber(17, 34);
  const isYouth = options.isYouth ?? false;

  const rating = options.rating ?? randomNumber(range.min, range.max);

  const potential =
    options.potential ??
    clamp(
      rating + randomNumber(age <= 21 ? 12 : 3, age <= 21 ? 35 : 14),
      rating,
      leagueLevel <= 2 ? 70 : 98
    );

  const position = options.position ?? randomItem(positions);

  const player = {
    id,
    name: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
    age,
    nationality: randomItem(nationalities),
    position,
    rating,
    potential,
    maxRating: potential,
    rarity: getRarity(rating),
    value: createValue(rating, potential, age, isYouth),
    academy: isYouth ? "Kendi Altyapımız" : "Dış Kulüp",
    contractStatus: isYouth ? "altyapı" : "profesyonel",
    form: randomNumber(45, 100),
    morale: randomNumber(45, 100),
    injured: false,
    suspended: false,
    yellowCards: 0,
    redCards: 0,
    goals: 0,
    assists: 0,
    matches: 0,
    avatar: {
      skin: randomNumber(1, 6),
      hair: randomNumber(1, 10),
      beard: randomNumber(0, 6),
      mustache: randomNumber(0, 5),
      eyes: randomNumber(1, 5)
    },
    stats: {
      pace: clamp(rating + randomNumber(-8, 8), 10, 99),
      shooting: clamp(rating + randomNumber(-8, 8), 10, 99),
      passing: clamp(rating + randomNumber(-8, 8), 10, 99),
      defending: clamp(rating + randomNumber(-8, 8), 10, 99),
      physical: clamp(rating + randomNumber(-8, 8), 10, 99)
    }
  };

  return player;
};

export const generateSquad = (count = 22, leagueLevel = 1) => {
  const positionsPlan = [
    "GK", "GK",
    "LB", "CB", "CB", "RB",
    "CDM", "CM", "CM", "CAM",
    "LW", "RW", "ST", "ST"
  ];

  return Array.from({ length: count }, (_, index) =>
    generatePlayer(index + 1, leagueLevel, {
      position: positionsPlan[index] || randomItem(positions)
    })
  );
};

export const generateTransferMarket = (count = 28, leagueLevel = 1) => {
  return Array.from({ length: count }, (_, index) =>
    generatePlayer(1000 + index, leagueLevel)
  );
};

export const generateYouthPlayers = (count = 5, leagueLevel = 1) => {
  return Array.from({ length: count }, (_, index) =>
    generatePlayer(5000 + index, leagueLevel, {
      age: randomNumber(16, 19),
      isYouth: true
    })
  );
};