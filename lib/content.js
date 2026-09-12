const path=require('path');
const cats=['engenharia','arquitetura','construcao','tecnologia','infraestrutura','mercado','gestao','sustentabilidade'];
const fallbackArticles=cats.flatMap(c=>require(path.join('..','data',c+'.json')));
const fallbackEvents=require('../data/events.json');
const state={articles:[...fallbackArticles],events:[...fallbackEvents],cats,lastRefresh:0,source:'fallback'};
const PROJECT='s2xosuea';
const DATASET='production';
const API_VERSION='2026-09-11';
const months=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const imagePools={
 engenharia:[
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1600&q=84'
 ],
 arquitetura:[
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=84'
 ],
 construcao:[
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=84'
 ],
 tecnologia:[
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=84'
 ],
 infraestrutura:[
  'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=84'
 ],
 mercado:[
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=84'
 ],
 gestao:[
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=84'
 ],
 sustentabilidade:[
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1600&q=84',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=84'
 ]
};
function dateDisplay(date=''){const [y,m,d]=String(date).slice(0,10).split('-');return y&&m&&d?`${d} ${months[Number(m)-1]} ${y}`:date;}
function blockText(body=[]){return (body||[]).filter(b=>b&&b._type==='block').map(b=>(b.children||[]).map(c=>c.text||'').join('').trim()).filter(Boolean);}
function fallbackImage(categorySlug='',slug=''){
 const pool=imagePools[categorySlug]||imagePools.engenharia;
 let hash=0;for(const ch of String(slug))hash=(hash*31+ch.charCodeAt(0))>>>0;
 return pool[hash%pool.length];
}
async function querySanity(query){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),4500);try{const url=`https://${PROJECT}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;const r=await fetch(url,{headers:{Accept:'application/json'},signal:controller.signal});if(!r.ok)throw new Error(`Sanity ${r.status}`);const j=await r.json();return j.result||[];}finally{clearTimeout(timer);}}
async function refreshFromSanity(force=false){if(!force&&Date.now()-state.lastRefresh<30000)return state;try{const articleQuery=`*[_type == "article" && status == "published" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc){title,"slug":slug.current,dek,region,publishedAt,modifiedAt,contentType,technicalTakeaway,keyFacts[]{label,value},"category":category->title,"categorySlug":category->slug.current,"sourceName":source->name,sourceUrl,sourceLanguage,"authorName":author->name,"mainImageUrl":mainImage.asset->url,"imageAlt":mainImage.alt,"imageCaption":mainImage.caption,"imageCredit":mainImage.credit,externalImageUrl,body[]{_type,children[]{text}}}`;const eventQuery=`*[_type == "event" && defined(slug.current) && !(_id in path("drafts.**"))] | order(startDate asc){title,"slug":slug.current,summary,category,startDate,endDate,dateDisplay,location,sourceName,sourceUrl,featured}`;const [articles,events]=await Promise.all([querySanity(articleQuery),querySanity(eventQuery)]);if(Array.isArray(articles)&&articles.length){state.articles=articles.map(a=>{const date=String(a.publishedAt||'').slice(0,10);const image=a.mainImageUrl||a.externalImageUrl||fallbackImage(a.categorySlug,a.slug);return{...a,date,dateDisplay:dateDisplay(date),image,imageAlt:a.imageAlt||a.title,body:blockText(a.body)};});state.source='sanity';}if(Array.isArray(events)&&events.length){state.events=events.map(e=>({...e,date:e.startDate,dateDisplay:e.dateDisplay||dateDisplay(e.startDate)}));}state.lastRefresh=Date.now();}catch(err){console.error('VAELITH_SANITY_FALLBACK',err&&err.message?err.message:err);state.lastRefresh=Date.now();}return state;}
module.exports=state;
module.exports.refreshFromSanity=refreshFromSanity;
