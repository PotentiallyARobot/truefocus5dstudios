const fs=require('fs'),path=require('path');
const files=['index.html','homepage-original.html',...['pages','local-pages'].flatMap(dir=>fs.readdirSync(path.join(__dirname,dir)).filter(f=>f.endsWith('.html')).map(f=>dir+'/'+f))];
for(const file of files){const full=path.join(__dirname,file);let html=fs.readFileSync(full,'utf8');const prefix=file.includes('/')?'../':'./';if(!html.includes('id="truefocus-navigation"'))html=html.replace('</head>',`<link id="truefocus-navigation" rel="stylesheet" href="${prefix}navigation.css"><script defer src="${prefix}navigation.js"></script></head>`);fs.writeFileSync(full,html);}
console.log(`Added navigation-only behavior to ${files.length} original pages.`);
