import { draw, drawPolysides, makeCylinder } from 'replicad';
import { dimensions, validate, PRINT_BORE_CHAMFER } from './parameters.mjs';
import { pulleyOutline } from './profile.mjs';
import {wcpInsertOutline,WCP_INSERT_LEAD_IN,WCP_INSERT_LEAD_IN_EXTRA,WCP_INSERT_POCKET_DEPTH} from './wcp-insert-profile.mjs';

function insertPocket(allowance,z,depth){
  const {start,commands}=wcpInsertOutline(allowance);
  let outline=draw(start);
  for(const command of commands){
    outline=command.type==='arc' ? outline.threePointsArcTo(command.to,command.via) : outline.lineTo(command.to);
  }
  const profile=outline.close();
  return profile.sketchOnPlane('XY',z).extrude(depth);
}

// Groove coordinates adapted from droftarts' Parametric Pulley, via rbuckland.
// See public/PROFILE-NOTICE.txt. Lands and groove segments are circular arcs
// fitted to the published outline, with deviation verified below 0.002 mm.
export function buildPulley(p) {
  const errors = validate(p); if (errors.length) throw new Error(errors.join(' '));
  const d = dimensions(p);
  const [start,...commands]=pulleyOutline(p);
  let outline = draw(start.to);
  for (const command of commands) {
    outline = command.type==='arc' ? outline.threePointsArcTo(command.to,command.via) : outline.lineTo(command.to);
  }
  const bottom = p.flanges > 0 && (p.flanges===2 || p.flangeSide==='bottom') ? p.flangeThickness : 0;
  let shape = outline.close().sketchOnPlane('XY', bottom).extrude(d.faceWidth);
  const fuse = (part) => { const previous = shape; shape = previous.fuse(part); previous.delete(); part.delete(); };
  const flangeRadius = d.flangeDiameter/2;
  if (bottom > 0) fuse(makeCylinder(flangeRadius, p.flangeThickness + 0.02));
  if (p.flanges === 2 || (p.flanges===1&&p.flangeSide==='top')) fuse(makeCylinder(flangeRadius, p.flangeThickness + 0.02, [0,0,bottom+d.faceWidth-0.02]));
  const bodyTop = p.width - d.extension;
  if (p.tubeEnabled) fuse(makeCylinder(p.extensionDiameter/2, p.extensionLength+0.02,[0,0,bodyTop-0.02]));
  if (p.coneEnabled) {
    // Revolved section gives an analytic cone rather than a faceted mesh.
    const coneStart=bodyTop+(p.tubeEnabled?p.extensionLength:0);
    const cone = draw([0,coneStart-0.02]).lineTo([p.coneBase/2,coneStart-0.02]).lineTo([p.coneBase/2,coneStart]).lineTo([p.coneTip/2,p.width]).lineTo([0,p.width]).close().sketchOnPlane('XZ').revolve([0,0,1]);
    fuse(cone);
  }
  const cutPocket=(cutter)=>{const previous=shape;shape=previous.cut(cutter);previous.delete();cutter.delete();};
  if(d.insertBottom){
    cutPocket(insertPocket(p.insertAllowance,-.02,WCP_INSERT_POCKET_DEPTH+.02));
    cutPocket(insertPocket(p.insertAllowance+WCP_INSERT_LEAD_IN_EXTRA,-.03,WCP_INSERT_LEAD_IN+.03));
  }
  if(d.insertTop){
    cutPocket(insertPocket(p.insertAllowance,p.width-WCP_INSERT_POCKET_DEPTH,WCP_INSERT_POCKET_DEPTH+.02));
    cutPocket(insertPocket(p.insertAllowance+WCP_INSERT_LEAD_IN_EXTRA,p.width-WCP_INSERT_LEAD_IN,WCP_INSERT_LEAD_IN+.03));
  }
  const bore = drawPolysides(d.boreCorners/2,6).rotate(p.hexAngle).sketchOnPlane('XY',-1).extrude(p.width+2);
  let result = shape.cut(bore); shape.delete(); bore.delete();
  if(p.printOptimized){
    const previous=result,edgeRadius=d.boreCorners/2+0.1;
    result=previous.chamfer(PRINT_BORE_CHAMFER,finder=>finder.either([
      selection=>selection.inPlane('XY',d.insertBottom?WCP_INSERT_POCKET_DEPTH:0).withinDistance(edgeRadius,[0,0,d.insertBottom?WCP_INSERT_POCKET_DEPTH:0]),
      selection=>selection.inPlane('XY',d.insertTop?p.width-WCP_INSERT_POCKET_DEPTH:p.width).withinDistance(edgeRadius,[0,0,d.insertTop?p.width-WCP_INSERT_POCKET_DEPTH:p.width]),
    ]));
    previous.delete();
  }
  return result;
}
