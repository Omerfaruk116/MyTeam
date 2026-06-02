const skinColors = [
  "#f5d0a9",
  "#e8be8d",
  "#d8a06d",
  "#c68642",
  "#8d5524",
  "#5c3b1e"
];

const Avatar = ({ avatar }) => {
  const skin =
    skinColors[
      (avatar?.skin || 1) % skinColors.length
    ];

  return (
    <div className="avatar">
      <div
        className="avatar-face"
        style={{
          background: skin
        }}
      />

      <div className="avatar-hair" />

      <div className="avatar-eye left" />
      <div className="avatar-eye right" />

      {avatar?.mustache > 0 && (
        <div className="avatar-mustache" />
      )}

      {avatar?.beard > 0 && (
        <div className="avatar-beard" />
      )}
    </div>
  );
};

export default Avatar;