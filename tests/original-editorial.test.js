const test=require('node:test');const assert=require('node:assert/strict');
const content=require('../lib/content');const registry=require('../lib/original-editorial.json');const render=require('../lib/render-editorial');const {shell}=require('../lib/layout');
test('original section only identifies explicitly curated exact-title originals',()=>{
 const a={slug:'original-test',title:'Original analysis',date:'2099-01-01',contentType:'analysis',dek:'Context'};
 const legacy={...a,slug:'legacy-test',title:'Legacy analysis'};registry[a.slug]={title:a.title,format:'Análise'};content.articles.push(a,legacy);
 try{const html=render();assert.match(html,/noticias\/original-test/);assert.doesNotMatch(html,/noticias\/legacy-test/);assert.match(html,/Análise · Editorial VAELITH/);a.title='Changed';assert.doesNotMatch(render(),/noticias\/original-test/);}finally{content.articles.splice(-2);delete registry['original-test'];}
});
test('editorial route is linked in both main navigation and footer',()=>{const html=shell({});assert.equal((html.match(/href="\/editorial"/g)||[]).length,2);const routes=require('../vercel.json');assert.ok(routes.rewrites.some(r=>r.source==='/editorial'));});
test('rich source links work in news and original editorial',()=>{
 const renderArticle=require('../lib/render-article');
 const a={slug:'scope-test',title:'Original test',date:'2099-01-01',category:'Gestão',categorySlug:'gestao',sourceUrl:'https://example.org/primary',body:['Plain source'],richBody:[{_type:'block',markDefs:[{_key:'x',_type:'link',href:'https://example.org/source'}],children:[{text:'Source',marks:['x']}]}]};
 content.articles.push(a);
 try {assert.doesNotMatch(renderArticle(a.slug),/Fonte original: null/);assert.match(renderArticle(a.slug),/Consultar fonte original/);assert.match(renderArticle(a.slug),/href="https:\/\/example.org\/source"/);registry[a.slug]={title:a.title,format:'Análise'};assert.match(renderArticle(a.slug),/href="https:\/\/example.org\/source"/);}finally{content.articles.pop();delete registry[a.slug];}
});
