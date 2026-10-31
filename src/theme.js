const root = document.documentElement;
const toggle = document.querySelector("[data-theme-toggle]");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme, persist = false) {
  const selected = theme === "light" ? "light" : "dark";
  root.dataset.theme = selected;

  if (themeMeta) {
    themeMeta.setAttribute("content", selected === "dark" ? "#121822" : "#f6f4ef");
  }

  if (toggle) {
    const isLight = selected === "light";
    toggle.textContent = isLight ? "Ativar modo escuro" : "Ativar modo claro";
    toggle.setAttribute("aria-pressed", String(isLight));
    toggle.setAttribute("aria-label", isLight ? "Ativar modo escuro" : "Ativar modo claro");
  }

  if (persist) {
    try {
      localStorage.setItem("pratoDeCaoTema", selected);
    } catch {
      // A preferência continua aplicada nesta página mesmo sem armazenamento local.
    }
  }
}

applyTheme(root.dataset.theme);

toggle?.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
});

window.addEventListener("storage", event => {
  if (event.key === "pratoDeCaoTema" && (event.newValue === "light" || event.newValue === "dark")) {
    applyTheme(event.newValue);
  }
});
