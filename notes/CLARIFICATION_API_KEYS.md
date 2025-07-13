# 🚨 CLARIFICATION IMPORTANTE : Deux API Keys différentes !

## ❌ Confusion à éviter

**Vous avez raison de poser la question !** Il y a **DEUX types d'API Keys complètement différentes** :

### 1. 💰 API Key OpenAI (payante) - Que vous avez déjà
```
sk-proj-1234567890abcdef...
```
- **Utilisation** : Pour accéder aux modèles OpenAI (GPT-4, etc.)
- **Coût** : Payante selon l'usage
- **Où** : Configurée DANS Open WebUI pour votre modèle Technova
- **Vous l'avez déjà** ✅

### 2. 🆓 API Key Open WebUI (GRATUITE) - Celle qu'il nous faut
```
owui-1234567890abcdef...
```
- **Utilisation** : Pour accéder à VOTRE installation Open WebUI
- **Coût** : **TOTALEMENT GRATUITE** 🆓
- **Où** : Générée par VOTRE Open WebUI local
- **C'est celle-ci qu'il nous faut** ⭐

## 🔍 Différence cruciale

### API Key OpenAI (sk-...) - Vous l'avez déjà
```
[Votre modèle Technova] → [Utilise OpenAI en backend] → [Avec votre clé sk-...]
```
- Cette clé est configurée **DANS** Open WebUI
- Elle permet à votre modèle Technova d'utiliser GPT en arrière-plan
- **Vous l'avez déjà configurée** ✅

### API Key Open WebUI (owui-...) - Celle qu'il nous faut
```
[Chat Widget] → [Authentification Open WebUI] → [Accès à votre modèle Technova]
```
- Cette clé est pour que le **chat widget** puisse accéder à **votre Open WebUI**
- Elle est **GRATUITE** et générée par votre installation locale
- **C'est celle-ci qu'il nous faut** ⭐

## 🎯 Pourquoi avons-nous besoin de l'API Key Open WebUI ?

### Problème actuel :
```
[Chat Widget] → [Requête vers localhost:3000] → [403 Forbidden]
```
**Raison** : Votre Open WebUI demande une authentification

### Solution :
```
[Chat Widget] → [Requête + API Key owui-...] → [✅ Accès autorisé] → [Modèle Technova]
```

## 🆓 L'API Key Open WebUI est GRATUITE

### Pourquoi gratuite ?
- Elle est générée par **VOTRE** installation Open WebUI
- Elle ne coûte rien car c'est **votre serveur local**
- Elle permet juste d'authentifier l'accès à **votre propre installation**

### Comment l'obtenir (GRATUIT) :
1. **Connectez-vous** à votre Open WebUI (`localhost:3000`)
2. **Allez dans Settings** → **Account** → **API Keys**
3. **Cliquez "Create New Key"** (gratuit !)
4. **Donnez un nom** : "TechNova Chat Widget"
5. **Copiez la clé** générée (commence par `owui-`)

## 🔧 Configuration finale

### Votre modèle Technova utilise déjà votre API Key OpenAI :
```javascript
// Dans Open WebUI - Déjà configuré ✅
openai_api_key: "sk-proj-votre-cle-openai"
```

### Le chat widget a besoin de l'API Key Open WebUI :
```javascript
// Dans technova-config.js - À ajouter
const TECHNOVA_CONFIG = {
  apiKey: 'owui-votre-cle-openwebui', // ← GRATUITE !
  // ...
};
```

## 🚫 Ce qu'il ne faut PAS faire

### ❌ N'utilisez PAS votre clé OpenAI dans le widget :
```javascript
// INCORRECT - Ne faites pas ça !
apiKey: 'sk-proj-votre-cle-openai', // ← Mauvaise clé !
```

### ✅ Utilisez la clé Open WebUI :
```javascript
// CORRECT - Clé gratuite d'Open WebUI
apiKey: 'owui-votre-cle-locale', // ← Bonne clé !
```

## 🔄 Flux complet avec les deux clés

```
1. [Chat Widget] 
   ↓ (avec API Key Open WebUI owui-...)
2. [Open WebUI] - Authentification réussie
   ↓ (utilise votre API Key OpenAI sk-...)
3. [OpenAI GPT] - Génère la réponse
   ↓
4. [Modèle Technova] - Reçoit la réponse
   ↓
5. [Chat Widget] - Affiche la réponse
```

## 💡 Résumé simple

### Ce que vous avez déjà (payant) :
- **API Key OpenAI** (sk-...) dans Open WebUI ✅
- **Modèle Technova** configuré ✅

### Ce qu'il nous faut (gratuit) :
- **API Key Open WebUI** (owui-...) pour le chat widget 🆓

## 🚀 Prochaine étape

1. **Connectez-vous** à `localhost:3000`
2. **Générez une API Key Open WebUI** (gratuite !)
3. **Ajoutez-la** à `technova-config.js`
4. **Testez** votre chat widget

**Aucun coût supplémentaire !** L'API Key Open WebUI est juste pour authentifier l'accès à votre propre serveur local. 🆓✨
