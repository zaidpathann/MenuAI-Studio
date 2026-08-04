import { useMemo, useState } from "react";
import type { CanvasState } from "../../types";
import { Button } from "../ui/Button";

type El = Record<string, unknown>;

type CanvasEditorProps = {
  canvasState: CanvasState;
  onChange: (canvasState: CanvasState) => void;
};

function priceFmt(price: number | undefined, currency = "INR"): string {
  if (!price) return "";
  const s: Record<string, string> = { INR: "₹", USD: "$", GBP: "£", EUR: "€" };
  return `${s[currency] ?? currency + " "}${price}`;
}

// ─── Mini menu-list preview inside editor canvas ───────────────────────────────
function MiniMenuList({ el }: { el: El }) {
  type Sec = { name: string; items: { name: string; description?: string; price?: number }[] };
  const secs = (el.sections as Sec[]) ?? [];
  const cur = (el.currency as string) ?? "INR";
  const cols: Sec[][] = [[], []];
  secs.forEach((s, i) => cols[i % 2].push(s));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px", fontSize: 13, color: el.color as string, fontFamily: el.fontFamily as string }}>
      {cols.map((col, ci) => (
        <div key={ci}>
          {col.map(sec => (
            <div key={sec.name} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: el.accentColor as string, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, paddingBottom: 5, borderBottom: `1px solid ${el.accentColor as string}44` }}>{sec.name}</div>
              {sec.items.map(item => (
                <div key={item.name} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13 }}>{item.name}</span>
                  <span style={{ fontSize: 12, color: el.accentColor as string, marginLeft: 8, flexShrink: 0 }}>{priceFmt(item.price, cur)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Single element render inside editor (click to select) ────────────────────
function EditorEl({ el, selected, onSelect, onStartDrag }: {
  el: El;
  selected: boolean;
  onSelect: () => void;
  onStartDrag: (e: React.MouseEvent) => void;
}) {
  const base: React.CSSProperties = {
    position: "absolute",
    left: el.x as number,
    top: el.y as number,
    width: el.w as number ?? el.width as number,
    height: el.h as number ?? el.height as number,
    boxSizing: "border-box",
    overflow: "hidden",
    border: selected ? "2px solid #2357C6" : "2px solid transparent",
    cursor: "move",
    outline: "none"
  };

  const type = el.type as string;

  if (type === "shape") {
    return (
      <div
        style={{ ...base, backgroundColor: el.color as string ?? el.fill as string, opacity: (el.opacity as number) ?? 1 }}
        onMouseDown={e => { onSelect(); onStartDrag(e); }}
      />
    );
  }

  if (type === "shape-outline") {
    return (
      <div
        style={{ ...base, border: selected ? "2px solid #2357C6" : `${(el.borderWidth as number) ?? 1}px solid ${el.color as string}`, backgroundColor: "transparent", opacity: (el.opacity as number) ?? 1 }}
        onMouseDown={e => { onSelect(); onStartDrag(e); }}
      />
    );
  }

  if (type === "menu-list") {
    return (
      <div
        style={{ ...base, padding: 4 }}
        onMouseDown={e => { onSelect(); onStartDrag(e); }}
      >
        <MiniMenuList el={el} />
      </div>
    );
  }

  // text element
  const align = (el.textAlign as string) ?? (el.align as string) ?? "left";
  return (
    <div
      style={{
        ...base,
        color: el.color as string,
        fontFamily: el.fontFamily as string,
        fontSize: (el.fontSize as number) ?? (el.size as number) ?? 16,
        fontWeight: (el.fontWeight as number) ?? (el.weight as number) ?? 400,
        fontStyle: (el.fontStyle as string) ?? (el.italic ? "italic" : "normal"),
        letterSpacing: el.letterSpacing ? `${el.letterSpacing as number}px` : undefined,
        textAlign: align === "center" ? "center" : align === "right" ? "right" : "left",
        lineHeight: 1.15,
        display: "flex",
        alignItems: "flex-start",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word"
      }}
      onMouseDown={e => { onSelect(); onStartDrag(e); }}
    >
      <span style={{ width: "100%" }}>{(el.text as string) ?? ""}</span>
    </div>
  );
}

// ─── Properties panel per element type ────────────────────────────────────────
function PropertiesPanel({ el, update }: { el: El; update: (patch: Partial<El>) => void }) {
  const type = el.type as string;

  return (
    <div className="mt-4 grid gap-4">
      {/* Position / size always shown */}
      <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-600">
        <span className="font-medium text-neutral-900 capitalize">{type}</span>
        <span className="ml-2">x {Math.round(el.x as number)} · y {Math.round(el.y as number)}</span>
      </div>

      {/* TEXT element — full text editing */}
      {type === "text" && (
        <>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Text
            <textarea
              className="min-h-24 rounded-md border border-neutral-300 bg-white p-2 text-sm outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200"
              value={(el.text as string) ?? ""}
              onChange={e => update({ text: e.target.value })}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Font size
            <input type="number" min={8} max={200}
              className="rounded-md border border-neutral-300 bg-white p-2 text-sm outline-none focus:border-neutral-950"
              value={((el.fontSize ?? el.size) as number) ?? 16}
              onChange={e => update({ fontSize: Number(e.target.value), size: Number(e.target.value) })}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Color
            <input type="color"
              className="h-9 w-full rounded-md border border-neutral-300 cursor-pointer"
              value={(el.color as string) ?? "#ffffff"}
              onChange={e => update({ color: e.target.value })}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Align
            <select
              className="rounded-md border border-neutral-300 bg-white p-2 text-sm outline-none"
              value={(el.textAlign ?? el.align ?? "left") as string}
              onChange={e => update({ textAlign: e.target.value, align: e.target.value })}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Font weight
            <select
              className="rounded-md border border-neutral-300 bg-white p-2 text-sm outline-none"
              value={((el.fontWeight ?? el.weight) as number) ?? 400}
              onChange={e => update({ fontWeight: Number(e.target.value), weight: Number(e.target.value) })}
            >
              <option value={300}>Light (300)</option>
              <option value={400}>Regular (400)</option>
              <option value={500}>Medium (500)</option>
              <option value={600}>Semibold (600)</option>
              <option value={700}>Bold (700)</option>
              <option value={800}>Extrabold (800)</option>
              <option value={900}>Black (900)</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 cursor-pointer">
            <input type="checkbox"
              checked={(el.fontStyle ?? el.italic) === "italic" || el.italic === true}
              onChange={e => update({ fontStyle: e.target.checked ? "italic" : "normal", italic: e.target.checked })}
            />
            Italic
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Letter spacing (px)
            <input type="number" min={-5} max={30}
              className="rounded-md border border-neutral-300 bg-white p-2 text-sm outline-none"
              value={(el.letterSpacing as number) ?? 0}
              onChange={e => update({ letterSpacing: Number(e.target.value) })}
            />
          </label>
        </>
      )}

      {/* SHAPE element */}
      {type === "shape" && (
        <>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Fill color
            <input type="color"
              className="h-9 w-full rounded-md border border-neutral-300 cursor-pointer"
              value={(el.color as string) ?? "#111111"}
              onChange={e => update({ color: e.target.value })}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Opacity
            <input type="range" min={0} max={1} step={0.05}
              value={(el.opacity as number) ?? 1}
              onChange={e => update({ opacity: Number(e.target.value) })}
            />
            <span className="text-xs text-neutral-400">{Math.round(((el.opacity as number) ?? 1) * 100)}%</span>
          </label>
        </>
      )}

      {/* MENU-LIST element */}
      {type === "menu-list" && (
        <>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Menu items come from extracted project data. Edit section names, item names, descriptions and prices directly in the extracted data — then regenerate to see updated designs.
          </p>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Accent color
            <input type="color"
              className="h-9 w-full rounded-md border border-neutral-300 cursor-pointer"
              value={(el.accentColor as string) ?? "#C9A24D"}
              onChange={e => update({ accentColor: e.target.value })}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Text color
            <input type="color"
              className="h-9 w-full rounded-md border border-neutral-300 cursor-pointer"
              value={(el.color as string) ?? "#ffffff"}
              onChange={e => update({ color: e.target.value })}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            Currency
            <select
              className="rounded-md border border-neutral-300 bg-white p-2 text-sm outline-none"
              value={(el.currency as string) ?? "INR"}
              onChange={e => update({ currency: e.target.value })}
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="GBP">£ GBP</option>
              <option value="EUR">€ EUR</option>
              <option value="AED">د.إ AED</option>
            </select>
          </label>
        </>
      )}

      {/* Move buttons for all types */}
      <div>
        <p className="mb-2 text-xs font-medium text-neutral-500 uppercase tracking-wide">Move</p>
        <div className="grid grid-cols-3 gap-1">
          <div />
          <Button variant="secondary" onClick={() => update({ y: Math.max(0, (el.y as number) - 10) })}>↑</Button>
          <div />
          <Button variant="secondary" onClick={() => update({ x: Math.max(0, (el.x as number) - 10) })}>←</Button>
          <div className="flex items-center justify-center text-xs text-neutral-400">move</div>
          <Button variant="secondary" onClick={() => update({ x: (el.x as number) + 10 })}>→</Button>
          <div />
          <Button variant="secondary" onClick={() => update({ y: (el.y as number) + 10 })}>↓</Button>
          <div />
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="mb-2 text-xs font-medium text-neutral-500 uppercase tracking-wide">Size</p>
        <div className="grid grid-cols-2 gap-2">
          <label className="grid gap-1 text-xs text-neutral-600">
            Width
            <input type="number"
              className="rounded border border-neutral-300 bg-white p-1 text-sm outline-none"
              value={Math.round((el.width ?? el.w) as number)}
              onChange={e => update({ width: Number(e.target.value), w: Number(e.target.value) })}
            />
          </label>
          <label className="grid gap-1 text-xs text-neutral-600">
            Height
            <input type="number"
              className="rounded border border-neutral-300 bg-white p-1 text-sm outline-none"
              value={Math.round((el.height ?? el.h) as number)}
              onChange={e => update({ height: Number(e.target.value), h: Number(e.target.value) })}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

// ─── Main CanvasEditor component ───────────────────────────────────────────────
export function CanvasEditor({ canvasState, onChange }: CanvasEditorProps) {
  const [selectedId, setSelectedId] = useState<string>((canvasState.elements[0] as El)?.id as string ?? "");
  const [drag, setDrag] = useState<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const scale = 0.48;

  const selected = useMemo(
    () => canvasState.elements.find(e => (e as El).id === selectedId) as El | undefined,
    [canvasState.elements, selectedId]
  );

  function updateElement(id: string, patch: Partial<El>) {
    onChange({
      ...canvasState,
      elements: canvasState.elements.map(e => (e as El).id === id ? { ...e, ...patch } : e)
    });
  }

  // Separate text/shape elements from bg shapes for layer panel
  const layerEls = (canvasState.elements as El[]).filter(e => e.type === "text" || e.type === "menu-list" || e.type === "shape" || e.type === "shape-outline");

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      {/* Canvas */}
      <div className="overflow-auto rounded-lg border border-neutral-200 bg-neutral-300 p-4">
        <div
          className="relative mx-auto shadow-2xl select-none"
          style={{
            width: canvasState.page.width * scale,
            height: canvasState.page.height * scale,
            background: canvasState.page.background,
            cursor: drag ? "grabbing" : "default"
          }}
          onMouseMove={e => {
            if (!drag) return;
            const dx = (e.clientX - drag.startX) / scale;
            const dy = (e.clientY - drag.startY) / scale;
            updateElement(drag.id, {
              x: Math.max(0, drag.origX + dx),
              y: Math.max(0, drag.origY + dy)
            });
          }}
          onMouseUp={() => setDrag(null)}
          onMouseLeave={() => setDrag(null)}
        >
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{ width: canvasState.page.width, height: canvasState.page.height, transform: `scale(${scale})` }}
          >
            {(canvasState.elements as El[]).map((el, i) => (
              <EditorEl
                key={(el.id as string) ?? i}
                el={el}
                selected={el.id === selectedId}
                onSelect={() => setSelectedId(el.id as string)}
                onStartDrag={e => {
                  e.preventDefault();
                  setSelectedId(el.id as string);
                  setDrag({ id: el.id as string, startX: e.clientX, startY: e.clientY, origX: el.x as number, origY: el.y as number });
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <aside className="flex flex-col gap-4">
        {/* Layers list */}
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900">Layers</h2>
          <div className="max-h-52 overflow-y-auto flex flex-col gap-1">
            {layerEls.map(el => (
              <button
                key={el.id as string}
                type="button"
                className={`w-full rounded px-3 py-2 text-left text-xs truncate transition-colors ${
                  el.id === selectedId
                    ? "bg-neutral-950 text-white"
                    : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                }`}
                onClick={() => setSelectedId(el.id as string)}
              >
                <span className="font-medium capitalize">{el.type as string}</span>
                {el.type === "text" && <span className="ml-2 opacity-60">{((el.text as string) ?? "").slice(0, 24)}</span>}
                {el.type === "menu-list" && <span className="ml-2 opacity-60">menu items</span>}
                {el.type === "shape" && <span className="ml-2 opacity-60">bg / accent</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Properties */}
        <div className="rounded-lg border border-neutral-200 bg-white p-4 flex-1 overflow-y-auto">
          <h2 className="text-sm font-semibold text-neutral-900">Properties</h2>
          {selected
            ? <PropertiesPanel el={selected} update={patch => updateElement(selectedId, patch)} />
            : <p className="mt-3 text-sm text-neutral-400">Select an element on the canvas.</p>
          }
        </div>
      </aside>
    </div>
  );
}
