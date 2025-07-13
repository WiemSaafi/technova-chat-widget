# 🔐 Solution: Erreur 403 Authentication dans TechNova Chat Widget

## 🚨 Problème identifié

L'erreur `403 Forbidden` dans le fichier `technova-chat-widget-fixed.js` est causée par un **token JWT expiré** dans la configuration.

```
GET http://localhost:3000/api/models 403 (Forbidden)
❌ Erreur test connexion: 403 {"detail":"Not authenticated"}
🔐 Problème d'authentification - vérifiez votre API key
```

## ✅ Solution implémentée

### 1. Détection automatique d'erreur 403
Le widget détecte maintenant automatiquement les erreurs 403 et affiche:
- Une alerte visuelle avec instructions
- Un message d'erreur clair dans le chat
- Des logs détaillés pour le debugging

### 2. Alerte visuelle intégrée
Quand un token expire, une alerte rouge apparaît automatiquement avec:
- Instructions étape par étape
- Auto-fermeture après 15 secondes
- Bouton de fermeture manuel

### 3. Gestion d'erreur améliorée
Le code gère maintenant spécifiquement les erreurs 403:
```javascript
if (response.status === 403) {
  console.error('🔐 Token d\'authentification expiré');
  showTokenExpiredAlert();
  displayAssistantMessage(CONFIG.errorMessages.authError);
  return;
}
```

## 🔧 Comment résoudre l'erreur 403

### Étape 1: Ouvrir OpenWebUI
1. Allez sur `http://localhost:3000` dans votre navigateur
2. Connectez-vous si nécessaire

### Étape 2: Récupérer le nouveau token
1. Ouvrez les outils de développeur (F12)
2. Allez dans la console
3. Tapez: `localStorage.getItem('token')`
4. Copiez le token généré (entre guillemets)

### Étape 3: Mettre à jour la configuration
1. Ouvrez le fichier `technova-config.js`
2. Remplacez la valeur `apiKey` par le nouveau token:
```javascript
apiKey: 'VOTRE_NOUVEAU_TOKEN_JWT_ICI',
```

### Étape 4: Tester la connexion
1. Rechargez la page `demo-technova-fixed.html`
2. Utilisez le bouton "Test Connexion" pour vérifier
3. Le statut devrait passer à "✅ Connexion OK"

## 🎯 Fichiers modifiés

### `technova-chat-widget-fixed.js`
- ✅ Ajout de `authError` dans les messages d'erreur
- ✅ Fonction `showTokenExpiredAlert()` pour l'alerte visuelle
- ✅ Gestion spécifique des erreurs 403 dans `handleUserMessage()`

### `technova-config.js`
- ⚠️ **À mettre à jour** avec le nouveau token JWT

## 🔍 Vérification du fonctionnement

### Indicators de succès:
- ✅ Connexion OK dans la demo
- ✅ Modèle technova trouvé
- ✅ Pas d'erreur 403 dans la console
- ✅ Chat fonctionnel

### En cas d'échec:
1. Vérifiez que OpenWebUI fonctionne sur `http://localhost:3000`
2. Assurez-vous que le modèle `technova` existe
3. Vérifiez que le token JWT est valide et récent
4. Consultez les logs de debug dans la console

## 📋 Exemple de token JWT valide

Un token JWT OpenWebUI ressemble à:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkYWNkZDRiLTEzNzItNGNjYy05MTY0LTU4N2IzNjA3NTU1NiJ9.ExNlsP1uK-4NkCfvPfyx_UH3nJdIg-pzp20IdvG5IkA
```

**Note:** Les tokens JWT expirent régulièrement. Si l'erreur 403 revient, répétez la procédure de mise à jour du token.

## 🚀 Test final

1. Ouvrez `demo-technova-fixed.html`
2. Cliquez sur "Ouvrir le Chat Assistant"
3. Posez une question (ex: "Qu'est-ce que TechNova ?")
4. Vérifiez que la réponse arrive sans erreur 403

## 📞 Support

Si le problème persiste après avoir suivi ces étapes:
1. Vérifiez les logs dans la console du navigateur
2. Utilisez les outils de diagnostic de la page demo
3. Assurez-vous que le serveur OpenWebUI fonctionne correctement
