import { useMemo, useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import MatchScreen from "./screens/MatchScreen";
import ManagerCreateScreen from "./screens/ManagerCreateScreen";
import ClubCustomizeScreen from "./screens/ClubCustomizeScreen";
import mockClub from "./data/mockClub";

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    localStorage.removeItem(key);
    return fallback;
  }
}

export default function App() {
  const [managerProfile, setManagerProfile] = useState(() =>
    safeRead("managerProfile", null)
  );

  const [clubProfile, setClubProfile] = useState(() =>
    safeRead("clubProfile", mockClub.club)
  );

  const [screen, setScreen] = useState(() =>
    safeRead("managerProfile", null) ? "home" : "manager-create"
  );

  const gameData = useMemo(() => {
    return {
      ...mockClub,
      manager: managerProfile || mockClub.manager,
      club: clubProfile || mockClub.club,
    };
  }, [managerProfile, clubProfile]);

  const handleSaveManager = (profile) => {
    try {
      localStorage.setItem("managerProfile", JSON.stringify(profile));
    } catch (error) {}

    setManagerProfile(profile);
    setScreen("home");
  };

  const handleSaveClub = (clubData) => {
    const nextClub = {
      ...clubProfile,
      ...clubData,
    };

    try {
      localStorage.setItem("clubProfile", JSON.stringify(nextClub));
    } catch (error) {}

    setClubProfile(nextClub);
    setScreen("home");
  };

  const handleMenuClick = (title) => {
    if (title === "Maçlar") {
      setScreen("match");
      return;
    }

    if (title === "Kulüp") {
      setScreen("club-customize");
      return;
    }

    alert(`${title} ekranı daha sonra eklenecek.`);
  };

  const handleResetCareer = () => {
    const yes = window.confirm("Bütün kariyer sıfırlansın mı?");
    if (!yes) return;

    localStorage.removeItem("managerProfile");
    localStorage.removeItem("clubProfile");
    setManagerProfile(null);
    setClubProfile(mockClub.club);
    setScreen("manager-create");
  };

  if (screen === "manager-create") {
    return <ManagerCreateScreen onSave={handleSaveManager} />;
  }

  if (screen === "club-customize") {
    return (
      <ClubCustomizeScreen
        data={gameData}
        onSave={handleSaveClub}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "match") {
    return (
      <MatchScreen
        data={gameData}
        onBackHome={() => setScreen("home")}
      />
    );
  }

  return (
    <HomeScreen
      data={gameData}
      onMenuClick={handleMenuClick}
      onResetCareer={handleResetCareer}
    />
  );
}