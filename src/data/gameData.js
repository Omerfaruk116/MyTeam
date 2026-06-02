import { generateSquad, generateYouthPlayers } from "../utils/playerGenerator";

export const rarityColors = {
  common: "#94a3b8",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#f59e0b",
  mvp: "#ef4444"
};

export const formations = ["4-4-2", "4-3-3", "4-2-3-1", "3-5-2"];

export const leagues = [
  { level: 1, name: "Mahalle Ligi", minPower: 20, maxPower: 35, prize: 75000 },
  { level: 2, name: "Amatör 3", minPower: 30, maxPower: 45, prize: 180000 },
  { level: 3, name: "Amatör 2", minPower: 38, maxPower: 55, prize: 400000 },
  { level: 4, name: "Amatör 1", minPower: 48, maxPower: 65, prize: 900000 },
  { level: 5, name: "Bölgesel Lig", minPower: 58, maxPower: 72, prize: 2000000 },
  { level: 6, name: "3. Lig", minPower: 66, maxPower: 78, prize: 5000000 },
  { level: 7, name: "2. Lig", minPower: 72, maxPower: 84, prize: 12000000 },
  { level: 8, name: "1. Lig", minPower: 78, maxPower: 90, prize: 30000000 },
  { level: 9, name: "Süper Lig", minPower: 84, maxPower: 96, prize: 80000000 }
];

export const defaultTrophies = [
  { id: "league", name: "Lig Kupası", count: 0, icon: "🏆" },
  { id: "promotion", name: "Yükselme Kupası", count: 0, icon: "🥇" },
  { id: "youth", name: "Altyapı Başarısı", count: 0, icon: "🌟" }
];

const createLeagueTable = (clubName) => [
  { id: 1, name: clubName, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, pts: 0, power: 28, isUser: true },
  { id: 2, name: "Mahalle Yıldızları", played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, pts: 0, power: 30 },
  { id: 3, name: "Demirspor", played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, pts: 0, power: 29 },
  { id: 4, name: "Kuzey Gücü", played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, pts: 0, power: 27 },
  { id: 5, name: "Şehir Gençlik", played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, pts: 0, power: 26 },
  { id: 6, name: "Mavi Ateş", played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, pts: 0, power: 25 },
  { id: 7, name: "Kara Şahinler", played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, pts: 0, power: 24 },
  { id: 8, name: "Altınordu FK", played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, pts: 0, power: 23 },
  { id: 9, name: "Anadolu Kartalları", played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, pts: 0, power: 22 },
  { id: 10, name: "Semt Gücü", played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, pts: 0, power: 21 }
];

const createFixtures = (teams) => {
  const opponents = teams.filter((team) => !team.isUser);

  return opponents.map((team, index) => ({
    week: index + 1,
    home: teams[0].name,
    away: team.name,
    played: false
  }));
};

export const createNewGame = () => {
  const league = leagues[0];
  const players = generateSquad(22, league.level);
  const clubName = "EL TURCO FC";
  const leagueTable = createLeagueTable(clubName);

  return {
    club: {
      clubName,
      managerName: "EL TURCO",
      money: 120000,
      fans: 180,
      prestige: 1,
      level: 1,
      stadiumLevel: 1,
      ticketPrice: 10,
      sponsor: null
    },

    league,
    leagueTable,
    fixtures: createFixtures(leagueTable),

    formation: "4-3-3",

    startingXI: players.slice(0, 11).map((player) => player.id),
    bench: players.slice(11, 18).map((player) => player.id),

    season: 1,
    week: 1,

    record: {
      wins: 0,
      draws: 0,
      losses: 0,
      goalsScored: 0,
      goalsConceded: 0
    },

    players,
    youthPlayers: generateYouthPlayers(5, league.level),

    trophies: defaultTrophies,
    history: [
      "EL TURCO FC kuruldu. Hedef: mahalle sahasından dünya devliğine yükselmek."
    ],
    achievements: [],
    weeklyBestXI: [],
    lastMessages: [
      "Taraftarlar yeni sezonu bekliyor.",
      "Kulüp düşük bütçeyle yola çıktı.",
      "Altyapıdan umutlu gençler var."
    ]
  };
};