const SAVE_KEY = "elTurcoFootballManagerSave";

export const saveGame = (gameState) => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    return true;
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return false;
  }
};

export const loadGame = () => {
  try {
    const savedData = localStorage.getItem(SAVE_KEY);

    if (!savedData) {
      return null;
    }

    return JSON.parse(savedData);
  } catch (error) {
    console.error("Kayıt yükleme hatası:", error);
    return null;
  }
};

export const deleteSave = () => {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch (error) {
    console.error("Kayıt silme hatası:", error);
    return false;
  }
};