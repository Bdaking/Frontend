import React, { useState, useCallback, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

const AiSuggestions = ({ data }) => {
  const [suggestions, setSuggestions] = useState(() => {
    return localStorage.getItem("spendora_ai_cache") || "";
  });
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceType, setVoiceType] = useState("female");

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const speakAdvice = () => {
    if (!suggestions) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(suggestions);
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find((v) => {
      if (voiceType === "male") {
        return (
          v.name.includes("Male") ||
          v.name.includes("David") ||
          v.name.includes("Guy") ||
          v.name.includes("Google US English Male")
        );
      } else {
        return (
          v.name.includes("Female") ||
          v.name.includes("Zira") ||
          v.name.includes("Google UK English Female") ||
          v.name.includes("Samantha")
        );
      }
    });
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const fetchAiAdvice = useCallback(async () => {
    if (!data || Object.keys(data).length === 0) return;
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId"); // ← get userId from storage
      const res = await axiosInstance.post(API_PATHS.AI.GET_SUGGESTIONS, {
        userId,
      }); // ← send only userId
      const newAdvice = res.data.suggestions;
      setSuggestions(newAdvice);
      localStorage.setItem("spendora_ai_cache", newAdvice);
      setCooldown(60);
    } catch (err) {
      console.error("AI Error:", err);
      if (err.response?.status === 429) {
        setSuggestions("Daily quota reached. Check back tomorrow!");
        setCooldown(3600);
      } else {
        setSuggestions("Connection dropped. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [data]);

  return (
    <div className="p-4 bg-linear-to-r from-violet-50 to-white rounded-2xl border border-violet-100 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-primary flex items-center gap-2">
          ✨ finTRACK Ai
        </h3>

        {/* Voice selector — attractive pill buttons */}
        <div
          style={{
            display: "flex",
            gap: 6,
            background: "#f3f4f6",
            borderRadius: 999,
            padding: "4px",
            border: "1px solid #e5e7eb",
          }}
        >
          <button
            onClick={() => setVoiceType("female")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontSize: "0.7rem",
              fontWeight: 700,
              transition: "all 0.2s",
              background:
                voiceType === "female"
                  ? "linear-gradient(135deg, #ec4899, #f472b6)"
                  : "transparent",
              color: voiceType === "female" ? "#fff" : "#9ca3af",
              boxShadow:
                voiceType === "female"
                  ? "0 2px 8px rgba(236,72,153,0.35)"
                  : "none",
              letterSpacing: "0.02em",
            }}
          >
            <span style={{ fontSize: "0.85rem" }}>♀</span> Female
          </button>
          <button
            onClick={() => setVoiceType("male")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontSize: "0.7rem",
              fontWeight: 700,
              transition: "all 0.2s",
              background:
                voiceType === "male"
                  ? "linear-gradient(135deg, #3b82f6, #60a5fa)"
                  : "transparent",
              color: voiceType === "male" ? "#fff" : "#9ca3af",
              boxShadow:
                voiceType === "male"
                  ? "0 2px 8px rgba(59,130,246,0.35)"
                  : "none",
              letterSpacing: "0.02em",
            }}
          >
            <span style={{ fontSize: "0.85rem" }}>♂</span> Male
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end gap-2">
        <div className="flex-1">
          {loading ? (
            <div className="space-y-2">
              <div className="h-2 w-3/4 bg-violet-200 animate-pulse rounded" />
              <div className="h-2 w-1/2 bg-violet-100 animate-pulse rounded" />
            </div>
          ) : (
            <p className="text-xs text-gray-600 italic whitespace-pre-line leading-relaxed">
              {suggestions || "Ready to analyze your spending."}
            </p>
          )}
        </div>

        {/* Speak button */}
        {suggestions && !loading && (
          <button
            onClick={speakAdvice}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
              flexShrink: 0,
              transition: "all 0.2s",
              background: isSpeaking
                ? "linear-gradient(135deg,#ef4444,#f87171)"
                : voiceType === "female"
                  ? "linear-gradient(135deg,#ec4899,#f472b6)"
                  : "linear-gradient(135deg,#3b82f6,#60a5fa)",
              boxShadow: isSpeaking
                ? "0 3px 10px rgba(239,68,68,0.4)"
                : voiceType === "female"
                  ? "0 3px 10px rgba(236,72,153,0.4)"
                  : "0 3px 10px rgba(59,130,246,0.4)",
              animation: isSpeaking ? "pulse 1s infinite" : "none",
            }}
            title={isSpeaking ? "Stop" : "Listen"}
          >
            {isSpeaking ? "⏹" : "🔊"}
          </button>
        )}
      </div>

      <button
        onClick={fetchAiAdvice}
        disabled={loading || cooldown > 0}
        className="mt-3 text-[10px] font-medium text-primary hover:text-violet-700 transition-colors disabled:text-gray-400 flex items-center gap-1"
      >
        <span className={loading ? "animate-spin" : ""}>
          {loading ? "⏳" : "🔄"}
        </span>
        {loading
          ? "Syncing..."
          : cooldown > 0
            ? `Wait ${cooldown}s`
            : "Refresh Advice"}
      </button>
    </div>
  );
};

export default AiSuggestions;
