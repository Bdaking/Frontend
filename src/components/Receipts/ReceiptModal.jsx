import { X, Trash2, FileDown, Download } from "lucide-react";

export default function ReceiptModal({ receipt, onClose, onDelete, onExport }) {
  const isPDF = receipt.mimetype === "application/pdf";
  const fileUrl = receipt.url;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = receipt.originalName;
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="modal-overlay receipt-preview-overlay" onClick={onClose}>
      <div className="receipt-preview-box" onClick={(e) => e.stopPropagation()}>
        <div className="preview-header">
          <div>
            <h3 className="preview-title">{receipt.originalName}</h3>
            <p className="preview-meta">
              {new Date(receipt.uploadedAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}{" "}
              · {(receipt.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <div className="preview-actions">
            <button
              className="icon-btn"
              title="Download"
              onClick={handleDownload}
            >
              <Download size={16} />
            </button>
            <button
              className="icon-btn"
              title="Export as PDF"
              onClick={onExport}
            >
              <FileDown size={16} />
            </button>
            <button
              className="icon-btn danger"
              title="Delete"
              onClick={onDelete}
            >
              <Trash2 size={16} />
            </button>
            <button className="icon-btn" title="Close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="preview-body">
          {isPDF ? (
            <iframe src={fileUrl} title="PDF Preview" className="pdf-preview" />
          ) : (
            <img
              src={fileUrl}
              alt={receipt.originalName}
              className="preview-img"
            />
          )}
        </div>
      </div>
    </div>
  );
}
