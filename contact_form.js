// あなたのGASのURLに書き換えてください
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxQxyNEVsRo7L2Kbws25Jglbv9Uno6iPMlCQTI5TYtQ59HV2W2fjkhLuI05cBStTR_w/exec";

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const submitButton = form ? form.querySelector('button[type="submit"]') : null;

function setStatus(message, type) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.display = "block";
  
  // 色の切り替え
  if (type === "is-success") {
    statusEl.style.color = "#8FAF8F"; // セージグリーン
  } else if (type === "is-error") {
    statusEl.style.color = "#d9534f"; // レッド
  } else {
    statusEl.style.color = "#8A7060"; // 通常
  }
}

if (form && submitButton) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // バリデーションチェック
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("必須項目をすべて入力してください。", "is-error");
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
      // GASへデータを送信（mode: 'no-cors' はエラー回避のため）
      await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        body,
        mode: "no-cors" 
      });

      // 成功時
      form.reset();
      setStatus("送信ありがとうございました。内容を確認し、早急に返信いたします。", "is-success");
    } catch (error) {
      // 失敗時
      setStatus("送信に失敗しました。ネットワーク環境を確認し、再度お試しください。", "is-error");
      console.error("Error!", error.message);
    } finally {
      submitButton.disabled = false;
    }
  });
}
