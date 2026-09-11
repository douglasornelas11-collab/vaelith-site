const {esc}=require('./layout');
function card(a){return `<article class="card"><a href="/noticias/${esc(a.slug)}"><div class="image" style="background-image:url('${esc(a.image)}')"></div><div class="tag">${esc(a.category)} · ${esc(a.region)}</div><h3>${esc(a.title)}</h3><p>${esc(a.dek)}</p><div class="meta"><span>${esc(a.dateDisplay)}</span><span>Fonte: <b>${esc(a.sourceName)}</b></span></div></a></article>`}
function side(a){return `<article class="side-story"><a href="/noticias/${esc(a.slug)}"><div class="thumb" style="background-image:url('${esc(a.image)}')"></div><div class="tag">${esc(a.category)} · ${esc(a.region)}</div><h2>${esc(a.title)}</h2><div class="meta"><span>${esc(a.dateDisplay)}</span><span>${esc(a.sourceName)}</span></div></a></article>`}
module.exports={card,side};
