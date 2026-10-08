const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const content=require('../lib/content');const render=require('../lib/render-article');
test('empty key-fact entries never render null and valid zero values remain visible',()=>{
 const a={slug:'facts-error-test',title:'Facts',category:'Gestão',categorySlug:'gestao',date:'2026-10-08',keyFacts:[{label:'Valid',value:'Value'},{label:null,value:null},null,{label:'Zero',value:0}],body:[]};content.articles.push(a);
 try{const html=render(a.slug);assert.doesNotMatch(html,/<span>null|<strong>null/);assert.match(html,/<strong>Value<\/strong>/);assert.match(html,/<strong>0<\/strong>/);}finally{content.articles.pop();}
});
test('failed hero image collapses its media column',()=>{
 let handler;const added=[];const media={hidden:false};const card={classList:{add(c){added.push(c)}}};
 class Image {constructor(){this.style={setProperty(){}}}closest(selector){if(selector==='main')return {};if(selector==='.card,.side-story,.hero-story')return card;if(selector==='.hero-feature-media')return media;return null;}}
 const document={addEventListener(type,fn){handler=fn},querySelectorAll(){return []}};
 vm.runInNewContext(fs.readFileSync('assets/image-fallback.js','utf8'),{document,HTMLImageElement:Image});handler({target:new Image()});assert.deepEqual(added,['no-image']);assert.equal(media.hidden,true);
});
test('failed article image preserves attribution and does not leave broken enlarge link',()=>{
 let handler;const caption={textContent:'Original author · CC BY 4.0'};const expand={hidden:false};const children=[];const figure={querySelector(s){if(s==='.image-expand-link')return expand;if(s==='.image-error')return children[0];if(s==='figcaption')return caption;},append(x){children.push(x)}};
 class Image{constructor(){this.style={setProperty(){}}}closest(s){if(s==='main')return {};if(s==='.article-figure')return figure;return null;}}
 const document={addEventListener(t,fn){handler=fn},querySelectorAll(){return []},createElement(){return {}}};vm.runInNewContext(fs.readFileSync('assets/image-fallback.js','utf8'),{document,HTMLImageElement:Image});const image=new Image();handler({target:image});handler({target:image});assert.equal(expand.hidden,true);assert.equal(caption.textContent,'Original author · CC BY 4.0');assert.equal(children.length,1);
});
test('mobile menu has bounded scroll height and supports Escape',()=>{const css=fs.readFileSync('assets/editorial-model.css','utf8');assert.match(css,/max-height:calc\(100dvh - 72px\);overflow-y:auto/);const html=require('../lib/layout').shell({});assert.match(html,/event.key==='Escape'/);assert.match(html,/b.focus\(\)/);});
