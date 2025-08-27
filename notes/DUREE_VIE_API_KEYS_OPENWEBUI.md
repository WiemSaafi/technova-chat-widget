# ⏰ Durée de Vie des API Keys OpenWebUI

## 🔑 **ANALYSE DE VOTRE CLÉ ACTUELLE**

Votre clé API actuelle dans `backend/.env` :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE4NzY4YjEyLThmYTctNDcwMS04MDAzLTY3MDAwYjllNzRiYyIsImV4cCI6MTc1Mzc0NzQ1Nn0.p9vobEmqzY57K5HxVeuqoYWlu_ZTtlixIlQMZ_8REiE
```

### **📅 DATE D'EXPIRATION**

En décodant votre token JWT :
- **Timestamp d'expiration** : `1753747456`
- **Date d'expiration** : **27 mai 2025**
- **Statut actuel** : **EXPIRÉE depuis janvier 2025 !** ❌

C'est pourquoi vous avez l'erreur 401 Unauthorized !

---

## ⏱️ **DURÉE DE VIE STANDARD DES API KEYS OPENWEBUI**

### **Durée par défaut :**
- **90 jours** (3 mois) à partir de la génération
- **Pas de limite de tokens** (utilisation illimitée pendant cette période)
- **Expiration automatique** après 90 jours

### **Votre clé a été générée :**
- **Calculé** : 27 février 2025 (90 jours avant l'expiration)
- **Expirée le** : 27 mai 2025
- **Aujourd'hui** : 23 juillet 2025 → **Expirée depuis 2 mois !**

---

## 🔄 **SYSTÈME DE TOKENS JWT**

### **Format des clés OpenWebUI :**
```
eyJ[header].eyJ[payload].signature
```

### **Contenu du payload (décodé) :**
```json
{
  "id": "18768b12-8fa7-4701-8003-67000b9e74bc",
  "exp": 1753747456
}
```

- **`id`** : Identifiant unique de votre utilisateur
- **`exp`** : Timestamp Unix d'expiration (secondes depuis 1970)

---

## 📊 **COMPARAISON AVEC D'AUTRES SERVICES**

| Service | Durée | Tokens | Expiration |
|---------|-------|---------|------------|
| **OpenWebUI** | 90 jours | Illimité | Automatique |
| **OpenAI** | Permanente* | Usage facturé | Manuelle |
| **Claude** | Permanente* | Usage facturé | Manuelle |
| **Google AI** | Variable | Quota/jour | Variable |

*Jusqu'à révocation manuelle

---

## 🚨 **SYSTÈME D'ALERTE DANS VOTRE BACKEND**

Votre serveur `backend/server.js` contient déjà un système d'alerte :

```javascript
function checkAPIKeyExpiration() {
    // Décode automatiquement votre token
    // Calcule les jours restants
    // Affiche des alertes :
    
    if (daysLeft <= 0) {
        console.error('🚨 API KEY EXPIRÉE !');
    } else if (daysLeft <= 5) {
        console.warn('⚠️ API Key expire dans ' + daysLeft + ' jour(s) !');
    } else if (daysLeft <= 10) {
        console.log('📅 API Key expire dans ' + daysLeft + ' jours');
    }
}
```

### **Messages que vous devriez voir au démarrage :**
```
🚨 API KEY EXPIRÉE ! Générez une nouvelle clé dans OpenWebUI
📋 Voir: chat-widget/notes/RENOUVELLEMENT_API_KEY.md
```

---

## 📈 **USAGE ET LIMITES**

### **Pendant la durée de vie (90 jours) :**
- ✅ **Requêtes illimitées** à l'API
- ✅ **Tous les modèles** disponibles dans votre OpenWebUI
- ✅ **Toutes les fonctionnalités** (chat, models, etc.)

### **Pas de limite de tokens par :**
- Requête
- Jour  
- Mois
- Total

### **Limitation uniquement :**
- ❌ **Temps** : 90 jours maximum
- ❌ **Révocation** : Si vous la supprimez manuellement

---

## 🔄 **CYCLE DE RENOUVELLEMENT RECOMMANDÉ**

### **Planning suggéré :**
1. **Jour 0** : Génération de la clé
2. **Jour 80** : Alerte "10 jours restants"
3. **Jour 85** : Alerte "5 jours restants"  
4. **Jour 88** : **Générer nouvelle clé** et remplacer
5. **Jour 90** : Ancienne clé expire automatiquement

### **Bonnes pratiques :**
- 📅 **Calendrier** : Noter la date d'expiration
- 🔔 **Rappel** : Alarme 1 semaine avant
- 🔄 **Remplacement** : 2-3 jours avant expiration
- 🧪 **Test** : Vérifier après remplacement

---

## 💡 **POURQUOI 90 JOURS ?**

### **Sécurité :**
- Limite l'exposition en cas de fuite
- Force un renouvellement régulier
- Permet de révoquer automatiquement

### **Gestion :**
- Évite l'accumulation de clés oubliées
- Force une maintenance régulière
- Améliore la traçabilité

---

## 🛠️ **SOLUTION IMMÉDIATE POUR VOUS**

1. **Générer nouvelle clé** (durée : 90 jours)
2. **Remplacer** dans `backend/.env`
3. **Redémarrer** le backend
4. **Noter** la nouvelle date d'expiration
5. **Planifier** le prochain renouvellement

**Votre widget fonctionnera immédiatement après !** 🚀

---

## 📋 **RÉSUMÉ TECHNIQUE**

- **Type** : JWT (JSON Web Token)
- **Algorithme** : HS256 (HMAC SHA-256)
- **Durée** : 90 jours exactement
- **Tokens** : Illimités pendant la durée
- **Revocation** : Automatique à expiration
- **Format** : `eyJ...` (Base64 encodé)

**Votre problème = clé expirée depuis 2 mois !** ⏰
