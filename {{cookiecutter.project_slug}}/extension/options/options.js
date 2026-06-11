import { MESSAGE_TYPES } from "../shared/constants.js";
import { getSettings, saveSettings } from "../shared/chrome-api.js";

const form = document.querySelector("#options-form");
const showBadge = document.querySelector("#show-badge");
const notificationStyle = document.querySelector("#notification-style");
const highlightColor = document.querySelector("#highlight-color");
const saveStatus = document.querySelector("#save-status");

loadSettings();

async function loadSettings() {
  const settings = await getSettings();
  showBadge.checked = Boolean(settings.showBadge);
  notificationStyle.value = settings.notificationStyle;
  highlightColor.value = settings.highlightColor;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const settings = await saveSettings({
    showBadge: showBadge.checked,
    notificationStyle: notificationStyle.value,
    highlightColor: highlightColor.value
  });

  await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.SETTINGS_UPDATED,
    settings
  });

  saveStatus.textContent = "Settings saved.";
  window.setTimeout(() => {
    saveStatus.textContent = "";
  }, 2200);
});
