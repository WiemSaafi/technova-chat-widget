# 🔑 Comment obtenir votre API Key Open WebUI

## 🎯 Situation confirmée

Vous avez testé `http://localhost:3000/api/models` et obtenu :
```
401 Unauthorized
"Your session has expired or the token is invalid. Please sign in again."
```

**Cela confirme que vous avez besoin d'une API Key pour votre Open WebUI.**

## 🚀 Étapes pour obtenir votre API Key

### 1. **Connectez-vous à Open WebUI**
1. Ouvrez votre navigateur
2. Allez à `http://localhost:3000`
3. **Connectez-vous** avec vos identifiants

### 2. **Accédez aux paramètres**
1. Une fois connecté, cliquez sur votre **profil/avatar** (en haut à droite)
2. Sélectionnez **"Settings"** ou **"Paramètres"**
3. Ou cliquez directement sur l'icône ⚙️

### 3. **Trouvez la section API Keys**
Selon votre version d'Open WebUI, cherchez :
- **"Account"** → **"API Keys"**
- **"Settings"** → **"API Keys"**
- **"Developer"** → **"API Keys"**
- Ou directement un onglet **"API Keys"**

### 4. **Créez une nouvelle API Key**
1. Cliquez sur **"Create New Key"** ou **"Generate API Key"**
2. Donnez un nom à votre clé (ex: "TechNova Chat Widget")
3. Cliquez sur **"Create"** ou **"Generate"**

### 5. **Copiez la clé générée**
La clé ressemblera à quelque chose comme :
```
owui-1234567890abcdef1234567890abcdef
```

⚠️ **IMPORTANT** : Copiez la clé immédiatement car elle ne sera plus affichée !

## 🔧 Mise à jour de votre configuration

### Une fois que vous avez votre API Key :
```javascript
const TECHNOVA_CONFIG = {
  openWebUIUrl: 'http://localhost:3000',
  apiKey: 'owui-VOTRE-CLE-ICI',  // ← AJOUTEZ VOTRE CLÉ
  model: 'Technova',
  // ... reste de la config
};
```

### Exemple avec une vraie clé :
```javascript
const TECHNOVA_CONFIG = {
  openWebUIUrl: 'http://localhost:3000',
  apiKey: 'owui-abc123def456ghi789jkl012mno345pqr',
  model: 'Technova',
  maxTokens: 1500,
  temperature: 0.7,
  // ...
};
```

## 🧪 Test de votre nouvelle configuration

### Code de test :
```javascript
async function testWithApiKey() {
  const response = await fetch('http://localhost:3000/api/models', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer owui-VOTRE-CLE-ICI`
    }
  });
  
  if (response.ok) {
    const models = await response.json();
    console.log('✅ Connexion réussie avec API Key');
    console.log('📋 Modèles disponibles:', models);
  } else {
    console.log('❌ Erreur avec API Key:', response.status);
  }
}
```

## 🔍 Où trouver les API Keys dans Open WebUI

### Interface classique :
```
[User Menu] → [Settings] → [Account] → [API Keys]
```

### Interface moderne :
```
[Profile Icon] → [Settings] → [Developer] → [API Keys]
```

### Si vous ne trouvez pas :
1. Cherchez dans **tous les onglets** des paramètres
2. Regardez dans **"Account"**, **"Profile"**, **"Developer"**
3. Utilisez la **barre de recherche** des paramètres
4. Cherchez "API" ou "Key"

## 🛠️ Alternatives si vous ne trouvez pas les API Keys

### Option 1 : Vérifier la version d'Open WebUI
```bash
# Dans votre installation Open WebUI
pip show open-webui
```

### Option 2 : Vérifier la documentation
Les API Keys peuvent être dans une section différente selon la version.

### Option 3 : Console développeur
1. Ouvrez la console (F12)
2. Allez dans **Network** (Réseau)
3. Rechargez la page
4. Cherchez les requêtes avec **Authorization header**

## 📝 Format de l'API Key

### API Key Open WebUI typique :
```
owui-1234567890abcdef1234567890abcdef
```

### Caractéristiques :
- **Préfixe** : `owui-`
- **Longueur** : Variable (généralement 32+ caractères)
- **Contenu** : Lettres et chiffres hexadécimaux

## 🔒 Sécurité de l'API Key

### ⚠️ Bonnes pratiques :
1. **Ne partagez jamais** votre API Key
2. **Stockez-la de manière sécurisée**
3. **Régénérez-la** si compromise
4. **Utilisez des noms descriptifs** pour identifier vos clés

### Pour la production :
```javascript
// Utilisez des variables d'environnement
const TECHNOVA_CONFIG = {
  apiKey: process.env.OPENWEBUI_API_KEY,
  // ...
};
```

## 🚀 Prochaines étapes

1. **Connectez-vous** à Open WebUI
2. **Trouvez les API Keys** dans les paramètres
3. **Créez une nouvelle clé** pour "TechNova Chat Widget"
4. **Copiez la clé** générée
5. **Mettez à jour** `technova-config.js`
6. **Testez** votre chat widget

Une fois que vous avez votre API Key, votre chat widget TechNova se connectera parfaitement à votre modèle Technova !
