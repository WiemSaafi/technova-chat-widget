// Configuration SÉCURISÉE pour TechNova Chat Widget (PRODUCTION)
// ✅ AUCUNE clé API exposée côté frontend !

const TECHNOVA_CONFIG = {
  // URL de VOTRE backend (pas OpenWebUI directement)
  openWebUIUrl: 'http://localhost:3001', // ✅ Pour test local (changez pour production)
  
  // ✅ AUCUNE clé API côté frontend - SÉCURISÉ !
  apiKey: '', 
  
  // Endpoints de votre backend sécurisé
  chatEndpoint: '/api/chat',           // ✅ Endpoint pour le chat
  modelsEndpoint: '/api/models',       // ✅ Endpoint pour les modèles
  healthEndpoint: '/health',           // ✅ Endpoint de santé
  // parametre model token model
  // msg ER per
  // Configuration du modèle

  model: 'technova',
  maxTokens: 1500,
  temperature: 0.7,
  

  // Message système personnalisé pour TechNova
  systemMessage: `Tu es TechNova Assistant, un assistant intelligent spécialisé dans l'aide aux utilisateurs pour la compagnie TechNova, créée en 2017 à Paris. 

Tu as accès à une base de connaissances interne complète sur :
- Les produits TechNova (NovaCRM, NovaDesk, NovaMail)
- Les services et solutions digitales pour PME
- Les procédures internes et FAQ
- Les valeurs et objectifs de l'entreprise

INSTRUCTIONS IMPORTANTES :
1. Base toujours tes réponses sur la base de connaissances fournie
2. Réponds de manière précise et cohérente
3. Aide avec l'onboarding des nouveaux employés
4. Fournis des informations métier sur les produits Nova
5. Représente fidèlement la culture et les objectifs de TechNova
6. Si une question dépasse tes connaissances, indique poliment que tu n'as pas assez d'informations

Tu es idéal pour les clients, employés, ou toute personne cherchant à comprendre rapidement l'univers TechNova.`,
  
  // Paramètres spécifiques pour TechNova
  stream: false,
  timeout: 45000,
  
  // Messages d'erreur personnalisés TechNova - SÉCURISÉS
  errorMessages: {
    networkError: 'Impossible de se connecter au service TechNova. Vérifiez votre connexion.',
    serverError: 'Erreur du serveur TechNova. Veuillez réessayer plus tard.',
    timeout: 'La requête TechNova a pris trop de temps. Veuillez réessayer.',
    general: 'TechNova Assistant rencontre des difficultés techniques. Veuillez réessayer.',
    modelError: 'Erreur avec le modèle Technova. Veuillez contacter le support.',
    authError: 'Erreur d\'authentification du service. Veuillez contacter l\'administrateur.'
  },
  
  // Questions prédéfinies spécifiques à TechNova
  predefinedQuestions: [
    {
      question: "Qu'est-ce que TechNova ?",
      answer: "TechNova est une entreprise créée en 2017 à Paris, spécialisée dans les solutions digitales pour PME. Nous proposons une suite de produits incluant NovaCRM, NovaDesk et NovaMail pour optimiser la gestion d'entreprise."
    },
    {
      question: "Quels sont les produits TechNova ?",
      answer: "TechNova propose trois produits principaux : NovaCRM (gestion de la relation client), NovaDesk (service client et ticketing), et NovaMail (solution de messagerie professionnelle)."
    },
    {
      question: "Comment contacter TechNova ?",
      answer: "Vous pouvez nous contacter via notre site web, par email à support@technova.com, ou par téléphone. Notre équipe support est disponible pour vous accompagner."
    },
    {
      question: "Où est située TechNova ?",
      answer: "TechNova a été créée en 2017 et est basée à Paris, France. Nous servons des clients dans toute l'Europe avec nos solutions digitales."
    }
  ]
};

// Fonction pour valider la configuration Technova SÉCURISÉE
function validateTechnovaConfig() {
  const requiredFields = ['openWebUIUrl', 'model', 'chatEndpoint'];
  const missingFields = requiredFields.filter(field => !TECHNOVA_CONFIG[field]);
  
  if (missingFields.length > 0) {
    console.error('Configuration Technova incomplète. Champs manquants:', missingFields);
    return false;
  }
  
  // ✅ Vérifier qu'aucune clé API n'est exposée
  if (TECHNOVA_CONFIG.apiKey && TECHNOVA_CONFIG.apiKey.length > 0) {
    console.warn('⚠️ ATTENTION: Une clé API est définie côté frontend - NON SÉCURISÉ !');
  }
  
  return true;
}

// Fonction pour tester la connexion avec le backend SÉCURISÉ
async function testTechnovaConnection() {
  try {
    console.log('🧪 Test de connexion au backend sécurisé...');
    
    // Tester l'endpoint de santé du backend
    const healthResponse = await fetch(`${TECHNOVA_CONFIG.openWebUIUrl}${TECHNOVA_CONFIG.healthEndpoint}`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend accessible:', healthData);
    } else {
      console.warn('⚠️ Backend endpoint santé non disponible');
    }
    
    // Tester l'endpoint des modèles via le backend sécurisé
    const modelsResponse = await fetch(`${TECHNOVA_CONFIG.openWebUIUrl}${TECHNOVA_CONFIG.modelsEndpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // ✅ AUCUNE clé API côté frontend !
      }
    });
    
    console.log('📊 Statut test modèles:', modelsResponse.status);
    
    if (modelsResponse.ok) {
      const data = await modelsResponse.json();
      console.log('📋 Réponse modèles via backend sécurisé');
      
      // Vérifier si la réponse est un tableau
      let models = [];
      if (Array.isArray(data)) {
        models = data;
      } else if (data.models && Array.isArray(data.models)) {
        models = data.models;
      } else if (data.data && Array.isArray(data.data)) {
        models = data.data;
      }
      
      console.log('🔍 Modèles trouvés:', models.length);
      
      // Chercher le modèle technova
      const technovaModel = models.find(model => 
        model.id === TECHNOVA_CONFIG.model || 
        model.name === TECHNOVA_CONFIG.model ||
        (model.model && model.model === TECHNOVA_CONFIG.model)
      );
      
      if (technovaModel) {
        console.log('✅ Modèle Technova trouvé via backend sécurisé:', technovaModel);
        return true;
      } else {
        console.log('❌ Modèle Technova non trouvé');
        return false;
      }
    } else {
      const errorText = await modelsResponse.text();
      console.error('❌ Erreur test connexion backend:', modelsResponse.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur test connexion:', error);
    return false;
  }
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TECHNOVA_CONFIG, validateTechnovaConfig, testTechnovaConnection };
}

// Définir la variable globale pour le navigateur - SÉCURISÉE
if (typeof window !== 'undefined') {
  window.TECHNOVA_CONFIG = TECHNOVA_CONFIG;
  console.log('✅ Configuration TechNova SÉCURISÉE chargée (sans clé API exposée)');
}
