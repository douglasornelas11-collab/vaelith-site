const test=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
const {image,resize,dimensions}=require('../lib/cards');
const figure='https://cdn.sanity.io/images/project/production/abc-927x676.webp';
test('renditions never request upscaled images and preserve native dimensions',()=>{
 const html=image({image:figure,title:'Figure',contentType:'research'});assert.match(html,/width="927" height="676"/);assert.match(html,/927w/);assert.doesNotMatch(html,/960w|1280w|1600w/);assert.match(html,/fit=max/);assert.match(html,/fm=png/);assert.doesNotMatch(html,/q=84|auto=format/);assert.equal(new URL(resize(figure,1600)).searchParams.get('w'),'927');
});
test('wide infographics retain real aspect ratio and original diagrams use lossless renditions',()=>{
 const html=image({image:'https://cdn.sanity.io/images/p/d/abc-1580x457.png',title:'Indicators',imageRightsType:'original'},'article-hero',true);assert.match(html,/width="1580" height="457"/);assert.match(html,/fm=png/);assert.match(html,/data-preserve-full="true"/);assert.match(html,/fetchpriority="high"/);
});
test('unresizable external images do not get dishonest width descriptors',()=>{
 const html=image({image:'https://example.org/photo.jpg',title:'Photo'},'article-hero');assert.doesNotMatch(html,/srcset=|width="960"/);assert.equal(dimensions('https://not-cdn.sanity.io.example.org/a-10x10.jpg'),null);
});
test('photo URLs have one width parameter and a bounded quality setting',()=>{
 const u=new URL(resize('https://cdn.sanity.io/images/p/d/abc-960x640.jpg?w=120&auto=format',768));assert.equal(u.searchParams.getAll('w').length,1);assert.equal(u.searchParams.get('w'),'768');assert.equal(u.searchParams.get('fit'),'max');assert.equal(u.searchParams.get('q'),'90');
});
test('radar cards use the padded full-card link structure and never add unreviewed images',async()=>{
 class Element{constructor(tag){this.tagName=tag;this.children=[];}append(...xs){this.children.push(...xs)}}
 const list=new Element('div');const section={hidden:true,querySelector(){return list}};
 const document={getElementById(){return section},createElement:t=>new Element(t)};
 await vm.runInNewContext(fs.readFileSync('assets/news-radar.js','utf8'),{document,URL,Intl,Date,fetch:async()=>({ok:true,json:async()=>({items:[{url:'https://example.org/story',source:'Source',title:'Headline',publishedAt:'2026-10-08T12:00:00Z',image:'https://example.org/unreviewed.jpg'}]})})});
 assert.equal(section.hidden,false);const article=list.children[0];assert.equal(article.className,'card radar-card');assert.equal(article.children.length,1);const link=article.children[0];assert.equal(link.tagName,'a');assert.deepEqual(Array.from(link.children,x=>x.tagName),['div','h3','p']);assert.equal(link.children[2].className,'meta');
});
test('native-ratio and mobile card rules override legacy fixed frames',()=>{
 const css=fs.readFileSync('assets/image-quality.css','utf8');assert.match(css,/\.article-figure \.article-hero\{aspect-ratio:auto!important/);assert.match(css,/\.side-story>a\{display:flex!important/);assert.match(css,/\.card>a,\.card.no-image>a\{padding:36px!important/);assert.match(css,/@media\(max-width:760px\)/);assert.match(css,/grid-template-areas:"rank" "media" "copy"!important/);assert.match(css,/grid-area:media!important/);
});
