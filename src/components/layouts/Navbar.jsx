import React, { useState } from "react";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { navColor } = useTheme();
  const handleClose = () => setOpenSideMenu(false);

  return (
    <>
      {/* Mobile overlay */}
      {openSideMenu && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={handleClose}
        />
      )}

      <nav
        className="sticky top-0 z-50 w-full px-6 py-0"
        style={{
          background: navColor,
          boxShadow: `0 2px 16px ${navColor}55`,
          height: "61px",
          display: "flex",
          alignItems: "center",
          transition: "background 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        <div className="w-full flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "18px",
                color: "#fff",
              }}
            >
              F
            </div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.03em",
              }}
            >
              fin<span style={{ opacity: 0.75, fontWeight: 400 }}>TRACK</span>
            </h2>
          </Link>

          <div className="flex items-center gap-3">
            {/* Date — desktop */}
            <div
              className="hidden lg:block"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "8px",
                padding: "5px 12px",
                color: "rgba(255,255,255,0.8)",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "10px",
                padding: "8px",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setOpenSideMenu(!openSideMenu)}
            >
              {openSideMenu ? (
                <HiOutlineX style={{ fontSize: "22px" }} />
              ) : (
                <HiOutlineMenuAlt3 style={{ fontSize: "22px" }} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile slide-down drawer ── */}
      {openSideMenu && (
        <div
          className="lg:hidden"
          style={{
            position: "fixed",
            top: "61px",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 45,
            background: "#0f172a",
            overflowY: "auto",
            borderTop: `2px solid ${navColor}`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          {/* Full-height side menu inside drawer */}
          <div
            onClick={(e) => {
              // close drawer when a nav item (not customizer) is clicked
              if (e.target.closest("button[data-navitem]")) handleClose();
            }}
          >
            <SideMenu activeMenu={activeMenu} onNavigate={handleClose} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
