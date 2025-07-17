const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:8080',
        'http://127.0.0.1:5500',
        'http://127.0.0.1:8080',
        'null', // Pour les fichiers ouverts directement (file://)
        process.env.FRONTEND_URL
    ].filter(Boolean), // Accepter plusieurs origins
    credentials: true
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
    res.sendFile(path.join(__dirname, '..', 'technova-chat-widget-production.js'));
});

// ✅ NOUVEAU: Servir le fichier d'intégration widget-embed.js
app.get('/widget-embed.js', (req, res) => {
    console.log('📦 Demande du fichier widget-embed.js');
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache 1 heure
    res.sendFile(path.join(__dirname, '..', 'widget-embed.js'));
});

// ✅ NOUVEAU: Endpoint pour l'iframe du chat widget
app.get('/widget-chat', (req, res) => {
    const { model = 'technova', theme = 'blue', lang = 'fr' } = req.query;
    
    console.log('🖼️ Demande iframe chat widget:', { model, theme, lang });
    
    // ✅ Génération HTML pour l'iframe
    const iframeHTML = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechNova Chat Widget</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: white;
            height: 100vh;
            overflow: hidden;
        }
        
        .iframe-container {
            position: relative;
            width: 100%;
            height: 100%;
        }
        
        .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #f3f4f6;
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: #6b7280;
            transition: all 0.2s;
        }
        
        .close-btn:hover {
            background: #e5e7eb;
            color: #374151;
        }
        
        #technova-chat-widget-container {
            position: static !important;
            width: 100% !important;
            height: 100% !important;
        }
        
        #technova-chat-popup {
            position: static !important;
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            display: flex !important;
        }
        
        #technova-chat-bubble {
            display: none !important;
        }
    </style>
</head>
<body>
    <div class="iframe-container">
        <button class="close-btn" onclick="closeWidget()">×</button>
        <div id="chat-container"></div>
    </div>
    
    <!-- Chargement de la configuration dynamique -->
    <script>
        // Configuration pour l'iframe
        window.TECHNOVA_CONFIG = {
            openWebUIUrl: '${req.protocol}://${req.get('host')}',
            apiKey: '',
            chatEndpoint: '/api/chat',
            modelsEndpoint: '/api/models',
            healthEndpoint: '/health',
            model: '${model}',
            maxTokens: 1500,
            temperature: 0.7,
            systemMessage: 'Tu es un assistant IA spécialisé.',
            stream: false,
            timeout: 45000,
            errorMessages: {
                networkError: 'Impossible de se connecter au service.',
                serverError: 'Erreur du serveur.',
                timeout: 'La requête a pris trop de temps.',
                general: 'L\'assistant rencontre des difficultés.',
                modelError: 'Erreur avec le modèle.',
                authError: 'Erreur d\'authentification.'
            }
        };
        
        // Fonction pour fermer le widget
        function closeWidget() {
            parent.postMessage({ type: 'close' }, '*');
        }
        
        // Fonction pour redimensionner l'iframe
        function resizeIframe(width, height) {
            parent.postMessage({ type: 'resize', data: { width, height } }, '*');
        }
        
        // Fonction pour envoyer une notification
        function sendNotification(count) {
            parent.postMessage({ type: 'notification', data: { count } }, '*');
        }
    </script>
    
    <!-- Chargement du widget -->
    <script src="/technova-config-production.js"></script>
    <script src="/technova-chat-widget-production.js"></script>
    
    <script>
        // Initialisation spécifique pour l'iframe
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🖼️ Widget iframe initialisé');
            
            // Ouvrir automatiquement le chat dans l'iframe
            setTimeout(() => {
                const chatPopup = document.getElementById('technova-chat-popup');
                if (chatPopup) {
                    chatPopup.classList.remove('hidden');
                    console.log('✅ Chat ouvert dans l\'iframe');
                }
            }, 1000);
        });
    </script>
</body>
</html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN'); // Sécurité iframe
    res.send(iframeHTML);
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
