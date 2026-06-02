import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

const Layout = ({ game, screen, setScreen, children }) => {
  return (
    <div className="app-shell">
      <TopBar game={game} />

      <div className="game-area">
        <BottomNav screen={screen} setScreen={setScreen} />

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;