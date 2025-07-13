# Chat Widget avec Open WebUI

Ce chat widget a été modifié pour se connecter directement à votre instance Open WebUI et utiliser vos modèles AI locaux.

## 🚀 Fonctionnalités

- **Connexion directe à Open WebUI** : Communique avec votre instance Open WebUI locale
- **Support multi-modèles** : Compatible avec tous les modèles supportés par Open WebUI (Llama, Mistral, CodeLlama, etc.)
- **Configuration flexible** : Fichier de configuration séparé pour faciliter la personnalisation
- **Historique des conversations** : Maintient le contexte de la conversation
- **Indicateur de frappe** : Animation pendant le traitement de la requête
- **Gestion d'erreurs** : Messages d'erreur personnalisés et gestion des timeouts
- **Responsive** : Fonctionne sur desktop et mobile

## 📋 Prérequis

1. **Open WebUI installé et en cours d'exécution**
   - Suivez le guide d'installation : https://docs.openwebui.com/
   - Vérifiez que votre instance est accessible (par défaut : http://localhost:8080)

2. **Modèles AI installés**
   - Téléchargez au moins un modèle via Open WebUI
   - Notez le nom exact du modèle (ex: `llama3.2:latest`)

## 🔧 Installation

1. **Clonez ou téléchargez les fichiers**
   ```bash
   git clone https://github.com/anantrp/chat-widget.git
   cd chat-widget
   ```

2. **Configurez Open WebUI**
   - Ouvrez le fichier `config.js`
   - Modifiez les paramètres selon votre configuration :

   ```javascript
   const OPENWEBUI_CONFIG = {
     // URL de votre instance Open WebUI
     openWebUIUrl: 'http://localhost:8080',
     
     // Clé API si nécessaire (laissez vide si pas d'authentification)
     apiKey: '',
     
     // Modèle à utiliser (vérifiez le nom exact dans Open WebUI)
     model: 'llama3.2:latest',
     
     // Paramètres de génération
     maxTokens: 1000,
     temperature: 0.7,
     
     // Message système pour définir le comportement de l'IA
     systemMessage: 'Vous êtes un assistant intelligent et serviable.',
   };
   ```

3. **Intégrez le widget à votre site**
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

## ⚙️ Configuration

### Paramètres principaux

| Paramètre | Description | Exemple |
|-----------|-------------|---------|
| `openWebUIUrl` | URL de votre instance Open WebUI | `http://localhost:8080` |
| `apiKey` | Clé API si authentification requise | `sk-...` ou `''` |
| `model` | Nom du modèle à utiliser | `llama3.2:latest` |
| `maxTokens` | Nombre maximum de tokens à générer | `1000` |
| `temperature` | Créativité des réponses (0-1) | `0.7` |
| `systemMessage` | Instructions système pour l'IA | `Vous êtes un assistant...` |

### Modèles supportés

Le widget fonctionne avec tous les modèles supportés par Open WebUI :
- **Llama** : `llama3.2:latest`, `llama3.1:8b`, etc.
- **Mistral** : `mistral:latest`, `mistral:7b`, etc.
- **CodeLlama** : `codellama:latest`, `codellama:7b`, etc.
- **Autres** : Phi, Gemma, et tous les modèles compatibles Ollama

### Configuration avancée

```javascript
const OPENWEBUI_CONFIG = {
  // Configuration de base
  openWebUIUrl: 'http://localhost:8080',
  model: 'llama3.2:latest',
  
  // Paramètres avancés
  stream: false, // Streaming des réponses
  timeout: 30000, // Timeout en millisecondes
  
  // Messages d'erreur personnalisés
  errorMessages: {
    networkError: 'Impossible de se connecter au serveur.',
    serverError: 'Erreur du serveur. Veuillez réessayer.',
    timeout: 'La requête a pris trop de temps.',
    general: 'Erreur technique. Veuillez réessayer.'
  }
};
```

## 🔍 Dépannage

### Problèmes courants

1. **"Impossible de se connecter au serveur"**
   - Vérifiez que Open WebUI est en cours d'exécution
   - Vérifiez l'URL dans `config.js`
   - Vérifiez les paramètres CORS d'Open WebUI

2. **"Erreur HTTP: 404"**
   - Vérifiez que l'endpoint API est correct
   - Certaines versions d'Open WebUI peuvent avoir des endpoints différents

3. **"Erreur HTTP: 401"**
   - Authentification requise : ajoutez votre clé API dans `config.js`

4. **"Erreur HTTP: 400"**
   - Vérifiez que le nom du modèle est correct
   - Vérifiez que le modèle est bien installé dans Open WebUI

### Configuration CORS

Si vous rencontrez des erreurs CORS, vous devez configurer Open WebUI pour accepter les requêtes depuis votre domaine :

```bash
# Exemple avec Docker
docker run -d -p 8080:8080 \
  -e WEBUI_AUTH=false \
  -e CORS_ALLOW_ORIGIN="*" \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

### Vérification de la configuration

1. **Testez l'accès à Open WebUI**
   ```bash
   curl http://localhost:8080/api/models
   ```

2. **Vérifiez la console du navigateur**
   - Ouvrez les outils de développement (F12)
   - Regardez les erreurs dans la console

3. **Testez l'API directement**
   ```bash
   curl -X POST http://localhost:8080/api/chat/completions \
     -H "Content-Type: application/json" \
     -d '{
       "model": "llama3.2:latest",
       "messages": [{"role": "user", "content": "Hello"}],
       "max_tokens": 100
     }'
   ```

## 🎨 Personnalisation

### Style CSS

Le widget utilise Tailwind CSS. Vous pouvez personnaliser l'apparence en modifiant les classes CSS dans `chat-widget.js`.

### Messages système

Personnalisez le comportement de l'IA en modifiant le `systemMessage` :

```javascript
systemMessage: 'Vous êtes un expert en développement web. Répondez de manière technique et précise.'
```

### Gestion des erreurs

Personnalisez les messages d'erreur dans `config.js` :

```javascript
errorMessages: {
  networkError: 'Problème de connexion réseau',
  serverError: 'Le serveur rencontre des difficultés',
  timeout: 'Temps de réponse trop long',
  general: 'Une erreur est survenue'
}
```

## 📚 API Reference

### Endpoints utilisés

- `POST /api/chat/completions` : Envoie des messages et reçoit des réponses
- `GET /api/models` : Liste les modèles disponibles (pour vérification)

### Format des messages

```javascript
{
  "model": "llama3.2:latest",
  "messages": [
    {"role": "system", "content": "Vous êtes un assistant..."},
    {"role": "user", "content": "Bonjour"},
    {"role": "assistant", "content": "Bonjour ! Comment puis-je vous aider ?"}
  ],
  "max_tokens": 1000,
  "temperature": 0.7,
  "stream": false
}
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Soumettre des pull requests

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🔗 Liens utiles

- [Open WebUI Documentation](https://docs.openwebui.com/)
- [Ollama Models](https://ollama.ai/library)
- [Tailwind CSS](https://tailwindcss.com/)
- [Projet original](https://github.com/anantrp/chat-widget)
