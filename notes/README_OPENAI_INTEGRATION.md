# Chat Widget avec OpenAI + OpenWebUI

Ce projet combine un chat widget web avec OpenWebUI et OpenAI pour créer un assistant intelligent avec des réponses préparées.

## 🎯 Objectif

Créer un chat widget qui utilise OpenAI via OpenWebUI avec des réponses préparées pour les questions fréquentes, permettant une expérience utilisateur cohérente et professionnelle.

## 🏗️ Architecture

```
User → Chat Widget → OpenWebUI → OpenAI → Réponses préparées
```

## 📁 Structure du projet

```
chat-widget/
├── config.js                    # Configuration principale du widget
├── chat-widget.js               # Code du widget
├── openai-config.js            # Configuration spécifique OpenAI
├── setup-openai.js             # Script d'automatisation
├── demo-openai.html            # Page de démonstration
├── SETUP_OPENAI_OPENWEBUI.md   # Guide de configuration
└── README_OPENAI_INTEGRATION.md # Ce fichier
```

## 🚀 Installation rapide

### 1. Prérequis
- OpenWebUI installé et fonctionnel
- Node.js (pour le script d'automatisation)
- Clé API OpenAI

### 2. Configuration automatique
```bash
# Cloner le projet
git clone https://github.com/anantrp/chat-widget.git
cd chat-widget

# Lancer le script de configuration
node setup-openai.js
```

### 3. Personnalisation
Modifiez le fichier `openai-setup.json` généré :
```json
{
  "openWebUIUrl": "http://localhost:8080",
  "openaiApiKey": "sk-votre-vraie-cle-openai",
  "model": "openai-assistant",
  "baseModel": "gpt-4o-mini",
  "preparedResponses": {
    "Quels sont vos horaires ?": "Votre réponse personnalisée",
    "Comment vous contacter ?": "Votre réponse personnalisée",
    // ... ajoutez vos propres questions/réponses
  }
}
```

Puis relancez :
```bash
node setup-openai.js
```

## ⚙️ Configuration OpenWebUI

### 1. Ajouter OpenAI comme provider
```bash
# Via Docker
docker run -d -p 8080:8080 \
  -e OPENAI_API_KEY=sk-votre-cle-openai \
  -e OPENAI_API_BASE_URL=https://api.openai.com/v1 \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

### 2. Créer le modèle personnalisé
1. Ouvrez OpenWebUI : `http://localhost:8080`
2. Allez dans "Workspace" → "Models" → "Create a model"
3. Copiez le contenu de `openai-assistant.modelfile`
4. Nommez le modèle `openai-assistant`
5. Sauvegardez

## 🧪 Test et validation

### 1. Tester le modèle dans OpenWebUI
```bash
# Via API
curl -X POST http://localhost:8080/api/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai-assistant",
    "messages": [{"role": "user", "content": "Quels sont vos horaires ?"}],
    "max_tokens": 100
  }'
```

### 2. Tester le chat widget
```bash
# Ouvrir la page de démonstration
open demo-openai.html
```

### 3. Questions de test
- "Quels sont vos horaires ?"
- "Comment puis-je vous contacter ?"
- "Où vous trouvez-vous ?"
- "Quels services proposez-vous ?"
- "Quels sont vos tarifs ?"
- "Comment prendre rendez-vous ?"

## 🎨 Personnalisation

### Modifier les réponses préparées
1. Éditez `openai-setup.json`
2. Ajoutez/modifiez les questions/réponses
3. Relancez `node setup-openai.js`
4. Recréez le modèle dans OpenWebUI

### Personnaliser l'apparence
Modifiez les styles dans `chat-widget.js` :
```javascript
// Couleurs du widget
const WIDGET_COLORS = {
  primary: '#3B82F6',   // Bleu
  secondary: '#6B7280', // Gris
  background: '#FFFFFF' // Blanc
};
```

### Ajuster les paramètres IA
Dans `config.js` :
```javascript
// Paramètres de génération
maxTokens: 1000,        // Longueur des réponses
temperature: 0.7,       // Créativité (0-1)
```

## 📊 Monitoring

### Vérifier le statut
```bash
# Status OpenWebUI
curl http://localhost:8080/api/health

# Liste des modèles
curl http://localhost:8080/api/models

# Logs Docker
docker logs open-webui
```

### Métriques utiles
- Temps de réponse moyen
- Taux de correspondance des réponses préparées
- Utilisation des tokens OpenAI

## 🔒 Sécurité

### Bonnes pratiques
1. **Clés API** : Stockez les clés dans des variables d'environnement
2. **CORS** : Configurez les domaines autorisés
3. **Rate limiting** : Limitez les requêtes par utilisateur
4. **Validation** : Validez les entrées utilisateur

### Configuration sécurisée
```bash
# Variables d'environnement
export OPENAI_API_KEY=sk-votre-cle-openai
export OPENWEBUI_URL=http://localhost:8080
```

## 🚧 Dépannage

### Problèmes courants

1. **"Model not found"**
   - Vérifiez que le modèle `openai-assistant` est créé
   - Confirmez que OpenAI est configuré dans OpenWebUI

2. **"API Key invalid"**
   - Vérifiez votre clé OpenAI
   - Assurez-vous d'avoir des crédits

3. **"Connection refused"**
   - Vérifiez que OpenWebUI est en cours d'exécution
   - Testez l'URL : `http://localhost:8080`

4. **Réponses incorrectes**
   - Vérifiez le message système dans le Modelfile
   - Testez avec des questions exactes

### Logs utiles
```bash
# Logs OpenWebUI
docker logs open-webui -f

# Test de connectivité
curl -I http://localhost:8080

# Vérifier les modèles
curl http://localhost:8080/api/models
```

## 📈 Optimisation

### Performance
- Utilisez `stream: true` pour les réponses en temps réel
- Mettez en cache les réponses fréquentes
- Optimisez les paramètres OpenAI

### Coûts
- Surveillez l'utilisation des tokens
- Utilisez `gpt-3.5-turbo` pour réduire les coûts
- Implémentez des limites de rate

## 🔄 Mise à jour

### Mettre à jour les réponses
```bash
# Modifier openai-setup.json
# Puis relancer
node setup-openai.js
```

### Mettre à jour le modèle
1. Modifiez le Modelfile généré
2. Recréez le modèle dans OpenWebUI
3. Testez les nouvelles réponses

## 🤝 Intégration sur votre site

### HTML minimal
```html
<!DOCTYPE html>
<html>
<head>
    <title>Mon Site</title>
    <script src="./config.js"></script>
    <script async src="./chat-widget.js"></script>
</head>
<body>
    <!-- Votre contenu -->
</body>
</html>
```

### Configuration pour production
```javascript
const OPENWEBUI_CONFIG = {
  openWebUIUrl: 'https://votre-openwebui.com',
  model: 'openai-assistant',
  // ... autres paramètres
};
```

## 📚 Ressources

- [OpenWebUI Documentation](https://docs.openwebui.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Modelfile Syntax](https://github.com/open-webui/open-webui/wiki/Modelfile)

## 🐛 Support

Pour obtenir de l'aide :
1. Consultez la section dépannage
2. Vérifiez les logs
3. Créez une issue sur GitHub

## 📄 Licence

Ce projet est sous licence MIT.
