const content=require('./content');
const {SITE,esc,shell}=require('./layout');
const {card}=require('./cards');

module.exports=function renderArchive(pageValue='1'){
  const page=Math.max(1,parseInt(pageValue,10)||1);
  const perPage=18;
  const articles=[...content.articles].sort((a,b)=>b.date.localeCompare(a.date));
  const totalPages=Math.max(1,Math.ceil(articles.length/perPage));
  const current=Math.min(page,totalPages);
  const start=(current-1)*perPage;
  const items=articles.slice(start,start+perPage);
  const prev=current>1?`<a href="/arquivo?page=${current-1}">← Mais recentes</a>`:'';
  const next=current<totalPages?`<a href="/arquivo?page=${current+1}">Mais antigas →</a>`:'';
  const pager=`<nav class="archive-pager" aria-label="Paginação do arquivo"><span>Página ${current} de ${totalPages}</span><div>${prev}${next}</div></nav>`;
  const body=`<main><section class="page-hero"><div class="container"><div class="eyebrow">Acervo</div><h1>Arquivo de notícias</h1><p>Todas as matérias publicadas pela VAELITH permanecem disponíveis para consulta, busca e acesso pelas editorias.</p><form class="search-form archive-search" action="/buscar" method="get"><label class="sr-only" for="archive-q">Pesquisar no arquivo</label><input id="archive-q" name="q" placeholder="Busque obra, empresa, tecnologia ou tema"><button type="submit">Buscar</button></form></div></section><section class="section alt"><div class="container"><div class="section-head"><div><h2>Notícias publicadas</h2><p>${articles.length} matéria${articles.length===1?'':'s'} no acervo.</p></div></div><div class="list-grid">${items.map(card).join('')}</div>${pager}</div></section></main>`;
  return shell({title:'Arquivo de notícias',description:'Arquivo permanente de notícias, análises e conteúdos publicados pela VAELITH.',canonical:`${SITE}/arquivo${current>1?`?page=${current}`:''}`,body});
};
