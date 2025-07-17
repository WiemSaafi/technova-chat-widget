# 🚀 Guide de Déploiement sur Coolify

## 📋 Étapes de Déploiement

### ÉTAPE 1 : Préparer les fichiers
```bash
# Fichiers essentiels à déployer :
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
├── widget-embed.js
├── technova-chat-widget-production.js
├── technova-config-production.js
└── demo-technova-production.html (pour test)
```

### ÉTAPE 2 : Configurer les variables d'environnement sur Coolify
```env
OPENWEBUI_API_KEY=sk-votre-vraie-cle-api
OPENWEBUI_URL=https://votre-openwebui.com
FRONTEND_URL=https://site-client-wordpress.com
NODE_ENV=production
PORT=3001
```

### ÉTAPE 3 : Déployer sur Coolify
1. Connecter votre repo GitHub à Coolify
2. Créer une nouvelle application
3. Configurer les variables d'environnement
4. Déployer

### ÉTAPE 4 : Récupérer l'URL de déploiement
Exemple : `https://technova-widget-abc123.coolify.app`

### ÉTAPE 5 : Tester les endpoints
- `https://technova-widget-abc123.coolify.app/health` ✅
- `https://technova-widget-abc123.coolify.app/widget-embed.js` ✅
- `https://technova-widget-abc123.coolify.app/widget-chat` ✅

### ÉTAPE 6 : Créer le code final client
Remplacez dans `code-client-final.txt` :
```html
<script src="https://technova-widget-abc123.coolify.app/widget-embed.js"></script>
```

### ÉTAPE 7 : Envoyer au client
- Le fichier `code-client-final.txt` 
- Le fichier `client-integration-code.html` (guide complet)

## ✅ Checklist Final

- [ ] Backend déployé sur Coolify
- [ ] Variables d'environnement configurées
- [ ] Endpoints testés et fonctionnels
- [ ] Code client personnalisé avec la bonne URL
- [ ] Guide client préparé
- [ ] Test sur site WordPress de démo

## 🎯 Résultat Final

Le client recevra :
```html
<script src="https://VOTRE-URL-COOLIFY.app/widget-embed.js"></script>
```

Et c'est tout ! Le chat widget apparaîtra automatiquement sur son site WordPress.

## 🔧 Dépannage

Si le widget ne fonctionne pas :
1. Vérifier les logs Coolify
2. Tester les endpoints individuellement
3. Vérifier les variables d'environnement
4. Tester sur un site WordPress de démo

## 📊 Avantages de cette Solution

- ✅ **Ultra-simple** : 1 ligne de code pour le client
- ✅ **Sécurisé** : Clé API cachée sur le backend
- ✅ **Professionnel** : Comme Tawk.to ou Intercom
- ✅ **Maintenance zéro** : Tout est automatisé
- ✅ **Responsive** : Fonctionne sur mobile et desktop
