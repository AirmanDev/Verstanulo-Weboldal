const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { validatePoem, validateProgress, validateUserId, validatePoemId } = require('./validation');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Adatfájlok útvonalai
const DATA_DIR = path.join(__dirname, 'data');
const POEMS_FILE = path.join(DATA_DIR, 'poems.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');

/**
 * Inicializálja az adatkönyvtárat és fájlokat
 */
async function initializeDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Versek fájl inicializálása
    try {
      await fs.access(POEMS_FILE);
    } catch {
      await fs.writeFile(POEMS_FILE, JSON.stringify([], null, 2));
    }
    
    // Haladás fájl inicializálása
    try {
      await fs.access(PROGRESS_FILE);
    } catch {
      await fs.writeFile(PROGRESS_FILE, JSON.stringify({}, null, 2));
    }
    
    console.log('Adatfájlok inicializálva');
  } catch (error) {
    console.error('Hiba az adatfájlok inicializálásakor:', error);
  }
}

/**
 * Szöveg normalizálása duplikáció-ellenőrzéshez
 */
function normalizeForComparison(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Ékezetek eltávolítása
    .replace(/[^\w\s]/g, '') // Írásjelek eltávolítása
    .replace(/\s+/g, ' ') // Többszörös szóközök egyszerűsítése
    .trim();
}

/**
 * Versek betöltése
 */
async function loadPoems() {
  try {
    const data = await fs.readFile(POEMS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Hiba a versek betöltésekor:', error);
    return [];
  }
}

/**
 * Versek mentése
 */
async function savePoems(poems) {
  try {
    await fs.writeFile(POEMS_FILE, JSON.stringify(poems, null, 2));
  } catch (error) {
    console.error('Hiba a versek mentésekor:', error);
    throw error;
  }
}

/**
 * Haladás betöltése
 */
async function loadProgress() {
  try {
    const data = await fs.readFile(PROGRESS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Hiba a haladás betöltésekor:', error);
    return {};
  }
}

/**
 * Haladás mentése
 */
async function saveProgress(progress) {
  try {
    await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2));
  } catch (error) {
    console.error('Hiba a haladás mentésekor:', error);
    throw error;
  }
}

// API Endpointok

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Összes vers lekérése
 */
app.get('/api/poems', async (req, res) => {
  try {
    const poems = await loadPoems();
    res.json(poems);
  } catch (error) {
    res.status(500).json({ error: 'Hiba a versek betöltésekor' });
  }
});

/**
 * Új vers hozzáadása
 */
app.post('/api/poems', async (req, res) => {
  try {
    // Validáció
    const validation = validatePoem(req.body);
    if (!validation.valid) {
      return res.status(400).json({ 
        error: validation.message,
        field: validation.field 
      });
    }
    
    const { title, author, year, stanzas } = req.body;
    const poems = await loadPoems();
    
    // Duplikáció ellenőrzése
    const normalizedTitle = normalizeForComparison(title);
    const normalizedAuthor = normalizeForComparison(author);
    
    const isDuplicate = poems.some(poem => {
      const poemTitle = normalizeForComparison(poem.title);
      const poemAuthor = normalizeForComparison(poem.author);
      return poemTitle === normalizedTitle && poemAuthor === normalizedAuthor;
    });
    
    if (isDuplicate) {
      return res.status(409).json({ 
        error: 'Ez a vers már létezik az adatbázisban',
        duplicate: true
      });
    }
    
    // Új vers létrehozása
    const newPoem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      author: author.trim(),
      year: year ? year.trim() : '',
      stanzas: stanzas.map(s => s.trim()),
      createdAt: new Date().toISOString()
    };
    
    poems.push(newPoem);
    await savePoems(poems);
    
    res.status(201).json(newPoem);
  } catch (error) {
    console.error('Hiba a vers mentésekor:', error);
    res.status(500).json({ error: 'Hiba a vers mentésekor' });
  }
});

/**
 * Vers törlése
 */
app.delete('/api/poems/:poemId', async (req, res) => {
  try {
    const { poemId } = req.params;
    
    // Validáció
    const validation = validatePoemId(poemId);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }
    
    const poems = await loadPoems();
    const filteredPoems = poems.filter(p => p.id !== poemId);
    
    if (filteredPoems.length === poems.length) {
      return res.status(404).json({ error: 'Vers nem található' });
    }
    
    await savePoems(filteredPoems);
    
    // Haladás törlése is
    const progress = await loadProgress();
    Object.keys(progress).forEach(userId => {
      if (progress[userId][poemId]) {
        delete progress[userId][poemId];
      }
    });
    await saveProgress(progress);
    
    res.json({ message: 'Vers sikeresen törölve' });
  } catch (error) {
    res.status(500).json({ error: 'Hiba a vers törlésekor' });
  }
});

/**
 * Felhasználó haladásának lekérése egy vershez
 */
app.get('/api/progress/:userId/:poemId', async (req, res) => {
  try {
    const { userId, poemId } = req.params;
    
    // Validáció
    const userValidation = validateUserId(userId);
    if (!userValidation.valid) {
      return res.status(400).json({ error: userValidation.message });
    }
    
    const poemValidation = validatePoemId(poemId);
    if (!poemValidation.valid) {
      return res.status(400).json({ error: poemValidation.message });
    }
    
    const progress = await loadProgress();
    const userProgress = progress[userId]?.[poemId] || null;
    res.json(userProgress);
  } catch (error) {
    res.status(500).json({ error: 'Hiba a haladás betöltésekor' });
  }
});

/**
 * Felhasználó összes haladásának lekérése
 */
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validáció
    const validation = validateUserId(userId);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }
    
    const progress = await loadProgress();
    const userProgress = progress[userId] || {};
    res.json(userProgress);
  } catch (error) {
    res.status(500).json({ error: 'Hiba a haladás betöltésekor' });
  }
});

/**
 * Haladás mentése/frissítése
 */
app.put('/api/progress/:userId/:poemId', async (req, res) => {
  try {
    const { userId, poemId } = req.params;
    const progressData = req.body;
    
    // Validáció
    const userValidation = validateUserId(userId);
    if (!userValidation.valid) {
      return res.status(400).json({ error: userValidation.message });
    }
    
    const poemValidation = validatePoemId(poemId);
    if (!poemValidation.valid) {
      return res.status(400).json({ error: poemValidation.message });
    }
    
    const progressValidation = validateProgress(progressData);
    if (!progressValidation.valid) {
      return res.status(400).json({ error: progressValidation.message });
    }
    
    const progress = await loadProgress();
    
    if (!progress[userId]) {
      progress[userId] = {};
    }
    
    progress[userId][poemId] = {
      ...progressData,
      lastUpdated: new Date().toISOString()
    };
    
    await saveProgress(progress);
    res.json(progress[userId][poemId]);
  } catch (error) {
    console.error('Hiba a haladás mentésekor:', error);
    res.status(500).json({ error: 'Hiba a haladás mentésekor' });
  }
});

/**
 * Haladás törlése egy vershez
 */
app.delete('/api/progress/:userId/:poemId', async (req, res) => {
  try {
    const { userId, poemId } = req.params;
    
    // Validáció
    const userValidation = validateUserId(userId);
    if (!userValidation.valid) {
      return res.status(400).json({ error: userValidation.message });
    }
    
    const poemValidation = validatePoemId(poemId);
    if (!poemValidation.valid) {
      return res.status(400).json({ error: poemValidation.message });
    }
    
    const progress = await loadProgress();
    
    if (progress[userId]?.[poemId]) {
      delete progress[userId][poemId];
      await saveProgress(progress);
      res.json({ message: 'Haladás törölve' });
    } else {
      res.status(404).json({ error: 'Haladás nem található' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Hiba a haladás törlésekor' });
  }
});

// Szerver indítása
app.listen(PORT, async () => {
  await initializeDataFiles();
  console.log(`Szerver fut a http://localhost:${PORT} címen`);
});