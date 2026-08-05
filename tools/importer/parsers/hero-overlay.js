/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay.
 * Base block: hero (simple). Model: hero-overlay { image (reference), imageAlt (collapsed), text (richtext) }.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-08-05
 *
 * Simple block: 1 column, up to 3 rows (block name + up to 2 content rows).
 *   - Row 2: field:image -> background image (imageAlt collapsed into alt attr, no hint).
 *   - Row 3: field:text  -> heading, subheading, CTA (richtext).
 * Never more than 3 rows total. Each row is a single cell (1-column block).
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
  const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
  const ctas = Array.from(element.querySelectorAll('.button-group a, a.button'));
  const bgImage = element.querySelector('img');

  // Empty-block guard.
  if (!heading && !subheading && !ctas.length && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // --- Row 2: background image (field:image). ---
  if (bgImage) {
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(bgImage);
    cells.push([imageCell]);
  }

  // --- Row 3: text content (field:text) - heading, subheading, CTAs. ---
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading);
  if (subheading) textCell.appendChild(subheading);
  ctas.forEach((cta) => textCell.appendChild(cta));
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
