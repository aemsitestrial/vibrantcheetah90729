/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroOverlayParser from './parsers/hero-overlay.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'WKND Trendsetters homepage - fashion/lifestyle landing page with hero feature, story feature, image gallery, testimonial tabs, article cards, FAQ accordion, and closing overlay hero',
  urls: [
    'https://wknd-trendsetters.site/'
  ],
  blocks: [
    {
      name: 'columns-feature',
      instances: [
        '#main-content > header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl',
        '#main-content > section.section:nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg'
      ]
    },
    {
      name: 'cards-gallery',
      instances: [
        '#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.grid-gap-sm'
      ]
    },
    {
      name: 'tabs-testimonial',
      instances: [
        '#main-content > section.section:nth-of-type(3) .tabs-wrapper'
      ]
    },
    {
      name: 'cards-article',
      instances: [
        '#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.grid-gap-md'
      ]
    },
    {
      name: 'accordion-faq',
      instances: [
        '#main-content > section.section:nth-of-type(5) .faq-list'
      ]
    },
    {
      name: 'hero-overlay',
      instances: [
        '#main-content > section.section.inverse-section .grid-layout.desktop-1-column'
      ]
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero feature',
      selector: ['#main-content > header.section.secondary-section'],
      style: 'secondary',
      blocks: ['columns-feature'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Story feature',
      selector: ['#main-content > section.section:nth-of-type(1)'],
      style: null,
      blocks: ['columns-feature'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Image gallery',
      selector: ['#main-content > section.section.secondary-section:nth-of-type(2)'],
      style: 'secondary',
      blocks: ['cards-gallery'],
      defaultContent: [
        '#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem'
      ]
    },
    {
      id: 'section-4',
      name: 'Testimonials',
      selector: ['#main-content > section.section:nth-of-type(3)'],
      style: null,
      blocks: ['tabs-testimonial'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Latest articles',
      selector: ['#main-content > section.section.secondary-section:nth-of-type(4)'],
      style: 'secondary',
      blocks: ['cards-article'],
      defaultContent: [
        '#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center'
      ]
    },
    {
      id: 'section-6',
      name: 'FAQ',
      selector: ['#main-content > section.section:nth-of-type(5)'],
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: [
        '#main-content > section.section:nth-of-type(5) .grid-layout.tablet-1-column.grid-gap-xxl > div:nth-of-type(1)'
      ]
    },
    {
      id: 'section-7',
      name: 'Closing overlay hero',
      selector: ['#main-content > section.section.inverse-section'],
      style: null,
      blocks: ['hero-overlay'],
      defaultContent: []
    }
  ]
};

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'columns-feature': columnsFeatureParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-overlay': heroOverlayParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
// Section transformer runs after cleanup (adds <hr> breaks + Section Metadata in afterTransform)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    // Root URL ("/") collapses to an empty pathname; map it to "index" so the
    // sanitizer never receives an empty string (which would trigger a
    // process.cwd() path.resolve() call unavailable in the browser context).
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html$/, '') || '/index';
    const path = WebImporter.FileUtils.sanitizePath(rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      }
    }];
  }
};
