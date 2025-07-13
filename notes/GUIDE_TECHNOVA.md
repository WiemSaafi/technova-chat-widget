# 🚀 Guide d'utilisation du modèle Technova avec le Chat Widget

Ce guide vous explique étape par étape comment utiliser votre modèle personnalisé "Technova" avec le chat widget.

## 📋 Prérequis

- ✅ Open WebUI installé et fonctionnel
- ✅ Modèle Technova créé et configuré dans Open WebUI
- ✅ Serveur Open WebUI en cours d'exécution

## 🔧 Configuration étape par étape

### Étape 1: Vérifier votre modèle Technova

1. **Ouvrez Open WebUI** dans votre navigateur
2. **Allez dans la section "Models"** (Modèles)
3. **Vérifiez que votre modèle "Technova" est présent et actif**
4. **Notez l'URL exacte** de votre Open WebUI (ex: `http://localhost:3000`)

### Étape 2: Configurer la connexion

1. **Ouvrez le fichier `technova-config.js`**
2. **Modifiez les paramètres suivants :**

```javascript
const TECHNOVA_CONFIG = {
  // 🔗 URL de votre instance Open WebUI
  openWebUIUrl: 'http://localhost:3000', // ⚠️ MODIFIEZ cette URL
  
  // 🔐 Clé API (si votre Open WebUI nécessite une authentification)
  apiKey: '', // Laissez vide si pas d'auth
  
  // 🤖 Nom EXACT de votre modèle dans Open WebUI
  model: 'technova', // ⚠️ Vérifiez que ce nom correspond
  
  // ... autres paramètres
};
```

### Étape 3: Tester la configuration

1. **Ouvrez `demo-technova.html`** dans votre navigateur
2. **Vérifiez l'indicateur de statut** en haut à droite
3. **Ouvrez la console du navigateur** (F12) pour voir les logs
4. **Recherchez ces messages :**
   - ✅ `TechNova Chat Widget initialisé`
   - ✅ `Modèle Technova trouvé et accessible`

### Étape 4: Utiliser le chat widget

1. **Cliquez sur le bouton "Ouvrir le Chat Assistant"**
2. **Le widget s'ouvre avec :**
   - Message de bienvenue personnalisé TechNova
   - Questions rapides prédéfinies
   - Interface aux couleurs TechNova
3. **Testez avec les questions rapides :**
   - "Qu'est-ce que TechNova ?"
   - "Quels sont les produits TechNova ?"
   - "Comment contacter TechNova ?"

## 📁 Structure des fichiers

```
votre-projet/
├── technova-config.js          # Configuration du modèle Technova
├── technova-chat-widget.js     # Widget de chat personnalisé
├── demo-technova.html          # Page de démonstration
└── GUIDE_TECHNOVA.md          # Ce guide
```

## 🛠️ Personnalisation avancée

### Modifier le message système

Dans `technova-config.js`, personnalisez le `systemMessage` :

```javascript
systemMessage: `Tu es TechNova Assistant, un assistant intelligent spécialisé...

INSTRUCTIONS IMPORTANTES :
1. Base toujours tes réponses sur la base de connaissances TechNova
2. Réponds de manière précise et cohérente
3. Aide avec l'onboarding des nouveaux employés
4. Fournis des informations métier sur les produits Nova
5. Représente fidèlement la culture TechNova
6. Si une question dépasse tes connaissances, indique-le poliment
`
```

### Ajouter des questions prédéfinies

Dans `technova-config.js`, ajoutez des questions dans `predefinedQuestions` :

```javascript
predefinedQuestions: [
  {
    question: "Nouvelle question",
    answer: "Réponse personnalisée"
  },
  // ... autres questions
]
```

### Personnaliser l'apparence

Dans `technova-chat-widget.js`, modifiez les couleurs et styles :

```javascript
// Couleurs principales
#technova-chat-bubble {
  background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
}

// Messages utilisateur
.technova-message-user {
  background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
}

// Messages assistant
.technova-message-assistant {
  background: #F3F4F6;
  border-left: 4px solid #3B82F6;
}
```

## 🔍 Dépannage

### Problème : Modèle non trouvé

**Erreur :** `❌ Modèle Technova non trouvé`

**Solutions :**
1. Vérifiez que le nom du modèle dans `technova-config.js` correspond exactement à celui dans Open WebUI
2. Assurez-vous que votre modèle est activé dans Open WebUI
3. Vérifiez que Open WebUI est en cours d'exécution

### Problème : Connexion impossible

**Erreur :** `❌ Impossible de se connecter à Open WebUI`

**Solutions :**
1. Vérifiez que l'URL dans `technova-config.js` est correcte
2. Assurez-vous que Open WebUI est démarré
3. Vérifiez les problèmes de CORS si nécessaire

### Problème : Erreur d'authentification

**Erreur :** `401 Unauthorized`

**Solutions :**
1. Ajoutez votre clé API dans `apiKey` si requise
2. Vérifiez les permissions de votre clé API
3. Contactez votre administrateur Open WebUI

## 📊 Monitoring et logs

### Console du navigateur

Ouvrez la console (F12) pour voir :
- ✅ État de la connexion
- 🔧 Configuration chargée
- 📝 Logs des requêtes
- ❌ Erreurs détaillées

### Logs utiles

```javascript
// Initialisation
console.log('✅ TechNova Chat Widget initialisé');

// Test de connexion
console.log('✅ Modèle Technova trouvé et accessible');

// Configuration
console.log('🔧 Configuration:', CONFIG);
```

## 🚀 Intégration dans votre site

### Intégration simple

Ajoutez ces lignes dans votre page HTML :

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mon site avec TechNova</title>
</head>
<body>
    <!-- Votre contenu -->
    
    <!-- Widget TechNova -->
    <script src="technova-config.js"></script>
    <script src="technova-chat-widget.js"></script>
</body>
</html>
```

### Intégration avec conditions

```html
<script>
// Charger le widget seulement si le modèle est disponible
if (window.TECHNOVA_CONFIG) {
    const script = document.createElement('script');
    script.src = 'technova-chat-widget.js';
    document.head.appendChild(script);
}
</script>
```

## 📈 Optimisations

### Performance

1. **Mise en cache :** Configurez la mise en cache des fichiers JS
2. **Compression :** Minifiez les fichiers pour la production
3. **Lazy loading :** Chargez le widget seulement quand nécessaire

### Sécurité

1. **HTTPS :** Utilisez HTTPS pour Open WebUI en production
2. **Validation :** Validez les entrées utilisateur
3. **Rate limiting :** Limitez le nombre de requêtes

## 🎯 Cas d'usage avancés

### A. Support client automatisé

```javascript
// Dans technova-config.js
systemMessage: `Tu es un agent de support TechNova.
Priorité aux questions sur :
- Problèmes techniques avec NovaCRM
- Procédures de facturation
- Statut des commandes
- Escalade vers un humain si nécessaire`
```

### B. Onboarding employés

```javascript
// Questions spécifiques nouveaux employés
predefinedQuestions: [
  {
    question: "Comment accéder à NovaCRM ?",
    answer: "Connectez-vous sur crm.technova.com avec vos identifiants..."
  },
  {
    question: "Qui contacter pour l'IT ?",
    answer: "Contactez l'équipe IT à it@technova.com ou via Slack #it-support"
  }
]
```

### C. FAQ produits

```javascript
// Questions produits détaillées
predefinedQuestions: [
  {
    question: "Différence entre NovaCRM et NovaDesk ?",
    answer: "NovaCRM gère la relation client, NovaDesk gère le support technique..."
  }
]
```

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez ce guide** pour les solutions communes
2. **Consultez les logs** de la console navigateur
3. **Testez la connexion** avec Open WebUI directement
4. **Vérifiez la configuration** du modèle Technova

---

**✨ Félicitations ! Votre assistant TechNova est maintenant opérationnel !**

Votre modèle personnalisé Technova est maintenant intégré dans un chat widget professionnel, prêt à assister vos utilisateurs avec les connaissances spécifiques de votre entreprise.
