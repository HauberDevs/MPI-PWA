function guessServer() {
  const host = window.location.host;
  if (host.includes("localhost") || host.includes("127.0")) {
    return "http://localhost:3000";
  }
  if (host.includes(".staging.mypayindia.com")) {
    return "https://staging.mypayindia.com";
  }

  if (host.includes("app.mypayindia.com")) {
    return "https://mypayindia.com";
  }

  return "http://localhost:3000";
}

const path = guessServer();

async function apiLogin(username, password) {
  const res = await fetch(path + "/api/v1/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password })
  });

  return res.json();
}

async function apiInfo() {
  const res = await fetch(path + "/api/v1/info", {
    credentials: "include"
  });

  return res.json();
}

async function apiTransactions() {
  const res = await fetch(path + "/api/v1/transaction_history", {
    credentials: "include"
  });

  return res.json();
}

async function apiLeaderboard() {
  const res = await fetch(path + "/api/v1/leaderboard", {
    credentials: "include"
  });

  return res.json();
}

async function apiTransfer(payload) {
  const res = await fetch(path + "/api/v1/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  return res.json();
}

async function apiCreatePaymentLink(payload) {
  const res = await fetch(path + "/api/v1/create_payment_link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  return res.json();
}

async function apiGetPaymentLink(token) {
  const res = await fetch(
    path + "/api/v1/get_payment_link?token=" + encodeURIComponent(token),
    { credentials: "include" }
  );

  const data = await res.json();
  return { status: res.status, ...data };
}
