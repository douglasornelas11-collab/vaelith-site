/* Small progressive enhancement; links remain ordinary server-rendered links. */
(() => {
  const header = document.getElementById('siteHeader');
  const button = document.getElementById('menuBtn');
  const label = document.getElementById('menuLabel');
  const nav = document.getElementById('mainNav');
  if (!header || !button || !nav) return;
  const mobile = window.matchMedia('(max-width: 1100px)');
  function setOpen(open, restoreFocus = false) {
    header.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Fechar' : 'Editorias';
    if (restoreFocus) button.focus();
  }
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('open')) setOpen(false, true);
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setOpen(false);
  });
  header.addEventListener('focusout', event => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
  mobile.addEventListener('change', () => setOpen(false));
  window.addEventListener('pageshow', () => setOpen(false));
})();
