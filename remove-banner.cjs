const fs = require('fs');
const path = require('path');
const root = __dirname;
const marker = 'truefocus-no-cobranding';
const patch = `<style id="${marker}">:root,body{--wix-ads-height:0px!important;--wix-ads-top-height:0px!important}#WIX_ADS,.WIX_ADS,a[href*="legalzoom.com"]{display:none!important;height:0!important;min-height:0!important;pointer-events:none!important}</style>`;
const files = ['homepage-original.html', ...['pages','local-pages'].flatMap(dir => fs.readdirSync(path.join(root,dir)).filter(f => f.endsWith('.html')).map(f => path.join(dir,f)))];
let changed = 0;
for (const file of files) {
  const full = path.join(root,file);
  let html = fs.readFileSync(full,'utf8');
  if (html.includes(`id="${marker}"`)) continue;
  html = html.replace(/<!--\$--><div id="WIX_ADS"[\s\S]*?<!--\/\$-->/g, '');
  html = html.replace('</head>', patch + '</head>');
  fs.writeFileSync(full,html);
  changed++;
}
console.log(`Removed banner and suppressed Wix runtime reinsertion in ${changed} saved pages.`);
