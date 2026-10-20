import {formatLength} from './units.mjs';

export const SPACER_CLEARANCE=0.3;
export const spacerProfiles={
  12.7:{label:'1/2 in',outerDiameter:19.05},
  9.525:{label:'3/8 in',outerDiameter:15.875},
};
export const defaults={shaft:12.7,spacerWidth:3.175};
export const limits={spacerWidth:[0.8,100]};

export function dimensions(p){
  const profile=spacerProfiles[p.shaft],boreAF=p.shaft+SPACER_CLEARANCE;
  return {outerDiameter:profile?.outerDiameter??NaN,boreAF,boreCorners:boreAF/Math.cos(Math.PI/6),width:p.spacerWidth,clearance:SPACER_CLEARANCE};
}

export function validate(p,unit='mm'){
  const errors=[];
  if(![12.7,9.525].includes(p.shaft))errors.push('Choose a 1/2-inch or 3/8-inch shaft.');
  const [min,max]=limits.spacerWidth;
  if(!Number.isFinite(p.spacerWidth)||p.spacerWidth<min-1e-9||p.spacerWidth>max+1e-9)errors.push(`Spacer width: enter a value from ${formatLength(min,unit)} to ${formatLength(max,unit)}.`);
  return errors;
}

export function fileName(p,unit='mm'){
  const shaft=p.shaft===12.7?'half':'three-eighths';
  return `WCP-style-${shaft}-hex-spacer-${formatLength(p.spacerWidth,unit).replace(' ','')}`;
}
