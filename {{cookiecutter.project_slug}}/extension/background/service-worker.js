import { DEFAULT_SETTINGS, MESSAGE_TYPES } from "../shared/constants.js";
import { getSettings } from "../shared/chrome-api.js";

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  const current = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  await chrome.storage.sync.set({ ...DEFAULT_SETTINGS, ...current });

  if (reason === "install") {
    await chrome.action.setBadgeBackgroundColor({ color: DEFAULT_SETTINGS.highlightColor });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status !== "complete") return;

  const settings = await getSettings();
  if (!settings.showBadge) {
    await chrome.action.setBadgeText({ tabId, text: "" });
    return;
  }

  await chrome.action.setBadgeText({ tabId, text: "ON" });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then(sendResponse)
    .catch((error) => sendResponse({ ok: false, error: error.message }));
  return true;
});

async function handleMessage(message, sender) {
  switch (message?.type) {
    case MESSAGE_TYPES.GET_TAB_SUMMARY:
      return {
        ok: true,
        tabId: sender.tab?.id ?? null,
        title: sender.tab?.title ?? "",
        url: sender.tab?.url ?? ""
      };
    case MESSAGE_TYPES.SETTINGS_UPDATED:
      await chrome.action.setBadgeBackgroundColor({ color: message.settings.highlightColor });
      return { ok: true };
    default:
      return { ok: false, error: "Unknown message type" };
  }
}
