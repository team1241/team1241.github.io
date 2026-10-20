const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const {resolve} = require('node:path');
const {pathToFileURL} = require('node:url');
const html = readFileSync('docs/spacer-generator/index.html','utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];

test('spacer file preview embeds the complete app and initializes theme before paint',()=>{
  assert.equal(scripts.length,2);
  assert.ok(scripts[0].index < html.indexOf('<style>'));
  assert.ok(scripts[0].index < html.indexOf('</head>'));
  assert.ok(scripts[1].index > html.indexOf('<div id="root">'));
  assert.ok(!/<script[^>]+(?:src=|type="module")/.test(html));
  assert.ok(!/<link[^>]+rel="stylesheet"/.test(html));
  assert.ok(!scripts[1][1].includes('import.meta'));
  for(const script of scripts)new vm.Script(script[1]);
  assert.match(html,/href="\.\.\/index.html#utilities"/);
  assert.match(readFileSync('docs/index.html','utf8'),/href="spacer-generator\/index.html" data-utility/);
});

test('embedded spacer worker builds CAD and exports without network access',async()=>{
  const code=scripts[1][1];
  const blob=code.match(/new Blob\(\["[^"]*",([\w$]+)\],\{type:"text\/javascript/);
  assert.ok(blob,'Expected an embedded Blob worker');
  const start=code.indexOf(blob[1]+"='")+blob[1].length+1;
  let end=start+1;
  while(end<code.length){if(code[end]==='\\'){end+=2;continue;}if(code[end]==="'")break;end++;}
  const worker=vm.runInNewContext(code.slice(start,end+1));
  let receive;
  const self={location:{href:'blob:null/standalone-spacer-preview'},postMessage:data=>receive(data)};
  const context={self,location:self.location,URL,WebAssembly,Blob,console,setTimeout,clearTimeout,performance,TextDecoder,TextEncoder,atob,btoa,
    fetch:()=>{throw new Error('Standalone spacer worker attempted a network fetch')}};
  vm.runInNewContext(worker,context);
  const {defaults}=await import(pathToFileURL(resolve('utilities/spacer-generator/src/parameters.mjs')).href);
  async function request(data){
    const response=new Promise(resolve=>receive=resolve);
    await self.onmessage({data:{params:defaults,...data}});
    const result=await response;
    assert.ok(!result.error,result.error);
    return result;
  }
  const model=await request({id:1,action:'build'});
  assert.ok(model.volume>0);
  assert.ok(model.mesh.triangles.length>0);
  const exported=await request({id:2,action:'export',format:'stl',unit:'mm'});
  const bytes=new DataView(await exported.blob.arrayBuffer());
  assert.ok(bytes.getUint32(80,true)>0);
  assert.equal(bytes.byteLength,84+50*bytes.getUint32(80,true));
});
