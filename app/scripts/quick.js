function setStatus(node, message, tone) {
  if (!node) return;
  node.classList.add("fa-fade");
  node.classList.remove("status-success", "status-error");
  if (tone === "success") {node.classList.add("status-success");node.classList.remove("fa-fade");}
  if (tone === "error") {node.classList.add("status-error");node.classList.remove("fa-fade");}
  node.innerHTML = message || "";
}

function initQuickActions() {
  const app = window.MyPayApp || {};
  const transferForm = document.getElementById("transferForm");
  const paymentLinkForm = document.getElementById("paymentLinkForm");
  const lookupLinkForm = document.getElementById("lookupLinkForm");
  const recentRecipientsContainer = document.getElementById("recentRecipients");
  const recipientInput = transferForm ? transferForm.querySelector("input[name='recipient']") : null;

  const transferStatus = document.getElementById("transferStatus");
  const paymentLinkStatus = document.getElementById("paymentLinkStatus");
  const lookupLinkStatus = document.getElementById("lookupLinkStatus");

  const paymentLinkResult = document.getElementById("paymentLinkResult");
  const paymentLinkResultText = document.getElementById("paymentLinkResultText");
  const paymentLinkCopyBtn = document.getElementById("paymentLinkCopyBtn");
  const lookupResult = document.getElementById("lookupResult");
  const lookupAmount = document.getElementById("lookupAmount");
  const lookupAuthor = document.getElementById("lookupAuthor");
  const lookupNote = document.getElementById("lookupNote");
  const lookupPayBtn = document.getElementById("lookupPayBtn");
  let paymentLinkCopyValue = "";

  const hidePaymentResult = () => {
    paymentLinkCopyValue = "";
    if (paymentLinkResult) paymentLinkResult.classList.add("hidden");
    if (paymentLinkResultText) paymentLinkResultText.textContent = "";
    if (paymentLinkCopyBtn) paymentLinkCopyBtn.disabled = true;
  };

  const showPaymentResult = (text, value) => {
    if (paymentLinkResultText) paymentLinkResultText.textContent = text;
    if (paymentLinkResult) paymentLinkResult.classList.remove("hidden");
    paymentLinkCopyValue = value;
    if (paymentLinkCopyBtn) paymentLinkCopyBtn.disabled = !value;
  };

  const RECENT_RECIPIENTS_KEY = "mypayindia.recentRecipients";
  const RECENT_RECIPIENTS_EVENT = "recentRecipientsUpdate";

  const getStoredRecipients = () => {
    try {
      const stored = localStorage.getItem(RECENT_RECIPIENTS_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string" && value.trim()) : [];
    } catch (err) {
      return [];
    }
  };

  const storeRecipients = (list) => {
    try {
      localStorage.setItem(
        RECENT_RECIPIENTS_KEY,
        JSON.stringify(Array.isArray(list) ? list.map((value) => (value || "").trim()).filter(Boolean).slice(0, 5) : [])
      );
    } catch (err) {
      // ignore storage issues
    }
  };

  const getAppRecentRecipients = () => {
    try {
      if (typeof app.getRecentRecipients !== "function") return [];
      const result = app.getRecentRecipients() || [];
      if (!Array.isArray(result)) return [];
      return result
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null;
          const value = typeof entry.value === "string" ? entry.value.trim() : "";
          if (!value) return null;
          const label =
            typeof entry.label === "string" && entry.label.trim() ? entry.label.trim() : value;
          const lastDate = entry.lastDate || entry.created || null;
          return { value, label, lastDate };
        })
        .filter(Boolean);
    } catch (err) {
      return [];
    }
  };

  const getRecipientsForDisplay = () => {
    const normalizeEntry = (entry) => {
      if (!entry) return null;
      const base = typeof entry === "string" ? { value: entry } : entry;
      const value = typeof base.value === "string" ? base.value.trim() : "";
      if (!value) return null;
      const label =
        typeof base.label === "string" && base.label.trim() ? base.label.trim() : value;
      const lastDate = base.lastDate || null;
      return { value, label, lastDate };
    };

    const combined = [];
    const seen = new Set();

    getAppRecentRecipients().forEach((entry) => {
      const normalized = normalizeEntry(entry);
      if (!normalized) return;
      const key = normalized.value.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      combined.push(normalized);
    });

    getStoredRecipients().forEach((entry) => {
      const normalized = normalizeEntry(entry);
      if (!normalized) return;
      const key = normalized.value.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      combined.push(normalized);
    });

    return combined.slice(0, 5);
  };

  const rememberRecipient = (value) => {
    const trimmed = (value || "").trim();
    if (!trimmed) return;
    const existing = getStoredRecipients().filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
    existing.unshift(trimmed);
    storeRecipients(existing);
    renderRecentRecipients();
  };

  const formatLastTransactionDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  };

  const buildRecipientTitle = (entry) => {
    const formattedDate = formatLastTransactionDate(entry.lastDate);
    if (formattedDate) {
      return `Your last transaction with them was on ${formattedDate}`;
    }
    return `Start a new transaction with ${entry.label}`;
  };

  const renderRecentRecipients = () => {
    if (!recentRecipientsContainer) return;
    const recipients = getRecipientsForDisplay();
    recentRecipientsContainer.innerHTML = "";
    if (!recipients.length) {
      recentRecipientsContainer.classList.add("hidden");
      return;
    }
    recipients.forEach((recipient) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "recent-recipient-btn";
      btn.dataset.value = recipient.value;
      btn.title = buildRecipientTitle(recipient);
      btn.setAttribute("aria-label", `Transfer to ${recipient.label}`);
      btn.textContent = recipient.label;
      recentRecipientsContainer.appendChild(btn);
    });
    recentRecipientsContainer.classList.remove("hidden");
  };

  if (recentRecipientsContainer) {
    recentRecipientsContainer.addEventListener("click", (event) => {
      const clickTarget = event.target;
      const target = clickTarget instanceof Element ? clickTarget.closest(".recent-recipient-btn") : null;
      if (!target) return;
      const value = target.dataset.value;
      if (recipientInput && value) {
        recipientInput.value = value;
        recipientInput.focus();
      }
    });
    if (typeof window !== "undefined") {
      window.addEventListener(RECENT_RECIPIENTS_EVENT, () => renderRecentRecipients());
    }
    renderRecentRecipients();
  }

  hidePaymentResult();
  if (lookupResult) lookupResult.classList.add("hidden");
  if (lookupPayBtn) lookupPayBtn.classList.add("hidden");

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "";
    return app.formatCurrency ? app.formatCurrency(value) : value;
  };

  const hideLookupResult = () => {
    if (lookupResult) lookupResult.classList.add("hidden");
    if (lookupPayBtn) {
      lookupPayBtn.classList.add("hidden");
      lookupPayBtn.removeAttribute("href");
    }
  };

  const showLookupResult = (res, token) => {
    if (!lookupResult) return;
    const amountText = formatCurrency(res.amount);
    if (lookupAmount) lookupAmount.textContent = amountText || "₹0.00";

    const authorText = res.author_username ? `@${res.author_username}` : "Unknown author";
    if (lookupAuthor) lookupAuthor.textContent = authorText;

    const hasNote = Boolean(res.note && res.note.trim());
    const noteText = hasNote ? res.note : "No note";
    if (lookupNote) {
      lookupNote.textContent = noteText;
      lookupNote.classList.toggle("muted", !hasNote);
    }

    if (lookupPayBtn) {
      const linkToken = ((res.token || token || "") + "").trim();
      if (res.can_accept && linkToken) {
        const linkUrl = `https://mypayindia.com/pay/link?token=${encodeURIComponent(linkToken)}`;
        lookupPayBtn.href = linkUrl;
        lookupPayBtn.classList.remove("hidden");
      } else {
        lookupPayBtn.classList.add("hidden");
        lookupPayBtn.removeAttribute("href");
      }
    }

    lookupResult.classList.remove("hidden");
  };

  const formatLookupStatus = (res) => {
    if (res.can_accept) {
      return {
        message: "You can accept this payment!",
        tone: "success"
      };
    }
    if (res.cannot_accept_reason) {
      const friendlyMap = {
        own_link: "This is your own link - it cannot be accepted"
      };
      return {
        message: friendlyMap[res.cannot_accept_reason] || res.cannot_accept_reason,
        tone: "error"
      };
    }
    return {
      message: "Link info loaded",
      tone: "success"
    };
  };

  if (paymentLinkCopyBtn) {
    paymentLinkCopyBtn.addEventListener("click", async () => {
      if (!paymentLinkCopyValue) return;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(paymentLinkCopyValue);
        } else {
          const temp = document.createElement("textarea");
          temp.value = paymentLinkCopyValue;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);
        }
        paymentLinkCopyBtn.classList.add("status-success");
        setTimeout(() => paymentLinkCopyBtn.classList.remove("status-success"), 800);
      } catch (err) {
        paymentLinkCopyBtn.classList.add("status-error");
        setTimeout(() => paymentLinkCopyBtn.classList.remove("status-error"), 1000);
      }
    });
  }

  if (transferForm) {
    transferForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!app.ensureAuthenticatedAction || !app.ensureAuthenticatedAction("transfer")) return;
      const data = new FormData(transferForm);
      const payload = {
        amount: data.get("amount"),
        recipient: data.get("recipient"),
        note: data.get("note")
      };
      setStatus(transferStatus, "<i class='fa-solid fa-hourglass fa-spin'></i> Transfer in progress...");
      try {
        const res = await apiTransfer(payload);
        if (!res.success) {
          setStatus(transferStatus, res.message || "Transfer failed", "error");
          return;
        }
        if (res.new_balance && app.updateBalance) {
          app.updateBalance(res.new_balance);
        }
        rememberRecipient(payload.recipient);
        setStatus(
          transferStatus,
          `Sent ${app.formatCurrency ? app.formatCurrency(payload.amount) : payload.amount}`,
          "success"
        );
        transferForm.reset();
        if (app.refreshTransactions) app.refreshTransactions();
      } catch (err) {
        setStatus(transferStatus, "Transfer failed", "error");
      }
    });
  }

  if (paymentLinkForm) {
    paymentLinkForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hidePaymentResult();
      if (!app.ensureAuthenticatedAction || !app.ensureAuthenticatedAction("paymentLink")) return;
      const data = new FormData(paymentLinkForm);
      const payload = {
        amount: data.get("amount"),
        note: data.get("note")
      };
      setStatus(paymentLinkStatus, "<i class='fa-solid fa-hourglass fa-spin'></i> <span class='fa-fade'>Creating link...</span>");
      try {
        const res = await apiCreatePaymentLink(payload);
        if (!res.success) {
          setStatus(paymentLinkStatus, res.message || "Unable to create link", "error");
          return;
        }
        paymentLinkForm.reset();
        const info = res.link_url || (res.token ? `Token: ${res.token}` : "Link created");
        setStatus(paymentLinkStatus, "Link ready!", "success");
        showPaymentResult(info, res.link_url || res.token || info);
        if (res.new_balance && app.updateBalance) {
          app.updateBalance(res.new_balance);
        }
      } catch (err) {
        setStatus(paymentLinkStatus, "Unable to create link", "error");
      }
    });
  }

  if (lookupLinkForm) {
    lookupLinkForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(lookupLinkForm);
      const rawToken = (data.get("token") || "").trim();
      const tokenMatch = rawToken.match(/token=([^&\s]+)/i);
      const token = (tokenMatch ? tokenMatch[1] : rawToken.replace(/^https?:\/\/mypayindia\.com\/pay\/link\?token=/i, "")).trim();
      if (!token) {
        setStatus(lookupLinkStatus, "Enter a token", "error");
        return;
      }
      hideLookupResult();
      setStatus(lookupLinkStatus, "<i class='fa-solid fa-hourglass fa-spin'></i> <span class='fa-fade'>Retrieving data...</span>");
      try {
        const res = await apiGetPaymentLink(token);
        if (!res.success) {
          const errorMessages = {
            400: "Missing token",
            404: "This payment link does not exist",
            410:
              res.error === "already_claimed"
                ? "This payment link has already been claimed"
                : "This payment link has been retracted by the sender"
          };
          const errorMessage = errorMessages[res.status] || res.message || "Link not found";
          setStatus(lookupLinkStatus, errorMessage, "error");
          return;
        }
        showLookupResult(res, token);
        const status = formatLookupStatus(res);
        setStatus(lookupLinkStatus, status.message, status.tone);
      } catch (err) {
        setStatus(lookupLinkStatus, "Unable to lookup link", "error");
      }
    });
  }

}

initQuickActions();

