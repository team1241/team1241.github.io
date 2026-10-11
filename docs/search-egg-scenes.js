(function () {
  "use strict";
  const scenes = {};
  function scene(key, kind, label, beats, extra = {}) {
    scenes[key] = {kind, label, beats, ...extra};
  }
  scene("mechanical-0", "torque", "ONE LAST BOLT / TORQUE CHECK", ["One loose bolt.", "Socket seated. Wrench ready.", "Click. Torque confirmed.", "Checked. Someone asks if we checked it."], {action:"Replay effect"});
  scene("mechanical-1", "bench", "WORKBENCH LOST & FOUND", ["One correct Allen key. Several convincing impostors.", "That one belongs to a completely different fastener.", "The bench has produced everything except the answer.", "It was under the drawing the entire time."], {action:"Lift another object"});
  scene("mechanical-2", "fit", "CAD VS. THE PHYSICAL UNIVERSE", ["The screenshot says: absolutely.", "The actual part says: absolutely not.", "Negotiations now involve a file.", "Clearance acquired. Dignity sold separately."], {action:"Try the fit"});
  scene("electrical-0", "bus", "LIVE CAN BUS TRAFFIC", ["Three controllers. One ID. A very loud conversation.", "Everyone is talking. Nobody is listening.", "Unique IDs issued. Traffic begins to move.", "The bus is clear. One device is still oversharing."], {action:"Untangle the bus"});
  scene("electrical-1", "quest", "THE CRIMPER SIDE QUEST", ["A chest appears. Surely this one has the crimper.", "Loot acquired: seventeen ferrules. No crimper.", "New quest location: the neighboring toolbox.", "Legendary crimper found. It was being borrowed."], {action:"Open the next chest"});
  scene("electrical-2", "labels", "CABLE WITNESS PROTECTION", ["Every wire has chosen the name 'that one.'", "One wire receives an actual identity.", "The mystery bundle is losing its anonymity.", "Future-you can finally sleep."], {action:"Print more labels"});
  scene("electrical-3", "nathan", "NATHAN'S ELECTRICAL WORKSTATION", ["Wire ready. Crimper ready. Consultant pending.", "Nathan has entered the planning phase.", "Nathan has scheduled a meeting about the planning phase.", "The wire has applied for a different project manager."], {action:"Request a progress update"});
  scene("programming-0", "terminal", "DEPLOYMENT: CONFIDENCE EDITION", ["Laptop: green. Robot: suspiciously quiet.", "Deploying the sentence 'it works on my machine.'", "The robot would also like to be your machine.", "Congratulations. The bug now lives on the robot."], {action:"Deploy anyway"});
  scene("programming-1", "logs", "PRINTF CRIME SCENE", ["We know the bug is somewhere in the code.", "Evidence: 'here.' Compelling stuff.", "Evidence: 'here 2.' The plot thickens.", "Caught between 'got here' and 'OH NO.'"], {action:"Add one more print"});
  scene("programming-2", "blame", "THE INTERDEPARTMENTAL BLAME RELAY", ["Software has passed the issue to electrical.", "Electrical has passed it to mechanical.", "Mechanical has passed it back to software.", "It was a unit conversion. The meeting ends very quickly."], {action:"Pass the blame"});
  scene("programming-3", "pid", "PID TUNING / ONE MORE TWEAK", ["The setpoint has entered the chat.", "P brought enthusiasm. Too much enthusiasm.", "D requests that everyone calm down.", "PID tuning: P is impatient, I holds grudges, and D saw this coming."], {action:"Replay effect"});
  scene("cad-0", "sketch", "SKETCH EMOTIONAL SUPPORT", ["The sketch is free to go anywhere. Unfortunately.", "One constraint. A little direction in life.", "Fully constrained. Inner peace achieved.", "Overconstrained. It now needs personal space."], {action:"Add a constraint"});
  scene("cad-1", "tree", "FEATURE TREE ARCHAEOLOGY", ["This feature is looking for a face that no longer exists.", "We found the parent. The parent is also broken.", "Excavating an earlier civilization of brackets.", "Reference restored. Nobody touch that face."], {action:"Dig one feature deeper"});
  scene("cad-2", "files", "THE MUSEUM OF FINAL REVISIONS", ["A rare specimen: final.step.", "An even rarer specimen: final_FINAL.step.", "An entire exhibit of absolutely final files.", "The museum is opening a new wing tomorrow."], {action:"Save the final version"});
  scene("manufacturing-0", "mill", 'CNC / JOB: "THE PART"', ["A small piece of stock. A clean bench.", "The stock gets smaller. The population grows.", "The chips have elected a shop representative.", 'CNC: Computer Numerical Confetti. Another setup for "the part".'], {action:"Make more shop confetti"});
  scene("manufacturing-1", "toolpath", "POCKET FINISHING / NO FINGERPRINTS PLEASE", ["Nice toolpath. Did anyone invite the fixture?", "The fixture has raised a strongly worded objection.", "Clearance restored. The cutter may proceed.", "Mirror finish. Someone immediately touches it."], {action:"Run another pass"});
  scene("manufacturing-2", "printer", "ADDITIVE PASTA MANUFACTURING", ["Expected output: a bracket.", "Actual output: one ambitious noodle.", "Production capacity: family-sized spaghetti.", "The printer has been reassigned to Italian cuisine."], {action:"Check the print"});
  scene("manufacturing-3", "toolchange", 'CNC / "THE PART" REQUESTS ANOTHER TOOL', ["Tool seven is ready.", "The carousel indexes.", "Another tool arrives at the spindle.", '"the part" has requested the entire carousel.'], {action:"Replay effect"});
  scene("manufacturing-4", "probe", "G54 / ORIGIN DETECTIVE", ["Somewhere on this stock is zero.", "Touch the top. Retract.", "Touch the side. Found it.", "Found zero. Confidence was hiding there too."], {action:"Replay effect"});
  scene("manufacturing-5", "fixture", 'CNC / ANOTHER SETUP FOR "THE PART"', ["Release the clamps.", "Lift. Rotate. Try again.", "Setup nine has entered the chat.", 'We do not speak of "the part". We reclamp it.'], {action:"Replay effect"});
  scene("manufacturing-6", "lathe", "LATHE / ROUND-OBJECT DIPLOMACY", ["The chuck gets to work.", "The stock is turning.", "The swarf has entered its curly era.", "The stock is turning. The joke has come full circle."], {action:"Replay effect"});
  scene("drive-0", "field", "PRACTICE FIELD / CONE CAM", ["The cones feel safe. This is their first mistake.", "Driver confidence: increasing.", "Cone confidence: decreasing.", "Lap complete. The cones are forming a union."], {action:"Take another lap"});
  scene("drive-1", "swerve", "FOUR MODULES / ONE DIRECTION", ["Four modules. Four opinions.", "The steering angles agree.", "Now the whole chassis moves sideways.", "Swerve: sideways parking. Parallel parking finally has competition."], {action:"Replay effect"});
  scene("drive-2", "controller", "OPERATOR BUTTON CHOREOGRAPHY", ["Two hands. Eight buttons. Reasonable odds.", "Intake, aim, shoot. So far so good.", "The combo now includes a jazz-hand intermission.", "Combo complete. The operator needs a snack."], {action:"Add the next button"});
  scene("strategy-0", "alliance", "ALLIANCE ALGEBRA", ["Three robots. Three slightly different plans.", "Someone has multiplied optimism by three.", "The whiteboard now includes our actual capabilities.", "One plan. Three robots. Much better."], {action:"Combine the plans"});
  scene("strategy-1", "whiteboard", "ARROW DENSITY MONITOR", ["A plan with one clear arrow.", "An arrow to explain the first arrow.", "The arrows now need a traffic controller.", "Two arrows removed. Understanding increases dramatically."], {action:"Explain it with arrows"});
  scene("strategy-2", "match", "THE EXTREMELY POLITE MATCH SIMULATOR", ["Everything follows the plan. Suspicious.", "A defense robot has entered the assumptions.", "The elegant plan has become an emergency doodle.", "Plan B activated. Practice suddenly seems useful."], {action:"Introduce reality"});
  scene("scouting-0", "bars", "SCOUTING: VIBES TO NUMBERS", ["Initial assessment: 'looks scary.'", "Quantifying the scary.", "A spreadsheet has replaced a gut feeling.", "Evidence acquired. The vibes may now retire."], {action:"Measure the vibes"});
  scene("scouting-1", "chart", "JUST ONE MORE CHART", ["One chart. A useful discovery.", "A chart explaining the first chart.", "A dashboard explaining why we made charts.", "We now need a chart to locate the charts."], {action:"Graph that too"});
  scene("scouting-2", "sample", "SAMPLE SIZE: ONE", ["One match. An enormous conclusion.", "The confidence interval is visibly uncomfortable.", "More matches. Less prophecy.", "The anecdote has become actual evidence."], {action:"Scout another match"});
  scene("business-0", "pitch", "SPONSOR PITCH / TAKE ONE", ["Opening slide: we would like a robot, please.", "Adding the people behind the robot.", "Adding what the support makes possible.", "Pitch unlocked. The impact has entered the spotlight."], {action:"Upgrade the pitch"});
  scene("business-1", "budget", "PROTOTYPE BUDGET BOSS BATTLE", ["The budget has 100 health. The wish list looks hungry.", "One more prototype lands a critical hit.", "The spreadsheet is asking for a shield.", "Quote comparison unlocked. Budget regains composure."], {action:"Approve one more prototype"});
  scene("business-2", "judge", "INTERVIEW REHEARSAL ROOM", ["Question: what impact did your team have?", "Answer currently involves an invisible mechanism.", "A real example joins the conversation.", "Clear story delivered. Invisible pointing reduced by 90%."], {action:"Ask the next question"});
  scene("outreach-0", "demo", "DEMO DAY: WAVE COUNTER", ["One curious visitor. One robot wave.", "The audience has requested an encore.", "The encore has requested an encore.", "The robot has accidentally become a local celebrity."], {action:"Wave one more time"});
  scene("outreach-1", "blocks", "COMPLICATED IDEA / SIX BRICKS", ["An explanation with seventeen technical terms.", "The mechanism agrees to become LEGO.", "Click. The idea suddenly makes sense.", "The engineers now want the LEGO version too."], {action:"Build the explanation"});
  scene("outreach-2", "recruit", "FUTURE TEAMMATE DETECTOR", ["A visitor asks 'why?'", "Then 'what if?'", "Then 'can I try?'", "A future teammate has redesigned our demonstration."], {action:"Answer the next question"});
  scene("outreach-3", "ftc", "FTC / FIRST TECH CHALLENGE", ["Compact robot. Ambitious team.", "A test drive becomes a debugging session.", "Different field. Same last-minute zip ties.", "FTC-sized robot. Full-sized engineering problems."], {action:"Replay effect"});
  scene("media-0", "photo", "ROBOT GLAMOUR SHOOT", ["Perfect lighting. Clear background. This cannot last.", "Someone parks the cart directly in the shot.", "The robot demands its good side.", "Photo captured. The robot wants profile-picture approval."], {action:"Take the shot"});
  scene("media-1", "timeline", "WE'LL FIX IT IN POST", ["Beautiful footage. Shop audio included at no extra charge.", "The drill press has taken the lead vocal.", "The timeline becomes a very colorful sandwich.", "Edit exported. The machine shop gets a supporting credit."], {action:"Add another edit"});
  scene("media-2", "polaroid", "PIT PAPARAZZI", ["A very serious build session.", "One tiny test finally works.", "An entire subteam loses its composure.", "Teamwork captured. No retakes needed."], {action:"Capture the moment"});
  scene("logistics-0", "cart", "THE ROBOT CART HAS LEFT THE CHAT", ["Robot ready. Cart location: a philosophical question.", "Cart sighted. It is carrying everything except the robot.", "Unloading the entire team's personal belongings.", "Robot aboard. We have misplaced the handle."], {action:"Track down the cart"});
  scene("logistics-1", "packing", "TRAILER GEOMETRY EXAM", ["Every box fits. Individually.", "The group project is going poorly.", "Rotate the last case. Save the aisle.", "Packing solved. The unloading team applauds."], {action:"Try another arrangement"});
  scene("logistics-2", "checklist", "PACKING LIST / HOPE IS NOT A SPARE", ["Robot. Tools. Spare parts. A suspiciously short list.", "Someone remembers the battery chargers.", "Someone remembers the charger for the charger laptop.", "Checklist complete. Hope stays off the inventory."], {action:"Remember one more thing"});
  scene("safety-0", "goggles", "CLEVER IDEAS NEED EYEBALLS", ["A brilliant idea is approaching the workbench.", "The safety captain has detected bare eyeballs.", "Goggles equipped. Genius may proceed.", "Protected eyeballs. Still an excellent idea."], {action:"Run the readiness check"});
  scene("safety-1", "captain", "SAFETY CAPTAIN / PIT RADAR", ["A cable. A cart. A remarkably narrow walkway.", "Trip hazard detected before the trip.", "The cart accepts its parking instructions.", "Walkway clear. The checklist quietly celebrates."], {action:"Scan the pit"});
  scene("safety-2", "pit", "PIT CLEANUP / CLEAR THE WALKWAY", ["A cable is crossing the walkway.", "Coil it out of the way.", "Cable stored. Path clear.", "The cable gets a pit stop. Your ankles get a clear walkway."], {action:"Replay effect"});
  scene("freecad-0", "handoff", "JEEVAN'S CAD EXCHANGE PROGRAM", ["Everyone brought Inventor or another CAD tool. Jeevan brought FreeCAD.", "The part opened. The editable features did not RSVP.", "Three teammates have opened a support group chat.", "Jeevan's 'easy edit' now includes a personal walkthrough."], {action:"Attempt the easy edit"});
  scene("swisslube-0", "helpdesk", "SWISSLUBE SOLUTION DESK", ["Please describe the problem before suggesting coolant.", "Missing reference? Coolant has opened a support ticket.", "Late design review? Coolant has declined the meeting.", "Actual machining? Finally, a problem in its department."], {action:"Submit the next problem"});
  scene("swisslube-1", "fluid", "THE UNIVERSAL-FIX EXPERIMENT", ["Hypothesis: just add Swisslube.", "Machining: appreciative.", "JavaScript: still offended.", "Result: excellent coolant. Unqualified debugger."], {action:"Test another application"});
  scene("swisslube-2", "tickets", "COOLANT TECH SUPPORT", ["Ticket queue: charger, Wi-Fi, machine.", "The charger case has been sent to the packing list.", "The Wi-Fi case has been sent to the password owner.", "The machine case has finally reached the right desk."], {action:"Resolve the next ticket"});
  scene("components-0", "kraken", "KRAKEN X60 / TALON FX", ["The Kraken is ready.", "The Talon FX is ready.", "The code would like another minute.", "The Kraken is ready. The code is still compiling."], {action:"Replay effect"});
  scene("components-1", "encoder", "CANCODER / ABSOLUTE CONFIDENCE", ["The shaft turns.", "The angle follows.", "Zero found.", "CANcoder knows the angle. We are still arguing about the offset."], {action:"Replay effect"});
  scene("components-2", "vision", "LIMELIGHT / LENS INSPECTION", ["Searching for a target.", "Scanning. Scanning.", "Target acquired.", "Limelight found the target. It would also like a clean lens."], {action:"Replay effect"});
  window.searchTeamEffects.entries.forEach((team,index)=>scene("visitingteams-"+index,"team"+team.number,"FRIENDLY PIT VISIT / "+team.name,["A familiar number.","A pit visit.","The scouting notebook opens.",team.joke],{action:"Replay effect"}));
  scene("team1241-0", "theory", "1241 / THEORY6 BUILD LOOP", ["Design it.", "Build it.", "Test it. Find the next improvement.", "1241: the test worked. Someone already has a revision."], {action:"Replay effect"});
  scene("team1285-0", "comeback", "THE PEOPLE HAVE SPOKEN", ["One day, 1285. The banner is ready.", "1285! A voice from the back of the pits.", "1285! The chant is picking up people.", "BRING BACK 1285. The imaginary crowd is standing."], {action:"Make the chant louder"});
  scene("thepart-0", "part", "SHOP ARCHIVE / DO NOT ELABORATE", ['"the part".', "Another setup.", "Another setup.", "The machine remembers."], {action:"Turn the setup sheet"});
  scene("crew", "crew", "EMERGENCY MEETING / PIT EDITION", ["There is an impostor in the robot code.", "Red was not the impostor. The loose CAN connector was.", "The zip tie claiming to be permanent looks suspicious.", "Yesterday's battery has been wearing today's label."], {action:"Eject the impostor"});

  const esc = value => String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const text = (x,y,value,size=16,extra="") => `<text x="${x}" y="${y}" font-size="${size}" ${extra}>${esc(value)}</text>`;
  const rect = (x,y,w,h,fill="var(--egg-blue)",rx=8,extra="") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
  const line = (x1,y1,x2,y2,extra="") => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" ${extra.includes('stroke=')?'':'stroke="currentColor"'} ${extra.includes('stroke-width=')?'':'stroke-width="3"'} ${extra}/>`;
  const dot = (x,y,r=6,fill="var(--egg-gold)") => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const icon = (name,x,y,size=52) => `<image href="assets/easter-eggs/${name}.svg" x="${x}" y="${y}" width="${size}" height="${size}"/>`;
  const robot = (x,y,color="var(--egg-blue)") => `<g class="egg-rover">${rect(x,y,60,48,color)}${dot(x+15,y+15,5,"#101828")}${dot(x+45,y+15,5,"#101828")}${line(x+20,y+32,x+40,y+32)}${dot(x+6,y+48,8,"#101828")}${dot(x+54,y+48,8,"#101828")}</g>`;
  const people = count => Array.from({length:count},(_,i)=>{const x=24+i*28;return dot(x,131,7,i%2?"var(--egg-gold)":"var(--egg-blue)")+line(x,140,x,166);}).join("");
  const badge = value => `<span class="egg-scene-badge">${esc(value)}</span>`;
  function drawing(kind, p) {
    let art = "";
    if(kind === "torque") {
      art=rect(196,104,275,20,"var(--egg-metal)",3)+rect(284,72,92,32,"var(--egg-blue)",3);
      art+='<g class="egg-torque-bolt"><path d="M330 74L344 82V98L330 106L316 98V82Z" fill="var(--egg-gold)" stroke="#806633" stroke-width="2"/><path d="M325 83H335V97H325Z" fill="#516b7e"/></g>';
      art+='<g class="egg-torque-wrench"><path d="M313 83L137 51L133 71L312 100Z" fill="var(--egg-metal)" stroke="#516b7e" stroke-width="2"/><path d="M140 51L183 59L179 79L135 71Z" fill="#2d4b5f"/><circle cx="330" cy="90" r="21" fill="var(--egg-metal)" stroke="#516b7e" stroke-width="2"/><circle cx="330" cy="90" r="12" fill="#516b7e"/><path d="M323 83H337V97H323Z" fill="var(--egg-gold)"/></g>';
      art+=text(413,53,"CLICK",19,'class="egg-torque-click" fill="var(--egg-green)"');
      art+='<path class="egg-torque-check" d="M491 89L502 101L526 73" fill="none" stroke="var(--egg-green)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>';
      art+=text(330,153,"ONE LAST BOLT. TORQUE CHECKED.",18,'text-anchor="middle"');
    } else if(kind === "bench" || kind === "quest") {
      art=rect(62,102,516,14,"var(--egg-metal)");
      for(let i=0;i<4;i++)art+=rect(80+i*125,46,100,56,i<=p?"var(--egg-gold)":"var(--egg-blue)")+text(130+i*125,82,i<=p?["WRONG","ZIP TIE","SNACK",kind==="quest"?"CRIMPER":"FOUND IT"][i]:"?",14,'text-anchor="middle"');
      art+=icon(kind==="quest"?"plug":"wrench",284,116,38);
    } else if(kind === "fit") {
      art=rect(90,40,165,85,"var(--egg-blue)")+rect(112,61,121,43,"var(--egg-paper)");
      art+=rect([420,245,240,135][p],65,p===3?72:128,35,"var(--egg-gold)")+text(172,151,"REAL LIFE",18,'text-anchor="middle"')+text(456,151,p===3?"EVENTUALLY":"IT FITS IN CAD",18,'text-anchor="middle"');
    } else if(kind === "bus") {
      art=line(70,104,570,104,'stroke="var(--egg-gold)" stroke-width="7"');
      for(let i=0;i<3;i++){const x=95+i*180;art+=rect(x,28,92,54)+text(x+46,61,"ID "+(p<2?1:i+1),20,'text-anchor="middle"')+line(x+46,82,x+46,104);}
      for(let i=0;i<6;i++)art+=rect(88+i*79+(p>1?30:0),95,27,18,p<2?"var(--egg-red)":"var(--egg-green)",4,`class="egg-packet" style="--packet-delay:${i*65}ms"`);
      art+=text(320,150,p<2?"BEEP. BEEP. BEEP. BEEP.":"PACKETS NOW HAVE SOMEWHERE TO GO",17,'text-anchor="middle"');
    } else if(kind === "labels") {
      for(let i=0;i<6;i++){const y=24+i*24;art+=`<path d="M80 ${y}C260 ${y+40},340 ${y-40},560 ${y}" stroke="${["#ED9142","#65B98E","#70ADD5"][i%3]}" stroke-width="7" fill="none"/>`;if(i<p*2)art+=rect(300,y-10,95,20,"var(--egg-paper)",3)+text(311,y+5,["INTAKE","SHOOTER","DRIVE","CAN H","CAN L","SPARE"][i],13);}
    } else if(kind === "nathan") {
      art=icon("plug",75,52,76)+icon("wrench",475,52,76)+line(175,91,445,91)+rect(212,42,215,42,"var(--egg-paper)")+text(320,69,["AVAILABLE","PLANNING","IN A MEETING","CONSULTANT"][p],19,'text-anchor="middle"');
      art+=text(320,139,"WIRES CRIMPED: 0",24,'text-anchor="middle"');
    } else if(kind === "terminal" || kind === "logs") {
      const rows=kind==="terminal"?["> laptop tests: PASS","> deploy confidence --force","> robot: who are you?","> bug successfully relocated"]:["> robot.init()","> here","> here 2","> OH NO  [bug located]"];
      art=rect(62,12,516,142,"#09131F");for(let i=0;i<=p;i++)art+=text(84,42+i*30,rows[i],18,`fill="${i===3?"var(--egg-gold)":"#8FDBB4"}"`);
    } else if(kind === "blame" || kind === "alliance") {
      const names=kind==="blame"?["SOFTWARE","ELECTRICAL","MECHANICAL"]:["ROBOT A","ROBOT B","ROBOT C"];
      for(let i=0;i<3;i++){art+=rect(48+i*201,29,144,76,i===p%3?"var(--egg-gold)":"var(--egg-blue)")+text(120+i*201,73,names[i],16,'text-anchor="middle"');if(i<2)art+=text(221+i*201,81,p===3?"+":"→",32,'text-anchor="middle"');}
      art+=text(320,147,p===3?(kind==="blame"?"CASE CLOSED. NO FURTHER QUESTIONS.":"ONE PLAN THAT ACTUALLY FITS"):kind==="blame"?"THE ISSUE HAS BEEN FORWARDED":"OPTIMISM IS NOT A MULTIPLIER",17,'text-anchor="middle"');
    } else if(kind === "sketch") {
      const offset=p===0?22:0;art=rect(195+offset,32,245,95,p===3?"var(--egg-red)":"none",0,'stroke="var(--egg-blue)" stroke-width="4"');
      for(let i=0;i<p*2;i++)art+=dot(192+(i%3)*126,30+Math.floor(i/3)*98,8,p===3?"var(--egg-red)":"var(--egg-green)");
      art+=text(320,155,["I CAN GO ANYWHERE","SOME BOUNDARIES","INNER PEACE","TOO MANY BOUNDARIES"][p],18,'text-anchor="middle"');
    } else if(kind === "tree" || kind === "files" || kind === "handoff") {
      const rows=kind==="tree"?["Bracket","↳ Sketch","  ↳ Missing face","    ↳ Ancient bracket"]:kind==="handoff"?["FreeCAD assembly","↳ Exported part","  ↳ Editable features?","    ↳ Call Jeevan"]:["final.step","final_FINAL.step","final_FINAL_v7.step","final_ACTUALLY_FINAL_v8.step"];
      for(let i=0;i<=p;i++)art+=rect(85+i*22,12+i*36,455-i*22,30,i===p?"var(--egg-gold)":"var(--egg-paper)",4)+text(99+i*22,33+i*36,rows[i],17);
    } else if(kind === "mill" || kind === "toolpath" || kind === "part") {
      art=rect(80,110,480,15,"var(--egg-metal)")+rect(245,68,150,40,"var(--egg-blue)")+rect(302+p*14,10,22,62,"var(--egg-metal)",2,'class="egg-cutter"');
      if(kind==="mill")for(let i=0;i<p*16;i++)art+=rect(75+(i*97)%490,130+(i*13)%27,7,4,"var(--egg-gold)",0,`class="egg-chip" style="--chip-x:${(i%5-2)*32}px;--chip-y:${-(25+i%7*9)}px;--chip-delay:${i%8*65}ms"`);
      if(kind==="toolpath")art+=`<path d="M180 88L245 36H440V94H245" fill="none" stroke="${p===1?"var(--egg-red)":"var(--egg-green)"}" stroke-dasharray="8 5" stroke-width="4"/>`;
      if(kind==="part")art+=text(320,153,p===0?"REDACTED":"SETUP "+[1,4,11,23][p],22,'text-anchor="middle"');
    } else if(kind === "printer") {
      art=rect(172,12,296,145,"none",3,'stroke="var(--egg-metal)" stroke-width="8"')+line(172,40,468,40)+rect(291,40,28,32,"var(--egg-blue)");
      if(p===0)art+=rect(275,122,90,22,"var(--egg-gold)");
      for(let i=0;i<p*6;i++)art+=`<path d="M${240+(i*29)%160} 138q-70 -${20+(i*11)%65},20 -${12+(i*5)%36}t42 36" fill="none" stroke="var(--egg-gold)" stroke-width="3"/>`;
    } else if(["field","replay","match","demo"].includes(kind)) {
      art=rect(60,10,520,145,"none",6,'stroke="var(--egg-line)" stroke-width="3"')+line(320,10,320,155);
      for(let i=0;i<4;i++)art+=`<path d="M${130+i*120} 108l-12 25h24Z" fill="var(--egg-gold)" transform="rotate(${kind==="field"&&i<p?65:0},${130+i*120},122)"/>`;
      art+=robot(96+p*122,48);
      if(kind==="match"&&p>0)art+=robot(305,100,"var(--egg-red)");
      if(kind==="replay")art+=text(320,33,["LIVE","0.5×","0.25×","JOYSTICK: FULL SEND"][p],16,'text-anchor="middle"');
      if(kind==="demo")art+=text(490,47,["HI","HI!","HI!!","ENCORE!!!"][p],19,'text-anchor="middle"');
    } else if(kind === "controller") {
      art=rect(150,30,340,112,"var(--egg-metal)",40)+dot(225,83,26,"#15283A");
      for(let i=0;i<8;i++)art+=dot(330+(i%4)*33,63+Math.floor(i/4)*38,11,i<p*3?"var(--egg-gold)":"#15283A");
    } else if(kind === "whiteboard") {
      art=rect(65,6,510,152,"var(--egg-paper)");const n=[1,4,12,2][p];
      for(let i=0;i<n;i++){const x=110+(i*71)%400,y=28+(i*47)%102;art+=`<path d="M${x} ${y}l${i%2?-60:70} ${i%3?-22:32}l-8 -4m8 4l-3 -9" fill="none" stroke="${i%2?"var(--egg-red)":"var(--egg-blue)"}" stroke-width="4"/>`;}
    } else if(["bars","chart","sample","budget"].includes(kind)) {
      art=line(83,140,560,140)+line(83,15,83,140);
      if(kind==="sample"){for(let i=0;i<[1,3,8,20][p];i++)art+=dot(125+(i*59)%405,30+(i*37)%90,7,"var(--egg-blue)");}
      else if(kind==="chart"){for(let i=0;i<=p;i++)art+=`<path d="M105 ${120-i*13}L200 ${80+i*9}L290 ${110-i*20}L390 ${45+i*14}L540 ${25+i*24}" fill="none" stroke="${["var(--egg-blue)","var(--egg-gold)","var(--egg-green)","var(--egg-red)"][i]}" stroke-width="5"/>`;}
      else if(kind==="budget"){art+=rect(110,39,400,40,"var(--egg-red)")+rect(110,39,[400,275,70,240][p],40,"var(--egg-green)")+text(320,67,["100 HP","69 HP","17 HP","60 HP / QUOTES EQUIPPED"][p],19,'text-anchor="middle"');}
      else for(let i=0;i<5;i++)art+=rect(115+i*87,140-(p===0?30:[45,95,60,110,83][i]),42,p===0?30:[45,95,60,110,83][i],i%2?"var(--egg-gold)":"var(--egg-blue)",2);
    } else if(kind === "pitch" || kind === "judge" || kind === "recruit") {
      art=rect(100,15,440,110,"var(--egg-paper)")+text(320,78,(kind==="pitch"?["ROBOT, PLEASE","PEOPLE","OPPORTUNITY","IMPACT"]:kind==="judge"?["WHAT CHANGED?","UH... THAT THING","A REAL EXAMPLE","A CLEAR STORY"]:["WHY?","WHAT IF?","CAN I TRY?","NEW IDEA UNLOCKED"])[p],25,'text-anchor="middle"');
      art+=people(7+p*2);
    } else if(kind === "blocks") {
      for(let i=0;i<[1,3,6,8][p];i++){const x=160+(i%4)*78,y=104-Math.floor(i/4)*45;art+=rect(x,y,72,42,["var(--egg-red)","var(--egg-blue)","var(--egg-gold)","var(--egg-green)"][i%4],3)+dot(x+20,y,6)+dot(x+52,y,6);}
    } else if(kind === "photo" || kind === "polaroid") {
      art=rect(135,5,370,157,"var(--egg-paper)")+rect(149,18,342,107,"var(--egg-blue)")+robot(290,43,"var(--egg-gold)");
      if(kind==="photo"&&p===1)art+=rect(225,78,206,40,"var(--egg-red)")+text(325,104,"THE CART",18,'text-anchor="middle"');
      art+=text(320,150,kind==="photo"?["TAKE 1","WHO PARKED THAT?","THE GOOD SIDE","PROFILE PIC PENDING"][p]:["SERIOUS ENGINEERING","IT WORKED?","IT WORKED!!!","NO RETAKES"][p],17,'text-anchor="middle"');
    } else if(kind === "timeline") {
      for(let i=0;i<4;i++){art+=text(66,38+i*35,["VIDEO","VOICE","SHOP","MUSIC"][i],13);for(let j=0;j<=p;j++)art+=rect(126+j*110,20+i*35,103,24,["var(--egg-blue)","var(--egg-green)","var(--egg-red)","var(--egg-gold)"][i],3);}
      art+=line(138+p*110,10,138+p*110,157);
    } else if(kind === "cart" || kind === "packing") {
      art=rect(100,128,440,12,"var(--egg-metal)")+dot(135,149,12,"var(--egg-metal)")+dot(505,149,12,"var(--egg-metal)");
      if(kind==="cart"){if(p===3)art+=robot(280,77);else for(let i=0;i<7-p;i++)art+=rect(120+(i%4)*100,92-Math.floor(i/4)*39,85,35,i%2?"var(--egg-gold)":"var(--egg-blue)");}
      else for(let i=0;i<6;i++){const x=120+(i%3)*145,y=37+Math.floor(i/3)*48;art+=rect(x+(p<2?(i%2)*20:0),y, p===3?110:135,42,i%2?"var(--egg-gold)":"var(--egg-blue)",3);}
    } else if(kind === "checklist" || kind === "tickets" || kind === "helpdesk") {
      const rows=kind==="checklist"?["ROBOT + TOOLS","BATTERY CHARGERS","LAPTOP CHARGER","ACTUAL SPARE PARTS"]:kind==="tickets"?["MISSING CHARGER","WI-FI PASSWORD","MACHINE COOLANT","QUEUE FINALLY MAKES SENSE"]:["MISSING REFERENCE","LATE DESIGN REVIEW","ROBOT CODE","ACTUAL MACHINING"];
      for(let i=0;i<4;i++)art+=rect(92,12+i*36,456,30,"var(--egg-paper)",4)+text(108,33+i*36,(i<p?"✓ ":"□ ")+rows[i],18);
    } else if(kind === "goggles") {
      art=dot(320,77,66,"var(--egg-gold)")+dot(298,76,10,"#16283B")+dot(343,76,10,"#16283B");
      if(p>0)art+=rect(266,50,108,46,"none",14,'stroke="var(--egg-blue)" stroke-width="10"');
      art+=text(320,159,p>1?"GENIUS: CLEARED TO PROCEED":"PROTECT THE IDEA-HAVING EQUIPMENT",16,'text-anchor="middle"');
    } else if(kind === "captain" || kind === "pit") {
      art=rect(150,8,340,147,"none",8,'stroke="var(--egg-line)" stroke-width="3"')+line(320,8,320,155,'stroke-dasharray="6 8"');
      for(let i=0;i<5-p;i++)art+=rect(170+(i*71)%220,35+(i*39)%92,54,19,i%2?"var(--egg-red)":"var(--egg-gold)",3,`transform="rotate(${p<2?i*27:0},${190+(i*71)%220},${40+(i*39)%92})"`);
      if(kind==="captain")art+=`<circle cx="320" cy="80" r="${25+p*19}" fill="none" stroke="var(--egg-green)" stroke-width="3"/>`;
    } else if(kind === "pid") {
      art=line(55,143,595,143,'stroke="var(--egg-line)"')+line(55,20,55,143,'stroke="var(--egg-line)"')+line(55,63,595,63,'stroke="var(--egg-gold)" stroke-dasharray="8 6"');
      art+='<path class="egg-pid-response" d="M55 137H95C120 137 132 16 161 25S195 112 221 105S253 42 280 45S310 79 340 76S374 55 401 59S435 68 465 65S530 63 595 63" fill="none" stroke="var(--egg-green)" stroke-width="4"/>';
      art+=text(320,165,"P: ENTHUSIASM / I: GRUDGES / D: FORESIGHT",13,'text-anchor="middle"');
    } else if(kind === "fluid") {
      art=rect(83,29,90,110,"var(--egg-green)",12)+text(128,87,"LUBE",18,'text-anchor="middle"');
      for(let i=0;i<3;i++)art+=rect(218+i*120,47,104,77,i<p? (i===0?"var(--egg-green)":"var(--egg-red)"):"var(--egg-paper)")+text(270+i*120,90,["MACHINE","CODE","WI-FI"][i],16,'text-anchor="middle"');
    }
    return `<svg class="egg-drawing" viewBox="0 0 640 172" aria-hidden="true">${art}</svg>`;
  }
  function render(key, phase) {
    const cfg=scenes[key];
    if(!cfg)throw new Error("Missing Easter egg scene: "+key);
    const p=Math.min(phase,3);
    let graphic;
    if(cfg.kind==="crew")graphic='<div class="egg-airlock"><span class="egg-airlock-label">AIRLOCK 01</span><img class="egg-crewmate" src="assets/among-us/red-crewmate.png" width="842" height="1024" alt="Red Among Us crewmate"><span class="egg-verdict">'+(p?"NOT THE IMPOSTOR":"SUSPICION: VERY HIGH")+'</span></div>';
    else if(cfg.kind==="comeback")graphic='<div class="egg-comeback"><img class="egg-team-logo" src="assets/logos/team1285-biggest-birds.png" width="136" height="136" alt="Team 1285: The Biggest Birds logo"><div class="egg-chant" style="--chant-size:'+ (22+p*7)+'px">'+["ONE DAY.","1285!","1285! 1285!","BRING BACK<br>1285!"][p]+'</div></div>'+`<svg class="egg-crowd" viewBox="0 0 640 172" aria-hidden="true">${people(5+p*6)}</svg>`;
    else graphic=drawing(cfg.kind,p);
    return `<div class="egg-scene egg-scene--${cfg.kind}" data-scene="${key}" data-phase="${p}"><div class="egg-scene-top"><span>${esc(cfg.label)}</span>${badge(p===3?"PLOT TWIST":"ACT "+(p+1))}</div>${graphic}<div class="egg-scene-progress" aria-hidden="true">${[0,1,2,3].map(i=>`<span class="${i<=p?"is-reached":""}"></span>`).join("")}</div></div>`;
  }
  window.searchEggScenes={render, get:key=>scenes[key]};
})();
