/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 *
 * All selectors below are taken from the captured DOM in
 * migration-work/cleaned.html for the WKND Trendsetters homepage.
 * Nothing here is guessed.
 *
 * Non-authorable site chrome removed:
 *  - div.navbar          site header / mega-menu navigation (line ~1)
 *  - footer.footer       site footer with social + link columns (line ~98)
 *  - a.skip-link         "Skip to main content" accessibility link (line ~1)
 *  - div.breadcrumbs     breadcrumb nav embedded in the story-feature block
 *
 * IMPORTANT: the hero feature is authored as
 *   <header class="section secondary-section"> inside #main-content,
 * so a bare `header` selector is deliberately NOT used — it would delete
 * authorable content. Only the specific `.navbar` shell is removed.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Breadcrumbs live inside the story-feature region that the
    // columns-feature parser will extract. Remove them before block parsing
    // so they are not captured into the block cells.
    // Found in captured DOM: <div class="breadcrumbs"> ... </div>
    WebImporter.DOMUtils.remove(element, ['.breadcrumbs']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (site nav shell, footer, skip link).
    WebImporter.DOMUtils.remove(element, [
      '.navbar',
      'footer.footer',
      'a.skip-link',
    ]);
  }
}
