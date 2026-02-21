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
const onboardingView = document.getElementById("onboardingView");
const dashboardView = document.getElementById("dashboardView");
const leaderboardView = document.getElementById("leaderboardView");
const historyView = document.getElementById("historyView");
const transferView = document.getElementById("transferView");
const paymentLinkView = document.getElementById("paymentLinkView");
const lookupView = document.getElementById("lookupView");
const transactionView = document.getElementById("transactionView");
const releaseNotesView = document.getElementById("releaseNotesView");
const accountInfoView = document.getElementById("accountInfoView");
const moneyGeneratorView = document.getElementById("moneyGeneratorView");

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
const onboardingContinueBtn = document.getElementById("onboardingContinueBtn");
const transactionStatus = document.getElementById("transactionStatus");
const transactionDetail = document.getElementById("transactionDetail");
const transactionNumericIdValue = document.getElementById("transactionNumericIdValue");
const transactionStatusValue = document.getElementById("transactionStatusValue");
const transactionAmountValue = document.getElementById("transactionAmountValue");
const transactionCreatedValue = document.getElementById("transactionCreatedValue");
const transactionSenderValue = document.getElementById("transactionSenderValue");
const transactionRecipientValue = document.getElementById("transactionRecipientValue");
const transactionSenderIdValue = document.getElementById("transactionSenderIdValue");
const transactionRecipientIdValue = document.getElementById("transactionRecipientIdValue");
const transactionNoteValue = document.getElementById("transactionNoteValue");
const transactionBackBtn = document.getElementById("transactionBackBtn");
const accountInfoStatus = document.getElementById("accountInfoStatus");
const accountInfoDetail = document.getElementById("accountInfoDetail");
const accountInfoFields = {
  username: document.getElementById("accountInfoUsername"),
  firstName: document.getElementById("accountInfoFirstName"),
  lastName: document.getElementById("accountInfoLastName"),
  email: document.getElementById("accountInfoEmail"),
  dob: document.getElementById("accountInfoDob"),
  created: document.getElementById("accountInfoCreated"),
  balance: document.getElementById("accountInfoBalance")
};

const routeViews = {
  loginFlow: loginView,
  logoutFlow: logoutView,
  onboarding: onboardingView,
  dashboard: dashboardView,
  leaderboard: leaderboardView,
  history: historyView,
  transfer: transferView,
  paymentLink: paymentLinkView,
  lookup: lookupView,
  moneyGenerator: moneyGeneratorView,
  transactionDetail: transactionView,
  releaseNotes: releaseNotesView,
  me: accountInfoView
};

const ROUTE_PATHS = {
  loginFlow: "/flow/login",
  logoutFlow: "/flow/logout",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  leaderboard: "/leaderboard",
  history: "/history",
  transfer: "/transfer",
  paymentLink: "/payment-link",
  lookup: "/lookup-link",
  releaseNotes: "release_notes",
  me: "/me",
  moneyGenerator: "/money-generator"
};

const ROUTE_TITLES = {
  dashboard: "Dashboard",
  history: "History",
  transfer: "Transfer",
  paymentLink: "New payment link",
  loginFlow: "Log in to MyPayIndia",
  logoutFlow: "Log out",
  onboarding: "Welcome to MyPayIndia",
  leaderboard: "Leaderboard",
  lookup: "Payment link info",
  moneyGenerator: "Money generator",
  transactionDetail: "Transaction info",
  releaseNotes: "Release notes",
  me: "Account info"
};

const AUTH_REQUIRED_ROUTES = new Set([
  "onboarding",
  "dashboard",
  "history",
  "transfer",
  "paymentLink",
  "moneyGenerator",
  "me",
  "transactionDetail",
  "logoutFlow"
]);

const DEV_ROUTES = new Set(["lookup"]);
const NAV_ROUTES = new Set([
  "dashboard",
  "leaderboard",
  "history",
  "transfer",
  "paymentLink",
  "lookup",
  "moneyGenerator",
  "me"
]);

const ONBOARDING_STORAGE_KEY = "acceptedOnboard";

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
let currentTransactionDetailId = null;
let transactionDetailLoading = false;
let transactionDetailRequestToken = 0;
let accountInfoCache = null;

function hasAcceptedOnboarding() {
  try {
    return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === "1";
  } catch (err) {
    return false;
  }
}

function markOnboardingAccepted() {
  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
  } catch (err) {
    // ignore storage errors
  }
}

function shouldForceOnboarding(route) {
  if (!isLoggedIn) return false;
  if (route === "onboarding" || route === "logoutFlow") return false;
  return !hasAcceptedOnboarding();
}

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

function formatDateOnly(value) {
  if (!value) return "";
  const normalized = value.includes("T") ? value : `${value}T00:00:00Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
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
  if (path.startsWith("/money-generator")) return "moneyGenerator";
  if (path.startsWith("/transaction/")) return "transactionDetail";
  if (path.startsWith("release_notes")) return "releaseNotes";
  if (path.startsWith("/me")) return "me";
  if (path.startsWith("/onboarding")) return "onboarding";
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

function buildTransactionPath(transactionId) {
  if (!transactionId) return "/history";
  return `/transaction/${encodeURIComponent(transactionId)}`;
}

function extractTransactionIdFromPath(path) {
  if (!path) return null;
  const match = path.match(/^\/transaction\/([^/]+)$/i);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch (err) {
    return match[1];
  }
}

function navigateToTransaction(transactionId) {
  if (!transactionId) return;
  if (!isLoggedIn) {
    navigate(ROUTE_PATHS.loginFlow);
    return;
  }
  navigate(buildTransactionPath(transactionId));
}

function attachTransactionRowHandlers(row, txn) {
  if (!row || !txn || !txn.transaction_id) return;
  const { transaction_id: transactionId } = txn;
  row.dataset.transactionId = transactionId;
  row.classList.add("transaction-clickable");
  row.setAttribute("role", "button");
  row.setAttribute("tabindex", "0");
  row.setAttribute("aria-label", `View transaction ${transactionId}`);
  row.title = "View transaction details";

  const handleClick = () => navigateToTransaction(transactionId);
  const handleKey = (event) => {
    if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
    event.preventDefault();
    navigateToTransaction(transactionId);
  };

  row.addEventListener("click", handleClick);
  row.addEventListener("keydown", handleKey);
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
    attachTransactionRowHandlers(row, txn);
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
    attachTransactionRowHandlers(row, txn);
    historyList.appendChild(row);
  });
}

function renderAccountInfo() {
  if (!accountInfoStatus || !accountInfoDetail) return;

  if (!isLoggedIn) {
    accountInfoDetail.classList.add("hidden");
    accountInfoStatus.innerHTML = "<span class='fa-fade'>You must log in first!</span>";
    return;
  }

  if (!accountInfoCache) {
    accountInfoDetail.classList.add("hidden");
    accountInfoStatus.innerHTML = "<i class='fa-solid fa-hourglass fa-spin'></i> <span class='fa-fade'>Loading account info...</span>";
    return;
  }

  accountInfoDetail.classList.remove("hidden");

  const {
    username,
    first_name: firstName,
    last_name: lastName,
    email,
    date_of_birth: dateOfBirth,
    created,
    balance
  } = accountInfoCache;

  if (accountInfoFields.username) accountInfoFields.username.textContent = username || "-";
  if (accountInfoFields.firstName) accountInfoFields.firstName.textContent = firstName || "-";
  if (accountInfoFields.lastName) accountInfoFields.lastName.textContent = lastName || "-";
  if (accountInfoFields.email) accountInfoFields.email.textContent = email || "-";
  if (accountInfoFields.dob) {
    const dobText = formatDateOnly(dateOfBirth) || dateOfBirth || "-";
    accountInfoFields.dob.textContent = dobText;
  }
  if (accountInfoFields.created) {
    const createdText = formatTxnDate(created) || created || "-";
    accountInfoFields.created.textContent = createdText;
  }
  if (accountInfoFields.balance) {
    accountInfoFields.balance.textContent = formatCurrency(balance);
  }
}

function setAccountInfo(info) {
  accountInfoCache = info || null;
  if (currentRoute === "me") {
    renderAccountInfo();
  }
}

function updateTransactionDetailTitle(transactionId) {
  if (currentRoute !== "transactionDetail") return;
  const base = transactionId ? `${transactionId}` : ROUTE_TITLES.transactionDetail;
  document.title = `${base} / MyPayIndia`;
}

function setTransactionDetailMessage(message, { isError = false, allowHtml = false } = {}) {
  if (!transactionStatus) return;
  transactionStatus.classList.toggle("status-error", Boolean(isError));
  if (allowHtml) {
    transactionStatus.innerHTML = message;
  } else {
    transactionStatus.textContent = message;
  }
}

function resetTransactionDetailView(message = "") {
  currentTransactionDetailId = null;
  transactionDetailLoading = false;
  if (transactionDetail) transactionDetail.classList.add("hidden");
  setTransactionDetailMessage(message, { isError: false });

  const placeholders = [
    transactionNumericIdValue,
    transactionStatusValue,
    transactionAmountValue,
    transactionCreatedValue,
    transactionSenderValue,
    transactionRecipientValue,
    transactionSenderIdValue,
    transactionRecipientIdValue,
    transactionNoteValue
  ];
  placeholders.forEach((el) => {
    if (!el) return;
    el.textContent = "-";
  });
  if (transactionStatusValue) {
    transactionStatusValue.classList.remove("ok", "bad");
  }

  updateTransactionDetailTitle(null);
}

function renderTransactionDetail(data) {
  if (!data || !transactionDetail) return;
  transactionDetailLoading = false;
  setTransactionDetailMessage("", { isError: false });
  transactionDetail.classList.remove("hidden");

  const {
    transaction_id: txnId,
    status,
    amount,
    created,
    sender_name: senderName,
    target_name: recipientName,
    sender_id: senderId,
    target_id: recipientId,
    note
  } = data;

  currentTransactionDetailId = txnId || null;

  if (transactionNumericIdValue) {
    transactionNumericIdValue.textContent = data.id ?? "-";
  }
  if (transactionStatusValue) {
    transactionStatusValue.textContent = status || "-";
    const normalized = (status || "").toLowerCase();
    transactionStatusValue.classList.toggle("ok", normalized === "confirmed");
    transactionStatusValue.classList.toggle("bad", normalized !== "confirmed" && Boolean(status));
  }
  if (transactionAmountValue) transactionAmountValue.textContent = formatCurrency(amount);
  if (transactionCreatedValue) transactionCreatedValue.textContent = formatTxnDate(created) || "-";
  if (transactionSenderValue) transactionSenderValue.textContent = senderName || "Unknown";
  if (transactionRecipientValue) transactionRecipientValue.textContent = recipientName || "Unknown";
  if (transactionSenderIdValue) transactionSenderIdValue.textContent = senderId ?? "-";
  if (transactionRecipientIdValue) transactionRecipientIdValue.textContent = recipientId ?? "-";
  if (transactionNoteValue) transactionNoteValue.textContent = note || "No note";

  const transactionLabel = txnId ? ` ${txnId}` : "Transaction";
  updateTransactionDetailTitle(txnId || null);
  if (transactionStatus) {
    transactionStatus.textContent = transactionLabel;
    transactionStatus.classList.remove("status-error");
  }
}

async function loadTransactionDetail(transactionId) {
  if (!transactionStatus) return;
  currentTransactionDetailId = transactionId;
  transactionDetailLoading = true;
  const requestToken = ++transactionDetailRequestToken;
  setTransactionDetailMessage(
    "<i class='fa-solid fa-hourglass fa-spin'></i> <span class='fa-fade'>Retrieving data...</span>",
    { isError: false, allowHtml: true }
  );
  if (transactionDetail) transactionDetail.classList.add("hidden");

  try {
    const response = await apiTransactionDetail(transactionId);
    if (requestToken !== transactionDetailRequestToken) return;
    if (!response.success) {
      resetTransactionDetailView(response.message || "Unable to load transaction.");
      transactionStatus?.classList.add("status-error");
      return;
    }
    renderTransactionDetail(response);
  } catch (err) {
    if (requestToken !== transactionDetailRequestToken) return;
    resetTransactionDetailView("Unable to load transaction.");
    transactionStatus?.classList.add("status-error");
  }
}

function loadTransactionDetailFromLocation() {
  const transactionId = extractTransactionIdFromPath(window.location.pathname);
  if (!transactionId) {
    resetTransactionDetailView("No transaction ID specified!");
    transactionStatus?.classList.add("status-error");
    return;
  }
  transactionStatus?.classList.remove("status-error");
  loadTransactionDetail(transactionId);
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
    const ariaLabel = hasIdentity
      ? `View account information for ${trimmed}`
      : "Go to the login page";
    userStatusPill.setAttribute("aria-label", ariaLabel);
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
  accountInfoCache = null;
  if (accountMenu) accountMenu.classList.add("hidden");
  if (logoutBtn) logoutBtn.classList.add("hidden");
  if (dashboardCard) dashboardCard.classList.add("hidden");
  if (transactionsCard) transactionsCard.classList.add("hidden");
  if (refreshTxnBtn) refreshTxnBtn.classList.add("hidden");
  if (refreshHistoryBtn) refreshHistoryBtn.classList.add("hidden");
  if (ctaCard) ctaCard.classList.add("hidden");
  renderRecentTransactions([]);
  renderHistory();
  renderAccountInfo();
  resetTransactionDetailView("Select a transaction to view the details.");
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

  if (shouldForceOnboarding(key)) {
    key = "onboarding";
    if (window.location.pathname !== ROUTE_PATHS.onboarding) {
      window.history.replaceState({}, "", ROUTE_PATHS.onboarding);
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

  if (key === "me") {
    renderAccountInfo();
  }

  if (key === "transactionDetail") {
    loadTransactionDetailFromLocation();
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
  const navigateToAccountInfo = () => {
    const targetRouteKey = "me";
    if (ensureAuthenticatedAction(targetRouteKey)) {
      navigate(ROUTE_PATHS[targetRouteKey]);
    }
  };
  userStatusPill.addEventListener("click", (event) => {
    event.preventDefault();
    navigateToAccountInfo();
  });
  userStatusPill.addEventListener("keydown", (event) => {
    const key = event.key;
    if (![" ", "Spacebar", "Space"].includes(key)) return;
    event.preventDefault();
    navigateToAccountInfo();
  });
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
  let onboardingAccepted = null;
  try {
    onboardingAccepted = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
  } catch (err) {
    onboardingAccepted = null;
  }
  try {
    window.localStorage.clear();
    if (onboardingAccepted === "1") {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
    }
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
    loginStatus.innerHTML = "<i class='fa-solid fa-hourglass fa-spin'></i> <span class='fa-fade'>Checking if you are already logged in...</span>";
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
  setAccountInfo(info);

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
    loginStatus.classList.remove("status-error");
    loginStatus.innerHTML = "<i class='fa-solid fa-hourglass fa-spin'></i> <span class='fa-fade'>Logging in...</span>";
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const response = await apiLogin(username, password);

    if (!response.success) {
      loginStatus.classList.add("status-error"); loginStatus.textContent = response.message;
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

if (onboardingContinueBtn) {
  onboardingContinueBtn.addEventListener("click", () => {
    markOnboardingAccepted();
    navigate(ROUTE_PATHS.dashboard);
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

if (transactionBackBtn) {
  transactionBackBtn.addEventListener("click", () => {
    navigate(ROUTE_PATHS.history);
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
