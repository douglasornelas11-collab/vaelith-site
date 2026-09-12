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
  const counts=articles.reduce((acc,a)=>{const k=a.contentType||'news';acc[k]=(acc[k]||0)+1;return acc;},{});
  const breakdown=[
    counts.news?`${counts.news} notícia${counts.news===1?'':'s'}`:'',
    counts.research?`${counts.research} pesquisa${counts.research===1?'':'s'}`:'',
    counts.analysis?`${counts.analysis} análise${counts.analysis===1?'':'s'}`:'',
    counts.project?`${counts.project} projeto${counts.project===1?'':'s'}`:'',
    counts.data?`${counts.data} conteúdo${counts.data===1?'':'s'} de dados`:''
  ].filter(Boolean).join(' · ');
  const prev=current>1?`<a href="/arquivo?page=${current-1}">← Mais recentes</a>`:'';
  const next=current<totalPages?`<a href="/arquivo?page=${current+1}">Mais antigas →</a>`:'';
  const pager=`<nav class="archive-pager" aria-label="Paginação do arquivo"><span>Página ${current} de ${totalPages}</span><div>${prev}${next}</div></nav>`;
  const body=`<main><section class="page-hero"><div class="container"><div class="eyebrow">Acervo</div><h1>Arquivo</h1><p>Conteúdos publicados pela VAELITH permanecem disponíveis para consulta, busca e acesso pelas editorias.</p><form class="search-form archive-search" action="/buscar" method="get"><label class="sr-only" for="archive-q">Pesquisar no arquivo</label><input id="archive-q" name="q" placeholder="Busque obra, empresa, tecnologia ou tema"><button type="submit">Buscar</button></form></div></section><section class="section alt"><div class="container"><div class="section-head"><div><h2>Acervo publicado</h2><p>${articles.length} conteúdos no total${breakdown?` — ${breakdown}`:''}.</p></div></div><div class="list-grid">${items.map(card).join('')}</div>${pager}</div></section></main>`;
  return shell({title:'Arquivo',description:'Arquivo permanente de notícias, pesquisas, análises, projetos e conteúdos publicados pela VAELITH.',canonical:`${SITE}/arquivo${current>1?`?page=${current}`:''}`,body});
};
