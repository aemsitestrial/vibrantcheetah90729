/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery.
 * Base block: cards (container). Model: card-gallery-item { image, imageAlt }.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-08-05
 *
 * Container block: each direct child cell of the grid is one card row.
 * xwalk model card-gallery-item has fields:
 *   - image  (reference)  -> field hint required before the <img>
 *   - imageAlt (collapsed, ends with "Alt") -> becomes the img alt attribute, NO hint
 * These are image-only cards (no text/title), so each row is a single cell
 * containing the image with a field:image hint.
 */
export default function parse(element, { document }) {
  // Each direct child <div> wraps one gallery image.
  const items = Array.from(element.querySelectorAll(':scope > div'));

  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('img');
    if (!img) return;

    // field:image hint before the image content. imageAlt is collapsed into
    // the img's alt attribute, so no separate hint/cell for it.
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(img);

    cells.push([imageCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
