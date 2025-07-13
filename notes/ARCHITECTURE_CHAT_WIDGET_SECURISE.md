# 🔐 Architecture Chat Widget TechNova Sécurisé

## 📋 Vue d'ensemble

Le chat widget TechNova utilise une architecture **PROXY BACKEND** pour protéger complètement la clé API OpenWebUI. Cette approche garantit qu'aucune information sensible n'est exposée côté frontend.

---

## 🏗️ Architecture Complète

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │   BACKEND       │    │   OPENWEBUI     │
│   (Browser)     │    │   (Proxy)       │    │   (IA Service)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Question user      │                       │
         ├──────────────────────►│                       │
         │                       │ 2. + API Key         │
         │                       ├──────────────────────►│
         │                       │                       │
         │                       │ 3. Réponse IA        │
         │                       │◄──────────────────────┤
         │ 4. Réponse finale     │                       │
         │◄──────────────────────┤                       │
```

---

## 📁 Fichiers et leurs Rôles

### 🎯 **1. technova-config-production.js**
**Rôle** : Configuration SÉCURISÉE du frontend
```javascript
// ✅ CE QUI EST EXPOSÉ (SÉCURISÉ)
openWebUIUrl: 'http://localhost:3001'  // URL de VOTRE backend
apiKey: ''                             // VIDE = SÉCURISÉ !
chatEndpoint: '/api/chat'              // Endpoint backend
modelsEndpoint: '/api/models'          // Endpoint backend

// ❌ CE QUI N'EST PAS EXPOSÉ
OPENWEBUI_API_KEY                      // Cachée dans backend/.env
```

**Logique** : 
- Définit où le frontend doit envoyer les requêtes (votre backend, pas OpenWebUI)
- AUCUNE clé API sensible
- Configuration des endpoints publics uniquement

---

### 🎨 **2. technova-chat-widget-production.js**
**Rôle** : Interface utilisateur et logique frontend
```javascript
// ✅ APPEL SÉCURISÉ
fetch(`${CONFIG.openWebUIUrl}${CONFIG.chatEndpoint}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
    // ✅ AUCUNE clé API ici !
  },
  body: JSON.stringify({...})
});
```

**Logique** :
1. **Interface** : Crée le chat bubble, popup, messages
2. **Communication** : Envoie les questions au backend (pas OpenWebUI)
3. **Sécurité** : Aucune clé API, aucun secret
4. **Corrections** : Texte maintenant en `text-gray-800` (lisible)

---

### 🛡️ **3. backend/server.js**
**Rôle** : Proxy sécurisé qui protège la clé API
```javascript
// ✅ ENDPOINT SÉCURISÉ
app.post('/api/chat', async (req, res) => {
  const response = await fetch(`${OPENWEBUI_URL}/api/chat/completions`, {
    headers: {
      'Authorization': `Bearer ${OPENWEBUI_API_KEY}` // ✅ Clé cachée ici
    },
    body: JSON.stringify(req.body)
  });
});
```

**Logique** :
1. **Réception** : Reçoit les requêtes du frontend
2. **Authentification** : Ajoute la clé API secrète
3. **Proxy** : Transmet à OpenWebUI
4. **Réponse** : Renvoie la réponse au frontend
5. **Protection** : La clé API ne quitte JAMAIS le serveur

---

### 🔒 **4. backend/.env**
**Rôle** : Variables d'environnement SECRÈTES
```bash
OPENWEBUI_API_KEY=votre_cle_secrete_ici
OPENWEBUI_URL=http://localhost:3000
FRONTEND_URL=http://localhost:8080
```

**Logique** :
- Stockage sécurisé des informations sensibles
- Jamais commité dans Git
- Accessible uniquement au backend

---

### 🌐 **5. demo-technova-production.html**
**Rôle** : Page de démonstration
```html
<!-- Chargement sécurisé -->
<script src="technova-config-production.js"></script>
<script src="technova-chat-widget-production.js"></script>
```

**Logique** :
- Teste la connexion backend
- Affiche le statut de sécurité
- Interface de diagnostic

---

## 🔄 Flux de Données Détaillé

### Étape 1 : Utilisateur pose une question
```javascript
// Dans technova-chat-widget-production.js
function handleUserMessage() {
  const message = chatInput.value.trim();
  messageHistory.push({ role: 'user', content: message });
}
```

### Étape 2 : Envoi au backend (PAS OpenWebUI)
```javascript
// Frontend → Backend (localhost:3001)
const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    model: 'technova',
    messages: messageHistory
  })
});
```

### Étape 3 : Backend ajoute la clé API et contacte OpenWebUI
```javascript
// Dans backend/server.js
const response = await fetch('http://localhost:3000/api/chat/completions', {
  headers: {
    'Authorization': `Bearer ${OPENWEBUI_API_KEY}` // ✅ Clé secrète
  },
  body: JSON.stringify(req.body)
});
```

### Étape 4 : Réponse retourne au frontend
```javascript
// Backend → Frontend
const data = await response.json();
displayAssistantMessage(data.choices[0].message.content);
```

---

## 🛡️ Avantages Sécuritaires

### ✅ **CE QUI EST PROTÉGÉ**
1. **Clé API** : Jamais exposée au navigateur
2. **URL OpenWebUI** : Cachée derrière le proxy
3. **Credentials** : Stockés uniquement serveur-side
4. **Traffic** : Filtré et contrôlé par le backend

### ❌ **SANS CETTE ARCHITECTURE**
```javascript
// ❌ DANGEREUX - Clé exposée
fetch('http://localhost:3000/api/chat', {
  headers: {
    'Authorization': 'Bearer sk-123456789' // ❌ Visible par tous !
  }
});
```

---

## 🚀 Déploiement Production

### Variables d'environnement (Heroku/Vercel)
```bash
OPENWEBUI_API_KEY=votre_vraie_cle_production
OPENWEBUI_URL=https://votre-openwebui.com
FRONTEND_URL=https://votre-site.com
PORT=3001
```

### Configuration frontend production
```javascript
// technova-config-production.js
const TECHNOVA_CONFIG = {
  openWebUIUrl: 'https://votre-backend.herokuapp.com', // ✅ URL backend
  apiKey: '', // ✅ Toujours vide !
  // ...
};
```

---

## 🎨 Corrections Interface

### Problème de couleur résolu :
```javascript
// AVANT (texte blanc = invisible)
<input class="..." placeholder="...">

// APRÈS (texte gris foncé = visible)
<input class="... text-gray-800" placeholder="...">
```

Le texte saisi par l'utilisateur est maintenant **gris foncé** (#1F2937) sur fond blanc, parfaitement lisible.

---

## 🔍 Tests et Diagnostic

### Test connexion backend :
```javascript
// Vérification automatique
async function testTechnovaConnection() {
  // 1. Test endpoint santé
  const health = await fetch('/health');
  
  // 2. Test endpoint modèles  
  const models = await fetch('/api/models');
  
  // 3. Validation modèle Technova
  return models.includes('technova');
}
```

### Logs de sécurité :
```
✅ Configuration TechNova SÉCURISÉE chargée (sans clé API exposée)
✅ TechNova Chat Widget SÉCURISÉ initialisé (Production)
🔐 Sécurité: Aucune clé API exposée côté frontend
```

---

## 📊 Monitoring

### Backend logs :
```
🚀 Serveur TechNova backend démarré sur le port 3001
🔗 OpenWebUI URL: http://localhost:3000
🔐 API Key configurée: Oui
📝 Requête chat reçue: { model: 'technova', messagesCount: 2 }
✅ Réponse OpenWebUI reçue
```

### Frontend logs :
```
✅ Backend connecté - Modèles disponibles
🎉 Test de connexion backend sécurisé réussi !
```

---

## 🎯 Résumé

Cette architecture **3-tiers** garantit une sécurité maximale :

1. **Frontend** : Interface pure, aucun secret
2. **Backend** : Proxy sécurisé, gère l'authentification  
3. **OpenWebUI** : Service IA protégé

**Résultat** : Chat widget professionnel avec clé API **100% sécurisée** et interface **parfaitement lisible**.
