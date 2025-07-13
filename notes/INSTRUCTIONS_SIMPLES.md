# 🚀 Instructions simples - TechNova Chat Widget Sécurisé

## 📁 **FICHIERS À CONSERVER (seulement ces 8 fichiers)**

### ✅ **Fichiers obligatoires backend** (dossier `backend/`)
```
backend/
├── server.js                 ← Serveur Node.js
├── package.json              ← Dépendances
└── .env.example              ← Template configuration
```

### ✅ **Fichiers obligatoires frontend**
```
technova-config-production.js     ← Configuration sans clé API
technova-chat-widget-production.js ← Widget sécurisé
demo-technova-production.html      ← Page de test
```

### ✅ **Documentation (optionnel)**
```
GUIDE_DEPLOIEMENT_PRODUCTION.md   ← Ce guide
SECURISATION_API_KEY_PRODUCTION.md ← Explication sécurité
```

## ❌ **SUPPRIMER tous les autres fichiers**
- Tout le dossier `notes/`
- `technova-chat-widget.js` (ancienne version)
- `technova-config.js` (ancienne version)
- `demo-technova.html` (ancienne version)
- Tous les fichiers OpenAI si vous n'en avez pas besoin

---

## 🛠️ **INSTALLATION ÉTAPE PAR ÉTAPE**

### Étape 1 : Installer Node.js
```bash
# Si vous n'avez pas Node.js, téléchargez-le depuis https://nodejs.org
node --version  # Vérifiez que c'est installé
```

### Étape 2 : Installer les dépendances backend
```bash
# Aller dans le dossier backend
cd backend/

# Installer les packages
npm install
```

### Étape 3 : Configurer votre clé API (IMPORTANT)
```bash
# Copier le template
cp .env.example .env

# Éditer le fichier .env avec vos vraies valeurs
```

**Contenu du fichier `.env` :**
```bash
OPENWEBUI_API_KEY=METTEZ_VOTRE_VRAIE_CLE_API_ICI
OPENWEBUI_URL=http://localhost:3000
PORT=3001
FRONTEND_URL=http://localhost:8080
```

---

## 🚀 **DÉMARRAGE BACKEND ET FRONTEND**

### Démarrer le BACKEND (Étape 1)
```bash
# Dans le dossier backend/
cd backend/
npm start

# Vous devriez voir :
# 🚀 Serveur TechNova backend démarré sur le port 3001
# 🔗 OpenWebUI URL: http://localhost:3000
# 🔐 API Key configurée: Oui
```

### Démarrer le FRONTEND (Étape 2)
```bash
# Dans un NOUVEAU terminal, retourner au dossier principal
cd ..

# Option A : Serveur Python simple
python -m http.server 8080

# Option B : Serveur Node.js simple
npx http-server -p 8080

# Option C : Ouvrir directement le fichier
# Double-cliquez sur demo-technova-production.html
```

### Tester que ça fonctionne (Étape 3)
```bash
# Ouvrez votre navigateur sur :
http://localhost:8080/demo-technova-production.html

# Vous devriez voir :
# ✅ Backend connecté
# ✅ Sécurité: Aucune clé API exposée
```

---

## ⚠️ **PROBLÈMES COURANTS**

### Backend ne démarre pas
```bash
# Vérifiez que vous êtes dans le bon dossier
pwd  # Doit finir par /backend

# Vérifiez le fichier .env
cat .env  # Doit contenir votre vraie clé API

# Vérifiez les dépendances
npm install
```

### Frontend affiche "Backend déconnecté"
```bash
# Vérifiez que le backend tourne
curl http://localhost:3001/health

# Éditez technova-config-production.js
# Changez cette ligne :
openWebUIUrl: 'http://localhost:3001',  # Pour test local
```

### Chat ne s'ouvre pas
```bash
# Vérifiez dans la console du navigateur (F12)
# Recherchez les erreurs en rouge
```

---

## 🎯 **RÉSUMÉ ULTRA-SIMPLE**

1. **Installation** : `cd backend/ && npm install`
2. **Configuration** : Créez `.env` avec votre clé API
3. **Backend** : `npm start` (port 3001)
4. **Frontend** : `python -m http.server 8080` (port 8080)
5. **Test** : Ouvrez `http://localhost:8080/demo-technova-production.html`

**C'est tout ! Votre widget sécurisé fonctionne ! 🎉**

---

## 📞 **EN CAS DE PROBLÈME**

1. Vérifiez que OpenWebUI tourne sur `http://localhost:3000`
2. Vérifiez que votre clé API est valide dans OpenWebUI
3. Regardez les logs du backend dans le terminal
4. Ouvrez F12 dans le navigateur pour voir les erreurs
