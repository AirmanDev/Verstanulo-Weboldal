# Verstanuló App

Interaktív verstanuló alkalmazás - Tanulj meg verseket lépésről lépésre!

## 🎯 Funkciók

### Általános
- 📝 Versek feltöltése és tárolása központi adatbázisban
- 📚 Kétfázisú tanulási rendszer
- 💡 Intelligens hint rendszer
- ✅ Teszt mód a tudásod ellenőrzéséhez
- 📊 Haladás követése és mentése
- ⚙️ Testreszabható beállítások

### Újdonságok (2025.11.10)
- 👥 **Multi-user támogatás** - Több felhasználó független használata
- 🎓 **Vers-specifikus haladás** - Minden vers külön tanulási és teszt állapottal
- 🗄️ **Központi vers-adatbázis** - Közös versgyűjtemény minden felhasználónak
- 🚫 **Duplikáció-ellenőrzés** - Azonos versek feltöltésének megakadályozása
- 🔐 **Felhasználó-azonosítás** - Automatikus user ID generálás

## 🚀 Production Deployment

### Szerver követelmények
- Ubuntu Server 20.04+ vagy más Linux disztribúció
- Node.js 18+
- Nginx
- PM2 process manager

### Production szerver parancsok

**Backend állapot ellenőrzése:**
```bash
pm2 status
pm2 logs verstanulo-backend
```

**Backend újraindítás:**
```bash
pm2 restart verstanulo-backend
```

**Nginx újratöltés:**
```bash
sudo systemctl reload nginx
```

**Új verzió deployolása:**
```bash
cd /path/to/verstanulo-app
git pull
npm install
npm run build
chmod -R 755 /path/to/verstanulo-app/build
sudo systemctl reload nginx
```

Részletes deployment útmutató: `/deployment/DEPLOY_STEPS.md`

## 💻 Fejlesztői Környezet

### Előfeltételek
- Node.js v18+ telepítése: https://nodejs.org/

### Lokális futtatás

**1. Frontend:**
```bash
npm install
npm start
```
Az alkalmazás elérhető: `http://localhost:3000`

**2. Backend (új terminálban):**
```bash
cd server
npm install
npm start
```
Az API elérhető: `http://localhost:3001`

## 📁 Projekt Struktúra

```
verstanulo-app/
├── src/
│   ├── components/        # React komponensek
│   │   ├── Menu.jsx
│   │   ├── PoemList.jsx
│   │   ├── PoemDetail.jsx
│   │   ├── PoemUpload.jsx
│   │   ├── LearningSettings.jsx
│   │   ├── Learning.jsx
│   │   ├── StanzaRenderer.jsx
│   │   ├── LearningSummary.jsx
│   │   ├── TestSettings.jsx
│   │   ├── Test.jsx
│   │   └── TestSummary.jsx
│   │
│   ├── hooks/             # Egyedi React hooks
│   │   ├── usePoems.js          # Versek és haladás kezelése (API)
│   │   ├── useLearningState.js
│   │   ├── useLearningLogic.js
│   │   ├── useLearningKeyboard.js
│   │   ├── useAutoHintTimer.js
│   │   └── useSettings.js
│   │
│   ├── services/          # Backend kommunikáció
│   │   └── apiService.js        # API hívások (poems, progress)
│   │
│   ├── utils/             # Segédfüggvények
│   │   ├── textUtils.js
│   │   ├── storageUtils.js
│   │   └── progressUtils.js
│   │
│   ├── constants/         # Konstansok
│   │   ├── modes.js
│   │   └── storage.js
│   │
│   ├── App.jsx            # Fő alkalmazás komponens
│   ├── index.js           # Belépési pont
│   └── index.css          # Globális stílusok
│
├── server/                # Backend (Node.js/Express)
│   ├── server.js          # API szerver
│   ├── package.json
│   └── data/              # JSON adatbázis
│       ├── poems.json     # Versek (közös)
│       └── progress.json  # Felhasználói haladások
│
├── deployment/            # Deployment fájlok
│   ├── backend/           # Backend production fájlok
│   ├── nginx/             # Nginx konfiguráció
│   └── scripts/           # Telepítő scriptek
│
├── public/
│   └── index.html
│
├── build/                 # Production build
│
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🔧 Architektúra

### Frontend (React)
- **Port:** 3000 (dev) / 80 (production via Nginx)
- **Adattárolás:** API-n keresztül
- **User ID:** localStorage-ban tárolva
- **State management:** React hooks

### Backend (Express)
- **Port:** 3001
- **Adatbázis:** JSON fájlok (poems.json, progress.json)
- **Process manager:** PM2
- **CORS:** Engedélyezve

### Nginx (Reverse Proxy)
- Statikus fájlok kiszolgálása (frontend)
- API proxy (`/api/*` → `http://localhost:3001`)
- Gzip kompresszió
- Cache kezelés

## 🗄️ API Endpointok

### Versek
- `GET /api/poems` - Összes vers lekérése
- `POST /api/poems` - Új vers hozzáadása
- `DELETE /api/poems/:poemId` - Vers törlése

### Haladás
- `GET /api/progress/:userId` - Összes haladás lekérése
- `GET /api/progress/:userId/:poemId` - Egy vers haladása
- `PUT /api/progress/:userId/:poemId` - Haladás mentése
- `DELETE /api/progress/:userId/:poemId` - Haladás törlése

### Health Check
- `GET /api/health` - Szerver állapot ellenőrzése

## 💾 Adatstruktúra

### Vers
```json
{
  "id": "unique-id",
  "title": "Vers címe",
  "author": "Szerző neve",
  "year": "Keletkezés éve",
  "stanzas": ["versszak1", "versszak2"],
  "createdAt": "2025-11-10T..."
}
```

### Haladás (vers-specifikus)
```json
{
  "userId123": {
    "poemId456": {
      "learning": {
        "currentRound": 1,
        "currentStanzaIndex": 2,
        "repeatCount": 1,
        "attempts": [...],
        "problemWords": {},
        "lastUpdated": "2025-11-10T..."
      },
      "test": {
        "results": [...],
        "stats": {
          "totalAnswers": 5,
          "correctAnswers": 4,
          "percentage": 80
        },
        "completedAt": "2025-11-10T...",
        "lastUpdated": "2025-11-10T..."
      }
    }
  }
}
```

## 📖 Használat

### 1. Vers feltöltése
- Kattints az **"Új vers feltöltése"** gombra
- Add meg a vers címét, szerzőjét, évét (opcionális)
- Írd be a versszakokat
- Mentsd el
- ⚠️ A rendszer megakadályozza az azonos versek duplikált feltöltését

### 2. Tanulás
- Válaszd ki a verset
- Kattints a **"Tanulás indítása"** gombra
- Állítsd be a beállításokat (kis/nagybetű, írásjelek)
- **Két körös rendszer:**
  - **1. kör:** Látod a teljes szöveget, 3x gyakorlás versszakonként
  - **2. kör:** Hint rendszer segít az elakadásoknál
- A haladásod automatikusan mentődik - bármikor folytathatod!

### 3. Teszt
- Válaszd ki a verset
- Kattints a **"Teszt"** gombra
- Írd be az egyes versszakokat emlékezetből
- A végén látod az eredményedet
- A teszt eredménye külön mentődik a tanulási haladástól

### 4. Multi-user használat
- Minden böngésző/eszköz automatikusan külön felhasználót jelent
- A haladásod csak neked látható
- A versek mindenki számára közösek
- Nem kell regisztráció vagy bejelentkezés

## 🛠️ Technológiák

### Frontend
- React 18
- Tailwind CSS
- Lucide React (ikonok)
- Fetch API

### Backend
- Node.js 18+
- Express.js
- CORS
- Body-parser
- JSON file storage

### Infrastruktúra
- **Webszerver:** Nginx 1.18
- **Process Manager:** PM2
- **OS:** Ubuntu Linux
- **Deploy:** Production build + reverse proxy

## 🔐 Biztonsági megjegyzések

⚠️ **Jelenlegi állapot:** Production ready, de basic security

**Éles használatra javasolt fejlesztések:**
- [ ] HTTPS/SSL tanúsítvány (Let's Encrypt)
- [ ] Rate limiting az API-hoz
- [ ] Input validáció és szanitizálás
- [ ] Valódi felhasználó-kezelés (auth)
- [ ] Adatbázis használata (MongoDB/PostgreSQL)
- [ ] Környezeti változók védelme
- [ ] Backup rendszer az adatokhoz

## 📚 További dokumentáció

- **Backend API:** `/deployment/BACKEND_DOKUMENTACIO.md`
- **Használati útmutató:** `/deployment/HASZNALATI_UTMUTATO.md`
- **Deployment lépések:** `/deployment/DEPLOY_STEPS.md`

## 🐛 Hibaelhárítás

**Probléma:** "Nem sikerült betölteni az adatokat"
- Ellenőrizd, hogy fut-e a backend: `pm2 status`
- Nézd meg a logokat: `pm2 logs verstanulo-backend`
- Újraindítás: `pm2 restart verstanulo-backend`

**Probléma:** Nginx hiba
- Ellenőrizd a config-ot: `sudo nginx -t`
- Nézd meg a logokat: `sudo tail -f /var/log/nginx/error.log`
- Újraindítás: `sudo systemctl restart nginx`

**Probléma:** Permission denied hibák
- Jogosultságok javítása:
```bash
chmod 755 $HOME
chmod 755 /path/to/project/parent
chmod -R 755 /path/to/verstanulo-app/build
```

## 📝 Changelog

### v2.0.0 (2025.11.10)
- ✨ Multi-user támogatás
- ✨ Vers-specifikus haladás (tanulás + teszt külön)
- ✨ Backend API (Node.js/Express)
- ✨ Központi vers-adatbázis
- ✨ Duplikáció-ellenőrzés
- ✨ Production deployment Ubuntu szerverre
- ✨ PM2 process management
- ✨ Nginx reverse proxy

### v1.0.0
- 📝 Versek feltöltése és tárolása
- 📚 Kétfázisú tanulási rendszer
- 💡 Intelligens hint rendszer
- ✅ Teszt mód
- 📊 Haladás követése (localStorage)

## 👨‍💻 Készítő

**Verstanuló App** - Interaktív verstanuló alkalmazás

📧 Kérdések, javaslatok: GitHub Issues

---

Made with ❤️ for poetry learners
