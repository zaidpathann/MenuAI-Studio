import { Download, KeyRound, Utensils } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { getErrorMessage } from "../../api/client";
import { verifyClientKeyRequest } from "../../api/endpoints";
import { MenuPreview } from "../../components/designs/MenuPreview";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { Toast } from "../../components/ui/Toast";
import type { ToastState } from "../../components/ui/Toast";
import type { Design } from "../../types";
import { exportMultipleMenusPdf, exportSingleMenuPdf } from "../../utils/pdfExport";

type AccessResult = {
  project: {
    name: string;
    restaurantName: string;
  };
  designs: Design[];
};

export function AccessPage() {
  const [accessKey, setAccessKey] = useState("");
  const [result, setResult] = useState<AccessResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const normalizedKey = accessKey.trim().toUpperCase();

    if (!/^MENU-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(normalizedKey)) {
      setToast({ type: "error", message: "Enter a valid MENU-XXXX-XXXX key." });
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      setAccessKey(normalizedKey);
      setResult(await verifyClientKeyRequest(normalizedKey));
      setToast({ type: "success", message: "Published project loaded." });
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      setToast({ type: "error", message });
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadAllPdfs() {
    if (!result || result.designs.length === 0) return;
    setDownloading(true);
    try {
      const filename = `${result.project.restaurantName}_Published_Menus.pdf`;
      await exportMultipleMenusPdf(result.designs, filename);
      setToast({ type: "success", message: "PDF downloaded successfully!" });
    } catch (err) {
      setToast({ type: "error", message: "Failed to download PDF." });
    } finally {
      setDownloading(false);
    }
  }

  async function handleDownloadSinglePdf(design: Design) {
    setDownloading(true);
    try {
      await exportSingleMenuPdf(design);
      setToast({ type: "success", message: "Menu PDF downloaded!" });
    } catch (err) {
      setToast({ type: "error", message: "Failed to download PDF." });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f6f3]">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-950 text-white">
            <Utensils size={20} />
          </span>
          <span className="font-semibold text-neutral-950">MenuAI Studio</span>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-5 py-8">
        <form onSubmit={handleSubmit} className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <Field
              label="Project Key"
              value={accessKey}
              placeholder="MENU-XXXX-XXXX"
              onChange={(event) => setAccessKey(event.target.value.toUpperCase())}
              required
            />
            <Button type="submit" disabled={loading}>
              <KeyRound size={16} />
              {loading ? "Opening" : "Open"}
            </Button>
          </div>
          {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        </form>

        {result ? (
          <div className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-neutral-950">{result.project.restaurantName}</h1>
                <p className="mt-2 text-sm text-neutral-500">{result.project.name}</p>
              </div>
              {result.designs.length > 0 && (
                <Button variant="secondary" disabled={downloading} onClick={handleDownloadAllPdfs}>
                  <Download size={16} />
                  {downloading ? "Downloading PDF..." : "Download PDF"}
                </Button>
              )}
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {result.designs.map((design) => (
                <article key={design._id} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-neutral-900">{(design as any).label ?? design.category}</h3>
                    <Button variant="ghost" disabled={downloading} onClick={() => handleDownloadSinglePdf(design)}>
                      <Download size={14} /> PDF
                    </Button>
                  </div>
                  <MenuPreview design={design} />
                </article>
              ))}
            </div>
            {result.designs.length === 0 ? (
              <div className="mt-6 rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center">
                <p className="text-sm font-medium text-neutral-900">No published designs available</p>
                <p className="mt-1 text-sm text-neutral-500">Ask the agency admin to publish a design for this project.</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}
