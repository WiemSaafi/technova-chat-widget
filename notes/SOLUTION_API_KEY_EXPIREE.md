# 🔑 SOLUTION : API Key OpenWebUI Expirée

## 🚨 **PROBLÈME IDENTIFIÉ**

**Le widget ne répond pas parce que votre API Key OpenWebUI est expirée !**

### Diagnostic complet :
✅ **Backend** : Fonctionne parfaitement  
✅ **Widget** : S'affiche correctement  
✅ **OpenWebUI** : Répond directement  
❌ **API Key** : Expirée (Erreur 401 Unauthorized)

---

## 🛠️ **SOLUTION SIMPLE EN 3 ÉTAPES**

### **ÉTAPE 1 : Générer une nouvelle API Key**

1. **Allez sur votre OpenWebUI** : `https://o088g8sswkwg0swkks408kos.jstr.fr`
2. **Connectez-vous** avec votre compte
3. **Cliquez sur votre profil** (coin haut droite)
4. **Allez dans "Paramètres"** ou "Settings"
5. **Cherchez "API Keys"** ou "Clés API"
6. **Cliquez "Générer nouvelle clé"** ou "Generate new key"
7. **COPIEZ** la nouvelle clé (elle commence par `eyJ...` - format JWT)

> **Note :** OpenWebUI utilise des tokens JWT qui commencent par `eyJ`, pas des clés `sk-` comme OpenAI.

### **ÉTAPE 2 : Remplacer la clé dans votre backend**

1. **Ouvrez** le fichier `backend/.env`
2. **Trouvez** la ligne qui commence par `OPENWEBUI_API_KEY=`
3. **Remplacez** l'ancienne clé par la nouvelle :

```env
# AVANT (clé expirée)
OPENWEBUI_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE4NzY4YjEyLThmYTctNDcwMS04MDAzLTY3MDAwYjllNzRiYyIsImV4cCI6MTc1Mzc0NzQ1Nn0.p9vobEmqzY57K5HxVeuqoYWlu_ZTtlixIlQMZ_8REiE

# APRÈS (nouvelle clé)
OPENWEBUI_API_KEY=VOTRE_NOUVELLE_CLE_ICI
```

### **ÉTAPE 3 : Redémarrer le backend**

1. **Arrêtez** votre backend Coolify
2. **Redémarrez-le** pour qu'il prenne la nouvelle clé
3. **Testez** votre widget → Il va maintenant répondre ! 🎉

---

## 🧪 **POUR VÉRIFIER QUE ÇA MARCHE**

Après avoir remplacé la clé :

1. **Ouvrez** : `https://gkwww04kwcwc00gockw8ocw4.jstr.fr/test-debug-api.html`
2. **Cliquez** "Tester Models" → Doit être ✅ SUCCÈS
3. **Cliquez** "Envoyer Test Chat" → Doit être ✅ SUCCÈS
4. **Testez** votre widget → L'IA va répondre ! 🚀

---

## 📋 **RÉSUMÉ**

**AVANT :**
- Widget s'affiche ✅
- Mais l'IA dit "difficultés techniques" ❌

**APRÈS :**
- Widget s'affiche ✅
- L'IA répond normalement ✅

**C'était juste un problème d'API Key expirée !**

---

## 🔄 **POUR ÉVITER LE PROBLÈME À L'AVENIR**

Les API Keys OpenWebUI expirent automatiquement. Pour éviter ce problème :

1. **Notez** quand votre clé expire
2. **Générez** une nouvelle clé avant l'expiration
3. **Mettez** un rappel dans votre calendrier

---

## 💡 **AIDE SUPPLÉMENTAIRE**

Si vous avez des difficultés :

1. **Vérifiez** que vous copiez la clé complète (très longue)
2. **Attention** aux espaces en début/fin de ligne
3. **Redémarrez** bien le backend après modification
4. **Testez** avec la page de diagnostic pour confirmer

**Votre widget va maintenant répondre parfaitement ! 🎉**
