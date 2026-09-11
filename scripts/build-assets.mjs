import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const B = 'https://www.empiricbusinessmedia.com/images/';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0 Safari/537.36';
const OUT = 'public/images';
fs.mkdirSync(OUT + '/partners', { recursive: true });
fs.mkdirSync(OUT + '/gallery', { recursive: true });
fs.mkdirSync(OUT + '/brand', { recursive: true });
fs.mkdirSync(OUT + '/hero', { recursive: true });

async function get(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(r.status + ' ' + url);
  return Buffer.from(await r.arrayBuffer());
}
function slug(s) {
  return s.replace(/\.[^.]+$/, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    .replace(/-(logo|copy|new|primary|big|removebg-preview|500x500|1)$/g, '')
    .replace(/-+/g, '-').replace(/^-|-$/g, '');
}

const PARTNERS = ['adp-logo.png','ameyo-by-exotel-logo.svg','apple-logo-.png','AutomationEdge_logo.png','axcess-io-logo.png','BOTm LOGO.jpg','Cisco-logo.jpg','Credlix-big-logo.webp','CtrlS_Logo.jpg','dell-technologies-logo-png_seeklogo-381480.png','edas-logo.webp','epicor-logo.svg','Facttwin new logo_27_3_2024_12345.png','futwork-logo.png','Glib.png','hodu.webp','infobip-logo.png','workato.png','infor-logo.png','mitsubhishi-logo.png','maxicus.png','Pinnacle logo_high.jpg','xoxoday-logo copy.svg','ihirm.png','BharatCXO Logo.jpg','Zoom-Logo copy.png','yodaplus.PNG','Brainayan.png','Redington Logo-01 copy.png','manageengine-logo-black.png','jumpcloud-logo.png','axestrack-software-500x500_-removebg-preview.png','NeoSoft-logo.jpg','Commscope-logo.png','SpringVerify_Logo_Primary (1).png','zexprwire-logo.png','industryoutlook_new.jpg','zaggle-new-logo.webp'];

const manifest = { partners: [], gallery: [], brand: {}, hero: [] };

// --- partner logos -> 320px wide webp, transparent preserved
for (const f of PARTNERS) {
  try {
    const buf = await get(B + 'EBM-sponsor/' + encodeURIComponent(f));
    const name = slug(f);
    if (f.toLowerCase().endsWith('.svg')) {
      fs.writeFileSync(`${OUT}/partners/${name}.svg`, buf);
      manifest.partners.push({ name, src: `/images/partners/${name}.svg`, w: 320, h: 120 });
    } else {
      const img = sharp(buf).resize({ width: 320, height: 120, fit: 'inside', withoutEnlargement: true });
      const out = await img.webp({ quality: 88 }).toBuffer();
      const md = await sharp(out).metadata();
      fs.writeFileSync(`${OUT}/partners/${name}.webp`, out);
      manifest.partners.push({ name, src: `/images/partners/${name}.webp`, w: md.width, h: md.height });
    }
    process.stdout.write('.');
  } catch (e) { console.log('\nSKIP partner', f, e.message); }
}

// --- gallery (real event photos)
for (let i = 1; i <= 9; i++) {
  try {
    const buf = await get(B + `gallery-${i}.jpg`);
    const out = await sharp(buf).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
    const md = await sharp(out).metadata();
    fs.writeFileSync(`${OUT}/gallery/gallery-${i}.webp`, out);
    const th = await sharp(buf).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 72 }).toBuffer();
    fs.writeFileSync(`${OUT}/gallery/gallery-${i}-thumb.webp`, th);
    manifest.gallery.push({ src: `/images/gallery/gallery-${i}.webp`, thumb: `/images/gallery/gallery-${i}-thumb.webp`, w: md.width, h: md.height });
    process.stdout.write('g');
  } catch (e) { console.log('\nSKIP gallery', i, e.message); }
}

// --- brand + content photos
const CONTENT = [
  ['ebm-white-yellow-logo.png', 'brand/ebm-logo', 560, 'png'],
  ['favicon.webp', 'brand/favicon', 64, 'png'],
  ['ebm-about-us-1.webp', 'about-1', 1000, 'webp'],
  ['ebm-connnectinng.jpeg', 'about-2', 1000, 'webp'],
  ['contact-us-img.jpg', 'contact', 1000, 'webp'],
];
for (const [f, name, w, fmt] of CONTENT) {
  try {
    const buf = await get(B + f);
    let p = sharp(buf).resize({ width: w, withoutEnlargement: true });
    const out = fmt === 'png' ? await p.png({ compressionLevel: 9, palette: true }).toBuffer() : await p.webp({ quality: 82 }).toBuffer();
    const md = await sharp(out).metadata();
    fs.writeFileSync(`${OUT}/${name}.${fmt}`, out);
    manifest.brand[name] = { src: `/images/${name}.${fmt}`, w: md.width, h: md.height };
    process.stdout.write('b');
  } catch (e) { console.log('\nSKIP content', f, e.message); }
}

// --- hero backgrounds
for (const [f, name] of [['hero-carousel-bg/ciso-bg.webp','hero-ciso'], ['hero-carousel-bg/hr-tech-bg.webp','hero-hrtech']]) {
  try {
    const buf = await get(B + f);
    const out = await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 70 }).toBuffer();
    const md = await sharp(out).metadata();
    fs.writeFileSync(`${OUT}/hero/${name}.webp`, out);
    manifest.hero.push({ name, src: `/images/hero/${name}.webp`, w: md.width, h: md.height });
    process.stdout.write('h');
  } catch (e) { console.log('\nSKIP hero', f, e.message); }
}

fs.writeFileSync('src/data/assets.json', JSON.stringify(manifest, null, 2));
console.log('\n\nPartners:', manifest.partners.length, '| Gallery:', manifest.gallery.length, '| Brand:', Object.keys(manifest.brand).length, '| Hero:', manifest.hero.length);
let total = 0;
for (const d of ['partners','gallery','brand','hero']) {
  const dir = `${OUT}/${d}`;
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) total += fs.statSync(path.join(dir,f)).size;
}
for (const f of fs.readdirSync(OUT)) { const s=fs.statSync(path.join(OUT,f)); if(s.isFile()) total += s.size; }
console.log('Total optimised asset weight:', (total/1024).toFixed(0), 'KB');
