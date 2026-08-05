import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec';
const DATE_RE = new RegExp(`\\b(?:${MONTHS})\\b.*$`);

/**
 * Split the meta paragraph ("Casual Cool May 12") into a category tag pill
 * and a secondary date span, matching the source design.
 */
function decorateMeta(body) {
  const metaP = body.querySelector('p');
  if (!metaP) return;
  const raw = metaP.textContent.trim();
  const match = raw.match(DATE_RE);
  const date = match ? match[0].trim() : '';
  const category = (match ? raw.slice(0, match.index) : raw).trim();

  const meta = document.createElement('div');
  meta.className = 'cards-article-card-meta';
  if (category) {
    const tag = document.createElement('span');
    tag.className = 'cards-article-card-tag';
    tag.textContent = category;
    meta.append(tag);
  }
  if (date) {
    const dateEl = document.createElement('span');
    dateEl.className = 'cards-article-card-date';
    dateEl.textContent = date;
    meta.append(dateEl);
  }
  metaP.replaceWith(meta);
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-article-card-image';
      } else {
        div.className = 'cards-article-card-body';
        decorateMeta(div);
      }
    });

    /* make the whole card a single link to the article */
    const link = li.querySelector('h3 a');
    if (link) {
      const anchor = document.createElement('a');
      anchor.className = 'cards-article-card-link';
      anchor.href = link.href;
      anchor.setAttribute('aria-label', link.textContent.trim());
      while (li.firstElementChild) anchor.append(li.firstElementChild);
      /* unwrap the inner heading link, keep heading text */
      link.replaceWith(...link.childNodes);
      li.append(anchor);
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
