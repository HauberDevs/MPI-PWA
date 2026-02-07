const devSwitch = document.getElementById("devSwitch");
const DEV_KEY = "devmode";

function applyDevMode(enabled, persist = true) {
  window.DEV_MODE = enabled;
  if (devSwitch) {
    devSwitch.checked = enabled;
  }
  document.querySelectorAll("[data-dev-only]").forEach((node) => {
    node.classList.toggle("hidden", !enabled);
  });
  if (persist) {
    localStorage.setItem(DEV_KEY, enabled ? "1" : "0");
  }
  document.dispatchEvent(
    new CustomEvent("devmodechange", { detail: { enabled } })
  );
}

function loadDevMode() {
  const stored = localStorage.getItem(DEV_KEY);
  applyDevMode(stored === "1", false);
}

if (devSwitch) {
  devSwitch.addEventListener("change", () => {
    applyDevMode(devSwitch.checked);
  });
}

loadDevMode();
