import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FeedbackForm from "../../components/Feedback/FeedbackForm";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeparator } from "../../utils/helper";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import Last30DaysExpense from "../../components/Dashboard/Last30DaysExpense";
import AiSuggestions from "../../components/AiSuggestions";

const dashStyles = `
  *, *::before, *::after { box-sizing: border-box; }

  .dash-root {
    font-family: 'Sora', sans-serif;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 0.875rem 3rem;
    overflow-x: hidden;
  }
  @media (min-width: 768px) {
    .dash-root { padding: 1.75rem 2rem 3rem; }
  }

  /* ── STATS ── */
  .dash-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem;
    margin-bottom: 1.25rem;
    width: 100%;
  }
  @media (min-width: 768px) {
    .dash-stats { gap: 1.25rem; margin-bottom: 2rem; }
  }

  /* Stat cards */
  .dash-stat {
    border-radius: 16px;
    padding: 0.9rem 0.9rem 0.75rem;
    display: flex; flex-direction: column; gap: 4px;
    animation: statIn 0.4s ease both;
    transition: transform 0.2s, box-shadow 0.2s;
    min-width: 0; position: relative; overflow: hidden;
  }
  .dash-stat:hover { transform: translateY(-3px); }
  @media (min-width: 768px) {
    .dash-stat { padding: 1.4rem 1.6rem 1.2rem; border-radius: 20px; gap: 8px; }
  }
  .dash-stat:nth-child(1) {
    animation-delay: 0.05s;
    background: linear-gradient(140deg, #6d28d9 0%, #8b5cf6 60%, #a78bfa 100%);
    box-shadow: 0 6px 20px rgba(109,40,217,0.38);
  }
  .dash-stat:nth-child(2) {
    animation-delay: 0.12s;
    background: linear-gradient(140deg, #047857 0%, #059669 60%, #34d399 100%);
    box-shadow: 0 6px 20px rgba(4,120,87,0.38);
  }
  .dash-stat:nth-child(3) {
    animation-delay: 0.19s;
    background: linear-gradient(140deg, #b91c1c 0%, #ef4444 60%, #fca5a5 100%);
    box-shadow: 0 6px 20px rgba(185,28,28,0.38);
  }
  .dash-stat:nth-child(1):hover { box-shadow: 0 10px 28px rgba(109,40,217,0.5); }
  .dash-stat:nth-child(2):hover { box-shadow: 0 10px 28px rgba(4,120,87,0.5); }
  .dash-stat:nth-child(3):hover { box-shadow: 0 10px 28px rgba(185,28,28,0.5); }
  /* decorative circle */
  .dash-stat::before {
    content: ''; position: absolute;
    top: -20px; right: -20px;
    width: 75px; height: 75px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
  }
  @keyframes statIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* icon + label row */
  .dash-stat-top {
    display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
  }
  .dash-stat-icon {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
    background: rgba(255,255,255,0.22); color: #fff;
  }
  @media (min-width: 768px) {
    .dash-stat-icon { width: 42px; height: 42px; font-size: 1.25rem; border-radius: 12px; }
  }

  /* ── LABEL: clearly readable ── */
  .dash-stat-label {
    font-size: 0.65rem; font-weight: 800;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.95); line-height: 1;
  }
  @media (min-width: 480px) { .dash-stat-label { font-size: 0.72rem; } }
  @media (min-width: 768px) { .dash-stat-label { font-size: 0.9rem; } }

  /* ── VALUE: big and bold ── */
  .dash-stat-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.1rem; font-weight: 800; color: #fff;
    letter-spacing: -0.02em; line-height: 1.2;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    min-width: 0; text-shadow: 0 1px 8px rgba(0,0,0,0.25);
  }
  @media (min-width: 400px) { .dash-stat-value { font-size: 1.3rem; } }
  @media (min-width: 768px) { .dash-stat-value { font-size: 2.1rem; } }

  /* bottom progress bar accent */
  .dash-stat-bar {
    height: 3px; border-radius: 99px;
    background: rgba(255,255,255,0.3);
    margin-top: 8px;
  }
  @media (min-width: 768px) { .dash-stat-bar { margin-top: 12px; height: 4px; } }

  /* ── CONTENT ── */
  .dash-content {
    display: flex; flex-direction: column; gap: 0.875rem;
    width: 100%;
  }
  @media (min-width: 768px) { .dash-content { gap: 1.5rem; } }

  .dash-section-label {
    font-size: 0.58rem; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: #9ca3af; margin-bottom: 0.5rem;
    display: flex; align-items: center; gap: 8px;
  }
  .dash-section-label::after {
    content: ''; flex: 1; height: 1px; background: #e5e7eb;
  }
  @media (min-width: 768px) { .dash-section-label { font-size: 0.65rem; } }

  .dash-card {
    background: #fff; border-radius: 16px;
    box-shadow: 0 2px 14px rgba(0,0,0,0.06);
    overflow: hidden;
    animation: cardIn 0.5s ease both;
    width: 100%; min-width: 0;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @media (min-width: 768px) { .dash-card { border-radius: 20px; } }

  /* ── TWO COL ── */
  .dash-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
    width: 100%;
  }
  @media (min-width: 768px) { .dash-two-col { gap: 1.5rem; } }

  /* ── Quick Nav Card ── */
  .quick-nav-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.1rem;
    gap: 8px;
  }
  .quick-nav-title {
    font-size: 0.72rem;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.3;
    flex: 1;
    min-width: 0;
  }
  @media (min-width: 768px) {
    .quick-nav-card { padding: 1.25rem 1.5rem; }
    .quick-nav-title { font-size: 0.88rem; }
  }
  .quick-nav-btn {
    display: flex; align-items: center; gap: 4px;
    font-size: 0.7rem; font-weight: 600;
    color: #6366f1;
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 8px; padding: 5px 10px;
    cursor: pointer; white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.18s;
  }
  .quick-nav-btn:hover {
    background: rgba(99,102,241,0.15);
    border-color: rgba(99,102,241,0.4);
  }
  @media (min-width: 768px) {
    .quick-nav-btn { font-size: 0.78rem; padding: 6px 14px; }
  }

  /* Collapsible */
  .collapsible-header {
    width: 100%; display: flex; align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: none; border: none; cursor: pointer; text-align: left;
  }
  @media (min-width: 768px) { .collapsible-header { padding: 18px 22px; } }
  .collapsible-label { font-size: 14px; font-weight: 700; color: #1e293b; }
  .collapsible-badge {
    font-size: 10px; font-weight: 600; color: #6366f1;
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 20px; padding: 3px 10px;
    letter-spacing: 0.04em; flex-shrink: 0;
  }
  .collapsible-body { border-top: 1px solid #f1f5f9; }
  .collapsible-sub-label {
    padding: 14px 16px 6px;
    font-size: 11px; font-weight: 700;
    color: #64748b; text-transform: uppercase; letter-spacing: 0.06em;
  }
  @media (min-width: 768px) {
    .collapsible-sub-label { padding: 16px 20px 8px; font-size: 12px; }
  }

  .dash-feedback-inner {
    padding: 1.25rem 1rem;
    display: flex; flex-direction: column; align-items: center;
  }
  @media (min-width: 768px) { .dash-feedback-inner { padding: 2.5rem 2rem; } }
  .dash-feedback-inner > * { width: 100%; max-width: 520px; }
`;

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`,
      );
      if (response.data) setDashboardData(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <style>{dashStyles}</style>
      <div className="dash-root">
        {/* 1. AI INSIGHTS */}
        <div className="dash-content" style={{ marginBottom: "1.25rem" }}>
          <div className="dash-section-label">AI Insights</div>
          <div className="dash-card">
            {dashboardData ? (
              <AiSuggestions
                data={{
                  totalIncome: dashboardData.totalIncome,
                  totalExpense: dashboardData.totalExpense,
                  transactions: dashboardData.recentTransactions,
                }}
              />
            ) : (
              <div
                style={{
                  padding: "1.25rem",
                  color: "#9ca3af",
                  fontSize: "0.82rem",
                }}
              >
                Loading AI insights...
              </div>
            )}
          </div>
        </div>

        {/* 2. STATS */}
        <div className="dash-stats">
          <div className="dash-stat">
            <div className="dash-stat-top">
              <div className="dash-stat-icon balance">
                <IoMdCard />
              </div>
              <div className="dash-stat-label">Balance</div>
            </div>
            <div className="dash-stat-value balance">
              ₹{addThousandsSeparator(dashboardData?.totalBalance || 0)}
            </div>
            <div className="dash-stat-bar" />
          </div>
          <div className="dash-stat">
            <div className="dash-stat-top">
              <div className="dash-stat-icon income">
                <LuWalletMinimal />
              </div>
              <div className="dash-stat-label">Income</div>
            </div>
            <div className="dash-stat-value income">
              ₹{addThousandsSeparator(dashboardData?.totalIncome || 0)}
            </div>
            <div className="dash-stat-bar" />
          </div>
          <div className="dash-stat">
            <div className="dash-stat-top">
              <div className="dash-stat-icon expense">
                <LuHandCoins />
              </div>
              <div className="dash-stat-label">Expense</div>
            </div>
            <div className="dash-stat-value expense">
              ₹{addThousandsSeparator(dashboardData?.totalExpense || 0)}
            </div>
            <div className="dash-stat-bar" />
          </div>
        </div>

        {/* 3. CONTENT */}
        <div className="dash-content">
          {/* Quick nav — Income & Expense */}
          <div className="dash-section-label">Recent Activity</div>
          <div className="dash-two-col">
            <div className="dash-card">
              <div className="quick-nav-card">
                <span className="quick-nav-title">
                  Pawisa lak luhna te (income)
                </span>
                <button
                  className="quick-nav-btn"
                  onClick={() => navigate("/income")}
                >
                  See All
                </button>
              </div>
            </div>
            <div className="dash-card">
              <div className="quick-nav-card">
                <span className="quick-nav-title">
                  Pawisa hmanna te (expense)
                </span>
                <button
                  className="quick-nav-btn"
                  onClick={() => navigate("/expense")}
                >
                  See All
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible More Details */}
          <div className="dash-card" style={{ animationDelay: "0.1s" }}>
            <button
              className="collapsible-header"
              onClick={() => setMoreOpen((p) => !p)}
            >
              <span className="collapsible-label">More Details</span>
              <span className="collapsible-badge">
                {moreOpen ? "▲ Hide" : "▼ Show"}
              </span>
            </button>

            {moreOpen && (
              <div className="collapsible-body">
                <div style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <RecentTransactions
                    transactions={dashboardData?.recentTransactions}
                    onSeeMore={() => navigate("/expense")}
                  />
                </div>
                <div style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ padding: "0 16px 16px" }}>
                    <FinanceOverview
                      totalBalance={dashboardData?.totalBalance || 0}
                      totalIncome={dashboardData?.totalIncome || 0}
                      totalExpense={dashboardData?.totalExpense || 0}
                    />
                  </div>
                </div>
                <div style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ padding: "0 16px 16px", minHeight: "220px" }}>
                    <Last30DaysExpense
                      data={
                        dashboardData?.last30DaysExpense?.transactions || []
                      }
                    />
                  </div>
                </div>
                <div>
                  <div className="dash-feedback-inner">
                    <FeedbackForm />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
