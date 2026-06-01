import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

const Layout = ({
  club,
  currentScreen,
  setCurrentScreen,
  children
}) => {
  return (
    <div
      style={{
        height: "100vh",
        background: "#020617",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <TopBar club={club} />

      <div
        style={{
          flex: 1,
          overflowY: "auto"
        }}
      >
        {children}
      </div>

      <BottomNav
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
      />
    </div>
  );
};

export default Layout;