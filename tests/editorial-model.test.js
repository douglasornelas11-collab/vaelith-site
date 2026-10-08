const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const home=require('../lib/render-home');const {shell}=require('../lib/layout');
test('news hero adapts approved split composition without removing news or core routes',()=>{
 const html=home();assert.match(html,/class="hero-feature-copy"/);assert.match(html,/class="hero-feature-media"/);assert.match(html,/Ler a matéria/);assert.match(html,/aria-label="Acesso rápido às editorias"/);
 for(const href of ['/categoria/engenharia','/categoria/arquitetura','/categoria/tecnologia','/categoria/mercado','/categoria/gestao','/categoria/sustentabilidade','/artigos-cientificos','/editorial','/buscar','/arquivo','/eventos'])assert.ok(html.includes(`href="${href}"`),href);
 assert.match(html,/<h2>Últimas notícias<\/h2>/);assert.match(html,/application\/ld\+json/);assert.equal((html.match(/<h1>/g)||[]).length,1);
});
test('adaptation loads last and locally hosted licensed fonts are present',()=>{
 const html=shell({});assert.ok(html.indexOf('/assets/editorial-model.css')>html.indexOf('/assets/brand.css'));
 for(const file of ['vaelith-sans-regular.woff','vaelith-sans-bold.woff']){const data=fs.readFileSync(`assets/fonts/${file}`);assert.equal(data.subarray(0,4).toString(),'wOFF');assert.ok(data.length<100000);}
 assert.match(fs.readFileSync('assets/fonts/LICENSE.txt','utf8'),/Permission is hereby granted/);
 const css=fs.readFileSync('assets/editorial-model.css','utf8');assert.match(css,/@media\(max-width:760px\)/);assert.match(css,/@media\(max-width:360px\)/);assert.match(css,/data-preserve-full/);assert.match(css,/font-display:swap/);
});
