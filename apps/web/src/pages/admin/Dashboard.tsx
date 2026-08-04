import { FolderKanban, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../api/client";
import { getProjectsRequest } from "../../api/endpoints";
import { ProjectCard } from "../../components/projects/ProjectCard";
import { Button } from "../../components/ui/Button";
import type { Project } from "../../types";

export function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProjectsRequest()
      .then(setProjects)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  function handleDeleted(projectId: string) {
    setProjects((prev) => prev.filter((p) => p._id !== projectId));
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">Projects</p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-950">Dashboard</h1>
        </div>
        <Button onClick={() => navigate("/admin/projects/new")}>
          <Plus size={16} />
          New Project
        </Button>
      </div>

      {error ? <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="mt-8 text-sm text-neutral-500">Loading projects...</p> : null}

      {!loading && projects.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-neutral-300 bg-white p-10 text-center">
          <FolderKanban className="mx-auto text-neutral-400" size={36} />
          <h2 className="mt-4 text-lg font-semibold text-neutral-950">No projects yet</h2>
          <Button className="mt-5" onClick={() => navigate("/admin/projects/new")}>
            <Plus size={16} />
            Create Project
          </Button>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} onDeleted={handleDeleted} />
        ))}
      </div>
    </section>
  );
}
