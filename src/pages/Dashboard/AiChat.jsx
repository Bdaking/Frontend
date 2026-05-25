import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import html2canvas from "html2canvas";
import { Download, Send, Bot, Sparkles, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { API_PATHS } from "../../utils/apiPath";

const AiChat = () => {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("ai_chat_messages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const reportRefs = useRef({});

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    localStorage.setItem("ai_chat_messages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (retryCount = 0) => {
    if (!input.trim() && retryCount === 0) return;
    const currentInput = input;
    if (retryCount === 0) {
      setMessages((prev) => [...prev, { role: "user", text: currentInput }]);
      setInput("");
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.AI.CHAT, {
        prompt: currentInput,
      });
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer, stats: data.stats },
      ]);
    } catch (err) {
      const status = err.response?.status;
      if (status === 503 && retryCount < 1) {
        toast.loading("Service temporarily unavailable. Retrying...", {
          duration: 2000,
        });
        setTimeout(() => handleSend(retryCount + 1), 3000);
        return;
      }
      toast.error(
        status === 429
          ? "Daily query limit reached. Please try again tomorrow."
          : "The AI service is currently unavailable. Please try again shortly.",
      );
      if (retryCount === 0) setInput(currentInput);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    localStorage.removeItem("ai_chat_messages");
    setMessages([]);
  };

  const parseTransactions = (text) => {
    const lines = text.split("\n").filter((l) => l.trim());
    const rows = [];
    lines.forEach((line) => {
      const nameMatch = line.match(/Name:\s*([^|]+)/i);
      const amountMatch = line.match(/Amount:\s*₹?([\d,]+)/i);
      const dateMatch = line.match(/Date:\s*([^|*\n]+)/i);
      const typeMatch = line.match(/Type:\s*(Income|Expense)/i);
      const boldMatch = line.match(
        /\*\*([^*]+)\*\*[:\s]*₹?([\d,]+)\s+on\s+(.+)/i,
      );
      if (boldMatch) {
        rows.push({
          name: boldMatch[1].trim(),
          amount: boldMatch[2].trim(),
          date: boldMatch[3].trim(),
          type: typeMatch ? typeMatch[1].trim() : null,
        });
      } else if (nameMatch && amountMatch) {
        rows.push({
          name: nameMatch[1].trim(),
          amount: amountMatch[1].trim(),
          date: dateMatch ? dateMatch[1].trim() : "—",
          type: typeMatch ? typeMatch[1].trim() : null,
        });
      }
    });
    return rows;
  };

  const downloadReport = async (index) => {
    const element = reportRefs.current[index];
    if (!element || isDownloading) return;
    setIsDownloading(true);
    const toastId = toast.loading("Preparing your financial report...");
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        onclone: (clonedDoc) => {
          const svgs = clonedDoc.querySelectorAll("svg");
          svgs.forEach((s) => s.remove());

          /* remove orb decorations entirely */
          const orbs = clonedDoc.querySelectorAll(".cw-s-orb");
          orbs.forEach((o) => o.remove());

          /* strip background/border-radius from Income & Expense badges */
          const badges = clonedDoc.querySelectorAll(
            ".cw-type-income, .cw-type-expense",
          );
          badges.forEach((el) => {
            el.style.background = "transparent";
            el.style.borderRadius = "0";
            el.style.padding = "0";
          });

          const cloneEl = clonedDoc.querySelector(
            `[data-report-id="${index}"]`,
          );
          if (cloneEl) {
            cloneEl.style.borderRadius = "0";
            cloneEl.style.padding = "32px";
          }
        },
      });
      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Canvas is empty");
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `FinTrack-Report-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Report exported successfully.", { id: toastId });
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }, "image/png");
    } catch (err) {
      console.error("CAPTURE ERROR:", err);
      toast.error("Export failed due to a security policy restriction.", {
        id: toastId,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const suggestions = [
    "Give me a full financial summary",
    "What are my total expenses?",
    "What is my current balance?",
  ];

  return (
    <DashboardLayout activeMenu="AI Chat">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

        :root {
          --white:        #ffffff;
          --bg-page:      #f5f7ff;
          --bg-card:      #ffffff;
          --bg-surface:   #f9faff;
          --bg-hover:     #f0f2ff;

          --border:       #e8eaf6;
          --border-hi:    #818cf8;

          --text-1:       #1e1b4b;
          --text-2:       #4338ca;
          --text-3:       #94a3b8;

          --indigo:       #4f46e5;
          --indigo-lite:  #e0e7ff;
          --indigo-mid:   #818cf8;

          --emerald:      #059669;
          --emerald-bg:   #d1fae5;
          --emerald-txt:  #065f46;

          --rose:         #e11d48;
          --rose-bg:      #ffe4e6;
          --rose-txt:     #9f1239;

          --shadow-sm:    0 1px 3px rgba(79,70,229,0.08), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-md:    0 4px 16px rgba(79,70,229,0.10), 0 2px 6px rgba(0,0,0,0.05);
          --shadow-lg:    0 12px 40px rgba(79,70,229,0.13), 0 4px 16px rgba(0,0,0,0.06);
        }

        .cw { font-family: 'Plus Jakarta Sans', sans-serif; }

        /* ── Shell ── */
        .cw-shell {
          background: var(--bg-page);
          border-radius: 24px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
          display: flex; flex-direction: column; height: 82vh; overflow: hidden;
        }

        /* ── Header ── */
        .cw-header {
          padding: 14px 20px;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .cw-header-left { display: flex; align-items: center; gap: 12px; }
        .cw-avatar {
          width: 40px; height: 40px; border-radius: 13px;
          background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(79,70,229,0.35);
          flex-shrink: 0;
        }
        .cw-name {
          font-family: 'Lora', serif;
          font-size: 15px; color: var(--text-1); letter-spacing: 0.01em; font-weight: 600;
        }
        .cw-status {
          display: flex; align-items: center; gap: 5px;
          font-size: 10px; color: var(--emerald); font-weight: 600; margin-top: 1px;
          letter-spacing: 0.07em; text-transform: uppercase;
        }
        .cw-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--emerald);
          box-shadow: 0 0 0 2px var(--emerald-bg);
          animation: cw-pulse 2s ease-in-out infinite;
        }
        @keyframes cw-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.8)} }

        .cw-clear {
          background: transparent; border: 1.5px solid var(--border);
          color: var(--text-3); cursor: pointer; border-radius: 10px;
          padding: 6px 13px; display: flex; align-items: center; gap: 5px;
          font-size: 11.5px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          transition: all 0.18s; letter-spacing: 0.01em;
        }
        .cw-clear:hover {
          background: var(--rose-bg); border-color: #fda4af; color: var(--rose);
        }

        /* ── Body ── */
        .cw-body {
          flex: 1; overflow-y: auto; padding: 24px 20px;
          display: flex; flex-direction: column; gap: 18px;
          background: var(--bg-page);
          scrollbar-width: thin; scrollbar-color: #c7d2fe transparent;
          min-height: 0;
        }
        .cw-body::-webkit-scrollbar { width: 4px; }
        .cw-body::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 4px; }

        /* ── Empty state ── */
        .cw-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 20px;
        }
        .cw-empty-icon {
          width: 68px; height: 68px; border-radius: 22px;
          background: linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%);
          border: 1.5px solid #c7d2fe;
          display: flex; align-items: center; justify-content: center;
          animation: cw-float 3.5s ease-in-out infinite;
          box-shadow: 0 8px 24px rgba(79,70,229,0.12);
        }
        @keyframes cw-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .cw-empty-title {
          font-family: 'Lora', serif; font-size: 22px; font-weight: 600;
          color: var(--text-1); text-align: center; line-height: 1.4;
        }
        .cw-empty-sub {
          font-size: 13px; color: var(--text-3); text-align: center;
          line-height: 1.75; font-weight: 400;
        }
        .cw-chips { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .cw-chip {
          background: var(--white); border: 1.5px solid var(--border);
          color: var(--text-2); font-size: 12px; padding: 7px 15px; border-radius: 50px;
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          transition: all 0.18s; letter-spacing: 0.01em; box-shadow: var(--shadow-sm);
        }
        .cw-chip:hover {
          background: var(--indigo-lite); border-color: var(--indigo-mid);
          color: var(--indigo); transform: translateY(-1px); box-shadow: var(--shadow-md);
        }

        /* ── Message rows ── */
        .cw-row { display: flex; animation: cw-in 0.28s cubic-bezier(0.34,1.2,0.64,1); }
        .cw-row.user { justify-content: flex-end; }
        .cw-row.ai   { justify-content: flex-start; }
        @keyframes cw-in { from{opacity:0;transform:translateY(12px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }

        /* User bubble */
        .cw-bubble-user {
          max-width: 72%; padding: 13px 18px; border-radius: 20px 20px 5px 20px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #fff; font-size: 13.5px; line-height: 1.7;
          box-shadow: 0 6px 20px rgba(79,70,229,0.32);
          white-space: pre-wrap; font-weight: 500;
        }

        /* ── Report card ── */
        .cw-report {
          max-width: 90%;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 6px 20px 20px 20px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .cw-report-stripe {
          height: 4px;
          background: linear-gradient(90deg, #4f46e5 0%, #818cf8 50%, #34d399 100%);
        }

        .cw-report-inner { padding: 22px 24px; }

        /* Report header row */
        .cw-rhead {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }
        .cw-rhead-left { display: flex; align-items: center; gap: 11px; }
        .cw-ft-badge {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, #4f46e5, #818cf8);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; color: #fff;
          letter-spacing: 0.06em; flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(79,70,229,0.35);
        }
        .cw-report-title {
          font-family: 'Lora', serif;
          font-size: 14.5px; color: var(--text-1); font-weight: 600;
        }
        .cw-report-date {
          font-size: 11px; color: var(--text-3); letter-spacing: 0.04em; font-weight: 500;
          background: var(--bg-surface); padding: 4px 10px; border-radius: 50px;
          border: 1px solid var(--border);
        }

        /* AI text */
        .cw-ai-text {
          font-size: 13.5px; line-height: 1.85; color: #475569;
          white-space: pre-wrap; margin-bottom: 0; font-weight: 400;
        }
        .cw-ai-text:not(:last-child) { margin-bottom: 18px; }

        /* ── Transaction table ── */
        .cw-tbl-wrap {
          border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden;
          margin-bottom: 18px; box-shadow: var(--shadow-sm);
        }
        .cw-tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
        .cw-tbl thead tr {
          background: linear-gradient(90deg, #f0f2ff 0%, #f5f3ff 100%);
        }
        .cw-tbl thead th {
          padding: 10px 16px; text-align: left;
          font-size: 9.5px; font-weight: 800; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--indigo-mid);
        }
        .cw-tbl thead th:last-child { text-align: right; }
        .cw-tbl tbody tr {
          border-top: 1px solid #f1f5f9; transition: background 0.14s;
        }
        .cw-tbl tbody tr:hover { background: #f8faff; }
        .cw-tbl tbody td {
          padding: 11px 16px; color: var(--text-1);
          vertical-align: middle; font-weight: 500;
        }
        .cw-tbl tbody td:last-child {
          text-align: right;
          font-family: 'Lora', serif;
          font-size: 14px; font-weight: 600;
        }
        .cw-tbl .td-num { color: #cbd5e1; font-size: 11px; font-weight: 600; }

        /* DATE — darker so it's clearly readable in export */
        .cw-tbl .td-date {
          color: #64748b; font-size: 11.5px; font-weight: 500;
        }

        .cw-tbl .td-amt-income  { color: var(--emerald); }
        .cw-tbl .td-amt-expense { color: var(--rose); }
        .cw-tbl .td-amt-neutral { color: var(--text-3); }

        .cw-type-income {
          display: inline-flex; align-items: center;
          font-size: 11.5px; font-weight: 700;
          color: var(--emerald); letter-spacing: 0.02em;
        }
        .cw-type-expense {
          display: inline-flex; align-items: center;
          font-size: 11.5px; font-weight: 700;
          color: var(--rose); letter-spacing: 0.02em;
        }
        .cw-type-dot { display: none; }

        /* ── Summary strip ── */
        .cw-summary {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          border-radius: 16px; overflow: hidden;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          gap: 1px; background: var(--border);
        }
        .cw-s-cell {
          padding: 16px 18px;
          background: var(--white);
          position: relative;
          /* clip so the orb circle never bleeds outside this cell */
          overflow: hidden;
        }
        .cw-s-label {
          font-size: 9px; font-weight: 800; letter-spacing: 0.14em;
          text-transform: uppercase; margin-bottom: 8px; display: block;
        }
        .cw-s-value {
          font-family: 'Lora', serif;
          font-size: 20px; font-weight: 600; line-height: 1; display: block;
        }
        .cw-s-sub {
          font-size: 10px; font-weight: 500; margin-top: 5px;
          display: flex; align-items: center; gap: 4px;
        }

        /*
          Orb: purely decorative circle — NO blur/filter so html2canvas
          captures it cleanly without smearing into adjacent areas.
          Clipped inside .cw-s-cell via overflow:hidden.
        */
        .cw-s-orb {
          position: absolute; bottom: -18px; right: -18px;
          width: 60px; height: 60px; border-radius: 50%; opacity: 0.22;
          /* no filter:blur — solid circle keeps paint inside the cell */
        }

        .s-inc { background: linear-gradient(135deg, #f0fdf4, #ffffff); }
        .s-inc .cw-s-label { color: var(--emerald); }
        .s-inc .cw-s-value { color: #065f46; }
        .s-inc .cw-s-sub   { color: var(--emerald); }
        .s-inc .cw-s-orb   { background: #a7f3d0; }

        .s-exp { background: linear-gradient(135deg, #fff1f2, #ffffff); }
        .s-exp .cw-s-label { color: var(--rose); }
        .s-exp .cw-s-value { color: #9f1239; }
        .s-exp .cw-s-sub   { color: var(--rose); }
        .s-exp .cw-s-orb   { background: #fecdd3; }

        .s-bal { background: linear-gradient(135deg, #eef2ff, #ffffff); }
        .s-bal .cw-s-label { color: var(--indigo); }
        .s-bal .cw-s-value { color: #3730a3; }
        .s-bal .cw-s-sub   { color: var(--indigo-mid); }
        .s-bal .cw-s-orb   { background: #c7d2fe; }

        /* ── Download button ── */
        .cw-dl-btn {
          width: 100%; padding: 12px 18px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: var(--bg-surface);
          color: var(--indigo-mid); font-size: 11.5px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer; transition: all 0.18s; border: none;
          border-top: 1px solid var(--border);
        }
        .cw-dl-btn:hover { background: var(--indigo-lite); color: var(--indigo); }

        /* ── Typing indicator ── */
        .cw-typing-row { display: flex; }
        .cw-typing {
          padding: 14px 18px; border-radius: 6px 18px 18px 18px;
          background: var(--white); border: 1px solid var(--border);
          display: flex; gap: 5px; align-items: center; box-shadow: var(--shadow-sm);
        }
        .cw-tdot {
          width: 6px; height: 6px; border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #818cf8);
          animation: cw-typing 1.1s ease-in-out infinite;
        }
        .cw-tdot:nth-child(2) { animation-delay: 0.18s; }
        .cw-tdot:nth-child(3) { animation-delay: 0.36s; }
        @keyframes cw-typing {
          0%,60%,100%{transform:translateY(0);opacity:.3}
          30%{transform:translateY(-5px);opacity:1}
        }

        /* ── Footer input ── */
        .cw-footer {
          padding: 14px 18px;
          background: var(--white);
          border-top: 1px solid var(--border);
          display: flex; gap: 10px; align-items: center;
          flex-shrink: 0;
        }
        .cw-input {
          flex: 1; background: var(--bg-page);
          border: 1.5px solid var(--border);
          border-radius: 14px; padding: 12px 18px;
          color: var(--text-1); font-size: 13.5px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500;
          outline: none; transition: all 0.2s;
          /* ensure placeholder is always clearly visible */
          opacity: 1;
        }
        .cw-input::placeholder { color: #94a3b8; font-weight: 400; opacity: 1; }
        .cw-input:focus {
          border-color: var(--indigo-mid);
          background: var(--white);
          box-shadow: 0 0 0 3px rgba(129,140,248,0.18);
        }
        .cw-send {
          width: 46px; height: 46px; border-radius: 14px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #fff; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(79,70,229,0.38);
          transition: all 0.2s; flex-shrink: 0;
        }
        .cw-send:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 8px 24px rgba(79,70,229,0.5);
        }
        .cw-send:active:not(:disabled) { transform: scale(0.97); }
        .cw-send:disabled {
          background: #e2e8f0; box-shadow: none; cursor: not-allowed; color: #94a3b8;
        }
      `}</style>

      <div className="cw cw-shell">
        {/* ── Header ── */}
        <div className="cw-header">
          <div className="cw-header-left">
            <div className="cw-avatar">
              <Bot size={19} color="#fff" />
            </div>
            <div>
              <div className="cw-name">finTRACK AI Assistant</div>
              <div className="cw-status">
                <span className="cw-dot" /> Live
              </div>
            </div>
          </div>
          {messages.length > 0 && (
            <button className="cw-clear" onClick={clearChat}>
              <Trash2 size={12} /> Clear
            </button>
          )}
        </div>

        {/* ── Body ── */}
        <div className="cw-body">
          {messages.length === 0 && (
            <div className="cw-empty">
              <div className="cw-empty-icon">
                <Sparkles size={28} color="#4f46e5" />
              </div>
              <div>
                <div className="cw-empty-title">
                  Intelligent Financial Analysis,
                  <br />
                  At Your Fingertips
                </div>
                <div className="cw-empty-sub" style={{ marginTop: 8 }}>
                  Ask about your income, expenses, savings,
                  <br />
                  or request a detailed financial overview.
                </div>
              </div>
              <div className="cw-chips">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="cw-chip"
                    onClick={() => {
                      setInput(s);
                      inputRef.current?.focus();
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => {
            const transactions =
              msg.role === "ai" ? parseTransactions(msg.text) : [];

            const cleanText =
              transactions.length > 0
                ? msg.text
                    .split("\n")
                    .filter((line) => !line.match(/Name:\s*[^|]+\|/i))
                    .join("\n")
                    .trim()
                : msg.text;

            return (
              <div key={i} className={`cw-row ${msg.role}`}>
                {msg.role === "user" ? (
                  <div className="cw-bubble-user">{msg.text}</div>
                ) : (
                  <div className="cw-report">
                    <div className="cw-report-stripe" />

                    {/* Capture area */}
                    <div
                      className="cw-report-inner"
                      ref={(el) => (reportRefs.current[i] = el)}
                      data-report-id={i}
                    >
                      {/* Report header */}
                      <div className="cw-rhead">
                        <div className="cw-rhead-left">
                          <div className="cw-ft-badge">FT</div>
                          <span className="cw-report-title">
                            Financial Overview Report
                          </span>
                        </div>
                        <span className="cw-report-date">
                          {new Date().toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* AI text */}
                      <p className="cw-ai-text">{cleanText}</p>

                      {/* Transaction table */}
                      {transactions.length > 0 && (
                        <div className="cw-tbl-wrap">
                          <table className="cw-tbl">
                            <thead>
                              <tr>
                                <th style={{ width: 36 }}>#</th>
                                <th>Type</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactions.map((txn, idx) => {
                                const isIncome = txn.type === "Income";
                                const isExpense = txn.type === "Expense";
                                return (
                                  <tr key={idx}>
                                    <td className="td-num">{idx + 1}</td>
                                    <td>
                                      {isIncome ? (
                                        <span className="cw-type-income">
                                          <span
                                            className="cw-type-dot"
                                            style={{ background: "#059669" }}
                                          />
                                          Income
                                        </span>
                                      ) : isExpense ? (
                                        <span className="cw-type-expense">
                                          <span
                                            className="cw-type-dot"
                                            style={{ background: "#e11d48" }}
                                          />
                                          Expense
                                        </span>
                                      ) : (
                                        <span
                                          style={{
                                            color: "var(--text-3)",
                                            fontSize: 11,
                                          }}
                                        >
                                          —
                                        </span>
                                      )}
                                    </td>
                                    <td>{txn.name}</td>
                                    {/* plain text date — no pill background */}
                                    <td className="td-date">{txn.date}</td>
                                    <td
                                      className={
                                        isIncome
                                          ? "td-amt-income"
                                          : isExpense
                                            ? "td-amt-expense"
                                            : "td-amt-neutral"
                                      }
                                    >
                                      {isExpense ? "−" : isIncome ? "+" : ""}₹
                                      {txn.amount}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Summary strip */}
                      {msg.stats && (
                        <div className="cw-summary">
                          <div className="cw-s-cell s-inc">
                            <span className="cw-s-label">Total Income</span>
                            <span className="cw-s-value">
                              ₹{msg.stats.totalIncome.toLocaleString()}
                            </span>
                            <span className="cw-s-sub">↑ earnings</span>
                            <div className="cw-s-orb" />
                          </div>
                          <div className="cw-s-cell s-exp">
                            <span className="cw-s-label">Total Expenses</span>
                            <span className="cw-s-value">
                              ₹{msg.stats.totalExpense.toLocaleString()}
                            </span>
                            <span className="cw-s-sub">↓ spent</span>
                            <div className="cw-s-orb" />
                          </div>
                          <div className="cw-s-cell s-bal">
                            <span className="cw-s-label">Net Balance</span>
                            <span className="cw-s-value">
                              ₹{msg.stats.balance.toLocaleString()}
                            </span>
                            <span className="cw-s-sub">= available</span>
                            <div className="cw-s-orb" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Download — outside capture */}
                    {msg.stats && (
                      <button
                        className="cw-dl-btn"
                        onClick={() => downloadReport(i)}
                      >
                        <Download size={13} /> Export Report as Image
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="cw-typing-row">
              <div className="cw-typing">
                <div className="cw-tdot" />
                <div className="cw-tdot" />
                <div className="cw-tdot" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* ── Input ── */}
        <div className="cw-footer">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your financial query here..."
            className="cw-input"
          />
          <button
            className="cw-send"
            onClick={() => handleSend()}
            disabled={loading}
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AiChat;
