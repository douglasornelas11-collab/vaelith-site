const {esc}=require('./layout');
function image(a,cls='image',priority=false){return `<img class="${cls}" src="${esc(a.image)}" alt="${esc(a.title)}" width="960" height="540" ${priority?'fetchpriority="high" loading="eager"':'loading="lazy"'} decoding="async">`}
function card(a){return `<article class="card"><a href="/noticias/${esc(a.slug)}">${image(a)}<div class="tag">${esc(a.category)} · ${esc(a.region)}</div><h3>${esc(a.title)}</h3><p>${esc(a.dek)}</p><div class="meta"><span>${esc(a.dateDisplay)}</span><span>Fonte: <b>${esc(a.sourceName)}</b></span></div></a></article>`}
function side(a){return `<article class="side-story"><a href="/noticias/${esc(a.slug)}">${image(a,'thumb')}<div class="tag">${esc(a.category)} · ${esc(a.region)}</div><h2>${esc(a.title)}</h2><div class="meta"><span>${esc(a.dateDisplay)}</span><span>${esc(a.sourceName)}</span></div></a></article>`}
module.exports={card,side,image};
