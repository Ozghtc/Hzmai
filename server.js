const express = require('express');
const cors = require('cors');
const { yorumla } = require('./dist/learning-core/yorumlayici');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Backend çalışıyor. POST /api/yorumla ile test edebilirsin.');
});

app.post('/api/yorumla', async (req, res) => {
  try {
    const { soru, hedefDil } = req.body;
    if (!soru) {
      return res.status(400).json({ hata: 'Soru eksik gönderildi.' });
    }
    const cevap = await yorumla(soru, hedefDil);
    return res.json({ cevap });
  } catch (err) {
    console.error('Sunucu hatası:', err);
    return res.status(500).json({ hata: 'Sunucu hatası oluştu.' });
  }
});

app.post('/api/egitim-cek', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ hata: 'URL eksik' });
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const title = $('title').text();
    const headings = [];
    $('h1, h2, h3').each((i, el) => headings.push($(el).text()));
    const paragraphs = [];
    $('p').each((i, el) => paragraphs.push($(el).text()));
    res.json({ title, headings, paragraphs });
  } catch (err) {
    console.error('Eğitim çekme hatası:', err);
    res.status(500).json({ hata: 'Eğitim verisi çekilemedi.' });
  }
});

// Çoklu eğitim sitesi link toplayıcı endpoint
app.post('/api/site-links', async (req, res) => {
  const { sites } = req.body;
  if (!sites || !Array.isArray(sites)) {
    return res.status(400).json({ hata: 'sites parametresi bir dizi olmalı.' });
  }
  const results = {};
  for (const site of sites) {
    try {
      if (site.includes('w3schools')) {
        // w3schools ana sayfa menü linkleri
        const html = (await axios.get('https://www.w3schools.com/')).data;
        const $ = cheerio.load(html);
        const links = [];
        $('#nav_tutorials .w3-bar-block a').each((i, el) => {
          const href = $(el).attr('href');
          if (href && href.startsWith('/')) links.push('https://www.w3schools.com' + href);
        });
        results[site] = links;
      } else if (site.includes('mdn')) {
        // mdn ana sayfa menü linkleri (statik örnek)
        results[site] = [
          'https://developer.mozilla.org/en-US/docs/Web/HTML',
          'https://developer.mozilla.org/en-US/docs/Web/CSS',
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
          'https://developer.mozilla.org/en-US/docs/Web/HTTP',
          'https://developer.mozilla.org/en-US/docs/Web/API',
          'https://developer.mozilla.org/en-US/docs/Web/SVG',
        ];
      } else {
        results[site] = [];
      }
    } catch (err) {
      results[site] = [];
    }
  }
  res.json(results);
});

// Eğitim klasör ağacını çıkaran fonksiyon
function getDirectoryTree(dirPath) {
  const stats = fs.statSync(dirPath);
  const name = path.basename(dirPath);

  // .DS_Store ve benzeri dosyaları gizle
  if (name === '.DS_Store') {
    return null;
  }

  if (stats.isFile()) {
    return { type: 'file', name };
  }

  const children = fs.readdirSync(dirPath)
    .map(child => getDirectoryTree(path.join(dirPath, child)))
    .filter(Boolean); // null olanları (gizlenenleri) çıkar

  return { type: 'directory', name, children };
}

// GET /api/egitimler-tree endpoint'i
app.get('/api/egitimler-tree', (req, res) => {
  const egitimlerPath = path.join(__dirname, 'src', 'Egitimler'); // Egitimler klasörünün yeni yolu

  if (!fs.existsSync(egitimlerPath)) {
    return res.status(404).json({ hata: 'Egitimler klasörü bulunamadı.' });
  }

  try {
    const tree = getDirectoryTree(egitimlerPath);
    res.json(tree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ hata: 'Klasör yapısı alınamadı.' });
  }
});

// Basit string benzerliği (Jaccard benzerliği)
function stringSimilarity(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const aTokens = new Set(a.split(/[^a-z0-9]+/));
  const bTokens = new Set(b.split(/[^a-z0-9]+/));
  const intersection = new Set([...aTokens].filter(x => bTokens.has(x)));
  const union = new Set([...aTokens, ...bTokens]);
  return intersection.size / union.size;
}

// En iyi eşleşen linki bul
function findBestMatch(folderName, siteLinks) {
  let best = { url: null, score: 0 };
  for (const url of siteLinks) {
    const urlParts = url.split('/').filter(Boolean);
    const lastPart = urlParts[urlParts.length - 1] || '';
    const score = stringSimilarity(folderName, lastPart);
    if (score > best.score) {
      best = { url, score };
    }
  }
  return best;
}

// Çoklu site için matcher endpoint
app.post('/api/best-match', async (req, res) => {
  const { folderName, siteLinks } = req.body;
  if (!folderName || !siteLinks || typeof siteLinks !== 'object') {
    return res.status(400).json({ hata: 'folderName ve siteLinks zorunlu.' });
  }
  const result = {};
  for (const site in siteLinks) {
    result[site] = findBestMatch(folderName, siteLinks[site]);
  }
  res.json(result);
});

app.listen(5050, () => console.log('✅ Backend 5050 portunda çalışıyor')); 