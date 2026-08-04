import { Calendar, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { deleteProjectRequest } from "../../api/endpoints";
import { getErrorMessage } from "../../api/client";
import type { Project } from "../../types";
import { Button } from "../ui/Button";
import { StatusPill } from "../ui/StatusPill";

export function ProjectCard({
  project,
  onDeleted
}: {
  project: Project;
  onDeleted: (projectId: string) => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      await deleteProjectRequest(project._id);
      onDeleted(project._id);
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleting(false);
    }
  }

  return (
    <div className="relative rounded-lg border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-neutral-300 hover:shadow-md">
      <Link to={`/admin/projects/${project._id}`} className="block">
        <div className="flex items-start justify-between gap-4 pr-8">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">{project.restaurantName}</h2>
            <p className="mt-1 text-sm text-neutral-500">{project.name}</p>
          </div>
          <ChevronRight className="text-neutral-400" size={20} />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <StatusPill status={project.status} />
          <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
            <Calendar size={14} />
            {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </Link>

      {/* Delete trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setConfirmOpen(true);
        }}
        className="absolute right-4 top-4 rounded-md p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
        aria-label="Delete project"
      >
        <Trash2 size={16} />
      </button>

      {/* Confirm dialog */}
      {confirmOpen && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg bg-white/97 p-5 text-center backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="text-red-500" size={28} />
          <p className="text-sm font-medium text-neutral-900">
            Delete &ldquo;{project.restaurantName}&rdquo;?
          </p>
          <p className="text-xs text-neutral-500 leading-relaxed">
            This permanently removes the project, all generated designs, and client access keys from the database. This cannot be undone.
          </p>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <div className="mt-1 flex gap-2">
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setConfirmOpen(false);
                setError("");
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete();
              }}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete permanently"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
