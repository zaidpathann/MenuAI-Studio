import { Download, Edit3, Eye, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Design } from "../../types";
import { exportSingleMenuPdf } from "../../utils/pdfExport";
import { Button } from "../ui/Button";
import { StatusPill } from "../ui/StatusPill";
import { MenuPreview } from "./MenuPreview";

type DesignCardProps = {
  design: Design;
  onPublish: (designId: string) => void;
  publishing?: boolean;
  selected?: boolean;
  onToggleSelect?: (designId: string) => void;
};

export function DesignCard({ design, onPublish, publishing, selected, onToggleSelect }: DesignCardProps) {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);

  async function handleDownloadPdf() {
    setDownloading(true);
    try {
      await exportSingleMenuPdf(design);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <article className={`relative rounded-lg border bg-white p-4 shadow-sm transition-all ${
      selected ? "border-neutral-950 ring-2 ring-neutral-950/10" : "border-neutral-200 hover:border-neutral-300"
    }`}>
      {/* Checkbox overlay for multi-select */}
      {onToggleSelect && (
        <label className="absolute top-3 left-3 z-20 flex cursor-pointer items-center justify-center rounded bg-white/90 p-1 shadow-sm border border-neutral-300 backdrop-blur-xs">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
            checked={!!selected}
            onChange={() => onToggleSelect(design._id)}
          />
        </label>
      )}

      <div className="overflow-hidden rounded-md border border-neutral-200">
        <MenuPreview design={design} compact />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral-950">{(design as any).label ?? design.category}</h3>
          <p className="mt-1 text-xs text-neutral-500">Template {design.designIndex}</p>
        </div>
        <StatusPill status={design.status} />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        <Button variant="secondary" title="Preview" onClick={() => navigate(`/admin/designs/${design._id}/editor`)}>
          <Eye size={14} />
        </Button>
        <Button variant="secondary" title="Edit" onClick={() => navigate(`/admin/designs/${design._id}/editor`)}>
          <Edit3 size={14} />
        </Button>
        <Button variant="secondary" title="Download PDF" disabled={downloading} onClick={handleDownloadPdf}>
          <Download size={14} />
        </Button>
        <Button title="Publish" disabled={publishing} onClick={() => onPublish(design._id)}>
          <Send size={14} />
        </Button>
      </div>
    </article>
  );
}
