const routeLinks = document.querySelectorAll("a[data-route]");
const RECENT_RECIPIENTS_EVENT = "recentRecipientsUpdate";

if (typeof window.DEV_MODE === "undefined") {
  window.DEV_MODE = false;
}
const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");
const loginWarning = document.getElementById("loginWarning");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginSubmitBtn = loginForm ? loginForm.querySelector("button[type='submit'], input[type='submit']") : null;

function setLoginControlsDisabled(disabled) {
  if (usernameInput) usernameInput.disabled = disabled;
  if (passwordInput) passwordInput.disabled = disabled;
  if (loginSubmitBtn) loginSubmitBtn.disabled = disabled;
}
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
const settingsView = document.getElementById("settingsView");
const settingsForm = document.getElementById("settingsForm");
const displayPrefUsername = document.getElementById("displayPrefUsername");
const displayPrefFirst = document.getElementById("displayPrefFirst");
const displayPrefFull = document.getElementById("displayPrefFull");
const autoRefreshToggle = document.getElementById("autoRefreshToggle");
const teamView = document.getElementById("teamView");
const teamStatus = document.getElementById("teamStatus");
const teamList = document.getElementById("teamList");
const teamCountLabel = document.getElementById("teamCountLabel");

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
const balanceStatusPill = document.getElementById("balanceStatusPill");
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
  transactionDetail: transactionView,
  team: teamView,
  releaseNotes: releaseNotesView,
  me: accountInfoView,
  settings: settingsView
};

const ROUTE_PATHS = {
  loginFlow: "login",
  logoutFlow: "logout",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  leaderboard: "/leaderboard",
  history: "/history",
  transfer: "/transfer",
  paymentLink: "/payment-link",
  lookup: "/lookup-link",
  releaseNotes: "release_notes",
  team: "/team",
  me: "/me",
  settings: "/settings"
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
  transactionDetail: "Transaction info",
  team: "Meet the team",
  releaseNotes: "Release notes",
  me: "Account info",
  settings: "Settings"
};

const AUTH_REQUIRED_ROUTES = new Set([
  "onboarding",
  "dashboard",
  "history",
  "transfer",
  "paymentLink",
  "settings",
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
  "team",
  "settings",
  "me"
]);

const TEAM_DATA_URL = "https://pr.app.mypayindia.com/api/v1/team";
const TEAM_FALLBACK_IMAGE = "/app/media/logo.png";
const TEAM_SOCIAL_ICONS = {
  website: "fa-solid fa-globe",
  twitter: "fa-brands fa-twitter",
  github: "fa-brands fa-github",
  youtube: "fa-brands fa-youtube",
  reddit: "fa-brands fa-reddit-alien"
};

const ONBOARDING_STORAGE_KEY = "acceptedOnboard";
const REMEMBER_USERNAME_STORAGE_KEY = "rememberUsername";
const REMEMBER_PASSWORD_STORAGE_KEY = "rememberPassword";
const STORED_USERNAME_KEY = "storedUsername";
const STORED_PASSWORD_KEY = "storedPassword";
const AUTO_REFRESH_STORAGE_KEY = "autoRefreshEnabled";

try {
  if (!window.localStorage.getItem(REMEMBER_USERNAME_STORAGE_KEY)) {
    window.localStorage.setItem(REMEMBER_USERNAME_STORAGE_KEY, "0");
  }
  if (!window.localStorage.getItem(REMEMBER_PASSWORD_STORAGE_KEY)) {
    window.localStorage.setItem(REMEMBER_PASSWORD_STORAGE_KEY, "0");
  }
} catch (err) {
  null
}

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
let teamCache = null;
let teamLoading = false;
let autoRefreshEnabled = true;

autoRefreshEnabled = getStoredAutoRefreshPreference();
if (autoRefreshToggle) {
  autoRefreshToggle.checked = autoRefreshEnabled;
}

function getStoredAutoRefreshPreference() {
  try {
    const stored = window.localStorage.getItem(AUTO_REFRESH_STORAGE_KEY);
    if (stored === "0") return false;
    if (stored === "1") return true;
  } catch (err) {
    null
  }
  return true;
}

function setStoredAutoRefreshPreference(value) {
  try {
    window.localStorage.setItem(AUTO_REFRESH_STORAGE_KEY, value ? "1" : "0");
  } catch (err) {
    null
  }
}

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
    null
  }
}

function getRememberUsernamePreference() {
  try {
    return window.localStorage.getItem(REMEMBER_USERNAME_STORAGE_KEY) === "1";
  } catch (err) {
    return false;
  }
}

function getRememberPasswordPreference() {
  try {
    return window.localStorage.getItem(REMEMBER_PASSWORD_STORAGE_KEY) === "1";
  } catch (err) {
    return false;
  }
}

function setRememberUsernamePreference(value) {
  try {
    window.localStorage.setItem(REMEMBER_USERNAME_STORAGE_KEY, value ? "1" : "0");
  } catch (err) {
    null
  }
}

function setRememberPasswordPreference(value) {
  try {
    window.localStorage.setItem(REMEMBER_PASSWORD_STORAGE_KEY, value ? "1" : "0");
  } catch (err) {
    null
  }
}

function getStoredUsername() {
  try {
    return window.localStorage.getItem(STORED_USERNAME_KEY) || "";
  } catch (err) {
    return "";
  }
}

function getStoredPassword() {
  try {
    return window.localStorage.getItem(STORED_PASSWORD_KEY) || "";
  } catch (err) {
    return "";
  }
}

function setStoredUsername(username) {
  try {
    if (getRememberUsernamePreference()) {
      window.localStorage.setItem(STORED_USERNAME_KEY, username);
    } else {
      window.localStorage.removeItem(STORED_USERNAME_KEY);
    }
  } catch (err) {
    null
  }
}

function setStoredPassword(password) {
  try {
    if (getRememberPasswordPreference()) {
      window.localStorage.setItem(STORED_PASSWORD_KEY, password);
    } else {
      window.localStorage.removeItem(STORED_PASSWORD_KEY);
    }
  } catch (err) {
    null
  }
}

function clearStoredCredentials() {
  try {
    window.localStorage.removeItem(STORED_USERNAME_KEY);
    window.localStorage.removeItem(STORED_PASSWORD_KEY);
    window.localStorage.removeItem(REMEMBER_USERNAME_STORAGE_KEY);
    window.localStorage.removeItem(REMEMBER_PASSWORD_STORAGE_KEY);
  } catch (err) {
    null
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
  return new Intl.NumberFormat("en-US", {
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
  if (path.startsWith("login")) return "loginFlow";
  if (path.startsWith("logout")) return "logoutFlow";
  if (path.startsWith("/leaderboard")) return "leaderboard";
  if (path.startsWith("/history")) return "history";
  if (path.startsWith("/transfer")) return "transfer";
  if (path.startsWith("/payment-link")) return "paymentLink";
  if (path.startsWith("/lookup-link")) return "lookup";
  if (path.startsWith("/settings")) return "settings";
  if (path.startsWith("/transaction/")) return "transactionDetail";
  if (path.startsWith("/team")) return "team";
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
  updateUserIdentityFromPreference();
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

function normalizeRecipientValue(value) {
  if (typeof value === "number") return `${value}`;
  if (typeof value === "string") return value.trim();
  return "";
}

function getSelfRecipientAliases() {
  const aliases = new Set();
  if (!accountInfoCache) return aliases;
  const add = (value) => {
    const normalized = normalizeRecipientValue(value);
    if (normalized) aliases.add(normalized.toLowerCase());
  };

  const username = accountInfoCache.username;
  add(username);
  if (username) add(`@${username}`);

  add(accountInfoCache.id);
  add(accountInfoCache.account_id);
  add(accountInfoCache.user_id);
  add(accountInfoCache.display_name);

  const firstName = normalizeRecipientValue(accountInfoCache.first_name);
  const lastName = normalizeRecipientValue(accountInfoCache.last_name);
  add(firstName);
  add(lastName);

  const fullName = `${firstName || ""} ${lastName || ""}`.trim();
  add(fullName);

  return aliases;
}

function getRecentTransactionRecipients(limit = 5) {
  if (!Array.isArray(transactionsCache) || transactionsCache.length === 0) return [];
  const normalizedLimit = Number.isFinite(limit) && limit > 0 ? limit : 5;
  const selfAliases = getSelfRecipientAliases();
  const seen = new Set();
  const recipients = [];
  for (const txn of transactionsCache) {
    if (!txn) continue;
    const nameValue = normalizeRecipientValue(txn.target_name);
    const fallbackValue = normalizeRecipientValue(txn.target_id);
    const candidate = nameValue || fallbackValue;
    if (!candidate) continue;
     const candidateLower = candidate.toLowerCase();
     const nameLower = nameValue ? nameValue.toLowerCase() : null;
     const fallbackLower = fallbackValue ? fallbackValue.toLowerCase() : null;
     if (selfAliases.has(candidateLower) || (nameLower && selfAliases.has(nameLower)) || (fallbackLower && selfAliases.has(fallbackLower))) {
       continue;
     }
    const key = candidate.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    recipients.push({
      value: candidate,
      label: nameValue || fallbackValue || candidate,
      lastDate: txn.created || null
    });
    if (recipients.length >= normalizedLimit) break;
  }
  return recipients.slice(0, normalizedLimit);
}

function emitRecentRecipientsUpdate() {
  if (typeof window === "undefined") return;
  const detail = { recipients: getRecentTransactionRecipients() };
  let event;
  if (typeof window.CustomEvent === "function") {
    event = new window.CustomEvent(RECENT_RECIPIENTS_EVENT, { detail });
  } else if (typeof document !== "undefined" && document.createEvent) {
    event = document.createEvent("CustomEvent");
    event.initCustomEvent(RECENT_RECIPIENTS_EVENT, false, false, detail);
  }
  if (event) {
    window.dispatchEvent(event);
  }
}

function updateTransactions(data) {
  transactionsCache = Array.isArray(data) ? data : [];
  renderRecentTransactions(transactionsCache);
  emitRecentRecipientsUpdate();
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

function updateTopPillsVisibility() {
  const hideForOnboarding = isLoggedIn && currentRoute === "onboarding";
  if (userStatusPill) {
    userStatusPill.classList.toggle("hidden", hideForOnboarding);
  }
  if (balanceStatusPill) {
    const hideBalance = hideForOnboarding || !isLoggedIn;
    balanceStatusPill.classList.toggle("hidden", hideBalance);
  }
}

updateTopPillsVisibility();

const DISPLAY_NAME_STORAGE_KEY = "display";

function getDisplayNamePreference() {
  try {
    const v = window.localStorage.getItem(DISPLAY_NAME_STORAGE_KEY);
    return (v === "full" || v === "first") ? v : "user";
  } catch (err) {
    return "user";
  }
}

function setDisplayNamePreference(value) {
  const normalized = value === "full" || value === "first" ? value : "user";
  try {
    window.localStorage.setItem(DISPLAY_NAME_STORAGE_KEY, normalized);
  } catch (err) {
    null
  }
  updateUserIdentityFromPreference();
}

function computePreferredName() {
  const pref = getDisplayNamePreference();
  if (!isLoggedIn) return "";
  const info = accountInfoCache || {};
  const username = info.username || "";
  if (pref === "full") {
    const first = (info.first_name || "").trim();
    const last = (info.last_name || "").trim();
    const full = `${first} ${last}`.trim();
    return full || username || "";
  }
  if (pref === "first") {
    const first = (info.first_name || "").trim();
    return first || username || "";
  }
  return username || "";
}

function updateUserIdentityFromPreference() {
  const name = computePreferredName();
  setUserIdentity(name);
}

function resetApplicationState() {
  isLoggedIn = false;
  pendingProtectedRoute = null;
  transactionsCache = [];
  transactionsLoading = false;
  leaderboardCache = null;
  leaderboardLoading = false;
  accountInfoCache = null;
  stopAccountInfoRefresh();
  if (accountMenu) accountMenu.classList.add("hidden");
  if (logoutBtn) logoutBtn.classList.add("hidden");
  if (dashboardCard) dashboardCard.classList.add("hidden");
  if (transactionsCard) transactionsCard.classList.add("hidden");
  if (refreshTxnBtn) refreshTxnBtn.classList.add("hidden");
  if (refreshHistoryBtn) refreshHistoryBtn.classList.add("hidden");
  if (ctaCard) ctaCard.classList.add("hidden");
  renderRecentTransactions([]);
  emitRecentRecipientsUpdate();
  renderHistory();
  renderAccountInfo();
  resetTransactionDetailView("Select a transaction to view the details.");
  if (leaderboardList) leaderboardList.innerHTML = "";
  if (leaderboardStatus) leaderboardStatus.textContent = "";
  setUserIdentity("");
  setBalanceDisplay(0);
  updateLoginRequiredNotice();
  updateTopPillsVisibility();
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

function setTeamCount(count) {
  if (!teamCountLabel) return;
  const safe = Number.isFinite(count) ? count : 0;
  if (safe === 0) {
    teamCountLabel.innerHTML = "<i class='fa-solid fa-hourglass fa-spin'></i>";
  } else {
    teamCountLabel.textContent = safe.toString();
  }
}

function setTeamStatus(message, { isError = false, allowHtml = false } = {}) {
  if (!teamStatus) return;
  teamStatus.classList.toggle("status-error", Boolean(isError));
  if (allowHtml) {
    teamStatus.innerHTML = message;
  } else {
    teamStatus.textContent = message || "";
  }
}

function getTeamSocialIconClass(label) {
  const key = (label || "").toLowerCase();
  return TEAM_SOCIAL_ICONS[key] || "fa-solid fa-link";
}

function buildTeamImageUrl(image) {
  if (!image) return TEAM_FALLBACK_IMAGE;
  return String(image).trim();
}

function buildTeamCard(member) {
  const card = document.createElement("article");
  card.className = "team-card";

  const avatar = document.createElement("div");
  avatar.className = "team-avatar";
  const img = document.createElement("img");
  img.loading = "lazy";
  img.decoding = "async";
  img.src = buildTeamImageUrl(member?.image);
  img.alt = member?.name ? `${member.name}'s profile photo` : "Team member";
  img.addEventListener("error", () => {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = "1";
    img.src = TEAM_FALLBACK_IMAGE;
  });
  avatar.appendChild(img);

  const meta = document.createElement("div");
  meta.className = "team-meta";
  const name = document.createElement("h3");
  name.textContent = member?.name || "Unknown member";
  const role = document.createElement("p");
  role.className = "team-role";
  role.textContent = member?.role || "Team member";
  meta.appendChild(name);
  meta.appendChild(role);
  if (member?.since) {
    const since = document.createElement("p");
    since.className = "team-since";
    since.textContent = `Since ${member.since}`;
    meta.appendChild(since);
  }

  const socials = document.createElement("div");
  socials.className = "team-socials";
  const socialEntries = Object.entries(member?.socials || {}).filter(([, url]) => Boolean(url));
  if (socialEntries.length) {
    socialEntries.forEach(([label, url]) => {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      link.title = `${label}`;
      link.setAttribute("aria-label", `${member?.name || "Member"}'s ${label}`);
      const icon = document.createElement("i");
      icon.className = getTeamSocialIconClass(label);
      link.appendChild(icon);
      socials.appendChild(link);
    });
  } else {
    const noLinks = document.createElement("span");
    noLinks.className = "team-no-socials muted";
    noLinks.textContent = null;
    socials.appendChild(noLinks);
  }

  const header = document.createElement("div");
  header.className = "team-card-header";
  header.appendChild(avatar);
  header.appendChild(meta);

  card.appendChild(header);
  card.appendChild(socials);
  return card;
}

function renderTeam() {
  if (!teamList || !teamStatus) return;
  teamList.innerHTML = "";
  if (!teamCache || !teamCache.length) {
    setTeamStatus("No data returned");
    setTeamCount(0);
    return;
  }
  setTeamStatus("");
  setTeamCount(teamCache.length);
  teamCache.forEach((member) => {
    teamList.appendChild(buildTeamCard(member));
  });
}

async function loadTeam() {
  if (!teamList || !teamStatus) return;

  if (teamCache && teamCache.length) {
    renderTeam();
    return;
  }

  if (teamLoading) return;
  teamLoading = true;
  teamList.innerHTML = "";
  setTeamStatus("<i class='fa-solid fa-hourglass fa-spin'></i> <span class='fa-fade'>Retrieving data...</span>", {
    allowHtml: true
  });

  try {
    const response = await apiTeam();
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch team data");
    }
    teamCache = Array.isArray(response?.data) ? response.data : [];
    renderTeam();
  } catch (err) {
    teamCache = null;
    setTeamStatus("No data returned - please see <a href='https://mypayindia.com/team'>mypayindia.com/team</a>", { allowHtml: true, isError: true });
    setTeamCount(0);
  } finally {
    teamLoading = false;
  }
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
  updateTopPillsVisibility();

  if (key === "leaderboard") {
    loadLeaderboard();
  }

  if (key === "team") {
    loadTeam();
  }

  if (key === "history") {
    renderHistory();
  }

  if (key === "me") {
    renderAccountInfo();
  }

  if (key === "settings") {
    renderSettings();
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

function renderSettings() {
  if (!settingsView || !settingsForm) return;
  const pref = getDisplayNamePreference();
  if (displayPrefUsername) displayPrefUsername.checked = pref === "user";
  if (displayPrefFirst) displayPrefFirst.checked = pref === "first";
  if (displayPrefFull) displayPrefFull.checked = pref === "full";
  const fullAvailable = Boolean(
    accountInfoCache && (((accountInfoCache.first_name || "").trim()) || ((accountInfoCache.last_name || "").trim()))
  );
  const firstAvailable = Boolean(
    accountInfoCache && ((accountInfoCache.first_name || "").trim())
  );
  if (displayPrefFull) {
    displayPrefFull.disabled = !fullAvailable;
    displayPrefFull.title = !fullAvailable ? "Full name not available" : "";
  }
  if (displayPrefFirst) {
    displayPrefFirst.disabled = !firstAvailable;
    displayPrefFirst.title = !firstAvailable ? "First name not available" : "";
  }
  if (!fullAvailable && pref === "full") {
    setDisplayNamePreference("user");
    if (displayPrefUsername) displayPrefUsername.checked = true;
    if (displayPrefFirst) displayPrefFirst.checked = false;
    if (displayPrefFull) displayPrefFull.checked = false;
  }
  if (!firstAvailable && pref === "first") {
    setDisplayNamePreference("user");
    if (displayPrefUsername) displayPrefUsername.checked = true;
    if (displayPrefFirst) displayPrefFirst.checked = false;
    if (displayPrefFull) displayPrefFull.checked = false;
  }
  updateSettingsUIState();
}

function updateSettingsUIState() {
  if (!settingsForm) return;
  const chips = settingsForm.querySelectorAll("label.radio-chip");
  chips.forEach((chip) => chip.classList.remove("selected"));
  if (displayPrefUsername?.checked) displayPrefUsername.closest("label")?.classList.add("selected");
  if (displayPrefFirst?.checked) displayPrefFirst.closest("label")?.classList.add("selected");
  if (displayPrefFull?.checked) displayPrefFull.closest("label")?.classList.add("selected");
}

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
  document.cookie = "PHPSESSID=NULL;path=/;SameSite=Lax";
}

function forceLogoutReset() {
  resetApplicationState();
  deleteAllCookies();
  clearStoredCredentials();
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
    null
  }
  try {
    window.sessionStorage.clear();
  } catch (err) {
    null
  }
}

async function loadDashboard({ silent = false } = {}) {
  if (!silent && loginStatus) {
    setUserIdentity("Loading...");
    loginStatus.innerHTML = "<i class='fa-solid fa-hourglass fa-spin'></i> <span class='fa-fade'>Checking if you are already logged in...</span>";
  }
  if (!silent) setLoginControlsDisabled(true);

  let info;
  try {
    info = await apiInfo();
  } catch (err) {
    info = { success: false };
  }

  if (!info.success) {
    const storedUsername = getStoredUsername();
    const storedPassword = getStoredPassword();

    if (storedUsername && storedPassword) {
      if (!silent && loginStatus) {
        loginStatus.innerHTML = "<i class='fa-solid fa-hourglass fa-spin'></i> <span class='fa-fade'>Logging you back in...</span>";
      }
      if (!silent) setLoginControlsDisabled(true);

      try {
        const loginResponse = await apiLogin(storedUsername, storedPassword);
        if (loginResponse.success) {
          try {
            info = await apiInfo();
          } catch (err) {
            info = { success: false };
          }
        }
      } catch (err) {
        info = { success: false };
      }
    }
  }

  if (!info.success) {
    resetApplicationState();
    if (!silent && loginStatus) loginStatus.textContent = "";
    if (!silent) setLoginControlsDisabled(false);
    applyRoute("loginFlow");
    return false;
  }

  isLoggedIn = true;
  if (!silent && loginStatus) loginStatus.textContent = "";
  if (!silent) setLoginControlsDisabled(false);
  updateTopPillsVisibility();

  if (accountMenu) accountMenu.classList.remove("hidden");
  if (logoutBtn) logoutBtn.classList.remove("hidden");
  if (dashboardCard) dashboardCard.classList.remove("hidden");
  if (transactionsCard) transactionsCard.classList.remove("hidden");
  if (ctaCard) ctaCard.classList.remove("hidden");
  if (refreshTxnBtn) refreshTxnBtn.classList.remove("hidden");
  if (refreshHistoryBtn) refreshHistoryBtn.classList.remove("hidden");
  updateUserIdentityFromPreference();

  setAccountInfo(info);
  setBalanceDisplay(info.balance);

  await loadTransactions({ showErrors: true });

  const nextRoute = pendingProtectedRoute || resolveRoute(window.location.pathname);
  pendingProtectedRoute = null;
  updateLoginRequiredNotice();
  applyRoute(nextRoute);
  return true;
}

let accountRefreshInterval = null;

function startAccountInfoRefresh() {
  if (accountRefreshInterval) {
    clearInterval(accountRefreshInterval);
  }

  accountRefreshInterval = setInterval(async () => {
    if (isLoggedIn && autoRefreshEnabled) {
      try {
        const info = await apiInfo();
        if (info.success) {
          setAccountInfo(info);
          setBalanceDisplay(info.balance);
        }
      } catch (err) {
        null
      }
    }
  }, 30000);
}

function stopAccountInfoRefresh() {
  if (accountRefreshInterval) {
    clearInterval(accountRefreshInterval);
    accountRefreshInterval = null;
  }
}

function updateDeleteCredentialsButtonState() {
  const deleteCredentialsBtn = document.getElementById("deleteCredentialsBtn");
  if (!deleteCredentialsBtn) return;
  
  const rememberUsername = getRememberUsernamePreference();
  const rememberPassword = getRememberPasswordPreference();
  const hasCredentials = rememberUsername || rememberPassword;
  
  deleteCredentialsBtn.disabled = !hasCredentials;
  deleteCredentialsBtn.title = hasCredentials 
    ? "This does not log you out." 
    : "You didn't choose to remember any credentials!";

  deleteCredentialsBtn.innerHTML = hasCredentials
    ? '<i class="fa-solid fa-trash"></i> Delete stored credentials'
    : '<i class="fa-solid fa-trash"></i> No credentials stored';
}

if (loginForm) {
  const rememberUsernameBtn = document.getElementById("rememberUsername");
  const rememberPasswordBtn = document.getElementById("rememberPassword");

  if (rememberUsernameBtn) {
    if (getRememberUsernamePreference()) {
      rememberUsernameBtn.classList.add("active");
      if (usernameInput) usernameInput.value = getStoredUsername();
    } else {
      rememberUsernameBtn.classList.remove("active");
    }
  }
  
  if (rememberPasswordBtn) {
    if (getRememberPasswordPreference()) {
      rememberPasswordBtn.classList.add("active");
      if (passwordInput) passwordInput.value = getStoredPassword();
    } else {
      rememberPasswordBtn.classList.remove("active");
    }
  }

  if (rememberUsernameBtn) {
    rememberUsernameBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      rememberUsernameBtn.classList.toggle("active");
      const isActive = rememberUsernameBtn.classList.contains("active");
      setRememberUsernamePreference(isActive);
      updateDeleteCredentialsButtonState();
    });
  }

  if (rememberPasswordBtn) {
    rememberPasswordBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      rememberPasswordBtn.classList.toggle("active");
      const isActive = rememberPasswordBtn.classList.contains("active");
      setRememberPasswordPreference(isActive);
      updateDeleteCredentialsButtonState();
    });
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginStatus.classList.remove("status-error");
    loginStatus.innerHTML = "<i class='fa-solid fa-hourglass fa-spin'></i> <span class='fa-fade'>Logging in...</span>";
    setLoginControlsDisabled(true);
    const username = usernameInput ? usernameInput.value : "";
    const password = passwordInput ? passwordInput.value : "";
    let response;
    try {
      response = await apiLogin(username, password);
    } catch (err) {
      loginStatus.classList.add("status-error");
      loginStatus.innerHTML = `Unable to log in right now. Please try again later, check your internet connection, or <a href="https://status.mypayindia.com/" target="_blank" rel="noopener">check our status page</a><br><br>Error: ${err.message || err}`;
      setLoginControlsDisabled(false);
      return;
    }

    if (!response.success) {
      loginStatus.classList.add("status-error"); loginStatus.textContent = response.message;
      setLoginControlsDisabled(false);
      return;
    }

    if (rememberUsernameBtn?.classList.contains("active")) {
      try {
        window.localStorage.setItem(STORED_USERNAME_KEY, username);
      } catch (err) {
        null
      }
    } else {
      try {
        window.localStorage.removeItem(STORED_USERNAME_KEY);
      } catch (err) {
        null
      }
    }
    if (rememberPasswordBtn?.classList.contains("active")) {
      try {
        window.localStorage.setItem(STORED_PASSWORD_KEY, password);
      } catch (err) {
        null
      }
    } else {
      try {
        window.localStorage.removeItem(STORED_PASSWORD_KEY);
      } catch (err) {
        null
      }
    }

    loginStatus.innerHTML = '<i class="fa-solid fa-check fa-fade" style="color: #00ff00;"></i> Logged in successfully - welcome back!';
    let ok = false;
    try {
      ok = await loadDashboard({ silent: true });
    } finally {
      setLoginControlsDisabled(false);
    }
    if (ok) {
      startAccountInfoRefresh();
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
    try {
      await fetch(`https://pr.app.mypayindia.com/api/logout?cachebuster=${cachebuster}`, {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      null
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
  refreshTransactions: () => loadTransactions({ showErrors: false }),
  getRecentRecipients: () => getRecentTransactionRecipients()
};
if (displayPrefUsername) {
  displayPrefUsername.addEventListener("change", () => {
    if (displayPrefUsername.checked) setDisplayNamePreference("username");
    updateSettingsUIState();
  });
}
if (displayPrefFirst) {
  displayPrefFirst.addEventListener("change", () => {
    if (displayPrefFirst.checked) setDisplayNamePreference("first");
    updateSettingsUIState();
  });
}
if (displayPrefFull) {
  displayPrefFull.addEventListener("change", () => {
    if (displayPrefFull.checked) setDisplayNamePreference("full");
    updateSettingsUIState();
  });
}
if (autoRefreshToggle) {
  autoRefreshToggle.addEventListener("change", () => {
    autoRefreshEnabled = autoRefreshToggle.checked;
    setStoredAutoRefreshPreference(autoRefreshEnabled);
  });
}

const deleteCredentialsBtn = document.getElementById("deleteCredentialsBtn");
if (deleteCredentialsBtn) {
  updateDeleteCredentialsButtonState();
  deleteCredentialsBtn.addEventListener("click", () => {
    if (confirm("This does not log you out, or remove your cookies, it will only delete the credential keys from local storage. Are you sure?")) {
      clearStoredCredentials();
      const originalText = deleteCredentialsBtn.innerHTML;
      deleteCredentialsBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #00ff00;"></i> Credentials deleted';
      deleteCredentialsBtn.disabled = true;
      setTimeout(() => {
        deleteCredentialsBtn.innerHTML = originalText;
        deleteCredentialsBtn.disabled = false;
        updateDeleteCredentialsButtonState();
      }, 2000);
    }
  });
}

const deleteAllKeysBtn = document.getElementById("deleteAllKeysBtn");
if (deleteAllKeysBtn) {
  deleteAllKeysBtn.addEventListener("click", () => {
    if (confirm("This will delete all local keys, including credentials (if you chose to retain them), your chosen theme, and onboarding status. If you didn't choose to retain your credentials, this won't do much for you except force the onboarding flow to show again. Continue?")) {
      try {
        window.localStorage.clear();
      } catch (err) {
        null
      }
      const originalText = deleteAllKeysBtn.innerHTML;
      deleteAllKeysBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #00ff00;"></i> All data deleted';
      deleteAllKeysBtn.disabled = true;
      setTimeout(() => {
        deleteAllKeysBtn.innerHTML = originalText;
        deleteAllKeysBtn.disabled = false;
      }, 2000);
    }
  });
}

loadDashboard().then((loggedIn) => {
  if (loggedIn) {
    startAccountInfoRefresh();
  }
});
