(function () {
  "use strict";
  const root=document.getElementById("searchTeamStats");
  if(!root)return;
  // Dated FIRST lifetime totals, verified against each linked team page.
  // These are offline fallbacks, never presented as current API results.
  const snapshots={
    1241:[11,117,15],1285:[5,24,4],254:[49,157,19],2910:[27,76,10],3161:[1,37,4]
  };
  const cache=new Map();
  let generation=0,active=null;
  const numberFor=kind=>kind==="theory"?"1241":kind==="comeback"?"1285":/^team\d+$/.test(kind)?kind.slice(4):null;
  function node(tag,value){const el=document.createElement(tag);el.textContent=value;return el;}
  function render(number,data,status){
    const heading=node("p",status),items=node("dl","");
    heading.className="egg-stats-source";
    for(const [label,value] of data){const pair=node("div","");pair.append(node("dt",label),node("dd",value));items.append(pair);}
    const source=node("a",status.startsWith("Statbotics")?"View team on Statbotics":"View team on FIRST");
    source.href=status.startsWith("Statbotics")?"https://www.statbotics.io/team/"+number:"https://frc-events.firstinspires.org/team/"+number;
    root.replaceChildren(heading,items,source);root.hidden=false;
  }
  function fallback(number,loading=false){
    const saved=snapshots[number];
    if(saved)render(number,[["Event wins",saved[0]],["Awards",saved[1]],["Championship trips",saved[2]]],
      "FIRST lifetime totals · saved October 11, 2026"+(loading?" · checking live stats…":" · live stats unavailable"));
    else render(number,[],loading?"Checking team stats…":"Live team stats unavailable. Try again later.");
  }
  function parse(number,data){
    if(data?.team!==Number(number))throw new Error("Wrong team");
    const record=data.record;
    const integer=value=>Number.isInteger(value)&&value>=0;
    if(!record||![record.wins,record.losses,record.ties].every(integer))throw new Error("Invalid record");
    const values=[["Lifetime match record",record.wins+"–"+record.losses+"–"+record.ties]];
    if(typeof record.winrate==="number"&&Number.isFinite(record.winrate)&&record.winrate>=0&&record.winrate<=1)
      values.push(["Win rate",(record.winrate*100).toFixed(1)+"%"]);
    if(typeof data.norm_epa?.current==="number"&&Number.isFinite(data.norm_epa.current))
      values.push(["Normalized EPA",data.norm_epa.current.toFixed(0)]);
    return values;
  }
  function clear(){generation++;if(active)active.abort();active=null;root.hidden=true;root.replaceChildren();}
  async function show(kind){
    clear();
    const number=numberFor(kind);if(!number)return;
    const token=generation,saved=cache.get(number);
    if(saved&&Date.now()-saved.time<(saved.values?300000:30000)){
      if(saved.values)render(number,saved.values,"Statbotics · lifetime stats · fetched "+saved.at);
      else fallback(number);
      return;
    }
    fallback(number,true);
    const controller=new AbortController();active=controller;
    let timeout;
    try{
      // Race the timeout as well as aborting: a delayed response cannot hold the UI open.
      const response=await Promise.race([
        fetch("https://api.statbotics.io/v3/team/"+number,{signal:controller.signal,credentials:"omit"}).then(async result=>{
          if(!result.ok)throw new Error("Stats unavailable");
          return parse(number,await result.json());
        }),
        new Promise((_,reject)=>{timeout=setTimeout(()=>{controller.abort();reject(new Error("Stats timeout"));},3000);})
      ]);
      if(token!==generation)return;
      const at=new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
      cache.set(number,{values:response,time:Date.now(),at});
      render(number,response,"Statbotics · lifetime stats · fetched "+at);
    }catch{
      if(token!==generation)return;
      cache.set(number,{time:Date.now()});fallback(number);
    }finally{clearTimeout(timeout);if(token===generation)active=null;}
  }
  window.searchTeamStats={show,clear};
})();
