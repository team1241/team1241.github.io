(function () {
  "use strict";
  const root = document.getElementById("searchEasterEgg");
  const title = root.querySelector(".egg-title"), caption = root.querySelector(".egg-caption");
  const stage = root.querySelector(".egg-stage"), button = root.querySelector(".egg-action");
  const credit = root.querySelector(".egg-credit"), overlay = document.getElementById("searchEggOverlay");
  let current = null, timer = 0;
  const normalize = query => query.toLowerCase().trim().replace(/[\s_-]+/g, " ").replace(/[!?.,]+$/g, "");
  // Every effect also accepts its own short name and displayed title as an exact search.
  for(const egg of window.searchEggCatalog)egg.exactTriggers=[...new Set([...(egg.exactTriggers||[]),normalize(window.searchEggScenes.get(egg.key).kind),normalize(egg.title)])];
  function identify(query) {
    const phrase = normalize(query);
    if (/^(among ?us|amogus|amoung us|amung us|sus|sussy|impostor|imposter|crewmate)$/.test(phrase)) return "crew";
    // Prefer the most specific phrase; short ambiguous words such as CAN only match the whole query.
    const padded = " " + phrase + " ";
    const matches = window.searchEggCatalog.flatMap(egg => [
      ...egg.triggers.filter(trigger => trigger === phrase || (trigger.length >= 5 && padded.includes(" " + trigger + " "))),
      ...egg.exactTriggers.filter(trigger => trigger === phrase)
    ].map(trigger => ({key:egg.key,length:trigger.length})));
    return matches.sort((a,b)=>b.length-a.length)[0]?.key || null;
  }
  function stop() {
    clearTimeout(timer);
    overlay.hidden = true;
    overlay.innerHTML = "";
  }
  function play() {
    stop();
    if (!current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    overlay.innerHTML = window.searchEggEffects.render(current);
    overlay.hidden = false;
    button.textContent = "Replay effect";
    timer = setTimeout(stop, window.searchEggEffects.duration(current));
  }
  window.searchEasterEgg = {
    show(query) {
      const next = identify(query);
      root.hidden = !next;
      if (next === current) return !!next;
      stop();
      current = next;
      window.searchTeamStats?.clear();
      stage.hidden = true; stage.innerHTML = "";
      if (!next) return false;
      const scene = window.searchEggScenes.get(next);
      window.searchTeamStats?.show(scene.kind);
      title.textContent = next === "crew" ? "Emergency meeting!" : window.searchEggCatalog.find(egg => egg.key === next).title;
      caption.textContent = next === "crew" ? scene.beats[1] : scene.beats[3];
      button.textContent = "Show effect";
      button.hidden = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      credit.hidden = !["bench", "quest", "nathan"].includes(scene.kind);
      play();
      return true;
    },
  };
  button.addEventListener("click", play);
  document.getElementById("lessonSearch").addEventListener("input", event => {
    if (identify(event.target.value) !== current) {stop(); window.searchTeamStats?.clear(); root.hidden = true; current = null;}
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {stop(); window.searchTeamStats?.clear(); root.hidden = true; current = null;}
  });
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motionPreference.addEventListener) motionPreference.addEventListener("change", event => {
    button.hidden = event.matches;
    if (event.matches) stop();
  });
})();
