# 📖 GUIDE COMPLET : WIDGET CHAT DYNAMIQUE

## 🎯 **OBJECTIF RÉALISÉ**

Transformer un widget chat statique en système **100% dynamique** qui s'adapte automatiquement selon le modèle choisi.

---

## 📁 **FICHIERS MODIFIÉS**

### **1. `widget-embed.js`** ← Fichier principal modifié
- **Localisation :** Racine du projet
- **Rôle :** Widget frontend qui s'intègre sur n'importe quel site
- **Modifications :** Interface dynamique + API calls

### **2. `backend/server.js`** ← Déjà prêt (API existante)
- **Rôle :** API backend qui génère les infos dynamiques
- **Route utilisée :** `/api/model-info/:modelName`

---

## 🔧 **ARCHITECTURE DYNAMIQUE**

### **AVANT (Statique) :**
```
┌─────────────────┐
│ widget-embed.js │
├─────────────────┤
│ ❌ HTML codé    │ ← "TechNova Assistant" fixe
│ ❌ Questions    │ ← Questions TechNova fixes  
│ ❌ Système msg  │ ← "Tu es TechNova..." fixe
└─────────────────┘
```

### **APRÈS (Dynamique) :**
```
┌─────────────────┐    API Call    ┌──────────────────┐
│ widget-embed.js │◄──────────────►│ /api/model-info/ │
├─────────────────┤                ├──────────────────┤
│ ✅ HTML généré │ ← Nom dynamique │ ✅ JSON Response │
│ ✅ Questions    │ ← Selon modèle  │ ✅ assistantName │
│ ✅ Système msg  │ ← Message adapté│ ✅ quickQuestions│
└─────────────────┘                │ ✅ systemMessage │
                                   └──────────────────┘
```

---

## 📝 **MODIFICATIONS DÉTAILLÉES**

### **🔄 ÉTAPE 1 : Ajout variable globale**

**Fichier :** `widget-embed.js`  
**Ligne :** 456  
**Code ajouté :**
```javascript
// 📨 Variables globales pour le chat
let isLoading = false;
let messages = [];
let currentModelInfo = null; // ← NOUVEAU: Stocker les infos du modèle
```

**📋 Explication :**
- `currentModelInfo` stocke les données reçues de l'API
- Utilisée dans `sendToAPI()` pour le message système dynamique

---

### **🔄 ÉTAPE 2 : Fonction récupération API**

**Fichier :** `widget-embed.js`  
**Ligne :** 394-424  
**Code ajouté :**
```javascript
// 🔄 Récupération des infos dynamiques du modèle depuis l'API
const getModelInfo = async (modelName) => {
    try {
        console.log(`🔍 Récupération des infos pour le modèle: ${modelName}`);
        
        const response = await fetch(`${config.backendUrl}/api/model-info/${modelName}`);
        
        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }
        
        const modelInfo = await response.json();
        console.log('✅ Infos modèle reçues:', modelInfo);
        
        return modelInfo;
    } catch (error) {
        console.warn('⚠️ Erreur récupération infos modèle:', error);
        
        // Fallback - Configuration par défaut si l'API ne répond pas
        return {
            assistantName: `${config.model.charAt(0).toUpperCase() + config.model.slice(1)} Assistant`,
            description: `Bonjour ! Je suis votre assistant ${config.model}. Comment puis-je vous aider ?`,
            quickQuestions: [
                { icon: '❓', text: 'Que peux-tu faire ?', question: 'Que peux-tu faire comme assistant IA ?' },
                { icon: '💡', text: 'Aide-moi', question: 'Comment peux-tu m\'aider ?' },
                { icon: '🔧', text: 'Tes capacités', question: 'Quelles sont tes principales capacités ?' }
            ]
        };
    }
};
```

**📋 Explication :**
- **Appelle :** `/api/model-info/cyberaide` (ou autre modèle)
- **Reçoit :** JSON avec nom, description, questions, message système
- **Fallback :** Configuration générique si API non disponible
- **Logs :** Pour debugging facile

---

### **🔄 ÉTAPE 3 : Interface dynamique asynchrone**

**Fichier :** `widget-embed.js`  
**Ligne :** 426-490  
**Code modifié :**

```javascript
// 🎨 Création de l'interface de chat DYNAMIQUE
const createChatInterface = async () => {
    const chatDiv = document.createElement('div');
    chatDiv.className = `technova-embed-iframe technova-embed-iframe-${config.position} technova-embed-hidden`;
    
    // 🔄 NOUVEAU : Récupérer les infos dynamiques du modèle
    const modelInfo = await getModelInfo(config.model);
    
    // 💾 NOUVEAU : Stocker les infos pour utilisation dans sendToAPI
    currentModelInfo = modelInfo;
    
    // 🎯 Construction des questions rapides dynamiques
    const quickQuestionsHTML = modelInfo.quickQuestions.map(q => `
        <button class="technova-quick-question" onclick="sendQuickQuestion(this)" data-question="${q.question}">
            ${q.icon} ${q.text}
        </button>
    `).join('');
    
    chatDiv.innerHTML = `
        <div class="technova-chat-header">
            <h3>💬 ${modelInfo.assistantName}</h3>     ← DYNAMIQUE !
            <button class="technova-close-btn">×</button>
        </div>
        
        <div class="technova-chat-body">
            <div class="technova-chat-messages" id="technova-messages">
                <div class="technova-welcome-message">
                    <h4>👋 Bienvenue !</h4>
                    <p>${modelInfo.description}</p>          ← DYNAMIQUE !
                </div>
            </div>
            
            <div class="technova-quick-questions">
                <h4>Questions rapides</h4>
                <div class="technova-questions-grid">
                    ${quickQuestionsHTML}                   ← DYNAMIQUE !
                </div>
            </div>
            
            <!-- ... reste de l'interface ... -->
        </div>
    `;

    return chatDiv;
};
```

**📋 Explication :**
- **Avant :** HTML statique avec valeurs codées en dur
- **Après :** HTML généré avec `${modelInfo.xxx}` dynamique
- **Stockage :** `currentModelInfo = modelInfo` pour usage ultérieur
- **Questions :** `.map()` génère les boutons depuis l'API

---

### **🔄 ÉTAPE 4 : Fonctions asynchrones**

**Fichier :** `widget-embed.js`  
**Lignes :** 360 & 492  
**Code modifié :**

```javascript
// 🏗️ Création du conteneur principal - VERSION DYNAMIQUE ASYNCHRONE
const createWidget = async () => {
    // ... code existant ...
    
    // 2. Crée l'interface de chat DYNAMIQUE (attendre la récupération des infos)
    console.log('🔄 Création de l\'interface dynamique...');
    const chatInterface = await createChatInterface();  // ← await ajouté
    
    // ... reste du code ...
};

// 🚀 Initialisation DYNAMIQUE ASYNCHRONE
const init = async () => {
    // ... vérifications DOM ...
    
    // ⏳ NOUVEAU : Attendre la création complète du widget (avec infos API)
    const widget = await createWidget();  // ← await ajouté
    document.body.appendChild(widget);
    
    console.log('✅ Widget dynamique initialisé avec succès pour le modèle:', config.model);
};
```

**📋 Explication :**
- **Ajout :** `async/await` pour gérer les appels API
- **Séquence :** Attendre l'API avant de créer l'interface
- **Logs :** Confirmation du modèle chargé

---

### **🔄 ÉTAPE 5 : Message système dynamique**

**Fichier :** `widget-embed.js`  
**Ligne :** 663-682  
**Code modifié :**

```javascript
// 🚀 Envoyer à l'API backend
const sendToAPI = async (userMessage) => {
    try {
        console.log('🔗 Envoi vers:', `${config.backendUrl}/api/chat`);
        
        // 🔄 NOUVEAU : Message système dynamique selon le modèle
        const systemMessage = currentModelInfo && currentModelInfo.systemMessage 
            ? currentModelInfo.systemMessage 
            : `Tu es ${config.model}, un assistant IA. Tu peux aider avec diverses tâches et questions. Réponds de manière utile et précise.`;
        
        console.log('🎯 Message système utilisé:', systemMessage.substring(0, 50) + '...');
        
        const response = await fetch(`${config.backendUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: 'system',
                        content: systemMessage  // ← NOUVEAU : Dynamique !
                    },
                    // ... reste des messages ...
                ],
                max_tokens: 1500,
                temperature: 0.7,
                stream: false
            })
        });
        
        // ... traitement réponse ...
    } catch (error) {
        // ... gestion erreurs ...
    }
};
```

**📋 Explication :**
- **Avant :** `'Tu es TechNova Assistant...'` fixe
- **Après :** Utilise `currentModelInfo.systemMessage` de l'API
- **Fallback :** Message générique si pas de systemMessage
- **Logs :** Debug du message système utilisé

---

## 🚀 **FONCTIONNEMENT ÉTAPE PAR ÉTAPE**

### **1. Chargement de la page :**
```javascript
init() // Fonction asynchrone appelée
```

### **2. Création du widget :**
```javascript
const widget = await createWidget()  // Attend la création complète
```

### **3. Création de l'interface :**
```javascript
const chatInterface = await createChatInterface()  // Appel API à l'intérieur
```

### **4. Appel API dynamique :**
```javascript
const modelInfo = await getModelInfo('cyberaide')
// GET /api/model-info/cyberaide
```

### **5. Réponse API :**
```json
{
  "assistantName": "Cyberaide Assistant",
  "description": "Assistant spécialisé cybersécurité...",
  "quickQuestions": [
    {"icon": "🛡️", "text": "Sécurité", "question": "..."},
    {"icon": "🔐", "text": "Attaques", "question": "..."}
  ],
  "systemMessage": "Tu es cyberaide, expert cybersécurité..."
}
```

### **6. Génération HTML :**
```javascript
chatDiv.innerHTML = `<h3>💬 ${modelInfo.assistantName}</h3>`
// Résultat: <h3>💬 Cyberaide Assistant</h3>
```

### **7. Stockage des infos :**
```javascript
currentModelInfo = modelInfo  // Pour usage dans sendToAPI
```

### **8. Envoi de message :**
```javascript
const systemMessage = currentModelInfo.systemMessage
// Utilise: "Tu es cyberaide, expert cybersécurité..."
```

---

## 🔄 **COMMENT CHANGER DE MODÈLE**

### **Configuration actuelle :**
```javascript
// Ligne 9 dans widget-embed.js
model: 'cyberaide',
```

### **Pour changer vers un autre modèle :**
```javascript
// Exemple pour modèle marketing
model: 'marketing',
```

### **Résultat automatique :**
1. **API appelée :** `/api/model-info/marketing`
2. **Interface générée :** "Marketing Assistant"
3. **Questions :** Commerce, vente, produits
4. **Réponses IA :** Contexte marketing

### **Aucune autre modification nécessaire !**

---

## 🔍 **DEBUGGING / TROUBLESHOOTING**

### **Console Logs à vérifier :**
```javascript
🚀 TechNova Widget Embed chargé avec la configuration: {model: "cyberaide"}
🎯 Initialisation du widget dynamique...
🔄 Création de l'interface dynamique...
🔍 Récupération des infos pour le modèle: cyberaide
✅ Infos modèle reçues: {assistantName: "Cyberaide Assistant", ...}
✅ Widget dynamique initialisé avec succès pour le modèle: cyberaide
🎯 Message système utilisé: Tu es cyberaide, un assistant IA spécialisé...
```

### **Erreurs possibles :**
1. **API non disponible :** Fallback activé automatiquement
2. **Modèle inexistant :** Configuration générique utilisée
3. **Cache navigateur :** Faire Ctrl+F5

---

## 📊 **AVANTAGES DU SYSTÈME DYNAMIQUE**

### **✅ Pour le développeur :**
- **1 seul changement** → Tout s'adapte
- **Pas de maintenance** des textes/questions
- **Extensible facilement** → Nouveau modèle = Ajout API

### **✅ Pour le client :**
- **Expérience cohérente** → Interface + IA adaptées
- **Spécialisation** → Chaque modèle a son expertise
- **Professional** → Pas de confusion TechNova/CyberAide

### **✅ Pour l'évolutivité :**
- **Ajouter modèle** → Juste l'ajouter au backend
- **Personnalisation** → Questions/styles par modèle
- **Multi-clients** → Chaque client son modèle

---

## 🎯 **RÉSUMÉ TECHNIQUE**

**Le widget est maintenant 100% dynamique grâce à :**

1. **API Backend** → Fournit les données selon le modèle
2. **Appel asynchrone** → Récupère les infos au chargement  
3. **HTML généré** → Plus de valeurs codées en dur
4. **Message système** → IA répond selon le contexte
5. **Fallback intelligent** → Fonctionne même sans API

**UN CHANGEMENT DE MODÈLE = TOUT S'ADAPTE AUTOMATIQUEMENT !**
