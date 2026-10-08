(function(){
  function unavailable(img){
    if(!(img instanceof HTMLImageElement)||!img.closest('main'))return;
    img.style.setProperty('display','none','important');
    const card=img.closest('.card,.side-story,.hero-story');if(card)card.classList.add('no-image');
    const media=img.closest('.hero-feature-media');if(media)media.hidden=true;
    const figure=img.closest('.article-figure');
    if(figure){
      const expand=figure.querySelector('.image-expand-link');if(expand)expand.hidden=true;
      if(!figure.querySelector('.image-error')){
        const status=document.createElement('p');status.className='image-error';
        status.textContent='Imagem da fonte temporariamente indisponível.';
        figure.append(status);
      }
    }
  }
  document.addEventListener('error',event=>unavailable(event.target),true);
  document.querySelectorAll('main img').forEach(img=>{if(img.complete&&img.naturalWidth===0)unavailable(img);});
})();
