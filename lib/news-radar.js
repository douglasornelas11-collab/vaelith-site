const feeds=[
  {name:'CBIC',url:'https://cbic.org.br/feed/',host:'cbic.org.br',specialist:true},
  {name:'Construction Dive',url:'https://www.constructiondive.com/feeds/news/',host:'constructiondive.com',specialist:true},
  {name:'Agência Brasil',url:'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml',host:'agenciabrasil.ebc.com.br'}
];
const decode=s=>String(s||'').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>{const v=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);return v>0&&v<=0x10ffff?String.fromCodePoint(v):'';}).replace(/&(amp|lt|gt|quot|apos|nbsp);/g,(_,n)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '}[n]));
const plain=s=>decode(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const field=(s,name)=>{const m=s.match(new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)</'+name+'>','i'));return m?m[1]:'';};
function parse(xml,source,now=Date.now()){
  return [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].flatMap(([,raw])=>{
    const title=plain(field(raw,'title')).slice(0,240),url=decode(field(raw,'link')).trim();
    const date=new Date(plain(field(raw,'pubDate'))).getTime();
    let u;try{u=new URL(url);}catch{return [];}
    if(u.protocol!=='https:'||!(u.hostname===source.host||u.hostname.endsWith('.'+source.host))||!title||!Number.isFinite(date)||date>now+3600000||date<now-7*86400000)return [];
    const summary=plain(field(raw,'description')).slice(0,280);
    const words=(title+' '+summary).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const matches=words.match(/engenharia|construcao|infraestrutura|saneamento|rodovia|ferrovia|habitacao|bim|arquitetura|construction|infrastructure|building|concrete|engineering|energia renovavel|inteligencia artificial/g)||[];
    if(!source.specialist&&!matches.length)return [];
    u.hash='';for(const key of [...u.searchParams.keys()])if(key.startsWith('utm_'))u.searchParams.delete(key);
    return [{title,url:u.href,source:source.name,publishedAt:new Date(date).toISOString(),score:Math.min(matches.length,5)}];
  });
}
let cache=null,pending=null;
async function getRadar(){
  if(cache&&Date.now()-cache.checkedAt<3600000)return cache;
  if(pending)return pending;
  pending=(async()=>{
    const results=await Promise.allSettled(feeds.map(async source=>{
      const r=await fetch(source.url,{signal:AbortSignal.timeout(12000),headers:{Accept:'application/rss+xml, application/xml, text/xml'}});
      if(!r.ok)throw new Error('feed_unavailable');
      const xml=await r.text();if(xml.length>2000000)throw new Error('feed_too_large');
      return parse(xml,source);
    }));
    const items=[],seen=new Set(),counts={};
    const candidates=results.flatMap(r=>r.status==='fulfilled'?r.value:[]).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)||b.score-a.score);
    for(const item of candidates){const key=item.title.toLowerCase();if(seen.has(item.url)||seen.has(key)||(counts[item.source]||0)>=4)continue;seen.add(item.url);seen.add(key);counts[item.source]=(counts[item.source]||0)+1;items.push(item);if(items.length===10)break;}
    if(!items.length)throw new Error('no_recent_news');
    cache={items,checkedAt:Date.now()};return cache;
  })().finally(()=>{pending=null;});
  return pending;
}
module.exports={getRadar,parse,feeds};
