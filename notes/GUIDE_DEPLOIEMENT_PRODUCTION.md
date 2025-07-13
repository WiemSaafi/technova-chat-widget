# 🚀 Guide de déploiement production TechNova Chat Widget

## 📋 **RÉSUMÉ DE LA SOLUTION SÉCURISÉE**

Votre problème : **Clé API visible dans le code frontend** = DANGER SÉCURITÉ !

Ma solution : **Architecture Backend/Frontend séparée** = SÉCURITÉ MAXIMALE !

```
Frontend (Hébergé partout)     Backend (Votre serveur)     OpenWebUI
     ↓                              ↓                         ↓
Aucune clé API         →    Clé API sécurisée    →    Modèle Technova
Widget public               Variables d'env             Réponses
```

## 🎯 **FICHIERS CRÉÉS POUR LA PRODUCTION**

### Backend sécurisé (dossier `backend/`)
1. **`server.js`** - Serveur Node.js qui cache votre clé API
2. **`package.json`** - Dépendances du backend
3. **`.env.example`** - Template pour vos variables d'environnement

### Frontend sécurisé
4. **`technova-config-production.js`** - Configuration SANS clé API
5. **`technova-chat-widget-production.js`** - Widget qui utilise votre backend
6. **`demo-technova-production.html`** - Page de test production

### Documentation
7. **`SECURISATION_API_KEY_PRODUCTION.md`** - Explication détaillée
8. **`GUIDE_DEPLOIEMENT_PRODUCTION.md`** - Ce guide

## 🛠️ **ÉTAPES DE DÉPLOIEMENT**

### Étape 1 : Préparer le backend

```bash
# 1. Aller dans le dossier backend
cd backend/

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env avec vos vraies valeurs
cp .env.example .env
```

**Éditez `.env` avec vos vraies valeurs :**
```bash
# backend/.env
OPENWEBUI_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...VOTRE_VRAI_TOKEN
OPENWEBUI_URL=http://localhost:3000
PORT=3001
FRONTEND_URL=https://votre-domaine-frontend.com
```

### Étape 2 : Tester localement

```bash
# Démarrer le backend
cd backend/
npm start

# Le serveur démarre sur http://localhost:3001
# Logs : "🚀 Serveur TechNova backend démarré sur le port 3001"
```

**Tester les endpoints :**
```bash
# Test santé
curl http://localhost:3001/health

# Test modèles (nécessite votre vraie clé API)
curl http://localhost:3001/api/models
```

### Étape 3 : Configurer le frontend

**Éditez `technova-config-production.js` :**
```javascript
const TECHNOVA_CONFIG = {
  // URL de VOTRE backend déployé
  openWebUIUrl: 'https://votre-backend-deploye.herokuapp.com', // ✅ Changez ça !
  
  // ✅ Pas de clé API côté frontend !
  apiKey: '', 
  
  // Endpoints du backend
  chatEndpoint: '/api/chat',
  modelsEndpoint: '/api/models',
  healthEndpoint: '/health',
  
  model: 'technova',
  // ... reste de la config
};
```

### Étape 4 : Déployer le backend

#### Option A : Heroku
```bash
# Dans le dossier backend/
heroku create votre-app-technova-backend
heroku config:set OPENWEBUI_API_KEY="votre_vrai_token"
heroku config:set OPENWEBUI_URL="http://localhost:3000"
heroku config:set FRONTEND_URL="https://votre-frontend.netlify.app"
git add .
git commit -m "Backend TechNova sécurisé"
git push heroku main
```

#### Option B : Vercel
```bash
# Dans le dossier backend/
vercel
# Suivre les instructions
# Ajouter les variables d'environnement dans Vercel dashboard
```

#### Option C : VPS/Serveur dédié
```bash
# Sur votre serveur
git clone votre-repo
cd backend/
npm install
# Configurer .env avec vos valeurs
pm2 start server.js --name technova-backend
```

### Étape 5 : Déployer le frontend

#### Option A : Netlify
```bash
# Déployez les fichiers frontend :
# - technova-config-production.js
# - technova-chat-widget-production.js  
# - demo-technova-production.html
```

#### Option B : Vercel
```bash
vercel --prod
```

#### Option C : GitHub Pages / Tout hébergeur statique
- Uploadez les 3 fichiers frontend
- Pas besoin de serveur, juste du HTML/JS/CSS

## ✅ **VÉRIFICATION DU DÉPLOIEMENT**

### 1. Vérifiez votre backend
```bash
curl https://votre-backend.herokuapp.com/health
# Réponse attendue : {"status":"OK","timestamp":"..."}

curl https://votre-backend.herokuapp.com/api/models
# Réponse attendue : Liste des modèles OpenWebUI
```

### 2. Testez votre frontend
1. Ouvrez `https://votre-frontend.netlify.app/demo-technova-production.html`
2. Vérifiez "✅ Backend connecté" 
3. Cliquez "Ouvrir le Chat Assistant"
4. Envoyez un message test

### 3. Vérifiez la sécurité
```javascript
// Dans la console du navigateur, vérifiez qu'aucune clé API n'est exposée
console.log(window.TECHNOVA_CONFIG.apiKey); // Doit être vide !
```

## 🔧 **MAINTENANCE**

### Mettre à jour la clé API
1. Récupérez un nouveau token depuis OpenWebUI
2. Mettez à jour la variable d'environnement sur votre hébergeur :
   ```bash
   # Heroku
   heroku config:set OPENWEBUI_API_KEY="nouveau_token"
   
   # Vercel
   # Via le dashboard Vercel
   
   # VPS
   # Éditez le fichier .env et redémarrez
   ```

### Monitoring
- Consultez les logs de votre backend hébergé
- Utilisez l'endpoint `/health` pour vérifier le statut
- Surveillez les erreurs 403/500 dans les logs

## 📁 **STRUCTURE FINALE**

```
votre-projet/
├── backend/                          ← Déployé sur Heroku/Vercel
│   ├── server.js                     ← Serveur avec clé API sécurisée
│   ├── package.json                  ← Dépendances
│   ├── .env                          ← Variables secrètes (GIT IGNORE!)
│   └── .env.example                  ← Template
├── technova-config-production.js     ← Config sans clé API
├── technova-chat-widget-production.js ← Widget sécurisé
├── demo-technova-production.html     ← Page de test
└── SECURISATION_API_KEY_PRODUCTION.md ← Documentation
```

## 🎯 **AVANTAGES DE CETTE SOLUTION**

✅ **Sécurité** : Clé API jamais exposée côté frontend  
✅ **Évolutivité** : Backend peut gérer plusieurs widgets  
✅ **Monitoring** : Logs centralisés côté backend  
✅ **Contrôle** : Vous pouvez limiter l'usage, ajouter l'authentification  
✅ **Hébergement** : Frontend statique = moins cher  
✅ **Mise à jour** : Changement de clé API sans redéployer le frontend  

## 🚨 **IMPORTANT**

- **JAMAIS** commiter le fichier `.env` avec la vraie clé API
- Ajoutez `.env` à votre `.gitignore`
- Utilisez HTTPS pour votre backend en production
- Configurez CORS correctement pour limiter l'accès
- Surveillez les logs pour détecter les abus

Votre TechNova Chat Widget est maintenant **100% sécurisé** pour la production ! 🎉
