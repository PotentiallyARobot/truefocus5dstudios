(() => {
  'use strict';
  const root = new URL('.', document.currentScript.src);
  const routes = {home:'index.html',services:'local-pages/services-7.html',aliens:'local-pages/aliens.html',matrix:'local-pages/matrix.html',gladiator:'local-pages/gladiator.html','the fifth element':'local-pages/the-fifth-element.html','starship troopers':'local-pages/starship-troopers.html','about us':'local-pages/about-us.html',contact:'local-pages/contact.html'};
  const normalize = text => text.trim().replace(/\s+/g,' ').toLowerCase();
  const navSelector = '#SITE_HEADER nav';
  function setOpen(item, open) {
    item.setAttribute('data-tf-open', String(open));
    item.querySelectorAll('[aria-haspopup], button').forEach(button => button.setAttribute('aria-expanded', String(open)));
  }
  function closeAll(except) {
    document.querySelectorAll(`${navSelector} [data-tf-open]`).forEach(item => { if(item!==except)setOpen(item,false); });
  }
  function prepare() {
    document.querySelectorAll(navSelector).forEach(nav => {
      nav.classList.add('tf-navigation');
      nav.querySelectorAll('a').forEach(a => {
        const route=routes[normalize(a.textContent)];
        if(route)a.href=new URL(route,root).href;
      });
      nav.querySelectorAll('[data-item-depth="0"]').forEach(item => {
        const panel=item.querySelector('[data-testid="positionBox"]');
        if(!panel||item.hasAttribute('data-tf-open'))return;
        panel.id='truefocus-conversions';
        item.querySelectorAll('[aria-haspopup],button').forEach(button=>button.setAttribute('aria-controls',panel.id));
        setOpen(item,false);
      });
    });
  }
  function dropdownTrigger(target) {
    const trigger=target.closest('[aria-haspopup],button');
    if(!trigger||!trigger.closest(navSelector))return null;
    const item=trigger.closest('[data-item-depth="0"]');
    return item?.querySelector('[data-testid="positionBox"]')?{trigger,item}:null;
  }
  // Capture before Wix's router: use real document navigation between saved pages.
  document.addEventListener('click',event=>{
    const dropdown=dropdownTrigger(event.target);
    if(dropdown){event.preventDefault();event.stopImmediatePropagation();const open=dropdown.item.getAttribute('data-tf-open')!=='true';closeAll(dropdown.item);setOpen(dropdown.item,open);return;}
    const anchor=event.target.closest(`${navSelector} a`);
    if(anchor){
      const route=routes[normalize(anchor.textContent)];
      if(!route)return;
      anchor.href=new URL(route,root).href;
      event.stopImmediatePropagation();
      if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      event.preventDefault();location.assign(anchor.href);return;
    }
    if(!event.target.closest(navSelector))closeAll();
  },true);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      const open=document.querySelector(`${navSelector} [data-tf-open="true"]`);
      if(open){event.preventDefault();event.stopImmediatePropagation();setOpen(open,false);open.querySelector('[aria-haspopup]')?.focus();}
      return;
    }
    const dropdown=dropdownTrigger(event.target);
    if(!dropdown)return;
    if(['Enter',' ','ArrowDown'].includes(event.key)){
      event.preventDefault();event.stopImmediatePropagation();const open=event.key==='ArrowDown'||dropdown.item.getAttribute('data-tf-open')!=='true';closeAll(dropdown.item);setOpen(dropdown.item,open);
      if(open&&event.key==='ArrowDown')dropdown.item.querySelector('[data-testid="positionBox"] a')?.focus();
    }
  },true);
  document.addEventListener('focusin',event=>{if(!event.target.closest(navSelector))closeAll();});
  prepare();
  // Wix may replace the header after hydration. Keep the same navigation behavior.
  let scheduled=false;
  new MutationObserver(records=>{
    if(scheduled||!records.some(r=>r.addedNodes.length))return;
    scheduled=true;queueMicrotask(()=>{scheduled=false;prepare();});
  }).observe(document.body,{childList:true,subtree:true});
})();
