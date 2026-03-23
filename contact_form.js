const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz3Qnld645_AkZfjwpXvmIdtTU7sx9LGgsMG3YfWZTnUPlOwWZEFn_lhiGctqPhkliU/exec";

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const submitButton = form ? form.querySelector('button[type="submit"]') : null;

function setStatus(message, type) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.remove("is-success", "is-error");
  if (type) {
    statusEl.classList.add(type);
  }
}

if (form && submitButton) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("必須項目を入力してください。", "is-error");
      return;
    }

    if (GAS_WEB_APP_URL.includes("REPLACE_WITH_YOUR_DEPLOYMENT_ID")) {
      setStatus("GASのURLが未設定です。contact_form.js を設定してください。", "is-error");
      return;
    }

    const formData = new FormData(form);
    const body = new URLSearchParams();
    body.append("name", formData.get("name") || "");
    body.append("phone", formData.get("phone") || "");
    body.append("email", formData.get("email") || "");
    body.append("category", formData.get("category") || "");
    body.append("message", formData.get("message") || "");

    submitButton.disabled = true;
    setStatus("送信中です...", null);

    try {
      await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        body,
      });
      form.reset();
      setStatus("送信ありがとうございました。なるべくはやく返信します。", "is-success");
    } catch (error) {
      setStatus("送信に失敗しました。時間をおいて再度お試しください。", "is-error");
    } finally {
      submitButton.disabled = false;
    }
  });
}
