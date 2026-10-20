import React,{useId} from 'react';
import {dimensions,validate} from './parameters.mjs';
import {formatLength} from './units.mjs';

export function dimensionRows(p,unit){
  const d=dimensions(p),len=(id,label,value,fields)=>({id,label,value:formatLength(value,unit),fields});
  return [
    {id:'A',label:'WCP shaft profile',value:p.shaft===12.7?'1/2 in hex':'3/8 in hex',fields:['shaft']},
    len('B','Overall width',p.spacerWidth,['spacerWidth']),
    len('C','Hex bore across flats',d.boreAF,['shaft']),
    len('D','Outside diameter',d.outerDiameter,['shaft']),
    len('E','Added hex clearance',d.clearance,['shaft']),
  ];
}

export default function Diagram({params:p,active,unit='mm'}){
  const uid=useId().replace(/:/g,'');
  if(validate(p,unit).length)return <div className="diagram-placeholder">Enter a printable width to see the diagram.</div>;
  const d=dimensions(p),rows=dimensionRows(p,unit),color=ids=>ids.split('/').some(id=>rows.find(row=>row.id===id)?.fields.includes(active))?'var(--drawing-active)':'var(--drawing-annotation)';
  const scale=144/d.outerDiameter,cx=150,cy=140,outer=d.outerDiameter*scale/2,hex=d.boreCorners*scale/2,total=p.spacerWidth*scale,sx=150-total/2;
  const borePoints=Array.from({length:6},(_,i)=>{const angle=i*Math.PI/3;return [cx+hex*Math.sin(angle),cy-hex*Math.cos(angle)];});
  const Callout=({ids,points,x,y,label})=><g style={{color:color(ids)}} className="drawing-callout"><title>{`${ids} · ${label}`}</title><polyline points={points}/><text x={x} y={y}>{ids}</text></g>;
  const Dim=({id,x1,x2,y,fromY,label})=><g style={{color:color(id)}} className="drawing-dimension"><path className="dimension-extension" d={`M${x1} ${fromY}V${y+5}M${x2} ${fromY}V${y+5}`}/><path d={`M${x1} ${y}H${x2}`} markerStart={`url(#arrow-${uid})`} markerEnd={`url(#arrow-${uid})`}/><text x={(x1+x2)/2} y={y-10} textAnchor="middle">{id} · {label}</text></g>;
  return <div className="feature-drawing">
    <svg className="drawing-definitions" width="0" height="0" aria-hidden="true" focusable="false"><defs><marker id={`arrow-${uid}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M10 1L0 5L10 9" fill="none" stroke="context-stroke"/></marker><pattern id={`hatch-${uid}`} width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><line x1="0" x2="0" y1="0" y2="7" stroke="var(--border)"/></pattern></defs></svg>
    <div className="drawing-views" role="group" aria-label={`Front and side hex spacer drawings. ${rows.map(row=>`${row.id}: ${row.label}, ${row.value}`).join('; ')}.`}>
      <figure className="drawing-view"><svg className="diagram-svg feature-svg drawing-front" viewBox="0 0 300 280" role="img" aria-label="Front hex spacer drawing"><g className="drawing-geometry" fill="none" stroke="#93a4b8" strokeWidth="1.1"><circle cx={cx} cy={cy} r={outer} fill={`url(#hatch-${uid})`}/><path d={borePoints.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ')+'Z'} fill="var(--surface)"/><path d={`M${cx-84} ${cy}H${cx+84}M${cx} ${cy-84}V${cy+84}`} strokeDasharray="8 3 2 3" strokeWidth=".6"/></g><Callout ids="A/C/E" points={`${cx+hex},${cy} 236,154 284,154`} x="240" y="140" label="Hex bore"/><Dim id="D" x1={cx-outer} x2={cx+outer} y={267} fromY={cy+outer+6} label={`Ø ${formatLength(d.outerDiameter,unit)}`}/></svg><figcaption>FRONT · WCP-STYLE PROFILE</figcaption></figure>
      <figure className="drawing-view"><svg className="diagram-svg feature-svg drawing-side" viewBox="0 0 300 280" role="img" aria-label="Side hex spacer drawing"><g className="drawing-geometry" fill="none" stroke="#93a4b8" strokeWidth="1.1"><rect x={sx} y={cy-outer} width={total} height={outer*2} fill={`url(#hatch-${uid})`}/><path d={`M${sx} ${cy-hex}H${sx+total}M${sx} ${cy+hex}H${sx+total}`} strokeDasharray="4 3"/><path d={`M${sx-18} ${cy}H${sx+total+18}`} strokeDasharray="8 3 2 3" strokeWidth=".6"/></g><Dim id="B" x1={sx} x2={sx+total} y={267} fromY={cy+outer+6} label={`${formatLength(p.spacerWidth,unit)} overall`}/></svg><figcaption>SIDE · ROUND SPACER</figcaption></figure>
    </div>
    <dl className="dimension-schedule" aria-label="Complete feature dimensions">{rows.map(row=><div key={row.id} className={row.fields.includes(active)?'highlighted':''}><dt><b>{row.id}</b>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
    <p className="drawing-note">WCP-style outer profile: 3/4 in OD for 1/2 in hex, or 5/8 in OD for 3/8 in hex. The bore is nominal hex size plus 0.30 mm across flats.</p>
  </div>;
}
