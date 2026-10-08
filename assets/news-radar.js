(async function(){
  const section=document.getElementById('news-radar');if(!section)return;
  try{
    const r=await fetch('/api/news-radar');if(!r.ok)return;
    const data=await r.json();if(!Array.isArray(data.items)||!data.items.length)return;
    const list=section.querySelector('.list-grid');
    for(const item of data.items){
      const url=new URL(item.url);if(url.protocol!=='https:')continue;
      const article=document.createElement('article');article.className='card radar-card';
      const source=document.createElement('div');source.className='tag';source.textContent=item.source;
      const heading=document.createElement('h3'),link=document.createElement('a');link.href=url.href;link.target='_blank';link.rel='noopener noreferrer';heading.textContent=item.title;
      const meta=document.createElement('p');meta.className='meta';meta.textContent=new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',timeZone:'America/Sao_Paulo'}).format(new Date(item.publishedAt))+' · Leia na fonte ↗';
      link.append(source,heading,meta);article.append(link);list.append(article);
    }
    section.hidden=false;
  }catch{}
})();

