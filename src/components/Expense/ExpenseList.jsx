import React from "react";
import { LuDownload, LuTrash2 } from "react-icons/lu";
import moment from "moment";

const ExpenseList = ({ transactions, onDelete, onDownload }) => {
  const sorted = [...(transactions || [])].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  return (
    <div className="card">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <h5
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#1e293b",
            margin: 0,
          }}
        >
          Sum hman tawhna te
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 500,
              color: "#94a3b8",
              marginLeft: 6,
            }}
          >
            (money spend on)
          </span>
        </h5>
        <button
          onClick={onDownload}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "#6366f1",
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 8,
            padding: "6px 14px",
            cursor: "pointer",
            transition: "all 0.18s",
          }}
        >
          <LuDownload size={14} /> Download
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: 14,
          border: "2px solid #e2e8f0",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.83rem",
          }}
        >
          <thead>
            <tr
              style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}
            >
              {["#", "Category", "Date", "Amount", ""].map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: "12px 16px",
                    textAlign: i === 3 ? "right" : "left",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.9)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "0.85rem",
                  }}
                >
                  No expense records yet.
                </td>
              </tr>
            ) : (
              sorted.map((expense, idx) => (
                <tr
                  key={expense._id}
                  style={{
                    background: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fff7ed")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      idx % 2 === 0 ? "#ffffff" : "#f8fafc")
                  }
                >
                  {/* # */}
                  <td
                    style={{
                      padding: "13px 16px",
                      color: "#94a3b8",
                      fontWeight: 700,
                      width: 40,
                      fontSize: "0.75rem",
                    }}
                  >
                    {idx + 1}
                  </td>
                  {/* Category */}
                  <td
                    style={{
                      padding: "13px 16px",
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      {expense.icon &&
                      (expense.icon.startsWith("http") ||
                        expense.icon.startsWith("/")) ? (
                        <img
                          src={expense.icon}
                          alt=""
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ) : expense.icon ? (
                        <span
                          style={{
                            fontSize: "1rem",
                            lineHeight: 1,
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {expense.icon}
                        </span>
                      ) : (
                        <span
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: "#fee2e2",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            color: "#ef4444",
                          }}
                        >
                          ₹
                        </span>
                      )}
                      {expense.category}
                    </div>
                  </td>
                  {/* Date */}
                  <td
                    style={{
                      padding: "13px 16px",
                      color: "#475569",
                      whiteSpace: "nowrap",
                      fontSize: "0.8rem",
                    }}
                  >
                    {moment(expense.date).format("DD MMM YYYY")}
                  </td>
                  {/* Amount */}
                  <td
                    style={{
                      padding: "13px 16px",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700,
                        color: "#dc2626",
                        background: "#fee2e2",
                        border: "1px solid #fecaca",
                        borderRadius: 7,
                        padding: "3px 10px",
                        fontSize: "0.8rem",
                      }}
                    >
                      -₹{expense.amount?.toLocaleString("en-IN")}
                    </span>
                  </td>
                  {/* Delete */}
                  <td
                    style={{
                      padding: "13px 16px",
                      textAlign: "center",
                      width: 44,
                    }}
                  >
                    <button
                      onClick={() => onDelete(expense._id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 30,
                        height: 30,
                        borderRadius: 7,
                        border: "1px solid #fca5a5",
                        background: "#fff1f2",
                        color: "#ef4444",
                        cursor: "pointer",
                        transition: "all 0.18s",
                        margin: "0 auto",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fee2e2";
                        e.currentTarget.style.borderColor = "#f87171";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff1f2";
                        e.currentTarget.style.borderColor = "#fca5a5";
                      }}
                      title="Delete"
                    >
                      <LuTrash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {sorted.length > 0 && (
            <tfoot>
              <tr
                style={{
                  background: "#f8fafc",
                  borderTop: "2px solid #e2e8f0",
                }}
              >
                <td
                  colSpan={3}
                  style={{
                    padding: "11px 16px",
                    fontSize: "0.75rem",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  {sorted.length} record{sorted.length !== 1 ? "s" : ""}
                </td>
                <td style={{ padding: "11px 16px", textAlign: "right" }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 800,
                      color: "#dc2626",
                      fontSize: "0.85rem",
                    }}
                  >
                    ₹
                    {sorted
                      .reduce((s, t) => s + (t.amount || 0), 0)
                      .toLocaleString("en-IN")}
                  </span>
                </td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
