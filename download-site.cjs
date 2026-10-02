const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {execFile} = require('child_process');
const root = __dirname;
const base = 'https://ace02789.wixsite.com/truefocus5dstudios';
const manifest = {createdAt:new Date().toISOString(), source:base, pages:[], assets:[], externalLinks:[]};
for (const dir of ['pages','assets','text']) fs.mkdirSync(path.join(root,dir),{recursive:true});
function decode(s) { return s.replace(/\\\//g,'/').replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>'); }
function urls(s) {return [...new Set((decode(s).match(/https?:\/\/[^\s"<>\\]+/g)||[]).map(u=>u.replace(/[),;]+$/,'')))];}
function get(url, file) { return new Promise(resolve=>execFile('curl.exe',['-L','--fail','--silent','--show-error','--connect-timeout','20','--max-time','240','--retry','1',url,'-o',path.join(root,file)],{maxBuffer:1024*1024},(e,stdout,stderr)=>resolve(e?{ok:false,error:stderr.slice(0,500)}:{ok:true,bytes:fs.statSync(path.join(root,file)).size}))); }
function save() {fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2));}
const assets = new Set(), queue = [base], seen = new Set(), texts = new Map();
function gather(s) {
  const decoded=decode(s);
  for (const u of urls(s)) {
    let parsed; try {parsed = new URL(u)} catch {continue;}
    if(parsed.origin==='https://ace02789.wixsite.com' && parsed.pathname.startsWith('/truefocus5dstudios') && !parsed.pathname.includes('/_') && !parsed.search) {
      const page=parsed.origin+parsed.pathname.replace(/\/$/,''); if(!seen.has(page)&&!queue.includes(page)) queue.push(page);
    } else if (/\.(wixstatic\.com|parastorage\.com)$/.test(parsed.hostname) && /\.(jpg|jpeg|png|webp|gif|svg|avif|mp4|webm|css|js|woff2?|ttf|json)(?:[/?]|$)/i.test(u)) {
      assets.add(u);
      const original=u.match(/^https:\/\/static\.wixstatic\.com\/media\/[^/?]+/); if(original) assets.add(original[0]);
    } else if(!/wix|parastorage/.test(parsed.hostname)) manifest.externalLinks.push(u);
  }
  for(const m of decoded.matchAll(/(?:https:\/\/video\.wixstatic\.com\/)?video\/([a-zA-Z0-9_]+)\/(\d+p)\/mp4\/file\.mp4/g)) assets.add('https://video.wixstatic.com/video/'+m[1]+'/'+m[2]+'/mp4/file.mp4');
}
(async()=>{
  while(queue.length && seen.size<80) {
    const url=queue.shift(); if(seen.has(url))continue; seen.add(url);
    const slug=url.slice(base.length).replace(/^\//,'')||'home';
    const file='pages/'+slug.replace(/[^a-zA-Z0-9_-]/g,'_')+'.html';
    const result=await get(url,file); manifest.pages.push({url,file,...result}); console.log('PAGE',slug,result.ok?'saved':result.error);
    if(result.ok) {const html=fs.readFileSync(path.join(root,file),'utf8'); texts.set(file,html);gather(html);
      const body=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,'\n');
      fs.writeFileSync(path.join(root,'text',path.basename(file,'.html')+'.txt'),decode(body).replace(/\n\s*\n/g,'\n').trim());
    }save();
  }
  // Keep every referenced quality, including the highest-resolution background videos.
  const pending=[...assets]; let cursor=0;
  async function worker(){while(cursor<pending.length){const url=pending[cursor++];const u=new URL(url);const ext=path.extname(u.pathname).slice(0,10)||'.bin';const file='assets/'+crypto.createHash('sha256').update(url).digest('hex').slice(0,20)+ext;const result=await get(url,file);manifest.assets.push({url,file,...result});if(manifest.assets.length%20===0)console.log('ASSETS',manifest.assets.length,'/',pending.length);save();}}
  await Promise.all(Array.from({length:5},worker));
  manifest.externalLinks=[...new Set(manifest.externalLinks)];save();
  const links=manifest.pages.filter(p=>p.ok).map(p=>'<li><a href="'+p.file+'">'+(p.url.slice(base.length)||'Home')+'</a></li>').join('\n');
  fs.writeFileSync(path.join(root,'index.html'),'<!doctype html><meta charset="utf-8"><title>TrueFocus site backup</title><h1>TrueFocus site backup</h1><p>Original Wix HTML snapshots; scripts and dynamic services may still require Wix. Assets and readable text are saved separately. See manifest.json for download status.</p><ul>'+links+'</ul>');
  const ok=manifest.assets.filter(x=>x.ok), failed=manifest.assets.filter(x=>!x.ok);
  fs.writeFileSync(path.join(root,'BACKUP-NOTES.txt'),`Source: ${base}\nDate: ${manifest.createdAt}\nPages saved: ${manifest.pages.filter(x=>x.ok).length}\nAssets saved: ${ok.length}\nAsset bytes: ${ok.reduce((n,x)=>n+x.bytes,0)}\nFailed assets: ${failed.length}\n\nThis is a recovery archive, not a portable functioning Wix site. Original page HTML, readable page text, linked images (including originals), static scripts/styles/fonts and directly referenced videos are included. Wix forms, login, newsletter, chat, database content and dynamic Wix Video libraries are not exported by this public-page crawl. Embedded third-party content is listed in manifest.json. Additional media may require download from the Wix dashboard. No DNS or site changes were made.\n`);
  console.log(JSON.stringify({pages:manifest.pages.length,assets:ok.length,failed:failed.length,bytes:ok.reduce((n,x)=>n+x.bytes,0)}));
})().catch(e=>{console.error(e);process.exitCode=1;});
