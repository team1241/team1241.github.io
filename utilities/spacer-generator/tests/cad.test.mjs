import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
import path from 'node:path';
import {setOC,measureVolume,importSTEP} from 'replicad';
import {buildSpacer} from '../src/model.mjs';
import {defaults,dimensions,validate,SPACER_CLEARANCE,fileName} from '../src/parameters.mjs';
import {parametersForDisplay,parametersForModel,formatLength} from '../src/units.mjs';
import {exportPart} from '../src/exports.mjs';
import {parseSpacerLengths,createZip} from '../src/batch.mjs';

const require=createRequire(import.meta.url);
const loaderPath=require.resolve('replicad-opencascadejs');
const loader=readFileSync(loaderPath,'utf8').replace('export default Module;','Module;');
const context=vm.createContext({require,process,console,Buffer,WebAssembly,TextDecoder,TextEncoder,Uint8Array,ArrayBuffer,Blob,setTimeout,clearTimeout,__dirname:path.dirname(loaderPath),__filename:loaderPath});
const init=vm.runInContext(loader,context);
setOC(await init({wasmBinary:readFileSync(path.join(path.dirname(loaderPath),'replicad_single.wasm')),print:()=>{},printErr:console.error}));

test('WCP-style profiles use fixed ODs and add 0.30 mm across flats',()=>{
  for(const [shaft,outerDiameter] of [[12.7,19.05],[9.525,15.875]]){
    const p={...defaults,shaft},d=dimensions(p);
    assert.equal(validate(p).length,0);
    assert.equal(d.outerDiameter,outerDiameter);
    assert.ok(Math.abs(d.boreAF-(shaft+SPACER_CLEARANCE))<1e-12);
    assert.match(fileName(p,'in'),shaft===12.7?/half/:/three-eighths/);
  }
});

test('the practical printing cutoff accepts 0.8 mm and rejects thinner spacers',()=>{
  assert.equal(validate({...defaults,spacerWidth:.8}).length,0);
  assert.ok(validate({...defaults,spacerWidth:.799}).some(error=>error.includes('Spacer width')));
  assert.ok(validate({...defaults,spacerWidth:101}).some(error=>error.includes('Spacer width')));
});

test('both spacer profiles produce correctly sized solids and valid STEP/STL exports',async()=>{
  for(const [shaft,outerDiameter] of [[12.7,19.05],[9.525,15.875]]){
    const p={...defaults,shaft,spacerWidth:6.35},shape=buildSpacer(p),bounds=shape.boundingBox.bounds;
    assert.ok(measureVolume(shape)>0);
    assert.ok(Math.abs((bounds[1][0]-bounds[0][0])-outerDiameter)<1e-6);
    assert.ok(Math.abs((bounds[1][1]-bounds[0][1])-outerDiameter)<1e-6);
    assert.ok(Math.abs((bounds[1][2]-bounds[0][2])-p.spacerWidth)<1e-6);
    const step=exportPart(shape,'step','mm'),text=await step.text();
    assert.ok(text.startsWith('ISO-10303-21;'));
    assert.ok(text.includes('MANIFOLD_SOLID_BREP'));
    const imported=await importSTEP(step);
    assert.ok(Math.abs(measureVolume(imported)-measureVolume(shape))<0.01);
    imported.delete();
    const bytes=await exportPart(shape,'stl','mm').arrayBuffer(),view=new DataView(bytes),count=view.getUint32(80,true);
    assert.equal(bytes.byteLength,84+count*50);
    assert.ok(count>20);
    shape.delete();
  }
});

test('selected units round-trip and change STEP metadata and STL coordinates',async()=>{
  const inches=parametersForDisplay(defaults,'in');
  assert.equal(inches.shaft,.5);
  assert.equal(inches.spacerWidth,.125);
  assert.deepEqual(parametersForModel(inches,'in'),defaults);
  assert.equal(formatLength(25.4,'in'),'1.0000 in');
  const shape=buildSpacer(defaults),inchStep=exportPart(shape,'step','in');
  assert.match(await inchStep.text(),/CONVERSION_BASED_UNIT\('INCH'/);
  const bytes=await exportPart(shape,'stl','in').arrayBuffer(),view=new DataView(bytes),count=view.getUint32(80,true),z=[];
  for(let i=0;i<count;i++)for(let vertex=0;vertex<3;vertex++)z.push(view.getFloat32(84+i*50+12+vertex*12+8,true));
  assert.ok(Math.abs(Math.max(...z)-Math.min(...z)-defaults.spacerWidth/25.4)<0.0001);
  shape.delete();
});

test('batch files parse explicit/default units, comments, duplicates, and invalid widths',()=>{
  assert.deepEqual(parseSpacerLengths('0.125\n0.25 in\n# duplicate\n0.125','in'),[3.175,6.35]);
  assert.deepEqual(parseSpacerLengths('1\n2.5mm\n1 in','mm'),[1,2.5,25.4]);
  assert.throws(()=>parseSpacerLengths('0.5 mm','mm'),/0.8 mm/);
  assert.throws(()=>parseSpacerLengths('wide','in'),/Line 1/);
  assert.throws(()=>parseSpacerLengths('# no lengths','in'),/does not contain/);
});

test('batch export creates a readable ZIP directory with both spacer groups',async()=>{
  const names=['half-3.175mm.step','three-eighths-6.35mm.stl'];
  const zip=await createZip(names.map((name,index)=>({name,blob:new Blob([index?'STL':'STEP'])})));
  const bytes=new Uint8Array(await zip.arrayBuffer()),text=new TextDecoder().decode(bytes);
  assert.deepEqual([...bytes.slice(0,4)],[0x50,0x4b,0x03,0x04]);
  assert.deepEqual([...bytes.slice(-22,-18)],[0x50,0x4b,0x05,0x06]);
  for(const name of names)assert.ok(text.includes(name));
});
