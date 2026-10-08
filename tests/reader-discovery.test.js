const test=require('node:test');const assert=require('node:assert/strict');
const content=require('../lib/content');const render=require('../lib/render-article');
test('article exposes truthful byline, reading estimate, full image and collection navigation',()=>{
 const a={slug:'discovery-test',title:'Research & evidence',category:'Tecnologia',categorySlug:'tecnologia',date:'2026-10-08',dateDisplay:'08 out 2026',contentType:'research',authorName:'Redação VAELITH',body:['Uma palavra'],image:'https://example.org/figure.png'};
 content.articles.push(a);try{const html=render(a.slug);assert.match(html,/Por Redação VAELITH/);assert.match(html,/Leitura estimada: 1 min/);assert.match(html,/class="image-expand-link" href="https:\/\/example.org\/figure.png"/);assert.match(html,/href="\/artigos-cientificos">Mais em Pesquisa &amp; Ciência/);assert.match(html,/mailto:\?subject=Research%20%26%20evidence/);}finally{content.articles.pop();}
});
test('text-only legacy article does not get a broken image enlargement link',()=>{const a={slug:'text-discovery',title:'Text',categorySlug:'gestao',category:'Gestão',date:'2026-10-08',body:[]};content.articles.push(a);try{assert.doesNotMatch(render(a.slug),/class="image-expand-link"/);}finally{content.articles.pop();}});
