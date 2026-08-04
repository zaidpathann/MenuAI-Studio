import { CheckSquare, Copy, Download, FileUp, KeyRound, RefreshCw, Sparkles, Square } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { getErrorMessage } from "../../api/client";
import {
  createClientKeyRequest,
  extractProjectRequest,
  generateDesignsRequest,
  getProjectRequest,
  listClientKeysRequest,
  publishDesignRequest,
  uploadPdfRequest
} from "../../api/endpoints";
import { DesignCard } from "../../components/designs/DesignCard";
import { Button } from "../../components/ui/Button";
import { StatusPill } from "../../components/ui/StatusPill";
import { Toast } from "../../components/ui/Toast";
import type { ToastState } from "../../components/ui/Toast";
import type { ClientAccessKey, Design, Project } from "../../types";
import { exportMultipleMenusPdf } from "../../utils/pdfExport";

export function ProjectDetail() {
  const { projectId = "" } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [selectedDesignIds, setSelectedDesignIds] = useState<string[]>([]);
  const [clientKeys, setClientKeys] = useState<ClientAccessKey[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  async function loadProject() {
    const [projectData, savedKeys] = await Promise.all([getProjectRequest(projectId), listClientKeysRequest(projectId)]);
    setProject(projectData.project);
    setDesigns(projectData.designs);
    setClientKeys(savedKeys);
  }

  useEffect(() => {
    setInitialLoading(true);
    loadProject()
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setInitialLoading(false));
  }, [projectId]);

  async function runAction(name: string, action: () => Promise<void>, successMessage: string) {
    setBusy(name);
    setError("");
    try {
      await action();
      setToast({ type: "success", message: successMessage });
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      setToast({ type: "error", message });
    } finally {
      setBusy("");
    }
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setToast({ type: "error", message: "Upload a PDF file." });
      event.target.value = "";
      return;
    }

    void runAction(
      "upload",
      async () => {
        await uploadPdfRequest(projectId, file);
        await loadProject();
        event.target.value = "";
      },
      "PDF uploaded and project saved."
    );
  }

  function toggleSelectDesign(id: string) {
    setSelectedDesignIds((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id]
    );
  }

  function toggleSelectAll() {
    if (selectedDesignIds.length === designs.length) {
      setSelectedDesignIds([]);
    } else {
      setSelectedDesignIds(designs.map((d) => d._id));
    }
  }

  async function handleBulkDownloadPdf() {
    if (selectedDesignIds.length === 0) return;
    const selectedDesigns = designs.filter((d) => selectedDesignIds.includes(d._id));
    setBusy("bulk-pdf");
    try {
      const filename = `${project?.restaurantName ?? "Restaurant"}_Combined_Menus.pdf`;
      await exportMultipleMenusPdf(selectedDesigns, filename);
      setToast({ type: "success", message: `Downloaded ${selectedDesigns.length} menu(s) as a single PDF!` });
    } catch (err) {
      setToast({ type: "error", message: "Failed to download combined PDF." });
    } finally {
      setBusy("");
    }
  }

  if (initialLoading || !project) {
    return <p className="text-sm text-neutral-500">Loading project...</p>;
  }

  const allSelected = designs.length > 0 && selectedDesignIds.length === designs.length;

  return (
    <section>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold text-neutral-950">{project.restaurantName}</h1>
            <StatusPill status={project.status} />
          </div>
          <p className="mt-2 text-sm text-neutral-500">{project.name}</p>
        </div>
        <Button
          variant="secondary"
          disabled={busy === "key"}
          onClick={() =>
            runAction(
              "key",
              async () => {
                await createClientKeyRequest(projectId);
                setClientKeys(await listClientKeysRequest(projectId));
              },
              "Client key generated and saved."
            )
          }
        >
          <KeyRound size={16} />
          {busy === "key" ? "Saving" : "Client Key"}
        </Button>
      </div>

      {error ? <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {clientKeys.length > 0 ? (
        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-emerald-900">Saved client key</p>
            <p className="text-xs text-emerald-700">{clientKeys.length} active key(s)</p>
          </div>
          <div className="mt-3 grid gap-2">
            {clientKeys.map((key) => (
              <div key={key._id} className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-sm font-semibold text-emerald-800">{key.accessKey}</span>
                <Button
                  variant="secondary"
                  onClick={() => {
                    void navigator.clipboard.writeText(key.accessKey);
                    setToast({ type: "success", message: "Client key copied." });
                  }}
                >
                  <Copy size={16} />
                  Copy
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-950">Upload</h2>
          <label className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-5 text-center">
            <FileUp className="text-neutral-500" size={28} />
            <span className="mt-3 text-sm font-medium text-neutral-800">Upload PDF</span>
            <input className="sr-only" type="file" accept="application/pdf,.pdf" onChange={handleUpload} />
          </label>
          <p className="mt-3 text-xs text-neutral-500">
            {busy === "upload" ? "Uploading..." : `${project.uploadedFiles.length} uploaded file(s)`}
          </p>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-950">Extract</h2>
          <p className="mt-3 text-sm text-neutral-500">
            {project.extractedData ? `${project.extractedData.sections.length} menu section(s)` : "No menu data yet"}
          </p>
          <Button
            className="mt-5 w-full"
            variant="secondary"
            disabled={busy === "extract"}
            onClick={() =>
              runAction(
                "extract",
                async () => {
                  await extractProjectRequest(projectId);
                  await loadProject();
                },
                "Menu extracted successfully."
              )
            }
          >
            <RefreshCw size={16} />
            {busy === "extract" ? "Extracting…" : "Extract from PDF"}
          </Button>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-950">Generate</h2>
          <p className="mt-3 text-sm text-neutral-500">{designs.length} / 60 design(s)</p>
          <Button
            className="mt-5 w-full"
            disabled={busy === "generate" || designs.length >= 60}
            onClick={() =>
              runAction(
                "generate",
                async () => {
                  if (!project.extractedData) {
                    throw new Error("Run extraction before generating designs.");
                  }
                  const result = await generateDesignsRequest(projectId);
                  setDesigns(result.designs);
                  await loadProject();
                },
                "10 designs generated."
              )
            }
          >
            <Sparkles size={16} />
            {busy === "generate" ? "Generating…" : designs.length === 0 ? "Generate 10" : "Generate More"}
          </Button>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-950">Generated Designs ({designs.length})</h2>
          {selectedDesignIds.length > 0 && (
            <p className="text-xs text-neutral-500 mt-1">{selectedDesignIds.length} design(s) selected</p>
          )}
        </div>

        {designs.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={toggleSelectAll}>
              {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
              {allSelected ? "Deselect All" : "Select All"}
            </Button>

            <Button
              disabled={selectedDesignIds.length === 0 || busy === "bulk-pdf"}
              onClick={handleBulkDownloadPdf}
            >
              <Download size={16} />
              {busy === "bulk-pdf"
                ? "Generating PDF..."
                : `Download Selected (${selectedDesignIds.length}) as Single PDF`}
            </Button>
          </div>
        )}
      </div>

      {designs.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center">
          <p className="text-sm font-medium text-neutral-900">No designs generated yet</p>
          <p className="mt-1 text-sm text-neutral-500">Upload a PDF, run extraction, then generate 10 templates.</p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {designs.map((design) => (
          <DesignCard
            key={design._id}
            design={design}
            publishing={busy === design._id}
            selected={selectedDesignIds.includes(design._id)}
            onToggleSelect={toggleSelectDesign}
            onPublish={(designId) =>
              runAction(
                designId,
                async () => {
                  await publishDesignRequest(designId);
                  await loadProject();
                },
                "Design published."
              )
            }
          />
        ))}
      </div>
    </section>
  );
}
