import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7" }}>
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          {/* Sidebar — hidden below 1080px */}
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main content — full width on mobile, with sidebar offset on desktop */}
          <div
            style={{
              flex: 1,
              minWidth: 0 /* prevents flex overflow */,
              width: "100%",
              overflowX: "hidden",
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
