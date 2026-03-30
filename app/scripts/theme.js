const themeSwitch = document.getElementById("themeSwitch");
const accentColorPicker = document.getElementById("accentColorPicker");
const accentPresetButtons = document.querySelectorAll("[data-accent-color]");
const ACCENT_STORAGE_KEY = "accentColor";

function normalizeAccentColor(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (/^#([0-9a-fA-F]{6})$/.test(trimmed)) {
    return `#${trimmed.slice(1).toLowerCase()}`;
  }
  return null;
}

function hexToRgb(hex) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return null;
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16)
  };
}

const defaultAccentColor =
  normalizeAccentColor(getComputedStyle(document.documentElement).getPropertyValue("--accent")) || "#d03505";

function applyTheme(isDark, persist = true) {
  document.body.classList.toggle("dark", isDark);
  if (themeSwitch) {
    themeSwitch.checked = isDark;
  }
  if (persist) {
    localStorage.setItem("dark", isDark ? "1" : "0");
  }
}

function detectPreferredTheme() {
  try {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch (err) {
    return true;
  }
}

function loadTheme() {
  const stored = localStorage.getItem("dark");
  if (stored === "1" || stored === "0") {
    applyTheme(stored === "1", false);
    return;
  }
  const prefersDark = detectPreferredTheme();
  applyTheme(prefersDark, true);
}

if (themeSwitch) {
  themeSwitch.addEventListener("change", () => {
    applyTheme(themeSwitch.checked);
  });
}

loadTheme();

function updateAccentControls(color) {
  if (accentColorPicker && accentColorPicker.value.toLowerCase() !== color) {
    accentColorPicker.value = color;
  }
  accentPresetButtons.forEach((button) => {
    const matches = button.dataset.accentColor?.toLowerCase() === color;
    button.classList.toggle("accent-swatch-selected", matches);
    button.setAttribute("aria-pressed", matches ? "true" : "false");
  });
}

function applyAccentColor(color, persist = true) {
  const normalized = normalizeAccentColor(color) || defaultAccentColor;
  document.documentElement.style.setProperty("--accent", normalized);
  const rgb = hexToRgb(normalized);
  if (rgb) {
    document.documentElement.style.setProperty("--accent-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
  }
  updateAccentControls(normalized);
  if (persist) {
    localStorage.setItem(ACCENT_STORAGE_KEY, normalized);
  }
}

function loadAccentColor() {
  const stored = normalizeAccentColor(localStorage.getItem(ACCENT_STORAGE_KEY));
  if (stored) {
    applyAccentColor(stored, false);
  } else {
    applyAccentColor(defaultAccentColor, false);
  }
}

accentPresetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyAccentColor(button.dataset.accentColor);
  });
});

if (accentColorPicker) {
  accentColorPicker.addEventListener("input", (event) => {
    applyAccentColor(event.target.value);
  });
}

loadAccentColor();
