import type { Design } from "../../types";

type El = Record<string, unknown>;
type Sec = { name: string; description?: string; items: { name: string; description?: string; price?: number }[] };

function priceFmt(price: number | undefined, currency = "INR"): string {
  if (!price) return "";
  const s: Record<string, string> = { INR: "₹", USD: "$", GBP: "£", EUR: "€", AED: "د.إ" };
  return `${s[currency] ?? currency + " "}${price}`;
}

// ─── Two Column ────────────────────────────────────────────────────────────────
function TwoCols({ el }: { el: El }) {
  const secs = (el.sections as Sec[]) ?? [];
  const cur = (el.currency as string) ?? "INR";
  const cols: Sec[][] = [[], []];
  secs.forEach((s, i) => cols[i % 2].push(s));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 60px", height: "100%" }}>
      {cols.map((col, ci) => (
        <div key={ci}>
          {col.map(sec => (
            <div key={sec.name} style={{ marginBottom: 38 }}>
              <div style={{ fontSize: 12, fontWeight: (el.sectionWeight as number) ?? 700, color: el.accentColor as string, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${el.accentColor as string}33` }}>
                {sec.name}
              </div>
              {sec.items.map(item => (
                <div key={item.name} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>{item.name}</span>
                    <span style={{ fontSize: 15, color: el.accentColor as string, fontWeight: 700, marginLeft: 12, flexShrink: 0 }}>{priceFmt(item.price, cur)}</span>
                  </div>
                  {item.description && <div style={{ fontSize: 12, color: el.mutedColor as string, marginTop: 3, lineHeight: 1.5 }}>{item.description}</div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Minimal Lines ─────────────────────────────────────────────────────────────
function MinimalLines({ el }: { el: El }) {
  const secs = (el.sections as Sec[]) ?? [];
  const cur = (el.currency as string) ?? "INR";
  return (
    <div>
      {secs.map(sec => (
        <div key={sec.name} style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: el.accentColor as string, marginBottom: 6, textAlign: "center" }}>{sec.name}</div>
          <div style={{ width: 60, height: 1, background: el.accentColor as string, opacity: 0.4, margin: "0 auto 14px" }} />
          {sec.items.map(item => (
            <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${el.color as string}18`, paddingBottom: 12, marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 17 }}>{item.name}</span>
                {item.description && <span style={{ fontSize: 12, color: el.mutedColor as string, marginLeft: 10, fontStyle: "italic" }}>— {item.description}</span>}
              </div>
              <span style={{ fontSize: 15, marginLeft: 16, flexShrink: 0 }}>{priceFmt(item.price, cur)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Stacked Luxe ──────────────────────────────────────────────────────────────
function StackedLuxe({ el }: { el: El }) {
  const secs = (el.sections as Sec[]) ?? [];
  const cur = (el.currency as string) ?? "INR";
  const cols: Sec[][] = [[], []];
  secs.forEach((s, i) => cols[i % 2].push(s));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 72px" }}>
      {cols.map((col, ci) => (
        <div key={ci}>
          {col.map(sec => (
            <div key={sec.name} style={{ marginBottom: 44 }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: el.accentColor as string, letterSpacing: 5, textTransform: "uppercase", marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${el.accentColor as string}55` }}>{sec.name}</div>
              {sec.items.map(item => (
                <div key={item.name} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 18, letterSpacing: 0.3 }}>{item.name}</span>
                    <span style={{ fontSize: 16, color: el.accentColor as string, marginLeft: 12, flexShrink: 0 }}>{priceFmt(item.price, cur)}</span>
                  </div>
                  {item.description && <div style={{ fontSize: 13, color: el.mutedColor as string, marginTop: 4, lineHeight: 1.6, fontStyle: "italic" }}>{item.description}</div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Cards ─────────────────────────────────────────────────────────────────────
function Cards({ el }: { el: El }) {
  const secs = (el.sections as Sec[]) ?? [];
  const cur = (el.currency as string) ?? "INR";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {secs.map(sec => (
        <div key={sec.name} style={{ background: "rgba(255,255,255,0.65)", borderRadius: 10, padding: "20px 22px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 12, fontWeight: (el.sectionWeight as number) ?? 700, color: el.accentColor as string, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, paddingBottom: 10, borderBottom: `2px solid ${el.accentColor as string}33` }}>{sec.name}</div>
          {sec.items.map(item => (
            <div key={item.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{item.name}</span>
                <span style={{ fontSize: 15, color: el.accentColor as string, fontWeight: 700, marginLeft: 10, flexShrink: 0 }}>{priceFmt(item.price, cur)}</span>
              </div>
              {item.description && <div style={{ fontSize: 12, color: el.mutedColor as string, marginTop: 3 }}>{item.description}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Corporate Grid ────────────────────────────────────────────────────────────
function CorporateGrid({ el }: { el: El }) {
  const secs = (el.sections as Sec[]) ?? [];
  const cur = (el.currency as string) ?? "INR";
  const cols: Sec[][] = [[], []];
  secs.forEach((s, i) => cols[i % 2].push(s));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 56px" }}>
      {cols.map((col, ci) => (
        <div key={ci}>
          {col.map(sec => (
            <div key={sec.name} style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: el.accentColor as string, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ flex: 1, height: 1, background: el.accentColor as string, opacity: 0.3 }} />
                {sec.name}
                <span style={{ flex: 1, height: 1, background: el.accentColor as string, opacity: 0.3 }} />
              </div>
              {sec.items.map(item => (
                <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 10, marginBottom: 10, borderBottom: `1px solid ${el.color as string}12` }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>{item.name}</div>
                    {item.description && <div style={{ fontSize: 12, color: el.mutedColor as string, marginTop: 2 }}>{item.description}</div>}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: el.accentColor as string, marginLeft: 12, flexShrink: 0 }}>{priceFmt(item.price, cur)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Centered Elegant ──────────────────────────────────────────────────────────
function CenteredElegant({ el }: { el: El }) {
  const secs = (el.sections as Sec[]) ?? [];
  const cur = (el.currency as string) ?? "INR";
  return (
    <div>
      {secs.map(sec => (
        <div key={sec.name} style={{ marginBottom: 40, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: el.accentColor as string, marginBottom: 6 }}>{sec.name}</div>
          <div style={{ width: 70, height: 1, background: el.accentColor as string, opacity: 0.4, margin: "0 auto 14px" }} />
          {sec.items.map(item => (
            <div key={item.name} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 18 }}>
                <span style={{ fontSize: 18, fontWeight: 500 }}>{item.name}</span>
                <span style={{ color: el.accentColor as string, fontSize: 15 }}>{priceFmt(item.price, cur)}</span>
              </div>
              {item.description && <div style={{ fontSize: 13, color: el.mutedColor as string, marginTop: 3, fontStyle: "italic" }}>{item.description}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Classic Two Col ───────────────────────────────────────────────────────────
function ClassicTwoCol({ el }: { el: El }) {
  const secs = (el.sections as Sec[]) ?? [];
  const cur = (el.currency as string) ?? "INR";
  const cols: Sec[][] = [[], []];
  secs.forEach((s, i) => cols[i % 2].push(s));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 52px" }}>
      {cols.map((col, ci) => (
        <div key={ci}>
          {col.map(sec => (
            <div key={sec.name} style={{ marginBottom: 36 }}>
              <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: el.accentColor as string, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>✦ {sec.name} ✦</div>
              {sec.items.map(item => (
                <div key={item.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 16 }}>{item.name}</span>
                    <span style={{ flex: 1, borderBottom: "1px dotted currentColor", margin: "0 6px", opacity: 0.3, alignSelf: "flex-end", marginBottom: 3 }} />
                    <span style={{ fontSize: 16, fontWeight: 700, flexShrink: 0 }}>{priceFmt(item.price, cur)}</span>
                  </div>
                  {item.description && <div style={{ fontSize: 12, color: el.mutedColor as string, marginTop: 2, fontStyle: "italic" }}>{item.description}</div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Premium Two Col ───────────────────────────────────────────────────────────
function PremiumTwoCol({ el }: { el: El }) {
  const secs = (el.sections as Sec[]) ?? [];
  const cur = (el.currency as string) ?? "INR";
  const cols: Sec[][] = [[], []];
  secs.forEach((s, i) => cols[i % 2].push(s));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 60px" }}>
      {cols.map((col, ci) => (
        <div key={ci}>
          {col.map(sec => (
            <div key={sec.name} style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: el.accentColor as string, letterSpacing: 5, textTransform: "uppercase", marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${el.accentColor as string}` }}>{sec.name}</div>
              {sec.items.map(item => (
                <div key={item.name} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>{item.name}</span>
                    <span style={{ fontSize: 15, color: el.accentColor as string, fontWeight: 700, marginLeft: 12, flexShrink: 0 }}>{priceFmt(item.price, cur)}</span>
                  </div>
                  {item.description && <div style={{ fontSize: 12, color: el.mutedColor as string, marginTop: 4, lineHeight: 1.5 }}>{item.description}</div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Dark Grid ─────────────────────────────────────────────────────────────────
function DarkGrid({ el }: { el: El }) {
  const secs = (el.sections as Sec[]) ?? [];
  const cur = (el.currency as string) ?? "INR";
  const cols: Sec[][] = [[], []];
  secs.forEach((s, i) => cols[i % 2].push(s));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 56px" }}>
      {cols.map((col, ci) => (
        <div key={ci}>
          {col.map(sec => (
            <div key={sec.name} style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: el.accentColor as string, letterSpacing: 4, textTransform: "uppercase", marginBottom: 14, paddingLeft: 10, borderLeft: `3px solid ${el.accentColor as string}` }}>{sec.name}</div>
              {sec.items.map(item => (
                <div key={item.name} style={{ marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${el.color as string}18` }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 17, fontWeight: 600 }}>{item.name}</span>
                    <span style={{ fontSize: 16, color: el.accentColor as string, fontWeight: 700, marginLeft: 12, flexShrink: 0 }}>{priceFmt(item.price, cur)}</span>
                  </div>
                  {item.description && <div style={{ fontSize: 12, color: el.mutedColor as string, marginTop: 4 }}>{item.description}</div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Print Cols ────────────────────────────────────────────────────────────────
function PrintCols({ el }: { el: El }) {
  const secs = (el.sections as Sec[]) ?? [];
  const cur = (el.currency as string) ?? "INR";
  const cols: Sec[][] = [[], []];
  secs.forEach((s, i) => cols[i % 2].push(s));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 52px" }}>
      {cols.map((col, ci) => (
        <div key={ci}>
          {col.map(sec => (
            <div key={sec.name} style={{ marginBottom: 32 }}>
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: 2, borderTop: "1px solid #000", borderBottom: "1px solid #000", padding: "5px 0" }}>{sec.name}</div>
              {sec.items.map(item => (
                <div key={item.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 15 }}>{item.name}</span>
                    <span style={{ flex: 1, borderBottom: "1px dotted #000", margin: "0 5px", opacity: 0.4, alignSelf: "flex-end", marginBottom: 2 }} />
                    <span style={{ fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{priceFmt(item.price, cur)}</span>
                  </div>
                  {item.description && <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{item.description}</div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Gold Dotted Leaders ───────────────────────────────────────────────────────
function GoldDotted({ el }: { el: El }) {
  const secs = (el.sections as Sec[]) ?? [];
  const cur = (el.currency as string) ?? "INR";
  const cols: Sec[][] = [[], []];
  secs.forEach((s, i) => cols[i % 2].push(s));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 72px" }}>
      {cols.map((col, ci) => (
        <div key={ci}>
          {col.map(sec => (
            <div key={sec.name} style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ flex: 1, height: 1, background: el.accentColor as string, opacity: 0.4 }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: el.accentColor as string, letterSpacing: 4, textTransform: "uppercase", whiteSpace: "nowrap" }}>{sec.name}</span>
                <div style={{ flex: 1, height: 1, background: el.accentColor as string, opacity: 0.4 }} />
              </div>
              {sec.items.map(item => (
                <div key={item.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{item.name}</span>
                    <span style={{ flex: 1, borderBottom: `1px dotted ${el.mutedColor as string}`, margin: "0 6px", opacity: 0.5, alignSelf: "flex-end", marginBottom: 3 }} />
                    <span style={{ fontSize: 15, color: el.accentColor as string, fontWeight: 600, flexShrink: 0 }}>{priceFmt(item.price, cur)}</span>
                  </div>
                  {item.description && <div style={{ fontSize: 12, color: el.mutedColor as string, marginTop: 2, fontStyle: "italic" }}>{item.description}</div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Menu List Dispatcher ──────────────────────────────────────────────────────
function MenuList({ el }: { el: El }) {
  switch (el.layout as string) {
    case "two-column":       return <TwoCols el={el} />;
    case "minimal-lines":    return <MinimalLines el={el} />;
    case "stacked-luxe":     return <StackedLuxe el={el} />;
    case "cards":            return <Cards el={el} />;
    case "corporate-grid":   return <CorporateGrid el={el} />;
    case "centered-elegant": return <CenteredElegant el={el} />;
    case "classic-two-col":  return <ClassicTwoCol el={el} />;
    case "premium-two-col":  return <PremiumTwoCol el={el} />;
    case "dark-grid":        return <DarkGrid el={el} />;
    case "print-cols":       return <PrintCols el={el} />;
    case "gold-dotted":      return <GoldDotted el={el} />;
    default:                 return <TwoCols el={el} />;
  }
}

// ─── Single Element Renderer ───────────────────────────────────────────────────
function RenderEl({ el }: { el: El }) {
  const base: React.CSSProperties = {
    position: "absolute",
    left: el.x as number,
    top: el.y as number,
    width: el.width as number,
    height: el.height as number,
    overflow: "hidden"
  };

  if (el.type === "shape") {
    return <div style={{ ...base, backgroundColor: el.color as string, opacity: (el.opacity as number) ?? 1, pointerEvents: "none" }} />;
  }
  if (el.type === "shape-outline") {
    return <div style={{ ...base, border: `${(el.borderWidth as number) ?? 1}px solid ${el.color as string}`, opacity: (el.opacity as number) ?? 1, backgroundColor: "transparent", pointerEvents: "none" }} />;
  }
  if (el.type === "menu-list") {
    return (
      <div style={{ ...base, color: el.color as string, fontFamily: el.fontFamily as string, fontSize: 15 }}>
        <MenuList el={el} />
      </div>
    );
  }
  // text
  const align = (el.textAlign as string) ?? (el.align as string) ?? "left";
  return (
    <div style={{
      ...base,
      color: el.color as string,
      fontFamily: el.fontFamily as string,
      fontSize: (el.fontSize as number) ?? 16,
      fontWeight: (el.fontWeight as number) ?? (el.weight as number) ?? 400,
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

// ─── Main Export ───────────────────────────────────────────────────────────────
export function MenuPreview({ design, compact = false, scaleOverride }: { design: Design; compact?: boolean; scaleOverride?: number }) {
  const { canvasState } = design;
  const W = canvasState.page?.width ?? 1080;
  const H = canvasState.page?.height ?? 1440;
  const scale = scaleOverride ?? (compact ? 0.20 : 0.54);

  // Multi-page: use pages[] if present, else fall back to single page
  const pages = canvasState.pages && canvasState.pages.length > 0
    ? canvasState.pages
    : [{ pageIndex: 0, background: canvasState.page?.background ?? "#111", elements: canvasState.elements ?? [] }];

  const gap = compact ? 4 : 12;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: `${gap}px`, width: W * scale, flexShrink: 0 }}>
      {pages.map((page, pi) => {
        const els = (page.elements ?? []) as El[];

        // Calculate actual content height by finding the lowest element bottom
        // This prevents menu-list content from being clipped when it overflows
        // its declared height (which happens with long menus on a single page).
        let contentH = H;
        els.forEach(el => {
          if (el.type === "menu-list") {
            const sections = (el.sections as Array<{ name: string; items: Array<{ description?: string }> }>) ?? [];
            let listH = 0;
            sections.forEach(sec => {
              listH += 44; // section header
              sec.items.forEach(item => { listH += item.description ? 40 : 22; });
              listH += 16; // gap
            });
            const twoColLayouts = ["two-column","stacked-luxe","classic-two-col","premium-two-col","dark-grid","print-cols","gold-dotted","corporate-grid","cards"];
            const isTwoCol = twoColLayouts.includes(el.layout as string);
            const actualListH = isTwoCol ? Math.ceil(listH / 2) + 40 : listH;
            const bottom = (el.y as number) + actualListH;
            if (bottom > contentH) contentH = bottom + 60;
          } else {
            const elBottom = (el.y as number) + (((el.height ?? el.h) as number) || 0);
            if (elBottom > contentH) contentH = elBottom;
          }
        });

        const scaledH = contentH * scale;

        return (
          <div key={pi} data-menu-page={pi} style={{ width: W * scale, height: scaledH, position: "relative", flexShrink: 0 }}>
            {!compact && pages.length > 1 && (
              <div style={{
                position: "absolute", top: 6, right: 8, zIndex: 20,
                background: "rgba(0,0,0,0.55)", color: "#fff",
                fontSize: 11, padding: "2px 8px", borderRadius: 4,
                fontFamily: "Arial, sans-serif", letterSpacing: 1
              }}>
                Page {pi + 1} / {pages.length}
              </div>
            )}
            <div style={{
              width: W,
              height: contentH,
              position: "absolute",
              top: 0,
              left: 0,
              transformOrigin: "top left",
              transform: `scale(${scale})`,
              background: page.background ?? canvasState.page?.background ?? "#111",
              WebkitFontSmoothing: "antialiased"
            }}>
              {els.map((el, i) => (
                <RenderEl key={(el.id as string) ?? i} el={el} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
