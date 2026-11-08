(() => {
  "use strict";

  const api = globalThis.browser ?? globalThis.chrome;
  const PDF_PATH = /\.pdf$/i;
  const PDF_PARAM = /^(?:application\/pdf|pdf)$/i;

  let enabled = true;

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
    if (!enabled) {
      pending.clear();
      return;
    }
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
    if (!enabled) return;
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

  // Alt+clic en un enlace a PDF: descargar de verdad
  document.addEventListener(
    "click",
    (event) => {
      if (!enabled || !event.altKey) return;
      const link = event.target?.closest?.("a[href]");
      if (!link || !isPdfUrl(link.href)) return;
      event.preventDefault();
      event.stopPropagation();
      api.runtime.sendMessage({ type: "download", url: link.href });
    },
    true
  );

  function start() {
    if (enabled) scan(document.documentElement);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["download", "href"],
    });
  }

  // Estado activado/pausado (se lee al cargar y se actualiza en vivo)
  api.storage.local.get("enabled").then((res) => {
    enabled = res.enabled !== false;
    if (enabled && document.documentElement) scan(document.documentElement);
  });

  api.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.enabled) {
      enabled = changes.enabled.newValue !== false;
    }
  });

  if (document.documentElement) {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  }
})();