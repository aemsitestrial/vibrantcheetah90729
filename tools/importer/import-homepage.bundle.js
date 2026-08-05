/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/columns-feature.js
  function parse(element, { document }) {
    const columnDivs = Array.from(element.querySelectorAll(":scope > div"));
    if (!columnDivs.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const row = columnDivs.map((col) => {
      const nodes = Array.from(col.children);
      return nodes.length ? nodes : [col];
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse2(element, { document }) {
    const items = Array.from(element.querySelectorAll(":scope > div"));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img");
      if (!img) return;
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(img);
      cells.push([imageCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse3(element, { document }) {
    const panes = Array.from(element.querySelectorAll(".tabs-content > .tab-pane"));
    const menuLinks = Array.from(element.querySelectorAll(".tab-menu > .tab-menu-link"));
    if (!panes.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    panes.forEach((pane, i) => {
      const menuLink = menuLinks[i];
      const labelCell = document.createDocumentFragment();
      labelCell.appendChild(document.createComment(" field:label "));
      let labelText = "";
      if (menuLink) {
        const nameEl = menuLink.querySelector(".paragraph-sm strong, strong");
        labelText = (nameEl ? nameEl.textContent : menuLink.textContent) || "";
        labelText = labelText.replace(/\s+/g, " ").trim();
      }
      labelCell.appendChild(document.createTextNode(labelText || `Tab ${i + 1}`));
      const contentCell = document.createDocumentFragment();
      const img = pane.querySelector("img");
      if (img) {
        contentCell.appendChild(document.createComment(" field:image "));
        contentCell.appendChild(img);
      }
      contentCell.appendChild(document.createComment(" field:text "));
      const textNodes = [];
      const infoBlock = pane.querySelector(".grid-layout > div:last-child");
      if (infoBlock && !infoBlock.querySelector("img")) {
        Array.from(infoBlock.children).forEach((n) => textNodes.push(n));
      }
      if (!textNodes.length) {
        pane.querySelectorAll("p, .paragraph-xl").forEach((n) => textNodes.push(n));
      }
      textNodes.forEach((n) => contentCell.appendChild(n));
      cells.push([labelCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse4(element, { document }) {
    const cardEls = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > .article-card"));
    if (!cardEls.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cardEls.forEach((card) => {
      const href = card.getAttribute("href");
      const img = card.querySelector(".article-card-image img, img");
      const imageCell = document.createDocumentFragment();
      if (img) {
        imageCell.appendChild(document.createComment(" field:image "));
        imageCell.appendChild(img);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      const body = card.querySelector(".article-card-body");
      const meta = card.querySelector(".article-card-meta");
      if (meta) textCell.appendChild(meta);
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (heading) {
        if (href) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = heading.textContent.replace(/\s+/g, " ").trim();
          const h = document.createElement(heading.tagName.toLowerCase());
          h.appendChild(link);
          textCell.appendChild(h);
        } else {
          textCell.appendChild(heading);
        }
      } else if (body) {
        Array.from(body.children).forEach((n) => {
          if (n !== meta) textCell.appendChild(n);
        });
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document }) {
    const items = Array.from(element.querySelectorAll(":scope > details.faq-item, :scope > .faq-item, details.faq-item"));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const labelCell = document.createDocumentFragment();
      labelCell.appendChild(document.createComment(" field:label "));
      const summary = item.querySelector(".faq-question, summary");
      const questionText = (summary ? summary.textContent : "").replace(/\s+/g, " ").trim();
      const qp = document.createElement("p");
      qp.textContent = questionText;
      labelCell.appendChild(qp);
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      const answer = item.querySelector(".faq-answer");
      if (answer) {
        Array.from(answer.childNodes).forEach((n) => textCell.appendChild(n.cloneNode(true)));
      }
      cells.push([labelCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse6(element, { document }) {
    const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
    const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
    const ctas = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const bgImage = element.querySelector("img");
    if (!heading && !subheading && !ctas.length && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(bgImage);
      cells.push([imageCell]);
    }
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) textCell.appendChild(heading);
    if (subheading) textCell.appendChild(subheading);
    ctas.forEach((cta) => textCell.appendChild(cta));
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".breadcrumbs"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".navbar",
        "footer.footer",
        "a.skip-link"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && template.sections;
    if (!sections || sections.length < 2) return;
    const doc = element.ownerDocument;
    const findSectionEl = (section) => {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      for (const sel of selectors) {
        if (!sel) continue;
        const found = element.querySelector(sel);
        if (found) return found;
      }
      return null;
    };
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = findSectionEl(section);
      if (!sectionEl) continue;
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.append(metaBlock);
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND Trendsetters homepage - fashion/lifestyle landing page with hero feature, story feature, image gallery, testimonial tabs, article cards, FAQ accordion, and closing overlay hero",
    urls: [
      "https://wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "columns-feature",
        instances: [
          "#main-content > header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl",
          "#main-content > section.section:nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg"
        ]
      },
      {
        name: "cards-gallery",
        instances: [
          "#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.grid-gap-sm"
        ]
      },
      {
        name: "tabs-testimonial",
        instances: [
          "#main-content > section.section:nth-of-type(3) .tabs-wrapper"
        ]
      },
      {
        name: "cards-article",
        instances: [
          "#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.grid-gap-md"
        ]
      },
      {
        name: "accordion-faq",
        instances: [
          "#main-content > section.section:nth-of-type(5) .faq-list"
        ]
      },
      {
        name: "hero-overlay",
        instances: [
          "#main-content > section.section.inverse-section .grid-layout.desktop-1-column"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero feature",
        selector: ["#main-content > header.section.secondary-section"],
        style: "secondary",
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Story feature",
        selector: ["#main-content > section.section:nth-of-type(1)"],
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Image gallery",
        selector: ["#main-content > section.section.secondary-section:nth-of-type(2)"],
        style: "secondary",
        blocks: ["cards-gallery"],
        defaultContent: [
          "#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem"
        ]
      },
      {
        id: "section-4",
        name: "Testimonials",
        selector: ["#main-content > section.section:nth-of-type(3)"],
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Latest articles",
        selector: ["#main-content > section.section.secondary-section:nth-of-type(4)"],
        style: "secondary",
        blocks: ["cards-article"],
        defaultContent: [
          "#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center"
        ]
      },
      {
        id: "section-6",
        name: "FAQ",
        selector: ["#main-content > section.section:nth-of-type(5)"],
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [
          "#main-content > section.section:nth-of-type(5) .grid-layout.tablet-1-column.grid-gap-xxl > div:nth-of-type(1)"
        ]
      },
      {
        id: "section-7",
        name: "Closing overlay hero",
        selector: ["#main-content > section.section.inverse-section"],
        style: null,
        blocks: ["hero-overlay"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "columns-feature": parse,
    "cards-gallery": parse2,
    "tabs-testimonial": parse3,
    "cards-article": parse4,
    "accordion-faq": parse5,
    "hero-overlay": parse6
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index";
      const path = WebImporter.FileUtils.sanitizePath(rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
