# 🔑 Guide : Types de Clés API dans OpenWebUI

## ❓ **CONFUSION FRÉQUENTE**

Il y a **2 types de clés différentes** dans OpenWebUI qui servent à **2 choses différentes** !

---

## 🎯 **TYPE 1 : Clés `sk-` (Templates/Modèles)**

### **À quoi ça sert :**
- Configurer des **modèles externes** (OpenAI, Claude, Gemini, etc.)
- Permettre à OpenWebUI de parler aux **APIs externes**

### **Format :**
```
sk-proj-1234567890abcdef...
```

### **Où la trouver/modifier :**
1. **OpenWebUI** → **Settings** → **Models**
2. **Cliquez** sur un modèle (ex: GPT-4, Claude)
3. **API Key** → Entrez votre clé `sk-...`

### **Exemple d'usage :**
- Vous voulez utiliser GPT-4 dans OpenWebUI
- Vous mettez votre clé OpenAI `sk-...` 
- OpenWebUI peut maintenant utiliser GPT-4

---

## 🎯 **TYPE 2 : Clés `eyJ` (API OpenWebUI)**

### **À quoi ça sert :**
- Permettre à **votre backend** de parler à OpenWebUI
- S'authentifier pour utiliser l'**API d'OpenWebUI**

### **Format :**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Où la trouver/modifier :**
1. **OpenWebUI** → **Settings** → **Account** 
2. **API Keys** (section en bas)
3. **Generate API Key** → Copier la nouvelle clé

### **Exemple d'usage :**
- Votre widget veut parler à OpenWebUI
- Votre backend utilise cette clé `eyJ...`
- OpenWebUI autorise votre backend

---

## 🚨 **POUR VOTRE PROBLÈME ACTUEL**

### **Vous avez besoin de : TYPE 2 (`eyJ`)**

❌ **PAS** les clés `sk-` des templates  
✅ **OUI** la clé `eyJ` de votre compte

### **Pourquoi ?**
Votre backend fait des appels à l'**API d'OpenWebUI**, pas aux APIs externes.

---

## 📋 **ÉTAPES EXACTES POUR VOUS**

### **ÉTAPE 1 : Aller au bon endroit**
```
OpenWebUI → Settings → Account → API Keys
```
(PAS Settings → Models !)

### **ÉTAPE 2 : Générer nouvelle clé**
- **Cliquez** "Generate API Key"
- **Copiez** la clé qui commence par `eyJ...`

### **ÉTAPE 3 : Remplacer dans votre .env**
```env
OPENWEBUI_API_KEY=eyJ_NOUVELLE_CLE_ICI
```

### **ÉTAPE 4 : Redémarrer backend**
- Redémarrer Coolify
- Tester avec la page de diagnostic

---

## 🎨 **SCHÉMA VISUEL**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Votre Widget  │    │   Votre Backend  │    │    OpenWebUI    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Envoie message     │                       │
         ├──────────────────────→│                       │
         │                       │ 2. Appel API avec     │
         │                       │    clé eyJ...         │
         │                       ├──────────────────────→│
         │                       │                       │
         │                       │ 3. Réponse IA         │
         │                       │←──────────────────────┤
         │ 4. Retour réponse     │                       │
         │←──────────────────────┤                       │
```

**La clé `eyJ` sert pour l'étape 2 : Backend → OpenWebUI**

---

## ❌ **CE QUI NE MARCHE PAS**

- Modifier les clés `sk-` dans les templates
- Utiliser une clé OpenAI pour l'API OpenWebUI
- Mélanger les deux types de clés

## ✅ **CE QUI MARCHE**

- Utiliser la clé `eyJ` de votre compte OpenWebUI
- L'utiliser dans votre fichier `.env`
- Redémarrer le backend après modification

---

**Votre problème = clé `eyJ` expirée, pas clé `sk-` !** 🎯
