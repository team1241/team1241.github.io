(function () {
  "use strict";
  const families = {
    torque:"hardware", bench:"hardware", fit:"hardware", bus:"circuit", quest:"circuit", labels:"circuit", nathan:"idle",
    terminal:"terminal", logs:"terminal", blame:"relay", pid:"feedback", sketch:"blueprint", tree:"blueprint", files:"files", handoff:"files",
    mill:"chips", toolpath:"cnc-path", toolchange:"cnc-tools", probe:"cnc-probe", fixture:"cnc-fixture", lathe:"cnc-lathe", printer:"pasta", field:"drive", swerve:"swerve", controller:"drive", match:"drive",
    alliance:"strategy", whiteboard:"strategy", bars:"data", chart:"data", sample:"data", pitch:"spotlight", budget:"receipts", judge:"spotlight",
    demo:"outreach", blocks:"outreach", recruit:"outreach", ftc:"outreach", photo:"camera", timeline:"timeline", polaroid:"camera",
    cart:"shipping", packing:"shipping", checklist:"shipping", goggles:"scan", captain:"scan", pit:"scan",
    kraken:"motorflux", encoder:"encoder", vision:"vision", theory:"teamshop",
    helpdesk:"coolant", fluid:"coolant", tickets:"coolant", crew:"crew", comeback:"comeback", part:"classified"
  };
  for(const team of window.searchTeamEffects.entries)families["team"+team.number]="visitors";
  const labels = {
    terminal:["BUILD SUCCESSFUL", "ROBOT: ...", "IT WORKS ON MY MACHINE", "DEBUGGING CONFIDENCE: 100%"],
    files:["final.step", "final_FINAL.step", "actual_final.step", "final_really_this_time.step"],
    receipts:["ONE MORE PROTOTYPE", "EXPEDITED SHIPPING", "BUDGET: ouch", "QUOTE REQUEST"],
    shipping:["THIS SIDE UP", "ROBOT PARTS", "WHERE'S THE CART?", "DON'T FORGET CHARGERS"],
    idle:["NATHAN: PLANNING", "WIRES CRIMPED: 0", "CONSULTANT PENDING", "MEETING ABOUT THE MEETING"],
    timeline:["SHOP AUDIO", "DRILL PRESS SOLO", "FIX IT IN POST", "export_final_v7.mp4"],
    relay:["SOFTWARE → ELECTRICAL", "ELECTRICAL → MECHANICAL", "MECHANICAL → SOFTWARE", "IT WAS A UNIT CONVERSION"]
  };
  function particles(family, kind) {
    if(window.searchCncEffects.has(kind)||kind==="torque"||kind==="ftc"||kind==="theory")return ""; // Chips belong at the cutting contact, not across the screen.
    const count = labels[family] ? 8 : 16;
    return Array.from({length:count}, (_,i) => {
      const x=4+(i*37%92), y=8+(i*23%78), delay=(i%6)*.09;
      let graphic="";
      if(labels[family]) graphic=labels[family][i%4];
      else if(family==="chips") graphic='<svg viewBox="0 0 42 42"><path d="M8 9Q32 1 28 20T12 32" fill="none" stroke="currentColor" stroke-width="5"/></svg>';
      else if(family==="hardware") graphic='<svg viewBox="0 0 48 48"><path d="M5 43V5L43 43Z" fill="currentColor"/><circle cx="14" cy="30" r="4" fill="var(--egg-paper)"/></svg>';
      else if(family==="outreach") graphic='<svg viewBox="0 0 48 48"><rect x="4" y="14" width="40" height="28" rx="3" fill="currentColor"/><path d="M12 14V6H20V14M28 14V6H36V14" fill="currentColor"/></svg>';
      else if(family==="data") graphic='<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="6" fill="currentColor"/><path d="M24 2V12M24 36V46M2 24H12M36 24H46" stroke="currentColor"/></svg>';
      else if(family==="coolant") graphic='<svg viewBox="0 0 40 48"><path d="M20 3Q-8 38 20 44Q48 38 20 3" fill="currentColor"/></svg>';
    else if(family==="comeback") graphic='<svg viewBox="0 0 40 48"><path d="M3 43Q0 10 35 3L25 29Z" fill="currentColor"/></svg>';
      else if(family==="circuit") graphic='<span class="egg-can-packet">'+(kind==="bus"?'CAN '+(i%3+1):'WIRE '+(i+1))+'</span>';
      else return "";
      return '<span class="egg-effect-particle" style="--x:'+x+'%;--y:'+y+'%;--delay:'+delay+'s;--drift:'+(i%2?1:-1)+';--turn:'+(i%2?42:-36)+'deg">'+graphic+'</span>';
    }).join("");
  }
  function geometry(family,kind) {
    if(window.searchTeamEffects.has(kind))return window.searchTeamEffects.render(kind);
    if(window.searchComponentEffects.has(kind))return window.searchComponentEffects.render(kind);
    if(kind==="ftc")return '<svg class="egg-ftc-field" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path class="egg-ftc-track" d="M100 724H1320M100 766H1320" fill="none" stroke="#6ba7bd" stroke-width="2" stroke-dasharray="10 14"/><g class="egg-ftc-rover"><rect x="78" y="682" width="95" height="60" rx="8" fill="#699bb8" stroke="#355e77" stroke-width="3"/><path d="M93 682V630H156V682M93 649H156" fill="none" stroke="#a6c5d5" stroke-width="8"/><path d="M102 630L127 611L156 630" fill="none" stroke="#dca953" stroke-width="7"/><g class="egg-ftc-wheels"><circle cx="91" cy="742" r="17" fill="#234253"/><circle cx="159" cy="742" r="17" fill="#234253"/><path d="M82 733L100 751M150 733L168 751" stroke="#c3d9e4" stroke-width="5"/></g><rect x="99" y="693" width="52" height="26" rx="3" fill="#eff6f8"/><text x="125" y="712" text-anchor="middle" font-family="monospace" font-size="17" fill="#355e77">FTC</text></g><g class="egg-ftc-title"><text x="720" y="805" text-anchor="middle" fill="var(--ink)" font-family="monospace" font-size="24">FIRST TECH CHALLENGE</text><text x="720" y="835" text-anchor="middle" fill="var(--ink)" font-family="monospace" font-size="18">COMPACT ROBOT. BIG DEBUGGING ENERGY.</text></g></svg>';
    if(kind==="pit")return '<svg class="egg-pit-floor" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect class="egg-pit-walkway" x="570" y="430" width="300" height="360" rx="18" fill="#57b9900b" stroke="#58b38f" stroke-width="3" stroke-dasharray="14 12"/><path class="egg-pit-loose-cable" d="M110 660H1290" fill="none" stroke="#d59c54" stroke-width="7"/><g class="egg-pit-coil"><g transform="translate(110 660)"><circle r="33" fill="var(--panel)" stroke="#d59c54" stroke-width="5"/><path d="M0 23C-33 23-33-23 0-23S30 18 0 18-24-17 0-17 19 12 0 12-13-10 0-10" fill="none" stroke="#d59c54" stroke-width="4"/><path d="M-6-34V34M6-34V34" stroke="#5a7c8c" stroke-width="3"/></g></g><g class="egg-pit-clear-path"><path d="M720 752V480M701 501L720 480L739 501" fill="none" stroke="#58b38f" stroke-width="6"/><text x="720" y="829" text-anchor="middle" fill="var(--ink)" font-family="monospace" font-size="22">WALKWAY CLEAR</text></g><text class="egg-pit-hazard" x="720" y="615" text-anchor="middle" fill="var(--ink)" font-family="monospace" font-size="22">TRIP HAZARD</text></svg>';
    const paths = Array.from({length:family==="pasta"?9:5},(_,i)=> {
      const y=110+i*140;
      if(family==="pasta")return '<path d="M-30 '+y+'C350 '+(y-220)+' 180 '+(y+240)+' 650 '+y+'S1000 '+(y-160)+' 1490 '+(y+40)+'"/>';
      if(family==="circuit")return '<path d="M-20 '+y+'H'+(280+i*140)+'V'+(y+70)+'H1460"/>';
      if(family==="strategy")return '<path d="M'+(90+i*260)+' 840Q'+(200+i*180)+' 450 '+(100+i*290)+' 80l-16 36m16-36 24 24"/>';
      if(family==="blueprint")return '<path d="M'+(70+i*290)+' 70V830M40 '+y+'H1400"/>';
      return "";
    }).join("");
    let extra="";
    if(family==="drive") extra='<path d="M-80 730Q700 500 1530 680M-80 760Q700 530 1530 710"/><g class="egg-screen-rover"><rect x="30" y="640" width="85" height="60" rx="8"/><path d="M45 630V650M100 630V650M45 690V710M100 690V710" stroke-width="12"/></g>';
    if(family==="camera") extra='<path d="M40 160V40H220M1220 40H1400V160M1400 740V860H1220M220 860H40V740M670 450H770M720 400V500"/>';
    if(family==="blueprint")extra='<circle cx="720" cy="450" r="225"/><circle cx="720" cy="450" r="120"/><path d="M455 450H985M720 185V715"/>';
    if(family==="scan")extra='<rect x="30" y="30" width="1380" height="840" rx="20"/><path class="egg-screen-scanner" d="M50 90H1390"/>';
    if(family==="spotlight")extra='<path class="egg-spotlight" d="M720 -20L250 900H1190Z" fill="currentColor" stroke="none"/>';
    if(family==="feedback")extra='<path class="egg-pid-target" d="M50 360H1390" stroke-dasharray="12 10"/><path class="egg-pid-screen-response" d="M50 700H190C260 700 300 110 390 190S480 580 570 480S650 260 760 310S880 405 980 370S1160 360 1390 360"/>';
    return paths||extra?'<svg class="egg-screen-art" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">'+paths+extra+'</svg>':"";
  }
  function actor(kind) {
    if(window.searchCncEffects.has(kind))return window.searchCncEffects.render(kind);
    let art="";
    if(kind==="photo"||kind==="polaroid")art='<svg viewBox="0 0 660 300"><g class="egg-photo-robot"><ellipse cx="260" cy="252" rx="135" ry="12" fill="#638ca622"/><rect x="142" y="180" width="240" height="48" rx="8" fill="#345569"/><rect x="162" y="146" width="204" height="40" fill="#6bad94"/><path d="M182 146V70H330V146M182 105H330" fill="none" stroke="#8faabd" stroke-width="14"/><path d="M184 72L290 42L330 72" fill="none" stroke="#ddb060" stroke-width="12"/><circle cx="192" cy="228" r="22" fill="#253e50"/><circle cx="338" cy="228" r="22" fill="#253e50"/><circle cx="192" cy="228" r="9" fill="#91afc0"/><circle cx="338" cy="228" r="9" fill="#91afc0"/><circle cx="291" cy="129" r="12" fill="#dabb6c"/></g><g class="egg-hero-camera"><rect x="484" y="128" width="114" height="78" rx="10" fill="#2f4658"/><path d="M502 128V114H550V128" fill="#2f4658"/><circle cx="540" cy="166" r="29" fill="#799eb8"/><circle cx="540" cy="166" r="19" fill="#102d44"/><circle cx="547" cy="160" r="6" fill="#d5e8f3"/><rect x="567" y="139" width="19" height="12" rx="2" fill="#f0ead0"/><g class="egg-camera-flash"><defs><radialGradient id="egg-photo-glow"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><linearGradient id="egg-photo-beam" x1="100%" y1="50%" x2="0" y2="50%"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><path d="M577 145L120 55V246Z" fill="url(#egg-photo-beam)"/><ellipse cx="577" cy="145" rx="110" ry="80" fill="url(#egg-photo-glow)"/><circle cx="577" cy="145" r="8" fill="#fff"/><path d="M577 123V112M577 167V178M555 145H544M599 145H610M561 129L552 120M593 161L602 170" fill="none" stroke="#fff" stroke-width="3"/></g></g><text x="330" y="287" text-anchor="middle">'+(kind==="photo"?'THE ROBOT REQUESTS ITS GOOD SIDE.':'ONE TINY TEST WORKED. EVERYONE LOST IT.')+'</text></svg>';
    if(kind==="printer")art='<svg viewBox="0 0 660 300"><path d="M120 245H550M150 240V35H520V240M150 65H520" fill="none" stroke="#5f7f93" stroke-width="14"/><path class="egg-hero-noodles" d="M180 230q150-90 250-12t-140-8 30 8 60-13-160 20 115-26 15 32 110-13" fill="none" stroke="#edb64f" stroke-width="6"/><g class="egg-hero-nozzle"><rect x="280" y="75" width="72" height="65" rx="8" fill="#345569"/><path d="M300 140H332L323 170H310Z" fill="#c6ac70"/><path d="M316 170V205" stroke="#edb64f" stroke-width="4"/></g><text x="330" y="287" text-anchor="middle">EXPECTED: BRACKET. RECEIVED: PASTA.</text></svg>';
    if(kind==="labels")art='<svg viewBox="0 0 660 300"><g class="egg-hero-labeler"><rect x="160" y="56" width="190" height="174" rx="24" fill="#345569"/><rect x="185" y="78" width="140" height="52" rx="5" fill="#bce1c6"/><text x="255" y="110" text-anchor="middle" fill="#345569">THAT ONE → CAN</text><path d="M215 154H295M215 176H295M215 198H270" stroke="#94b3c4" stroke-width="10"/><rect x="338" y="119" width="12" height="38" fill="#173546"/></g><g class="egg-hero-label"><rect x="350" y="126" width="210" height="24" fill="#fffdf4" stroke="#90a9ba"/><text x="454" y="143" text-anchor="middle" fill="#294356">CAN / DEFINITELY THIS ONE</text></g><text x="330" y="287" text-anchor="middle">CABLE WITNESS PROTECTION: ENDED.</text></svg>';
    if(kind==="fluid")art='<svg viewBox="0 0 660 300"><g class="egg-hero-coolant"><path d="M185 42H265V175H150V74H185Z" fill="#e1e9ec" stroke="#759bad" stroke-width="3"/><rect x="181" y="60" width="90" height="68" fill="#4ea6a9"/><text x="225" y="91" text-anchor="middle" fill="#fff">BLASER</text><text x="225" y="112" text-anchor="middle" fill="#fff">SWISSLUBE</text><path d="M266 53H291V70H266" fill="#e1e9ec"/><path d="M158 86H183V132H158Z" fill="#fffdf4"/></g><path class="egg-hero-pour" d="M316 94Q355 128 353 225" fill="none" stroke="#67bdd4" stroke-width="7"/><rect x="297" y="215" width="195" height="30" rx="5" fill="#90a9ba"/><path d="M315 216H475" stroke="#67bdd4" stroke-width="5"/><text x="330" y="287" text-anchor="middle">EXCELLENT COOLANT. UNQUALIFIED DEBUGGER.</text></svg>';
    return art?'<div class="egg-physical-actor egg-physical-actor--'+kind+'">'+art+'</div>':"";
  }
  function render(key) {
    const cfg=window.searchEggScenes.get(key), family=families[cfg.kind];
    let hero="";
    if(family==="crew")hero='<div class="egg-space-streaks"></div><img class="egg-screen-crewmate" src="assets/among-us/red-crewmate.png" width="842" height="1024" alt=""><div class="egg-ejection-verdict">Red was not the impostor.<small>Just looking for the CAN connector.</small></div>';
      else if(family==="teamshop")hero='<div class="egg-theory-build"><svg viewBox="0 0 720 250" aria-hidden="true"><path class="egg-theory-link" d="M105 192H610M210 192V125H360M510 192V125H360" fill="none" stroke="#6699b3" stroke-width="3" stroke-dasharray="9 6"/><g class="egg-theory-gear"><path d="M360 27V48M360 203V224M262 125H283M437 125H458M291 56L307 72M413 178L429 194M291 194L307 178M413 72L429 56" stroke="#7eabc0" stroke-width="18"/><circle cx="360" cy="125" r="82" fill="none" stroke="#7eabc0" stroke-width="20"/></g></svg><img class="egg-theory-logo" src="assets/logos/team1241-theory6.png" width="217" height="217" alt=""><div class="egg-theory-step egg-theory-step--design">DESIGN</div><div class="egg-theory-step egg-theory-step--build">BUILD</div><div class="egg-theory-step egg-theory-step--test">TEST ?</div><strong class="egg-theory-repeat">1241 / NEXT REVISION ALREADY PENDING</strong></div>';
    else if(family==="comeback")hero='<div class="egg-rally"><div class="egg-rally-banner"><img src="assets/logos/team1285-biggest-birds.png" width="160" height="160" alt=""><div><span>THE PEOPLE HAVE SPOKEN</span><strong>BRING BACK <b>1285.</b></strong><small>One day. The banner is ready.</small></div></div><div class="egg-rally-crowd">'+Array.from({length:21},(_,i)=>'<i style="--delay:'+(i%5)*.08+'s;--height:'+(28+i%4*8)+'px"></i>').join("")+'</div></div>';
    else if(family==="classified")hero='<div class="egg-part-display"><img class="egg-archived-part" src="assets/the-part/the-part.svg?v=solid-upright-4" width="640" height="560" alt=""><div class="egg-archive-shutter"></div><span class="egg-part-archive">SHOP ARCHIVE / &quot;THE PART&quot;.</span><div class="egg-part-rail"></div></div><div class="egg-classified-stamp">WE DON\'T SPEAK<br>OF &quot;THE PART&quot;.</div>';
    else if(window.searchTeamEffects.has(cfg.kind)||window.searchComponentEffects.has(cfg.kind)||cfg.kind==="pit"||cfg.kind==="ftc")hero="";
    else hero=actor(cfg.kind)||'<div class="egg-effect-vignette egg-stage is-active">'+window.searchEggScenes.render(key,3)+'</div>';
    return '<div class="egg-screen-effect egg-screen-effect--'+family+'" data-effect="'+cfg.kind+'" aria-hidden="true">'+geometry(family,cfg.kind)+particles(family,cfg.kind)+hero+'</div>';
  }
  window.searchEggEffects={render,family:key=>families[window.searchEggScenes.get(key).kind],duration:()=>4300};
})();
