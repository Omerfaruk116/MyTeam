const HistoryScreen = ({ game }) => {
  const history = game.history || [];

  return (
    <div className="screen">
      <div className="hero-panel">
        <div>
          <p className="small-title">
            KULÜP TARİHİ
          </p>

          <h1>📖 Kulüp Geçmişi</h1>

          <p>
            Kulübünde yaşanan tüm önemli olaylar.
          </p>
        </div>
      </div>

      <div
        className="panel"
        style={{
          marginTop: "14px"
        }}
      >
        {history.length === 0 ? (
          <p>
            Henüz kulüp geçmişi oluşmadı.
          </p>
        ) : (
          history.map((item, index) => (
            <div
              key={index}
              className="news-line"
            >
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;