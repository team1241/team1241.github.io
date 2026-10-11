const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync, readdirSync} = require('node:fs');
const vm = require('node:vm');
const script = readFileSync('docs/theme.js', 'utf8');

function boot({saved, darkSystem=false, blocked=false, href='https://example.test/index.html'}={}) {
  const events={}, domEvents={}, storage=new Map(saved ? [['team1241-theme',saved]] : []);
  const root={dataset:{},style:{}};
  const button={attributes:{},listeners:{},setAttribute(name,value){this.attributes[name]=value},addEventListener(name,handler){this.listeners[name]=handler}};
  const makeLink=href=>({href,getAttribute(){return this.href},setAttribute(name,value){this.href=value}});
  const links=[makeLink('pully-generator/index.html'),makeLink('close-the-loop-pid-control.html?search=PID#part2'),makeLink('https://external.test/')];
  let redraws=0;
  const document={documentElement:root,readyState:'loading',querySelectorAll(selector){return selector==='[data-theme-toggle]'?[button]:selector==='a[href]'?links:selector==='canvas'?[{_redraw(){redraws++}}]:[]},addEventListener(name,handler){domEvents[name]=handler}};
  const system={matches:darkSystem,addEventListener(name,handler){this.change=handler}};
  const location=new URL(href);
  const window={matchMedia:()=>system,addEventListener(name,handler){events[name]=handler},dispatchEvent(event){events[event.type]?.(event)}};
  const localStorage={getItem(key){if(blocked)throw Error('Storage blocked');return storage.get(key)},setItem(key,value){if(blocked)throw Error('Storage blocked');storage.set(key,value)}};
  const history={replaceState(state,title,next){location.href=next}};
  const context={window,document,location,history,localStorage,URL,URLSearchParams,CustomEvent:class{constructor(type,options){this.type=type;Object.assign(this,options)}}};
  vm.runInNewContext(script,context);
  domEvents.DOMContentLoaded();
  return {window,root,button,links,storage,events,system,location,domEvents,redraws:()=>redraws};
}

test('home toggle saves the choice and carries it into lessons and the included app',()=>{
  const page=boot();
  assert.equal(page.window.siteTheme.get(),'light');
  page.button.listeners.click();
  assert.equal(page.root.dataset.theme,'dark');
  assert.equal(page.root.style.backgroundColor,'#111720');
  assert.equal(page.storage.get('team1241-theme'),'dark');
  assert.equal(page.button.attributes['aria-label'],'Switch to light mode');
  assert.equal(page.button.attributes['aria-pressed'],'true');
  assert.match(page.links[0].href,/pully-generator\/index.html\?theme=dark/);
  assert.match(page.links[1].href,/search=PID&theme=dark#part2/);
  assert.equal(page.links[2].href,'https://external.test/');
  const next=boot({saved:page.storage.get('team1241-theme')});
  assert.equal(next.root.dataset.theme,'dark');
});

test('file navigation shares the theme even if storage is blocked',()=>{
  const page=boot({blocked:true,href:'file:///C:/site/index.html?theme=dark'});
  assert.equal(page.root.dataset.theme,'dark');
  assert.equal(page.links[0].href,'file:///C:/site/pully-generator/index.html?theme=dark');
  page.button.listeners.click();
  assert.equal(page.root.dataset.theme,'light');
  assert.match(page.location.search,/theme=light/);
  const dynamic={href:'close-the-loop-pid-control.html?search=PID',getAttribute(){return this.href},setAttribute(name,value){this.href=value}};
  page.domEvents.click({target:{closest:()=>dynamic}});
  assert.match(dynamic.href,/search=PID&theme=light/);
});

test('system preference applies until a choice is saved; storage updates synchronize open pages',()=>{
  const page=boot({darkSystem:true});
  assert.equal(page.root.dataset.theme,'dark');
  page.system.change({matches:false});
  assert.equal(page.root.dataset.theme,'light');
  page.events.storage({key:'team1241-theme',newValue:'dark'});
  assert.equal(page.root.dataset.theme,'dark');
  page.system.change({matches:false});
  assert.equal(page.root.dataset.theme,'dark');
  assert.ok(page.redraws()>2);
});

test('canvas palettes follow both themes while preserving physical wire colors',()=>{
  const page=boot();
  const palette=page.window.siteTheme.palette({ink:'#16283B',paper:'#FBFDFE',wire:'#E78328'});
  assert.equal(palette.ink,'#16283B');
  page.window.siteTheme.set('dark');
  assert.equal(palette.ink,'#e4ecf5');
  assert.equal(palette.paper,'#1e3044');
  assert.equal(palette.wire,'#E78328');
  page.window.siteTheme.set('light');
  assert.equal(palette.ink,'#16283B');
});

test('every resource page loads the theme and keeps valid inline scripts',()=>{
  for(const name of readdirSync('docs').filter(name=>name.endsWith('.html'))){
    const html=readFileSync('docs/'+name,'utf8');
    assert.match(html,/<script src="theme.js"><\/script>/,name);
    assert.match(html,/<link rel="stylesheet" href="theme.css">/,name);
    for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(match[1],{filename:name});
  }
  const app=readFileSync('utilities/pully-generator/src/main.jsx','utf8');
  assert.ok(!app.includes('className="theme-toggle"'));
  assert.match(app,/window.siteTheme.get\(\)/);
});

test('Ethernet Widget 1 keeps white stripes while its background follows the theme',()=>{
  const html=readFileSync('docs/crimping-cat6-ethernet.html','utf8');
  for(const pair of ['o','g','b','br']){
    const rule=html.match(new RegExp('\\.wire\\.stripe\\.'+pair+'\\{([^}]+)\\}'));
    assert.ok(rule);
    assert.match(rule[1],/background-color:#fff(?:;|$)/);
    assert.ok(!rule[1].includes('var('));
  }
  assert.match(html,/\.plugbox\{[^}]*background:var\(--surface-alt\)/);
  assert.ok(!html.includes('.plugbox{--surface-alt:'));
});
