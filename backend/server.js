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
        res.json(data);
    } catch (error) {
        console.error('❌ Erreur serveur modèles:', error.message);
        res.status(500).json({ 
            error: 'Erreur interne du serveur',
            message: error.message
        });
    }
});

// Servir les fichiers statiques du widget
app.get('/widget.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(__dirname, '..', 'technova-chat-widget-production.js'));
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
