const api = globalThis.browser ?? globalThis.chrome;
const RULESET_ID = "ruleset_1";

async function isEnabled() {
  const { enabled } = await api.storage.local.get("enabled");
  return enabled !== false;
}

async function applyState() {
  const enabled = await isEnabled();
  await api.declarativeNetRequest.updateEnabledRulesets(
    enabled
      ? { enableRulesetIds: [RULESET_ID] }
      : { disableRulesetIds: [RULESET_ID] }
  );
  await api.action.setBadgeText({ text: enabled ? "" : "OFF" });
  await api.action.setTitle({
    title: enabled ? "PreviewerPDF: activado" : "PreviewerPDF: pausado",
  });
}

api.runtime.onInstalled.addListener(applyState);
api.runtime.onStartup.addListener(applyState);

// Clic en el icono: activar / pausar
api.action.onClicked.addListener(async () => {
  const enabled = await isEnabled();
  await api.storage.local.set({ enabled: !enabled });
  await applyState();
});

// Alt+clic en un enlace a PDF: descarga real
api.runtime.onMessage.addListener((msg, sender) => {
  if (sender.id !== api.runtime.id) return;
  if (msg?.type === "download" && typeof msg.url === "string") {
    try {
      const url = new URL(msg.url);
      if (url.protocol === "http:" || url.protocol === "https:") {
        api.downloads.download({ url: url.toString() });
      }
    } catch {
      /* URL no válida: se ignora */
    }
  }
});