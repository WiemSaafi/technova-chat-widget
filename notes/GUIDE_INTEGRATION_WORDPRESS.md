# 🔧 Guide d'Intégration WordPress - TechNova Chat Widget

## 🎯 Objectif
Créer un système d'intégration simple comme Tawk.to pour permettre à vos clients d'intégrer facilement le chat widget TechNova dans leurs sites WordPress.

## 📋 Code Client Simple

### **Code d'Intégration Standard**
```html
<!-- Code d'intégration TechNova Chat Widget -->
<script>
window.TechnovaConfig = {
    backendUrl: 'https://votre-backend.herokuapp.com',
    model: 'technova',
    theme: 'blue',
    position: 'bottom-right',
    language: 'fr'
};
</script>
<script src="https://votre-backend.herokuapp.com/widget-embed.js"></script>
```

### **Code avec Options Avancées**
```html
<!-- Code d'intégration TechNova Chat Widget - Configuration Avancée -->
<script>
window.TechnovaConfig = {
    backendUrl: 'https://votre-backend.herokuapp.com',
    model: 'technova',
    theme: 'blue',               // blue, green, purple, orange
    position: 'bottom-right',    // bottom-right, bottom-left, top-right, top-left
    language: 'fr',              // fr, en, es, de
    autoOpen: false,             // true pour ouverture automatique
    showWelcome: true            // true pour notification de bienvenue
};
</script>
<script src="https://votre-backend.herokuapp.com/widget-embed.js"></script>
```

## 🏗️ Architecture du Système

### **Fichiers Créés**
- `widget-embed.js` - Système d'intégration universel
- `wordpress-integration.html` - Exemple d'intégration WordPress
- `client-code-snippet.html` - Code snippet pour vos clients
- Routes backend `/widget-embed.js` et `/widget-chat`

### **Fonctionnalités Incluses**
- ✅ **Intégration Simple** : Un seul code à copier-coller
- ✅ **Thèmes Personnalisables** : 4 thèmes de couleur
- ✅ **Positionnement Flexible** : 4 positions disponibles
- ✅ **Responsive Design** : S'adapte à tous les écrans
- ✅ **Système Dynamique** : Interface s'adapte au modèle IA
- ✅ **Sécurité Maximum** : Aucune clé API exposée
- ✅ **Contrôle Programmatique** : API JavaScript pour contrôler le widget

## 📝 Instructions d'Installation Client

### **Étape 1 : Accéder au Dashboard WordPress**
- Connexion à l'administration WordPress
- Aller dans **Apparence > Éditeur de thème** ou utiliser un plugin comme **Insert Headers and Footers**

### **Étape 2 : Insérer le Code**
- Coller le code juste avant `</body>` ou dans la section "Footer"
- Remplacer `https://votre-backend.herokuapp.com` par votre URL backend

### **Étape 3 : Configurer le Widget**
- Choisir le modèle IA : `technova`, `gpt-4`, `claude`, etc.
- Sélectionner le thème : `blue`, `green`, `purple`, `orange`
- Définir la position : `bottom-right`, `bottom-left`, `top-right`, `top-left`

### **Étape 4 : Tester le Widget**
- Visiter le site et vérifier l'apparition du widget
- Cliquer pour tester le chat
- Vérifier que les réponses correspondent au modèle choisi

## 🛠️ Contrôle Programmatique

### **API JavaScript Disponible**
```javascript
// Ouvrir le chat
TechnovaWidget.open();

// Fermer le chat
TechnovaWidget.close();

// Basculer l'état du chat
TechnovaWidget.toggle();

// Changer de modèle
TechnovaWidget.setModel('gpt-4');
```

### **Exemples d'Utilisation**
```javascript
// Ouvrir automatiquement le chat après 5 secondes
setTimeout(() => {
    TechnovaWidget.open();
}, 5000);

// Changer de modèle selon la page
if (window.location.pathname.includes('/support')) {
    TechnovaWidget.setModel('technova');
} else {
    TechnovaWidget.setModel('gpt-4');
}
```

## 🎨 Options de Personnalisation

### **Thèmes Disponibles**
- **Blue** : Thème par défaut TechNova (bleu)
- **Green** : Thème vert pour secteur écologique
- **Purple** : Thème violet pour secteur créatif
- **Orange** : Thème orange pour secteur énergétique

### **Positions Disponibles**
- **bottom-right** : Bas droite (par défaut)
- **bottom-left** : Bas gauche
- **top-right** : Haut droite
- **top-left** : Haut gauche

### **Langues Supportées**
- **fr** : Français (par défaut)
- **en** : Anglais
- **es** : Espagnol
- **de** : Allemand

## 🔐 Sécurité et Performance

### **Sécurité**
- ✅ Aucune clé API exposée côté client
- ✅ Toutes les requêtes passent par votre backend sécurisé
- ✅ Protection contre les attaques XSS
- ✅ Sécurité iframe avec X-Frame-Options

### **Performance**
- ✅ Chargement asynchrone
- ✅ Cache optimisé (1 heure)
- ✅ Taille minimale du code
- ✅ Pas d'impact sur la vitesse du site

## 📊 Analytics et Tracking

### **Support Google Analytics**
```javascript
// Le widget envoie automatiquement des événements
// Exemple : chat_opened, message_sent, model_changed
```

### **Événements Trackés**
- Ouverture du chat
- Envoi de messages
- Changement de modèle
- Fermeture du chat

## 🚀 Déploiement Production

### **Prérequis**
1. Backend déployé sur Heroku/Vercel
2. Variables d'environnement configurées
3. OpenWebUI accessible

### **Étapes de Déploiement**
1. Déployer le backend avec toutes les routes
2. Configurer les variables d'environnement
3. Tester tous les endpoints
4. Distribuer le code client

### **URLs de Production**
- Backend : `https://votre-backend.herokuapp.com`
- Widget Embed : `https://votre-backend.herokuapp.com/widget-embed.js`
- Widget Chat : `https://votre-backend.herokuapp.com/widget-chat`

## 💡 Avantages pour vos Clients

1. **Simplicité** : Un seul code à copier-coller
2. **Flexibilité** : Nombreuses options de personnalisation
3. **Sécurité** : Système sécurisé professionnel
4. **Performance** : Aucun impact sur la vitesse
5. **Support** : Documentation complète fournie

## 🔧 Maintenance et Support

### **Fichiers à Maintenir**
- `widget-embed.js` - Code d'intégration principal
- `backend/server.js` - Routes backend
- Documentation client

### **Support Client**
- Fournir `client-code-snippet.html` à vos clients
- Documenter les options disponibles
- Offrir support technique si nécessaire

Le système est maintenant prêt pour la production et l'intégration client !
