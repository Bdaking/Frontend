import { Folder, Pencil, Trash2 } from "lucide-react";

export default function FolderCard({ folder, onOpen, onRename, onDelete }) {
  return (
    <div className="folder-card" onClick={onOpen}>
      <div className="folder-icon">
        <Folder size={28} />
      </div>
      <p className="folder-name">{folder.name}</p>
      <div className="folder-actions" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn" title="Rename" onClick={onRename}>
          <Pencil size={13} />
        </button>
        <button className="icon-btn danger" title="Delete" onClick={onDelete}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
