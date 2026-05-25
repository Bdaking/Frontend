import React, { useContext, useState } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";
import {
  useTheme,
  AVATAR_PRESETS,
  AVATAR_SHAPES,
} from "../../context/ThemeContext";

const SideMenu = ({ activeMenu, onNavigate }) => {
  const { user, clearUser } = useContext(UserContext);
  const { navColor, setNavColor, avatarShape, setAvatarShape } = useTheme();
  const navigate = useNavigate();
  const [showCustomizer, setShowCustomizer] = useState(false);

  const handleClick = (route) => {
    if (route === "/logout") {
      handleLogout();
      return;
    }
    navigate(route);
    if (onNavigate) onNavigate();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearUser();
    navigate("/login");
  };

  const currentShape =
    AVATAR_SHAPES.find((s) => s.id === avatarShape) || AVATAR_SHAPES[0];

  return (
    <div
      className="w-full lg:w-64 h-full lg:h-[calc(100vh-61px)] p-5 lg:sticky lg:top-15.25 z-20 overflow-hidden"
      style={{
        background: "#0f172a",
        borderRight: "1px solid rgba(99,235,190,0.1)",
        scrollbarWidth: "none",
      }}
    >
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .customizer-panel { animation: fadeSlide 0.2s ease; }
        .color-swatch { transition: transform 0.15s, border 0.15s, box-shadow 0.15s; }
        .color-swatch:hover { transform: scale(1.15); }
        .shape-btn { transition: all 0.18s; }
        .shape-btn:hover { opacity: 0.85; }
      `}</style>

      {/* ── Profile section ── */}
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        <button
          onClick={() => setShowCustomizer((v) => !v)}
          title="Customize avatar"
          style={{
            padding: "3px",
            borderRadius: currentShape.radius,
            background: `linear-gradient(135deg, ${navColor}, ${navColor}88)`,
            cursor: "pointer",
            border: "none",
            transition: "border-radius 0.35s ease, background 0.4s ease",
            position: "relative",
            outline: showCustomizer ? `2px solid ${navColor}` : "none",
            outlineOffset: "2px",
          }}
        >
          <CharAvatar
            fullName={user?.fullName}
            width="w-20"
            height="h-20"
            style="text-xl"
            borderRadius={currentShape.radius}
            bgColor={navColor}
          />
          <span
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#0f172a",
              border: `2px solid ${navColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: navColor,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {showCustomizer ? "×" : "✎"}
          </span>
        </button>

        <h5 style={{ color: "#e2e8f0", fontWeight: 500 }}>
          {user?.fullName || ""}
        </h5>
        <span
          style={{
            fontSize: "11px",
            color: "#10b981",
            letterSpacing: "0.08em",
          }}
        >
          ● Online
        </span>
      </div>

      {/* ── Customizer panel ── */}
      {showCustomizer && (
        <div
          className="customizer-panel"
          style={{
            background: "#1e293b",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "16px",
          }}
        >
          {/* Color */}
          <p
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Navbar &amp; Avatar Color
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {AVATAR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className="color-swatch"
                onClick={() => setNavColor(preset.color)}
                title={preset.label}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: preset.color,
                  border:
                    navColor === preset.color
                      ? "2px solid #fff"
                      : "2px solid transparent",
                  cursor: "pointer",
                  transform:
                    navColor === preset.color ? "scale(1.3)" : "scale(1)",
                  boxShadow:
                    navColor === preset.color
                      ? `0 0 10px ${preset.color}`
                      : "none",
                }}
              />
            ))}
            {/* Custom colour picker */}
            <label
              title="Custom color"
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                border: "2px dashed #475569",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "#64748b",
                cursor: "pointer",
                position: "relative",
              }}
            >
              +
              <input
                type="color"
                value={navColor}
                onChange={(e) => setNavColor(e.target.value)}
                style={{
                  opacity: 0,
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                  border: "none",
                }}
              />
            </label>
          </div>

          {/* Shape */}
          <p
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Avatar Shape
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {AVATAR_SHAPES.map((shape) => (
              <button
                key={shape.id}
                className="shape-btn"
                onClick={() => setAvatarShape(shape.id)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  border:
                    avatarShape === shape.id
                      ? `1px solid ${navColor}`
                      : "1px solid rgba(255,255,255,0.08)",
                  background:
                    avatarShape === shape.id ? `${navColor}25` : "transparent",
                  color: avatarShape === shape.id ? "#fff" : "#64748b",
                }}
              >
                {shape.label}
              </button>
            ))}
          </div>

          {/* Live preview */}
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              background: "rgba(0,0,0,0.2)",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: currentShape.radius,
                background: `linear-gradient(135deg, ${navColor}, ${navColor}88)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                flexShrink: 0,
                transition: "all 0.35s",
              }}
            >
              {user?.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "?"}
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>
                Preview
              </div>
              <div style={{ fontSize: 11, color: navColor, fontWeight: 600 }}>
                {currentShape.label} ·{" "}
                {AVATAR_PRESETS.find((p) => p.color === navColor)?.label ||
                  "Custom"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Nav items ── */}
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className="w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3"
          style={
            activeMenu === item.label
              ? {
                  background: `linear-gradient(135deg, ${navColor}33, ${navColor}18)`,
                  color: "#fff",
                  border: `1px solid ${navColor}44`,
                  fontWeight: 600,
                  transition: "all 0.3s",
                }
              : {
                  color: "#64748b",
                  border: "1px solid transparent",
                  background: "transparent",
                }
          }
          onMouseEnter={(e) => {
            if (activeMenu !== item.label) {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = "#94a3b8";
            }
          }}
          onMouseLeave={(e) => {
            if (activeMenu !== item.label) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#64748b";
            }
          }}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
