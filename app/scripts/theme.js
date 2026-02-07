const themeSwitch = document.getElementById("themeSwitch");

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
