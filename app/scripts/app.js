const routeLinks = document.querySelectorAll("a[data-route]");

if (typeof window.DEV_MODE === "undefined") {
  window.DEV_MODE = false;
}
const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");
const loginWarning = document.getElementById("loginWarning");
const logoutBtn = document.getElementById("logoutBtn");
const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
const refreshTxnBtn = document.getElementById("refreshTxnBtn");
const refreshHistoryBtn = document.getElementById("refreshHistoryBtn");
const accountMenu = document.getElementById("accountMenu");
const envLabel = document.getElementById("envLabel");

const loginView = document.getElementById("loginView");
const logoutView = document.getElementById("logoutView");
const dashboardView = document.getElementById("dashboardView");
const leaderboardView = document.getElementById("leaderboardView");
const historyView = document.getElementById("historyView");
const transferView = document.getElementById("transferView");
const paymentLinkView = document.getElementById("paymentLinkView");
const lookupView = document.getElementById("lookupView");

const dashboardCard = document.getElementById("dashboardCard");
const transactionsCard = document.getElementById("transactionsCard");
const txnList = document.getElementById("txnList");
const historyList = document.getElementById("historyList");
const historyStatus = document.getElementById("historyStatus");
const leaderboardList = document.getElementById("leaderboardList");
const leaderboardStatus = document.getElementById("leaderboardStatus");
const displayUser = document.getElementById("displayUser");
const userStatusLabel = document.getElementById("userStatusLabel");
const userStatusName = document.getElementById("userStatusName");
const userStatusPill = document.getElementById("userStatusPill");
const balanceStatusValue = document.getElementById("balanceStatusValue");
const displayBalance = document.getElementById("displayBalance");
const ctaCard = document.getElementById("ctaCard");
const installBtn = document.getElementById("installBtn");

const routeViews = {
  loginFlow: loginView,
  logoutFlow: logoutView,
  dashboard: dashboardView,
  leaderboard: leaderboardView,
  history: historyView,
  transfer: transferView,
  paymentLink: paymentLinkView,
  lookup: lookupView
};

const ROUTE_PATHS = {
  loginFlow: "/flow/login",
  logoutFlow: "/flow/logout",
  dashboard: "/dashboard",
  leaderboard: "/leaderboard",
  history: "/history",
  transfer: "/transfer",
  paymentLink: "/payment-link",
  lookup: "/lookup-link"
};

const ROUTE_TITLES = {
  dashboard: "Dashboard",
  history: "History",
  transfer: "Transfer",
  paymentLink: "New payment link",
  loginFlow: "Log in to MyPayIndia",
  logoutFlow: "Log out",
  leaderboard: "Leaderboard",
  lookup: "Payment link info"
};

const AUTH_REQUIRED_ROUTES = new Set([
  "dashboard",
  "history",
  "transfer",
  "paymentLink",
  "logoutFlow"
]);

const DEV_ROUTES = new Set(["lookup"]);
const NAV_ROUTES = new Set([
  "dashboard",
  "leaderboard",
  "history",
  "transfer",
  "paymentLink",
  "lookup"
]);

let deferredInstallPrompt = null;

function isStandalone() {
  return (
    window.matchMedia && window.matchMedia("(display-mode: standalone)").matches
  ) || window.navigator.standalone === true;
}

function updateInstallButton() {
  if (!installBtn) return;
  const shouldShow = deferredInstallPrompt && !isStandalone();
  installBtn.classList.toggle("hidden", !shouldShow);
  installBtn.disabled = !shouldShow;
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  updateInstallButton();
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  updateInstallButton();
});

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    installBtn.disabled = true;
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    if (choice.outcome !== "accepted") {
      installBtn.disabled = false;
    }
    updateInstallButton();
  });
}

updateInstallButton();

let isLoggedIn = false;
let currentRoute = "dashboard";
let pendingProtectedRoute = null;
let transactionsCache = [];
let transactionsLoading = false;
let leaderboardCache = null;
let leaderboardLoading = false;

function detectEnv() {
  if (!envLabel) return;
  const host = window.location.hostname || "";
  const isPreview =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("preview") ||
    host.includes("demo");
  envLabel.textContent = isPreview ? "preview" : "production";
}

detectEnv();

function formatCurrency(value) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
}

function formatTxnDate(value) {
  if (!value) return "";
  const isoCandidate = value.replace(" ", "T") + "Z";
  const date = new Date(isoCandidate);
  if (Number.isNaN(date.valueOf())) return value;

  const { hourCycle } = new Intl.DateTimeFormat().resolvedOptions();
  const use12Hour = hourCycle ? hourCycle.includes("12") : false;

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: use12Hour
  });

  return `${dateFormatter.format(date)} - ${timeFormatter.format(date)}`;
}

function resolveRoute(path) {
  if (!path) return "dashboard";
  if (path.startsWith("/flow/login")) return "loginFlow";
  if (path.startsWith("/flow/logout")) return "logoutFlow";
  if (path.startsWith("/leaderboard")) return "leaderboard";
  if (path.startsWith("/history")) return "history";
  if (path.startsWith("/transfer")) return "transfer";
  if (path.startsWith("/payment-link")) return "paymentLink";
  if (path.startsWith("/lookup-link")) return "lookup";
  if (path.startsWith("/dashboard")) return "dashboard";
  if (path === "/" || path === "/i" || path === "/") return "dashboard";
  return "dashboard";
}

function requestCloseMenu() {
  if (typeof window.closeMenu === "function") {
    window.closeMenu();
  }
}

function setActiveRouteLinks(active) {
  routeLinks.forEach((link) => {
    const target = resolveRoute(link.getAttribute("href"));
    link.classList.toggle("active", active === target);
  });
}

function renderRecentTransactions(list) {
  if (!txnList) return;
  txnList.innerHTML = "";

  if (!isLoggedIn) {
    txnList.innerHTML = "<p class=\"muted\">You must log in first!</p>";
    return;
  }

  if (!list.length) {
    txnList.innerHTML = "<p class=\"muted\">No transactions yet</p>";
    return;
  }

  list.slice(0, 5).forEach((txn) => {
    const statusClass = (txn.status || "").toLowerCase() === "confirmed" ? "ok" : "bad";
    const row = document.createElement("div");
    row.className = "item txn-row";
    row.innerHTML = `
      <span class="party">
        <span class="name">${txn.sender_name}</span>
      </span>
      <span class="arrow"><i class="fa-solid fa-arrow-right"></i></span>
      <span class="party">
        <span class="name">${txn.target_name}</span>
      </span>
      <span class="spacer"></span>
      <span class="amount">${formatCurrency(txn.amount)}</span>
      <span class="status ${statusClass}">${txn.status}</span>
      <span class="txn-date">${formatTxnDate(txn.created)}</span>
    `;
    txnList.appendChild(row);
  });
}

function renderHistory() {
  if (!historyList || !historyStatus) return;

  if (!isLoggedIn) {
    historyList.innerHTML = "";
    historyStatus.innerHTML = "<span class='fa-fade'>You must log in first!</span>";
    return;
  }

  if (transactionsLoading) {
    historyList.innerHTML = "";
    historyStatus.innerHTML = "<i class='fa-solid fa-hourglass fa-spin'></i> <span class='fa-fade'>Retrieving data...</span>";
    return;
  }

  historyStatus.textContent = "";
  historyList.innerHTML = "";

  if (!transactionsCache.length) {
    historyStatus.textContent = "No transactions yet";
    return;
  }

  transactionsCache.forEach((txn) => {
    const statusClass = (txn.status || "").toLowerCase() === "confirmed" ? "ok" : "bad";
    const row = document.createElement("div");
    row.className = "item txn-row";
    row.innerHTML = `
      <span class="party">
        <span class="name">${txn.sender_name}</span>
      </span>
      <span class="arrow"><i class="fa-solid fa-arrow-right"></i></span>
      <span class="party">
        <span class="name">${txn.target_name}</span>
      </span>
      <span class="spacer"></span>
      <span class="amount">${formatCurrency(txn.amount)}</span>
      <span class="status ${statusClass}">${txn.status}</span>
      <span class="txn-date">${formatTxnDate(txn.created)}</span>
    `;
    historyList.appendChild(row);
  });
}

function updateTransactions(data) {
  transactionsCache = Array.isArray(data) ? data : [];
  renderRecentTransactions(transactionsCache);
  if (currentRoute === "history") {
    renderHistory();
  }
}

function setRefreshTxnState(loading) {
  const toggleButton = (button) => {
    if (!button) return;
    button.disabled = loading;
    const icon = button.querySelector("i");
    if (icon) icon.classList.toggle("fa-spin", loading);
  };

  toggleButton(refreshTxnBtn);
  toggleButton(refreshHistoryBtn);
}

function setUserIdentity(name) {
  const trimmed = (name && `${name}`.trim()) || "";
  const hasIdentity = Boolean(trimmed);
  const greetingName = hasIdentity ? trimmed : "Guest";
  const pillLabel = hasIdentity ? "Logged in as" : "Not logged in";
  const pillValue = hasIdentity ? trimmed : "";
  if (displayUser) displayUser.textContent = greetingName;
  if (userStatusLabel) userStatusLabel.textContent = pillLabel;
  if (userStatusName) userStatusName.textContent = pillValue;
  if (userStatusPill) {
    userStatusPill.classList.toggle("user-pill-guest", !hasIdentity);
    userStatusPill.setAttribute(
      "aria-label",
      hasIdentity ? `Logged in as ${trimmed}` : "Go to the login page"
    );
  }
}

setUserIdentity("");

function setBalanceDisplay(value) {
  const safeValue = typeof value === "number" || typeof value === "string" ? value : 0;
  const formatted = formatCurrency(safeValue || 0);
  if (displayBalance) displayBalance.textContent = formatted;
  if (balanceStatusValue) balanceStatusValue.textContent = formatted;
}

setBalanceDisplay(0);

function resetApplicationState() {
  isLoggedIn = false;
  pendingProtectedRoute = null;
  transactionsCache = [];
  transactionsLoading = false;
  leaderboardCache = null;
  leaderboardLoading = false;
  if (accountMenu) accountMenu.classList.add("hidden");
  if (logoutBtn) logoutBtn.classList.add("hidden");
  if (dashboardCard) dashboardCard.classList.add("hidden");
  if (transactionsCard) transactionsCard.classList.add("hidden");
  if (refreshTxnBtn) refreshTxnBtn.classList.add("hidden");
  if (refreshHistoryBtn) refreshHistoryBtn.classList.add("hidden");
  if (ctaCard) ctaCard.classList.add("hidden");
  renderRecentTransactions([]);
  renderHistory();
  if (leaderboardList) leaderboardList.innerHTML = "";
  if (leaderboardStatus) leaderboardStatus.textContent = "";
  setUserIdentity("");
  setBalanceDisplay(0);
  updateLoginRequiredNotice();
}

function updateLoginRequiredNotice() {
  if (!loginWarning) return;
  const shouldShow = Boolean(
    pendingProtectedRoute && pendingProtectedRoute !== "dashboard"
  );
  loginWarning.classList.toggle("hidden", !shouldShow);
}

function ensureAuthenticatedAction(target = "dashboard") {
  if (isLoggedIn) return true;
  pendingProtectedRoute = target;
  updateLoginRequiredNotice();
  navigate(ROUTE_PATHS.loginFlow);
  return false;
}

async function loadTransactions({ showErrors = true } = {}) {
  if (!isLoggedIn) return false;
  transactionsLoading = true;
  renderHistory();
  setRefreshTxnState(true);

  try {
    const response = await apiTransactions();
    transactionsLoading = false;
    setRefreshTxnState(false);

    if (!response.success) {
      const message = response.message || "Failed";
      if (showErrors && txnList) {
        txnList.innerHTML = `<p class="muted">${message}</p>`;
      }
      if (currentRoute === "history" && historyStatus) {
        historyStatus.textContent = message;
      }
      return false;
    }

    updateTransactions(response.data || []);
    return true;
  } catch (err) {
    transactionsLoading = false;
    setRefreshTxnState(false);
    if (showErrors && txnList) {
      txnList.innerHTML = "<p class=\"muted\">Could not load list</p>";
    }
    if (currentRoute === "history" && historyStatus) {
      historyStatus.textContent = "Unable to load history";
    }
    return false;
  }
}

async function loadLeaderboard() {
  if (!leaderboardList || !leaderboardStatus) return;

  if (leaderboardCache && leaderboardCache.length) {
    renderLeaderboard();
    return;
  }

  if (leaderboardLoading) return;
  leaderboardLoading = true;
  leaderboardStatus.innerHTML = "<i class='fa-solid fa-hourglass fa-spin'></i> <span class='fa-fade'>Retrieving data...</span>";
  leaderboardList.innerHTML = "";

  try {
    const response = await apiLeaderboard();
    leaderboardLoading = false;
    if (!response.success) {
      leaderboardStatus.textContent = response.message || "No data returned";
      return;
    }
    leaderboardCache = response.data || [];
    renderLeaderboard();
  } catch (err) {
    leaderboardLoading = false;
    leaderboardStatus.textContent = "No data returned";
  }
}

function renderLeaderboard() {
  if (!leaderboardList || !leaderboardStatus) return;
  leaderboardList.innerHTML = "";
  if (!leaderboardCache || !leaderboardCache.length) {
    leaderboardStatus.textContent = "No leaderboard data yet";
    return;
  }
  leaderboardStatus.textContent = "";
  leaderboardCache.slice(0, 10).forEach((entry, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="rank">#${index + 1}</span>
      <span class="user">${entry.username}</span>
      <span class="balance">${formatCurrency(entry.balance)}</span>
    `;
    leaderboardList.appendChild(li);
  });
}

function applyRoute(route) {
  let key = route;

  if (DEV_ROUTES.has(route) && !window.DEV_MODE) {
    key = "dashboard";
    if (window.location.pathname !== ROUTE_PATHS.dashboard) {
      window.history.replaceState({}, "", ROUTE_PATHS.dashboard);
    }
  }

  if (!isLoggedIn && AUTH_REQUIRED_ROUTES.has(key)) {
    pendingProtectedRoute = route;
    updateLoginRequiredNotice();
    key = "loginFlow";
    if (window.location.pathname !== ROUTE_PATHS.loginFlow) {
      window.history.replaceState({}, "", ROUTE_PATHS.loginFlow);
    }
  }

  Object.entries(routeViews).forEach(([name, view]) => {
    if (!view) return;
    view.classList.toggle("hidden", name !== key);
  });

  currentRoute = key;
  document.title = ROUTE_TITLES[key] + " / MyPayIndia" || "MyPayIndia";
  setActiveRouteLinks(NAV_ROUTES.has(key) ? key : null);

  if (key === "leaderboard") {
    loadLeaderboard();
  }

  if (key === "history") {
    renderHistory();
  }
}

function navigate(path, { replace = false } = {}) {
  if (!path) return;
  const route = resolveRoute(path);
  const target = ROUTE_PATHS[route] || path;

  if (replace) {
    window.history.replaceState({}, "", target);
  } else if (window.location.pathname !== target) {
    window.history.pushState({}, "", target);
  }

  applyRoute(route);
  requestCloseMenu();
}

window.addEventListener("popstate", () => {
  applyRoute(resolveRoute(window.location.pathname));
});

routeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("http")) return;
    event.preventDefault();
    navigate(href);
  });
});

if (userStatusPill) {
  const handleUserPillAction = (event) => {
    if (isLoggedIn) return;
    if (event.type === "keydown") {
      const key = event.key;
      if (!["Enter", " ", "Spacebar", "Space"].includes(key)) return;
    }
    event.preventDefault();
    navigate(ROUTE_PATHS.loginFlow);
  };
  userStatusPill.addEventListener("click", handleUserPillAction);
  userStatusPill.addEventListener("keydown", handleUserPillAction);
}

function deleteAllCookies() {
  const raw = document.cookie ? document.cookie.split(";") : [];
  raw.forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
    const trimmed = name.trim();
    if (!trimmed) return;
    const gibberish = Math.random().toString(36).slice(2);
    document.cookie = `${trimmed}=${gibberish};path=/;SameSite=Lax`;
    document.cookie = `${trimmed}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
  });
}

function forceLogoutReset() {
  resetApplicationState();
  deleteAllCookies();
  try {
    window.localStorage.clear();
  } catch (err) {
    // ignore storage errors
  }
  try {
    window.sessionStorage.clear();
  } catch (err) {
    // ignore storage errors
  }
}

async function loadDashboard({ silent = false } = {}) {
  if (!silent && loginStatus) {
    loginStatus.innerHTML = "<i class='fa-solid fa-hourglass fa-spin'></i> <span class='fa-fade'>Retrieving data...</span>";
  }

  let info;
  try {
    info = await apiInfo();
  } catch (err) {
    info = { success: false };
  }

  if (!info.success) {
    resetApplicationState();
    if (!silent && loginStatus) loginStatus.textContent = "";
    applyRoute("loginFlow");
    return false;
  }

  isLoggedIn = true;
  if (!silent && loginStatus) loginStatus.textContent = "";

  if (accountMenu) accountMenu.classList.remove("hidden");
  if (logoutBtn) logoutBtn.classList.remove("hidden");
  if (dashboardCard) dashboardCard.classList.remove("hidden");
  if (transactionsCard) transactionsCard.classList.remove("hidden");
  if (ctaCard) ctaCard.classList.remove("hidden");
  if (refreshTxnBtn) refreshTxnBtn.classList.remove("hidden");
  if (refreshHistoryBtn) refreshHistoryBtn.classList.remove("hidden");

  setUserIdentity(info.username || "");
  setBalanceDisplay(info.balance);

  await loadTransactions({ showErrors: true });

  const nextRoute = pendingProtectedRoute || resolveRoute(window.location.pathname);
  pendingProtectedRoute = null;
  updateLoginRequiredNotice();
  applyRoute(nextRoute);
  return true;
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginStatus.innerHTML = '<i class="fa-solid fa-hourglass fa-spin"></i> Retrieving data...';
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const response = await apiLogin(username, password);

    if (!response.success) {
      loginStatus.textContent = response.message;
      return;
    }

    loginStatus.innerHTML = '<i class="fa-solid fa-check fa-fade" style="color: #00ff00;"></i> Logged in successfully - welcome back!';
    const ok = await loadDashboard({ silent: true });
    if (ok) {
      const destination = pendingProtectedRoute || "dashboard";
      pendingProtectedRoute = null;
      updateLoginRequiredNotice();
      navigate(ROUTE_PATHS[destination]);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    navigate(ROUTE_PATHS.logoutFlow);
  });
}

if (cancelLogoutBtn) {
  cancelLogoutBtn.addEventListener("click", () => {
    navigate(ROUTE_PATHS.dashboard);
  });
}

if (confirmLogoutBtn) {
  confirmLogoutBtn.addEventListener("click", async () => {
    confirmLogoutBtn.disabled = true;
    confirmLogoutBtn.innerHTML = "<i class='fa-solid fa-hourglass fa-spin'></i> <span class='fa-fade'>Logging out...</span>";
    const cachebuster = Date.now().toString(36);
    try {
      await fetch(path + "/api/v1/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      // ignore
    }
    forceLogoutReset();
    const logoutUrl = `${ROUTE_PATHS.loginFlow}?cachebuster=${cachebuster}`;
    window.location.href = logoutUrl;
  });
}

if (refreshTxnBtn) {
  refreshTxnBtn.addEventListener("click", () => {
    loadTransactions({ showErrors: true });
  });
}

if (refreshHistoryBtn) {
  refreshHistoryBtn.addEventListener("click", () => {
    loadTransactions({ showErrors: true });
  });
}

window.addEventListener("load", () => {
  applyRoute(resolveRoute(window.location.pathname));
});

window.addEventListener("devmodechange", (event) => {
  if (!event.detail?.enabled) {
    const route = resolveRoute(window.location.pathname);
    if (DEV_ROUTES.has(route)) {
      navigate(ROUTE_PATHS.dashboard, { replace: true });
    }
  } else {
    applyRoute(resolveRoute(window.location.pathname));
  }
});

window.MyPayApp = {
  ensureAuthenticatedAction,
  formatCurrency,
  updateBalance: (value) => {
    setBalanceDisplay(value);
  },
  refreshTransactions: () => loadTransactions({ showErrors: false })
};

loadDashboard();




if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.error("SW registration failed", err));
  });
}




