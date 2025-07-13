# 🔑 Explication de l'API Key dans Open WebUI

## 📋 À quoi sert l'API Key ?

L'`apiKey` dans la configuration **N'EST PAS** pour le modèle AI lui-même, mais pour **l'authentification avec Open WebUI**.

## 🎯 Contexte d'utilisation

### 1. **Open WebUI sans authentification** (cas le plus courant)
```javascript
const TECHNOVA_CONFIG = {
  openWebUIUrl: 'http://localhost:3000',
  apiKey: '',  // ← LAISSEZ VIDE
  model: 'Technova',
  // ...
};
```

**Quand utiliser :**
- Installation locale d'Open WebUI
- Environnement de développement
- Accès direct sans restrictions

### 2. **Open WebUI avec authentification** (environnement sécurisé)
```javascript
const TECHNOVA_CONFIG = {
  openWebUIUrl: 'https://your-company-openwebui.com',
  apiKey: 'owui-abc123def456',  // ← CLÉ OPEN WEBUI
  model: 'Technova',
  // ...
};
```

**Quand utiliser :**
- Open WebUI déployé en production
- Environnement d'entreprise sécurisé
- Accès multi-utilisateurs contrôlé

## 🔧 Types d'API Keys

### A. API Key Open WebUI (ce qui nous concerne)
```javascript
// Génération dans Open WebUI
// Settings → Account → API Keys → Create New Key
apiKey: 'owui-1234567890abcdef'
```

**Utilisée pour :**
- Authentifier l'accès à Open WebUI
- Contrôler les permissions d'usage
- Tracer les requêtes par utilisateur

### B. API Key des modèles (différent !)
```javascript
// Exemple : Pour GPT-4 via OpenAI
// Cette clé est configurée DANS Open WebUI, pas dans le widget
openai_api_key: 'sk-proj-1234567890abcdef'
```

**Utilisée pour :**
- Accéder aux modèles externes (OpenAI, Anthropic, etc.)
- Configurée dans Open WebUI directement
- Pas nécessaire pour votre modèle Technova local

## 🔍 Comment identifier si vous en avez besoin ?

### Test simple :
```javascript
// Essayez d'accéder à votre Open WebUI
fetch('http://localhost:3000/api/models')
  .then(response => {
    if (response.status === 401) {
      console.log('❌ API Key requise');
    } else if (response.status === 200) {
      console.log('✅ Pas d\'API Key nécessaire');
    }
  });
```

### Signaux qu'une API Key est requise :
- **Erreur 401 Unauthorized** lors des requêtes
- **Page de login** sur Open WebUI
- **Message d'authentification** dans la console

### Signaux qu'aucune API Key n'est nécessaire :
- **Accès direct** à `localhost:3000`
- **Pas de page de login**
- **Réponses 200 OK** aux requêtes API

## 🛠️ Configuration pratique

### Votre cas (très probablement) :
```javascript
const TECHNOVA_CONFIG = {
  openWebUIUrl: 'http://localhost:3000',
  apiKey: '',  // ← LAISSEZ VIDE
  model: 'Technova',
  // ...
};
```

**Pourquoi laissez vide :**
- Votre Open WebUI est local
- Pas de système d'authentification configuré
- Accès direct au modèle Technova

### Si vous avez configuré l'authentification :
```javascript
const TECHNOVA_CONFIG = {
  openWebUIUrl: 'http://localhost:3000',
  apiKey: 'votre-cle-openwebui',  // ← CLÉ GÉNÉRÉE DANS OPEN WEBUI
  model: 'Technova',
  // ...
};
```

## 🔒 Où obtenir une API Key Open WebUI ?

### Dans l'interface Open WebUI :
1. **Connectez-vous** à votre Open WebUI
2. **Allez dans Settings** (Paramètres)
3. **Section Account** ou **API Keys**
4. **Cliquez sur "Create New Key"**
5. **Copiez la clé générée** (commence par `owui-`)

### Exemple de clé Open WebUI :
```
owui-1234567890abcdef1234567890abcdef
```

## 🚫 Ce que l'API Key N'EST PAS

### ❌ Pas une clé pour le modèle Technova
```javascript
// INCORRECT - Technova est un modèle local
apiKey: 'cle-pour-technova'  // ← N'existe pas
```

### ❌ Pas une clé OpenAI
```javascript
// INCORRECT - OpenAI est un service externe
apiKey: 'sk-proj-1234567890abcdef'  // ← Pas pour Open WebUI
```

### ❌ Pas une clé pour le chat widget
```javascript
// INCORRECT - Le widget n'a pas sa propre auth
apiKey: 'widget-auth-key'  // ← N'existe pas
```

## 🔄 Flux d'authentification

### Sans API Key :
```
[Chat Widget] → [Open WebUI] → [Modèle Technova]
     ↓              ↓               ↓
   Requête      Accès libre    Traitement
```

### Avec API Key :
```
[Chat Widget] → [Open WebUI] → [Modèle Technova]
     ↓              ↓               ↓
  Requête +     Vérification    Traitement
   API Key       des droits
```

## 🧪 Test de votre configuration

### Code de test :
```javascript
async function testAuthentication() {
  const CONFIG = {
    openWebUIUrl: 'http://localhost:3000',
    apiKey: ''  // Testez d'abord sans
  };
  
  try {
    const response = await fetch(`${CONFIG.openWebUIUrl}/api/models`, {
      headers: {
        'Content-Type': 'application/json',
        ...(CONFIG.apiKey && { 'Authorization': `Bearer ${CONFIG.apiKey}` })
      }
    });
    
    if (response.ok) {
      console.log('✅ Connexion réussie, pas d\'API Key nécessaire');
    } else if (response.status === 401) {
      console.log('🔑 API Key requise');
    } else {
      console.log('❌ Autre erreur:', response.status);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error);
  }
}
```

## 🎯 Recommandation pour votre cas

**Pour votre modèle Technova local :**
```javascript
const TECHNOVA_CONFIG = {
  openWebUIUrl: 'http://localhost:3000',
  apiKey: '',  // ← LAISSEZ VIDE (99% des cas)
  model: 'Technova',
  // ...
};
```

**Cette configuration devrait fonctionner parfaitement** car :
- Votre Open WebUI est local
- Votre modèle Technova est directement accessible
- Pas de couche d'authentification nécessaire

---

## 📝 Résumé

L'`apiKey` est pour **l'authentification avec Open WebUI**, pas pour le modèle Technova lui-même. Dans votre cas local, vous pouvez très probablement la laisser vide et le système fonctionnera parfaitement.
