import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const extensionDir = resolve(root, "extension");
const requiredFiles = [
  "manifest.json",
  "background/service-worker.js",
  "content/content-script.js",
  "popup/popup.html",
  "popup/popup.js",
  "popup/popup.css",
  "options/options.html",
  "options/options.js",
  "options/options.css",
  "shared/chrome-api.js",
  "shared/constants.js",
  "assets/icons/icon.svg",
];

for (const file of requiredFiles) {
  await access(resolve(extensionDir, file));
}

const manifestPath = resolve(extensionDir, "manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const errors = [];
if (manifest.manifest_version !== 3) errors.push("manifest_version must be 3");
if (!manifest.name) errors.push("manifest.name is required");
if (!manifest.version) errors.push("manifest.version is required");
if (!manifest.background?.service_worker) errors.push("background.service_worker is required");
if (!manifest.action?.default_popup) errors.push("action.default_popup is required");
if (!Array.isArray(manifest.permissions)) errors.push("permissions must be an array");
if (manifest.host_permissions?.some((pattern) => pattern === "https://*/*" || pattern === "http://*/*")) {
  errors.push("broad host access should use optional_host_permissions by default");
}

if (errors.length) {
  console.error("Extension validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Extension validation passed.");
