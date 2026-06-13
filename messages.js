function getMessages() {
  const data = localStorage.getItem(CONFIG.MESSAGES_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveMessage(entry) {
  const messages = getMessages();
  messages.unshift({
    id: Date.now(),
    name: entry.name,
    email: entry.email,
    message: entry.message,
    date: new Date().toLocaleString(),
  });
  localStorage.setItem(CONFIG.MESSAGES_STORAGE_KEY, JSON.stringify(messages));
}

async function sendToEmail(entry) {
  if (!CONFIG.WEB3FORMS_ACCESS_KEY) return { ok: true, skipped: true };

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: CONFIG.WEB3FORMS_ACCESS_KEY,
      name: entry.name,
      email: entry.email,
      message: entry.message,
      subject: `New message from ${entry.name} — Brew & Bean`,
    }),
  });

  const result = await response.json();
  return { ok: result.success, skipped: false };
}