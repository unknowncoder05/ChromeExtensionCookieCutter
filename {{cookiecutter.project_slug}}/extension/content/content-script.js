(() => {
  const rootId = "projectmaker-extension-status";

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "RUN_PAGE_ACTION") return false;

    const result = showPageNotification(message.payload?.highlightColor);
    sendResponse({ ok: true, result });
    return true;
  });

  function showPageNotification(highlightColor = "#2563eb") {
    document.getElementById(rootId)?.remove();

    const notice = document.createElement("div");
    notice.id = rootId;
    notice.textContent = "ProjectMaker extension action completed";
    Object.assign(notice.style, {
      position: "fixed",
      top: "16px",
      right: "16px",
      zIndex: "2147483647",
      background: highlightColor,
      color: "#ffffff",
      padding: "10px 12px",
      borderRadius: "8px",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.25)",
      font: "13px/1.4 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    });

    document.documentElement.appendChild(notice);
    window.setTimeout(() => notice.remove(), 2600);

    return {
      title: document.title,
      url: window.location.href
    };
  }
})();
