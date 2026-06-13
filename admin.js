const SESSION_KEY = "brew_bean_admin";

const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const messagesList = document.getElementById("messages-list");
const noMessages = document.getElementById("no-messages");
const messageCount = document.getElementById("message-count");

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

function showDashboard() {
  loginSection.classList.add("d-none");
  dashboardSection.classList.remove("d-none");
  renderMessages();
}

function showLogin() {
  loginSection.classList.remove("d-none");
  dashboardSection.classList.add("d-none");
  sessionStorage.removeItem(SESSION_KEY);
}

function renderMessages() {
  const messages = getMessages();
  messageCount.textContent = `${messages.length} message${messages.length !== 1 ? "s" : ""}`;

  if (messages.length === 0) {
    noMessages.classList.remove("d-none");
    messagesList.innerHTML = "";
    return;
  }

  noMessages.classList.add("d-none");
  messagesList.innerHTML = messages
    .map(
      (m) => `
    <div class="col-12" data-id="${m.id}">
      <div class="message-card card border-0 shadow-sm">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
            <div>
              <h5 class="fw-bold mb-0">${escapeHtml(m.name)}</h5>
              <a href="mailto:${escapeHtml(m.email)}" class="text-muted small">${escapeHtml(m.email)}</a>
            </div>
            <div class="text-end">
              <span class="text-muted small d-block">${escapeHtml(m.date)}</span>
              <button class="btn btn-sm btn-outline-danger mt-1 delete-btn" data-id="${m.id}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <p class="mb-0 mt-2">${escapeHtml(m.message)}</p>
        </div>
      </div>
    </div>`
    )
    .join("");

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteMessage(parseInt(btn.dataset.id, 10)));
  });
}

function deleteMessage(id) {
  const messages = getMessages().filter((m) => m.id !== id);
  localStorage.setItem(CONFIG.MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  renderMessages();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value;

  if (password === CONFIG.ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "true");
    loginError.classList.add("d-none");
    showDashboard();
  } else {
    loginError.classList.remove("d-none");
  }
});

document.getElementById("logout-btn").addEventListener("click", showLogin);

document.getElementById("clear-btn").addEventListener("click", () => {
  if (confirm("Delete all messages? This cannot be undone.")) {
    localStorage.removeItem(CONFIG.MESSAGES_STORAGE_KEY);
    renderMessages();
  }
});

document.getElementById("export-btn").addEventListener("click", () => {
  const messages = getMessages();
  if (messages.length === 0) return;

  const header = "Date,Name,Email,Message\n";
  const rows = messages
    .map((m) =>
      `"${m.date}","${m.name.replace(/"/g, '""')}","${m.email}","${m.message.replace(/"/g, '""')}"`
    )
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "brew-bean-messages.csv";
  a.click();
  URL.revokeObjectURL(url);
});

if (isLoggedIn()) {
  showDashboard();
}
