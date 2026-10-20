import {drawPolysides,makeCylinder} from 'replicad';
import {dimensions,validate} from './parameters.mjs';

export function buildSpacer(p){
  const errors=validate(p);if(errors.length)throw new Error(errors.join(' '));
  const d=dimensions(p),shape=makeCylinder(d.outerDiameter/2,p.spacerWidth);
  const bore=drawPolysides(d.boreCorners/2,6).sketchOnPlane('XY',-1).extrude(p.spacerWidth+2);
  const result=shape.cut(bore);shape.delete();bore.delete();
  return result;
}
