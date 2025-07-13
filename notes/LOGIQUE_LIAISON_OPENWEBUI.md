# 🔗 Logique de liaison entre Open WebUI et le Chat Widget

## 📊 Architecture de communication

```
[Chat Widget] ←→ [Open WebUI API] ←→ [Modèle Technova]
```

## 1. 🔧 Configuration de liaison

### Dans `technova-config.js`
```javascript
const TECHNOVA_CONFIG = {
  openWebUIUrl: 'http://localhost:3000',  // URL de votre Open WebUI
  model: 'Technova',                      // Nom EXACT de votre modèle
  apiKey: '',                             // Clé API (si nécessaire)
  // ... autres paramètres
};
```

### Points de connexion :
1. **URL de base** : `http://localhost:3000` (votre Open WebUI)
2. **Endpoint API** : `/api/chat/completions` (API OpenAI-compatible)
3. **Modèle cible** : `Technova` (votre modèle personnalisé)

## 2. 🚀 Flux de communication

### Étape 1 : Test de connexion
```javascript
// Test initial - vérifie si le modèle existe
GET http://localhost:3000/api/models
```

**Réponse attendue :**
```json
[
  {
    "id": "Technova",
    "name": "Technova",
    "description": "TechNova Assistant...",
    // ... autres propriétés
  }
]
```

### Étape 2 : Envoi de message
```javascript
// Quand l'utilisateur tape un message
POST http://localhost:3000/api/chat/completions
```

**Payload envoyé :**
```json
{
  "model": "Technova",
  "messages": [
    {
      "role": "system",
      "content": "Tu es TechNova Assistant, spécialisé dans..."
    },
    {
      "role": "user",
      "content": "Qu'est-ce que TechNova ?"
    }
  ],
  "max_tokens": 1500,
  "temperature": 0.7,
  "stream": false
}
```

### Étape 3 : Réponse du modèle
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "TechNova est une entreprise créée en 2017..."
      }
    }
  ]
}
```

## 3. 🔧 Code de liaison dans le widget

### Dans `technova-chat-widget.js`
```javascript
async function handleUserMessage() {
  try {
    // 1. Préparer les messages avec historique
    messageHistory.push({ role: 'user', content: message });
    
    // 2. Envoyer à Open WebUI
    const response = await fetch(`${CONFIG.openWebUIUrl}/api/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(CONFIG.apiKey && { 'Authorization': `Bearer ${CONFIG.apiKey}` })
      },
      body: JSON.stringify({
        model: CONFIG.model,        // 'Technova'
        messages: messageHistory,   // Historique complet
        max_tokens: CONFIG.maxTokens,
        temperature: CONFIG.temperature,
        stream: CONFIG.stream
      })
    });
    
    // 3. Traiter la réponse
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // 4. Afficher la réponse
    displayAssistantMessage(aiResponse);
    
  } catch (error) {
    // Gestion d'erreur
    displayAssistantMessage(CONFIG.errorMessages.general);
  }
}
```

## 4. 📝 Gestion de l'historique

### Contexte maintenu
```javascript
let messageHistory = [
  {
    role: 'system',
    content: 'Tu es TechNova Assistant...'  // Instructions système
  },
  {
    role: 'user',
    content: 'Qu\'est-ce que TechNova ?'    // Question utilisateur
  },
  {
    role: 'assistant',
    content: 'TechNova est une entreprise...' // Réponse du modèle
  },
  {
    role: 'user',
    content: 'Quels sont les produits ?'    // Question suivante
  }
  // ... conversation continue
];
```

## 5. 🔍 Détection et validation

### Test de connexion automatique
```javascript
async function testTechnovaConnection() {
  try {
    // 1. Tester la connexion à Open WebUI
    const response = await fetch(`${TECHNOVA_CONFIG.openWebUIUrl}/api/models`);
    
    if (response.ok) {
      const models = await response.json();
      
      // 2. Vérifier que le modèle Technova existe
      const technovaModel = models.find(model => model.id === 'Technova');
      
      if (technovaModel) {
        console.log('✅ Modèle Technova trouvé et accessible');
        return true;
      } else {
        console.error('❌ Modèle Technova non trouvé');
        return false;
      }
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    return false;
  }
}
```

## 6. 🛠️ Points de défaillance possibles

### A. Problèmes de connexion
```javascript
// Erreur : CORS (Cross-Origin Resource Sharing)
// Solution : Configurer CORS dans Open WebUI

// Erreur : 403 Forbidden
// Solution : Vérifier les permissions / ajouter clé API

// Erreur : 404 Not Found
// Solution : Vérifier l'URL Open WebUI
```

### B. Problèmes de modèle
```javascript
// Erreur : Modèle non trouvé
// Solution : Vérifier le nom exact 'Technova'

// Erreur : Modèle inactif
// Solution : Activer le modèle dans Open WebUI
```

## 7. 🔐 Sécurité et authentification

### Sans authentification (développement)
```javascript
const CONFIG = {
  openWebUIUrl: 'http://localhost:3000',
  apiKey: '',  // Laissez vide
  // ...
};
```

### Avec authentification (production)
```javascript
const CONFIG = {
  openWebUIUrl: 'https://your-openwebui.com',
  apiKey: 'your-api-key-here',  // Clé API requise
  // ...
};

// Headers avec authentification
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${CONFIG.apiKey}`
}
```

## 8. 🔄 Flux complet en action

```
1. [User] Écrit "Qu'est-ce que TechNova ?"
   ↓
2. [Widget] Ajoute le message à l'historique
   ↓
3. [Widget] Envoie POST à localhost:3000/api/chat/completions
   ↓
4. [OpenWebUI] Reçoit la requête
   ↓
5. [OpenWebUI] Charge le modèle 'Technova'
   ↓
6. [Modèle Technova] Traite la requête avec son contexte
   ↓
7. [Modèle Technova] Génère une réponse basée sur sa formation
   ↓
8. [OpenWebUI] Retourne la réponse via API
   ↓
9. [Widget] Affiche la réponse à l'utilisateur
```

## 9. 📊 Monitoring et debug

### Logs côté widget
```javascript
console.log('🔧 Configuration:', CONFIG);
console.log('📤 Envoi requête:', payload);
console.log('📥 Réponse reçue:', response);
```

### Logs côté Open WebUI
- Console Open WebUI pour voir les requêtes
- Logs du modèle Technova
- Métriques de performance

## 10. 🚀 Optimisations possibles

### Performance
```javascript
// Streaming pour réponses en temps réel
stream: true,

// Mise en cache des réponses fréquentes
const responseCache = new Map();

// Compression des requêtes
headers: {
  'Content-Encoding': 'gzip'
}
```

### Fiabilité
```javascript
// Retry automatique en cas d'erreur
const maxRetries = 3;
let retryCount = 0;

// Timeout configuré
timeout: 45000,  // 45 secondes

// Validation des réponses
if (data.choices && data.choices[0]) {
  // Réponse valide
}
```

---

## 🎯 Résumé de la liaison

Le chat widget TechNova utilise l'API OpenAI-compatible d'Open WebUI pour communiquer directement avec votre modèle Technova :

1. **Configuration** : URL + nom du modèle exact
2. **Communication** : HTTP POST vers `/api/chat/completions`
3. **Payload** : Messages + paramètres du modèle
4. **Réponse** : Traitement par le modèle Technova
5. **Affichage** : Réponse formatée dans l'interface TechNova

Cette architecture permet une intégration native et transparente entre votre modèle personnalisé et l'interface utilisateur du chat widget.
