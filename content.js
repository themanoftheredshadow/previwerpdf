(() => {
  "use strict";

  const PDF_PATH = /\.pdf$/i;
  const PDF_PARAM = /^(?:application\/pdf|pdf)$/i;

  function isPdfUrl(rawHref) {
    try {
      const url = new URL(rawHref, document.baseURI);
      if (!/^https?:$/.test(url.protocol)) return false;
      if (PDF_PATH.test(decodeURIComponent(url.pathname))) return true;
      for (const value of url.searchParams.values()) {
        if (PDF_PARAM.test(value)) return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  function processLink(link) {
    const href = link.getAttribute("href");
    if (!href || !isPdfUrl(href)) return;

    if (link.hasAttribute("download")) {
      link.removeAttribute("download");
    }

    // Moodle y otros CMS añaden forcedownload=1 a la URL del enlace
    if (/[?&]forcedownload=1/i.test(href)) {
      try {
        const url = new URL(href, document.baseURI);
        url.searchParams.delete("forcedownload");
        link.setAttribute("href", url.toString());
      } catch {
        /* URL no parseable: se deja intacta */
      }
    }
  }

  function scan(root) {
    if (!root || root.nodeType !== Node.ELEMENT_NODE) return;
    if (root.matches?.("a[href]")) processLink(root);
    root.querySelectorAll?.("a[href]").forEach(processLink);
  }

  let scheduled = false;
  const pending = new Set();

  function flush() {
    scheduled = false;
    for (const node of pending) scan(node);
    pending.clear();
  }

  function schedule(node) {
    pending.add(node);
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(flush);
    }
  }

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "childList") {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === Node.ELEMENT_NODE) schedule(n);
        });
      } else if (m.type === "attributes") {
        schedule(m.target);
      }
    }
  });

  function start() {
    scan(document.documentElement);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["download", "href"],
    });
  }

  if (document.documentElement) {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  }
})();