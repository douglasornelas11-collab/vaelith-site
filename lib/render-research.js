const content=require('./content');
const {SITE,shell}=require('./layout');
const {card}=require('./cards');

module.exports=function renderResearch(){
  const papers=content.articles.filter(a=>a.contentType==='research').sort((a,b)=>b.date.localeCompare(a.date));
  const recent=papers.slice(0,3);
  const month=papers.slice(3);
  const recentHtml=recent.length?recent.map(card).join(''):'<div class="empty-state"><h2>Nenhum destaque novo nesta semana.</h2><p>A seleção é atualizada conforme novos trabalhos relevantes são publicados.</p></div>';
  const monthHtml=month.length?`<section class="section alt"><div class="container"><div class="section-head"><div><div class="eyebrow">Seleção do mês</div><h2>Mais pesquisas relevantes</h2><p>Estudos recentes de engenharia, construção, infraestrutura, gestão e tecnologia aplicada ao ambiente construído.</p></div></div><div class="list-grid">${month.map(card).join('')}</div></div></section>`:'';
  const body=`<main><section class="page-hero"><div class="container"><div class="eyebrow">Pesquisa & Ciência</div><h1>Artigos científicos</h1><p>Uma curadoria dos trabalhos científicos mais relevantes para engenharia, construção civil, infraestrutura, gestão, BIM, materiais, estruturas e tecnologia aplicada.</p></div></section><section class="section"><div class="container"><div class="section-head"><div><div class="eyebrow">Destaques</div><h2>Melhores artigos da semana</h2><p>Selecionados por relevância técnica, qualidade da publicação, aplicabilidade profissional e novidade.</p></div></div><div class="list-grid">${recentHtml}</div></div></section>${monthHtml}</main>`;
  const ld=JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:'Artigos científicos — VAELITH',description:'Curadoria de artigos científicos sobre engenharia, construção civil, infraestrutura, gestão e tecnologia.',url:`${SITE}/artigos-cientificos`,isPartOf:{'@type':'WebSite',name:'VAELITH',url:SITE}});
  return shell({title:'Artigos científicos',description:'Os melhores artigos científicos recentes sobre engenharia, construção civil, infraestrutura, gestão e tecnologia.',canonical:`${SITE}/artigos-cientificos`,active:'research',body,jsonLd:ld});
};
