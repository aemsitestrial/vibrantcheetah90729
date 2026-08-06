/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial.
 * Base block: tabs (container). Model: tab { label (text), image (reference), text (richtext) }.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-08-05
 *
 * Container block: each tab = one row of THREE cells, one per model field
 * (tab model: label (text), image (reference), text (richtext)). md2jcr requires
 * every field to align with its own column, so image and text are separate cells.
 *   - Cell 1 (field:label): the tab menu link text.
 *   - Cell 2 (field:image): the testimonial portrait image.
 *   - Cell 3 (field:text):  the name/role + quote richtext.
 * Source structure: `.tabs-content > .tab-pane` holds the panel content
 * (image + quote), and `.tab-menu > .tab-menu-link` holds each tab's label.
 * Panes and menu links are index-aligned via data-tab-index / data-tab-target.
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tabs-content > .tab-pane'));
  const menuLinks = Array.from(element.querySelectorAll('.tab-menu > .tab-menu-link'));

  if (!panes.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  panes.forEach((pane, i) => {
    const menuLink = menuLinks[i];

    // --- Label cell: derive a clean label from the tab menu link. ---
    // Prefer the primary name line (first paragraph-sm strong), fall back to full text.
    const labelCell = document.createDocumentFragment();
    labelCell.appendChild(document.createComment(' field:label '));
    let labelText = '';
    if (menuLink) {
      const nameEl = menuLink.querySelector('.paragraph-sm strong, strong');
      labelText = (nameEl ? nameEl.textContent : menuLink.textContent) || '';
      labelText = labelText.replace(/\s+/g, ' ').trim();
    }
    labelCell.appendChild(document.createTextNode(labelText || `Tab ${i + 1}`));

    // --- Image cell: field:image (reference) -> testimonial portrait. ---
    const imageCell = document.createDocumentFragment();
    const img = pane.querySelector('img');
    if (img) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }

    // --- Text cell: field:text (richtext) -> name/role block + quote. ---
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    // The pane's grid has two columns: [image wrapper, text wrapper]. Grab the
    // non-image column's meaningful nodes (name/role + quote), with fallbacks.
    const textNodes = [];
    const infoBlock = pane.querySelector('.grid-layout > div:last-child');
    if (infoBlock && !infoBlock.querySelector('img')) {
      Array.from(infoBlock.children).forEach((n) => textNodes.push(n));
    }
    if (!textNodes.length) {
      // Fallback: any paragraphs / non-image blocks in the pane.
      pane.querySelectorAll('p, .paragraph-xl').forEach((n) => textNodes.push(n));
    }
    textNodes.forEach((n) => textCell.appendChild(n));

    // Three cells, one per model field: label | image | text.
    cells.push([labelCell, imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
