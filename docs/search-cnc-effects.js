(function () {
  "use strict";
  const kinds=new Set(["mill","toolpath","toolchange","probe","fixture","lathe"]);
  const plate='<path d="M60 256H600" stroke="#8097a9" stroke-width="12"/>';
  const cutter='<rect x="52" y="0" width="70" height="63" rx="8" fill="#294356"/><rect x="62" y="55" width="50" height="30" fill="#536d80"/><path d="M74 83H100V205H74Z" fill="#b9cad3"/><path class="egg-cnc-flutes" d="M74 116L100 100M74 141L100 125M74 166L100 150M74 191L100 175M88 205L100 198" stroke="#456174" stroke-width="7"/><path d="M74 205H100" stroke="#eff8fc" stroke-width="3"/>';
  const label=(value,y=287)=>'<text x="330" y="'+y+'" text-anchor="middle">'+value+'</text>';
  function chips(count=12) {
    return Array.from({length:count},(_,i)=>'<path class="egg-hero-chip" style="--delay:'+(i*.11)+'s;--chip-x:'+(i%2?80:-65)+'px;--chip-y:'+(-35-i%4*16)+'px" d="M0 0q12-12 18 3" fill="none" stroke="#bcced9" stroke-width="4"/>').join("");
  }
  function faceMill() {
    return '<svg viewBox="0 -42 660 342" style="--mill-travel:450px">'+label('JOB: &quot;THE PART&quot;. / SETUP: AGAIN.',-18)+plate+
      '<rect x="100" y="205" width="450" height="45" rx="3" fill="#90a9ba"/><rect class="egg-stock-top" x="100" y="178" width="450" height="27" fill="#c7d7e0"/>'+
      '<g class="egg-hero-cutter">'+cutter+'</g><g class="egg-chip-emitter"><g transform="translate(100 185)">'+chips()+'</g></g>'+
      '<path class="egg-cnc-finish-glint" d="M100 206H550" stroke="#e7f6fc" stroke-width="3"/>'+label('CNC: COMPUTER NUMERICAL CONFETTI.')+'</svg>';
  }
  function pocket() {
    // The cutter and its chip emitter follow the same closed path. The groove is
    // drawn along that exact path, so the trace never races ahead of the tool.
    const path='M210 112H450V205H210V112';
    return '<svg viewBox="0 0 660 300">'+label('FINISH PASS / THE FIXTURE HAS OPINIONS',25)+
      '<path d="M150 230H515L550 252H115Z" fill="#607e91"/><rect x="150" y="75" width="365" height="155" rx="9" fill="#a9bdc9" stroke="#59778b"/>'+
      '<rect x="195" y="98" width="270" height="122" rx="13" fill="#536d80"/>'+
      '<path class="egg-cnc-pocket-cut" d="'+path+'" fill="none" stroke="#d8e8ef" stroke-width="17" stroke-linejoin="round"/>'+
      '<path class="egg-cnc-pocket-track" d="'+path+'" fill="none" stroke="#6cbd9e" stroke-width="2" stroke-dasharray="7 5"/>'+
      '<g class="egg-cnc-pocket-head"><rect x="-12" y="-57" width="24" height="33" rx="4" fill="#294356"/><path d="M-5-24H5V0H-5Z" fill="#d3e4ec"/><path d="M-5-17L5-22M-5-8L5-13" stroke="#577486" stroke-width="3"/><g class="egg-cnc-pocket-chips">'+chips(6)+'</g></g>'+
      '<path d="M157 135H180V162H157M485 135H508V162H485" fill="#d8ad58" stroke="#907331" stroke-width="3"/>'+
      '<g class="egg-cnc-finish-star"><path d="M450 103V121M441 112H459M444 106L456 118M456 106L444 118" stroke="#fff4b5" stroke-width="2"/></g>'+
      label('MIRROR FINISH. SOMEONE IMMEDIATELY TOUCHES IT.')+'</svg>';
  }
  function toolChange() {
    const tools=Array.from({length:6},(_,i)=>{
      const a=i*Math.PI/3,x=230+Math.cos(a)*74,y=142+Math.sin(a)*74;
      return '<g transform="translate('+x.toFixed(2)+' '+y.toFixed(2)+')"><circle r="21" fill="#203e51"/><path d="M-8-11H8V9H-8Z" fill="#a7becb"/><path d="M-5 9H5L2 22H-2Z" fill="'+(i%2?'#d5ad5d':'#80b6cc')+'"/></g>';
    }).join('');
    return '<svg viewBox="0 0 660 300">'+label('JOB: &quot;THE PART&quot;. / TOOL CRIB: ALL OF IT.',25)+
      '<g class="egg-cnc-carousel"><circle cx="230" cy="142" r="100" fill="#7693a5" stroke="#456577" stroke-width="5"/>'+tools+'<circle cx="230" cy="142" r="26" fill="#d4e1e7"/><circle cx="230" cy="142" r="10" fill="#456577"/></g>'+
      '<path d="M338 142H453" stroke="#d8ad58" stroke-width="12"/><g class="egg-cnc-transfer-tool"><rect x="319" y="123" width="25" height="30" rx="3" fill="#bed1db"/><path d="M326 153H337V181H326Z" fill="#d5ad5d"/></g>'+
      '<rect x="443" y="66" width="66" height="58" rx="8" fill="#294356"/><rect x="457" y="120" width="38" height="21" fill="#7794a6"/>'+
      '<g class="egg-cnc-installed-tool"><path d="M470 139H482V179H470Z" fill="#d5ad5d"/></g>'+
      '<text class="egg-cnc-tool-ticket" x="542" y="150">T07</text><text class="egg-cnc-tool-ticket egg-cnc-tool-ticket--next" x="542" y="172">...T08?</text>'+
      label('&quot;THE PART&quot; HAS REQUESTED THE ENTIRE CAROUSEL.')+'</svg>';
  }
  function probe() {
    return '<svg viewBox="0 0 660 300">'+label('G54 / ORIGIN DETECTIVE',25)+plate+
      '<rect x="225" y="151" width="215" height="94" rx="4" fill="#a2b8c6" stroke="#59788b" stroke-width="2"/>'+
      '<path class="egg-cnc-datum" d="M110 151H525M225 55V254" fill="none" stroke="#6bbc9b" stroke-width="2" stroke-dasharray="7 5"/>'+
      '<g class="egg-cnc-probe"><rect x="-18" y="-83" width="36" height="38" rx="5" fill="#294356"/><path d="M0-45V-7" stroke="#c6dbe5" stroke-width="6"/><circle r="7" fill="#d68380"/></g>'+
      '<circle class="egg-cnc-probe-contact egg-cnc-probe-contact--top" cx="320" cy="151" r="17" fill="none" stroke="#70c0a0" stroke-width="3"/>'+
      '<circle class="egg-cnc-probe-contact egg-cnc-probe-contact--side" cx="225" cy="185" r="17" fill="none" stroke="#70c0a0" stroke-width="3"/>'+
      '<g class="egg-cnc-zero-readout"><rect x="465" y="65" width="130" height="86" rx="7" fill="#18364a"/><text x="480" y="92" fill="#9ce4bd">X 0.000</text><text x="480" y="114" fill="#9ce4bd">Z 0.000</text><text x="480" y="137" fill="#9ce4bd">G54 FOUND</text></g>'+
      label('FOUND ZERO. CONFIDENCE WAS HIDING THERE TOO.')+'</svg>';
  }
  function fixture() {
    return '<svg viewBox="0 0 660 300">'+label('JOB: &quot;THE PART&quot;. / ANOTHER SETUP.',25)+plate+
      '<ellipse cx="330" cy="244" rx="153" ry="13" fill="#617f93"/><path d="M176 230H484V244H176Z" fill="#8eacbd"/>'+
      '<g class="egg-cnc-indexed-part"><image href="assets/the-part/the-part.svg?v=solid-upright-4" x="225" y="50" width="210" height="184"/></g>'+
      '<g class="egg-cnc-clamp egg-cnc-clamp--left"><path d="M178 226V202H225V217H196V226Z" fill="#d6af5f" stroke="#806633" stroke-width="2"/><circle cx="191" cy="213" r="5" fill="#4b6171"/></g>'+
      '<g class="egg-cnc-clamp egg-cnc-clamp--right"><path d="M482 226V202H435V217H464V226Z" fill="#d6af5f" stroke="#806633" stroke-width="2"/><circle cx="469" cy="213" r="5" fill="#4b6171"/></g>'+
      '<path class="egg-cnc-index-arrow" d="M515 190Q553 103 464 65l18-9m-18 9 14 13" fill="none" stroke="#78b9d2" stroke-width="4"/>'+
      '<text class="egg-cnc-setup-old" x="87" y="126">SETUP 08</text><text class="egg-cnc-setup-new" x="87" y="150">SETUP 09</text>'+
      label('WE DO NOT SPEAK OF &quot;THE PART&quot;. WE RECLAMP IT.')+'</svg>';
  }
  function lathe() {
    return '<svg viewBox="0 0 660 300" style="--lathe-travel:-270px">'+label('LATHE / ROUND-OBJECT DIPLOMACY',25)+plate+
      '<rect x="80" y="80" width="93" height="164" rx="9" fill="#345569"/><circle cx="126" cy="111" r="13" fill="#6abc9b"/>'+
      '<rect x="168" y="125" width="35" height="91" rx="5" fill="#8eaab9"/><g class="egg-cnc-chuck"><path d="M174 131H197M174 149H197M174 176H197M174 205H197" stroke="#d1dfe6" stroke-width="7"/></g>'+
      '<rect x="203" y="151" width="270" height="31" fill="#aec5d1"/><path d="M203 156H473" stroke="#e0edf3" stroke-width="5"/><rect class="egg-cnc-turning-stock" x="203" y="182" width="270" height="11" fill="#86a4b6"/>'+
      '<ellipse cx="473" cy="166.5" rx="6" ry="15.5" fill="#d3e4ec"/>'+
      '<g class="egg-cnc-lathe-tool"><path d="M473 182L500 205H489Z" fill="#e0b761"/><rect x="487" y="205" width="73" height="32" rx="4" fill="#345569"/></g>'+
      '<g class="egg-cnc-lathe-emitter"><g transform="translate(473 183)">'+chips(12)+'<path class="egg-cnc-swarf" d="M0 0c-16-18-40-9-31 7s38-5 18-18-50 0-34 21 43-8 23-20-43 3-26 21" fill="none" stroke="#b5cad5" stroke-width="3"/></g></g>'+
      label('THE STOCK IS TURNING. THE JOKE HAS COME FULL CIRCLE.')+'</svg>';
  }
  const drawings={mill:faceMill,toolpath:pocket,toolchange:toolChange,probe,fixture,lathe};
  window.searchCncEffects={
    has:kind=>kinds.has(kind),
    render(kind){
      const small=kind==="probe";
      return '<div class="'+(small?'egg-cnc-vignette':'egg-physical-actor')+' egg-cnc-effect egg-cnc-effect--'+kind+'">'+drawings[kind]()+'</div>';
    }
  };
})();
