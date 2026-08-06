/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article.
 * Base block: cards (container). Model: article-card { image (reference), text (richtext) }.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-08-05
 *
 * Container block: each `a.article-card` = one row of 2 cells.
 *   - Cell 1: field:image -> the card image (imageAlt collapsed into alt attr).
 *   - Cell 2: field:text  -> richtext (tag, date, heading). The card link href
 *     is preserved by keeping the heading as a link so the CTA/target survives.
 */
export default function parse(element, { document }) {
  const cardEls = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > .article-card'));

  if (!cardEls.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cardEls.forEach((card) => {
    const href = card.getAttribute('href');
    const img = card.querySelector('.article-card-image img, img');

    // --- Image cell ---
    const imageCell = document.createDocumentFragment();
    if (img) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }

    // --- Text cell: meta (tag + date) and heading, with a linked heading so
    // the article target is preserved. ---
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    const body = card.querySelector('.article-card-body');
    const meta = card.querySelector('.article-card-meta');
    if (meta) textCell.appendChild(meta);

    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    if (heading) {
      if (href) {
        // Wrap the heading text in a link to preserve the card's destination.
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
        // Preserve heading level by nesting the link inside the heading tag.
        const h = document.createElement(heading.tagName.toLowerCase());
        h.appendChild(link);
        textCell.appendChild(h);
      } else {
        textCell.appendChild(heading);
      }
    } else if (body) {
      // Fallback: append remaining body content.
      Array.from(body.children).forEach((n) => {
        if (n !== meta) textCell.appendChild(n);
      });
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
