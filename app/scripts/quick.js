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

