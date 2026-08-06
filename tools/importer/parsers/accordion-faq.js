/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq.
 * Base block: accordion (container). Model: accordion-item { label (richtext = question), text (richtext = answer) }.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-08-05
 *
 * Container block: each `details.faq-item` = one row of 2 cells.
 *   - Cell 1: field:label -> the question (summary text).
 *   - Cell 2: field:text  -> the answer (.faq-answer content).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > details.faq-item, :scope > .faq-item, details.faq-item'));

  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  items.forEach((item) => {
    // --- Label cell: the question. Prefer the <summary> text. ---
    const labelCell = document.createDocumentFragment();
    labelCell.appendChild(document.createComment(' field:label '));
    const summary = item.querySelector('.faq-question, summary');
    const questionText = (summary ? summary.textContent : '').replace(/\s+/g, ' ').trim();
    const qp = document.createElement('p');
    qp.textContent = questionText;
    labelCell.appendChild(qp);

    // --- Text cell: the answer richtext. ---
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    const answer = item.querySelector('.faq-answer');
    if (answer) {
      Array.from(answer.childNodes).forEach((n) => textCell.appendChild(n.cloneNode(true)));
    }

    cells.push([labelCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
