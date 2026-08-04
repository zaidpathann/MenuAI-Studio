import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../api/client";
import { createProjectRequest } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { Toast } from "../../components/ui/Toast";
import type { ToastState } from "../../components/ui/Toast";

export function ProjectCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedRestaurantName = restaurantName.trim();

    if (!trimmedName || !trimmedRestaurantName) {
      setToast({ type: "error", message: "Project name and restaurant name are required." });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const project = await createProjectRequest({ name: trimmedName, restaurantName: trimmedRestaurantName });
      navigate(`/admin/projects/${project._id}`);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      setToast({ type: "error", message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-2xl">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Button variant="ghost" onClick={() => navigate("/admin")}>
        <ArrowLeft size={16} />
        Back
      </Button>
      <h1 className="mt-6 text-3xl font-semibold text-neutral-950">Create Project</h1>
      <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4">
          <Field label="Project Name" value={name} onChange={(event) => setName(event.target.value)} required />
          <Field
            label="Restaurant Name"
            value={restaurantName}
            onChange={(event) => setRestaurantName(event.target.value)}
            required
          />
          {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          <Button type="submit" disabled={loading}>
            <Save size={16} />
            {loading ? "Creating" : "Create"}
          </Button>
        </div>
      </form>
    </section>
  );
}
