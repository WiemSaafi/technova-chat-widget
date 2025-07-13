# Configuration OpenAI dans OpenWebUI

## Étape 1 : Configurer OpenAI dans OpenWebUI

### Méthode 1 : Via l'interface web OpenWebUI

1. **Ouvrez OpenWebUI** dans votre navigateur : `http://localhost:8080`

2. **Accédez aux paramètres**
   - Cliquez sur l'icône de paramètres (⚙️) ou allez dans "Admin Panel"
   - Sélectionnez "Settings" puis "Connections"

3. **Ajoutez OpenAI comme provider**
   - Cliquez sur "Add Connection"
   - Sélectionnez "OpenAI" comme type
   - Entrez votre clé API OpenAI : `sk-votre-cle-openai-ici`
   - URL de base : `https://api.openai.com/v1`
   - Testez la connexion

4. **Configurez le modèle**
   - Allez dans "Models"
   - Vous devriez voir les modèles OpenAI disponibles
   - Sélectionnez le modèle souhaité (ex: `gpt-4o-mini`)

### Méthode 2 : Via variables d'environnement

Si vous lancez OpenWebUI avec Docker, ajoutez ces variables :

```bash
docker run -d -p 8080:8080 \
  -e OPENAI_API_KEY=sk-votre-cle-openai-ici \
  -e OPENAI_API_BASE_URL=https://api.openai.com/v1 \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

### Méthode 3 : Configuration manuelle

1. **Créez un fichier de configuration** `.env` dans votre dossier OpenWebUI :

```env
OPENAI_API_KEY=sk-votre-cle-openai-ici
OPENAI_API_BASE_URL=https://api.openai.com/v1
```

## Étape 2 : Créer un modèle personnalisé avec template

1. **Accédez aux Modelfiles** dans OpenWebUI
   - Allez dans "Workspace" → "Models" → "Create a model"

2. **Créez le Modelfile** avec le template suivant :

```modelfile
FROM gpt-4o-mini

TEMPLATE """{{ if .System }}<|start_header_id|>system<|end_header_id|>

{{ .System }}<|eot_id|>{{ end }}{{ if .Prompt }}<|start_header_id|>user<|end_header_id|>

{{ .Prompt }}<|eot_id|>{{ end }}<|start_header_id|>assistant<|end_header_id|>

{{ .Response }}<|eot_id|>"""

SYSTEM """Vous êtes un assistant intelligent spécialisé dans l'aide aux utilisateurs. Voici vos réponses préparées pour certaines questions fréquentes :

QUESTIONS FRÉQUENTES ET RÉPONSES PRÉPARÉES :

1. "Quels sont vos horaires ?" ou "À quelle heure êtes-vous ouvert ?"
   → "Nous sommes ouverts du lundi au vendredi de 9h à 18h, et le samedi de 10h à 16h. Nous sommes fermés le dimanche."

2. "Comment puis-je vous contacter ?" ou "Quel est votre numéro de téléphone ?"
   → "Vous pouvez nous contacter par téléphone au 01 23 45 67 89, par email à contact@exemple.com, ou via ce chat en ligne."

3. "Où vous trouvez-vous ?" ou "Quelle est votre adresse ?"
   → "Nous sommes situés au 123 Rue de la Paix, 75001 Paris, France. Métro : Châtelet-Les Halles."

4. "Quels services proposez-vous ?" ou "Que faites-vous ?"
   → "Nous proposons des services de consultation, développement web, formation, et support technique. Contactez-nous pour plus de détails sur nos offres."

5. "Quels sont vos tarifs ?" ou "Combien ça coûte ?"
   → "Nos tarifs varient selon les services. Consultation : 80€/h, Développement : sur devis, Formation : 120€/h. Contactez-nous pour un devis personnalisé."

6. "Comment prendre rendez-vous ?" ou "Puis-je réserver ?"
   → "Vous pouvez prendre rendez-vous en ligne sur notre site, par téléphone au 01 23 45 67 89, ou en nous écrivant à rdv@exemple.com."

INSTRUCTIONS :
- Si une question correspond à une réponse préparée, utilisez EXACTEMENT cette réponse
- Si la question ne correspond à aucune réponse préparée, répondez naturellement en tant qu'assistant helpful
- Soyez toujours poli et professionnel
- Si vous ne savez pas quelque chose, proposez de rediriger vers un humain
"""

PARAMETER temperature 0.7
PARAMETER max_tokens 1000
PARAMETER top_p 1
PARAMETER presence_penalty 0
PARAMETER frequency_penalty 0
```

3. **Nommez votre modèle** : `openai-assistant`

4. **Sauvegardez** le modèle

## Étape 3 : Vérifier la configuration

1. **Testez le modèle** dans l'interface OpenWebUI
   - Sélectionnez votre modèle `openai-assistant`
   - Posez une question comme "Quels sont vos horaires ?"
   - Vérifiez que la réponse préparée est utilisée

2. **Vérifiez l'API**
   ```bash
   curl -X POST http://localhost:8080/api/chat/completions \
     -H "Content-Type: application/json" \
     -d '{
       "model": "openai-assistant",
       "messages": [{"role": "user", "content": "Quels sont vos horaires ?"}],
       "max_tokens": 100
     }'
   ```

## Étape 4 : Personnaliser les réponses

Pour modifier les réponses préparées :

1. **Éditez le Modelfile**
   - Modifiez la section SYSTEM avec vos propres questions/réponses
   - Adaptez les informations à votre entreprise

2. **Exemples de personnalisation** :
   ```
   - Changez les horaires d'ouverture
   - Modifiez les coordonnées de contact
   - Ajoutez vos propres services
   - Personnalisez les tarifs
   - Ajoutez d'autres questions fréquentes
   ```

3. **Recréez le modèle** avec les nouvelles configurations

## Étape 5 : Intégration avec le chat widget

Le chat widget utilisera automatiquement le modèle configuré. Assurez-vous que :

1. Le nom du modèle dans `openai-config.js` correspond au nom dans OpenWebUI
2. L'URL d'OpenWebUI est correcte
3. Les paramètres sont configurés selon vos besoins

## Dépannage

### Problèmes courants :

1. **Erreur "Model not found"**
   - Vérifiez que le modèle OpenAI est bien configuré
   - Assurez-vous que la clé API est valide

2. **Erreur d'authentification**
   - Vérifiez votre clé API OpenAI
   - Assurez-vous que vous avez des crédits disponibles

3. **Réponses non préparées**
   - Vérifiez le message système dans le Modelfile
   - Testez avec des questions exactes

4. **Problème CORS**
   - Configurez OpenWebUI pour accepter les requêtes de votre domaine

### Logs utiles :

```bash
# Logs Docker OpenWebUI
docker logs open-webui

# Test API direct
curl -X GET http://localhost:8080/api/models
```

## Prochaines étapes

1. Personnalisez les réponses dans `openai-config.js`
2. Testez le chat widget avec votre modèle
3. Ajustez les paramètres selon vos besoins
4. Déployez sur votre site web
