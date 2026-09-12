const content=require('./content');
const {SITE,esc,navItems,shell}=require('./layout');
const {card}=require('./cards');

const group=['engenharia','construcao','infraestrutura'];

module.exports=function renderEngineering(){
  const items=content.articles.filter(x=>group.includes(x.categorySlug)&&x.contentType!=='research').sort((a,b)=>b.date.localeCompare(a.date));
  if(!items.length)return null;
  const name='Engenharia';
  const desc='Engenharia, construção civil e infraestrutura em uma única editoria: estruturas, obras, materiais, rodovias, ferrovias, pontes, energia, saneamento, manutenção e ativos críticos.';
  const other=navItems.filter(([s])=>s!=='engenharia').slice(0,5).map(([s,n])=>`<a class="topic-chip" href="/categoria/${s}">${n}</a>`).join('');
  const body=`<main><section class="page-hero"><div class="container"><div class="eyebrow">Editoria</div><h1>${name}</h1><p>${esc(desc)}</p></div></section><section class="section alt"><div class="container"><div class="section-head"><div><h2>Últimas de Engenharia</h2><p>Engenharia, construção civil e infraestrutura reunidas em um único fluxo editorial.</p></div></div><div class="list-grid">${items.map(card).join('')}</div><div class="topic-nav"><span>Explore também</span>${other}</div></div></section></main>`;
  const ld=JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name,description:desc,url:`${SITE}/categoria/engenharia`,isPartOf:{'@type':'WebSite',name:'VAELITH',url:SITE}});
  return shell({title:name,description:desc,canonical:`${SITE}/categoria/engenharia`,active:'engenharia',body,jsonLd:ld});
};
