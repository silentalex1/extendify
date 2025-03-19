class ExtensionHub {
  constructor() {
    this.elements = {
      btn: document.getElementById("installBtn"),
      input: document.getElementById("repoUrl"),
      status: document.getElementById("status"),
      history: document.getElementById("history")
    };
    this.token = localStorage.getItem('jwt_token');
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadHistory();
  }

  bindEvents() {
    this.elements.btn.addEventListener("click", () => this.install());
    this.elements.input.addEventListener("keypress", e => e.key === "Enter" && this.install());
  }

  async apiRequest(endpoint, method = 'GET', body = null) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);
    
    const response = await fetch(`/api${endpoint}`, config);
    return response.json();
  }

  toggleLoading(state) {
    this.elements.btn.disabled = state;
    this.elements.btn.classList.toggle("loading", state);
  }

  showStatus(message, type) {
    this.elements.status.textContent = message;
    this.elements.status.style.color = `var(--${type})`;
    this.elements.status.classList.add("visible");
    setTimeout(() => this.elements.status.classList.remove("visible"), 10000);
  }

  renderHistory(history) {
    this.elements.history.innerHTML = history.map(item => `
      <div class="history-item">
        ${item.repoUrl} (${item.browser}) - 
        ${new Date(item.timestamp).toLocaleString()} 
        [${item.status}]
        <span onclick="extensionHub.install('${item.repoUrl}')">Retry</span>
      </div>
    `).join("");
    this.elements.history.classList.add("visible");
  }

  async install(url = this.elements.input.value.trim()) {
    if (!/^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/.test(url)) {
      return this.showStatus("Invalid GitHub URL format", "error");
    }

    this.toggleLoading(true);
    this.showStatus("Installing...", "primary");

    try {
      const result = await this.apiRequest('/install', 'POST', { repoUrl: url });
      if (result.success) {
        this.showStatus("Extension ready! Check downloads", "success");
        this.downloadFile(result.downloadUrl);
        this.elements.input.value = "";
        await this.loadHistory();
      } else {
        this.showStatus(result.message || "Installation failed", "error");
      }
    } catch (error) {
      this.showStatus(`Error: ${error.message}`, "error");
    } finally {
      this.toggleLoading(false);
    }
  }

  downloadFile(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async loadHistory() {
    const history = await this.apiRequest('/history');
    this.renderHistory(history);
  }
}

const extensionHub = new ExtensionHub();
window.extensionHub = extensionHub;
