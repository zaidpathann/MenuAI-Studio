import { ArrowLeft, Download, Eye, Plus, Save, Send, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../../api/client";
import { getDesignRequest, publishDesignRequest, saveCanvasRequest } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import { Toast } from "../../components/ui/Toast";
import type { ToastState } from "../../components/ui/Toast";
import type { CanvasState, Design } from "../../types";
import { exportSingleMenuPdf } from "../../utils/pdfExport";

type El = Record<string, unknown>;
type SecItem = { name: string; description?: string; price?: number };
type Sec = { name: string; items: SecItem[] };

// ─── Inline element renderer (same logic as MenuPreview's RenderEl) ────────────
function PageElRenderer({ el }: { el: El }) {
  const base: React.CSSProperties = {
    position: "absolute",
    left: el.x as number,
    top: el.y as number,
    width: (el.width ?? el.w) as number,
    height: (el.height ?? el.h) as number,
    overflow: "hidden"
  };

  if (el.type === "shape") {
    return <div style={{ ...base, backgroundColor: (el.color ?? el.fill) as string, opacity: (el.opacity as number) ?? 1, pointerEvents: "none" }} />;
  }
  if (el.type === "shape-outline") {
    return <div style={{ ...base, border: `${(el.borderWidth as number) ?? 1}px solid ${el.color as string}`, opacity: (el.opacity as number) ?? 1, backgroundColor: "transparent", pointerEvents: "none" }} />;
  }
  if (el.type === "menu-list") {
    const secs = (el.sections as Sec[]) ?? [];
    const cur = (el.currency as string) ?? "INR";
    const syms: Record<string, string> = { INR: "₹", USD: "$", GBP: "£", EUR: "€", AED: "د.إ" };
    const s = syms[cur] ?? cur + " ";
    const cols: Sec[][] = [[], []];
    secs.forEach((sec, i) => cols[i % 2].push(sec));
    return (
      <div style={{ ...base, color: el.color as string, fontFamily: el.fontFamily as string, fontSize: 15 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 52px" }}>
          {cols.map((col, ci) => (
            <div key={ci}>
              {col.map(sec => (
                <div key={sec.name} style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 11, fontWeight: (el.sectionWeight as number) ?? 700, color: el.accentColor as string, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${el.accentColor as string}44` }}>{sec.name}</div>
                  {sec.items.map(item => (
                    <div key={item.name} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 16, fontWeight: 500 }}>{item.name}</span>
                        <span style={{ fontSize: 15, color: el.accentColor as string, marginLeft: 10, flexShrink: 0 }}>{item.price ? `${s}${item.price}` : ""}</span>
                      </div>
                      {item.description && <div style={{ fontSize: 12, color: (el.mutedColor as string) ?? "#888888", marginTop: 3 }}>{item.description}</div>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  // text
  const align = (el.textAlign ?? el.align ?? "left") as string;
  return (
    <div style={{
      ...base,
      color: el.color as string,
      fontFamily: (el.fontFamily ?? el.font) as string,
      fontSize: ((el.fontSize ?? el.size) as number) ?? 16,
      fontWeight: ((el.fontWeight ?? el.weight) as number) ?? 400,
      fontStyle: (el.fontStyle as string) ?? (el.italic ? "italic" : "normal"),
      lineHeight: 1.1,
      letterSpacing: el.letterSpacing ? `${el.letterSpacing as number}px` : undefined,
      textAlign: align === "center" ? "center" : align === "right" ? "right" : "left",
      display: "flex", alignItems: "flex-start",
      whiteSpace: "pre-wrap", wordBreak: "break-word",
      opacity: (el.opacity as number) ?? 1,
      pointerEvents: "none"
    }}>
      <span style={{ width: "100%" }}>{(el.text as string) ?? ""}</span>
    </div>
  );
}

// ─── Menu-List Sections and Items Editor ───────────────────────────────────────
function MenuListItemsEditor({ sections, onUpdateSections }: { sections: Sec[]; onUpdateSections: (secs: Sec[]) => void }) {
  const [activeSecIdx, setActiveSecIdx] = useState<number>(0);

  function updateSectionName(idx: number, name: string) {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], name };
    onUpdateSections(updated);
  }

  function updateItem(secIdx: number, itemIdx: number, patch: Partial<SecItem>) {
    const updated = [...sections];
    const items = [...updated[secIdx].items];
    items[itemIdx] = { ...items[itemIdx], ...patch };
    updated[secIdx] = { ...updated[secIdx], items };
    onUpdateSections(updated);
  }

  function addItem(secIdx: number) {
    const updated = [...sections];
    const items = [...updated[secIdx].items, { name: "New Item", price: 100, description: "Item description" }];
    updated[secIdx] = { ...updated[secIdx], items };
    onUpdateSections(updated);
  }

  function removeItem(secIdx: number, itemIdx: number) {
    const updated = [...sections];
    const items = updated[secIdx].items.filter((_, i) => i !== itemIdx);
    updated[secIdx] = { ...updated[secIdx], items };
    onUpdateSections(updated);
  }

  function addSection() {
    const updated = [...sections, { name: "NEW SECTION", items: [{ name: "Sample Item", price: 150 }] }];
    onUpdateSections(updated);
    setActiveSecIdx(updated.length - 1);
  }

  function removeSection(secIdx: number) {
    const updated = sections.filter((_, i) => i !== secIdx);
    onUpdateSections(updated);
    if (activeSecIdx >= updated.length) {
      setActiveSecIdx(Math.max(0, updated.length - 1));
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase text-neutral-600">Menu Sections & Items</span>
        <button
          type="button"
          onClick={addSection}
          className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
        >
          <Plus size={14} /> Add Section
        </button>
      </div>

      {sections.length === 0 ? (
        <p className="text-xs text-neutral-400">No sections in menu. Click above to add one.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Section selector tabs */}
          <div className="flex flex-wrap gap-1 border-b border-neutral-200 pb-2">
            {sections.map((sec, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSecIdx(idx)}
                className={`rounded px-2 py-1 text-xs font-medium ${
                  activeSecIdx === idx
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                {sec.name || `Section ${idx + 1}`}
              </button>
            ))}
          </div>

          {sections[activeSecIdx] && (
            <div className="flex flex-col gap-2 rounded bg-white p-3 border border-neutral-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 rounded border border-neutral-300 p-1.5 text-xs font-semibold uppercase outline-none focus:border-neutral-900"
                  value={sections[activeSecIdx].name}
                  onChange={(e) => updateSectionName(activeSecIdx, e.target.value)}
                  placeholder="SECTION NAME"
                />
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(activeSecIdx)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete section"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="mt-2 flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {sections[activeSecIdx].items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex flex-col gap-1.5 rounded border border-neutral-200 bg-neutral-50 p-2 text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 rounded border border-neutral-300 bg-white p-1 text-xs font-medium outline-none focus:border-neutral-900"
                        value={item.name}
                        onChange={(e) => updateItem(activeSecIdx, itemIdx, { name: e.target.value })}
                        placeholder="Item name"
                      />
                      <div className="flex items-center gap-1 w-20 flex-shrink-0">
                        <span className="text-neutral-400">Price:</span>
                        <input
                          type="number"
                          className="w-full rounded border border-neutral-300 bg-white p-1 text-xs outline-none"
                          value={item.price ?? ""}
                          onChange={(e) => updateItem(activeSecIdx, itemIdx, { price: e.target.value ? Number(e.target.value) : undefined })}
                          placeholder="0"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(activeSecIdx, itemIdx)}
                        className="p-1 text-red-400 hover:text-red-600"
                        title="Delete item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <input
                      type="text"
                      className="w-full rounded border border-neutral-200 bg-white p-1 text-[11px] text-neutral-600 outline-none"
                      value={item.description ?? ""}
                      onChange={(e) => updateItem(activeSecIdx, itemIdx, { description: e.target.value })}
                      placeholder="Description (optional)"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addItem(activeSecIdx)}
                className="mt-1 flex items-center justify-center gap-1 rounded border border-dashed border-neutral-300 p-1.5 text-xs text-neutral-600 hover:bg-neutral-50"
              >
                <Plus size={13} /> Add Menu Item
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Properties panel ─────────────────────────────────────────────────────────
function PropsPanel({ el, onUpdate }: { el: El; onUpdate: (patch: Partial<El>) => void }) {
  const type = el.type as string;
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="rounded-md bg-neutral-50 border border-neutral-200 p-3 text-xs text-neutral-500">
        <span className="font-semibold text-neutral-800 capitalize">{type}</span>
        {" · "}x {Math.round(el.x as number)} y {Math.round(el.y as number)}
      </div>

      {type === "text" && (
        <>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Text content
            <textarea rows={3}
              className="rounded-md border border-neutral-300 bg-white p-2 text-sm outline-none focus:border-neutral-900"
              value={(el.text as string) ?? ""}
              onChange={e => onUpdate({ text: e.target.value })}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Font size
            <input type="number" min={8} max={200}
              className="rounded-md border border-neutral-300 bg-white p-2 text-sm outline-none"
              value={((el.fontSize ?? el.size) as number) ?? 16}
              onChange={e => onUpdate({ fontSize: +e.target.value, size: +e.target.value })}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Color
            <input type="color" className="h-9 w-full rounded-md border border-neutral-300 cursor-pointer"
              value={(el.color as string) ?? "#ffffff"}
              onChange={e => onUpdate({ color: e.target.value })}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Align
            <select className="rounded-md border border-neutral-300 bg-white p-2 text-sm outline-none"
              value={(el.textAlign ?? el.align ?? "left") as string}
              onChange={e => onUpdate({ textAlign: e.target.value, align: e.target.value })}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Font weight
            <select className="rounded-md border border-neutral-300 bg-white p-2 text-sm outline-none"
              value={((el.fontWeight ?? el.weight) as number) ?? 400}
              onChange={e => onUpdate({ fontWeight: +e.target.value, weight: +e.target.value })}>
              <option value={300}>Light 300</option>
              <option value={400}>Regular 400</option>
              <option value={600}>Semibold 600</option>
              <option value={700}>Bold 700</option>
              <option value={900}>Black 900</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 cursor-pointer">
            <input type="checkbox"
              checked={el.fontStyle === "italic" || el.italic === true}
              onChange={e => onUpdate({ fontStyle: e.target.checked ? "italic" : "normal", italic: e.target.checked })}
            /> Italic
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Letter spacing (px)
            <input type="number" min={-5} max={30}
              className="rounded-md border border-neutral-300 bg-white p-2 text-sm outline-none"
              value={(el.letterSpacing as number) ?? 0}
              onChange={e => onUpdate({ letterSpacing: +e.target.value })}
            />
          </label>
        </>
      )}

      {type === "shape" && (
        <>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Fill color
            <input type="color" className="h-9 w-full rounded-md border border-neutral-300 cursor-pointer"
              value={(el.color as string) ?? "#111111"}
              onChange={e => onUpdate({ color: e.target.value })}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Opacity ({Math.round(((el.opacity as number) ?? 1) * 100)}%)
            <input type="range" min={0} max={1} step={0.05}
              value={(el.opacity as number) ?? 1}
              onChange={e => onUpdate({ opacity: +e.target.value })}
            />
          </label>
        </>
      )}

      {type === "menu-list" && (
        <>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Accent color
            <input type="color" className="h-9 w-full rounded-md border border-neutral-300 cursor-pointer"
              value={(el.accentColor as string) ?? "#C9A24D"}
              onChange={e => onUpdate({ accentColor: e.target.value })}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Text color
            <input type="color" className="h-9 w-full rounded-md border border-neutral-300 cursor-pointer"
              value={(el.color as string) ?? "#ffffff"}
              onChange={e => onUpdate({ color: e.target.value })}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Currency
            <select className="rounded-md border border-neutral-300 bg-white p-2 text-sm outline-none"
              value={(el.currency as string) ?? "INR"}
              onChange={e => onUpdate({ currency: e.target.value })}>
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="GBP">£ GBP</option>
              <option value="EUR">€ EUR</option>
              <option value="AED">د.إ AED</option>
            </select>
          </label>

          <MenuListItemsEditor
            sections={(el.sections as Sec[]) ?? []}
            onUpdateSections={(sections) => onUpdate({ sections })}
          />
        </>
      )}

      <div>
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Move</p>
        <div className="grid grid-cols-3 gap-1">
          <div />
          <Button variant="secondary" onClick={() => onUpdate({ y: Math.max(0, (el.y as number) - 10) })}>↑</Button>
          <div />
          <Button variant="secondary" onClick={() => onUpdate({ x: Math.max(0, (el.x as number) - 10) })}>←</Button>
          <div />
          <Button variant="secondary" onClick={() => onUpdate({ x: (el.x as number) + 10 })}>→</Button>
          <div />
          <Button variant="secondary" onClick={() => onUpdate({ y: (el.y as number) + 10 })}>↓</Button>
          <div />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1 text-xs text-neutral-600">
          Width
          <input type="number" className="rounded border border-neutral-300 bg-white p-1 text-sm outline-none"
            value={Math.round((el.width ?? el.w) as number)}
            onChange={e => onUpdate({ width: +e.target.value, w: +e.target.value })}
          />
        </label>
        <label className="grid gap-1 text-xs text-neutral-600">
          Height
          <input type="number" className="rounded border border-neutral-300 bg-white p-1 text-sm outline-none"
            value={Math.round((el.height ?? el.h) as number)}
            onChange={e => onUpdate({ height: +e.target.value, h: +e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}

// ─── Main Editor ───────────────────────────────────────────────────────────────
export function Editor() {
  const navigate = useNavigate();
  const { designId = "" } = useParams();
  const [design, setDesign] = useState<Design | null>(null);
  const [canvasState, setCanvasState] = useState<CanvasState | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedPage, setSelectedPage] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  const PREVIEW_SCALE = 0.54;

  useEffect(() => {
    setLoading(true);
    getDesignRequest(designId)
      .then(loaded => {
        setDesign(loaded);
        setCanvasState(loaded.canvasState);
        const firstEl = (loaded.canvasState.pages?.[0]?.elements?.[0] ?? loaded.canvasState.elements?.[0]) as El | undefined;
        setSelectedId((firstEl?.id as string) ?? "");
        setSelectedPage(0);
      })
      .catch(err => setToast({ type: "error", message: getErrorMessage(err) }))
      .finally(() => setLoading(false));
  }, [designId]);

  // Update element in a specific page
  function updateElement(id: string, pageIdx: number, patch: Partial<El>) {
    if (!canvasState) return;
    const newPages = (canvasState.pages ?? []).map((pg, pi) =>
      pi === pageIdx
        ? { ...pg, elements: pg.elements.map(e => (e as El).id === id ? { ...e, ...patch } : e) }
        : pg
    );
    // Also update page 0 elements (backward compat field)
    const newElements = pageIdx === 0
      ? canvasState.elements.map(e => (e as El).id === id ? { ...e, ...patch } : e)
      : canvasState.elements;
    setCanvasState({ ...canvasState, pages: newPages, elements: newElements });
  }

  async function save() {
    if (!canvasState) return;
    setBusy("save");
    try {
      const saved = await saveCanvasRequest(designId, canvasState);
      setDesign(saved);
      setCanvasState(saved.canvasState);
      setToast({ type: "success", message: "Saved successfully." });
    } catch (err) {
      setToast({ type: "error", message: getErrorMessage(err) });
    } finally { setBusy(""); }
  }

  async function publish() {
    setBusy("publish");
    try {
      const result = await publishDesignRequest(designId);
      setDesign(result.design);
      setToast({ type: "success", message: "Published successfully." });
    } catch (err) {
      setToast({ type: "error", message: getErrorMessage(err) });
    } finally { setBusy(""); }
  }

  async function downloadPdf() {
    if (!design) return;
    setBusy("pdf");
    try {
      await exportSingleMenuPdf(design);
      setToast({ type: "success", message: "PDF downloaded successfully!" });
    } catch (err) {
      setToast({ type: "error", message: "Failed to download PDF." });
    } finally {
      setBusy("");
    }
  }

  if (loading || !design || !canvasState) {
    return <p className="text-sm text-neutral-400 p-8">Loading editor…</p>;
  }

  const W = canvasState.page?.width ?? 1080;
  const H = canvasState.page?.height ?? 1440;

  // Use pages[] if present, else wrap elements in single page
  const pages = canvasState.pages && canvasState.pages.length > 0
    ? canvasState.pages
    : [{ pageIndex: 0, background: canvasState.page?.background ?? "#111", elements: canvasState.elements ?? [] }];

  // Find selected element across all pages
  const selectedEl = pages[selectedPage]?.elements?.find(e => (e as El).id === selectedId) as El | undefined;

  // All elements for layers panel (flat, with page info)
  const allLayers = pages.flatMap((pg, pi) =>
    (pg.elements as El[]).map(el => ({ el, pi }))
  );

  return (
    <section>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate(`/admin/projects/${design.projectId}`)}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-neutral-950">{(design as any).label ?? design.category}</h1>
            <p className="text-xs text-neutral-400">
              Design #{design.designIndex} · {design.status}
              {pages.length > 1 && ` · ${pages.length} pages`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={busy === "pdf"} onClick={downloadPdf}>
            <Download size={15} /> {busy === "pdf" ? "Exporting…" : "Download PDF"}
          </Button>
          <Button variant="secondary" onClick={() => setPreviewMode(p => !p)}>
            <Eye size={15} /> {previewMode ? "Edit" : "Preview"}
          </Button>
          <Button variant="secondary" disabled={busy === "save"} onClick={save}>
            <Save size={15} /> {busy === "save" ? "Saving…" : "Save"}
          </Button>
          <Button disabled={busy === "publish"} onClick={publish}>
            <Send size={15} /> {busy === "publish" ? "Publishing…" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">

        {/* Canvas — multi-page vertical scroll */}
        <div className="overflow-auto rounded-lg border border-neutral-200 bg-neutral-300 p-4 flex flex-col items-center gap-4"
          style={{ maxHeight: "82vh" }}>
          {pages.map((page, pi) => (
            <div key={pi} className="flex-shrink-0">
              {pages.length > 1 && (
                <p className="text-center text-xs text-neutral-500 font-medium mb-1">
                  Page {pi + 1} of {pages.length}
                </p>
              )}
              <div className="relative select-none shadow-xl"
                style={{ width: W * PREVIEW_SCALE, height: H * PREVIEW_SCALE }}>

                {/* Actual design render */}
                <div style={{
                  width: W, height: H,
                  position: "absolute", top: 0, left: 0,
                  transformOrigin: "top left",
                  transform: `scale(${PREVIEW_SCALE})`,
                  background: page.background ?? canvasState.page?.background ?? "#111",
                  WebkitFontSmoothing: "antialiased",
                  overflow: "hidden"
                }}>
                  {(page.elements as El[]).map((el, i) => (
                    <PageElRenderer key={(el.id as string) ?? i} el={el} />
                  ))}
                </div>

                {/* Click & Inline Edit overlays (edit mode) */}
                {!previewMode && (page.elements as El[]).map((el, i) => {
                  const elW = ((el.width ?? el.w) as number) ?? 100;
                  const elH = ((el.height ?? el.h) as number) ?? 30;
                  const isSel = el.id === selectedId && selectedPage === pi;
                  const isEditing = editingId === el.id && isSel;

                  if (isEditing && el.type === "text") {
                    return (
                      <textarea
                        key={(el.id as string) ?? i}
                        autoFocus
                        style={{
                          position: "absolute",
                          left: (el.x as number) * PREVIEW_SCALE,
                          top: (el.y as number) * PREVIEW_SCALE,
                          width: elW * PREVIEW_SCALE,
                          height: Math.max(elH * PREVIEW_SCALE, 40),
                          fontSize: (((el.fontSize ?? el.size) as number) ?? 16) * PREVIEW_SCALE,
                          fontFamily: (el.fontFamily ?? el.font) as string,
                          fontWeight: ((el.fontWeight ?? el.weight) as number) ?? 400,
                          color: (el.color as string) ?? "#ffffff",
                          textAlign: (el.textAlign ?? el.align ?? "left") as any,
                          background: "rgba(0,0,0,0.85)",
                          border: "2px solid #2357C6",
                          borderRadius: 4,
                          outline: "none",
                          padding: 2,
                          zIndex: 50,
                          resize: "none"
                        }}
                        value={(el.text as string) ?? ""}
                        onChange={(e) => updateElement(el.id as string, pi, { text: e.target.value })}
                        onBlur={() => setEditingId(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                    );
                  }

                  return (
                    <div key={(el.id as string) ?? i}
                      onClick={() => {
                        setSelectedId(el.id as string);
                        setSelectedPage(pi);
                      }}
                      onDoubleClick={() => {
                        setSelectedId(el.id as string);
                        setSelectedPage(pi);
                        if (el.type === "text") {
                          setEditingId(el.id as string);
                        }
                      }}
                      title={el.type === "text" ? "Click to select, double-click to type inline" : "Click to select"}
                      style={{
                        position: "absolute",
                        left: (el.x as number) * PREVIEW_SCALE,
                        top: (el.y as number) * PREVIEW_SCALE,
                        width: elW * PREVIEW_SCALE,
                        height: elH * PREVIEW_SCALE,
                        border: isSel ? "2px solid #2357C6" : "1px dashed transparent",
                        boxShadow: isSel ? "0 0 0 2px rgba(35,87,198,0.3)" : undefined,
                        cursor: "pointer", boxSizing: "border-box", zIndex: 10,
                        transition: "border-color 0.1s"
                      }}
                    >
                      {isSel && el.type === "text" && !isEditing && (
                        <span className="absolute -top-5 left-0 rounded bg-[#2357C6] px-1.5 py-0.5 text-[9px] text-white font-medium">
                          Double-click to type
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <aside className="flex flex-col gap-4">

          {/* Layers */}
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-neutral-900 mb-3">
              Layers {pages.length > 1 && <span className="text-xs text-neutral-400 font-normal ml-1">({pages.length} pages)</span>}
            </h2>
            <div className="max-h-52 overflow-y-auto flex flex-col gap-1">
              {allLayers.map(({ el, pi }, idx) => (
                <button key={idx} type="button"
                  onClick={() => { setSelectedId(el.id as string); setSelectedPage(pi); }}
                  className={`w-full rounded px-3 py-2 text-left text-xs truncate transition-colors ${
                    el.id === selectedId && selectedPage === pi
                      ? "bg-neutral-950 text-white"
                      : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {pages.length > 1 && <span className="mr-1 opacity-50">P{pi + 1}</span>}
                  <span className="font-medium capitalize">{el.type as string}</span>
                  {el.type === "text" && <span className="ml-2 opacity-60">{((el.text as string) ?? "").slice(0, 24)}</span>}
                  {el.type === "menu-list" && <span className="ml-2 opacity-60">menu items</span>}
                  {el.type === "shape" && <span className="ml-2 opacity-60">bg / accent</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Properties */}
          <div className="rounded-lg border border-neutral-200 bg-white p-4 flex-1 overflow-y-auto max-h-[60vh]">
            <h2 className="text-sm font-semibold text-neutral-900">Properties & Text Editor</h2>
            {selectedEl
              ? <PropsPanel el={selectedEl} onUpdate={patch => updateElement(selectedId, selectedPage, patch)} />
              : <p className="mt-3 text-xs text-neutral-400">Click any text or element on the canvas to edit it.</p>
            }
          </div>
        </aside>
      </div>
    </section>
  );
}
