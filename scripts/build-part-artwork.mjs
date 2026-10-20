import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {setOC,importSTEP} from '../utilities/pulley-generator/node_modules/replicad/dist/replicad.js';

const source=process.argv[2];
if(!source)throw new Error('Usage: node scripts/build-part-artwork.mjs <STEP file>');
const require=createRequire(import.meta.url);
const loaderPath=fileURLToPath(new URL('../utilities/pulley-generator/node_modules/replicad-opencascadejs/src/replicad_single.js',import.meta.url));
const loader=readFileSync(loaderPath,'utf8').replace(/export default Module;?\s*$/,'Module;');
const context=vm.createContext({require,process,console,Buffer,WebAssembly,TextDecoder,TextEncoder,Uint8Array,ArrayBuffer,Blob,setTimeout,clearTimeout,__dirname:path.dirname(loaderPath),__filename:loaderPath});
const init=vm.runInContext(loader,context);
setOC(await init({wasmBinary:readFileSync(path.join(path.dirname(loaderPath),'replicad_single.wasm')),print:()=>{},printErr:()=>{}}));
const shape=await importSTEP(new Blob([readFileSync(source)]));
const mesh=shape.mesh({tolerance:.3,angularTolerance:.3});
// Stand the longest model axis upright, then keep the upright and projecting
// arms vertical/horizontal on screen. Depth recedes diagonally without camera roll.
const spans=[0,1,2].map(axis=>{
  const values=mesh.vertices.filter((_,index)=>index%3===axis);
  return Math.max(...values)-Math.min(...values);
});
const uprightAxis=spans.indexOf(Math.max(...spans));
const upright=([x,y,z])=>uprightAxis===0?[y,z,x]:uprightAxis===1?[x,-z,y]:[x,y,z];
const project=point=>{
  const [x,y,z]=upright(point);
  return [x-.55*y,-z+.28*y,.55*x+y];
};
const points=[];
for(let i=0;i<mesh.vertices.length;i+=3)points.push(project(mesh.vertices.slice(i,i+3)));
const minX=Math.min(...points.map(p=>p[0])),maxX=Math.max(...points.map(p=>p[0]));
const minY=Math.min(...points.map(p=>p[1])),maxY=Math.max(...points.map(p=>p[1]));
const scale=Math.min(560/(maxX-minX),480/(maxY-minY));
const xy=p=>[(p[0]-(minX+maxX)/2)*scale+320,(p[1]-(minY+maxY)/2)*scale+280];
const faces=[];
const depthBuffer=new Float32Array(640*560).fill(-Infinity);
const lightDirection=[.3,.4,.866];
function faceLighting(indices){
  const [a,b,c]=indices.map(index=>upright(mesh.vertices.slice(index*3,index*3+3)));
  const u=b.map((v,i)=>v-a[i]),v=c.map((value,i)=>value-a[i]);
  const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  const length=Math.hypot(...n);
  return Math.round(230*(.58+.42*Math.max(0,n.reduce((sum,value,i)=>sum+value/length*lightDirection[i],0))));
}
function rasterDepth(a,b,c){
  const [ax,ay]=xy(a),[bx,by]=xy(b),[cx,cy]=xy(c);
  const denominator=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy);
  const left=Math.max(0,Math.floor(Math.min(ax,bx,cx))),right=Math.min(639,Math.ceil(Math.max(ax,bx,cx)));
  const top=Math.max(0,Math.floor(Math.min(ay,by,cy))),bottom=Math.min(559,Math.ceil(Math.max(ay,by,cy)));
  for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++){
    const w0=((by-cy)*(x+.5-cx)+(cx-bx)*(y+.5-cy))/denominator;
    const w1=((cy-ay)*(x+.5-cx)+(ax-cx)*(y+.5-cy))/denominator,w2=1-w0-w1;
    if(w0<0||w1<0||w2<0)continue;
    const index=y*640+x,depth=w0*a[2]+w1*b[2]+w2*c[2];
    depthBuffer[index]=Math.max(depthBuffer[index],depth);
  }
}
for(let i=0;i<mesh.triangles.length;i+=3){
  const a=points[mesh.triangles[i]],b=points[mesh.triangles[i+1]],c=points[mesh.triangles[i+2]];
  const normal=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  if(normal<=0)continue;
  const color=faceLighting(mesh.triangles.slice(i,i+3)),coords=[a,b,c].map(p=>xy(p).map(v=>v.toFixed(2)).join(',')).join(' ');
  rasterDepth(a,b,c);
  // Matching subpixel strokes seal antialiasing seams between coplanar triangles.
  const shade=`rgb(${color-4},${color},${color+4})`;
  faces.push({depth:(a[2]+b[2]+c[2])/3,svg:`<polygon points="${coords}" fill="${shade}" stroke="${shade}" stroke-width=".6" stroke-linejoin="round"/>`});
}
faces.sort((a,b)=>a.depth-b.depth);
const edges=shape.meshEdges({tolerance:.3,angularTolerance:.3}).lines;
let outlines='';
const depthTolerance=(Math.max(...points.map(p=>p[2]))-Math.min(...points.map(p=>p[2])))*.008;
for(let i=0;i<edges.length;i+=6){
  const pa=project(edges.slice(i,i+3)),pb=project(edges.slice(i+3,i+6)),a=xy(pa),b=xy(pb);
  const steps=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/1.5));
  let start=null;
  for(let step=0;step<steps;step++){
    const t=(step+.5)/steps,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;
    const pixel=Math.min(559,Math.max(0,Math.floor(y)))*640+Math.min(639,Math.max(0,Math.floor(x)));
    const visible=pa[2]+(pb[2]-pa[2])*t>=depthBuffer[pixel]-depthTolerance;
    if(visible&&start===null)start=step/steps;
    if(start!==null&&(!visible||step===steps-1)){
      const end=visible?(step+1)/steps:step/steps;
      const from=a.map((value,k)=>value+(b[k]-value)*start),to=a.map((value,k)=>value+(b[k]-value)*end);
      outlines+=`M${from.map(v=>v.toFixed(2)).join(',')}L${to.map(v=>v.toFixed(2)).join(',')}`;
      start=null;
    }
  }
}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 560"><title>&quot;the part&quot;</title>${faces.map(f=>f.svg).join('')}<path d="${outlines}" fill="none" stroke="#536373" stroke-width=".6" opacity=".65"/></svg>`;
const directory=new URL('../docs/assets/the-part/',import.meta.url);
mkdirSync(directory,{recursive:true});
writeFileSync(new URL('the-part.svg',directory),svg);
shape.delete();
console.log(`Generated upright STEP illustration: ${points.length} vertices, ${faces.length} visible triangles; model axis ${uprightAxis} up.`);
