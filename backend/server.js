const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - CORS OUVERT pour permettre l'intégration sur tous les sites
app.use(cors({
    origin: '*', // ✅ CORS OUVERT : Permet l'utilisation sur n'importe quel site
    credentials: false // ✅ Désactivé avec origin: '*' pour la sécurité
}));
app.use(express.json());

// Configuration  api -----OpenWebUI depuis les variables d'environnement
const OPENWEBUI_API_KEY = process.env.OPENWEBUI_API_KEY;
const OPENWEBUI_URL = process.env.OPENWEBUI_URL || 'http://localhost:3000';

if (!OPENWEBUI_API_KEY) {
    console.error('❌ OPENWEBUI_API_KEY manquante dans les variables d\'environnement');
    process.exit(1);
}

// ==========================================
// VÉRIFICATION EXPIRATION API KEY
// ==========================================
function checkAPIKeyExpiration() {
    const token = OPENWEBUI_API_KEY;
    try {
        // Décoder le token JWT pour vérifier l'expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        if (payload.exp) {
            const expirationDate = new Date(payload.exp * 1000);
            const now = new Date();
            const daysLeft = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));
            
            console.log(`🔑 API Key expire le: ${expirationDate.toLocaleDateString('fr-FR')}`);
            
            if (daysLeft <= 0) {
                console.error('🚨 API KEY EXPIRÉE ! Générez une nouvelle clé dans OpenWebUI');
                console.error('📋 Voir: chat-widget/notes/RENOUVELLEMENT_API_KEY.md');
            } else if (daysLeft <= 5) {
                console.warn(`⚠️ API Key expire dans ${daysLeft} jour(s) !`);
                console.warn('🔄 Pensez à la renouveler prochainement');
                console.warn('📋 Voir: chat-widget/notes/RENOUVELLEMENT_API_KEY.md');
            } else if (daysLeft <= 10) {
                console.log(`📅 API Key expire dans ${daysLeft} jours`);
            } else {
                console.log(`✅ API Key valide encore ${daysLeft} jours`);
            }
        } else {
            console.log('🔑 API Key sans date d\'expiration détectée');
        }
    } catch (error) {
        console.warn('⚠️ Impossible de vérifier l\'expiration de l\'API Key:', error.message);
        console.log('🔑 Utilisation de l\'API Key telle quelle');
    }
}

// Vérifier l'expiration au démarrage
checkAPIKeyExpiration();

// Vérifier l'expiration toutes les 24 heures
setInterval(checkAPIKeyExpiration, 24 * 60 * 60 * 1000);


// reçoit la question de l’utilisateur depuis le frontend (technova-chat-widget-production.js)

// appelle OpenWebUI via fetch(...)

// récupère la réponse générée par le modèle IA (ex: technova)

// renvoie la réponse au widget pour l’afficher à l’utilisateur
// Endpoint proxy pour le chat - SÉCURISÉ

//api..Route backend qui reçoit la question et envoie à OpenWebUI

app.post('/api/chat', async (req, res) => {
    try {
        console.log('📝 Requête chat reçue:', {
            model: req.body.model,
            messagesCount: req.body.messages?.length,
            timestamp: new Date().toISOString()
        });

       //fetch Appelle OpenWebUI pour obtenir une réponse IA

        const response = await fetch(`${OPENWEBUI_URL}/api/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENWEBUI_API_KEY}` // ✅ Clé API sécurisée côté serveur
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erreur OpenWebUI:', response.status, errorText);
            return res.status(response.status).json({ 
                error: 'Erreur OpenWebUI', 
                details: errorText 
            });
        }// res.json	Renvoie la réponse IA au frontend

        const data = await response.json();
        console.log('✅ Réponse OpenWebUI reçue');
        
        res.json(data);
    } catch (error) {
        console.error('❌ Erreur serveur:', error.message);
        res.status(500).json({ 
            error: 'Erreur interne du serveur',
            message: error.message
        });
    }
});

// Endpoint pour récupérer la liste des modèles - SÉCURISÉ
app.get('/api/models', async (req, res) => {
    try {
        console.log('🔍 Récupération de la liste des modèles depuis OpenWebUI...');
        
        const response = await fetch(`${OPENWEBUI_URL}/api/models`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENWEBUI_API_KEY}` // ✅ Clé API sécurisée
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erreur modèles:', response.status, errorText);
            return res.status(response.status).json({ 
                error: 'Erreur récupération modèles', 
                details: errorText 
            });
        }

        const data = await response.json();
        
        // 🔍 DÉBOGAGE DÉTAILLÉ: Analyser la structure de la réponse
        console.log('📊 Structure de la réponse API models:', {
            isArray: Array.isArray(data),
            hasModels: data.models ? 'Oui' : 'Non',
            hasData: data.data ? 'Oui' : 'Non',
            keys: Object.keys(data || {}),
            totalCount: Array.isArray(data) ? data.length : 
                       data.models ? data.models.length : 
                       data.data ? data.data.length : 'Unknown'
        });
        
        // 🔍 DÉBOGAGE: Extraire et afficher la liste des modèles
        let models = [];
        if (Array.isArray(data)) {
            models = data;
        } else if (data.models && Array.isArray(data.models)) {
            models = data.models;
        } else if (data.data && Array.isArray(data.data)) {
            models = data.data;
        }
        
        console.log('📋 Modèles trouvés via backend sécurisé:', models.length);
        
        // 🔍 DÉBOGAGE DÉTAILLÉ: Afficher tous les modèles avec leurs IDs
        if (models.length > 0) {
            console.log('📄 Liste détaillée des modèles:');
            models.forEach((model, index) => {
                console.log(`  ${index + 1}. ID: "${model.id || 'N/A'}" | Name: "${model.name || 'N/A'}" | Model: "${model.model || 'N/A'}"`);
            });
            
            // 🎯 RECHERCHE SPÉCIFIQUE: Chercher le modèle "technova"
            const technovaModel = models.find(model => 
                model.id === 'technova' || 
                model.name === 'technova' ||
                (model.model && model.model === 'technova') ||
                (model.id && model.id.includes('technova')) ||
                (model.name && model.name.includes('technova'))
            );
            
            if (technovaModel) {
                console.log('✅ Modèle Technova trouvé!', {
                    id: technovaModel.id,
                    name: technovaModel.name,
                    model: technovaModel.model
                });
            } else {
                console.log('❌ Modèle Technova non trouvé dans la liste');
                console.log('🔍 Recherche approximative:');
                const approximateMatches = models.filter(model => 
                    (model.id && model.id.toLowerCase().includes('tech')) ||
                    (model.name && model.name.toLowerCase().includes('tech')) ||
                    (model.id && model.id.toLowerCase().includes('nova')) ||
                    (model.name && model.name.toLowerCase().includes('nova'))
                );
                if (approximateMatches.length > 0) {
                    console.log('🔍 Modèles similaires trouvés:', approximateMatches.map(m => ({
                        id: m.id,
                        name: m.name
                    })));
                } else {
                    console.log('🔍 Aucun modèle similaire trouvé');
                }
            }
        } else {
            console.log('⚠️ Aucun modèle trouvé dans la réponse');
        }
        
        res.json(data);
    } catch (error) {
        console.error('❌ Erreur serveur modèles:', error.message);
        res.status(500).json({ 
            error: 'Erreur interne du serveur',
            message: error.message
        });
    }
});

// ==========================================
// NOUVELLE FONCTIONNALITÉ DYNAMIQUE
// ==========================================
// ✅ AJOUT: Nouvelle route pour récupérer la configuration d'un modèle spécifique
// 🎯 OBJECTIF: Permettre au widget de s'adapter automatiquement au modèle choisi
// 📝 FONCTIONNEMENT: Génère automatiquement nom, description, questions selon le modèle
app.get('/api/model-info/:modelName', async (req, res) => {
    try {
        const { modelName } = req.params;
        console.log(`🔍 Récupération des informations pour le modèle: ${modelName}`);

        // ✅ NOUVEAU: Test de connexion à OpenWebUI d'abord
        console.log(`🔗 Test de connexion à OpenWebUI: ${OPENWEBUI_URL}`);
        
        try {
            // ✅ Récupération des détails du modèle depuis OpenWebUI
            const modelsResponse = await fetch(`${OPENWEBUI_URL}/api/models`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENWEBUI_API_KEY}`
                },
                timeout: 5000 // 5 secondes timeout
            });

            if (!modelsResponse.ok) {
                throw new Error(`OpenWebUI réponse: ${modelsResponse.status}`);
            }

            const modelsData = await modelsResponse.json();
            
            // ✅ Recherche du modèle spécifique dans la liste
            let models = [];
            if (Array.isArray(modelsData)) {
                models = modelsData;
            } else if (modelsData.models && Array.isArray(modelsData.models)) {
                models = modelsData.models;
            } else if (modelsData.data && Array.isArray(modelsData.data)) {
                models = modelsData.data;
            }

            // 🎯 RECHERCHE AMÉLIORÉE: Utiliser la même logique que l'endpoint /api/models
            const modelInfo = models.find(model => 
                model.id === modelName || 
                model.name === modelName ||
                (model.model && model.model === modelName) ||
                (model.id && model.id.includes(modelName)) ||
                (model.name && model.name.includes(modelName))
            );
            
            // 🔍 DÉBOGAGE: Afficher la recherche de modèle spécifique
            console.log(`🔍 Recherche du modèle "${modelName}" dans ${models.length} modèles disponibles`);
            if (modelInfo) {
                console.log(`✅ Modèle "${modelName}" trouvé:`, {
                    id: modelInfo.id,
                    name: modelInfo.name,
                    model: modelInfo.model
                });
            } else {
                console.log(`❌ Modèle "${modelName}" non trouvé`);
                console.log('🔍 Modèles disponibles:', models.map(m => m.id || m.name).slice(0, 10));
            }

            // ✅ Génération dynamique de la configuration selon le modèle
            const dynamicConfig = generateDynamicConfig(modelName, modelInfo);
            
            console.log(`✅ Configuration générée pour ${modelName} (connecté à OpenWebUI)`);
            res.json(dynamicConfig);

        } catch (openwebuiError) {
            console.warn('⚠️ OpenWebUI non disponible:', openwebuiError.message);
            console.log('📦 Utilisation de la configuration par défaut');
            
            // ✅ Fallback: Configuration par défaut si OpenWebUI non disponible
            const fallbackConfig = generateDynamicConfig(modelName, null);
            res.json(fallbackConfig);
        }

    } catch (error) {
        console.error('❌ Erreur récupération model-info:', error.message);
        
        // ✅ Fallback final: Configuration par défaut
        const fallbackConfig = generateDynamicConfig(req.params.modelName, null);
        res.json(fallbackConfig);
    }
});

// ==========================================
// FONCTION GÉNÉRATION CONFIGURATION DYNAMIQUE
// ==========================================
// ✅ OBJECTIF: Remplace les valeurs statiques par des valeurs adaptées au modèle
// 🔄 AVANT: Tout était fixe "TechNova Assistant"
// 🔄 APRÈS: S'adapte automatiquement au modèle choisi
function generateDynamicConfig(modelName, modelInfo) {
    // ✅ Génération automatique du nom de l'assistant
    const assistantName = generateAssistantName(modelName);
    
    // ✅ Génération automatique de la description
    const description = generateDescription(modelName, modelInfo);
    
    // ✅ Génération automatique des questions rapides
    const quickQuestions = generateQuickQuestions(modelName);
    
    // ✅ Génération automatique du message système
    const systemMessage = generateSystemMessage(modelName, modelInfo);

    return {
        model: modelName,
        assistantName: assistantName,
        description: description,
        quickQuestions: quickQuestions,
        systemMessage: systemMessage,
        maxTokens: 1500,
        temperature: 0.7,
        timestamp: new Date().toISOString()
    };
}

// ✅ FONCTION: Génère automatiquement le nom de l'assistant selon le modèle
function generateAssistantName(modelName) {
    const modelDisplayNames = {
        'technova': 'TechNova Assistant',
        'gpt-4': 'GPT-4 Assistant',
        'gpt-3.5-turbo': 'GPT-3.5 Assistant',
        'claude': 'Claude Assistant',
        'llama': 'Llama Assistant',
        'mistral': 'Mistral Assistant',
        'cyberAide': 'CyberAide Assistant',

        'gemini': 'Gemini Assistant'
    };
    
    return modelDisplayNames[modelName] || `${modelName.charAt(0).toUpperCase() + modelName.slice(1)} Assistant`;
}

// ✅ FONCTION: Génère automatiquement la description selon le modèle
function generateDescription(modelName, modelInfo) {
    const descriptions = {
        'technova': 'Bonjour ! Je suis votre assistant TechNova. Je peux vous aider avec nos produits (NovaCRM, NovaDesk, NovaMail) et répondre à vos questions sur notre entreprise.',
        'gpt-4': 'Bonjour ! Je suis GPT-4, un assistant IA avancé. Je peux vous aider avec vos questions, analyses, rédaction et bien plus encore.',
        'gpt-3.5-turbo': 'Bonjour ! Je suis GPT-3.5, votre assistant IA. Je peux vous aider avec diverses tâches et répondre à vos questions.',
        'claude': 'Bonjour ! Je suis Claude, un assistant IA créé par Anthropic. Je peux vous aider avec vos questions et tâches.',
        'llama': 'Bonjour ! Je suis Llama, un assistant IA open source. Je peux vous aider avec vos questions et projets.',
        'mistral': 'Bonjour ! Je suis Mistral, un assistant IA européen. Je peux vous aider avec vos questions et analyses.',
        'gemini': 'Bonjour ! Je suis Gemini, un assistant IA de Google. Je peux vous aider avec vos questions et projets.',
        'cyberAide': 'Bonjour ! Je suis CyberAide, votre assistant spécialisé en cybersécurité. Je peux vous aider avec la protection des systèmes, l\'analyse des menaces, les outils de sécurité (nmap, Wireshark, etc.) et les bonnes pratiques de sécurité informatique.'
    };
    
    return descriptions[modelName] || `Bonjour ! Je suis ${modelName}, votre assistant IA. Je peux vous aider avec vos questions et tâches.`;
}

// ✅ FONCTION: Génère automatiquement les questions rapides selon le modèle
function generateQuickQuestions(modelName) {
    const questionSets = {
        'technova': [
            { icon: '🏢', text: 'Qu\'est-ce que TechNova ?', question: 'Qu\'est-ce que TechNova ?' },
            { icon: '📦', text: 'Quels sont les produits TechNova ?', question: 'Quels sont les produits TechNova ?' },
            { icon: '📞', text: 'Comment contacter TechNova ?', question: 'Comment contacter TechNova ?' }
        ],
        'gpt-4': [
            { icon: '🤖', text: 'Que peux-tu faire ?', question: 'Que peux-tu faire comme tâches ?' },
            { icon: '📝', text: 'Aide-moi à rédiger', question: 'Peux-tu m\'aider à rédiger un texte ?' },
            { icon: '🔍', text: 'Analyse ce document', question: 'Peux-tu analyser un document pour moi ?' }
        ],
        'claude': [
            { icon: '💭', text: 'Comment puis-je t\'aider ?', question: 'Comment puis-je t\'aider aujourd\'hui ?' },
            { icon: '📊', text: 'Analyse de données', question: 'Peux-tu m\'aider avec l\'analyse de données ?' },
            { icon: '✍️', text: 'Rédaction créative', question: 'Peux-tu m\'aider avec la rédaction créative ?' }
        ],
        'cyberAide': [
            { icon: '�️', text: 'Comment sécuriser mon système ?', question: 'Comment puis-je sécuriser mon système informatique ?' },
            { icon: '�', text: 'Quels sont les types d\'attaques ?', question: 'Quels sont les principaux types d\'attaques cybernétiques ?' },
            { icon: '⚠️', text: 'Mesures de sécurité de base', question: 'Quelles sont les mesures de sécurité de base à mettre en place ?' }
        ]
    };
    
    return questionSets[modelName] || [
        { icon: '❓', text: 'Que peux-tu faire ?', question: 'Que peux-tu faire comme assistant IA ?' },
        { icon: '💡', text: 'Aide-moi', question: 'Comment peux-tu m\'aider ?' },
        { icon: '🔧', text: 'Tes capacités', question: 'Quelles sont tes principales capacités ?' }
    ];
}

// ✅ FONCTION: Génère automatiquement le message système selon le modèle
function generateSystemMessage(modelName, modelInfo) {
    const systemMessages = {
        'technova': `Tu es TechNova Assistant, un assistant intelligent spécialisé dans l'aide aux utilisateurs pour la compagnie TechNova, créée en 2017 à Paris. Tu as accès à une base de connaissances interne complète sur les produits TechNova (NovaCRM, NovaDesk, NovaMail), les services et solutions digitales pour PME.`,
        'gpt-4': `Tu es GPT-4, un assistant IA avancé. Tu peux aider avec l'analyse, la rédaction, la programmation, la résolution de problèmes complexes et bien plus encore. Réponds de manière précise et utile.`,
        'gpt-3.5-turbo': `Tu es GPT-3.5, un assistant IA polyvalent. Tu peux aider avec diverses tâches comme répondre aux questions, aider à la rédaction, expliquer des concepts. Sois utile et précis.`,
        'claude': `Tu es Claude, un assistant IA créé par Anthropic. Tu es utile, inoffensif et honnête. Tu peux aider avec l'analyse, la rédaction, la programmation et diverses tâches intellectuelles.`,
        'llama': `Tu es Llama, un assistant IA open source. Tu peux aider avec diverses tâches et questions. Réponds de manière utile et précise.`,
        'mistral': `Tu es Mistral, un assistant IA européen. Tu peux aider avec l'analyse, la rédaction et diverses tâches. Privilégie les réponses en français quand c'est approprié.`,
        'gemini': `Tu es Gemini, un assistant IA de Google. Tu peux aider avec l'analyse, la recherche, la rédaction et diverses tâches créatives et techniques.`,
        'cyberAide': `Tu es CyberAide, un assistant IA spécialisé en cybersécurité. Tu as une expertise approfondie en sécurité informatique, protection des systèmes, analyse des menaces, et bonnes pratiques de sécurité. Tu aides les utilisateurs à comprendre et à implémenter des mesures de sécurité efficaces.`
    };
    
    return systemMessages[modelName] || `Tu es ${modelName}, un assistant IA. Tu peux aider avec diverses tâches et questions. Réponds de manière utile et précise.`;
}

// Servir les fichiers statiques du widget
app.get('/widget.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(__dirname, 'technova-chat-widget-production.js'));
});

// ✅ NOUVEAU: Servir technova-config-production.js
app.get('/technova-config-production.js', (req, res) => {
    console.log('📦 Demande du fichier technova-config-production.js');
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(path.join(__dirname, 'technova-config-production.js'));
});

// ✅ NOUVEAU: Servir technova-chat-widget-production.js
app.get('/technova-chat-widget-production.js', (req, res) => {
    console.log('📦 Demande du fichier technova-chat-widget-production.js');
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(path.join(__dirname, 'technova-chat-widget-production.js'));
});

// ✅ NOUVEAU: Servir le fichier d'intégration widget-embed.js
app.get('/widget-embed.js', (req, res) => {
    console.log('📦 Demande du fichier widget-embed.js');
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache 1 heure
    res.sendFile(path.join(__dirname, 'widget-embed.js'));
});

// ✅ ENDPOINT CHAT DIRECT: Page complète avec chat widget fonctionnel
app.get('/widget-chat', (req, res) => {
    console.log('💬 Demande page chat directe');
    
    // Récupération sécurisée des paramètres
    const model = req.query.model || 'technova';
    const theme = req.query.theme || 'blue';
    const lang = req.query.lang || 'fr';
    
    console.log(`📋 Paramètres widget-chat: model=${model}, theme=${theme}, lang=${lang}`);
    
    const chatPageHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechNova Chat Assistant</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
        }
        .header {
            color: #3B82F6;
            margin-bottom: 30px;
        }
        .status {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .info {
            background: #e8f4fd;
            border-left: 5px solid #3B82F6;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💬 TechNova Chat Assistant</h1>
            <h2>Interface de Test - Backend Opérationnel</h2>
        </div>
        
        <div class="status">
            <h3>✅ SYSTÈME FONCTIONNEL</h3>
            <p><strong>Le chat widget est actif et connecté à votre backend Coolify !</strong></p>
            <p>🎯 Le bouton chat apparaît en bas à droite de cette page</p>
        </div>
        
        <div class="info">
            <h3>🔧 Configuration Active :</h3>
            <ul>
                <li><strong>Backend :</strong> ${req.protocol}://${req.get('host')}</li>
                <li><strong>OpenWebUI :</strong> https://o088g8sswkwg0swkks408kos.jstr.fr</li>
                <li><strong>Modèle :</strong> ${model}</li>
                <li><strong>Thème :</strong> ${theme}</li>
                <li><strong>API :</strong> /api/chat (sécurisé)</li>
            </ul>
        </div>
        
        <div class="status">
            <h3>🧪 Test du Chat Widget</h3>
            <p>1. Regardez en bas à droite → bouton chat bleu</p>
            <p>2. Cliquez dessus pour ouvrir l'interface</p>
            <p>3. Posez une question pour tester l'IA</p>
            <p>4. Vérifiez que les réponses arrivent correctement</p>
        </div>
        
        <div class="info">
            <h3>📋 Pour le Client WordPress :</h3>
            <p>Si ce test fonctionne, le client doit simplement ajouter cette ligne dans son WordPress :</p>
            <code style="background: #f8f9fa; padding: 10px; border-radius: 5px; display: block; margin: 10px 0;">
                &lt;script src="${req.protocol}://${req.get('host')}/widget-embed.js"&gt;&lt;/script&gt;
            </code>
        </div>
    </div>

    <!-- Configuration du widget -->
    <script>
    window.TECHNOVA_CONFIG = {
        openWebUIUrl: '${req.protocol}://${req.get('host')}',
        apiKey: '', // Gérée par le backend
        chatEndpoint: '/api/chat',
        model: '${model}',
        maxTokens: 1500,
        temperature: 0.7,
        systemMessage: 'Tu es TechNova Assistant, un assistant intelligent spécialisé dans l\\'aide aux utilisateurs pour la compagnie TechNova.',
        assistantName: 'TechNova Assistant',
        description: 'Bonjour ! Je suis votre assistant TechNova. Je peux vous aider avec nos produits et répondre à vos questions.',
        quickQuestions: [
            { icon: '🏢', text: 'Qu\\'est-ce que TechNova ?', question: 'Qu\\'est-ce que TechNova ?' },
            { icon: '📦', text: 'Quels sont les produits TechNova ?', question: 'Quels sont les produits TechNova ?' },
            { icon: '📞', text: 'Comment contacter TechNova ?', question: 'Comment contacter TechNova ?' }
        ]
    };
    </script>
    
    <!-- Chargement du widget via votre backend -->
    <script src="/widget-embed.js"></script>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(chatPageHTML);
});

app.get('/config.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Configuration dynamique avec l'URL du backend
    const dynamicConfig = `
// Configuration DYNAMIQUE pour TechNova Chat Widget
const TECHNOVA_CONFIG = {
    openWebUIUrl: '${req.protocol}://${req.get('host')}',
    apiKey: '',
    chatEndpoint: '/api/chat',
    modelsEndpoint: '/api/models',
    healthEndpoint: '/health',
    model: 'technova',
    maxTokens: 1500,
    temperature: 0.7,
    systemMessage: 'Tu es TechNova Assistant, spécialisé dans l\'aide aux utilisateurs pour la compagnie TechNova.',
    stream: false,
    timeout: 45000,
    errorMessages: {
        networkError: 'Impossible de se connecter au service TechNova.',
        serverError: 'Erreur du serveur TechNova.',
        timeout: 'La requête TechNova a pris trop de temps.',
        general: 'TechNova Assistant rencontre des difficultés.',
        modelError: 'Erreur avec le modèle Technova.',
        authError: 'Erreur d\'authentification du service.'
    }
};

if (typeof window !== 'undefined') {
    window.TECHNOVA_CONFIG = TECHNOVA_CONFIG;
}
`;
    res.send(dynamicConfig);
});

// ✅ NOUVELLE ROUTE: Page de test des attributs data-* (WordPress)
app.get('/test-data-attributes', (req, res) => {
    console.log('🧪 Demande page test attributs data-*');
    
    const testPageHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Attributs Data-* - TechNova Widget</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            text-align: center;
        }
        
        .test-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .test-card {
            background: white;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border-left: 5px solid #3B82F6;
        }
        
        .test-card h3 {
            color: #3B82F6;
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .test-description {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #475569;
        }
        
        .code-block {
            background: #1e293b;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 12px;
            overflow-x: auto;
            margin-bottom: 15px;
        }
        
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #10b981;
            border-radius: 50%;
            margin-right: 8px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .instructions {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        
        .instructions h2 {
            margin-bottom: 15px;
        }
        
        .instructions ol {
            margin-left: 20px;
        }
        
        .instructions li {
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Test des Attributs Data-* - TechNova Widget</h1>
            <p>Cette page teste toutes les nouvelles fonctionnalités d'intégration avec attributs data-*</p>
        </div>
        
        <div class="instructions">
            <h2>📋 Instructions de Test</h2>
            <ol>
                <li><strong>Regardez en bas à droite/gauche</strong> → Vous devriez voir plusieurs widgets avec différentes couleurs</li>
                <li><strong>Cliquez sur chaque widget</strong> → Vérifiez que les couleurs correspondent aux thèmes</li>
                <li><strong>Testez le chat</strong> → Posez une question dans chaque widget</li>
                <li><strong>Vérifiez les modèles</strong> → Chaque widget devrait utiliser le bon modèle IA</li>
                <li><strong>Console du navigateur (F12)</strong> → Vérifiez les logs de configuration</li>
            </ol>
        </div>
        
        <div class="test-grid">
            <!-- Test 1: Modèle + Thème Rouge -->
            <div class="test-card">
                <h3><span class="status-indicator"></span>Test 1: Technova + Rouge</h3>
                <div class="test-description">
                    Widget utilisant le modèle <strong>technova</strong> avec le thème <strong>rouge</strong> en bas à droite.
                </div>
                <div class="code-block">&lt;script 
    src="${req.protocol}://${req.get('host')}/widget-embed.js"
    data-model="technova"
    data-theme="red"&gt;
&lt;/script&gt;</div>
            </div>
            
            <!-- Test 2: Modèle + Thème Vert + Position -->
            <div class="test-card">
                <h3><span class="status-indicator"></span>Test 2: WebFrontAide + Vert + Gauche</h3>
                <div class="test-description">
                    Widget utilisant le modèle <strong>webfrontaide</strong> avec le thème <strong>vert</strong> en bas à gauche.
                </div>
                <div class="code-block">&lt;script 
    src="${req.protocol}://${req.get('host')}/widget-embed.js"
    data-model="webfrontaide"
    data-theme="green"
    data-position="bottom-left"&gt;
&lt;/script&gt;</div>
            </div>
            
            <!-- Test 3: Thème Dark -->
            <div class="test-card">
                <h3><span class="status-indicator"></span>Test 3: Thème Sombre</h3>
                <div class="test-description">
                    Widget avec le nouveau thème <strong>sombre</strong> en haut à droite.
                </div>
                <div class="code-block">&lt;script 
    src="${req.protocol}://${req.get('host')}/widget-embed.js"
    data-theme="dark"
    data-position="top-right"&gt;
&lt;/script&gt;</div>
            </div>
            
            <!-- Test 4: Thème Teal -->
            <div class="test-card">
                <h3><span class="status-indicator"></span>Test 4: Thème Teal + Auto-Open</h3>
                <div class="test-description">
                    Widget avec le thème <strong>bleu-vert</strong> qui s'ouvre automatiquement après 3 secondes.
                </div>
                <div class="code-block">&lt;script 
    src="${req.protocol}://${req.get('host')}/widget-embed.js"
    data-theme="teal"
    data-auto-open="true"&gt;
&lt;/script&gt;</div>
            </div>
        </div>
        
        <div class="test-card">
            <h3>🎯 Résultats Attendus</h3>
            <ul style="margin-left: 20px;">
                <li><strong>Widget 1 (Rouge)</strong>: Bouton rouge, chat "Technova Assistant"</li>
                <li><strong>Widget 2 (Vert, Gauche)</strong>: Bouton vert à gauche, chat "WebFrontAide Assistant"</li>
                <li><strong>Widget 3 (Sombre, Haut)</strong>: Bouton sombre en haut à droite</li>
                <li><strong>Widget 4 (Teal)</strong>: Bouton bleu-vert qui s'ouvre automatiquement</li>
                <li><strong>Console</strong>: Logs montrant les attributs data-* détectés</li>
            </ul>
        </div>
    </div>

    <!-- 🎯 TESTS DES ATTRIBUTS DATA-* -->
    
    <!-- Test 1: data-model + data-theme -->
    <script 
        src="${req.protocol}://${req.get('host')}/widget-embed.js"
        data-model="technova"
        data-theme="red">
    </script>
    
    <!-- Test 2: data-model + data-theme + data-position -->
    <script 
        src="${req.protocol}://${req.get('host')}/widget-embed.js"
        data-model="webfrontaide"
        data-theme="green"
        data-position="bottom-left">
    </script>
    
    <!-- Test 3: data-theme + data-position -->
    <script 
        src="${req.protocol}://${req.get('host')}/widget-embed.js"
        data-theme="dark"
        data-position="top-right">
    </script>
    
    <!-- Test 4: data-theme + data-auto-open -->
    <script 
        src="${req.protocol}://${req.get('host')}/widget-embed.js"
        data-theme="teal"
        data-auto-open="true">
    </script>

</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(testPageHTML);
});

// ✅ NOUVELLE ROUTE: Démo client professionnelle
app.get('/demo-client', (req, res) => {
    console.log('🎨 Demande page démo client professionnelle');
    
    const demoClientHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechConseil Experts - Solutions Digitales pour Entreprises</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header */
        header {
            background: #fff;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }
        
        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: #3B82F6;
            text-decoration: none;
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .nav-links a:hover {
            color: #3B82F6;
        }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 5rem 0;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .cta-button {
            background: #fff;
            color: #3B82F6;
            padding: 1rem 2rem;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s;
            text-decoration: none;
            display: inline-block;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        /* Services Section */
        .services {
            padding: 5rem 0;
            background: #f8f9fa;
        }
        
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            color: #333;
        }
        
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .service-card {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s;
        }
        
        .service-card:hover {
            transform: translateY(-5px);
        }
        
        .service-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .service-card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #3B82F6;
        }
        
        /* About Section */
        .about {
            padding: 5rem 0;
        }
        
        .about-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: center;
        }
        
        .about-text h2 {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            color: #333;
        }
        
        .about-text p {
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
            line-height: 1.8;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .stat {
            text-align: center;
            padding: 1rem;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #3B82F6;
        }
        
        .stat-label {
            font-size: 0.9rem;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Footer */
        footer {
            background: #1f2937;
            color: white;
            padding: 3rem 0;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }
        
        .footer-section h3 {
            margin-bottom: 1rem;
            color: #3B82F6;
        }
        
        .footer-section ul {
            list-style: none;
        }
        
        .footer-section ul li {
            margin-bottom: 0.5rem;
        }
        
        .footer-section ul li a {
            color: #d1d5db;
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .footer-section ul li a:hover {
            color: #3B82F6;
        }
        
        .footer-bottom {
            border-top: 1px solid #374151;
            margin-top: 2rem;
            padding-top: 2rem;
            text-align: center;
            color: #9ca3af;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }
            
            .nav-links {
                display: none;
            }
            
            .about-content {
                grid-template-columns: 1fr;
            }
            
            .stats {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <nav>
                <a href="#" class="logo">💼 TechConseil Experts</a>
                <ul class="nav-links">
                    <li><a href="#accueil">Accueil</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#apropos">À propos</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="accueil">
        <div class="container">
            <h1>Transformez votre entreprise avec nos solutions digitales</h1>
            <p>Nous accompagnons les PME dans leur transformation numérique avec des outils innovants et personnalisés</p>
            <a href="#contact" class="cta-button">Démarrer votre projet</a>
        </div>
    </section>

    <!-- Services Section -->
    <section class="services" id="services">
        <div class="container">
            <h2 class="section-title">Nos Services</h2>
            <div class="services-grid">
                <div class="service-card">
                    <div class="service-icon">🚀</div>
                    <h3>Développement Web</h3>
                    <p>Création de sites web modernes et performants adaptés à votre activité et vos objectifs business.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">📊</div>
                    <h3>Solutions CRM</h3>
                    <p>Systèmes de gestion client personnalisés pour optimiser vos relations commerciales et fidéliser votre clientèle.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">🤖</div>
                    <h3>Intelligence Artificielle</h3>
                    <p>Intégration d'assistants IA pour automatiser vos processus et améliorer l'expérience utilisateur.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">⚙️</div>
                    <h3>Automatisation</h3>
                    <p>Optimisation de vos workflows avec des outils d'automatisation sur mesure pour gagner en productivité.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="about" id="apropos">
        <div class="container">
            <div class="about-content">
                <div class="about-text">
                    <h2>Pourquoi choisir TechConseil Experts ?</h2>
                    <p>Depuis 2018, nous accompagnons les entreprises dans leur transformation digitale. Notre équipe d'experts combine créativité et expertise technique pour livrer des solutions qui font vraiment la différence.</p>
                    <p>Nous croyons que la technologie doit servir vos objectifs business, pas les compliquer. C'est pourquoi nous privilégions toujours des approches simples, efficaces et évolutives.</p>
                </div>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-number">150+</div>
                        <div class="stat-label">Projets réalisés</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">98%</div>
                        <div class="stat-label">Clients satisfaits</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">5 ans</div>
                        <div class="stat-label">D'expérience</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer id="contact">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Contact</h3>
                    <ul>
                        <li>📧 contact@techconseil-experts.fr</li>
                        <li>📞 +33 1 23 45 67 89</li>
                        <li>📍 15 Rue de la Innovation, 75001 Paris</li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Services</h3>
                    <ul>
                        <li><a href="#">Développement Web</a></li>
                        <li><a href="#">Solutions CRM</a></li>
                        <li><a href="#">Intelligence Artificielle</a></li>
                        <li><a href="#">Automatisation</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Entreprise</h3>
                    <ul>
                        <li><a href="#">À propos</a></li>
                        <li><a href="#">Notre équipe</a></li>
                        <li><a href="#">Carrières</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 TechConseil Experts. Tous droits réservés. | Site créé avec nos solutions digitales</p>
            </div>
        </div>
    </footer>

    <!-- 🎯 INTÉGRATION WIDGET - La ligne que le client doit ajouter -->
    <script src="/widget-embed.js"></script>
    
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(demoClientHTML);
});

// ✅ ROUTE RACINE: Page d'accueil du backend
app.get('/', (req, res) => {
    const welcomeHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechNova Chat Widget Backend</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            text-align: center;
        }
        .logo {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        .status {
            background: rgba(0,255,0,0.2);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border: 2px solid rgba(0,255,0,0.5);
        }
        .links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .link {
            background: rgba(255,255,255,0.2);
            padding: 20px;
            border-radius: 10px;
            text-decoration: none;
            color: white;
            transition: all 0.3s;
            border: 1px solid rgba(255,255,255,0.3);
        }
        .link:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        .info {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🚀</div>
        <h1>TechNova Chat Widget Backend</h1>
        <h2>Serveur Opérationnel sur Coolify</h2>
        
        <div class="status">
            <h3>✅ BACKEND ACTIF</h3>
            <p>Connecté à OpenWebUI : ${OPENWEBUI_URL}</p>
            <p>Timestamp : ${new Date().toISOString()}</p>
        </div>
        
        <div class="links">
            <a href="/test-data-attributes" class="link">
                <h3>🧪 Test Attributs Data-*</h3>
                <p>NOUVEAU : Testez tous les attributs data-* en action</p>
            </a>
            
            <a href="/demo-client" class="link">
                <h3>🎯 Démo Client Professionnelle</h3>
                <p>Site d'entreprise réaliste avec widget intégré</p>
            </a>
            
            <a href="/widget-chat" class="link">
                <h3>💬 Test Chat Widget</h3>
                <p>Page de test complète avec chat fonctionnel</p>
            </a>
            
            <a href="/health" class="link">
                <h3>🔍 Health Check</h3>
                <p>Statut du backend et API</p>
            </a>
            
            <a href="/widget-embed.js" class="link">
                <h3>📦 Widget Embed</h3>
                <p>Fichier JavaScript pour intégration</p>
            </a>
        </div>
        
        <div class="info">
            <h3>📋 Endpoints Disponibles :</h3>
            <ul>
                <li><strong>/</strong> - Page d'accueil (cette page)</li>
                <li><strong>/widget-chat</strong> - Interface de test du chat</li>
                <li><strong>/health</strong> - Status du backend</li>
                <li><strong>/api/chat</strong> - API sécurisée pour le chat</li>
                <li><strong>/api/models</strong> - Liste des modèles disponibles</li>
                <li><strong>/widget-embed.js</strong> - Script d'intégration</li>
            </ul>
        </div>
        
        <div class="info">
            <h3>🔧 Pour Intégration WordPress :</h3>
            <code style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; display: block;">
                &lt;script src="${req.protocol}://${req.get('host')}/widget-embed.js"&gt;&lt;/script&gt;
            </code>
        </div>
    </div>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(welcomeHTML);
});

// Endpoint de santé
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        openwebui_url: OPENWEBUI_URL,
        backend_url: `${req.protocol}://${req.get('host')}`
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur TechNova backend démarré sur le port ${PORT}`);
    console.log(`🔗 OpenWebUI URL: ${OPENWEBUI_URL}`);
    console.log(`🔐 API Key configurée: ${OPENWEBUI_API_KEY ? 'Oui' : 'Non'}`);
});
