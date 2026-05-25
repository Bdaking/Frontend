import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  RECEIPT_FOLDERS_API,
  RECEIPTS_API,
  RECEIPT_UPLOAD_API,
  RECEIPT_EXPORT_PDF_API,
} from "../../utils/receiptApiPaths";
import FolderCard from "./FolderCard";
import ReceiptGrid from "./ReceiptGrid";
import ReceiptModal from "./ReceiptModal";
import {
  FolderPlus,
  Upload,
  ArrowLeft,
  SortAsc,
  SortDesc,
  FileDown,
  Trash2,
  X,
  CheckSquare,
  Square,
  House,
  Camera,
} from "lucide-react";
import "./Receipts.css";

export default function Receipts() {
  const navigate = useNavigate();

  const [folders, setFolders] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [previewReceipt, setPreviewReceipt] = useState(null);
  const [newFolderModal, setNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renamingFolder, setRenamingFolder] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  // Upload preview state
  const [pendingFiles, setPendingFiles] = useState([]);
  const [showUploadPreview, setShowUploadPreview] = useState(false);

  const fileInputRef = useRef();
  const cameraInputRef = useRef();

  useEffect(() => {
    fetchFolders();
    fetchReceipts();
  }, []);

  useEffect(() => {
    fetchReceipts();
  }, [activeFolder, sortAsc]);

  const fetchFolders = async () => {
    try {
      const { data } = await axiosInstance.get(RECEIPT_FOLDERS_API);
      setFolders(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const params = { sort: sortAsc ? "asc" : "desc" };
      if (activeFolder) params.folderId = activeFolder._id;
      const { data } = await axiosInstance.get(RECEIPTS_API, { params });
      setReceipts(data.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await axiosInstance.post(RECEIPT_FOLDERS_API, {
        name: newFolderName.trim(),
      });
      setNewFolderName("");
      setNewFolderModal(false);
      fetchFolders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRenameFolder = async () => {
    if (!renameValue.trim()) return;
    try {
      await axiosInstance.put(`${RECEIPT_FOLDERS_API}/${renamingFolder._id}`, {
        name: renameValue.trim(),
      });
      setRenamingFolder(null);
      setRenameValue("");
      fetchFolders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteFolder = async (folder) => {
    if (!window.confirm(`Delete folder "${folder.name}" and all its receipts?`))
      return;
    try {
      await axiosInstance.delete(`${RECEIPT_FOLDERS_API}/${folder._id}`);
      if (activeFolder?._id === folder._id) setActiveFolder(null);
      fetchFolders();
      fetchReceipts();
    } catch (e) {
      console.error(e);
    }
  };

  // Stage files for preview before upload
  const stageFiles = (files) => {
    if (!files || !files.length) return;
    const previews = Array.from(files).map((file) => ({
      file,
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));
    setPendingFiles(previews);
    setShowUploadPreview(true);
  };

  const handleUpload = async (filesToUpload) => {
    if (!filesToUpload || !filesToUpload.length) return;
    const formData = new FormData();
    filesToUpload.forEach(({ file }) => formData.append("receipts", file));
    if (activeFolder) formData.append("folderId", activeFolder._id);
    try {
      await axiosInstance.post(RECEIPT_UPLOAD_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchReceipts();
    } catch (e) {
      console.error(e);
    }
  };

  const confirmUpload = async () => {
    await handleUpload(pendingFiles);
    pendingFiles.forEach(
      (p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl),
    );
    setPendingFiles([]);
    setShowUploadPreview(false);
  };

  const cancelUpload = () => {
    pendingFiles.forEach(
      (p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl),
    );
    setPendingFiles([]);
    setShowUploadPreview(false);
  };

  const removePending = (index) => {
    setPendingFiles((prev) => {
      const updated = [...prev];
      if (updated[index].previewUrl)
        URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
    if (pendingFiles.length === 1) setShowUploadPreview(false);
  };

  const handleDeleteReceipt = async (id) => {
    try {
      await axiosInstance.delete(`${RECEIPTS_API}/${id}`);
      setSelected((s) => s.filter((x) => x !== id));
      fetchReceipts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Delete ${selected.length} receipt(s)?`)) return;
    await Promise.all(
      selected.map((id) => axiosInstance.delete(`${RECEIPTS_API}/${id}`)),
    );
    setSelected([]);
    setSelectMode(false);
    fetchReceipts();
  };

  const handleExportPDF = async () => {
    const ids =
      selectMode && selected.length ? selected : receipts.map((r) => r._id);
    if (!ids.length) return alert("No receipts to export");
    try {
      const response = await axiosInstance.post(
        RECEIPT_EXPORT_PDF_API,
        { receiptIds: ids },
        { responseType: "blob" },
      );
      const url = URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "receipts.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSelect = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  const toggleSelectAll = () =>
    setSelected(
      selected.length === receipts.length ? [] : receipts.map((r) => r._id),
    );

  return (
    <div className="receipts-page">
      {/* ── Header ── */}
      <div className="receipts-header">
        <div className="receipts-breadcrumb">
          <button
            className="back-btn"
            onClick={() => navigate("/dashboard")}
            title="Back to Dashboard"
          >
            <House size={14} /> Home
          </button>

          {activeFolder && <span className="breadcrumb-sep">/</span>}

          {activeFolder && (
            <button className="back-btn" onClick={() => setActiveFolder(null)}>
              <ArrowLeft size={14} /> All
            </button>
          )}

          <h2>{activeFolder ? activeFolder.name : "Receipts"}</h2>
        </div>

        <div className="receipts-actions">
          {selectMode ? (
            <>
              <button
                className="action-btn select-all-btn"
                onClick={toggleSelectAll}
              >
                {selected.length === receipts.length ? (
                  <CheckSquare size={15} />
                ) : (
                  <Square size={15} />
                )}
                <span className="btn-label">
                  {selected.length === receipts.length
                    ? "Deselect All"
                    : "Select All"}
                </span>
              </button>
              {selected.length > 0 && (
                <button
                  className="action-btn danger-btn"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 size={15} />
                  <span className="btn-label">Delete ({selected.length})</span>
                </button>
              )}
              <button
                className="action-btn"
                onClick={() => {
                  setSelectMode(false);
                  setSelected([]);
                }}
              >
                <X size={15} />
                <span className="btn-label">Cancel</span>
              </button>
            </>
          ) : (
            <>
              <button
                className="action-btn icon-only-mobile"
                onClick={() => setSortAsc((s) => !s)}
                title={sortAsc ? "Oldest First" : "Newest First"}
              >
                {sortAsc ? <SortAsc size={15} /> : <SortDesc size={15} />}
                <span className="btn-label">
                  {sortAsc ? "Oldest" : "Newest"}
                </span>
              </button>
              <button
                className="action-btn icon-only-mobile"
                onClick={handleExportPDF}
                title="Export PDF"
              >
                <FileDown size={15} />
                <span className="btn-label">Export</span>
              </button>
              <button
                className="action-btn icon-only-mobile"
                onClick={() => setSelectMode(true)}
              >
                <CheckSquare size={15} />
                <span className="btn-label">Select</span>
              </button>
              {!activeFolder && (
                <button
                  className="action-btn primary-btn icon-only-mobile"
                  onClick={() => setNewFolderModal(true)}
                >
                  <FolderPlus size={15} />
                  <span className="btn-label">Folder</span>
                </button>
              )}
              {/* Camera capture — mobile friendly */}
              <button
                className="action-btn primary-btn icon-only-mobile"
                onClick={() => cameraInputRef.current.click()}
                title="Take Photo"
              >
                <Camera size={15} />
                <span className="btn-label">Camera</span>
              </button>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={(e) => stageFiles(e.target.files)}
              />
              <button
                className="action-btn primary-btn"
                onClick={() => fileInputRef.current.click()}
              >
                <Upload size={15} />
                <span className="btn-label">Upload</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf"
                style={{ display: "none" }}
                onChange={(e) => stageFiles(e.target.files)}
              />
            </>
          )}
        </div>
      </div>

      {/* Folders section */}
      {!activeFolder && (
        <section className="folders-section">
          <h3 className="section-title">Folders</h3>
          {folders.length === 0 ? (
            <p className="empty-hint">
              No folders yet. Create one to organise your receipts.
            </p>
          ) : (
            <div className="folders-grid">
              {folders.map((folder) => (
                <FolderCard
                  key={folder._id}
                  folder={folder}
                  onOpen={() => setActiveFolder(folder)}
                  onRename={() => {
                    setRenamingFolder(folder);
                    setRenameValue(folder.name);
                  }}
                  onDelete={() => handleDeleteFolder(folder)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Receipts grid — only shown when inside a folder */}
      {activeFolder && (
        <section className="receipts-section">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner" />
            </div>
          ) : receipts.length === 0 ? (
            <p className="empty-hint">No receipts here yet. Upload some!</p>
          ) : (
            <ReceiptGrid
              receipts={receipts}
              selectMode={selectMode}
              selected={selected}
              onSelect={toggleSelect}
              onPreview={setPreviewReceipt}
              onDelete={handleDeleteReceipt}
            />
          )}
        </section>
      )}

      {/* ── Upload Preview Modal ── */}
      {showUploadPreview && (
        <div className="modal-overlay" onClick={cancelUpload}>
          <div
            className="modal-box upload-preview-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="upload-preview-header">
              <h3>Preview before uploading</h3>
              <button className="icon-btn" onClick={cancelUpload}>
                <X size={16} />
              </button>
            </div>
            <div className="upload-preview-list">
              {pendingFiles.map((pf, i) => (
                <div key={i} className="upload-preview-item">
                  <div className="upload-thumb-wrap">
                    {pf.previewUrl ? (
                      <img
                        src={pf.previewUrl}
                        alt={pf.file.name}
                        className="upload-thumb-img"
                      />
                    ) : (
                      <div className="pdf-thumb-preview">
                        <span>PDF</span>
                        <p>{pf.file.name}</p>
                      </div>
                    )}
                  </div>
                  <div className="upload-file-meta">
                    <p className="upload-file-name">{pf.file.name}</p>
                    <p className="upload-file-size">
                      {(pf.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    className="icon-btn danger remove-pending-btn"
                    onClick={() => removePending(i)}
                    title="Remove"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="modal-btns">
              <button className="action-btn" onClick={cancelUpload}>
                Cancel
              </button>
              <button
                className="action-btn primary-btn"
                onClick={confirmUpload}
              >
                <Upload size={14} /> Upload {pendingFiles.length} file
                {pendingFiles.length > 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {newFolderModal && (
        <div className="modal-overlay" onClick={() => setNewFolderModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Folder</h3>
            <input
              autoFocus
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
            />
            <div className="modal-btns">
              <button
                className="action-btn"
                onClick={() => setNewFolderModal(false)}
              >
                Cancel
              </button>
              <button
                className="action-btn primary-btn"
                onClick={handleCreateFolder}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Folder Modal */}
      {renamingFolder && (
        <div className="modal-overlay" onClick={() => setRenamingFolder(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Rename Folder</h3>
            <input
              autoFocus
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRenameFolder()}
            />
            <div className="modal-btns">
              <button
                className="action-btn"
                onClick={() => setRenamingFolder(null)}
              >
                Cancel
              </button>
              <button
                className="action-btn primary-btn"
                onClick={handleRenameFolder}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Preview Modal */}
      {previewReceipt && (
        <ReceiptModal
          receipt={previewReceipt}
          onClose={() => setPreviewReceipt(null)}
          onDelete={() => {
            handleDeleteReceipt(previewReceipt._id);
            setPreviewReceipt(null);
          }}
          onExport={() => {
            axiosInstance
              .post(
                RECEIPT_EXPORT_PDF_API,
                { receiptIds: [previewReceipt._id] },
                { responseType: "blob" },
              )
              .then((res) => {
                const url = URL.createObjectURL(
                  new Blob([res.data], { type: "application/pdf" }),
                );
                const a = document.createElement("a");
                a.href = url;
                a.download = "receipt.pdf";
                a.click();
                URL.revokeObjectURL(url);
              });
          }}
        />
      )}
    </div>
  );
}
