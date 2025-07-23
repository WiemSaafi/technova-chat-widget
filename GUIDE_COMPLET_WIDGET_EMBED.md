# 🎯 GUIDE COMPLET DU WIDGET EMBED TECHNOVA 
## 🔥 Guide Professionnel pour Débutants - Widget, OpenWebUI & Coolify

---

## 🚀 INTRODUCTION

Le **TechNova Chat Widget** est un widget de chat intelligent qui s'intègre facilement sur n'importe quel site web, comme Tawk.to ou Intercom. Il se connecte à **OpenWebUI** et peut être déployé avec **Coolify**.

---

## 📋 TABLE DES MATIÈRES

1. [🎨 FONCTIONNALITÉS VISUELLES](#-fonctionnalités-visuelles)
2. [⚙️ CONFIGURATION AVANCÉE](#️-configuration-avancée)
3. [🔧 FONCTIONS TECHNIQUES](#-fonctions-techniques)
4. [🎯 INTÉGRATION](#-intégration)
5. [📊 FONCTIONNALITÉS INTELLIGENTES](#-fonctionnalités-intelligentes)
6. [🛠️ DÉVELOPPEMENT AVANCÉ](#️-développement-avancé)

---

## 🎨 FONCTIONNALITÉS VISUELLES

### 1. **THÈMES DISPONIBLES** (9 choix)

Le widget propose **9 thèmes différents** pour s'adapter à votre site :

```javascript
// Thèmes disponibles :
blue     → Bleu professionnel (défaut)
green    → Vert nature
purple   → Violet créatif
orange   → Orange énergique
red      → Rouge dynamique
pink     → Rose moderne
yellow   → Jaune chaleureux
dark     → Sombre élégant
teal     → Turquoise tech
```

**Comment utiliser :**
```html
<!-- Via attribut data-* -->
<script src="widget-embed.js" data-theme="purple"></script>

<!-- Via configuration JS -->
<script>
window.TechnovaConfig = { theme: 'dark' };
</script>
<script src="widget-embed.js"></script>
```

### 2. **POSITIONS FLEXIBLES** (4 emplacements)

```javascript
// Positions disponibles :
bottom-right → Coin bas-droit (défaut)
bottom-left  → Coin bas-gauche
top-right    → Coin haut-droit
top-left     → Coin haut-gauche
```

### 3. **INTERFACE RESPONSIVE**

- **Desktop** : Fenêtre de chat 400x600px
- **Mobile** : Plein écran automatique
- **Animations fluides** : Hover, ouverture, loading

---

## ⚙️ CONFIGURATION AVANCÉE

### 1. **MÉTHODES DE CONFIGURATION** (3 niveaux de priorité)

```javascript
// NIVEAU 1 (Priorité MAX): Attributs data-*
<script src="widget-embed.js" 
        data-model="webfrontaide"
        data-url="https://votre-api.com"
        data-theme="blue"
        data-position="bottom-right"
        data-language="fr"
        data-auto-open="true"
        data-welcome="true">
</script>

// NIVEAU 2: Configuration JavaScript
<script>
window.TechnovaConfig = {
    model: 'technova',
    backendUrl: 'https://api.example.com',
    theme: 'green',
    autoOpen: false
};
</script>

// NIVEAU 3: Configuration par défaut (automatique)
```

### 2. **PARAMÈTRES DISPONIBLES**

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `model` | string | 'webfrontaide' | Nom du modèle IA |
| `backendUrl` | string | URL par défaut | URL de votre API OpenWebUI |
| `theme` | string | 'blue' | Thème visuel (9 choix) |
| `position` | string | 'bottom-right' | Position du widget |
| `language` | string | 'fr' | Langue de l'interface |
| `autoOpen` | boolean | false | Ouverture automatique |
| `showWelcome` | boolean | true | Affichage du message de bienvenue |

---

## 🔧 FONCTIONS TECHNIQUES

### 1. **INITIALISATION DYNAMIQUE**

```javascript
// Le widget récupère automatiquement les infos du modèle
const getModelInfo = async (modelName) => {
    // Appel API : /api/model-info/{modelName}
    // Récupère : nom, description, questions rapides, message système
}
```

### 2. **GESTION DES MESSAGES**

```javascript
// Variables globales
let isLoading = false;        // État du chargement
let messages = [];           // Historique des conversations
let currentModelInfo = null; // Infos du modèle actuel

// Fonctions principales
sendMessage()          // Envoie un message utilisateur
sendQuickQuestion()    // Envoie une question rapide prédéfinie
addMessage()          // Ajoute un message à l'interface
showLoading()         // Affiche l'animation de chargement
hideLoading()         // Masque l'animation
sendToAPI()           // Communication avec l'API backend
```

### 3. **COMMUNICATION API**

```javascript
// Endpoint utilisé : /api/chat
// Méthode : POST
// Payload :
{
    model: "nom_du_modele",
    messages: [
        { role: "system", content: "Message système dynamique" },
        { role: "user", content: "Question utilisateur" }
    ],
    max_tokens: 1500,
    temperature: 0.7,
    stream: false
}
```

---

## 🎯 INTÉGRATION

### 1. **INTÉGRATION SIMPLE** (1 ligne)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mon Site</title>
</head>
<body>
    <!-- Votre contenu -->
    
    <!-- WIDGET TECHNOVA - 1 ligne suffit ! -->
    <script src="https://votre-domaine.com/widget-embed.js"></script>
</body>
</html>
```

### 2. **INTÉGRATION WORDPRESS**

```php
// Dans functions.php
function add_technova_widget() {
    ?>
    <script src="https://votre-domaine.com/widget-embed.js" 
            data-model="webfrontaide"
            data-theme="blue">
    </script>
    <?php
}
add_action('wp_footer', 'add_technova_widget');
```

### 3. **INTÉGRATION AVANCÉE**

```html
<script>
// Configuration personnalisée
window.TechnovaConfig = {
    model: 'mon-assistant-custom',
    backendUrl: 'https://mon-openwebui.coolify.app',
    theme: 'dark',
    position: 'bottom-left',
    autoOpen: true,
    showWelcome: true
};
</script>
<script src="widget-embed.js"></script>
```

---

## 📊 FONCTIONNALITÉS INTELLIGENTES

### 1. **QUESTIONS RAPIDES DYNAMIQUES**

Le widget récupère automatiquement des questions prédéfinies selon le modèle :

```javascript
// Exemple de questions rapides
{
    icon: '❓', 
    text: 'Que peux-tu faire ?', 
    question: 'Que peux-tu faire comme assistant IA ?'
},
{
    icon: '💡', 
    text: 'Aide-moi', 
    question: 'Comment peux-tu m\'aider ?'
}
```

### 2. **MESSAGE SYSTÈME ADAPTATIF**

```javascript
// Le message système change selon le modèle
const systemMessage = currentModelInfo.systemMessage || 
    `Tu es ${config.model}, un assistant IA. Tu peux aider avec diverses tâches...`;
```

### 3. **GESTION DE L'HISTORIQUE**

```javascript
// Garde seulement les 6 derniers messages pour optimiser
...messages.slice(-6)
```

### 4. **FALLBACK AUTOMATIQUE**

Si l'API ne répond pas, le widget utilise une configuration par défaut :

```javascript
// Configuration de secours
return {
    assistantName: `${config.model} Assistant`,
    description: `Bonjour ! Je suis votre assistant ${config.model}...`,
    quickQuestions: [/* questions par défaut */]
};
```

---

## 🛠️ DÉVELOPPEMENT AVANCÉ

### 1. **API DE CONTRÔLE**

```javascript
// Contrôle programmatique du widget
window.TechnovaWidget = {
    open: () => { /* Ouvre le chat */ },
    close: () => { /* Ferme le chat */ },
    toggle: () => { /* Bascule ouvert/fermé */ },
    setModel: (modelName) => { /* Change le modèle */ }
};

// Utilisation :
TechnovaWidget.open();
TechnovaWidget.setModel('nouveau-modele');
```

### 2. **ÉVÉNEMENTS & ANALYTICS**

```javascript
// Intégration Google Analytics
if (window.gtag) {
    window.gtag('event', 'chat_opened', {
        event_category: 'engagement',
        event_label: 'technova_widget'
    });
}
```

### 3. **STYLES CSS PERSONNALISABLES**

```css
/* Personnalisation avancée */
.technova-embed-bubble {
    /* Modifiez l'apparence du bouton */
}

.technova-chat-header {
    /* Personnalisez l'en-tête */
}

.technova-message-content {
    /* Stylisez les messages */
}
```

### 4. **SÉCURITÉ & OPTIMISATION**

```javascript
// Vérifications de sécurité
- Validation des entrées (maxlength="500")
- Échappement des caractères spéciaux
- Limitation des requêtes (isLoading)
- Z-index élevé (2147483647) pour éviter les conflits

// Optimisations
- Chargement asynchrone
- Gestion d'erreurs robuste
- Interface responsive
- Animations CSS performantes
```

---

## 🔗 INTÉGRATION AVEC OPENWEBUI & COOLIFY

### 1. **AVEC OPENWEBUI**

```javascript
// Configuration pour OpenWebUI
window.TechnovaConfig = {
    backendUrl: 'https://votre-openwebui-instance.com',
    model: 'llama3:8b',  // Nom de votre modèle dans OpenWebUI
};
```

### 2. **AVEC COOLIFY**

```bash
# Déploiement du backend avec Coolify
1. Créer une nouvelle application
2. Connecter votre repo GitHub
3. Configurer les variables d'environnement :
   - OPENWEBUI_URL=https://votre-openwebui.com
   - OPENWEBUI_API_KEY=votre_clé_api
4. Déployer automatiquement
```

### 3. **CONFIGURATION PRODUCTION**

```javascript
// Production-ready setup
window.TechnovaConfig = {
    backendUrl: 'https://widget-api.votre-domaine.coolify.app',
    model: 'votre-modele-produit',
    theme: 'blue',
    position: 'bottom-right',
    showWelcome: true,
    autoOpen: false
};
```

---

## 🎉 RÉSUMÉ DES FONCTIONNALITÉS

✅ **9 thèmes visuels** différents  
✅ **4 positions** d'affichage  
✅ **Configuration triple niveau** (data-*, JS, défaut)  
✅ **Interface responsive** desktop/mobile  
✅ **Questions rapides dynamiques**  
✅ **Messages système adaptatifs**  
✅ **Gestion d'historique intelligente**  
✅ **API de contrôle programmatique**  
✅ **Intégration facile** (1 ligne de code)  
✅ **Compatible OpenWebUI & Coolify**  
✅ **Fallback automatique** en cas d'erreur  
✅ **Animations fluides** et loading  
✅ **Support multi-langues**  
✅ **Analytics intégré**  
✅ **Sécurisé et optimisé**  

---

## 📞 SUPPORT

Ce widget est conçu pour être **simple à utiliser** mais **puissant en fonctionnalités**. Il s'intègre parfaitement avec :

- 🤖 **OpenWebUI** (pour l'IA)
- 🚀 **Coolify** (pour le déploiement)  
- 🌐 **Tout site web** (HTML, WordPress, React, etc.)

**Votre assistant IA personnel, intégrable en 1 ligne de code !** 🎯
