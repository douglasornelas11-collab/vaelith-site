const test=require('node:test');const assert=require('node:assert/strict');
const {renderPortableText,safeLink}=require('../lib/portable-text');
const block=(text,props={})=>({_type:'block',children:[{_type:'span',text}],...props});
test('body preserves source links, headings and lists',()=>{
 const html=renderPortableText([block('Fontes',{style:'h2'}),block('[2] Fonte',{markDefs:[{_key:'source',_type:'link',href:'https://example.org/source?a=1&b=2'}],children:[{_type:'span',text:'[2] Fonte',marks:['source']}]}),block('Primeiro',{listItem:'bullet'}),block('Segundo',{listItem:'bullet'}),block('Fim')]);
 assert.match(html,/<h2>Fontes<\/h2>/);assert.match(html,/href="https:\/\/example.org\/source\?a=1&amp;b=2"/);assert.match(html,/<ul><li>Primeiro<\/li><li>Segundo<\/li><\/ul><p>Fim<\/p>/);
});
test('body escapes content and rejects script links and unsupported markup',()=>{
 assert.equal(safeLink('javascript:alert(1)'),'');assert.equal(safeLink('data:text/html,unsafe'),'');
 const html=renderPortableText([block('<script>alert(1)</script>',{style:'script',markDefs:[{_key:'x',_type:'link',href:'javascript:alert(1)'}],children:[{text:'<img onerror="bad">',marks:['x']} ]})]);
 assert.doesNotMatch(html,/<script|<img|href=/);assert.match(html,/&lt;img/);
});
