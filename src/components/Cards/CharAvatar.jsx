import React from "react";

const CharAvatar = ({
  fullName,
  width,
  height,
  style,
  borderRadius,
  bgColor,
}) => {
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const radius = borderRadius || "50%";
  const bg = bgColor || "#4f46e5";

  return (
    <div
      className={`${width || "w-12"} ${height || "h-12"} flex items-center justify-center`}
      style={{
        borderRadius: radius,
        background: `linear-gradient(135deg, ${bg}dd, ${bg}99)`,
        color: "#fff",
        fontWeight: 700,
        fontSize: style === "text-xl" ? "1.25rem" : "1rem",
        transition: "border-radius 0.35s ease, background 0.4s ease",
        userSelect: "none",
      }}
    >
      {initials}
    </div>
  );
};

export default CharAvatar;
