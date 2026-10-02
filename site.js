'use strict';
document.body.classList.add('js');
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#primary-nav');
const dropdown=document.querySelector('.conversions');
function closeMenu(restoreFocus=false){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');dropdown.open=false;if(restoreFocus)toggle.focus();}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);if(!open)dropdown.open=false;});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;if(dropdown.open){dropdown.open=false;dropdown.querySelector('summary').focus();}else if(nav.classList.contains('is-open'))closeMenu(true);});
nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('focusin',event=>{if(!event.target.closest('.site-header'))closeMenu();});
matchMedia('(max-width:760px)').addEventListener('change',()=>closeMenu());
