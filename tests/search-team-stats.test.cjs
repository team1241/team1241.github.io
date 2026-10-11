const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

function setup(){
  function element(tag){return {tag,hidden:true,textContent:'',children:[],append(...items){this.children.push(...items)},replaceChildren(...items){this.children=items}};}
  const root=element('div'),requests=[],timers=new Map();let sequence=0,now=0;
  class Clock extends Date {static now(){return now}}
  const window={},document={getElementById:()=>root,createElement:element};
  const context={window,document,Date:Clock,AbortController,
    setTimeout(callback,delay){const id=++sequence;timers.set(id,{callback,delay});return id},clearTimeout:id=>timers.delete(id),
    fetch(url,options){return new Promise(resolve=>requests.push({url,options,resolve}))}};
  vm.createContext(context);vm.runInContext(fs.readFileSync('docs/search-team-stats.js','utf8'),context);
  const text=el=>[el.textContent,...el.children.map(text)].join(' ');
  const response=(index,data,ok=true)=>requests[index].resolve({ok,json:async()=>data});
  const data=(team)=>({team,record:{wins:10,losses:5,ties:0,winrate:2/3},norm_epa:{current:1600.5}});
  return {root,requests,timers,stats:window.searchTeamStats,text:()=>text(root).replace(/\s+/g," ").trim(),response,data,advance:ms=>now+=ms};
}

test('team search displays dated FIRST fallback immediately, then validated live stats and a source link',async()=>{
  const page=setup(),done=page.stats.show('team254');
  assert.match(page.text(),/FIRST lifetime totals · saved October 11, 2026/);
  assert.match(page.text(),/Event wins 49 Awards 157 Championship trips 19/);
  assert.equal(page.requests[0].url,'https://api.statbotics.io/v3/team/254');
  assert.equal(page.requests[0].options.credentials,'omit');
  page.response(0,page.data(254));await done;
  assert.match(page.text(),/Statbotics · lifetime stats · fetched/);
  assert.match(page.text(),/Lifetime match record 10–5–0 Win rate 66.7% Normalized EPA 1601/);
  assert.equal(page.root.children.at(-1).href,'https://www.statbotics.io/team/254');
  assert.equal(page.timers.size,0);
  await page.stats.show('team254');assert.equal(page.requests.length,1,'Valid responses are cached');
  page.advance(300001);const refreshed=page.stats.show('team254');assert.equal(page.requests.length,2);
  page.response(1,page.data(254));await refreshed;
});

test('HTTP failure keeps honest offline stats and briefly caches failures without inventing missing-team data',async()=>{
  const page=setup(),done=page.stats.show('theory');page.response(0,{},false);await done;
  assert.match(page.text(),/Event wins 11 Awards 117 Championship trips 15/);
  assert.match(page.text(),/live stats unavailable/);
  await page.stats.show('theory');assert.equal(page.requests.length,1);
  const missing=page.stats.show('team865');page.response(1,{},false);await missing;
  assert.match(page.text(),/Live team stats unavailable/);
  assert.ok(!page.text().includes('Normalized EPA'));
  assert.equal(page.root.children.at(-1).href,'https://frc-events.firstinspires.org/team/865');
});

test('changing searches aborts requests and late responses cannot replace the next team or revive hidden stats',async()=>{
  const page=setup(),old=page.stats.show('team254'),next=page.stats.show('team3161');
  assert.equal(page.requests[0].options.signal.aborted,true);
  page.response(1,page.data(3161));await next;
  page.response(0,page.data(254));await old;
  assert.equal(page.root.children.at(-1).href,'https://www.statbotics.io/team/3161');
  const pending=page.stats.show('comeback');page.stats.clear();page.response(2,page.data(1285));await pending;
  assert.equal(page.root.hidden,true);assert.equal(page.root.children.length,0);
  await page.stats.show('swerve');assert.equal(page.requests.length,3,'Non-team effects never fetch stats');
});

test('timeout ends the request and invalid or wrong-team records use the fallback',async()=>{
  const page=setup(),done=page.stats.show('team254');
  [...page.timers.values()][0].callback();await done;
  assert.equal(page.requests[0].options.signal.aborted,true);
  assert.match(page.text(),/live stats unavailable/);
  page.response(0,page.data(254));await Promise.resolve();assert.ok(!page.text().includes('Normalized EPA'));
  for(const bad of [page.data(254),{team:3161,record:{wins:'<script>',losses:0,ties:0}},{team:3161,record:{wins:NaN,losses:0,ties:0}}]){
    page.advance(30001);const check=page.stats.show('team3161');page.response(page.requests.length-1,bad);await check;
    assert.match(page.text(),/FIRST lifetime totals/);assert.ok(!page.text().includes('<script>'));
  }
});
