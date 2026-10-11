(function () {
  "use strict";
  if (window.siteTheme) return;
  const key = "team1241-theme", root = document.documentElement;
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const valid = value => value === "dark" || value === "light";
  let saved = null;
  try { saved = localStorage.getItem(key); } catch {}
  const parameter = new URLSearchParams(location.search).get("theme");
  let preference = valid(parameter) ? parameter : valid(saved) ? saved : null;
  const darkColors = {
    "#16283b": "#e4ecf5", "#5b7186": "#a5b6c8", "#c7d5de": "#3e5368",
    "#fbfdfe": "#1e3044", "#eef3f6": "#1e3044", "#e4edf2": "#293e54",
    "#e5edf1": "#293e54", "#dce6ec": "#213246", "#0b8f6b": "#55d4ab",
    "#e07b1f": "#ffb56b", "#7a4fd0": "#c5a8ff", "#2076c7": "#85bffc",
    "#c53b35": "#ff918d", "#dff3ec": "#153d36", "#fbeedd": "#403124",
    "#efe8fb": "#332a49", "#dfebf8": "#1d3652", "#f9e5e3": "#442b31"
  };
  const lightColors = Object.fromEntries(Object.entries(darkColors).map(([light,dark]) => [dark,light]));
  function color(value) {
    return root.dataset.theme === "dark" && typeof value === "string"
      ? darkColors[value.toLowerCase()] || value : value;
  }
  function apply(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    root.style.backgroundColor = theme === "dark" ? "#111720" : "#F4F7F9";
    document.querySelectorAll("[data-theme-toggle]").forEach(button => {
      const dark = theme === "dark";
      button.setAttribute("aria-pressed", String(dark));
      button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      button.textContent = dark ? "☀ Light mode" : "☾ Dark mode";
    });
    document.querySelectorAll("a[href]").forEach(link => updateLink(link, theme));
    document.querySelectorAll("canvas").forEach(canvas => canvas._redraw?.());
    window.dispatchEvent(new CustomEvent("site-theme-change", {detail: {theme}}));
  }
  // Propagate the preference on file links too, where storage can be per-file.
  function updateLink(link, theme) {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const target = new URL(href, location.href);
      if (target.protocol !== location.protocol || target.host !== location.host) return;
      if (!target.pathname.endsWith(".html") && !target.pathname.endsWith("/")) return;
      target.searchParams.set("theme", theme);
      link.setAttribute("href", location.protocol === "file:" ? target.href : target.pathname + target.search + target.hash);
  }
  window.siteTheme = {
    get: () => root.dataset.theme,
    set(theme) {
      if (!valid(theme)) return;
      preference = theme;
      try { localStorage.setItem(key, theme); } catch {}
      const current = new URL(location.href);
      if (current.searchParams.has("theme")) {
        current.searchParams.set("theme", theme);
        try { history.replaceState(null, "", current.href); } catch {}
      }
      apply(theme);
    },
    color,
    palette(values) {
      const original = Object.fromEntries(Object.entries(values).map(([name,value]) =>
        [name, typeof value === "string" ? lightColors[value.toLowerCase()] || value : value]));
      return new Proxy(original, {get: (target,name) => color(target[name])});
    }
  };
  apply(preference || (system.matches ? "dark" : "light"));
  function bind() {
    document.querySelectorAll("[data-theme-toggle]").forEach(button => {
      button.addEventListener("click", () => window.siteTheme.set(root.dataset.theme === "dark" ? "light" : "dark"));
    });
    apply(root.dataset.theme);
  }
  document.addEventListener("click", event => {
    const link = event.target.closest?.("a[href]");
    if (link) updateLink(link, root.dataset.theme);
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind, {once:true});
  else bind();
  window.addEventListener("storage", event => {
    if (event.key !== key) return;
    preference = valid(event.newValue) ? event.newValue : null;
    apply(preference || (system.matches ? "dark" : "light"));
  });
  system.addEventListener("change", event => {
    if (!preference) apply(event.matches ? "dark" : "light");
  });
})();
