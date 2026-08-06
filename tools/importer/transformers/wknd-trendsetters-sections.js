/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters section handling.
 *
 * The homepage template defines 7 sections (see tools/importer/page-templates.json).
 * For each section it:
 *   - inserts a section break (<hr>) before the section, except the first;
 *   - appends a "Section Metadata" block (style) for sections that define a style.
 *
 * Section selectors are taken directly from payload.template.sections, which
 * were captured from the DOM in migration-work/cleaned.html. Nothing is guessed.
 *
 * Runs in afterTransform only (block parsing happens between the hooks).
 *
 * Expected on the homepage template:
 *   - 6 <hr> section breaks (7 sections - 1)
 *   - 3 Section Metadata blocks (sections 1, 3, 5 have style "secondary")
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && template.sections;
  if (!sections || sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve the first matching DOM element for a section's selector(s).
  const findSectionEl = (section) => {
    const selectors = Array.isArray(section.selector)
      ? section.selector
      : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      const found = element.querySelector(sel);
      if (found) return found;
    }
    return null;
  };

  // Process sections in reverse so DOM insertions do not shift the positions
  // of sections not yet processed.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const sectionEl = findSectionEl(section);
    if (!sectionEl) continue;

    // Section Metadata block for sections that define a style.
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      // Append the metadata block at the end of the section it describes.
      sectionEl.append(metaBlock);
    }

    // Section break before every section except the first.
    if (i > 0) {
      const hr = doc.createElement('hr');
      sectionEl.parentNode.insertBefore(hr, sectionEl);
    }
  }
}
