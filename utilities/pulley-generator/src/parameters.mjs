import profiles from './profiles.json' with { type: 'json' };
import {formatLength} from './units.mjs';
import {WCP_INSERT_OUTER_RADIUS,WCP_INSERT_POCKET_DEPTH} from './wcp-insert-profile.mjs';

export const PRINT_BORE_CHAMFER = 0.4;
export const defaults = { pitch: 5, teeth: 24, width: 18, shaft: 12.7, clearance: 0.3, flanges: 2, flangeSide: 'bottom', flangeThickness: 1.5, flangeOverhang: 2, tubeEnabled: false, coneEnabled: false, insertCount: 0, insertSide: 'bottom', insertAllowance: 0.1, printOptimized: true, extensionLength: 10, extensionDiameter: 25.2, coneLength: 5, coneBase: 24, coneTip: 18.5, grooveWidth: 0, grooveDepth: 0, hexAngle: 0 };
export const limits = { teeth: [12, 100], width: [5, 100], clearance: [0, 0.6], flangeThickness: [0.5, 4], flangeOverhang: [0.5, 6], extensionLength: [1, 60], extensionDiameter: [12, 100], coneLength: [1, 30], coneBase: [12, 100], coneTip: [12, 100], grooveWidth: [-0.3,0.3], grooveDepth: [-0.3,0.3], hexAngle: [0,60], insertAllowance:[0,0.3] };
export function grooveScales(p,profile){
  const half=Math.max(...profile.map(([x])=>Math.abs(x)));
  const depth=Math.max(...profile.map(([,y])=>y));
  return {widthScale:(half+p.grooveWidth/2)/half,depthScale:(depth+p.grooveDepth)/depth};
}
export function dimensions(p) {
  const pitchDiameter = p.teeth * p.pitch / Math.PI;
  const outsideDiameter = pitchDiameter - 2 * (p.pitch === 5 ? 0.5715 : 0.381);
  const profile = profiles[p.pitch];
  const scales=grooveScales(p,profile);
  const halfGroove = Math.max(...profile.map(([x]) => Math.abs(x)))*scales.widthScale;
  const grooveDepth = Math.max(...profile.map(([,y]) => y))*scales.depthScale;
  const chordRadius = Math.sqrt((outsideDiameter / 2) ** 2 - halfGroove ** 2);
  const extension = (p.tubeEnabled ? p.extensionLength : 0) + (p.coneEnabled ? p.coneLength : 0);
  const faceWidth = p.width - p.flanges * p.flangeThickness - extension;
  const boreAF = p.shaft + p.clearance;
  const insertBottom=p.insertCount===2||(p.insertCount===1&&p.insertSide==='bottom');
  const insertTop=p.insertCount===2||(p.insertCount===1&&p.insertSide==='top');
  return { pitchDiameter, outsideDiameter, rootDiameter: 2 * (chordRadius - grooveDepth), flangeDiameter: outsideDiameter + 2 * p.flangeOverhang, boreAF, boreCorners: boreAF / Math.cos(Math.PI / 6), faceWidth, extension, insertBottom, insertTop, insertPocketDepth:WCP_INSERT_POCKET_DEPTH, chordRadius, profile, ...scales };
}
export function validate(p,unit='mm') {
  const errors = [];
  for (const [key, [min,max]] of Object.entries(limits)) {
    if (!Number.isFinite(p[key]) || p[key] < min-1e-9 || p[key] > max+1e-9) errors.push(`${key.replace(/([A-Z])/g, ' $1')}: enter a value from ${key==='teeth'||key==='hexAngle'?min:formatLength(min,unit)} to ${key==='teeth'||key==='hexAngle'?max:formatLength(max,unit)}.`);
  }
  if (![3,5].includes(p.pitch)) errors.push('Choose HTD 3M or 5M.');
  if (![12.7,9.525].includes(p.shaft)) errors.push('Choose a 1/2-inch or 3/8-inch shaft.');
  if (!Number.isInteger(p.teeth)) errors.push('Tooth count must be a whole number.');
  if (![0,1,2].includes(p.flanges)) errors.push('Choose zero, one, or two flanges.');
  if (!['bottom','top'].includes(p.flangeSide)) errors.push('Choose the side for a single flange.');
  if (![0,1,2].includes(p.insertCount)) errors.push('Choose zero, one, or two WCP inserts.');
  if (!['bottom','top'].includes(p.insertSide)) errors.push('Choose the side for a single WCP insert.');
  if (errors.length) return errors;
  const d = dimensions(p);
  const faceMinimum=p.printOptimized?4:3,wallMinimum=p.printOptimized?2:1.5,tubeWall=2*wallMinimum,coneWall=p.printOptimized?3:2;
  if (d.faceWidth < faceMinimum) errors.push(`Increase overall width: the toothed face needs at least ${formatLength(faceMinimum,unit)} after flanges and end features.`);
  if ((d.rootDiameter-d.boreCorners)/2 < wallMinimum) errors.push(`Increase tooth count or choose a smaller shaft: the tooth roots need at least ${formatLength(wallMinimum,unit)} of wall around the hex corners.`);
  if (p.printOptimized && p.flanges>0 && p.flangeThickness<1.2) errors.push(`Increase flange thickness to at least ${formatLength(1.2,unit)} for reliable layer bonding.`);
  if (p.tubeEnabled && p.extensionDiameter < d.boreCorners + tubeWall) errors.push(`Increase insert diameter: leave at least ${formatLength(wallMinimum,unit)} of wall around the hex corners.`);
  if (p.tubeEnabled && p.extensionDiameter > d.rootDiameter) errors.push('Keep the insert diameter at or below the tooth-root diameter, or increase tooth count.');
  if (p.printOptimized && p.tubeEnabled && p.extensionLength<2) errors.push(`Increase insert length to at least ${formatLength(2,unit)} for a printable end feature.`);
  if (p.coneEnabled) {
    const baseLimit=p.tubeEnabled?p.extensionDiameter:d.rootDiameter;
    if (p.coneTip < d.boreCorners + coneWall || p.coneTip > p.coneBase || p.coneBase > baseLimit) errors.push(`The cone contact diameter must clear the hex corners by ${formatLength(coneWall,unit)}, be no larger than its base, and the base must fit the ${p.tubeEnabled?'tube insert':'tooth-root diameter'}.`);
    if (p.printOptimized && p.coneLength<2) errors.push(`Increase cone length to at least ${formatLength(2,unit)} for a printable taper.`);
  }
  if(p.insertCount>0){
    const webMinimum=p.printOptimized?1.2:.8,bodyWidth=p.width-d.extension;
    if(p.shaft!==12.7)errors.push('WCP-1121 insert pockets require the 1/2-inch hex shaft option.');
    if(d.insertTop&&(p.tubeEnabled||p.coneEnabled))errors.push('A top-side WCP insert pocket cannot be combined with a tube insert or bearing cone on that end.');
    if(bodyWidth<p.insertCount*WCP_INSERT_POCKET_DEPTH+webMinimum)errors.push(`Increase overall width: WCP insert pockets need ${formatLength(WCP_INSERT_POCKET_DEPTH,unit)} per side plus ${formatLength(webMinimum,unit)} of center web.`);
    if(d.rootDiameter/2-WCP_INSERT_OUTER_RADIUS-p.insertAllowance<wallMinimum)errors.push(`Increase tooth count: leave at least ${formatLength(wallMinimum,unit)} between the WCP insert pocket and tooth roots.`);
  }
  return errors;
}
export function featureName(p){return p.tubeEnabled&&p.coneEnabled?'tube-cone':p.tubeEnabled?'tube':p.coneEnabled?'bearing-cone':'standard';}
export function insertName(p){return p.insertCount===2?'wcp-inserts-both':p.insertCount===1?`wcp-insert-${p.insertSide}`:'no-insert';}
export function fileName(p,unit='mm') { return `HTD-${p.pitch}M-${p.teeth}T-${formatLength(p.width,unit).replace(' ','')}-${p.shaft === 12.7 ? 'half' : 'three-eighths'}-hex-${featureName(p)}-${insertName(p)}`; }
