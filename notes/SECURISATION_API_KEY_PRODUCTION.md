# 🔐 Sécurisation de la clé API pour hébergement

## ⚠️ **PROBLÈME DE SÉCURITÉ**

Actuellement, votre clé API est dans `technova-config.js` :
```javascript
apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // ❌ VISIBLE PAR TOUS !
```

**Problème** : Quand vous hébergez le widget, **tout le monde peut voir votre clé API** dans le code source du navigateur !

## ✅ **SOLUTIONS SÉCURISÉES**

### Solution 1 : Backend Proxy (RECOMMANDÉE)

Créer un serveur backend qui cache la clé API et fait les appels à OpenWebUI.

**Architecture :**
```
Frontend Widget → Votre Backend → OpenWebUI
                    (clé API cachée ici)
```

**Exemple backend Node.js simple :**

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Clé API sécurisée côté serveur (variable d'environnement)
const OPENWEBUI_API_KEY = process.env.OPENWEBUI_API_KEY;
const OPENWEBUI_URL = process.env.OPENWEBUI_URL || 'http://localhost:3000';

// Endpoint proxy pour chat
app.post('/api/chat', async (req, res) => {
    try {
        const response = await fetch(`${OPENWEBUI_URL}/api/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENWEBUI_API_KEY}` // ✅ Sécurisé côté serveur
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.listen(3001, () => {
    console.log('Proxy server running on port 3001');
});
```

### Solution 2 : Modification du widget pour utiliser le backend

**Nouveau fichier : `technova-config-production.js`**

```javascript
const TECHNOVA_CONFIG = {
  // URL de VOTRE backend (pas OpenWebUI directement)
  openWebUIUrl: 'https://votre-domaine.com', // ✅ Votre serveur
  
  // Pas de clé API côté frontend ! ✅
  apiKey: '', 
  
  // Endpoint backend pour le chat
  chatEndpoint: '/api/chat', // ✅ Votre endpoint proxy
  
  model: 'technova',
  maxTokens: 1500,
  temperature: 0.7,
  // ... reste de la config
};

// Définir la variable globale
if (typeof window !== 'undefined') {
  window.TECHNOVA_CONFIG = TECHNOVA_CONFIG;
}
```

### Solution 3 : Widget modifié pour backend

**Modification dans `technova-chat-widget-production.js` :**

```javascript
// Au lieu d'appeler directement OpenWebUI
const response = await fetch(`${CONFIG.openWebUIUrl}/api/chat/completions`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.apiKey}` // ❌ Clé exposée
    },
    body: JSON.stringify(payload)
});

// Appeler VOTRE backend qui cache la clé
const response = await fetch(`${CONFIG.openWebUIUrl}${CONFIG.chatEndpoint}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
        // ✅ Pas de clé API côté frontend !
    },
    body: JSON.stringify(payload)
});
```

## 🚀 **SOLUTIONS ALTERNATIVES**

### Option A : Authentification utilisateur
```javascript
// L'utilisateur doit se connecter avec SES propres identifiants
// Votre backend vérifie ses droits et utilise la clé API
```

### Option B : Variables d'environnement serveur
```bash
# .env (côté serveur seulement)
OPENWEBUI_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENWEBUI_URL=http://localhost:3000
```

### Option C : Configuration dynamique
```javascript
// Le widget demande la configuration au serveur au démarrage
fetch('/api/config').then(config => {
    // Config sans clé API, juste les endpoints
});
```

## 📋 **PLAN DE MIGRATION SÉCURISÉE**

### Étape 1 : Créer le backend
```bash
mkdir technova-backend
cd technova-backend
npm init -y
npm install express cors dotenv
```

### Étape 2 : Configurer les variables d'environnement
```bash
# .env
OPENWEBUI_API_KEY=votre_vraie_cle_api_ici
OPENWEBUI_URL=http://localhost:3000
PORT=3001
```

### Étape 3 : Modifier le widget frontend
- Supprimer la clé API de `technova-config.js`
- Changer l'URL pour pointer vers votre backend
- Modifier les appels API

### Étape 4 : Déployer
- Backend : Heroku, Vercel, VPS, etc.
- Frontend : Netlify, Vercel, GitHub Pages, etc.

## ⚡ **AVANTAGES DE CETTE APPROCHE**

✅ **Sécurité** : Clé API jamais exposée  
✅ **Contrôle** : Vous pouvez limiter l'usage  
✅ **Logs** : Traçabilité des requêtes  
✅ **Cache** : Possibilité de mise en cache  
✅ **Authentification** : Ajouter des droits utilisateur  

## 🎯 **FICHIERS À CRÉER**

1. `server.js` - Backend proxy
2. `technova-config-production.js` - Config sans clé API
3. `technova-chat-widget-production.js` - Widget modifié
4. `.env` - Variables d'environnement serveur
5. `package.json` - Dépendances backend

Voulez-vous que je crée ces fichiers pour vous ?
