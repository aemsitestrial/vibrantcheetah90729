/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature.
 * Base block: columns (core/franklin/components/columns).
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-08-05
 *
 * Columns block: per xwalk field-hinting rules, Columns blocks contain ONLY
 * default content and must NOT include field-hint comments. Structure is a
 * single content row whose cells become columns (this instance = 2 columns:
 * a text column and an image column).
 */
export default function parse(element, { document }) {
  // Each direct child <div> of the grid layout is one column.
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard.
  if (!columnDivs.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Build one content row; each column cell holds that column's child elements.
  const row = columnDivs.map((col) => {
    const nodes = Array.from(col.children);
    return nodes.length ? nodes : [col];
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
