const fs = require('fs');
const svgs = ['v1-clean.svg', 'v1-nails.svg', 'v1-thick.svg'];
const labels = ['A: Clean', 'B: With Nails', 'C: Thick Planks'];
const parts = svgs.map((s, i) => {
  const b64 = fs.readFileSync(s).toString('base64');
  return `<div style="text-align:center"><h3 style="font-family:sans-serif">${labels[i]}</h3><img src="data:image/svg+xml;base64,${b64}" width="350"/></div>`;
});
const html = `<!DOCTYPE html><html><body style="background:#fff;padding:30px;"><div style="display:flex;gap:30px;justify-content:center;">${parts.join('')}</div></body></html>`;
fs.writeFileSync('preview.html', html);
console.log('done');
