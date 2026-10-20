(function () {
  "use strict";
  const catalog = [];
  function group(subteam, entries) {
    entries.forEach(([triggers,title],index) => catalog.push({key:subteam+"-"+index,subteam,triggers,title}));
  }
  group("mechanical", [
    [["loose bolt","torque wrench","check torque"],"The final bolt"],
    [["missing allen key","where is the allen key"],"The missing Allen-key dimension"],
    [["it fits in cad","shaft clearance"],"The fit committee"],
  ]);
  group("electrical", [
    [["can bus traffic","can bus party","can bus"],"CAN bus traffic report"],
    [["where is my crimper","crimper quest","electrical crimper"],"Crimper quest"],
    [["label your wires","wire label club","wire labels"],"The wire label club"],
    [["nathan electrical","nathan wiring","where is nathan"],"Nathan's electrical task queue"],
  ]);
  group("programming", [
    [["works on my machine","robot deploy"],"Local success detected"],
    [["one more print","println detective","debugging code"],"The print-statement detective"],
    [["blame the hardware","hardware issue"],"Cross-subteam diplomacy"],
    [["pid","pid tuning","pid gains","tune pid"],"PID tuning: one more tweak"],
  ]);
  group("cad", [
    [["fully constrained","sketch therapy","cad sketch"],"Sketch therapy"],
    [["missing references","assembly archaeology","cad references"],"Assembly archaeology"],
    [["final final final","actually final cad","cad revisions"],"The final-file museum"],
  ]);
  group("manufacturing", [
    [["chips everywhere","chip confetti","milling chips"],"Shop confetti"],
    [["one more pass","finish pass feelings","cnc toolpath"],"Finish-pass feelings"],
    [["printer spaghetti","spaghetti factory","3d printer"],"The spaghetti factory"],
    [["tool change","tool changer","cnc tools"],"The entire tool carousel"],
    [["probe","probing","work offset","g54","touch off"],"The origin detective"],
    [["fixture","fixturing","cnc setup","setup sheet","workholding"],"Another setup for \"the part\""],
    [["lathe","turning","chuck","cnc lathe","lathe machining"],"Full-circle machining"],
  ]);
  group("drive", [
    [["drive practice","driver zoomies","driver practice"],"Controlled zoomies"],
    [["swerve drive","swerve modules","swerve"],"Crab walk unlocked"],
    [["operator buttons","button choreography","robot operator"],"Button choreography"],
  ]);
  group("strategy", [
    [["alliance math","alliance algebra","alliance selection"],"Alliance algebra"],
    [["draw more arrows","strategy spaghetti","match strategy"],"Strategy spaghetti"],
    [["the perfect match","perfect match plan","autonomous path"],"The perfect-match simulator"],
  ]);
  group("scouting", [
    [["scouting vibes","vibes per match","scouting data"],"Vibes per match"],
    [["one more chart","scouting chart club","scouting charts"],"The chart club"],
    [["sample size one","one match sample","sample size"],"The sample-size committee"],
  ]);
  group("business", [
    [["sponsor pitch","sponsor superpowers","team sponsors"],"Sponsor superpowers"],
    [["prototype budget","budget boss battle","team budget"],"The prototype budget"],
    [["judges practice","award interview practice","awards interview"],"The interview rehearsal"],
  ]);
  group("outreach", [
    [["robot demo","demo day magic","robot demonstration"],"Demo-day magic"],
    [["explain it with lego","lego explanation","lego robotics"],"The LEGO explanation"],
    [["future roboteer","future engineer","stem outreach"],"Future teammate detected"],
    [["ftc","first tech challenge","ftc robot","ftc robotics"],"FTC: compact robot, big ideas"],
  ]);
  group("media", [
    [["robot glamour shot","robot photoshoot","robot photography"],"Robot glamour shot"],
    [["fix it in post","post production pit","video editing"],"The post-production pit"],
    [["pit paparazzi","behind the build","team media"],"Behind the build"],
  ]);
  group("logistics", [
    [["where is the cart","robot cart quest","robot cart"],"Robot-cart quest"],
    [["trailer tetris","packing tetris","robot trailer"],"Trailer geometry"],
    [["packing list","checklist champion"],"Checklist champion"],
  ]);
  group("safety", [
    [["safety glasses","safety goggles squad","eye protection"],"The glasses squad"],
    [["safety captain","safety captain powers"],"Safety-captain powers"],
    [["pit safety","safe pit club"],"Clear the pit walkway"],
  ]);
  group("freecad", [
    [["jeevan freecad","jeevan in freecad"],"Jeevan's CAD handoff"],
  ]);
  group("swisslube", [
    [["blaser swisslube","swisslube"],"The Swisslube solution desk"],
    [["swisslube fixes everything","just add swisslube"],"The universal-fix committee"],
    [["swisslube tech support","coolant help desk"],"The coolant help desk"],
  ]);
  group("components", [
    [["kraken","kraken x60","talon fx","talonfx"],"Release the Kraken (after the build)"],
    [["cancoder","can coder","absolute encoder"],"CANcoder: angle acquired"],
    [["lime","limelight","april tag","apriltag","vision camera"],"Limelight: lens inspection department"],
  ]);
  group("visitingteams", window.searchTeamEffects.entries.map(team=>[[team.number,"team "+team.number,"frc "+team.number,...team.aliases],team.number+" / "+team.name]));
  group("team1241", [
    [["1241","team 1241","team1241","theory6","theory 6"],"Theory6: build, test, repeat"],
  ]);
  group("team1285", [
    [["team 1285","team1285","1285","bring back 1285","1285 comeback"],"The 1285 comeback campaign"],
  ]);
  group("thepart", [
    [["the part"],'"the part".'],
  ]);
  const natural = {
    "mechanical-0":["bolt","bolts","torque","mechanical"], "mechanical-1":["allen key","allen keys","hex key"], "mechanical-2":["clearance","shaft fit"],
    "electrical-0":["can","can bus","can id","electrical"], "electrical-1":["crimper","crimping","where is the crimper"], "electrical-2":["wire labels","label wires","wiring labels"], "electrical-3":["nathan"],
    "programming-0":["deploy","deployment","programming"], "programming-1":["printf","debug logs","print statements"], "programming-2":["bug","software bug"],
    "cad-0":["cad","constraint","constraints","sketch"], "cad-1":["feature tree","broken reference"], "cad-2":["final.step","final version"],
    "manufacturing-0":["mill","milling","end mill","machining","chips","cnc","cnc machine","cnc milling"], "manufacturing-1":["toolpath","finish pass"], "manufacturing-2":["printer","3d printer","3d printing","spaghetti"],
    "drive-0":["driver","driving","drive practice"], "drive-1":["swerve module"], "drive-2":["joystick","controller","operator"],
    "strategy-0":["alliance","alliance selection"], "strategy-1":["strategy","whiteboard"], "strategy-2":["defense","defence"],
    "scouting-0":["scouting","scout"], "scouting-1":["graph","charts","dashboard"], "scouting-2":["sample size","small sample"],
    "business-0":["sponsor","sponsors","sponsorship"], "business-1":["budget","business"], "business-2":["judges","judging","interview"],
    "outreach-0":["demo","outreach"], "outreach-1":["lego","bricks"], "outreach-2":["recruitment","new members"],
    "media-0":["photo","photos","photography","robot photo"], "media-1":["video","editing","media"], "media-2":["team photo","team picture"],
    "logistics-0":["cart","robot cart"], "logistics-1":["packing","trailer","logistics"], "logistics-2":["packing list","checklist"],
    "safety-0":["goggles","safety glasses"], "safety-1":["safety","safety captain"], "safety-2":["pit","pit cleanup"],
    "freecad-0":["freecad"], "swisslube-1":["blaser","coolant"]
  };
  for(const egg of catalog) egg.triggers=[...new Set([...egg.triggers,...(natural[egg.key]||[])])];
  const shortSearches = {
    "mechanical-1":["allen","hex"], "mechanical-2":["tolerance"],
    "electrical-1":["crimp","ferrule","ferrules"], "electrical-2":["wire","wires","wiring"],
    "cad-0":["inventor","solidworks"], "cad-1":["assembly"], "cad-2":["revision"],
    "manufacturing-0":["machine"], "manufacturing-1":["pocket"],
    "drive-1":["swerve"], "strategy-1":["arrows"], "strategy-2":["autonomous"],
    "business-2":["award"], "components-0":["motor"], "components-1":["encoder"],
    "components-2":["vision"]
  };
  for(const egg of catalog)egg.triggers=[...new Set([...egg.triggers,...(shortSearches[egg.key]||[])])];
  // These words are useful names for an effect, but too broad to match inside a sentence.
  const exactAliases = {
    "mechanical-0":["torque check"], "mechanical-1":["missing tools"], "mechanical-2":["fitment","tolerances"],
    "electrical-0":["canbus"], "electrical-1":["crimpers"], "electrical-2":["labeling","wire label"],
    "programming-0":["terminal","console","robot code"], "programming-1":["logs","logging","debugging","debug","print"], "programming-2":["hardware","software issue"],
    "cad-0":["sketch constraints"], "cad-1":["assembly","cad assembly","references"], "cad-2":["revisions","cad files","cad revision"],
    "manufacturing-1":["pocket","pocket milling","pocket finishing"], "manufacturing-3":["tool carousel","tool changing","toolchange"], "manufacturing-4":["cnc probe","zeroing"],
    "drive-0":["drive"], "drive-1":["crab walk"], "drive-2":["gamepad"],
    "strategy-0":["alliances"], "strategy-1":["arrows","planning"], "strategy-2":["autonomous","match plan","auto plan"],
    "scouting-0":["data","scouter"], "scouting-1":["chart"], "scouting-2":["statistics","samples"],
    "business-0":["pitch"], "business-1":["finance"], "business-2":["judge","awards"],
    "outreach-0":["demonstration","demos"], "outreach-2":["recruit","recruiting"],
    "media-0":["camera"], "media-1":["timeline","video editor"], "media-2":["polaroid","team photos"],
    "logistics-0":["carts"], "logistics-2":["checklists"],
    "swisslube-0":["help desk","helpdesk"], "swisslube-1":["fluid","coolant flow"], "swisslube-2":["tech support","support tickets"],
    "thepart-0":['"the part"']
  };
  for(const egg of catalog)egg.exactTriggers=exactAliases[egg.key]||[];
  // The common product names should reveal the bottle pouring, rather than the support-desk illustration.
  catalog.find(egg=>egg.key==="swisslube-0").triggers=["swisslube solution desk"];
  catalog.find(egg=>egg.key==="swisslube-1").triggers.push("swisslube","blaser swisslube");
  window.searchEggCatalog = catalog;
})();
