import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths"; // Imported to fix the endpoints
import { MdDeleteOutline } from "react-icons/md";

// Inline styles to avoid Tailwind conflicts for the new design
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .notes-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100%;
    padding: 2rem 2.5rem;
    background: #f7f5f2;
  }

  .notes-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .notes-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 600;
    color: #1a1714;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .notes-title span {
    display: block;
    font-style: italic;
    font-weight: 400;
    font-size: 1rem;
    color: #9b8e82;
    margin-bottom: 4px;
    letter-spacing: 0.04em;
  }

  .notes-count-badge {
    background: #1a1714;
    color: #f7f5f2;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    padding: 6px 14px;
    border-radius: 100px;
    text-transform: uppercase;
  }

  /* Composer */
  .composer-card {
    background: #fff;
    border-radius: 20px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
    position: relative;
    overflow: hidden;
  }

  .composer-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #7c5cbf, #b07fff, #e89fff);
  }

  .composer-label {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #9b8e82;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .composer-label::before {
    content: '✦';
    color: #7c5cbf;
    font-size: 0.6rem;
  }

  .composer-textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: #1a1714;
    line-height: 1.7;
    background: transparent;
    min-height: 90px;
    box-sizing: border-box;
  }

  .composer-textarea::placeholder {
    color: #c8bfb5;
    font-style: italic;
  }

  .composer-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #f0ebe4;
  }

  .char-count {
    font-size: 0.72rem;
    color: #c8bfb5;
  }

  .save-btn {
    background: #1a1714;
    color: #f7f5f2;
    border: none;
    padding: 10px 24px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .save-btn:hover {
    background: #7c5cbf;
    transform: translateY(-1px);
  }

  .save-btn:active {
    transform: translateY(0);
  }

  .save-btn-icon {
    font-size: 1rem;
  }

  /* Empty state */
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #9b8e82;
  }

  .empty-state-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.4;
  }

  .empty-state-text {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 1.1rem;
    color: #c8bfb5;
  }

  /* Grid */
  .notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  /* Note card */
  .note-card {
    background: #fff;
    border-radius: 16px;
    padding: 1.25rem 1.25rem 1rem;
    box-shadow: 0 1px 10px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04);
    position: relative;
    transition: transform 0.2s, box-shadow 0.2s;
    animation: noteIn 0.35s ease both;
    overflow: hidden;
  }

  .note-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
  }

  @keyframes noteIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Color accent strip on left */
  .note-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    border-radius: 16px 0 0 16px;
  }

  .note-card.accent-0::before { background: #7c5cbf; }
  .note-card.accent-1::before { background: #e07b6e; }
  .note-card.accent-2::before { background: #4da89b; }
  .note-card.accent-3::before { background: #e8a838; }
  .note-card.accent-4::before { background: #5b8dd9; }

  .note-card-inner {
    padding-left: 0.75rem;
  }

  .note-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.6rem;
  }

  .note-number {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #c8bfb5;
  }

  .delete-btn {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: #d4cec9;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -4px -4px 0 0;
    opacity: 0;
    transition: opacity 0.2s, color 0.2s;
  }

  .note-card:hover .delete-btn {
    opacity: 1;
  }

  .delete-btn:hover {
    color: #e07b6e;
    background: #fdf1f0;
  }

  .note-text {
    font-size: 0.9rem;
    color: #3d3530;
    line-height: 1.7;
    word-break: break-word;
    white-space: pre-wrap;
  }

  .note-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid #f5f1ec;
  }

  .note-date {
    font-size: 0.68rem;
    color: #c8bfb5;
    letter-spacing: 0.04em;
  }

  .note-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    opacity: 0.5;
  }

  .accent-0 .note-dot { background: #7c5cbf; }
  .accent-1 .note-dot { background: #e07b6e; }
  .accent-2 .note-dot { background: #4da89b; }
  .accent-3 .note-dot { background: #e8a838; }
  .accent-4 .note-dot { background: #5b8dd9; }
`;

const ACCENTS = ["accent-0", "accent-1", "accent-2", "accent-3", "accent-4"];

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const fetchNotes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.NOTES.GET_ALL_NOTES);
      setNotes(response.data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      await axiosInstance.post(API_PATHS.NOTES.ADD_NOTE, { text: newNote });
      setNewNote("");
      fetchNotes();
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.NOTES.DELETE_NOTE(id));
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      addNote();
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <DashboardLayout activeMenu="Notes">
      <style>{styles}</style>
      <div className="notes-root">
        {/* Header */}
        <div className="notes-header">
          <div className="notes-title">
            <span>Your workspace</span>
            Important Notes
          </div>
          {notes.length > 0 && (
            <div className="notes-count-badge">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </div>
          )}
        </div>

        {/* Fixed: Wrapped the comment in JSX curly braces to fix Vercel compilation crash */}
        {/* Composer */}
        <div className="composer-card">
          <div className="composer-label">New reminder</div>
          <textarea
            className="composer-textarea"
            placeholder="Jot down a financial reminder, goal, or thought..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="composer-footer">
            <span className="char-count">
              {newNote.length > 0
                ? `${newNote.length} chars · ⌘↵ to save`
                : "⌘↵ to save quickly"}
            </span>
            <button className="save-btn" onClick={addNote}>
              <span className="save-btn-icon">＋</span> Save Note
            </button>
          </div>
        </div>

        {/* Notes Grid or Empty State */}
        {notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text">
              No notes yet — add your first financial reminder above.
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note, index) => (
              <div
                key={note._id}
                className={`note-card ${ACCENTS[index % ACCENTS.length]}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="note-card-inner">
                  <div className="note-card-header">
                    <span className="note-number">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                      className="delete-btn"
                      onClick={() => deleteNote(note._id)}
                      title="Delete note"
                    >
                      <MdDeleteOutline size={17} />
                    </button>
                  </div>
                  <p className="note-text">{note.text}</p>
                  <div className="note-footer">
                    <span className="note-date">{formatDate(note.date)}</span>
                    <div className="note-dot" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notes;
