(function () {
  "use strict";
  const query = new URLSearchParams(location.search).get("search");
  if (!query || !query.trim()) return;
  const term = query.trim(), needle = term.toLocaleLowerCase();
  const excluded = "script,style,noscript,textarea,input,select,option,button,canvas,svg,.search-matchbar";
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim() || node.parentElement.closest(excluded)) return NodeFilter.FILTER_REJECT;
      return node.nodeValue.toLocaleLowerCase().includes(needle) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [], matches = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const text = node.nodeValue, lower = text.toLocaleLowerCase(), fragment = document.createDocumentFragment();
    let cursor = 0, found = lower.indexOf(needle);
    while (found !== -1) {
      fragment.append(text.slice(cursor, found));
      const mark = document.createElement("mark");
      mark.className = "lesson-search-match";
      mark.textContent = text.slice(found, found + term.length);
      fragment.append(mark); matches.push(mark);
      cursor = found + term.length; found = lower.indexOf(needle, cursor);
    }
    fragment.append(text.slice(cursor)); node.replaceWith(fragment);
  });
  if (!matches.length) return;
  const style = document.createElement("style");
  style.textContent = "mark.lesson-search-match{background:#FFE58A;color:#16283B;border-radius:3px;padding:0 .12em;box-shadow:0 0 0 1px #D5A900}mark.lesson-search-match.current{background:#FFB84D;box-shadow:0 0 0 3px rgba(224,123,31,.28)}.search-matchbar{position:fixed;z-index:9999;top:14px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;max-width:calc(100vw - 24px);padding:8px 10px;background:#fff;border:1px solid #C7D5DE;border-radius:10px;box-shadow:0 10px 30px rgba(22,40,59,.2);font:600 12px 'IBM Plex Mono',monospace;color:#16283B}.search-matchbar .search-term{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px}.search-matchbar button{display:grid;place-items:center;min-width:34px;height:32px;padding:0 9px;border:0;border-radius:7px;background:#16283B;color:#fff;font:600 14px 'IBM Plex Mono',monospace;cursor:pointer}.search-matchbar button:hover{background:#0B8F6B}@media(max-width:540px){.search-matchbar{top:8px}.search-matchbar .search-term{max-width:115px}}";
  document.head.append(style);
  const bar = document.createElement("div");
  bar.className = "search-matchbar"; bar.setAttribute("role", "search");
  bar.innerHTML = '<span class="search-term"></span><span class="search-count"></span><button type="button" data-action="prev" aria-label="Previous match">↑</button><button type="button" data-action="next" aria-label="Next match">↓</button><button type="button" data-action="clear" aria-label="Clear search highlights">×</button>';
  bar.querySelector(".search-term").textContent = "“" + term + "”";
  document.body.append(bar);
  let current = 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function show(index) {
    matches[current].classList.remove("current");
    current = (index + matches.length) % matches.length;
    matches[current].classList.add("current");
    bar.querySelector(".search-count").textContent = (current + 1) + " of " + matches.length;
    matches[current].scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }
  function clear() {
    matches.forEach(mark => mark.replaceWith(document.createTextNode(mark.textContent)));
    bar.remove();
    const url = new URL(location.href); url.searchParams.delete("search");
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }
  bar.addEventListener("click", event => {
    const action = event.target.closest("button")?.dataset.action;
    if (action === "prev") show(current - 1);
    if (action === "next") show(current + 1);
    if (action === "clear") clear();
  });
  matches[0].classList.add("current");
  bar.querySelector(".search-count").textContent = "1 of " + matches.length;
  requestAnimationFrame(() => requestAnimationFrame(() => matches[0].scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" })));
})();
