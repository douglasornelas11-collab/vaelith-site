// VAELITH home editorial
const content=require('./content');
const {SITE,esc,navItems,shell}=require('./layout');
const {card,side,image}=require('./cards');

const categoryCopy={
  engenharia:'Engenharia, construção civil e infraestrutura em uma única editoria.',
  arquitetura:'Projetos, cidades, urbanismo e cultura do projeto.',
  tecnologia:'IA, BIM, automação, dados e Construction Tech.',
  mercado:'Crédito, investimentos, empresas e indicadores.',
  gestao:'Planejamento, riscos, contratos e entrega de projetos.',
  sustentabilidade:'Carbono, energia, materiais e resiliência.',
  research:'Artigos científicos, evidências, métodos e aplicação profissional.'
};
const adSlot=(label='Publicidade')=>`<div class="ad-slot" aria-label="${label}"><span>${label}</span><strong>Espaço reservado para parceiros VAELITH</strong><a href="/midia-kit">Mídia kit →</a></div>`;
const engineeringGroup=['engenharia','construcao','infraestrutura'];

module.exports=function renderHome(){
  const all=[...content.articles].sort((a,b)=>b.date.localeCompare(a.date));
  const editorial=all.filter(a=>a.contentType!=='research');
  const research=all.filter(a=>a.contentType==='research');
  const lead=editorial[0]||all[0];
  const sides=editorial.slice(1,3);
  const featured=new Set([lead&&lead.slug,...sides.map(x=>x.slug)].filter(Boolean));
  const latest=editorial.filter(a=>!featured.has(a.slug)).slice(0,4);
  const latestSet=new Set(latest.map(x=>x.slug));
  const focusItems=editorial.filter(a=>!featured.has(a.slug)&&!latestSet.has(a.slug)).slice(0,5);
  const focus=focusItems.map((a,i)=>`<a class="rank-item" href="/noticias/${esc(a.slug)}"><span>${String(i+1).padStart(2,'0')}</span><div><small>${esc(a.category)}</small><strong>${esc(a.title)}</strong></div></a>`).join('');
  const editorialTiles=navItems.map(([slug,name],i)=>`<a class="cat-tile" href="/categoria/${slug}"><small>${String(i+1).padStart(2,'0')}</small><h3>${name}</h3><p>${categoryCopy[slug]}</p></a>`).join('');
  const researchTile=`<a class="cat-tile" href="/artigos-cientificos"><small>${String(navItems.length+1).padStart(2,'0')}</small><h3>Pesquisa & Ciência</h3><p>${categoryCopy.research}</p></a>`;
  const categories=editorialTiles+researchTile;
  const researchHighlights=research.slice(0,3);
  const researchSection=researchHighlights.length?`<section class="section research-section"><div class="container"><div class="section-head"><div><div class="eyebrow">Pesquisa & Ciência</div><h2>Artigos científicos em destaque</h2><p>Estudos recentes com relevância prática para engenharia, construção, infraestrutura, gestão e tecnologia.</p></div><a class="section-link" href="/artigos-cientificos">Ver ranking →</a></div><div class="list-grid">${researchHighlights.map(card).join('')}</div></div></section>`:'';

  const sections=navItems.map(([slug,name],idx)=>{
    const items=editorial.filter(a=>slug==='engenharia'?engineeringGroup.includes(a.categorySlug):a.categorySlug===slug).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
    if(!items.length)return '';
    const [first,...rest]=items;
    const subtitle=slug==='engenharia'?'Estruturas, obras, construção civil, rodovias, ferrovias, pontes, energia, saneamento e ativos críticos.':categoryCopy[slug];
    const section=`<section class="section ${idx%2?'alt':''}"><div class="container"><div class="section-head"><div><div class="eyebrow">${name}</div><h2>${name}</h2><p>${subtitle}</p></div><a class="section-link" href="/categoria/${slug}">Ver editoria →</a></div><div class="editorial-grid"><div class="editorial-lead">${card(first)}</div><div class="editorial-stack">${rest.map(card).join('')}</div></div></div></section>`;
    return idx===2?`${section}<section class="ad-section"><div class="container">${adSlot()}</div></section>`:section;
  }).join('');

  const events=[...content.events].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5).map(ev=>`<a class="event-row" href="/eventos/${esc(ev.slug)}"><div class="date">${esc(ev.dateDisplay)}</div><div><div class="tag">${esc(ev.category)}</div><h3>${esc(ev.title)}</h3><p>${esc(ev.summary)}</p></div><div class="place">${esc(ev.location)}</div></a>`).join('');

  const body=`<main>
    ${lead?`<section class="hero"><div class="container"><div class="hero-grid"><article class="hero-story"><a href="/noticias/${esc(lead.slug)}">${image(lead,'cover',true)}<div class="tag">${esc(lead.category)} · ${esc(lead.region)}</div><h1>${esc(lead.title)}</h1><p>${esc(lead.dek)}</p><div class="meta"><span>${esc(lead.dateDisplay)}</span></div></a></article><div class="side-stack">${sides.map(side).join('')}</div></div></div></section>`:''}
    <section class="section"><div class="container"><div class="section-head"><div><div class="eyebrow">Atualização</div><h2>Últimas notícias</h2><p>Os assuntos mais recentes de engenharia, construção, infraestrutura, tecnologia e mercado.</p></div></div><div class="daily-layout"><div class="daily-cards">${latest.map(card).join('')}</div><aside class="rank-panel"><div class="rank-title"><span>VAELITH</span><strong>Seleção editorial</strong></div>${focus}</aside></div></div></section>
    <section class="section alt" id="news-radar" hidden><div class="container"><div class="section-head"><div><div class="eyebrow">Radar do setor</div><h2>Notícias nas fontes</h2><p>Atualização automática ao longo do dia. Manchetes dos últimos sete dias, com acesso à publicação original.</p></div></div><div class="list-grid"></div></div></section><script defer src="/assets/news-radar.js?v=20260913-images"></script>
    ${researchSection}
    <section class="ad-section"><div class="container">${adSlot('Publicidade')}</div></section>
    <section class="section alt"><div class="container"><div class="section-head"><div><div class="eyebrow">Navegação</div><h2>Editorias</h2><p>Encontre rapidamente a área profissional que você acompanha.</p></div></div><div class="category-strip">${categories}</div></div></section>
    ${sections}
    <section class="section" id="agenda"><div class="container"><div class="section-head"><div><div class="eyebrow">Agenda</div><h2>Eventos do setor</h2><p>Feiras, congressos e encontros relevantes para engenharia, construção, arquitetura, gestão e tecnologia.</p></div><a class="section-link" href="/eventos">Agenda completa →</a></div><div class="event-grid"><div class="event-list">${events}</div><aside class="radar"><div class="tag">Radar VAELITH</div><h3>O que merece atenção.</h3><p>Eventos selecionados por relevância para profissionais e empresas do ambiente construído.</p></aside></div></div></section>
  </main>`;

  const ld=JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'NewsMediaOrganization','@id':`${SITE}/#organization`,name:'VAELITH',url:SITE,description:'Portal de informação para engenharia, arquitetura, construção, infraestrutura, gestão e tecnologia.',email:'labsvaelith@gmail.com'},{'@type':'WebSite','@id':`${SITE}/#website`,url:SITE,name:'VAELITH',publisher:{'@id':`${SITE}/#organization`},potentialAction:{'@type':'SearchAction',target:`${SITE}/buscar?q={search_term_string}`,'query-input':'required name=search_term_string'}}]});
  return shell({title:'VAELITH — Engenharia, Construção e Tecnologia',description:'Notícias e contexto sobre engenharia, arquitetura, construção, infraestrutura, gestão e tecnologia.',canonical:SITE,active:'home',body,jsonLd:ld,ogImage:lead&&lead.image?lead.image:''});
};
