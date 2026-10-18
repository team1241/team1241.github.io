const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync,existsSync} = require('node:fs');
const {createHash} = require('node:crypto');
const vm = require('node:vm');

function setup(reduced=false) {
  const timers=new Map();let sequence=0,now=0;
  function element(){
    const classes=new Set();
    return {textContent:'',innerHTML:'',hidden:false,disabled:false,listeners:{},offsetWidth:300,
      classList:{add:name=>classes.add(name),remove:name=>classes.delete(name),contains:name=>classes.has(name)},
      addEventListener(name,handler){(this.listeners[name] ||= []).push(handler)},
      emit(name,event={}){return this.listeners[name]?.forEach(handler=>handler(event))}};
  }
  const title=element(),caption=element(),stage=element(),button=element(),credit=element(),overlay=element();
  const root={hidden:true,querySelector:selector=>({'.egg-title':title,'.egg-caption':caption,'.egg-stage':stage,'.egg-action':button,'.egg-credit':credit})[selector]};
  const input=element(),category=element(),status=element(),results={replaceChildren(){}};
  category.value='all';
  const motion={matches:reduced,addEventListener(name,handler){this.onchange=handler}};
  const statsCalls=[];
  const window={matchMedia:()=>motion,searchTeamStats:{show:kind=>statsCalls.push(kind),clear:()=>statsCalls.push('clear')}};
  let fetches=0;
  const document=element();
  document.getElementById=id=>({searchEasterEgg:root,lessonSearch:input,lessonCategory:category,searchStatus:status,searchResults:results,searchEggOverlay:overlay})[id];
  document.querySelectorAll=()=>[{getAttribute:()=> 'close-the-loop-pid-control.html',querySelector:()=>({textContent:'PID control'}),dataset:{},hasAttribute:()=>false,closest:()=>({dataset:{category:'programming'}})}];
  const context={window,document,Date:{now:()=>now},setTimeout(callback,delay){const id=++sequence;timers.set(id,{callback,delay});return id},clearTimeout:id=>timers.delete(id),
    fetch:async()=>{fetches++;return{ok:true,text:async()=>''}},DOMParser:class{parseFromString(){return{querySelectorAll:()=>[]}}}};
  vm.createContext(context);
  const page=readFileSync('docs/index.html','utf8');
  for(const match of page.matchAll(/<script src="(search-[^"]+)"><\/script>/g))
    vm.runInContext(readFileSync('docs/'+match[1].split('?')[0],'utf8'),context);
  vm.runInContext([...page.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1],context);
  function inputValue(value){input.value=value;input.emit('input',{target:input})}
  async function type(value,advance=31000){
    now+=advance;
    inputValue(value);
    const [id,timer]=[...timers.entries()].at(-1);
    timers.delete(id);await timer.callback();
  }
  function expireEffect(){const entry=[...timers.entries()].find(([,timer])=>timer.delay===4300);assert.ok(entry);timers.delete(entry[0]);entry[1].callback()}
  return{root,title,caption,stage,button,credit,overlay,window,document,motion,timers,type,inputValue,expireEffect,status,statsCalls,fetches:()=>fetches};
}

test('Among Us aliases automatically eject the supplied crewmate without blocking lesson search',async()=>{
  const page=setup();
  for(const phrase of ['Among Us','among-us','among_us','AmongUs!','amogus','sus','crewmate']){
    await page.type('');await page.type(phrase);
    assert.equal(page.root.hidden,false,phrase);
    assert.equal(page.title.textContent,'Emergency meeting!');
    assert.match(page.overlay.innerHTML,/egg-screen-crewmate/);
    assert.match(page.overlay.innerHTML,/src="assets\/among-us\/red-crewmate.png"/);
    assert.match(page.caption.textContent,/CAN connector/);
    assert.equal(page.credit.hidden,true);
    assert.equal(page.button.textContent,'Replay effect');
  }
  assert.equal(page.fetches(),1);
});

test('1285 aliases use the original team logo in a separate rally banner and crowd',async()=>{
  const page=setup();
  for(const phrase of ['1285','team 1285','team1285','bring back 1285','1285 comeback']){
    await page.type('');await page.type(phrase);
    assert.equal(page.root.hidden,false,phrase);
    assert.match(page.overlay.innerHTML,/src="assets\/logos\/team1285-biggest-birds\.png"/);
    assert.match(page.overlay.innerHTML,/egg-rally-banner/);
    assert.match(page.overlay.innerHTML,/egg-rally-crowd/);
    assert.ok(!page.overlay.innerHTML.includes('robot.svg'));
  }
});

test('all 68 surprises are automatic effects with distinct drawings and local assets',async()=>{
  const page=setup(),counts={},triggers=new Map(),kinds=new Set(),families=new Set();
  for(const egg of [...page.window.searchEggCatalog,{key:'crew',subteam:'amongus',triggers:['among us'],title:'Emergency meeting!'}]){
    counts[egg.subteam]=(counts[egg.subteam]||0)+1;
    for(const phrase of [...egg.triggers,...(egg.exactTriggers||[])]){
      assert.ok(!triggers.has(phrase)||triggers.get(phrase)===egg.key,'Ambiguous trigger: '+phrase);triggers.set(phrase,egg.key);
      await page.type(phrase);
      assert.equal(page.title.textContent,egg.title,phrase+' must resolve to the intended effect');
    }
    await page.type(egg.triggers[0]);
    const scene=page.window.searchEggScenes.get(egg.key);
    kinds.add(scene.kind);families.add(page.window.searchEggEffects.family(egg.key));
    assert.equal(page.root.hidden,false);
    assert.equal(page.title.textContent,egg.title);
    assert.equal(page.overlay.hidden,false);
    assert.match(page.overlay.innerHTML,new RegExp('data-effect="'+scene.kind+'"'));
    assert.equal(page.stage.hidden,true,'No click-through scene panel');
    assert.equal(page.stage.innerHTML,'');
    assert.equal(page.button.textContent,'Replay effect');
    assert.equal(page.button.disabled,false);
    for(const match of page.overlay.innerHTML.matchAll(/(?:src|href)="(assets\/[^"]+)"/g))assert.ok(existsSync('docs/'+match[1].split('?')[0]),match[1]);
    assert.equal(page.credit.hidden,!['bench','quest','nathan'].includes(scene.kind));
  }
  for(const name of ['mechanical','electrical','programming','cad','manufacturing','drive','strategy','scouting','business','outreach','media','logistics','safety'])
    assert.equal(counts[name],name==='manufacturing'?7:name==='outreach'?4:['electrical','programming'].includes(name)?4:3,name);
  assert.equal(kinds.size,68);assert.ok(families.size>=20);
  assert.equal(counts.visitingteams,11);
  assert.equal(page.fetches(),1);
});

test('ordinary input cancels the effect immediately, before the search debounce',async()=>{
  const page=setup();
  await page.type('among us');
  page.inputValue('odometry');
  assert.equal(page.overlay.hidden,true);
  assert.equal(page.overlay.innerHTML,'');
  assert.equal(page.root.hidden,true);
  for(const phrase of ['odometry','robot','gear ratio','among','suspension','voltage','42','beep boop','do a barrel roll']){
    await page.type(phrase);
    assert.equal(page.root.hidden,true,phrase);
    assert.equal(page.overlay.innerHTML,'');
    assert.match(page.status.textContent,/No result contains/);
  }
  await page.type('');
  assert.equal(page.status.textContent,'Type a keyword or choose a category.');
});

test('effects finish, optional replay repeats the same effect, and aliases do not restart it',async()=>{
  const page=setup();
  await page.type('printer spaghetti');
  const initial=page.overlay.innerHTML,punchline=page.caption.textContent;
  assert.match(punchline,/Italian cuisine/);
  page.expireEffect();
  assert.equal(page.overlay.hidden,true);assert.equal(page.overlay.innerHTML,'');
  await page.type('printer spaghetti');
  assert.equal(page.overlay.hidden,true,'Repeated query must not auto replay');
  page.button.emit('click');
  assert.equal(page.overlay.innerHTML,initial);
  assert.equal(page.caption.textContent,punchline,'Replay cannot advance a story or score');
  page.document.emit('keydown',{key:'Escape'});
  assert.equal(page.root.hidden,true);assert.equal(page.overlay.innerHTML,'');
  assert.ok(![...page.timers.values()].some(timer=>timer.delay===4300));
});

test('reduced motion supplies the punchline without launching an overlay or a replay button',async()=>{
  const page=setup(true);
  await page.type('blame the hardware');
  // Use an exact catalog phrase, since ordinary partial searches remain ordinary.
  await page.type(page.window.searchEggCatalog.find(egg=>egg.key==='programming-2').triggers[0]);
  assert.equal(page.root.hidden,false);
  assert.equal(page.overlay.hidden,true);assert.equal(page.overlay.innerHTML,'');
  assert.equal(page.button.hidden,true);
  assert.ok(![...page.timers.values()].some(timer=>timer.delay===4300));
  const active=setup();await active.type('among us');
  active.motion.matches=true;active.motion.onchange({matches:true});
  assert.equal(active.overlay.hidden,true);assert.equal(active.button.hidden,true);
});

test('screen motion is finite, click-through, and independent of the page layout',()=>{
  const css=readFileSync('docs/search-egg-effects.css','utf8');
  assert.match(css,/\.egg-screen-overlay\{[^}]*position:fixed;inset:0;[^}]*pointer-events:none/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\).*\.egg-screen-overlay\{display:none\}/s);
  assert.ok(!/\binfinite\b/.test(css));
  assert.ok(!/(?:html|body|\.wrap)\s*\{/.test(css),'Effects may not rotate or move normal page content');
  assert.match(css,/@keyframes proper-ejection/);assert.match(css,/@keyframes rally-rise/);
});

test('common words and realistic phrases are discoverable, with specific matches taking priority',async()=>{
  const page=setup();
  for(const [query,key] of [['CAN','electrical-0'],['how to fix can bus','electrical-0'],['where is the crimper','electrical-1'],['CAD','cad-0'],['end mill','manufacturing-0'],['3d printer troubleshooting','manufacturing-2'],['robot photo','media-0'],['team photo','media-2'],['budget for next season','business-1'],['Blaser','swisslube-1'],['Blaser Swisslube','swisslube-1'],['the part','thepart-0']]){
    await page.type(query);
    assert.equal(page.title.textContent,page.window.searchEggCatalog.find(egg=>egg.key===key).title,query);
    assert.equal(page.root.hidden,false);
  }
  await page.type('can I learn PID');
  assert.equal(page.root.hidden,true,'Ordinary use of can must not trigger CAN bus');
  await page.type('repitition');assert.equal(page.root.hidden,true,'No partial-word matches');
});

test('newly matched effects autoplay even during rapid searches; same-effect refinements do not restart them',async()=>{
  const page=setup();await page.type('end mill',0);
  assert.equal(page.overlay.hidden,false);
  await page.type('printer',1000);
  assert.equal(page.overlay.hidden,false);assert.equal(page.button.textContent,'Replay effect');
  const printer=page.overlay.innerHTML;
  await page.type('3d printer',1000);assert.equal(page.overlay.innerHTML,printer);
  await page.type('budget',1000);assert.equal(page.overlay.hidden,false);
  await page.type('sponsor',1000);assert.equal(page.overlay.hidden,false);
});

test('twelve physical actor effects mill, print, label, pour, and take photos with a subtle single flash',()=>{
  const page=setup();let count=0;
  for(const egg of page.window.searchEggCatalog){
    const html=page.window.searchEggEffects.render(egg.key);
    if(html.includes('egg-physical-actor'))count++;
  }
  assert.equal(count,12);assert.ok(count/68>=.1&&count/68<=.2);
  const mill=page.window.searchEggEffects.render('manufacturing-0');
  assert.match(mill,/egg-hero-cutter/);assert.match(mill,/egg-stock-top/);assert.match(mill,/egg-hero-chip/);
  assert.match(page.window.searchEggEffects.render('media-0'),/egg-photo-robot/);
  assert.match(page.window.searchEggEffects.render('swisslube-1'),/BLASER/);
  const css=readFileSync('docs/search-egg-effects.css','utf8');
  assert.match(css,/@keyframes subtle-camera-flash\{[^}]+\}50%\{opacity:\.45\}/);
  const photo=page.window.searchEggEffects.render('media-0');
  assert.match(photo,/egg-camera-flash[^>]*><defs>/);
  assert.match(photo,/ellipse cx="577" cy="145" rx="110" ry="80"/);
  assert.ok(!photo.includes('<div class="egg-camera-flash">'),'Flash originates inside the camera SVG, never as a whole-screen white layer');
  assert.match(page.window.searchEggEffects.render('thepart-0'),/assets\/the-part\/the-part.svg/);
  const part=page.window.searchEggEffects.render('thepart-0');
  assert.ok(part.indexOf('egg-archived-part')<part.indexOf('egg-classified-stamp'),'Model appears beneath the later sticker');
  assert.match(part,/egg-classified-stamp">WE DON'T SPEAK<br>OF &quot;THE PART&quot;\./);
  assert.match(css,/animation:classified-stamp 2\.5s 1\.5s ease both/,'Label begins after approximately 0.8 seconds of unobstructed model viewing');
  assert.equal(page.window.searchEggEffects.duration('thepart-0'),4300);
  assert.match(part,/egg-part-display/);assert.match(part,/egg-archive-shutter/);
});

test('CNC milling uses identical linear cutter/removal timing and emits chips from the cutter contact',()=>{
  const page=setup(),html=page.window.searchEggEffects.render('manufacturing-0');
  const css=readFileSync('docs/search-egg-effects.css','utf8');
  assert.match(html,/--mill-travel:450px/);
  assert.match(html,/egg-stock-top" x="100" y="178" width="450" height="27"/);
  assert.match(html,/M74 83H100V205H74Z/,'Cutting tip reaches the new stock surface at y=205');
  assert.match(html,/egg-chip-emitter"><g transform="translate\(100 185\)"/);
  assert.match(html,/JOB: &quot;THE PART&quot;/);
  assert.match(css,/\.egg-hero-cutter,\.egg-chip-emitter\{animation:endmill-feed 3s \.25s linear both\}/);
  assert.match(css,/\.egg-stock-top\{animation:stock-remove 3s \.25s linear both\}/);
  assert.ok(!html.includes('egg-effect-particle'),'No unrelated chips thrown from elsewhere on the screen');
  const contactStart=100,travel=450,stockWidth=450;
  for(const progress of [0,.25,.5,.75,1])assert.equal(contactStart+travel*progress,100+stockWidth*progress);
});

test('home page resource versions match current source bytes, preventing stale effects',()=>{
  const page=readFileSync('docs/index.html','utf8');
  const names=['search-easter-eggs.css','search-egg-scenes.css','search-egg-effects.css','search-team-effects.css','search-team-effects.js','search-team-stats.css','search-team-stats.js','search-component-effects.css','search-component-effects.js','search-cnc-effects.css','search-cnc-effects.js','search-egg-catalog.js','search-egg-scenes.js','search-egg-effects.js','search-easter-eggs.js'];
  for(const name of names){
    const source=readFileSync('docs/'+name,'utf8').replace(/\r\n/g,'\n');
    const hash=createHash('sha256').update(source).digest('hex').slice(0,12);
    assert.ok(page.includes(name+'?v='+hash),name);
  }
});

test('PID and tuning aliases automatically trace an overshoot and retain normal lesson search',async()=>{
  const page=setup();
  for(const query of ['PID','PID tuning','PID gains','how to tune pid']){
    await page.type('');await page.type(query);
    assert.equal(page.root.hidden,false);assert.equal(page.overlay.hidden,false);
    assert.equal(page.title.textContent,'PID tuning: one more tweak');
    assert.match(page.overlay.innerHTML,/egg-pid-screen-response/);
    assert.match(page.caption.textContent,/P is impatient, I holds grudges, and D saw this coming/);
  }
  assert.equal(page.fetches(),1);
});

test('CNC queries select six distinct automatic machining actions, including a lathe',async()=>{
  const page=setup(),drawings=new Set();
  for(const [query,key,feature] of [['CNC','manufacturing-0','egg-hero-cutter'],['cnc toolpath','manufacturing-1','egg-cnc-pocket-head'],['cnc tool changer','manufacturing-3','egg-cnc-carousel'],['work offset','manufacturing-4','egg-cnc-probe'],['cnc setup','manufacturing-5','egg-cnc-indexed-part'],['cnc lathe machining','manufacturing-6','egg-cnc-chuck']]){
    await page.type(query);
    assert.equal(page.title.textContent,page.window.searchEggCatalog.find(egg=>egg.key===key).title,query);
    assert.equal(page.overlay.hidden,false);assert.match(page.overlay.innerHTML,new RegExp(feature));
    assert.equal(page.button.textContent,'Replay effect');drawings.add(page.overlay.innerHTML);
  }
  assert.equal(drawings.size,6);
  for(const key of ['manufacturing-0','manufacturing-3','manufacturing-5']){
    assert.match(page.window.searchEggEffects.render(key),/&quot;THE PART&quot;/);
    assert.match(page.window.searchEggScenes.get(key).beats[3],/"the part"/);
  }
  assert.match(page.window.searchEggEffects.render('manufacturing-5'),/assets\/the-part\/the-part.svg/);
  assert.match(page.caption.textContent,/full circle/);
  page.expireEffect();assert.equal(page.overlay.hidden,true);
});

test('lathe removal and swarf stay attached to the tool, while the probe touches the actual stock edges',()=>{
  const page=setup(),lathe=page.window.searchEggEffects.render('manufacturing-6'),probe=page.window.searchEggEffects.render('manufacturing-4');
  const css=readFileSync('docs/search-cnc-effects.css','utf8');
  assert.match(lathe,/--lathe-travel:-270px/);
  assert.match(lathe,/egg-cnc-turning-stock" x="203" y="182" width="270" height="11"/);
  assert.match(lathe,/egg-cnc-lathe-emitter"><g transform="translate\(473 183\)">.*egg-cnc-swarf/);
  assert.match(css,/\.egg-cnc-lathe-tool,\.egg-cnc-lathe-emitter\{animation:cnc-lathe-feed 3s \.25s linear both\}/);
  assert.match(css,/\.egg-cnc-turning-stock\{animation:cnc-lathe-remove 3s \.25s linear both\}/);
  for(const progress of [0,.2,.5,.8,1])assert.equal(473-270*progress,203+270*(1-progress),'Stock removal boundary must meet the cutting point');
  assert.match(probe,/x="225" y="151" width="215" height="94"/);
  assert.match(probe,/circle r="7"/);
  assert.match(css,/translate\(320px,144px\)/);assert.equal(144+7,151);
  assert.match(css,/translate\(218px,185px\)/);assert.equal(218+7,225);
  assert.match(css,/cnc-contact-ping \.5s 2\.664s/);
  assert.ok(!/\binfinite\b/.test(css));
});

test('torque replaces the inapplicable gusset joke with an automatic wrench and check',async()=>{
  const page=setup();
  await page.type('torque wrench');
  assert.equal(page.title.textContent,'The final bolt');
  assert.match(page.overlay.innerHTML,/egg-torque-wrench/);assert.match(page.overlay.innerHTML,/egg-torque-check/);
  assert.ok(!page.overlay.innerHTML.includes('egg-effect-particle'));
  const css=readFileSync('docs/search-egg-scenes.css','utf8');
  assert.match(css,/egg-torque-wrench\{transform-box:view-box;transform-origin:330px 90px/);
  await page.type('gusset');assert.equal(page.root.hidden,true);
});

test('pit cleanup clears a visible cable and then marks the walkway clear',async()=>{
  const page=setup();await page.type('pit cleanup');
  assert.equal(page.title.textContent,'Clear the pit walkway');
  assert.match(page.overlay.innerHTML,/egg-pit-loose-cable/);assert.match(page.overlay.innerHTML,/egg-pit-coil/);
  assert.match(page.overlay.innerHTML,/TRIP HAZARD/);assert.match(page.overlay.innerHTML,/WALKWAY CLEAR/);
  assert.ok(!page.overlay.innerHTML.includes('egg-screen-scanner'));
  const css=readFileSync('docs/search-egg-effects.css','utf8');
  assert.match(css,/pit-cable-clear 3\.4s linear both/);assert.match(css,/pit-cable-coil 3\.4s linear both/);
  assert.match(css,/@keyframes pit-path-clear\{0%,75%\{opacity:0\}90%,100%\{opacity:1\}\}/);
  const reduced=setup(true);await reduced.type('pit');assert.equal(reduced.overlay.hidden,true);assert.match(reduced.caption.textContent,/walkway/);
  await page.type('odometry');assert.equal(page.overlay.innerHTML,'');
});

test('FTC aliases launch a compact robot automatically and preserve reduced-motion behavior',async()=>{
  const page=setup();
  for(const query of ['FTC','FIRST Tech Challenge','ftc robotics','ftc robot']){
    await page.type('');await page.type(query);
    assert.equal(page.title.textContent,'FTC: compact robot, big ideas');
    assert.match(page.overlay.innerHTML,/egg-ftc-rover/);assert.match(page.overlay.innerHTML,/FIRST TECH CHALLENGE/);
    assert.match(page.caption.textContent,/Full-sized engineering problems/);
    assert.ok(!page.overlay.innerHTML.includes('egg-effect-particle'));
    assert.equal(page.button.textContent,'Replay effect');
  }
  const reduced=setup(true);await reduced.type('FTC');assert.equal(reduced.overlay.hidden,true);assert.equal(reduced.button.hidden,true);
});


test('short component and programming searches work and retired product names stay ordinary',async()=>{
  const page=setup();
  for(const [query,kind] of [['Lime','vision'],['swerve','swerve'],['motor','kraken'],['encoder','encoder'],['terminal','terminal'],['wire','labels'],['crimp','quest']]){
    await page.type(query);assert.equal(page.root.hidden,false,query);
    assert.match(page.overlay.innerHTML,new RegExp('data-effect="'+kind+'"'),query);
  }
  for(const query of ['neo','spark','spark max']){await page.type(query);assert.equal(page.root.hidden,true,query);}
  await page.type('kraken');assert.match(page.overlay.innerHTML,/assets\/components\/kraken-x60.webp/);
});

test('swerve steers all four wheels before strafing a chassis that keeps its heading',async()=>{
  const page=setup();await page.type('swerve');
  assert.equal([...page.overlay.innerHTML.matchAll(/class="egg-swerve-wheel"/g)].length,4);
  assert.match(page.overlay.innerHTML,/egg-swerve-body/);
  const css=readFileSync('docs/search-component-effects.css','utf8');
  assert.match(css,/25%,90%\{transform:rotate\(90deg\)\}/);
  assert.match(css,/@keyframes swerve-strafe\{0%,27%\{transform:translateX\(0\)\}/);
  const sequence=css.match(/@keyframes swerve-strafe([^@]+)/)[1];
  assert.ok(!sequence.includes('rotate('),'Chassis does not yaw while strafing');
});

test('team aliases select their own graphics and stats are cleared on ordinary input or Escape',async()=>{
  const page=setup();
  for(const team of page.window.searchTeamEffects.entries){
    await page.type(team.number);assert.match(page.overlay.innerHTML,new RegExp('data-effect="team'+team.number+'"'));
    assert.equal(page.statsCalls.at(-1),'team'+team.number);
    assert.match(page.overlay.innerHTML,/egg-visit-symbol/);
    assert.ok(page.overlay.innerHTML.includes(team.name));
  }
  await page.type('1241');assert.equal(page.statsCalls.at(-1),'theory');
  page.inputValue('voltage');assert.equal(page.statsCalls.at(-1),'clear');
  await page.type('1285');assert.equal(page.statsCalls.at(-1),'comeback');
  page.document.emit('keydown',{key:'Escape'});assert.equal(page.statsCalls.at(-1),'clear');
});
