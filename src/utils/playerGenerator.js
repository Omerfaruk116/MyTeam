import { firstNames, lastNames, nationalities, positions } from "../data/names";

const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRarityByRating = (rating) => {
  if (rating >= 90) return "mvp";
  if (rating >= 84) return "legendary";
  if (rating >= 76) return "epic";
  if (rating >= 66) return "rare";
  return "common";
};

const getMarketValue = (rating, age, potential) => {
  let value = rating * rating * 1000;

  if (age <= 21) value += potential * 5000;
  if (rating >= 80) value *= 2;
  if (rating >= 90) value *= 3;

  return Math.round(value);
};

export const generatePlayer = (id) => {
  const age = randomNumber(17, 34);
  const rating = randomNumber(52, 88);
  const potential = Math.min(99, rating + randomNumber(3, 18));
  const position = randomItem(positions);

  return {
    id,
    name: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
    age,
    nationality: randomItem(nationalities),
    position,
    rating,
    potential,
    rarity: getRarityByRating(rating),
    value: getMarketValue(rating, age, potential),
    wage: rating * randomNumber(150, 600),
    morale: randomNumber(60, 100),
    goals: 0,
    assists: 0,
    matches: 0,
    avatar: {
      skin: randomNumber(1, 6),
      hair: randomNumber(1, 8),
      beard: randomNumber(0, 6),
      eyes: randomNumber(1, 5),
      shirt: randomNumber(1, 6)
    },
    stats: {
      pace: randomNumber(45, rating + 8),
      shooting: randomNumber(45, rating + 8),
      passing: randomNumber(45, rating + 8),
      defending: randomNumber(35, rating + 8),
      physical: randomNumber(45, rating + 8),
      stamina: randomNumber(55, 100)
    }
  };
};

export const generateSquad = (count = 22) => {
  return Array.from({ length: count }, (_, index) => generatePlayer(index + 1));
};

export const generateTransferMarket = (count = 30) => {
  return Array.from({ length: count }, (_, index) => generatePlayer(1000 + index));
};