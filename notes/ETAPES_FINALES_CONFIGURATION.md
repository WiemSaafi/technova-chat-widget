# 🎯 Étapes finales pour configurer votre chat widget TechNova

## ✅ Corrections effectuées

1. **Nom du modèle corrigé** : `'Technova'` (avec T majuscule) ✅
2. **URL configurée** : `'http://localhost:3000'` ✅

## 🔑 Étape restante : Obtenir votre API Key

### Pourquoi avez-vous besoin d'une API Key ?
Les erreurs 403 dans le Network tab confirment que votre Open WebUI nécessite une authentification.

### 📝 Étapes précises :

#### 1. **Connectez-vous à Open WebUI**
```
🌐 Ouvrez : http://localhost:3000
🔐 Connectez-vous avec vos identifiants
```

#### 2. **Accédez aux paramètres**
- Cliquez sur votre **avatar/profil** (en haut à droite)
- Sélectionnez **"Settings"** ou **"Paramètres"**

#### 3. **Trouvez la section API Keys**
Cherchez dans les onglets :
- **"Account"** → **"API Keys"**
- **"Settings"** → **"API Keys"**  
- **"Developer"** → **"API Keys"**
- Ou un onglet direct **"API Keys"**

#### 4. **Créez une nouvelle API Key**
- Cliquez sur **"Create New Key"** ou **"Generate API Key"**
- **Nom** : `TechNova Chat Widget`
- Cliquez sur **"Create"** ou **"Generate"**

#### 5. **Copiez la clé générée**
⚠️ **IMPORTANT** : Copiez immédiatement la clé car elle ne sera plus affichée !

La clé ressemble à :
```
owui-abc123def456ghi789jkl012mno345pqr
```

#### 6. **Mettez à jour votre configuration**

Dans le fichier `technova-config.js`, remplacez :
```javascript
apiKey: '', // Laissez vide si pas d'authentification requise
```

Par :
```javascript
apiKey: 'owui-VOTRE-CLE-ICI', // Votre API Key Open WebUI
```

**Exemple concret :**
```javascript
const TECHNOVA_CONFIG = {
  openWebUIUrl: 'http://localhost:3000',
  apiKey: 'owui-abc123def456ghi789jkl012mno345pqr', // ← VOTRE CLÉ
  model: 'Technova',
  maxTokens: 1500,
  temperature: 0.7,
  // ... reste de la config
};
```

## 🧪 Test de validation

### Après avoir ajouté votre API Key :

1. **Actualisez** la page `demo-technova.html`
2. **Ouvrez la console** du navigateur (F12)
3. **Recherchez ces messages** :
   - ✅ `TechNova Chat Widget initialisé`
   - ✅ `Modèle Technova trouvé et accessible`

4. **Vérifiez le statut** en haut à droite :
   - Devrait passer de ❌ à ✅ `Modèle Technova connecté`

5. **Testez le chat** :
   - Cliquez sur la bulle de chat TechNova
   - Essayez une question rapide
   - Vérifiez que la réponse arrive du modèle

## 🔍 Où trouver les API Keys dans Open WebUI

### Interface moderne :
```
Avatar → Settings → Account → API Keys
```

### Interface alternative :
```
Menu → Paramètres → Développeur → API Keys
```

### Si vous ne trouvez pas :
1. Cherchez "API" dans la barre de recherche des paramètres
2. Vérifiez tous les onglets de Settings
3. Regardez dans "Profile", "Account", "Developer"

## 🚨 Dépannage

### Si vous ne trouvez pas la section API Keys :
```javascript
// Test dans la console du navigateur
fetch('http://localhost:3000/api/auth/session')
  .then(response => response.json())
  .then(data => console.log('Session info:', data));
```

### Si l'API Key ne fonctionne pas :
1. Vérifiez qu'elle commence par `owui-`
2. Assurez-vous qu'elle est bien copiée (sans espaces)
3. Régénérez une nouvelle clé si nécessaire

## 🎯 Configuration finale attendue

```javascript
const TECHNOVA_CONFIG = {
  openWebUIUrl: 'http://localhost:3000',          // ✅
  apiKey: 'owui-votre-cle-api-ici',              // ← À COMPLÉTER
  model: 'Technova',                              // ✅
  maxTokens: 1500,
  temperature: 0.7,
  // ... reste de la configuration
};
```

## 🚀 Une fois terminé

Votre chat widget TechNova sera entièrement opérationnel :

✅ **Connexion** : Open WebUI avec authentification  
✅ **Modèle** : Technova correctement identifié  
✅ **Interface** : Widget personnalisé TechNova  
✅ **Questions** : Réponses rapides prédéfinies  
✅ **Contexte** : Message système spécialisé TechNova  

---

## 📞 Une fois configuré, vous pourrez :

- **Intégrer** le widget dans vos sites web
- **Personnaliser** les questions rapides
- **Modifier** l'apparence et les couleurs
- **Adapter** le message système pour vos besoins spécifiques

**Votre assistant TechNova personnalisé sera prêt à utiliser ! 🎉**
