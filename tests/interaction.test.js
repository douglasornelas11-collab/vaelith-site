const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {shell} = require('../lib/layout');
const js = fs.readFileSync('assets/navigation.js','utf8');
test('main navigation keeps all ten labels in order and announces the selected page',()=>{
 const html = shell({active:'engenharia'});
 const nav = html.split('<nav class="navbar"')[1].split('</nav>')[0];
 const labels=[...nav.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(m=>m[1]);
 assert.deepEqual(labels.slice(0,10),['Início','Engenharia','Arquitetura','Tecnologia','Mercado','Gestão','Sustentabilidade','Editorial VAELITH','Pesquisa & Ciência','Agenda']);
 assert.match(nav,/href="\/categoria\/engenharia" class="active" aria-current="page"/);
 assert.match(html,/class="mobile-search" href="\/buscar"/);
});
test('menu toggles repeatedly, restores Escape focus, closes outside, on link, resize and history',()=>{
 const listeners={};const classes=new Set();const attrs={'aria-expanded':'false'};let focused=false;
 const make=(name)=>({addEventListener:(type,fn)=>listeners[name+type]=fn});
 const header={...make('header'),classList:{toggle:(name,v)=>v?classes.add(name):classes.delete(name),contains:name=>classes.has(name)},contains:t=>t==='inside'};
 const button={...make('button'),setAttribute:(k,v)=>attrs[k]=v,getAttribute:k=>attrs[k],focus:()=>focused=true};const label={textContent:''};const nav=make('nav');
 const document={...make('document'),getElementById:id=>({siteHeader:header,menuBtn:button,menuLabel:label,mainNav:nav})[id]};
 const window={...make('window'),matchMedia:()=>make('media')};vm.runInNewContext(js,{window,document});
 const open=()=>{listeners.buttonclick();assert.equal(attrs['aria-expanded'],'true');assert.equal(label.textContent,'Fechar');};
 const closed=()=>{assert.equal(attrs['aria-expanded'],'false');assert.equal(label.textContent,'Editorias');assert.equal(classes.has('open'),false);};
 open();listeners.buttonclick();closed();open();listeners.documentkeydown({key:'Escape'});closed();assert.ok(focused);
 open();listeners.documentclick({target:'outside'});closed();open();listeners.headerfocusout({relatedTarget:'outside'});closed();
 open();listeners.navclick({target:{closest:()=>true}});closed();open();listeners.mediachange();closed();open();listeners.windowpageshow();closed();
});
test('local licensed variable font and motion/touch refinements are present',()=>{
 const font=fs.readFileSync('assets/fonts/manrope-variable.woff');assert.equal(font.subarray(0,4).toString(),'wOFF');assert.ok(font.length<100000);
 assert.match(fs.readFileSync('assets/fonts/Manrope-OFL.txt','utf8'),/SIL OPEN FONT LICENSE/);
 const css=fs.readFileSync('assets/interaction.css','utf8');for(const rule of ['prefers-reduced-motion','hover:hover','focus-visible','min-height:48px','font-display:swap','max-width:1100px'])assert.ok(css.includes(rule));
});
