(function () {
  "use strict";
  const entries=[
    {number:"2056",name:"OP Robotics",aliases:["op robotics","orchard park robotics"],motif:"gear",joke:"2056 entered the chat. The scouting notebook requested another page."},
    {number:"1114",name:"Simbotics",aliases:["simbotics","simbot"],motif:"hex",joke:"1114: even the scouting notes have scouting notes."},
    {number:"254",name:"The Cheesy Poofs",aliases:["cheesy poofs","the cheesy poofs"],motif:"cheese",joke:"254: the alliance meeting now contains a suspicious amount of cheese."},
    {number:"1678",name:"Citrus Circuits",aliases:["citrus","citrus circuits"],motif:"citrus",joke:"1678: adding vitamin C to the alliance spreadsheet."},
    {number:"2910",name:"Jack in the Bot",aliases:["jack in the bot","jack in the box robot"],motif:"jack",joke:"2910: surprise, there was a robot in the box."},
    {number:"6328",name:"Mechanical Advantage",aliases:["mechanical advantage","advantagekit","advantagescope"],motif:"lever",joke:"6328: a better lever ratio than our sleep schedule."},
    {number:"610",name:"Crescent Coyotes",aliases:["crescent","crescent coyotes"],motif:"crescent",joke:"610: a local pit visit became another scouting session."},
    {number:"3161",name:"Tronic Titans",aliases:["tronic","tronic titans"],motif:"circuit",joke:"3161: Oakville has entered the group project."},
    {number:"865",name:"WARP7",aliases:["warp7","warp 7"],motif:"warp",joke:"865: warp speed. Still waiting for the robot cart."},
    {number:"1334",name:"OT Devils",aliases:["ot devils","red devils"],motif:"horns",joke:"1334: local match, full-sized adrenaline."},
    {number:"1246",name:"Agincourt Skunkworks",aliases:["agincourt","agincourt skunkworks","skunkworks"],motif:"skunk",joke:"1246: designs classified. Zip ties very public."}
  ];
  function motif(name) {
    if(name==="cheese")return '<path d="M-28 22L-19-23L34 22Z" fill="#efbc51" stroke="#b68a39" stroke-width="3"/><circle cx="-8" cy="8" r="5" fill="#c79535"/><circle cx="9" cy="13" r="4" fill="#c79535"/>';
    if(name==="citrus")return '<circle r="31" fill="#edbe4f" stroke="#f9df99" stroke-width="5"/>'+Array.from({length:6},(_,i)=>'<path d="M0 0V-28" stroke="#fff0ba" stroke-width="3" transform="rotate('+(i*60)+')"/>').join("");
    if(name==="gear")return '<circle r="24" fill="none" stroke="#67a7c9" stroke-width="10"/><path d="M0-38V-25M0 25V38M-38 0H-25M25 0H38M-27-27L-18-18M18 18L27 27M-27 27L-18 18M18-18L27-27" stroke="#67a7c9" stroke-width="10"/>';
    if(name==="hex")return '<path d="M0-32L28-16V16L0 32L-28 16V-16Z" fill="none" stroke="#c795e1" stroke-width="4"/><path d="M-15 9V-9H15V9Z" fill="#c795e1"/>';
    if(name==="jack")return '<rect x="-30" y="0" width="60" height="32" fill="#6fad8f"/><g class="egg-visit-jack-head"><path d="M-10 0l10-7-10-7 10-7" fill="none" stroke="#809bb0" stroke-width="4"/><rect x="-21" y="-45" width="42" height="26" rx="5" fill="#81bba0"/><circle cx="-8" cy="-33" r="4" fill="#254957"/><circle cx="8" cy="-33" r="4" fill="#254957"/></g>';
    if(name==="lever")return '<path d="M0 5L-16 29H16Z" fill="#718a9e"/><g class="egg-visit-lever"><path d="M-42 0H42" stroke="#77b9a0" stroke-width="7"/><rect x="-40" y="-25" width="20" height="20" fill="#d8b160"/><circle cx="35" cy="-13" r="9" fill="#77b9a0"/></g>';
    if(name==="crescent")return '<path d="M18-29A33 33 0 1 0 18 29A27 27 0 0 1 18-29Z" fill="#72aed0"/>';
    if(name==="circuit")return '<path d="M-35-15H-8V18H35M-35 18H-19V-28H20" fill="none" stroke="#68b8ad" stroke-width="5"/><circle cx="35" cy="18" r="5" fill="#68b8ad"/><circle cx="20" cy="-28" r="5" fill="#68b8ad"/>';
    if(name==="warp")return '<path d="M-45 0H20M-26-16H36M-15 16H48" stroke="#85b7d9" stroke-width="4" stroke-linecap="round"/>';
    if(name==="horns")return '<path d="M-21-12Q-38-40-10-29L0-18L10-29Q38-40 21-12Q32 28 0 34Q-32 28-21-12Z" fill="#d9878f"/><circle cx="-8" cy="4" r="3" fill="#354d60"/><circle cx="8" cy="4" r="3" fill="#354d60"/>';
    return '<path d="M-27 22V-13Q0-39 27-13V22Z" fill="#40596c"/><path d="M-8 22V-13Q0-28 8-13V22" fill="#e4edf2"/><circle cx="-12" cy="3" r="3" fill="#e4edf2"/><circle cx="12" cy="3" r="3" fill="#e4edf2"/>';
  }
  function render(kind) {
    const team=entries.find(e=>"team"+e.number===kind);
    const graphics=Array.from({length:7},(_,i)=>'<g transform="translate('+(110+i*200)+' '+(170+(i%3)*105)+')"><g class="egg-visit-symbol egg-visit-symbol--'+team.motif+'" style="--delay:'+(i*.09)+'s">'+motif(team.motif)+'</g></g>').join("");
    return '<svg class="egg-visit-screen" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+graphics+'</svg><div class="egg-visit-banner"><span>FRIENDLY PIT VISIT</span><strong>'+team.number+' / '+team.name+'</strong></div>';
  }
  window.searchTeamEffects={entries,has:kind=>entries.some(e=>"team"+e.number===kind),render};
})();
