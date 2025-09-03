# 🚀 Justrent Chat Widget - Solution Sécurisée

Chat widget IA personnalisé pour WordPress avec intégration OpenWebUI sécurisée.

## ✨ **Caractéristiques**

- 🔐 **Sécurité maximale** : Clé API jamais exposée côté frontend
- 🎨 **Design moderne** : Interface responsive avec Tailwind CSS
- ⚡ **Installation rapide** : 2 lignes de code dans WordPress
- 🔧 **Configuration automatique** : Backend génère la config dynamiquement
- 🌐 **Compatible** : Fonctionne avec tous les thèmes WordPress
- 📱 **Responsive** : S'adapte mobile et desktop

## 🏗️ **Architecture**

```
WordPress Frontend ←→ Backend Node.js ←→ OpenWebUI
     ↓                      ↓               ↓
  2 lignes code       Clé API sécurisée   Modèle IA
```

## 🚀 **Installation Rapide**

### 1. Déployer le Backend

[![Deploy to Coolify](https://img.shields.io/badge/Deploy-Coolify-blue)](https://coolify.io)

1. Connecter ce repository à Coolify
2. Configurer les variables d'environnement :
   ```
   OPENWEBUI_API_KEY=votre_cle_api
   OPENWEBUI_URL=http://localhost:3000
   FRONTEND_URL=https://votre-site.com
   ```
3. Déployer

### 2. Intégrer dans WordPress

Ajoutez dans votre `footer.php` WordPress :

```html
<script src="https://votre-backend.coolify.app/config.js"></script>
<script src="https://votre-backend.coolify.app/widget.js"></script>
```

**C'est tout !** Le chat widget apparaît automatiquement.

## 📁 **Structure du Projet**

```
├── backend/                          # Backend Node.js sécurisé
│   ├── server.js                     # Serveur Express
│   ├── package.json                  # Dépendances
│   └── .env.example                  # Variables d'environnement          
└── README.md                         # Ce fichier
```

## 🔧 **Configuration**

### Variables d'environnement (Backend)

```bash
OPENWEBUI_API_KEY=your_api_key_here
OPENWEBUI_URL=http://localhost:3000
PORT=3001
FRONTEND_URL=https://your-wordpress-site.com
NODE_ENV=production
```

### Configuration du Widget

Le backend génère automatiquement la configuration optimale. Personnalisable via CSS.

## 🎨 **Personnalisation**

```css
/* Personnaliser la position */
#technova-chat-widget-container {
    bottom: 20px !important;
    right: 20px !important;
}

/* Personnaliser les couleurs */
#technova-chat-bubble {
    background: linear-gradient(135deg, #your-color1, #your-color2) !important;
}
```

## 🛡️ **Sécurité**

- ✅ Clé API jamais exposée côté frontend
- ✅ Backend proxy sécurisé
- ✅ CORS configuré correctement
- ✅ Variables d'environnement protégées
- ✅ Headers de sécurité

## 🔗 **Endpoints Backend**

- `GET /health` - Status du backend
- `POST /api/chat` - Proxy vers OpenWebUI
- `GET /api/models` - Liste des modèles
- `GET /widget.js` - Widget JavaScript
- `GET /config.js` - Configuration dynamique

## 🆘 **Support**

1. Vérifiez que le backend est en ligne : `/health`
2. Consultez les logs du navigateur (F12)
3. Vérifiez la configuration CORS

## 📄 **Licence**

MIT License - Libre d'utilisation pour vos projets.

---

**Justrent Chat Widget** - Solution sécurisée pour intégrer un chat IA dans WordPress.
