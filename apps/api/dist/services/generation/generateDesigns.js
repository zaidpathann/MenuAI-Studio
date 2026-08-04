/**
 * generateDesigns.ts
 * 30 unique, non-repeating restaurant menu templates inspired by real menus.
 * Cycles through all 30 before repeating — so "Generate More" always looks different.
 */
function sym(currency = "INR") {
    return { INR: "₹", USD: "$", GBP: "£", EUR: "€", AED: "د.إ" }[currency] ?? currency + " ";
}
function fmtPrice(p, currency = "INR") {
    if (!p)
        return "";
    return `${sym(currency)}${p}`;
}
function biz(m) {
    return [m.businessDetails?.address, m.businessDetails?.phone, m.businessDetails?.website].filter(Boolean).join("  ·  ");
}
function logo(m) {
    return m.logo?.text || (m.restaurantName ?? "R").slice(0, 3).toUpperCase();
}
const W = 1080, H = 1440;
// ── Shared menu-list element factory ──────────────────────────────────────────
function ml(id, m, layout, x, y, width, height, overrides = {}) {
    return {
        id, type: "menu-list",
        sections: m.sections ?? [],
        currency: m.currency ?? "INR",
        layout, x, y, width, height,
        fontFamily: overrides.fontFamily ?? "Arial, sans-serif",
        color: overrides.color ?? "#ffffff",
        accentColor: overrides.accentColor ?? "#C9A24D",
        mutedColor: overrides.mutedColor ?? "#aaaaaa",
        sectionWeight: overrides.sectionWeight ?? 600,
        ...overrides
    };
}
// ── Text element factory ───────────────────────────────────────────────────────
function tx(id, text, x, y, w, h, opts = {}) {
    return { id, type: "text", text, x, y, width: w, height: h, ...opts };
}
// ── Shape (filled rect) ────────────────────────────────────────────────────────
function sh(id, x, y, w, h, color, opacity = 1) {
    return { id, type: "shape", x, y, width: w, height: h, color, opacity };
}
// ── Outline rect ───────────────────────────────────────────────────────────────
function ol(id, x, y, w, h, color, bw = 1, opacity = 0.6) {
    return { id, type: "shape-outline", x, y, width: w, height: h, color, borderWidth: bw, opacity };
}
// ═══════════════════════════════════════════════════════════════════════════════
// 30 TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════
function buildElements(tplId, m, idx) {
    const title = m.restaurantName ?? "Restaurant";
    const note = m.businessDetails?.serviceNote || m.style?.mood || "";
    const bizLine = biz(m);
    const lg = logo(m);
    const cur = m.currency ?? "INR";
    const $ = sym(cur);
    // Helper: colored section headings for dark boards
    const sectionColors = ["#f5c842", "#e84040", "#40c8e8", "#e86040", "#40e880", "#c840e8", "#e8a040", "#40a0e8", "#e84080", "#80e840"];
    switch (tplId % 30) {
        // ── 1. DARK FOOD BOARD (dark bg, colored section headings, 2-col) ─────────
        case 0: {
            const secs = m.sections ?? [];
            const left = secs.filter((_, i) => i % 2 === 0);
            const right = secs.filter((_, i) => i % 2 !== 0);
            const makeCol = (col, xOff) => {
                const els = [];
                let y = 165;
                col.forEach(sec => {
                    const hc = sectionColors[secs.indexOf(sec) % sectionColors.length];
                    els.push(tx(`sh-${sec.name}-${idx}`, sec.name, xOff, y, 440, 36, { fontSize: 22, fontFamily: "Georgia,serif", color: hc, fontWeight: 700, fontStyle: "italic" }));
                    y += 36;
                    sec.items.slice(0, 8).forEach(item => {
                        els.push(tx(`in-${item.name}-${idx}`, item.name, xOff, y, 360, 22, { fontSize: 14, fontFamily: "Arial,sans-serif", color: "#ffffff" }));
                        if (item.price)
                            els.push(tx(`ip-${item.name}-${idx}`, `${$}${item.price}`, xOff + 360, y, 80, 22, { fontSize: 14, fontFamily: "Arial,sans-serif", color: "#ffffff", textAlign: "right" }));
                        y += 22;
                        if (item.description) {
                            els.push(tx(`id-${item.name}-${idx}`, item.description, xOff + 4, y, 430, 18, { fontSize: 11, color: "#aaa", fontStyle: "italic", fontFamily: "Arial,sans-serif" }));
                            y += 18;
                        }
                    });
                    y += 18;
                });
                return els;
            };
            return [
                sh(`bg-${idx}`, 0, 0, W, H, "#0a0a0a"),
                sh(`hband-${idx}`, 0, 0, W, 130, "#111111"),
                tx(`title-${idx}`, title.toUpperCase(), 60, 38, W - 120, 52, { fontSize: 34, fontFamily: "Georgia,serif", color: "#f5c842", fontWeight: 700, textAlign: "center", letterSpacing: 4 }),
                note ? tx(`note-${idx}`, note, 60, 90, W - 120, 26, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#aaa", textAlign: "center" }) : null,
                sh(`hline-${idx}`, 30, 128, W - 60, 2, "#f5c842", 0.4),
                sh(`vline-${idx}`, 540, 150, 1, H - 230, "#333333", 0.3),
                ...makeCol(left, 55),
                ...makeCol(right, 560),
                sh(`fline-${idx}`, 30, H - 68, W - 60, 1, "#f5c842", 0.3),
                tx(`biz-${idx}`, bizLine || note, 60, H - 46, W - 120, 30, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#aaa", textAlign: "center" }),
            ].filter(Boolean);
        }
        // ── 2. GOLD LEADERS (gold top/bottom bands, dotted leader lines) ──────────
        case 1: {
            return [
                sh(`bg-${idx}`, 0, 0, W, H, "#1c1208"),
                sh(`tband-${idx}`, 0, 0, W, 8, "#d4a020"),
                sh(`bband-${idx}`, 0, H - 8, W, 8, "#d4a020"),
                sh(`lsb-${idx}`, 0, 8, 5, H - 16, "#d4a020", 0.6),
                sh(`rsb-${idx}`, W - 5, 8, 5, H - 16, "#d4a020", 0.6),
                tx(`title-${idx}`, title.toUpperCase(), 60, 40, W - 120, 60, { fontSize: 38, fontFamily: "Georgia,serif", color: "#f5e6c8", fontWeight: 700, textAlign: "center", letterSpacing: 4 }),
                tx(`sub-${idx}`, "MENU", 60, 100, W - 120, 28, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#d4a020", textAlign: "center", letterSpacing: 8 }),
                sh(`hline-${idx}`, 120, 136, W - 240, 1, "#d4a020", 0.5),
                ml(`ml-${idx}`, m, "gold-dotted", 100, 155, W - 200, H - 255, { fontFamily: "Georgia,serif", color: "#f5e6c8", accentColor: "#d4a020", mutedColor: "#a08060" }),
                tx(`biz-${idx}`, bizLine || note, 60, H - 44, W - 120, 28, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#a08060", textAlign: "center" }),
            ];
        }
        // ── 3. DARK BOXES (4 section boxes, yellow headers — Image 3 style) ───────
        case 2: {
            const secs = (m.sections ?? []).slice(0, 4);
            const boxW = (W - 80) / 2, boxH = (H - 285) / 2 - 10;
            const boxes = [{ x: 20, y: 215 }, { x: 20 + boxW + 20, y: 215 }, { x: 20, y: 215 + boxH + 16 }, { x: 20 + boxW + 20, y: 215 + boxH + 16 }];
            const boxEls = [];
            secs.forEach((sec, bi) => {
                const bx = boxes[bi];
                boxEls.push(sh(`bx-${bi}-${idx}`, bx.x, bx.y, boxW, boxH, "#1a1610"));
                boxEls.push(sh(`bxh-${bi}-${idx}`, bx.x, bx.y, boxW, 38, "#e89a0a"));
                boxEls.push(tx(`bxht-${bi}-${idx}`, sec.name.toUpperCase(), bx.x, bx.y + 10, boxW, 24, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#000", fontWeight: 700, textAlign: "center", letterSpacing: 2 }));
                let iy = bx.y + 52;
                sec.items.slice(0, 7).forEach(item => {
                    boxEls.push(tx(`bxi-${bi}-${item.name}-${idx}`, item.name, bx.x + 10, iy, boxW - 90, 22, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#f0e8d8" }));
                    if (item.price)
                        boxEls.push(tx(`bxp-${bi}-${item.name}-${idx}`, `${$}${item.price}`, bx.x + boxW - 10, iy, 80, 22, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#aaa", textAlign: "right" }));
                    iy += 24;
                });
            });
            return [
                sh(`bg-${idx}`, 0, 0, W, H, "#111008"),
                sh(`hband-${idx}`, 0, 0, W, 205, "#0a0a06"),
                sh(`lgbx-${idx}`, W / 2 - 32, 22, 64, 64, "#e89a0a"),
                tx(`lgtx-${idx}`, lg, W / 2 - 32, 36, 64, 38, { fontSize: 22, fontFamily: "Arial,sans-serif", color: "#000", fontWeight: 900, textAlign: "center" }),
                tx(`rname-${idx}`, title.toUpperCase(), 60, 96, W - 120, 34, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#fff", fontWeight: 700, textAlign: "center", letterSpacing: 3 }),
                tx(`menutag-${idx}`, "OUR MENU", 60, 136, W - 120, 48, { fontSize: 34, fontFamily: "Arial,sans-serif", color: "#e89a0a", fontWeight: 900, textAlign: "center" }),
                ...boxEls,
                tx(`ftag-${idx}`, "ORDER YOUR TAKE", 60, H - 66, W - 120, 28, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#e89a0a", fontWeight: 700, textAlign: "center", letterSpacing: 3 }),
                tx(`biz-${idx}`, bizLine || note, 60, H - 36, W - 120, 24, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#8a7860", textAlign: "center" }),
            ];
        }
        // ── 4. AROMA STYLE (cream + dark maroon, bold section names, Indian) ──────
        case 3: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#fdf0e6"),
            sh(`sidebar-${idx}`, 680, 0, 400, H, "#5c1a0a"),
            tx(`title-${idx}`, title, 60, 60, 580, 80, { fontSize: 52, fontFamily: "Arial Black,Arial,sans-serif", color: "#5c1a0a", fontWeight: 900 }),
            tx(`special-${idx}`, "SPECIAL MENU", 700, 80, 360, 60, { fontSize: 36, fontFamily: "Arial Black,Arial,sans-serif", color: "#ffffff", fontWeight: 900, textAlign: "center" }),
            sh(`rule-${idx}`, 60, 152, 580, 3, "#e8960a"),
            note ? tx(`note-${idx}`, note, 60, 166, 580, 28, { fontSize: 14, fontFamily: "Arial,sans-serif", color: "#7a3a1a", fontStyle: "italic" }) : null,
            ml(`ml-${idx}`, m, "two-column", 60, 208, 580, H - 280, { fontFamily: "Arial,sans-serif", color: "#2a0a00", accentColor: "#5c1a0a", mutedColor: "#7a5040" }),
            tx(`biz-${idx}`, bizLine || note, 60, H - 46, 580, 30, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#7a5040" }),
        ].filter(Boolean);
        // ── 5. MOODY DARK (full black, white text, two col, dotted leaders) ───────
        case 4: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#111111"),
            sh(`tline-${idx}`, 0, 0, W, 3, "#ffffff", 0.08),
            tx(`logo-${idx}`, lg, 60, 60, 200, 40, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#888", letterSpacing: 5 }),
            tx(`title-${idx}`, title, 60, 116, 900, 80, { fontSize: 58, fontFamily: "Georgia,serif", color: "#ffffff", fontWeight: 400 }),
            sh(`rule-${idx}`, 60, 206, W - 120, 1, "#ffffff", 0.15),
            note ? tx(`note-${idx}`, note, 60, 224, 700, 28, { fontSize: 14, fontFamily: "Arial,sans-serif", color: "#888", fontStyle: "italic" }) : null,
            ml(`ml-${idx}`, m, "classic-two-col", 60, 266, W - 120, H - 360, { fontFamily: "Georgia,serif", color: "#f0f0f0", accentColor: "#f0c040", mutedColor: "#888" }),
            tx(`biz-${idx}`, bizLine, 60, H - 50, W - 120, 30, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#666" }),
        ].filter(Boolean);
        // ── 6. INDIA VERTICAL (cream bg, orange MENU badge, icon sections) ────────
        case 5: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#faf6ee"),
            sh(`orange-badge-${idx}`, W / 2 - 180, 155, 360, 44, "#e89a0a"),
            tx(`title-${idx}`, title.toUpperCase(), 60, 50, W - 120, 90, { fontSize: 62, fontFamily: "Arial Black,Arial,sans-serif", color: "#1a1a1a", fontWeight: 900, textAlign: "center" }),
            tx(`sub-${idx}`, note || "HOT FOOD TOUR", 60, 126, W - 120, 28, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#888", textAlign: "center", letterSpacing: 2 }),
            tx(`badge-txt-${idx}`, "MENU", 60, 155, W - 120, 44, { fontSize: 26, fontFamily: "Arial Black,Arial,sans-serif", color: "#ffffff", fontWeight: 900, textAlign: "center" }),
            sh(`sidel-${idx}`, 0, 0, 80, H, "#e8a050", 0.15),
            sh(`sider-${idx}`, W - 80, 0, 80, H, "#e8a050", 0.15),
            ml(`ml-${idx}`, m, "corporate-grid", 90, 220, W - 180, H - 310, { fontFamily: "Arial,sans-serif", color: "#1a1a1a", accentColor: "#e89a0a", mutedColor: "#888" }),
            tx(`biz-${idx}`, bizLine, 60, H - 50, W - 120, 30, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#888", textAlign: "center" }),
        ];
        // ── 7. GREEN SPLIT (half white / half olive green, healthy vibe) ──────────
        case 6: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#ffffff"),
            sh(`green-${idx}`, W / 2, 0, W / 2, H, "#5a6e1a"),
            sh(`logo-box-${idx}`, W / 2 - 60, 80, 120, 50, "#ffffff"),
            tx(`logo-txt-${idx}`, lg, W / 2 - 60, 88, 120, 36, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#5a6e1a", fontWeight: 700, textAlign: "center", letterSpacing: 3 }),
            tx(`menu-lbl-${idx}`, "— SPECIAL MENU —", 40, 152, W / 2 - 80, 30, { fontSize: 14, fontFamily: "Arial,sans-serif", color: "#5a6e1a", letterSpacing: 2 }),
            ml(`ml-left-${idx}`, m, "minimal-lines", 40, 198, W / 2 - 80, H - 280, { fontFamily: "Arial,sans-serif", color: "#1a1a1a", accentColor: "#5a6e1a", mutedColor: "#888" }),
            tx(`title-${idx}`, title, W / 2 + 40, 120, W / 2 - 80, 120, { fontSize: 52, fontFamily: "Georgia,serif", color: "#ffffff", fontWeight: 700, fontStyle: "italic" }),
            tx(`biz-${idx}`, bizLine || note, 40, H - 46, W - 80, 30, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#888", textAlign: "center" }),
        ];
        // ── 8. RED BOLD (deep red bg, white text, food delivery style) ────────────
        case 7: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#8b0000"),
            sh(`top-${idx}`, 0, 0, W, 240, "#6b0000"),
            tx(`title-${idx}`, "MENU OF THE WEEK", 60, 50, W - 120, 50, { fontSize: 28, fontFamily: "Arial Black,Arial,sans-serif", color: "#ffffff", fontWeight: 900, textAlign: "center" }),
            tx(`big-${idx}`, "FOOD MENU", 60, 110, W - 120, 80, { fontSize: 56, fontFamily: "Arial Black,Arial,sans-serif", color: "#f5c842", fontWeight: 900, textAlign: "center" }),
            tx(`name-${idx}`, title, 60, 188, W - 120, 36, { fontSize: 18, fontFamily: "Arial,sans-serif", color: "#ffffff", textAlign: "center" }),
            ml(`ml-${idx}`, m, "two-column", 40, 256, W - 80, H - 360, { fontFamily: "Arial,sans-serif", color: "#ffffff", accentColor: "#f5c842", mutedColor: "#e8b0b0" }),
            tx(`biz-${idx}`, bizLine || note, 60, H - 46, W - 120, 30, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#f0d0d0", textAlign: "center" }),
        ];
        // ── 9. CREAM BISTRO (warm cream, wine red, oval logo badge) ───────────────
        case 8: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#faf6ef"),
            ol(`border-${idx}`, 24, 24, W - 48, H - 48, "#8b1a1a", 1),
            ol(`border2-${idx}`, 34, 34, W - 68, H - 68, "#8b1a1a", 0.5, 0.4),
            tx(`title-${idx}`, title, 72, 68, W - 144, 72, { fontSize: 52, fontFamily: "Georgia,serif", color: "#2c1a0e", fontWeight: 700, textAlign: "center" }),
            tx(`orn-${idx}`, "— Menu —", 72, 152, W - 144, 32, { fontSize: 20, fontFamily: "Georgia,serif", color: "#8b1a1a", textAlign: "center", fontStyle: "italic" }),
            sh(`hline-${idx}`, 80, 192, W - 160, 1, "#d4b090"),
            ml(`ml-${idx}`, m, "cards", 60, 210, W - 120, H - 300, { fontFamily: "'Segoe UI',Arial,sans-serif", color: "#2c1a0e", accentColor: "#8b1a1a", mutedColor: "#7a6252" }),
            tx(`biz-${idx}`, bizLine || note, 60, H - 44, W - 120, 30, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#7a6252", textAlign: "center" }),
        ];
        // ── 10. MINIMAL WHITE (ultra clean, hairline rules) ───────────────────────
        case 9: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#fbfbfa"),
            sh(`topbar-${idx}`, 0, 0, W, 4, "#111827"),
            tx(`logo-${idx}`, lg, 60, 48, 160, 36, { fontSize: 11, fontFamily: "Helvetica Neue,Arial,sans-serif", color: "#737373", letterSpacing: 5 }),
            tx(`title-${idx}`, title, 60, 98, W - 120, 70, { fontSize: 50, fontFamily: "Helvetica Neue,Arial,sans-serif", color: "#111827", fontWeight: 300, letterSpacing: -1 }),
            sh(`hline-${idx}`, 60, 178, W - 120, 1, "#e5e5e5"),
            ml(`ml-${idx}`, m, "minimal-lines", 120, 200, W - 240, H - 290, { fontFamily: "Helvetica Neue,Arial,sans-serif", color: "#111827", accentColor: "#111827", mutedColor: "#737373", sectionWeight: 500 }),
            tx(`biz-${idx}`, bizLine, 60, H - 44, W - 120, 30, { fontSize: 11, fontFamily: "Helvetica Neue,Arial,sans-serif", color: "#737373" }),
        ];
        // ── 11. DARK LUXE (premium dark, gold rules, large serif) ─────────────────
        case 10: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#11100d"),
            sh(`gold-top-${idx}`, 72, 72, W - 144, 2, "#C9A24D"),
            tx(`logo-${idx}`, lg, 72, 98, 200, 44, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#C9A24D", letterSpacing: 5 }),
            tx(`title-${idx}`, title, 72, 172, W - 144, 110, { fontSize: 76, fontFamily: "Georgia,serif", color: "#F8F1DF", fontWeight: 400 }),
            sh(`rule-mid-${idx}`, 72, 294, W - 144, 1, "#C9A24D", 0.5),
            note ? tx(`note-${idx}`, note, 72, 312, 800, 32, { fontSize: 15, fontFamily: "Arial,sans-serif", color: "#B9AD95", fontStyle: "italic" }) : null,
            ml(`ml-${idx}`, m, "stacked-luxe", 72, 366, W - 144, H - 460, { fontFamily: "Arial,sans-serif", color: "#F8F1DF", accentColor: "#C9A24D", mutedColor: "#B9AD95" }),
            sh(`gold-bot-${idx}`, 72, H - 96, W - 144, 1, "#C9A24D", 0.4),
            tx(`biz-${idx}`, bizLine, 72, H - 68, W - 144, 30, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#B9AD95" }),
        ].filter(Boolean);
        // ── 12. TEAL ROYAL (deep teal, gold ornament border) ─────────────────────
        case 11: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#0d3b38"),
            sh(`dotted-top-${idx}`, 20, 16, W - 40, 1, "#C9A24D", 0.5),
            sh(`dotted-bot-${idx}`, 20, H - 16, W - 40, 1, "#C9A24D", 0.5),
            ol(`border-${idx}`, 28, 28, W - 56, H - 56, "#C9A24D", 1, 0.6),
            tx(`rname-${idx}`, "Restaurant's Menu", 72, 60, W - 144, 32, { fontSize: 17, fontFamily: "Georgia,serif", color: "#C9A24D", fontStyle: "italic", textAlign: "center" }),
            sh(`goldbelt-${idx}`, 80, 108, W - 160, 60, "#C9A24D"),
            tx(`menu-label-${idx}`, "Menu", 80, 116, W - 160, 44, { fontSize: 32, fontFamily: "Georgia,serif", color: "#0d3b38", fontWeight: 700, textAlign: "center", fontStyle: "italic" }),
            tx(`sub-label-${idx}`, "Restaurant", 80, 154, W - 160, 28, { fontSize: 15, fontFamily: "Georgia,serif", color: "#0d3b38", textAlign: "center" }),
            ml(`ml-${idx}`, m, "gold-dotted", 90, 196, W - 180, H - 290, { fontFamily: "Georgia,serif", color: "#f0e8cc", accentColor: "#C9A24D", mutedColor: "#9aaa88" }),
            tx(`biz-${idx}`, bizLine || note, 72, H - 44, W - 144, 30, { fontSize: 11, fontFamily: "Georgia,serif", color: "#9aaa88", textAlign: "center" }),
        ];
        // ── 13. CLASSIC BRASSERIE (double border, ornament) ──────────────────────
        case 12: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#F2EDE4"),
            ol(`border-outer-${idx}`, 36, 36, W - 72, H - 72, "#7B2E2E", 1, 0.4),
            ol(`border-inner-${idx}`, 52, 52, W - 104, H - 104, "#7B2E2E", 0.5, 0.2),
            tx(`logo-${idx}`, lg, 72, 86, W - 144, 40, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#7B2E2E", textAlign: "center", letterSpacing: 5 }),
            tx(`title-${idx}`, title, 72, 142, W - 144, 96, { fontSize: 60, fontFamily: "Georgia,serif", color: "#1A1208", fontWeight: 700, textAlign: "center" }),
            tx(`orn-${idx}`, "— ✦ —", 72, 250, W - 144, 32, { fontSize: 20, fontFamily: "Georgia,serif", color: "#7B2E2E", textAlign: "center" }),
            note ? tx(`note-${idx}`, note, 120, 294, W - 240, 30, { fontSize: 14, fontFamily: "Georgia,serif", color: "#6B5B44", textAlign: "center", fontStyle: "italic" }) : null,
            ml(`ml-${idx}`, m, "classic-two-col", 80, 342, W - 160, H - 434, { fontFamily: "Georgia,serif", color: "#1A1208", accentColor: "#7B2E2E", mutedColor: "#6B5B44" }),
            tx(`biz-${idx}`, bizLine, 72, H - 56, W - 144, 28, { fontSize: 11, fontFamily: "Georgia,serif", color: "#6B5B44", textAlign: "center" }),
        ].filter(Boolean);
        // ── 14. PREMIUM SLATE (left stripe, bold Raleway-esque) ───────────────────
        case 13: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#F0F2F5"),
            sh(`lstripe-${idx}`, 0, 0, 8, H, "#4A2C6E"),
            tx(`logo-${idx}`, lg, 72, 78, 200, 40, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#4A2C6E", letterSpacing: 5 }),
            tx(`title-${idx}`, title.toUpperCase(), 72, 148, W - 144, 90, { fontSize: 56, fontFamily: "Arial Black,Arial,sans-serif", color: "#0D1B2A", fontWeight: 800, letterSpacing: 3 }),
            sh(`rule-${idx}`, 72, 252, 380, 3, "#4A2C6E"),
            note ? tx(`note-${idx}`, note, 72, 272, 720, 30, { fontSize: 14, fontFamily: "Arial,sans-serif", color: "#556476", letterSpacing: 1 }) : null,
            ml(`ml-${idx}`, m, "premium-two-col", 72, 320, W - 144, H - 420, { fontFamily: "Arial,sans-serif", color: "#0D1B2A", accentColor: "#4A2C6E", mutedColor: "#556476" }),
            tx(`biz-${idx}`, bizLine, 72, H - 48, W - 144, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#556476" }),
        ].filter(Boolean);
        // ── 15. NEON ELECTRIC (dark, electric red accent, bold) ───────────────────
        case 14: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#060606"),
            sh(`glow1-${idx}`, 0, 0, W, 3, "#E53935"),
            sh(`glow2-${idx}`, 0, H - 3, W, 3, "#E53935"),
            sh(`topdark-${idx}`, 0, 0, W, 216, "#111111"),
            sh(`redline-${idx}`, 0, 214, W, 4, "#E53935"),
            tx(`logo-${idx}`, lg, 72, 70, 200, 40, { fontSize: 13, fontFamily: "Arial Black,Arial,sans-serif", color: "#E53935", letterSpacing: 4 }),
            tx(`title-${idx}`, title.toUpperCase(), 72, 122, W - 144, 72, { fontSize: 52, fontFamily: "Arial Black,Arial,sans-serif", color: "#F0F0F0", fontWeight: 900, letterSpacing: 2 }),
            ml(`ml-${idx}`, m, "dark-grid", 72, 254, W - 144, H - 360, { fontFamily: "Arial,sans-serif", color: "#F0F0F0", accentColor: "#E53935", mutedColor: "#888" }),
            tx(`biz-${idx}`, bizLine, 72, H - 46, W - 144, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#666" }),
        ];
        // ── 16. PRINT CLASSIC (white, black border, dotted leaders) ──────────────
        case 15: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#ffffff"),
            ol(`border-${idx}`, 48, 48, W - 96, H - 96, "#000000", 1.5),
            tx(`logo-${idx}`, lg, 72, 78, W - 144, 38, { fontSize: 11, fontFamily: "Times New Roman,serif", color: "#000", textAlign: "center", letterSpacing: 4 }),
            tx(`title-${idx}`, title, 72, 130, W - 144, 78, { fontSize: 54, fontFamily: "Times New Roman,serif", color: "#000", fontWeight: 700, textAlign: "center" }),
            sh(`rule1-${idx}`, 100, 218, W - 200, 1.5, "#000000"),
            sh(`rule2-${idx}`, 100, 222, W - 200, 0.5, "#000000"),
            note ? tx(`note-${idx}`, note, 72, 236, W - 144, 28, { fontSize: 13, fontFamily: "Times New Roman,serif", color: "#555", textAlign: "center", fontStyle: "italic" }) : null,
            ml(`ml-${idx}`, m, "print-cols", 72, 278, W - 144, H - 390, { fontFamily: "Times New Roman,serif", color: "#000000", accentColor: "#000000", mutedColor: "#555555" }),
            sh(`rule3-${idx}`, 100, H - 86, W - 200, 0.5, "#000000"),
            tx(`biz-${idx}`, bizLine, 72, H - 64, W - 144, 28, { fontSize: 11, fontFamily: "Times New Roman,serif", color: "#000", textAlign: "center" }),
        ].filter(Boolean);
        // ── 17. RUSTIC KRAFT (tan paper, stamp style) ─────────────────────────────
        case 16: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#c8a878"),
            sh(`inset-${idx}`, 16, 16, W - 32, H - 32, "#d4b888"),
            ol(`border-${idx}`, 20, 20, W - 40, H - 40, "#5a1a08", 2),
            tx(`title-${idx}`, title.toUpperCase(), 60, 62, W - 120, 60, { fontSize: 38, fontFamily: "Georgia,serif", color: "#5a1a08", fontWeight: 700, textAlign: "center", letterSpacing: 3 }),
            tx(`orn-${idx}`, "✦ MENU ✦", 60, 128, W - 120, 28, { fontSize: 16, fontFamily: "Georgia,serif", color: "#2a1a08", textAlign: "center", letterSpacing: 4 }),
            sh(`hline-${idx}`, 60, 162, W - 120, 2, "#5a1a08"),
            ml(`ml-${idx}`, m, "two-column", 50, 184, W - 100, H - 280, { fontFamily: "Georgia,serif", color: "#2a1a08", accentColor: "#5a1a08", mutedColor: "#5a3a18" }),
            tx(`biz-${idx}`, bizLine || note, 60, H - 46, W - 120, 30, { fontSize: 11, fontFamily: "Georgia,serif", color: "#5a1a08", textAlign: "center" }),
        ];
        // ── 18. KAMPUNG STYLE (cream, yellow section boxes, 2×2) ─────────────────
        case 17: {
            const secs = (m.sections ?? []).slice(0, 4);
            const bxW = (W - 100) / 2, bxH = (H - 310) / 2 - 10;
            const coords = [{ x: 24, y: 230 }, { x: 24 + bxW + 28, y: 230 }, { x: 24, y: 230 + bxH + 16 }, { x: 24 + bxW + 28, y: 230 + bxH + 16 }];
            const bEls = [];
            secs.forEach((sec, bi) => {
                const bx = coords[bi];
                bEls.push(sh(`kbg-${bi}-${idx}`, bx.x, bx.y, bxW, bxH, "#fdf8ee"));
                bEls.push(sh(`kbxh-${bi}-${idx}`, bx.x, bx.y, bxW, 36, "#e8b820"));
                bEls.push(tx(`kbxt-${bi}-${idx}`, sec.name, bx.x, bx.y + 6, bxW, 26, { fontSize: 14, fontFamily: "Georgia,serif", color: "#1a0a00", fontWeight: 700, textAlign: "center", fontStyle: "italic" }));
                let iy = bx.y + 48;
                sec.items.slice(0, 7).forEach(item => {
                    bEls.push(tx(`kbi-${bi}-${item.name}-${idx}`, item.name, bx.x + 10, iy, bxW - 90, 22, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#2a1a08" }));
                    if (item.price)
                        bEls.push(tx(`kbp-${bi}-${item.name}-${idx}`, `${$}${item.price}`, bx.x + bxW - 10, iy, 80, 22, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#7a5028", textAlign: "right" }));
                    iy += 24;
                });
            });
            return [
                sh(`bg-${idx}`, 0, 0, W, H, "#f2ebe0"),
                tx(`title-${idx}`, title, 60, 46, W - 120, 80, { fontSize: 52, fontFamily: "Georgia,serif", color: "#1a0a00", fontWeight: 700 }),
                tx(`sub-${idx}`, "RESTAURANT", 60, 132, 300, 28, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#7a5028", letterSpacing: 3 }),
                sh(`hline-${idx}`, 60, 168, W - 120, 2, "#e8b820"),
                ...bEls,
                tx(`biz-${idx}`, bizLine || note, 60, H - 46, W - 120, 30, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#7a5028", textAlign: "center" }),
            ];
        }
        // ── 19. DARK WOOD + BRUSH (dark bg, yellow brush section labels) ──────────
        case 18: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#111008"),
            sh(`topdark-${idx}`, 0, 0, W, 230, "#0a0808"),
            sh(`brushline-${idx}`, 0, 228, W, 5, "#e8a020", 0.8),
            tx(`logo-${idx}`, lg, 60, 66, 200, 40, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#e8a020", letterSpacing: 4 }),
            tx(`title-big-${idx}`, "Today's Special", 60, 106, W - 120, 48, { fontSize: 36, fontFamily: "Georgia,serif", color: "#e8a020", fontStyle: "italic" }),
            tx(`title-name-${idx}`, title, 60, 148, W - 120, 64, { fontSize: 48, fontFamily: "Arial Black,Arial,sans-serif", color: "#ffffff", fontWeight: 900 }),
            ml(`ml-${idx}`, m, "dark-grid", 60, 256, W - 120, H - 360, { fontFamily: "Arial,sans-serif", color: "#f0f0f0", accentColor: "#e8a020", mutedColor: "#888" }),
            tx(`biz-${idx}`, bizLine || note, 60, H - 46, W - 120, 30, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#888", textAlign: "center" }),
        ];
        // ── 20. DEEP NAVY + GOLD (navy bg, centered serif, ornate) ───────────────
        case 19: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#0f1e35"),
            sh(`gold-t-${idx}`, 60, 60, W - 120, 2, "#C9A24D"),
            sh(`gold-b-${idx}`, 60, H - 62, W - 120, 2, "#C9A24D"),
            tx(`title-${idx}`, title, 60, 82, W - 120, 90, { fontSize: 58, fontFamily: "Georgia,serif", color: "#C9A24D", fontWeight: 700, textAlign: "center" }),
            tx(`orn-${idx}`, "~ ~ ~", 60, 182, W - 120, 30, { fontSize: 18, fontFamily: "Georgia,serif", color: "#C9A24D", textAlign: "center" }),
            note ? tx(`note-${idx}`, note, 100, 220, W - 200, 28, { fontSize: 13, fontFamily: "Georgia,serif", color: "#8a9ab8", textAlign: "center", fontStyle: "italic" }) : null,
            ml(`ml-${idx}`, m, "centered-elegant", 100, 265, W - 200, H - 370, { fontFamily: "Georgia,serif", color: "#e8e0cc", accentColor: "#C9A24D", mutedColor: "#8a9ab8" }),
            tx(`biz-${idx}`, bizLine, 60, H - 40, W - 120, 28, { fontSize: 11, fontFamily: "Georgia,serif", color: "#8a9ab8", textAlign: "center" }),
        ].filter(Boolean);
        // ── 21. BOLD YELLOW (yellow + black, Indian street food style) ────────────
        case 20: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#f5c800"),
            sh(`dark-panel-${idx}`, 0, 0, W, 200, "#111111"),
            tx(`title-${idx}`, title, 60, 38, W - 120, 80, { fontSize: 52, fontFamily: "Arial Black,Arial,sans-serif", color: "#f5c800", fontWeight: 900 }),
            tx(`sub-${idx}`, "Indian Restaurant", 60, 128, W - 120, 34, { fontSize: 16, fontFamily: "Arial,sans-serif", color: "#f5c800", textAlign: "right" }),
            sh(`rule-${idx}`, 0, 198, W, 4, "#111111"),
            ml(`ml-${idx}`, m, "two-column", 40, 222, W - 80, H - 320, { fontFamily: "Arial,sans-serif", color: "#111111", accentColor: "#111111", mutedColor: "#333", sectionWeight: 700 }),
            tx(`biz-${idx}`, bizLine || note, 40, H - 56, W - 80, 38, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#333", textAlign: "center" }),
        ];
        // ── 22. MAROON SPECIAL (deep maroon, script headline, Spanish vibe) ───────
        case 21: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#5a0018"),
            sh(`cream-panel-${idx}`, 0, 0, W, 240, "#fdf6f0"),
            tx(`title-${idx}`, "New Special", 60, 40, W - 120, 60, { fontSize: 40, fontFamily: "Georgia,serif", color: "#5a0018", fontStyle: "italic" }),
            tx(`sub-${idx}`, "FOOD MENU", 60, 108, W - 120, 56, { fontSize: 40, fontFamily: "Arial Black,Arial,sans-serif", color: "#ffffff", fontWeight: 900 }),
            tx(`name-${idx}`, title, 60, 164, W - 120, 36, { fontSize: 18, fontFamily: "Arial,sans-serif", color: "#fdf6f0", textAlign: "center" }),
            ml(`ml-${idx}`, m, "gold-dotted", 60, 260, W - 120, H - 360, { fontFamily: "Arial,sans-serif", color: "#fdf6f0", accentColor: "#e8b020", mutedColor: "#e0b0a0" }),
            tx(`biz-${idx}`, bizLine || note, 60, H - 44, W - 120, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#e0b0a0", textAlign: "center" }),
        ];
        // ── 23. WHITE + ORANGE BRUSH (clean white, orange brush section headers) ──
        case 22: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#f8f8f8"),
            sh(`topdark-${idx}`, 0, 0, W, 6, "#111111"),
            tx(`logo-txt-${idx}`, lg, 60, 40, 160, 40, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#888", letterSpacing: 4 }),
            tx(`title-${idx}`, title, 60, 86, W - 120, 80, { fontSize: 54, fontFamily: "Georgia,serif", color: "#111111", fontWeight: 700 }),
            sh(`orangebar-${idx}`, 60, 176, 200, 4, "#e8720a"),
            note ? tx(`note-${idx}`, note, 60, 190, 700, 28, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#888", fontStyle: "italic" }) : null,
            ml(`ml-${idx}`, m, "two-column", 60, 234, W - 120, H - 330, { fontFamily: "Arial,sans-serif", color: "#111111", accentColor: "#e8720a", mutedColor: "#888" }),
            tx(`biz-${idx}`, bizLine, 60, H - 44, W - 120, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#888" }),
        ].filter(Boolean);
        // ── 24. DOCKSIDE SEAFOOD (coastal, teal accent, handwritten vibe) ─────────
        case 23: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#f0f7f8"),
            sh(`tealbar-${idx}`, 0, 0, W, 10, "#1a8a98"),
            tx(`title-${idx}`, title, 60, 44, W - 120, 86, { fontSize: 58, fontFamily: "Georgia,serif", color: "#0a3038", fontWeight: 700 }),
            tx(`dash-${idx}`, "- menu -", 60, 140, W - 120, 36, { fontSize: 20, fontFamily: "Georgia,serif", color: "#1a8a98", fontStyle: "italic" }),
            sh(`hline-${idx}`, 60, 184, W - 120, 1, "#1a8a98", 0.4),
            ml(`ml-${idx}`, m, "minimal-lines", 60, 208, W - 120, H - 300, { fontFamily: "'Segoe UI',Arial,sans-serif", color: "#0a3038", accentColor: "#1a8a98", mutedColor: "#6a8890" }),
            tx(`biz-${idx}`, bizLine || note, 60, H - 44, W - 120, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#6a8890" }),
        ];
        // ── 25. WILD SAGE / FARM FRESH (warm white, serif, nature feel) ───────────
        case 24: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#faf9f5"),
            ol(`border-${idx}`, 30, 30, W - 60, H - 60, "#4a5c2a", 1, 0.4),
            tx(`est-${idx}`, "EST. 2024  ·  LOCALLY OWNED", 60, 52, W - 120, 22, { fontSize: 10, fontFamily: "Arial,sans-serif", color: "#888", letterSpacing: 3, textAlign: "center" }),
            tx(`title-${idx}`, title, 60, 82, W - 120, 80, { fontSize: 54, fontFamily: "Arial Black,Arial,sans-serif", color: "#2a2a1a", fontWeight: 900, textAlign: "center" }),
            sh(`greenrule-${idx}`, 60, 168, W - 120, 1, "#4a5c2a", 0.5),
            tx(`tagline-${idx}`, "FRESH · ORGANIC · NATURAL", 60, 180, W - 120, 24, { fontSize: 10, fontFamily: "Arial,sans-serif", color: "#888", letterSpacing: 4, textAlign: "center" }),
            ml(`ml-${idx}`, m, "corporate-grid", 60, 218, W - 120, H - 310, { fontFamily: "'Segoe UI',Arial,sans-serif", color: "#2a2a1a", accentColor: "#4a5c2a", mutedColor: "#7a8870" }),
            tx(`biz-${idx}`, bizLine || note, 60, H - 44, W - 120, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#7a8870", textAlign: "center" }),
        ];
        // ── 26. BBQ SMOKE (dark grungy, cream headers, BBQ style) ─────────────────
        case 25: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#1a1108"),
            sh(`cream-header-${idx}`, 0, 0, W, 170, "#f5f0e8"),
            tx(`title-${idx}`, title, 40, 28, W - 80, 70, { fontSize: 50, fontFamily: "Arial Black,Arial,sans-serif", color: "#111111", fontWeight: 900 }),
            sh(`darkrule-${idx}`, 40, 112, W - 80, 3, "#111111"),
            sh(`darkrule2-${idx}`, 40, 116, W - 80, 1, "#111111", 0.5),
            tx(`sub-${idx}`, "SMOKE & GRILL", 40, 130, W - 80, 28, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#555", letterSpacing: 4 }),
            ml(`ml-${idx}`, m, "two-column", 40, 190, W - 80, H - 280, { fontFamily: "Arial,sans-serif", color: "#f0e8d8", accentColor: "#e8a020", mutedColor: "#9a8a70" }),
            tx(`biz-${idx}`, bizLine || note, 40, H - 44, W - 80, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#9a8a70" }),
        ];
        // ── 27. FAMILY FAVORITES (dark wood, script header, warm) ────────────────
        case 26: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#1a1208"),
            sh(`photo-overlay-${idx}`, 0, 0, W, 320, "#0a0808"),
            tx(`rname-${idx}`, "RESTAURANT", 60, 36, W - 120, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#e8a020", textAlign: "center", letterSpacing: 4 }),
            tx(`title-big-${idx}`, `The ${title}`, 60, 72, W - 120, 120, { fontSize: 64, fontFamily: "Georgia,serif", color: "#ffffff", fontStyle: "italic" }),
            tx(`sub-big-${idx}`, "Favorites", 60, 190, W - 120, 80, { fontSize: 60, fontFamily: "Georgia,serif", color: "#ffffff", fontStyle: "italic" }),
            sh(`orangebar-${idx}`, 0, 310, W, 6, "#e8720a"),
            ml(`ml-${idx}`, m, "two-column", 40, 338, W - 80, H - 430, { fontFamily: "'Segoe UI',Arial,sans-serif", color: "#f0e8d8", accentColor: "#e8a020", mutedColor: "#9a8a70" }),
            tx(`biz-${idx}`, bizLine || note, 40, H - 44, W - 80, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#888", textAlign: "center" }),
        ];
        // ── 28. DUCK FAT / BISTRO WHITE (clean white, diagonal stripe top) ────────
        case 27: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#fafafa"),
            sh(`stripe-bg-${idx}`, 0, 0, W, 80, "#111111"),
            tx(`title-${idx}`, title.toUpperCase(), 60, 20, W - 120, 48, { fontSize: 34, fontFamily: "Arial Black,Arial,sans-serif", color: "#ffffff", fontWeight: 900 }),
            sh(`underline-${idx}`, 60, 90, 120, 3, "#111111"),
            tx(`dot-orn-${idx}`, "· · · · · · · · · · · · · · · · · · · · · · · · · · ·", 60, 98, W - 120, 20, { fontSize: 10, fontFamily: "Arial,sans-serif", color: "#ccc" }),
            ml(`ml-${idx}`, m, "minimal-lines", 60, 132, W - 120, H - 230, { fontFamily: "Arial,sans-serif", color: "#111111", accentColor: "#111111", mutedColor: "#666" }),
            tx(`dot-orn2-${idx}`, "· · · · · · · · · · · · · · · · · · · · · · · · · · ·", 60, H - 82, W - 120, 20, { fontSize: 10, fontFamily: "Arial,sans-serif", color: "#ccc" }),
            tx(`biz-${idx}`, bizLine || note, 60, H - 50, W - 120, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#888" }),
        ];
        // ── 29. BLACK GOLD WEEK (black, gold corner ornaments, bi-fold style) ─────
        case 28: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#111111"),
            sh(`corner-tl-${idx}`, 20, 20, 80, 3, "#C9A24D"),
            sh(`corner-tl2-${idx}`, 20, 20, 3, 80, "#C9A24D"),
            sh(`corner-tr-${idx}`, W - 100, 20, 80, 3, "#C9A24D"),
            sh(`corner-tr2-${idx}`, W - 23, 20, 3, 80, "#C9A24D"),
            sh(`corner-bl-${idx}`, 20, H - 23, 80, 3, "#C9A24D"),
            sh(`corner-bl2-${idx}`, 20, H - 100, 3, 80, "#C9A24D"),
            sh(`corner-br-${idx}`, W - 100, H - 23, 80, 3, "#C9A24D"),
            sh(`corner-br2-${idx}`, W - 23, H - 100, 3, 80, "#C9A24D"),
            tx(`title-${idx}`, "DELICIOUS", 60, 60, W - 120, 66, { fontSize: 50, fontFamily: "Arial Black,Arial,sans-serif", color: "#ffffff", fontWeight: 900, textAlign: "center" }),
            tx(`title2-${idx}`, "MENU", 60, 130, W - 120, 76, { fontSize: 58, fontFamily: "Arial Black,Arial,sans-serif", color: "#C9A24D", fontWeight: 900, textAlign: "center" }),
            tx(`name-${idx}`, title, 60, 212, W - 120, 32, { fontSize: 16, fontFamily: "Arial,sans-serif", color: "#aaa", textAlign: "center" }),
            sh(`hline-${idx}`, 80, 252, W - 160, 1, "#C9A24D", 0.4),
            ml(`ml-${idx}`, m, "two-column", 60, 276, W - 120, H - 380, { fontFamily: "Arial,sans-serif", color: "#ffffff", accentColor: "#C9A24D", mutedColor: "#888" }),
            tx(`biz-${idx}`, bizLine || note, 60, H - 44, W - 120, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#888", textAlign: "center" }),
        ];
        // ── 30. MAGAZINE STYLE (white left strip, dark right bg, asymmetric) ──────
        default: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#0f0f0f"),
            sh(`white-strip-${idx}`, 0, 0, 300, H, "#ffffff"),
            tx(`strip-lg-${idx}`, lg, 30, 60, 240, 40, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#111", letterSpacing: 4 }),
            tx(`strip-title-${idx}`, title, 20, 120, 260, 200, { fontSize: 38, fontFamily: "Arial Black,Arial,sans-serif", color: "#111", fontWeight: 900 }),
            note ? tx(`strip-note-${idx}`, note, 20, 330, 260, 80, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#555" }) : null,
            tx(`strip-biz-${idx}`, bizLine, 20, H - 80, 260, 50, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#555" }),
            ml(`ml-${idx}`, m, "dark-grid", 330, 60, W - 370, H - 120, { fontFamily: "Arial,sans-serif", color: "#f0f0f0", accentColor: "#e8a020", mutedColor: "#888" }),
        ].filter(Boolean);
    }
}
export function generateDesignBatch(projectId, menu, startIndex, count = 10) {
    const LABELS = [
        "Dark Food Board", "Gold Leaders", "Dark Boxes", "Aroma Special", "Moody Dark",
        "India Vertical", "Green Split", "Red Bold", "Cream Bistro", "Minimal White",
        "Dark Luxe", "Teal Royal", "Classic Brasserie", "Premium Slate", "Neon Electric",
        "Print Classic", "Rustic Kraft", "Kampung Style", "Dark Brush", "Deep Navy",
        "Bold Yellow", "Maroon Special", "White Orange", "Dockside", "Wild Sage",
        "BBQ Smoke", "Family Favorites", "Bistro White", "Black Gold", "Magazine Style"
    ];
    const CATS = [
        "dark", "luxury", "restaurant", "restaurant", "dark",
        "modern", "modern", "restaurant", "elegant", "minimal",
        "luxury", "luxury", "classic", "premium", "dark",
        "print", "classic", "restaurant", "dark", "luxury",
        "restaurant", "restaurant", "modern", "restaurant", "minimal",
        "restaurant", "restaurant", "classic", "luxury", "modern"
    ];
    return Array.from({ length: count }, (_, offset) => {
        const designIndex = startIndex + offset;
        const tplId = (designIndex - 1) % 30;
        return {
            projectId,
            templateId: `tpl-${tplId}-${String(designIndex).padStart(3, "0")}`,
            batchNumber: Math.ceil(designIndex / 10),
            designIndex,
            category: CATS[tplId],
            label: LABELS[tplId],
            status: "draft",
            thumbnailUrl: "",
            canvasState: {
                version: 1,
                templateId: String(tplId),
                label: LABELS[tplId],
                category: CATS[tplId],
                page: { width: W, height: H, background: "#111111" },
                styles: { brand: { logo: menu.logo, colors: menu.brandColors, style: menu.style, businessDetails: menu.businessDetails } },
                elements: buildElements(tplId, menu, designIndex)
            }
        };
    });
}
// Re-export price helper for MenuPreview
export { fmtPrice, sym };
// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATES 31–60 — new designs from PDF reference
// ══════════════════════════════════════════════════════════════════════════════
function buildElements2(tplId, m, idx) {
    const title = m.restaurantName ?? "Restaurant";
    const note = m.businessDetails?.serviceNote || m.style?.mood || "";
    const bizLine = biz(m);
    const lg = logo(m);
    const cur = m.currency ?? "INR";
    const $ = sym(cur);
    switch (tplId) {
        // ── 31. MIDDLE EASTERN HERITAGE (cream parchment, ornate arrows, warm) ───
        case 30: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#F5EDD8"),
            sh(`top-stripe-${idx}`, 0, 0, W, 10, "#8B4513", 0.6),
            sh(`bot-stripe-${idx}`, 0, H - 10, W, 10, "#8B4513", 0.6),
            tx(`tagline-${idx}`, "FROM OUR HERITAGE TO YOUR TABLE", 60, 26, W - 120, 24, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#8B4513", textAlign: "center", letterSpacing: 3 }),
            tx(`title-${idx}`, title, 60, 58, W - 120, 100, { fontSize: 66, fontFamily: "Georgia,serif", color: "#2c1a0e", fontWeight: 900, textAlign: "center" }),
            tx(`subtitle-${idx}`, "MIDDLE EASTERN KITCHEN", 60, 166, W - 120, 32, { fontSize: 16, fontFamily: "Arial,sans-serif", color: "#8B4513", textAlign: "center", letterSpacing: 4 }),
            note ? tx(`note-${idx}`, `→ ${note} ←`, 60, 206, W - 120, 28, { fontSize: 13, fontFamily: "Georgia,serif", color: "#5a3020", textAlign: "center", fontStyle: "italic" }) : null,
            sh(`rule-${idx}`, 60, 244, W - 120, 1.5, "#8B4513", 0.5),
            ml(`ml-${idx}`, m, "two-column", 50, 264, W - 100, H - 370, { fontFamily: "Georgia,serif", color: "#2c1a0e", accentColor: "#8B4513", mutedColor: "#7a5a3a" }),
            sh(`rule2-${idx}`, 60, H - 90, W - 120, 1, "#8B4513", 0.4),
            tx(`biz-${idx}`, bizLine || note, 60, H - 60, W - 120, 40, { fontSize: 12, fontFamily: "Georgia,serif", color: "#7a5a3a", textAlign: "center" }),
        ].filter(Boolean);
        // ── 32. HARBORLIGHT CAFE (cream, bold black headers, sunrise orange) ─────
        case 31: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#FDFAF3"),
            sh(`topband-${idx}`, 0, 0, W, 180, "#F5EDD8"),
            sh(`orangeline-${idx}`, 0, 178, W, 4, "#E8720A"),
            tx(`title-${idx}`, title, 60, 36, W - 120, 90, { fontSize: 62, fontFamily: "Arial Black,Arial,sans-serif", color: "#111111", fontWeight: 900, letterSpacing: -2 }),
            tx(`sub-${idx}`, "CAFE", 60, 126, W - 120, 38, { fontSize: 24, fontFamily: "Arial,sans-serif", color: "#555", letterSpacing: 10, textAlign: "center" }),
            tx(`tagline-${idx}`, "GOOD COFFEE  ·  FRESH INGREDIENTS  ·  BRIGHT STARTS", 60, 156, W - 120, 22, { fontSize: 10, fontFamily: "Arial,sans-serif", color: "#888", textAlign: "center", letterSpacing: 2 }),
            ml(`ml-${idx}`, m, "two-column", 50, 204, W - 100, H - 300, { fontFamily: "Arial,sans-serif", color: "#111111", accentColor: "#E8720A", mutedColor: "#666", sectionWeight: 700 }),
            sh(`botbar-${idx}`, 0, H - 60, W, 60, "#111111"),
            tx(`biz-${idx}`, bizLine || note, 60, H - 38, W - 120, 28, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#ffffff", textAlign: "center" }),
        ];
        // ── 33. LJ'S DINER (cream white, bold red section titles, American diner) ─
        case 32: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#FAFAF8"),
            ol(`border-${idx}`, 20, 20, W - 40, H - 40, "#B22222", 1.5, 0.5),
            tx(`title-${idx}`, title, 60, 48, W - 120, 80, { fontSize: 56, fontFamily: "Arial Black,Arial,sans-serif", color: "#111111", fontWeight: 900 }),
            sh(`redline-${idx}`, 60, 136, W - 120, 4, "#B22222"),
            note ? tx(`note-${idx}`, note, 60, 152, W - 120, 28, { fontSize: 14, fontFamily: "Arial,sans-serif", color: "#555", fontStyle: "italic" }) : null,
            ml(`ml-${idx}`, m, "gold-dotted", 60, 196, W - 120, H - 300, { fontFamily: "Arial,sans-serif", color: "#111111", accentColor: "#B22222", mutedColor: "#666" }),
            sh(`botbar-${idx}`, 0, H - 54, W, 2, "#B22222"),
            tx(`biz-${idx}`, bizLine, 60, H - 40, W - 120, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#555", textAlign: "center" }),
        ].filter(Boolean);
        // ── 34. KOI RESTAURANT (dark maroon, diamond bullet points, Indian luxury) ─
        case 33: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#2a0808"),
            sh(`inner-${idx}`, 16, 16, W - 32, H - 32, "#1a0404"),
            ol(`gold-border-${idx}`, 24, 24, W - 48, H - 48, "#C9A24D", 1, 0.5),
            tx(`logo-txt-${idx}`, lg, W - 180, 48, 140, 80, { fontSize: 56, fontFamily: "Georgia,serif", color: "#C9A24D", fontWeight: 900, textAlign: "center" }),
            tx(`title-${idx}`, title.toUpperCase(), 60, 58, W - 260, 60, { fontSize: 42, fontFamily: "Arial Black,Arial,sans-serif", color: "#ffffff", fontWeight: 900, letterSpacing: 3 }),
            sh(`goldrule-${idx}`, 60, 126, W - 260, 2, "#C9A24D", 0.6),
            ml(`ml-${idx}`, m, "minimal-lines", 60, 150, W - 120, H - 240, { fontFamily: "Arial,sans-serif", color: "#f0e8cc", accentColor: "#C9A24D", mutedColor: "#9a8a70" }),
            tx(`biz-${idx}`, bizLine || note, 60, H - 46, W - 120, 30, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#9a8a70", textAlign: "center" }),
        ];
        // ── 35. HALONG BAY (red border, vietnamese script headings, rice paper) ───
        case 34: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#F8F0E4"),
            sh(`redborder-t-${idx}`, 0, 0, W, 12, "#8B1A1A"),
            sh(`redborder-b-${idx}`, 0, H - 12, W, 12, "#8B1A1A"),
            sh(`redborder-l-${idx}`, 0, 0, 12, H, "#8B1A1A"),
            sh(`redborder-r-${idx}`, W - 12, 0, 12, H, "#8B1A1A"),
            tx(`logo-icon-${idx}`, "🍜", 60, 36, 80, 64, { fontSize: 48, fontFamily: "Arial,sans-serif", textAlign: "center" }),
            tx(`title-${idx}`, title, 150, 44, W - 220, 60, { fontSize: 42, fontFamily: "Arial Black,Arial,sans-serif", color: "#2a0a00", fontWeight: 900 }),
            sh(`rule-${idx}`, 60, 112, W - 120, 1.5, "#8B1A1A", 0.5),
            ml(`ml-${idx}`, m, "two-column", 60, 134, W - 120, H - 240, { fontFamily: "Arial,sans-serif", color: "#2a0a00", accentColor: "#8B1A1A", mutedColor: "#7a5a3a" }),
            tx(`biz-${idx}`, bizLine || note, 60, H - 46, W - 120, 30, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#7a5a3a", textAlign: "center" }),
        ];
        // ── 36. TIMEOUT TAVERN (black bg, gold script section names, pub style) ───
        case 35: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#0d0b08"),
            sh(`footbar-${idx}`, 0, H - 60, W, 60, "#1a1608"),
            tx(`footer-url-${idx}`, bizLine || note, 60, H - 38, W - 120, 28, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#C9A24D", textAlign: "center" }),
            tx(`title-${idx}`, title, 60, 52, W - 120, 100, { fontSize: 68, fontFamily: "Georgia,serif", color: "#C9A24D", fontWeight: 400, fontStyle: "italic" }),
            sh(`rule-${idx}`, 60, 160, W - 120, 1, "#C9A24D", 0.4),
            ml(`ml-${idx}`, m, "stacked-luxe", 60, 186, W - 120, H - 278, { fontFamily: "Georgia,serif", color: "#f0e8cc", accentColor: "#C9A24D", mutedColor: "#9a8a70" }),
        ];
        // ── 37. PORKY'S BBQ (grungy cream, blocky red logo area, food truck) ──────
        case 36: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#F0E8D8"),
            sh(`red-block-${idx}`, 0, 0, 380, 300, "#B22222"),
            tx(`title-${idx}`, title, 20, 30, 340, 180, { fontSize: 80, fontFamily: "Arial Black,Arial,sans-serif", color: "#ffffff", fontWeight: 900, lineHeight: 0.9 }),
            tx(`sub-${idx}`, "FOOD TRUCK", 20, 218, 340, 40, { fontSize: 18, fontFamily: "Arial,sans-serif", color: "#ffffff", letterSpacing: 4 }),
            tx(`est-${idx}`, "EST 2013", 20, 256, 340, 30, { fontSize: 14, fontFamily: "Arial,sans-serif", color: "#f0a0a0", letterSpacing: 2 }),
            ml(`ml-${idx}`, m, "gold-dotted", 40, 324, W - 80, H - 420, { fontFamily: "Arial,sans-serif", color: "#1a0a00", accentColor: "#B22222", mutedColor: "#666" }),
            sh(`rule-${idx}`, 40, H - 70, W - 80, 1, "#B22222", 0.4),
            tx(`biz-${idx}`, bizLine || note, 40, H - 48, W - 80, 30, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#666", textAlign: "center" }),
        ];
        // ── 38. CATERING / OLIVE GREEN (two tone, formal catering style) ──────────
        case 37: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#F5F2E8"),
            sh(`green-left-${idx}`, 0, 0, 24, H, "#5a6e1a"),
            sh(`green-right-${idx}`, W - 24, 0, 24, H, "#5a6e1a"),
            tx(`title-${idx}`, title, 60, 50, W - 120, 80, { fontSize: 54, fontFamily: "Georgia,serif", color: "#2a3a0a", fontWeight: 700 }),
            tx(`sub-${idx}`, note || "CATERING MENU", 60, 140, W - 120, 30, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#5a6e1a", letterSpacing: 4 }),
            sh(`rule-${idx}`, 60, 178, W - 120, 2, "#5a6e1a", 0.6),
            ml(`ml-${idx}`, m, "corporate-grid", 60, 200, W - 120, H - 300, { fontFamily: "Georgia,serif", color: "#1a2a00", accentColor: "#5a6e1a", mutedColor: "#7a8870" }),
            sh(`botline-${idx}`, 60, H - 60, W - 120, 1, "#5a6e1a", 0.4),
            tx(`biz-${idx}`, bizLine || "All Events | Corporate | Parties", 60, H - 42, W - 120, 28, { fontSize: 12, fontFamily: "Georgia,serif", color: "#5a6e1a", textAlign: "center" }),
        ];
        // ── 39. IRISH PUB (orange gold on dark, old english feel) ─────────────────
        case 38: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#1a0f04"),
            sh(`img-area-${idx}`, 0, 0, W, 200, "#0d0804"),
            sh(`orange-rule-${idx}`, 0, 200, W, 4, "#E8720A"),
            tx(`title-${idx}`, title, 60, 34, W - 120, 100, { fontSize: 62, fontFamily: "Georgia,serif", color: "#E8A020", fontWeight: 700, fontStyle: "italic" }),
            tx(`sub-${idx}`, note || "FOOD MENU", 60, 140, W - 120, 40, { fontSize: 16, fontFamily: "Arial,sans-serif", color: "#E8720A", letterSpacing: 4 }),
            ml(`ml-${idx}`, m, "two-column", 50, 222, W - 100, H - 320, { fontFamily: "Arial,sans-serif", color: "#f0e8cc", accentColor: "#E8A020", mutedColor: "#9a8a70" }),
            sh(`botbar-${idx}`, 0, H - 70, W, 70, "#0d0804"),
            tx(`biz-${idx}`, bizLine || note, 60, H - 44, W - 120, 28, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#E8A020", textAlign: "center" }),
        ];
        // ── 40. INDIAN CURRY HOUSE (warm orange, white, curry vibes) ──────────────
        case 39: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#FFF8EE"),
            sh(`header-${idx}`, 0, 0, W, 200, "#E8720A"),
            tx(`title-${idx}`, title, 60, 36, W - 120, 90, { fontSize: 56, fontFamily: "Georgia,serif", color: "#ffffff", fontWeight: 700, textAlign: "center" }),
            tx(`sub-${idx}`, note || "RESTAURANT", 60, 132, W - 120, 36, { fontSize: 16, fontFamily: "Arial,sans-serif", color: "#fff0d0", textAlign: "center", letterSpacing: 4 }),
            tx(`logo-init-${idx}`, lg, 60, 164, W - 120, 28, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#fff0d0", textAlign: "center", letterSpacing: 3 }),
            ml(`ml-${idx}`, m, "two-column", 50, 218, W - 100, H - 310, { fontFamily: "Arial,sans-serif", color: "#1a0a00", accentColor: "#E8720A", mutedColor: "#7a5028" }),
            sh(`botbar-${idx}`, 0, H - 58, W, 58, "#E8720A"),
            tx(`biz-${idx}`, bizLine || note, 60, H - 36, W - 120, 24, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#ffffff", textAlign: "center" }),
        ];
        // ── 41. COFFEE SHOP DARK (dark brown, yellow accent, coffee house) ────────
        case 40: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#1a1108"),
            sh(`header-${idx}`, 0, 0, W, 240, "#111008"),
            tx(`title-${idx}`, title, 60, 46, W - 120, 90, { fontSize: 58, fontFamily: "Georgia,serif", color: "#f5c842", fontWeight: 700, fontStyle: "italic" }),
            tx(`sub-${idx}`, "SPECIALTY COFFEE", 60, 142, W - 120, 30, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#aaa", letterSpacing: 4, textAlign: "center" }),
            tx(`tagline-${idx}`, note || "Served Hot or Iced · 8 oz  12 oz  16 oz", 60, 182, W - 120, 24, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#888", textAlign: "center" }),
            sh(`rule-${idx}`, 60, 216, W - 120, 1, "#f5c842", 0.3),
            ml(`ml-${idx}`, m, "stacked-luxe", 60, 240, W - 120, H - 330, { fontFamily: "Georgia,serif", color: "#f0e8cc", accentColor: "#f5c842", mutedColor: "#9a8a70" }),
            sh(`botstrip-${idx}`, 0, H - 60, W, 60, "#0a0804"),
            tx(`biz-${idx}`, bizLine, 60, H - 38, W - 120, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#9a8a70", textAlign: "center" }),
        ];
        // ── 42. WING COMBOS (dark olive, checkerboard top/bot, American sports bar) ─
        case 41: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#1a1a0a"),
            sh(`check-t-${idx}`, 0, 0, W, 20, "#C9A24D"),
            sh(`check-b-${idx}`, 0, H - 20, W, 20, "#C9A24D"),
            tx(`title-${idx}`, title, 60, 40, W - 120, 90, { fontSize: 60, fontFamily: "Arial Black,Arial,sans-serif", color: "#ffffff", fontWeight: 900, textAlign: "center" }),
            tx(`sub-${idx}`, note || "MENU OF THE WEEK", 60, 136, W - 120, 30, { fontSize: 14, fontFamily: "Arial,sans-serif", color: "#C9A24D", textAlign: "center", letterSpacing: 3 }),
            sh(`rule-${idx}`, 60, 174, W - 120, 1, "#C9A24D", 0.4),
            ml(`ml-${idx}`, m, "two-column", 50, 196, W - 100, H - 300, { fontFamily: "Arial,sans-serif", color: "#f0f0f0", accentColor: "#C9A24D", mutedColor: "#aaa" }),
            tx(`biz-${idx}`, bizLine, 60, H - 48, W - 120, 30, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#C9A24D", textAlign: "center" }),
        ];
        // ── 43. FIRE SANDWICHES (yellow wave bottom, fire gradient top) ───────────
        case 42: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#FFF8DC"),
            sh(`fire-top-${idx}`, 0, 0, W, 8, "#E8A020"),
            tx(`title-${idx}`, title, 60, 32, W - 120, 80, { fontSize: 54, fontFamily: "Georgia,serif", color: "#1a0a00", fontWeight: 700, fontStyle: "italic", textAlign: "center" }),
            sh(`rule-${idx}`, 200, 118, W - 400, 1.5, "#E8720A"),
            note ? tx(`note-${idx}`, note, 60, 132, W - 120, 28, { fontSize: 14, fontFamily: "Arial,sans-serif", color: "#7a5028", textAlign: "center" }) : null,
            ml(`ml-${idx}`, m, "corporate-grid", 50, 178, W - 100, H - 270, { fontFamily: "Arial,sans-serif", color: "#1a0a00", accentColor: "#E8720A", mutedColor: "#7a5028" }),
            sh(`bot-wave-${idx}`, 0, H - 70, W, 70, "#E8A020"),
            tx(`biz-${idx}`, bizLine || note, 60, H - 44, W - 120, 28, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#ffffff", textAlign: "center" }),
        ].filter(Boolean);
        // ── 44. BIRYANI SCRIPT (warm peach left column, dark right, Indian script) ─
        case 43: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#F5F0E8"),
            sh(`dark-right-${idx}`, W / 2 + 40, 0, W / 2 - 40, H, "#1a1208"),
            sh(`peach-strip-${idx}`, W / 2 + 36, 0, 6, H, "#E8A020"),
            tx(`title-big-${idx}`, title, 30, 48, W / 2, 160, { fontSize: 56, fontFamily: "Georgia,serif", color: "#1a0a00", fontWeight: 700, fontStyle: "italic" }),
            sh(`rule-l-${idx}`, 30, 216, W / 2 - 60, 2, "#E8A020"),
            note ? tx(`note-l-${idx}`, note, 30, 230, W / 2 - 60, 30, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#7a5028" }) : null,
            ml(`ml-left-${idx}`, { ...m, sections: (m.sections ?? []).filter((_, i) => i % 2 === 0) }, "minimal-lines", 30, 276, W / 2 - 60, H - 340, { fontFamily: "Georgia,serif", color: "#1a0a00", accentColor: "#E8A020", mutedColor: "#7a5028" }),
            tx(`sub-right-${idx}`, "SPECIAL MENU", W / 2 + 70, 60, W / 2 - 110, 36, { fontSize: 16, fontFamily: "Arial,sans-serif", color: "#C9A24D", letterSpacing: 4 }),
            ml(`ml-right-${idx}`, { ...m, sections: (m.sections ?? []).filter((_, i) => i % 2 !== 0) }, "minimal-lines", W / 2 + 70, 112, W / 2 - 110, H - 200, { fontFamily: "Arial,sans-serif", color: "#f0e8cc", accentColor: "#C9A24D", mutedColor: "#9a8a70" }),
            tx(`biz-${idx}`, bizLine, 30, H - 44, W - 60, 28, { fontSize: 10, fontFamily: "Arial,sans-serif", color: "#888", textAlign: "center" }),
        ].filter(Boolean);
        // ── 45. DINNER PROVISIONS (clean white, all caps section headers) ─────────
        case 44: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#ffffff"),
            sh(`top-accent-${idx}`, 0, 0, W, 6, "#1a1a1a"),
            tx(`title-big-${idx}`, "DINNER", 40, 30, W - 80, 90, { fontSize: 70, fontFamily: "Arial Black,Arial,sans-serif", color: "#1a1a1a", fontWeight: 900 }),
            tx(`name-${idx}`, title, 40, 118, W - 80, 36, { fontSize: 18, fontFamily: "Arial,sans-serif", color: "#555" }),
            sh(`rule-${idx}`, 40, 162, W - 80, 1.5, "#1a1a1a"),
            ml(`ml-${idx}`, m, "two-column", 40, 182, W - 80, H - 280, { fontFamily: "Arial,sans-serif", color: "#111111", accentColor: "#111111", mutedColor: "#555", sectionWeight: 700 }),
            sh(`botline-${idx}`, 40, H - 70, W - 80, 1, "#1a1a1a"),
            tx(`biz-${idx}`, bizLine || note, 40, H - 48, W - 80, 30, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#555", textAlign: "center" }),
        ];
        // ── 46. WINE LIST (classic cream, italic wine names, fine dining) ──────────
        case 45: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#FAF7F0"),
            ol(`border-${idx}`, 30, 30, W - 60, H - 60, "#8B6914", 1, 0.4),
            tx(`logo-${idx}`, "—— NEIGHBORHOOD ——", 60, 48, W - 120, 24, { fontSize: 10, fontFamily: "Arial,sans-serif", color: "#8B6914", textAlign: "center", letterSpacing: 4 }),
            tx(`title-${idx}`, title.toUpperCase(), 60, 78, W - 120, 70, { fontSize: 48, fontFamily: "Arial Black,Arial,sans-serif", color: "#1a1208", fontWeight: 900, textAlign: "center", letterSpacing: 3 }),
            sh(`ruletop-${idx}`, 80, 156, W - 160, 1, "#8B6914", 0.5),
            sh(`rulemid-${idx}`, 80, 160, W - 160, 1, "#8B6914", 0.3),
            tx(`sub-${idx}`, note || "WINE & BEVERAGE MENU", 60, 172, W - 120, 28, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#8B6914", textAlign: "center", letterSpacing: 3 }),
            ml(`ml-${idx}`, m, "gold-dotted", 70, 214, W - 140, H - 310, { fontFamily: "Georgia,serif", color: "#1a1208", accentColor: "#8B6914", mutedColor: "#888" }),
            tx(`ask-${idx}`, "Ask your server about the Wine of the Week!", 60, H - 70, W - 120, 28, { fontSize: 12, fontFamily: "Georgia,serif", color: "#8B6914", textAlign: "center", fontStyle: "italic" }),
            tx(`biz-${idx}`, bizLine, 60, H - 40, W - 120, 26, { fontSize: 10, fontFamily: "Arial,sans-serif", color: "#888", textAlign: "center" }),
        ];
        // ── 47. BOOZY BRUNCH (deep purple, chunky black bold type, brunch bar) ────
        case 46: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#2a1848"),
            sh(`yellow-wave-${idx}`, 0, H - 80, W, 80, "#f5c842"),
            tx(`title-main-${idx}`, "BRUNCH", 60, 38, W - 120, 110, { fontSize: 80, fontFamily: "Arial Black,Arial,sans-serif", color: "#ffffff", fontWeight: 900, textAlign: "center" }),
            tx(`served-${idx}`, "~ SERVED UNTIL 3PM ~", 60, 152, W - 120, 28, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#f5c842", textAlign: "center", letterSpacing: 4 }),
            tx(`name-${idx}`, title, 60, 190, W - 120, 34, { fontSize: 18, fontFamily: "Georgia,serif", color: "#e0d0f0", textAlign: "center" }),
            sh(`rule-${idx}`, 100, 232, W - 200, 1, "#f5c842", 0.4),
            ml(`ml-${idx}`, m, "two-column", 50, 252, W - 100, H - 360, { fontFamily: "Arial,sans-serif", color: "#f0ecff", accentColor: "#f5c842", mutedColor: "#b0a0d0" }),
            tx(`biz-${idx}`, bizLine || note, 60, H - 54, W - 120, 28, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#1a1208", textAlign: "center" }),
        ];
        // ── 48. AMIGO'S (green cream, checkbox bullets, Mexican casual) ───────────
        case 47: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#F5F2E0"),
            sh(`green-top-${idx}`, 0, 0, W, 16, "#4a7a28"),
            sh(`green-bot-${idx}`, 0, H - 16, W, 16, "#4a7a28"),
            tx(`title-${idx}`, title, 60, 38, W - 120, 80, { fontSize: 52, fontFamily: "Arial Black,Arial,sans-serif", color: "#1a2a0a", fontWeight: 900 }),
            tx(`sub-${idx}`, note || "FOOD & DRINK MENU", 60, 124, W - 120, 28, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#4a7a28", letterSpacing: 3 }),
            sh(`rule-${idx}`, 60, 158, W - 120, 2, "#4a7a28", 0.5),
            ml(`ml-${idx}`, m, "corporate-grid", 50, 178, W - 100, H - 280, { fontFamily: "Arial,sans-serif", color: "#1a2a0a", accentColor: "#4a7a28", mutedColor: "#5a6a3a" }),
            sh(`spec-box-${idx}`, 60, H - 90, W - 120, 34, "#4a7a28"),
            tx(`spec-txt-${idx}`, "DAILY SPECIALS — ASK YOUR SERVER", 60, H - 76, W - 120, 20, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#ffffff", textAlign: "center", letterSpacing: 2 }),
            tx(`biz-${idx}`, bizLine, 60, H - 34, W - 120, 24, { fontSize: 10, fontFamily: "Arial,sans-serif", color: "#5a6a3a", textAlign: "center" }),
        ];
        // ── 49. WEST COAST PIZZA (clean white, dashed rules, red & green accents) ──
        case 48: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#FFFFFF"),
            sh(`img-top-${idx}`, 0, 0, W, 150, "#f0e8e0"),
            tx(`title-${idx}`, title, 60, 24, W - 120, 90, { fontSize: 52, fontFamily: "Georgia,serif", color: "#B22222", fontWeight: 700, fontStyle: "italic" }),
            tx(`tagline-${idx}`, "WWW." + (m.businessDetails?.website?.replace(/https?:\/\//i, "") || "yourwebsite.com").toUpperCase(), 60, 116, W - 120, 22, { fontSize: 10, fontFamily: "Arial,sans-serif", color: "#555", textAlign: "center", letterSpacing: 2 }),
            sh(`rule-dashed-${idx}`, 0, 148, W, 2, "#B22222", 0.5),
            sh(`rule-dashed2-${idx}`, 0, 154, W, 1, "#B22222", 0.3),
            ml(`ml-${idx}`, m, "two-column", 40, 178, W - 80, H - 270, { fontFamily: "Arial,sans-serif", color: "#111111", accentColor: "#B22222", mutedColor: "#666" }),
            sh(`rule-bot-${idx}`, 0, H - 70, W, 2, "#B22222", 0.5),
            tx(`biz-${idx}`, bizLine || note, 40, H - 48, W - 80, 30, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#555", textAlign: "center" }),
        ];
        // ── 50. NEIGHBORHOOD DINNER (clean, multi-col grid, fine dining modern) ───
        case 49: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#FAFAFA"),
            sh(`top-dark-${idx}`, 0, 0, W, 8, "#111111"),
            tx(`est-${idx}`, "EST · LOCALLY OWNED", 60, 24, W - 120, 20, { fontSize: 9, fontFamily: "Arial,sans-serif", color: "#888", textAlign: "center", letterSpacing: 4 }),
            tx(`title-${idx}`, title.toUpperCase(), 60, 50, W - 120, 80, { fontSize: 52, fontFamily: "Arial Black,Arial,sans-serif", color: "#111111", fontWeight: 900, textAlign: "center", letterSpacing: 2 }),
            sh(`rule-${idx}`, 80, 136, W - 160, 2, "#111111"),
            tx(`sub-${idx}`, note || "SIGNATURE MENU", 60, 150, W - 120, 26, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#555", textAlign: "center", letterSpacing: 4 }),
            ml(`ml-${idx}`, m, "premium-two-col", 50, 192, W - 100, H - 290, { fontFamily: "Arial,sans-serif", color: "#111111", accentColor: "#111111", mutedColor: "#555", sectionWeight: 700 }),
            sh(`bot-dark-${idx}`, 0, H - 60, W, 60, "#111111"),
            tx(`biz-${idx}`, bizLine, 60, H - 38, W - 120, 26, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#ffffff", textAlign: "center" }),
        ];
        // ── 51–60: Color variant repeats with layout changes ──────────────────────
        // 51. MIDNIGHT PURPLE
        case 50: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#120824"),
            sh(`purple-line-${idx}`, 0, 0, W, 5, "#9B59B6"),
            sh(`purple-line2-${idx}`, 0, H - 5, W, 5, "#9B59B6"),
            tx(`title-${idx}`, title, 60, 56, W - 120, 100, { fontSize: 66, fontFamily: "Georgia,serif", color: "#D7BDE2", fontWeight: 400, fontStyle: "italic" }),
            tx(`sub-${idx}`, "MENU", 60, 162, W - 120, 32, { fontSize: 14, fontFamily: "Arial,sans-serif", color: "#9B59B6", textAlign: "center", letterSpacing: 8 }),
            sh(`rule-${idx}`, 80, 202, W - 160, 1, "#9B59B6", 0.4),
            ml(`ml-${idx}`, m, "dark-grid", 60, 226, W - 120, H - 320, { fontFamily: "Arial,sans-serif", color: "#E8DAEF", accentColor: "#9B59B6", mutedColor: "#A0899E" }),
            tx(`biz-${idx}`, bizLine, 60, H - 46, W - 120, 30, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#9B59B6", textAlign: "center" }),
        ];
        // 52. EMERALD FINE
        case 51: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#0a1a0f"),
            sh(`em-rule-top-${idx}`, 40, 40, W - 80, 2, "#1E8449"),
            sh(`em-rule-bot-${idx}`, 40, H - 42, W - 80, 2, "#1E8449"),
            tx(`title-${idx}`, title, 60, 60, W - 120, 100, { fontSize: 64, fontFamily: "Georgia,serif", color: "#A9DFBF", fontWeight: 400 }),
            tx(`sub-${idx}`, note || "FINE DINING", 60, 166, W - 120, 30, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#1E8449", letterSpacing: 5 }),
            sh(`rule-${idx}`, 60, 204, W - 120, 1, "#1E8449", 0.4),
            ml(`ml-${idx}`, m, "stacked-luxe", 60, 226, W - 120, H - 320, { fontFamily: "Georgia,serif", color: "#D5F5E3", accentColor: "#1E8449", mutedColor: "#5a8a6a" }),
            tx(`biz-${idx}`, bizLine, 60, H - 44, W - 120, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#1E8449", textAlign: "center" }),
        ];
        // 53. COPPER & STONE
        case 52: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#2C2416"),
            sh(`cu-top-${idx}`, 0, 0, W, 6, "#B7792A"),
            sh(`cu-left-${idx}`, 0, 0, 6, H, "#B7792A"),
            sh(`cu-right-${idx}`, W - 6, 0, 6, H, "#B7792A"),
            tx(`title-${idx}`, title, 60, 50, W - 120, 96, { fontSize: 62, fontFamily: "Georgia,serif", color: "#F0DDB0", fontWeight: 700 }),
            tx(`sub-${idx}`, note || "EST. RESTAURANT", 60, 152, W - 120, 28, { fontSize: 13, fontFamily: "Arial,sans-serif", color: "#B7792A", letterSpacing: 4 }),
            sh(`rule-${idx}`, 60, 188, W - 120, 1.5, "#B7792A", 0.5),
            ml(`ml-${idx}`, m, "gold-dotted", 60, 210, W - 120, H - 300, { fontFamily: "Georgia,serif", color: "#F0DDB0", accentColor: "#B7792A", mutedColor: "#9a8060" }),
            tx(`biz-${idx}`, bizLine, 60, H - 44, W - 120, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#9a8060", textAlign: "center" }),
        ];
        // 54. ROSE GOLD LUXE
        case 53: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#1a1215"),
            sh(`rose-top-${idx}`, 0, 0, W, 5, "#C9748A"),
            sh(`rose-bot-${idx}`, 0, H - 5, W, 5, "#C9748A"),
            tx(`title-${idx}`, title, 60, 58, W - 120, 100, { fontSize: 64, fontFamily: "Georgia,serif", color: "#F4B8C4", fontWeight: 400, fontStyle: "italic" }),
            tx(`sub-${idx}`, "MENU", 60, 164, W - 120, 30, { fontSize: 14, fontFamily: "Arial,sans-serif", color: "#C9748A", textAlign: "center", letterSpacing: 8 }),
            sh(`rule-${idx}`, 80, 202, W - 160, 1, "#C9748A", 0.4),
            ml(`ml-${idx}`, m, "centered-elegant", 80, 226, W - 160, H - 310, { fontFamily: "Georgia,serif", color: "#F4E0E4", accentColor: "#C9748A", mutedColor: "#A07888" }),
            tx(`biz-${idx}`, bizLine, 60, H - 44, W - 120, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#C9748A", textAlign: "center" }),
        ];
        // 55. STEEL BLUE MODERN
        case 54: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#0D1B2A"),
            sh(`steel-top-${idx}`, 0, 0, W, 5, "#2E86AB"),
            tx(`title-${idx}`, title.toUpperCase(), 60, 46, W - 120, 100, { fontSize: 60, fontFamily: "Arial Black,Arial,sans-serif", color: "#A8DADC", fontWeight: 900, letterSpacing: 2 }),
            sh(`rule-${idx}`, 60, 152, W - 120, 2, "#2E86AB"),
            tx(`sub-${idx}`, note || "SIGNATURE DISHES", 60, 166, W - 120, 28, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#2E86AB", letterSpacing: 4 }),
            ml(`ml-${idx}`, m, "dark-grid", 60, 210, W - 120, H - 300, { fontFamily: "Arial,sans-serif", color: "#A8DADC", accentColor: "#2E86AB", mutedColor: "#5a8a9a" }),
            sh(`steel-bot-${idx}`, 0, H - 60, W, 60, "#050E18"),
            tx(`biz-${idx}`, bizLine, 60, H - 38, W - 120, 26, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#2E86AB", textAlign: "center" }),
        ];
        // 56. TERRACOTTA SPANISH
        case 55: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#F5EDD8"),
            sh(`terra-band-${idx}`, 0, 0, W, 220, "#B55A30"),
            tx(`title-${idx}`, title, 60, 36, W - 120, 120, { fontSize: 72, fontFamily: "Georgia,serif", color: "#ffffff", fontWeight: 700, fontStyle: "italic" }),
            tx(`sub-${idx}`, note || "RESTAURANTE", 60, 162, W - 120, 36, { fontSize: 16, fontFamily: "Arial,sans-serif", color: "#f0d0b0", textAlign: "center", letterSpacing: 5 }),
            ml(`ml-${idx}`, m, "two-column", 50, 242, W - 100, H - 330, { fontFamily: "Georgia,serif", color: "#1a0a00", accentColor: "#B55A30", mutedColor: "#7a5028" }),
            sh(`terra-bot-${idx}`, 0, H - 60, W, 60, "#B55A30"),
            tx(`biz-${idx}`, bizLine, 60, H - 38, W - 120, 26, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#ffffff", textAlign: "center" }),
        ];
        // 57. PLATED FINE (big title, left column food images area, fine dining)
        case 56: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#FFFFFF"),
            sh(`left-img-${idx}`, 0, 0, 120, H, "#f0ece4"),
            tx(`title-${idx}`, "PLATED.", 150, 34, W - 190, 80, { fontSize: 60, fontFamily: "Arial Black,Arial,sans-serif", color: "#111111", fontWeight: 900 }),
            sh(`rule-${idx}`, 150, 120, W - 190, 2, "#111111"),
            tx(`sub-${idx}`, note || "STARTERS · MAINS · DESSERTS", 150, 136, W - 190, 24, { fontSize: 10, fontFamily: "Arial,sans-serif", color: "#555", letterSpacing: 4 }),
            ml(`ml-${idx}`, m, "gold-dotted", 150, 178, W - 190, H - 260, { fontFamily: "'Helvetica Neue',Arial,sans-serif", color: "#111111", accentColor: "#8B6914", mutedColor: "#666" }),
            sh(`bot-rule-${idx}`, 150, H - 60, W - 190, 1, "#111111"),
            tx(`biz-${idx}`, bizLine, 150, H - 40, W - 190, 26, { fontSize: 10, fontFamily: "Arial,sans-serif", color: "#555" }),
        ];
        // 58. GERONIMO FAMILY (warm white, script heading, casual family)
        case 57: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#FAF8F4"),
            sh(`accent-left-${idx}`, 0, 200, 6, H - 200, "#C0392B"),
            tx(`title-main-${idx}`, title + "'s", 60, 36, W - 120, 110, { fontSize: 72, fontFamily: "Georgia,serif", color: "#111111", fontWeight: 700, fontStyle: "italic" }),
            tx(`title-sub-${idx}`, "family dining", 60, 150, W - 120, 48, { fontSize: 28, fontFamily: "Georgia,serif", color: "#555", fontStyle: "italic" }),
            sh(`rule-${idx}`, 60, 206, W - 120, 1, "#C0392B", 0.5),
            ml(`ml-${idx}`, m, "two-column", 60, 226, W - 120, H - 320, { fontFamily: "Georgia,serif", color: "#111111", accentColor: "#C0392B", mutedColor: "#666" }),
            sh(`bot-rule-${idx}`, 60, H - 64, W - 120, 1, "#555", 0.3),
            tx(`biz-${idx}`, bizLine, 60, H - 42, W - 120, 28, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#555", textAlign: "center" }),
        ];
        // 59. CREAM SCRIPT BAKERY (full cream, bakery/cafe feel)
        case 58: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#FDF9F0"),
            sh(`top-brown-${idx}`, 0, 0, W, 10, "#6B3A2A"),
            tx(`title-script-${idx}`, title, 60, 34, W - 120, 90, { fontSize: 58, fontFamily: "Georgia,serif", color: "#6B3A2A", fontWeight: 700, fontStyle: "italic", textAlign: "center" }),
            tx(`tagline-${idx}`, note || "FRESH · DAILY · LOCAL", 60, 130, W - 120, 26, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#A07050", textAlign: "center", letterSpacing: 4 }),
            sh(`rule-${idx}`, 100, 164, W - 200, 1, "#A07050", 0.4),
            ml(`ml-${idx}`, m, "minimal-lines", 80, 188, W - 160, H - 280, { fontFamily: "Georgia,serif", color: "#2a1a0e", accentColor: "#6B3A2A", mutedColor: "#A07050" }),
            sh(`bot-brown-${idx}`, 0, H - 60, W, 60, "#6B3A2A"),
            tx(`biz-${idx}`, bizLine, 60, H - 38, W - 120, 26, { fontSize: 11, fontFamily: "Arial,sans-serif", color: "#ffffff", textAlign: "center" }),
        ];
        // 60. RESTAURANT MENU HORIZONTAL (3-col grid, ultra dense)
        default: return [
            sh(`bg-${idx}`, 0, 0, W, H, "#111111"),
            sh(`top-bar-${idx}`, 0, 0, W, 150, "#0a0a0a"),
            tx(`title-${idx}`, title, 60, 26, W - 120, 76, { fontSize: 54, fontFamily: "Arial Black,Arial,sans-serif", color: "#ffffff", fontWeight: 900, textAlign: "center" }),
            tx(`sub-${idx}`, "RESTAURANT  MENU", 60, 108, W - 120, 30, { fontSize: 14, fontFamily: "Arial,sans-serif", color: "#C9A24D", textAlign: "center", letterSpacing: 6 }),
            sh(`rule-${idx}`, 40, 148, W - 80, 2, "#C9A24D", 0.6),
            ml(`ml-${idx}`, m, "two-column", 40, 168, W - 80, H - 260, { fontFamily: "Arial,sans-serif", color: "#f0f0f0", accentColor: "#C9A24D", mutedColor: "#888", sectionWeight: 600 }),
            sh(`bot-bar-${idx}`, 0, H - 70, W, 70, "#0a0a0a"),
            tx(`biz-${idx}`, bizLine || note, 40, H - 44, W - 80, 28, { fontSize: 12, fontFamily: "Arial,sans-serif", color: "#C9A24D", textAlign: "center" }),
        ];
    }
}
const _LABELS60 = [
    "Dark Food Board", "Gold Leaders", "Dark Boxes", "Aroma Special", "Moody Dark",
    "India Vertical", "Green Split", "Red Bold", "Cream Bistro", "Minimal White",
    "Dark Luxe", "Teal Royal", "Classic Brasserie", "Premium Slate", "Neon Electric",
    "Print Classic", "Rustic Kraft", "Kampung Style", "Dark Brush", "Deep Navy",
    "Bold Yellow", "Maroon Special", "White Orange", "Dockside", "Wild Sage",
    "BBQ Smoke", "Family Favorites", "Bistro White", "Black Gold", "Magazine Style",
    // 31-60
    "Middle Eastern", "Harborlight Cafe", "LJ Diner", "Koi Restaurant", "Halong Bay",
    "Timeout Tavern", "Porky BBQ", "Catering Olive", "Irish Pub", "Indian Curry",
    "Coffee Shop Dark", "Wing Combos", "Fire Sandwiches", "Biryani Script", "Dinner Provisions",
    "Wine List", "Boozy Brunch", "Amigos Mexican", "West Coast Pizza", "Neighborhood Dinner",
    "Midnight Purple", "Emerald Fine", "Copper Stone", "Rose Gold Luxe", "Steel Blue",
    "Terracotta Spanish", "Plated Fine", "Geronimo Family", "Cream Bakery", "Classic Black Gold"
];
const _CATS60 = [
    "dark", "luxury", "restaurant", "restaurant", "dark", "modern", "modern", "restaurant", "elegant", "minimal",
    "luxury", "luxury", "classic", "premium", "dark", "print", "classic", "restaurant", "dark", "luxury",
    "restaurant", "restaurant", "modern", "restaurant", "minimal", "restaurant", "restaurant", "classic", "luxury", "modern",
    "restaurant", "modern", "classic", "luxury", "restaurant", "dark", "restaurant", "elegant", "dark", "restaurant",
    "dark", "restaurant", "restaurant", "restaurant", "modern", "elegant", "modern", "restaurant", "modern", "modern",
    "luxury", "luxury", "luxury", "luxury", "modern", "restaurant", "classic", "restaurant", "classic", "dark"
];
// Override the export — patch at module level
// ── Estimate how many items fit in available canvas height ────────────────────
function estimateItemsPerPage(sections) {
    // Each item row: ~26px, description: ~18px extra, section header: ~46px
    let totalH = 0;
    for (const sec of sections) {
        totalH += 46; // section header
        for (const item of sec.items) {
            totalH += item.description ? 44 : 26;
        }
        totalH += 20; // section gap
    }
    return totalH;
}
// ── Split sections across pages ───────────────────────────────────────────────
function splitIntoPages(sections, availableH, twoCol) {
    if (!sections.length)
        return [[]];
    // Realistic per-item heights matching MenuPreview CSS:
    // section header ~44px, item name ~22px, description ~18px, section gap ~16px
    function secHeight(sec) {
        const itemsH = sec.items.reduce((a, it) => a + (it.description ? 40 : 22), 0);
        return 44 + itemsH + 16;
    }
    // Two-column layouts alternate sections left/right — effective capacity is 1.8x
    // but still capped by actual page height. 0.88 safety factor avoids edge clipping.
    const capacity = twoCol
        ? availableH * 1.8 * 0.88
        : availableH * 0.88;
    const pages = [];
    let page = [];
    let used = 0;
    for (const sec of sections) {
        const h = secHeight(sec);
        if (used + h > capacity && page.length > 0) {
            pages.push(page);
            page = [sec];
            used = h;
        }
        else {
            page.push(sec);
            used += h;
        }
    }
    if (page.length > 0)
        pages.push(page);
    return pages.length > 0 ? pages : [sections];
}
// ── Build page background colour from template elements ───────────────────────
function getBgColor(elements) {
    const bg = elements.find(e => e.type === "shape" && e.x === 0 && e.y === 0);
    return bg?.color ?? "#111111";
}
export function generateDesignBatch60(projectId, menu, startIndex, count = 10) {
    return Array.from({ length: count }, (_, offset) => {
        const designIndex = startIndex + offset;
        const tplId = (designIndex - 1) % 60;
        const batchNumber = Math.ceil(designIndex / 10);
        const sections = menu.sections ?? [];
        // Build a dummy version first with ALL sections just to detect template chrome & layout
        const dummyElements = tplId < 30
            ? buildElements(tplId, menu, designIndex)
            : buildElements2(tplId, menu, designIndex);
        const bgColor = getBgColor(dummyElements);
        // Detect layout type from the menu-list element
        const twoColLayouts = ["two-column", "stacked-luxe", "classic-two-col", "premium-two-col", "dark-grid", "print-cols", "gold-dotted", "corporate-grid", "cards"];
        const mlEl = dummyElements.find(e => e.type === "menu-list");
        const isTwoCol = mlEl ? twoColLayouts.includes(mlEl.layout) : true;
        // Available height for menu content
        const mlH = mlEl ? mlEl.height : H - 300;
        const availableH = mlH;
        // Split sections into pages — each page gets UNIQUE sections only
        const sectionPages = splitIntoPages(sections, availableH, isTwoCol);
        const totalPages = sectionPages.length;
        // Build each page's elements with ONLY that page's sections
        const pages = sectionPages.map((pageSections, pi) => {
            // Create a menu object with ONLY this page's sections
            const pageMenu = { ...menu, sections: pageSections };
            let els;
            if (pi === 0) {
                // Page 1: build template with ONLY page 1 sections (not all sections)
                els = tplId < 30
                    ? buildElements(tplId, pageMenu, designIndex)
                    : buildElements2(tplId, pageMenu, designIndex);
            }
            else {
                // Continuation pages: simplified — same bg, page number header, menu list, footer
                const contAccent = mlEl?.accentColor ?? "#C9A24D";
                const contColor = mlEl?.color ?? "#ffffff";
                const contFont = mlEl?.fontFamily ?? "Arial,sans-serif";
                const contLayout = mlEl?.layout ?? "two-column";
                els = [
                    // Background
                    sh(`bg-p${pi}-${designIndex}`, 0, 0, W, H, bgColor),
                    // Page header bar (same style as original)
                    sh(`ph-${pi}-${designIndex}`, 0, 0, W, 80, bgColor === "#ffffff" || bgColor === "#FFFFFF" || bgColor === "#FBFBFA" || bgColor === "#fafaf8" || bgColor === "#FAFAFA" ? "#f0ece4" : "#00000044"),
                    // Restaurant name (continuation)
                    tx(`cont-name-${pi}-${designIndex}`, `${menu.restaurantName ?? "Menu"} — continued`, 60, 20, W - 120, 44, {
                        fontSize: 22, fontFamily: contFont, color: contColor === "#ffffff" || contColor === "#f0f0f0" ? contAccent : contColor,
                        fontWeight: 600
                    }),
                    // Page number
                    tx(`cont-pg-${pi}-${designIndex}`, `Page ${pi + 1} of ${totalPages}`, W - 200, 22, 160, 36, {
                        fontSize: 13, fontFamily: contFont,
                        color: contAccent, textAlign: "right"
                    }),
                    // Divider
                    sh(`cont-rule-${pi}-${designIndex}`, 60, 74, W - 120, 1, contAccent, 0.4),
                    // Menu list — only this page's sections
                    {
                        id: `ml-p${pi}-${designIndex}`,
                        type: "menu-list",
                        sections: pageSections,
                        currency: menu.currency ?? "INR",
                        layout: contLayout,
                        x: mlEl ? mlEl.x : 60,
                        y: 94,
                        width: mlEl ? mlEl.width : W - 120,
                        height: H - 180,
                        fontFamily: contFont,
                        color: contColor,
                        accentColor: contAccent,
                        mutedColor: mlEl?.mutedColor ?? "#888888",
                        sectionWeight: mlEl?.sectionWeight ?? 600
                    },
                    // Footer
                    sh(`cont-fline-${pi}-${designIndex}`, 60, H - 56, W - 120, 1, contAccent, 0.3),
                    tx(`cont-biz-${pi}-${designIndex}`, [menu.businessDetails?.address, menu.businessDetails?.phone, menu.businessDetails?.website].filter(Boolean).join("  ·  ") || menu.businessDetails?.serviceNote || "", 60, H - 38, W - 120, 28, { fontSize: 12, fontFamily: contFont, color: contAccent, textAlign: "center" })
                ];
            }
            return {
                pageIndex: pi,
                background: bgColor,
                elements: els
            };
        });
        // For backward compatibility, elements = page 1 elements
        // pages array has all pages
        return {
            projectId,
            templateId: `tpl-${tplId}-${String(designIndex).padStart(3, "0")}`,
            batchNumber, designIndex,
            category: _CATS60[tplId] ?? "restaurant",
            label: _LABELS60[tplId] ?? `Template ${tplId + 1}`,
            status: "draft", thumbnailUrl: "",
            canvasState: {
                version: 2,
                templateId: String(tplId),
                label: _LABELS60[tplId] ?? `Template ${tplId + 1}`,
                category: _CATS60[tplId] ?? "restaurant",
                page: { width: W, height: H, background: bgColor },
                totalPages,
                styles: {
                    brand: { logo: menu.logo, colors: menu.brandColors, style: menu.style, businessDetails: menu.businessDetails }
                },
                // page 1 elements (backward compat)
                elements: pages[0]?.elements ?? [],
                // All pages
                pages
            }
        };
    });
}
