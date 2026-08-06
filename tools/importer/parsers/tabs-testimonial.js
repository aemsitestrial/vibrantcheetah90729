/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial.
 * Base block: tabs (container). Model: tab { label (text), image (reference), text (richtext) }.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-08-05
 *
 * Container block: each tab = one row.
 *   - Cell 1 (tab label):   field:label   -> the tab menu link text.
 *   - Cell 2 (tab content): field:image + field:text -> testimonial image and richtext.
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

    // --- Content cell: image (reference) + testimonial richtext. ---
    const contentCell = document.createDocumentFragment();

    const img = pane.querySelector('img');
    if (img) {
      contentCell.appendChild(document.createComment(' field:image '));
      contentCell.appendChild(img);
    }

    // Text: name/role block + quote paragraph. Gather the second column's content.
    contentCell.appendChild(document.createComment(' field:text '));
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
    textNodes.forEach((n) => contentCell.appendChild(n));

    cells.push([labelCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
