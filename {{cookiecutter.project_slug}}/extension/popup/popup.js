import { MESSAGE_TYPES } from "../shared/constants.js";
import { getActiveTab, getSettings, sendMessageToTab } from "../shared/chrome-api.js";

const tabStatus = document.querySelector("#tab-status");
const pageTitle = document.querySelector("#page-title");
const pageUrl = document.querySelector("#page-url");
const runAction = document.querySelector("#run-action");
const openOptions = document.querySelector("#open-options");
const message = document.querySelector("#message");

let activeTab;

init();

async function init() {
  try {
    activeTab = await getActiveTab();
    if (!activeTab?.id) throw new Error("No active tab found");

    tabStatus.textContent = "Ready";
    pageTitle.textContent = activeTab.title || "Untitled page";
    pageUrl.textContent = activeTab.url || "";
    runAction.disabled = false;
  } catch (error) {
    tabStatus.textContent = "Unavailable";
    message.textContent = error.message;
    runAction.disabled = true;
  }
}

runAction.addEventListener("click", async () => {
  if (!activeTab?.id) return;

  runAction.disabled = true;
  message.textContent = "Running...";

  try {
    const settings = await getSettings();
    await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      files: ["content/content-script.js"]
    });

    const response = await sendMessageToTab(activeTab.id, {
      type: MESSAGE_TYPES.RUN_PAGE_ACTION,
      payload: { highlightColor: settings.highlightColor }
    });

    if (!response?.ok) throw new Error(response?.error || "Content script did not respond");
    message.textContent = "Action completed on this page.";
  } catch (error) {
    message.textContent = error.message;
  } finally {
    runAction.disabled = false;
  }
});

openOptions.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
