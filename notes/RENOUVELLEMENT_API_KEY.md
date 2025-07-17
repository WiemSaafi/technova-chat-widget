# 🔄 Renouvellement de l'API Key OpenWebUI

## 📅 Expiration après 30 jours

Votre API key OpenWebUI actuelle va expirer après 30 jours. Voici comment la renouveler :

### 🔧 Étapes de renouvellement

#### 1. **Générer une nouvelle clé**
1. Ouvrez votre Open WebUI : `http://localhost:3000`
2. Allez dans **Settings** → **Account** → **API Keys**
3. Cliquez sur **"Create New Key"**
4. Copiez la nouvelle clé générée (format : `owui-...`)

#### 2. **Mettre à jour le fichier .env**
```env
# Remplacez l'ancienne clé par la nouvelle
OPENWEBUI_API_KEY=nouvelle-cle-generee-ici
```

#### 3. **Redémarrer le serveur backend**
```bash
# Dans le dossier backend
cd chat-widget/backend
npm run start
```

### 🗑️ Supprimer l'ancienne clé

**Important :** Après avoir généré une nouvelle clé, supprimez l'ancienne dans OpenWebUI pour des raisons de sécurité.

### 🤖 Automatisation du renouvellement

Pour éviter les interruptions, vous pouvez :

#### Option 1 : Notification d'expiration
```javascript
// Ajouter dans server.js
function checkAPIKeyExpiration() {
  const token = process.env.OPENWEBUI_API_KEY;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(payload.exp * 1000);
    const daysLeft = Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 5) {
      console.warn(`⚠️ API Key expire dans ${daysLeft} jours !`);
    }
  } catch (error) {
    console.error('Erreur lors de la vérification d\'expiration:', error);
  }
}

// Vérifier au démarrage
checkAPIKeyExpiration();
```

#### Option 2 : Clé sans expiration
Si possible, générez une clé sans expiration dans OpenWebUI (si l'option est disponible).

### 🔍 Vérifier l'expiration actuelle

Votre clé actuelle : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkYWNkZDRiLTEzNzItNGNjYy05MTY0LTU4N2IzNjA3NTU1NiJ9.3VbyNhWNvON8brOCAIKy4Og5R-rqk7uuIn34yc36ang`

C'est un token JWT. Pour vérifier sa date d'expiration :
1. Allez sur https://jwt.io/
2. Collez votre token
3. Regardez le champ `exp` dans le payload

### 📝 Checklist de renouvellement

- [ ] Générer nouvelle clé dans OpenWebUI
- [ ] Mettre à jour `OPENWEBUI_API_KEY` dans `.env`
- [ ] Redémarrer le serveur backend
- [ ] Tester le chat widget
- [ ] Supprimer l'ancienne clé dans OpenWebUI
- [ ] Noter la date d'expiration de la nouvelle clé

### 🚨 Que faire si la clé expire ?

Si votre clé expire et que vous obtenez des erreurs 401 :

1. **Erreur typique :**
```
Error: 401 Unauthorized - API Key expired
```

2. **Solution immédiate :**
```bash
# Générer une nouvelle clé et mettre à jour .env
# Puis redémarrer :
cd chat-widget/backend
npm run start
```

### 🔒 Bonnes pratiques

- **Renouvelez la clé 5 jours avant expiration**
- **Testez toujours après renouvellement**
- **Gardez un calendrier de renouvellement**
- **Documentez chaque renouvellement**

---

## 📧 Rappel automatique

Vous pouvez configurer un rappel pour renouveler la clé avant expiration :

```javascript
// Fonction à ajouter dans votre code
function scheduleAPIKeyRenewal() {
  const RENEWAL_DAYS_BEFORE = 5;
  const token = process.env.OPENWEBUI_API_KEY;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(payload.exp * 1000);
    const renewalDate = new Date(expirationDate.getTime() - (RENEWAL_DAYS_BEFORE * 24 * 60 * 60 * 1000));
    
    console.log(`📅 Renouveler l'API Key avant le : ${renewalDate.toLocaleDateString()}`);
    
    // Optionnel : Programmer un rappel
    const timeUntilRenewal = renewalDate.getTime() - Date.now();
    if (timeUntilRenewal > 0) {
      setTimeout(() => {
        console.warn('🔔 RAPPEL : Renouveler l\'API Key OpenWebUI !');
      }, timeUntilRenewal);
    }
  } catch (error) {
    console.error('Erreur lors de la programmation du rappel:', error);
  }
}
