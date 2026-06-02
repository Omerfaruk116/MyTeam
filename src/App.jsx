import { useEffect, useMemo, useState } from "react";

import Layout from "./components/Layout";
import HomeScreen from "./components/HomeScreen";
import TeamScreen from "./components/TeamScreen";
import FormationScreen from "./components/FormationScreen";
import MatchScreen from "./components/MatchScreen";
import LeagueScreen from "./components/LeagueScreen";
import WeeklyBestXI from "./components/WeeklyBestXI";
import TransferScreen from "./components/TransferScreen";
import StadiumScreen from "./components/StadiumScreen";
import SponsorScreen from "./components/SponsorScreen";
import AchievementScreen from "./components/AchievementScreen";
import HistoryScreen from "./components/HistoryScreen";
import SettingsScreen from "./components/SettingsScreen";
import YouthAcademyScreen from "./components/YouthAcademyScreen";
import SeasonSummaryScreen from "./components/SeasonSummaryScreen";

import { createNewGame } from "./data/gameData";
import { generateTransferMarket } from "./utils/playerGenerator";
import { loadGame, saveGame } from "./utils/saveSystem";
import {
  playMatch,
  buyPlayer,
  sellPlayer,
  signSponsor,
  upgradeStadium,
  promoteYouthPlayer,
  finishSeason
} from "./utils/gameEngine";

function App() {
  const [game, setGame] = useState(null);
  const [screen, setScreen] = useState("home");
  const [transferMarket, setTransferMarket] = useState([]);
  const [lastMatch, setLastMatch] = useState(null);
  const [seasonSummary, setSeasonSummary] = useState(null);

  useEffect(() => {
    const savedGame = loadGame();

    if (savedGame) {
      setGame(savedGame);
    } else {
      setGame(createNewGame());
    }

    setTransferMarket(generateTransferMarket(28, 1));
  }, []);

  useEffect(() => {
    if (game) {
      saveGame(game);
    }
  }, [game]);

  const teamPower = useMemo(() => {
    if (!game) return 0;

    const squad = game.players.slice(0, 11);

    if (squad.length === 0) return 0;

    const total = squad.reduce((sum, player) => sum + player.rating, 0);

    return Math.round(total / squad.length);
  }, [game]);

  if (!game) {
    return (
      <div className="loading-screen">
        <h1>EL TURCO</h1>
        <p>Oyun yükleniyor...</p>
      </div>
    );
  }

  const updateGame = (nextGame) => {
    setGame(nextGame);
  };

  const handlePlayMatch = () => {
    const result = playMatch(game);
    setGame(result.game);
    setLastMatch(result.match);
    setScreen("match");
  };

  const handleBuyPlayer = (playerId) => {
    const player = transferMarket.find((item) => item.id === playerId);
    if (!player) return;

    const result = buyPlayer(game, player);

    if (!result.success) {
      alert(result.message);
      return;
    }

    setGame(result.game);
    setTransferMarket((market) =>
      market.filter((item) => item.id !== playerId)
    );
  };

  const handleSellPlayer = (playerId) => {
    const result = sellPlayer(game, playerId);

    if (!result.success) {
      alert(result.message);
      return;
    }

    setGame(result.game);
  };

  const handleSignSponsor = (sponsor) => {
    const result = signSponsor(game, sponsor);

    if (!result.success) {
      alert(result.message);
      return;
    }

    setGame(result.game);
  };

  const handleUpgradeStadium = () => {
    const result = upgradeStadium(game);

    if (!result.success) {
      alert(result.message);
      return;
    }

    setGame(result.game);
  };

  const handlePromoteYouth = (playerId) => {
    const result = promoteYouthPlayer(game, playerId);

    if (!result.success) {
      alert(result.message);
      return;
    }

    setGame(result.game);
  };

  const handleFinishSeason = () => {
    const result = finishSeason(game);
    setGame(result.game);
    setSeasonSummary(result.summary);
    setTransferMarket(generateTransferMarket(28, result.game.league.level));
    setScreen("season");
  };

  const renderScreen = () => {
    if (screen === "home") {
      return (
        <HomeScreen
          game={game}
          teamPower={teamPower}
          onPlayMatch={handlePlayMatch}
          onFinishSeason={handleFinishSeason}
        />
      );
    }

    if (screen === "team") {
      return (
        <TeamScreen
          game={game}
          onSellPlayer={handleSellPlayer}
        />
      );
    }

    if (screen === "formation") {
      return (
        <FormationScreen
          game={game}
          updateGame={updateGame}
        />
      );
    }

    if (screen === "match") {
      return (
        <MatchScreen
          game={game}
          lastMatch={lastMatch}
          onPlayMatch={handlePlayMatch}
        />
      );
    }

    if (screen === "league") {
      return <LeagueScreen game={game} />;
    }

    if (screen === "weekly") {
      return <WeeklyBestXI game={game} />;
    }

    if (screen === "transfer") {
      return (
        <TransferScreen
          game={game}
          transferMarket={transferMarket}
          onBuyPlayer={handleBuyPlayer}
        />
      );
    }

    if (screen === "stadium") {
      return (
        <StadiumScreen
          game={game}
          updateGame={updateGame}
          onUpgradeStadium={handleUpgradeStadium}
        />
      );
    }

    if (screen === "sponsor") {
      return (
        <SponsorScreen
          game={game}
          onSignSponsor={handleSignSponsor}
        />
      );
    }

    if (screen === "achievements") {
      return <AchievementScreen game={game} />;
    }

    if (screen === "history") {
      return <HistoryScreen game={game} />;
    }

    if (screen === "youth") {
      return (
        <YouthAcademyScreen
          game={game}
          onPromoteYouth={handlePromoteYouth}
        />
      );
    }

    if (screen === "season") {
      return (
        <SeasonSummaryScreen
          game={game}
          summary={seasonSummary}
          onFinishSeason={handleFinishSeason}
        />
      );
    }

    if (screen === "settings") {
      return <SettingsScreen game={game} updateGame={updateGame} />;
    }

    return <HomeScreen game={game} teamPower={teamPower} />;
  };

  return (
    <Layout
      game={game}
      screen={screen}
      setScreen={setScreen}
    >
      {renderScreen()}
    </Layout>
  );
}

export default App;