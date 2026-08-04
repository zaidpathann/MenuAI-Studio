import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createRoot } from "react-dom/client";
import { MenuPreview } from "../components/designs/MenuPreview";
import type { Design } from "../types";

/**
 * Helper to render a MenuPreview offscreen at scale 1.0, capture it with html2canvas,
 * and return the rendered canvas element(s) for each page of the design.
 */
async function renderDesignPagesToCanvases(design: Design, container: HTMLDivElement): Promise<HTMLCanvasElement[]> {
  container.innerHTML = "";
  const rootDiv = document.createElement("div");
  rootDiv.style.width = "1080px";
  rootDiv.style.background = "#ffffff";
  container.appendChild(rootDiv);

  const root = createRoot(rootDiv);
  root.render(<MenuPreview design={design} compact={false} scaleOverride={1.0} />);

  // Allow fonts and layout to settle
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Find all page container divs inside rootDiv
  const pageNodes = Array.from(rootDiv.querySelectorAll<HTMLDivElement>("[data-menu-page]"));
  const nodesToCapture = pageNodes.length > 0 ? pageNodes : [rootDiv];

  const canvases: HTMLCanvasElement[] = [];
  for (const node of nodesToCapture) {
    const canvas = await html2canvas(node, {
      scale: 2, // Sharp high-DPI quality
      useCORS: true,
      logging: false,
      backgroundColor: null
    });
    canvases.push(canvas);
  }

  root.unmount();
  container.innerHTML = "";
  return canvases;
}

/**
 * Create or get hidden offscreen container element.
 */
function getOffscreenContainer(): HTMLDivElement {
  let container = document.getElementById("pdf-export-container") as HTMLDivElement | null;
  if (!container) {
    container = document.createElement("div");
    container.id = "pdf-export-container";
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "0px";
    container.style.zIndex = "-9999";
    container.style.overflow = "hidden";
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Export a single menu design as a PDF file.
 */
export async function exportSingleMenuPdf(design: Design, customFilename?: string): Promise<void> {
  const container = getOffscreenContainer();
  const canvases = await renderDesignPagesToCanvases(design, container);

  if (canvases.length === 0) return;

  const firstCanvas = canvases[0];
  const imgWidth = firstCanvas.width;
  const imgHeight = firstCanvas.height;

  // Use canvas dimensions to calculate PDF orientation and size (points)
  const orientation = imgWidth > imgHeight ? "landscape" : "portrait";
  const pdf = new jsPDF({
    orientation,
    unit: "pt",
    format: [imgWidth / 2, imgHeight / 2]
  });

  canvases.forEach((canvas, index) => {
    if (index > 0) {
      pdf.addPage([canvas.width / 2, canvas.height / 2], canvas.width > canvas.height ? "landscape" : "portrait");
    }
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 0, 0, pdfPageWidth, pdfPageHeight);
  });

  const filename = customFilename ?? `${(design as any).label ?? design.category ?? "Menu"}_Template_${design.designIndex}.pdf`;
  pdf.save(filename);
}

/**
 * Export multiple selected menu designs merged into a single PDF file.
 */
export async function exportMultipleMenusPdf(designs: Design[], customFilename?: string): Promise<void> {
  if (designs.length === 0) return;

  const container = getOffscreenContainer();
  let pdf: jsPDF | null = null;

  for (let dIdx = 0; dIdx < designs.length; dIdx++) {
    const design = designs[dIdx];
    const canvases = await renderDesignPagesToCanvases(design, container);

    for (let pIdx = 0; pIdx < canvases.length; pIdx++) {
      const canvas = canvases[pIdx];
      const ptW = canvas.width / 2;
      const ptH = canvas.height / 2;
      const orientation = canvas.width > canvas.height ? "landscape" : "portrait";

      if (!pdf) {
        pdf = new jsPDF({
          orientation,
          unit: "pt",
          format: [ptW, ptH]
        });
      } else {
        pdf.addPage([ptW, ptH], orientation);
      }

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, pdfPageWidth, pdfPageHeight);
    }
  }

  if (pdf) {
    const filename = customFilename ?? `Selected_Menus_${designs.length}_Designs.pdf`;
    pdf.save(filename);
  }
}
