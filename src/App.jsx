import { useEffect, useState } from "react";

import IntroScreen from "./components/IntroScreen";
import Layout from "./components/Layout";

import HomeScreen from "./components/HomeScreen";
import TeamScreen from "./components/TeamScreen";
import FormationScreen from "./components/FormationScreen";
import MatchScreen from "./components/MatchScreen";
import LeagueScreen from "./components/LeagueScreen";
import TransferScreen from "./components/TransferScreen";
import SponsorScreen from "./components/SponsorScreen";
import StadiumScreen from "./components/StadiumScreen";
import AchievementScreen from "./components/AchievementScreen";
import HistoryScreen from "./components/HistoryScreen";
import SettingsScreen from "./components/SettingsScreen";

import { clubData } from "./data/gameData";

import {
  generateSquad,
  generateTransferMarket
} from "./utils/playerGenerator";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const [club] = useState(clubData);

  const [players, setPlayers] = useState([]);

  const [transferMarket, setTransferMarket] = useState([]);

  const [currentScreen, setCurrentScreen] =
    useState("Ana Sayfa");

  useEffect(() => {
    setPlayers(generateSquad(22));
    setTransferMarket(generateTransferMarket(30));
  }, []);

  if (showIntro) {
    return (
      <IntroScreen
        onFinish={() => setShowIntro(false)}
      />
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "Ana Sayfa":
        return <HomeScreen club={club} />;

      case "Takım":
        return <TeamScreen players={players} />;

      case "Diziliş":
        return <FormationScreen players={players} />;

      case "Maç":
        return (
          <MatchScreen
            homeGoals={2}
            awayGoals={1}
            events={[]}
          />
        );

      case "Lig":
        return <LeagueScreen />;

      case "Transfer":
        return (
          <TransferScreen
            transferMarket={transferMarket}
          />
        );

      case "Stadyum":
        return <StadiumScreen club={club} />;

      default:
        return <HomeScreen club={club} />;
    }
  };

  return (
    <Layout
      club={club}
      currentScreen={currentScreen}
      setCurrentScreen={setCurrentScreen}
    >
      {renderScreen()}
    </Layout>
  );
}

export default App;