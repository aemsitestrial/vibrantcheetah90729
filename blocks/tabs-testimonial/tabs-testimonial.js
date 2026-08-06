// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  // build tablist (rendered below the active panel)
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children];
  rows.forEach((row, i) => {
    // Cells: label | image | text (three columns, one per model field).
    const cellEls = [...row.children];
    const label = cellEls[0]; // label cell (name)
    // Image cell = the one containing a picture; text cell = the remaining one.
    const imageCell = cellEls.find((c) => c.querySelector('picture, img'));
    const textCell = cellEls.slice(1).find((c) => c !== imageCell) || cellEls[cellEls.length - 1];
    const id = toClassName(label.textContent);

    // --- decorate the row as a tabpanel ---
    row.className = 'tabs-testimonial-panel';
    row.id = `tabpanel-${id}`;
    row.setAttribute('aria-hidden', !!i);
    row.setAttribute('aria-labelledby', `tab-${id}`);
    row.setAttribute('role', 'tabpanel');

    // restructure into a portrait column + a quote column
    const pic = imageCell ? imageCell.querySelector('picture') : null;
    const picP = pic ? (pic.closest('p') || pic) : null;

    const portrait = document.createElement('div');
    portrait.className = 'tabs-testimonial-portrait';
    if (picP) portrait.append(picP);

    const quote = document.createElement('div');
    quote.className = 'tabs-testimonial-quote';
    if (textCell) [...textCell.children].forEach((child) => quote.append(child));

    // clear original cells, then append a grid wrapper holding the two columns
    // (CSS targets `.tabs-testimonial-panel > div` as the 2-column grid)
    cellEls.forEach((c) => c.remove());
    const grid = document.createElement('div');
    grid.append(portrait, quote);
    row.append(grid);

    // extract the name + role used for the avatar chip
    const nameEl = quote.querySelector('strong');
    const name = nameEl ? nameEl.textContent : label.textContent;
    const namePara = nameEl ? nameEl.closest('p') : null;
    const otherParas = [...quote.querySelectorAll('p')].filter((p) => p !== namePara);
    const role = otherParas.length > 1 ? otherParas[0].textContent : '';

    // --- build the tab button (avatar chip) ---
    const button = document.createElement('button');
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${id}`;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    if (pic) {
      const avatar = document.createElement('span');
      avatar.className = 'avatar';
      const avatarPic = pic.cloneNode(true);
      // avatar is decorative in the chip (name/role are shown as text), so
      // clear alt text to avoid the name being announced twice by screen readers
      avatarPic.querySelectorAll('img').forEach((img) => img.setAttribute('alt', ''));
      avatar.append(avatarPic);
      button.append(avatar);
    }

    const info = document.createElement('span');
    info.className = 'tabs-testimonial-tab-text';
    const nameNode = document.createElement('strong');
    nameNode.textContent = name;
    info.append(nameNode);
    if (role) {
      const roleNode = document.createElement('span');
      roleNode.textContent = role;
      info.append(roleNode);
    }
    button.append(info);

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      row.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.append(button);
    label.remove();
  });

  block.append(tablist);
}
