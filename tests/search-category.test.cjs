const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const vm = require('node:vm');

const html = readFileSync('docs/index.html', 'utf8');

function setup({deferFetch = false} = {}) {
  function element() {
    return {value:'', textContent:'', children:[], listeners:{},
      append(...children){this.children.push(...children)},
      replaceChildren(){this.children=[]},
      addEventListener(name, listener){this.listeners[name]=listener}};
  }
  const input=element(), category=element(), status=element(), results=element();
  category.value='all';
  Object.defineProperty(category, 'selectedOptions', {get(){return [{textContent:{all:'All categories', programming:'Programming & Controls', electrical:'Electrical', design:'Design'}[category.value]}]}});
  const cards=[];
  for(const list of html.matchAll(/<ul class="pages"([^>]*)>([\s\S]*?)<\/ul>/g)) {
    const listCategory=list[1].match(/data-category="([^"]+)"/)?.[1];
    for(const link of list[2].matchAll(/<a href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g)) {
      const linkCategory=link[2].match(/data-category="([^"]+)"/)?.[1];
      if(!listCategory&&!linkCategory)continue;
      cards.push({getAttribute:()=>link[1], querySelector:selector=>({textContent:link[3].match(new RegExp('class="'+selector.slice(1)+'">([\\s\\S]*?)<\\/span>'))[1].replace(/\s+/g,' ')}), dataset:{category:linkCategory}, hasAttribute:name=>link[2].includes(name), closest:()=>({dataset:{category:listCategory}})});
    }
  }
  const document={getElementById:id=>({lessonSearch:input, lessonCategory:category, searchStatus:status, searchResults:results})[id], querySelectorAll:()=>cards, createElement:element, createDocumentFragment:element};
  let calls=0, timer;
  let release;
  const pending=deferFetch?new Promise(resolve=>{release=resolve}):Promise.resolve();
  const context={document, window:{searchEasterEgg:{show:()=>false}},
    fetch:async href=>{assert.ok(!href.startsWith('https:')&&!href.includes('pully-generator'),'Only lesson pages should be fetched');calls++;await pending;return {ok:true, text:async()=>'Shared voltage lesson text'}},
    DOMParser:class{parseFromString(text){return {querySelectorAll:()=>[{textContent:text}]}}},
    setTimeout:callback=>{timer=callback;return 1}, clearTimeout:()=>{timer=null}};
  vm.runInNewContext([...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1], context);
  return {input, category, status, results, release, calls:()=>calls,
    async type(value){input.value=value;input.listeners.input();await timer()},
    async choose(value){category.value=value;category.listeners.change();await new Promise(setImmediate)}};
}

test('category browsing lists the matching lessons without fetching lesson text', async()=>{
  const page=setup();
  await page.choose('electrical');
  assert.equal(page.results.children.length,3);
  assert.match(page.status.textContent,/3 lessons in Electrical/);
  assert.ok(page.results.children.every(link=>!link.href.includes('?search=')));
  assert.equal(page.calls(),0);
  await page.choose('programming');
  assert.equal(page.results.children.length,6);
  await page.choose('all');
  assert.equal(page.results.children.length,0);
});

test('category and keyword filters combine, restore all results, and preserve highlights', async()=>{
  const page=setup();
  await page.type('voltage');
  assert.equal(page.results.children.length,9);
  await page.choose('electrical');
  assert.equal(page.results.children.length,3);
  assert.match(page.status.textContent,/in Electrical/);
  assert.ok(page.results.children.every(link=>link.href.endsWith('?search=voltage')));
  const fragment=page.results.children[0].children[1].children[0];
  assert.ok(fragment.children.some(node=>node.textContent==='voltage'));
  await page.choose('programming');
  assert.equal(page.results.children.length,6);
  await page.choose('all');
  assert.equal(page.results.children.length,9);
  assert.equal(page.calls(),9,'Loaded lesson text is reused across category changes');
  await page.type('no such phrase');
  assert.equal(page.results.children.length,0);
  assert.match(page.status.textContent,/No result/);
});

test('Design browses and searches existing design tools and resources without fetching their pages', async()=>{
  const page=setup();
  await page.choose('design');
  assert.equal(page.results.children.length,2);
  assert.match(page.status.textContent,/2 results in Design/);
  assert.deepEqual(page.results.children.map(link=>link.href),['pully-generator/index.html','https://www.frcdesign.org/']);
  await page.type('Onshape');
  assert.equal(page.results.children.length,1);
  assert.equal(page.results.children[0].href,'https://www.frcdesign.org/');
  await page.type('HTD');
  assert.equal(page.results.children.length,1);
  assert.equal(page.results.children[0].href,'pully-generator/index.html');
  await page.type('voltage');
  assert.equal(page.results.children.length,0);
  assert.equal(page.calls(),0);
});

test('All categories includes design results while lesson categories exclude them', async()=>{
  const page=setup();
  await page.type('Onshape');
  assert.equal(page.results.children.length,1);
  assert.equal(page.results.children[0].href,'https://www.frcdesign.org/');
  await page.choose('electrical');
  assert.equal(page.results.children.length,0);
  assert.match(page.status.textContent,/No lesson in Electrical/);
});

test('a pending search cannot overwrite category browsing after the query is cleared', async()=>{
  const page=setup({deferFetch:true});
  const search=page.type('voltage');
  await page.type('');
  await page.choose('electrical');
  page.release();
  await search;
  assert.equal(page.results.children.length,3);
  assert.ok(page.results.children.every(link=>!link.href.includes('?search=')));
  assert.match(page.status.textContent,/3 lessons in Electrical/);
});
