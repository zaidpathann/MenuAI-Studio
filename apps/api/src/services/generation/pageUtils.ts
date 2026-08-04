/**
 * pageUtils.ts
 * Splits extracted menu sections across multiple pages when content is too large.
 * 
 * Strategy: Estimate how many sections fit on one page based on item count,
 * then create additional page bundles for overflow sections.
 */

type MenuItem = { name: string; description?: string; price?: number };
type Section = { name: string; description?: string; items: MenuItem[] };

/**
 * Estimate height (in canvas units) for a section in two-column layout.
 * Section header: 32px, each item: 24px (+ 18px if has description)
 */
function estimateSectionHeight(sec: Section, withDescription = true): number {
  const headerH = 48;
  const itemH = withDescription
    ? sec.items.reduce((acc, item) => acc + (item.description ? 42 : 24), 0)
    : sec.items.length * 24;
  return headerH + itemH + 24; // 24px bottom margin
}

/**
 * Split sections into pages.
 * @param sections - all menu sections
 * @param availableHeight - canvas height available for menu content (H minus header/footer)
 * @param columns - 1 or 2 (two-column layouts get more capacity)
 */
export function splitSectionsIntoPages(
  sections: Section[],
  availableHeight: number,
  columns: 1 | 2 = 2
): Section[][] {
  if (!sections.length) return [[]];

  const pages: Section[][] = [];
  let currentPage: Section[] = [];
  let currentHeight = 0;
  // In two-column, sections alternate left/right so effective height is halved
  const effectiveAvailable = columns === 2 ? availableHeight * 1.8 : availableHeight;

  for (const sec of sections) {
    const h = estimateSectionHeight(sec);
    if (currentHeight + h > effectiveAvailable && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [sec];
      currentHeight = h;
    } else {
      currentPage.push(sec);
      currentHeight += h;
    }
  }

  if (currentPage.length > 0) pages.push(currentPage);
  return pages.length > 0 ? pages : [sections];
}
