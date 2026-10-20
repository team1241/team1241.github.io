import {MM_PER_INCH} from './units.mjs';

const WIDTH_MIN=0.8,WIDTH_MAX=100;

export function parseSpacerLengths(text,defaultUnit='in'){
  const widths=[];
  for(const [index,raw] of text.split(/\r?\n/).entries()){
    const line=raw.replace(/#.*$/,'').trim();
    if(!line)continue;
    const match=line.match(/^([+]?(?:\d+(?:\.\d*)?|\.\d+))\s*(mm|in|inch|inches|")?$/i);
    if(!match)throw new Error(`Line ${index+1}: use one positive spacer width, optionally followed by mm or in.`);
    const value=Number(match[1]),suffix=(match[2]||defaultUnit).toLowerCase();
    const mm=value*(suffix==='mm'?1:MM_PER_INCH);
    if(mm<WIDTH_MIN-1e-9||mm>WIDTH_MAX+1e-9)throw new Error(`Line ${index+1}: width must be from 0.8 mm to 100 mm.`);
    widths.push(mm);
  }
  if(!widths.length)throw new Error('The file does not contain any spacer widths.');
  return [...new Set(widths.map(width=>Number(width.toFixed(6))))];
}

const crcTable=Array.from({length:256},(_,n)=>{
  let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0;
});
const crc32=bytes=>{let c=0xffffffff;for(const byte of bytes)c=crcTable[(c^byte)&255]^(c>>>8);return (c^0xffffffff)>>>0;};
const u16=(view,offset,value)=>view.setUint16(offset,value,true);
const u32=(view,offset,value)=>view.setUint32(offset,value,true);

export async function createZip(files){
  const encoder=new TextEncoder(),locals=[],centrals=[];let offset=0;
  for(const file of files){
    const name=encoder.encode(file.name),data=new Uint8Array(await file.blob.arrayBuffer()),crc=crc32(data);
    const local=new Uint8Array(30+name.length),lv=new DataView(local.buffer);
    u32(lv,0,0x04034b50);u16(lv,4,20);u16(lv,6,0x0800);u16(lv,8,0);u32(lv,14,crc);u32(lv,18,data.length);u32(lv,22,data.length);u16(lv,26,name.length);local.set(name,30);
    const central=new Uint8Array(46+name.length),cv=new DataView(central.buffer);
    u32(cv,0,0x02014b50);u16(cv,4,20);u16(cv,6,20);u16(cv,8,0x0800);u16(cv,10,0);u32(cv,16,crc);u32(cv,20,data.length);u32(cv,24,data.length);u16(cv,28,name.length);u32(cv,42,offset);central.set(name,46);
    locals.push(local,data);centrals.push(central);offset+=local.length+data.length;
  }
  const centralSize=centrals.reduce((sum,part)=>sum+part.length,0),end=new Uint8Array(22),view=new DataView(end.buffer);
  u32(view,0,0x06054b50);u16(view,8,files.length);u16(view,10,files.length);u32(view,12,centralSize);u32(view,16,offset);
  return new Blob([...locals,...centrals,end],{type:'application/zip'});
}
