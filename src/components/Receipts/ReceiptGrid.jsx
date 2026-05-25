import { Trash2, Eye } from "lucide-react";

export default function ReceiptGrid({
  receipts,
  selectMode,
  selected,
  onSelect,
  onPreview,
  onDelete,
}) {
  return (
    <div className="receipts-grid">
      {receipts.map((receipt) => {
        const isSelected = selected.includes(receipt._id);
        const isPDF = receipt.mimetype === "application/pdf";
        const imgUrl = receipt.url;

        return (
          <div
            key={receipt._id}
            className={`receipt-card ${isSelected ? "selected" : ""}`}
            onClick={() =>
              selectMode ? onSelect(receipt._id) : onPreview(receipt)
            }
          >
            {selectMode && (
              <div className={`select-check ${isSelected ? "checked" : ""}`}>
                {isSelected ? "✓" : ""}
              </div>
            )}
            <div className="receipt-thumb">
              {isPDF ? (
                <div className="pdf-thumb">
                  <span>PDF</span>
                </div>
              ) : (
                <img src={imgUrl} alt={receipt.originalName} loading="lazy" />
              )}
            </div>
            <div className="receipt-info">
              <p className="receipt-name" title={receipt.originalName}>
                {receipt.originalName}
              </p>
              <p className="receipt-date">
                {new Date(receipt.uploadedAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            {!selectMode && (
              <div
                className="receipt-card-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="icon-btn"
                  onClick={() => onPreview(receipt)}
                  title="Preview"
                >
                  <Eye size={13} />
                </button>
                <button
                  className="icon-btn danger"
                  onClick={() => {
                    if (window.confirm("Delete this receipt?"))
                      onDelete(receipt._id);
                  }}
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
