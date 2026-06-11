import { DEFAULT_SETTINGS } from "./constants.js";

export function getActiveTab() {
  return chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => tab);
}

export function sendMessageToTab(tabId, message) {
  return chrome.tabs.sendMessage(tabId, message);
}

export async function getSettings() {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(settings) {
  await chrome.storage.sync.set(settings);
  return getSettings();
}
