import { useEffect } from "react";

const IntroScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
      }}
    >
      <h1
        style={{
          fontSize: "72px",
          color: "#ef4444",
          textShadow: "0 0 30px #ef4444",
          margin: 0
        }}
      >
        EL TURCO
      </h1>

      <h2
        style={{
          marginTop: "10px",
          color: "#94a3b8",
          letterSpacing: "4px"
        }}
      >
        L.M. PRODUCTION
      </h2>

      <div
        style={{
          width: "400px",
          height: "12px",
          background: "#1e293b",
          borderRadius: "999px",
          marginTop: "40px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#ef4444",
            animation: "loadingBar 3s linear forwards"
          }}
        />
      </div>
    </div>
  );
};

export default IntroScreen;