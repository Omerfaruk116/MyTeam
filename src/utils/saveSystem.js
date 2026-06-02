const SAVE_KEY = "el_turco_football_manager_v2";

export const saveGame = (game) => {
  try {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(game)
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const loadGame = () => {
  try {
    const data = localStorage.getItem(SAVE_KEY);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteSave = () => {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};