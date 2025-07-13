# 🔧 Guide de Diagnostic - TechNova Assistant Fixed

## Problèmes identifiés et solutions

### ❌ Erreur 403 "Not authenticated"

**Cause :** Problème d'authentification avec l'API Open WebUI

**Solutions à essayer :**

1. **Vérifier l'API Key**
   ```javascript
   // Dans technova-config.js
   apiKey: 'votre-vrai-jwt-token'
   ```

2. **Formats d'authentification à tester**
   - `Bearer votre-token`
   - `votre-token` (sans Bearer)
   - Token de session vs API key

3. **Obtenir le bon token**
   ```bash
   # Méthode 1: Récupérer depuis les cookies du navigateur
   # - Ouvrir Open WebUI dans le navigateur
   # - F12 > Application > Cookies
   # - Chercher 'token' ou 'auth'
   
   # Méthode 2: Depuis la console du navigateur dans Open WebUI
   console.log(localStorage.getItem('token'))
   ```

### ⚙️ Configuration par défaut

Le système crée maintenant automatiquement une configuration par défaut si `TECHNOVA_CONFIG` n'est pas trouvée :

```javascript
window.TECHNOVA_CONFIG = {
    openWebUIUrl: 'http://localhost:3000',
    model: 'technova',
    apiKey: ' ',
    maxTokens: 1500,
    temperature: 0.7
};
```

### 🧪 Tests de diagnostic disponibles

1. **Test Connexion** - Vérifie l'accès à Open WebUI
2. **Liste Modèles** - Affiche les modèles disponibles
3. **Test Auth** - Teste l'authentification
4. **Clear Logs** - Efface les logs de diagnostic

### 📊 Interprétation des logs

- `✅ Open WebUI accessible` - Le serveur répond
- `📊 Statut test: 403` - Problème d'authentification
- `🔐 Erreur d'authentification` - Token invalide/expiré
- `❌ Modèle technova non trouvé` - Le modèle n'existe pas

### 🔄 Étapes de résolution

1. **Vérifier que Open WebUI fonctionne**
   - Ouvrir http://localhost:3000 dans le navigateur
   - Se connecter manuellement

2. **Récupérer le bon token**
   - F12 > Console
   - `localStorage.getItem('token')`
   - Copier la valeur dans technova-config.js

3. **Vérifier que le modèle 'technova' existe**
   - Dans Open WebUI > Models
   - Chercher le modèle nommé exactement 'technova'

4. **Tester avec les outils de diagnostic**
   - Utiliser les boutons de test dans la page
   - Consulter les logs détaillés

### 🛠️ Modifications apportées

1. **Configuration unifiée** - Plus d'incohérence model/modelName
2. **Fallback config** - Configuration par défaut automatique
3. **Tests d'auth multiples** - Teste différents formats de token
4. **Logs détaillés** - Plus d'informations pour le debugging
5. **Test d'endpoint public** - Vérifie d'abord /api/version

### 🚀 Prochaines étapes

Si les problèmes persistent :
1. Vérifier la version d'Open WebUI
2. Consulter les logs du serveur Open WebUI
3. Tester avec un modèle différent (ex: 'gpt-3.5-turbo')
4. Utiliser un token de session plutôt qu'une API key
