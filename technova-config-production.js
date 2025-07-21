// Configuration SÉCURISÉE pour TechNova Chat Widget (PRODUCTION)
// ✅ AUCUNE clé API exposée côté frontend !

const TECHNOVA_CONFIG = {
  // URL de VOTRE backend (pas OpenWebUI directement)
  openWebUIUrl: 'https://gkwww04kwcwc00gockw8ocw4.jstr.fr', // ✅ URL de production Coolify
  
  // ✅ AUCUNE clé API côté frontend - SÉCURISÉ !
  apiKey: '', 
  
  // Endpoints de votre backend sécurisé
  chatEndpoint: '/api/chat',           // ✅ Endpoint pour le chat
  modelsEndpoint: '/api/models',       // ✅ Endpoint pour les modèles
  healthEndpoint: '/health',           // ✅ Endpoint de santé
  // parametre model token model
  // msg ER per
  // ==========================================
  // CONFIGURATION MODÈLE - MAINTENANT DYNAMIQUE
  // ==========================================
  // ❌ ANCIEN CODE STATIQUE (commenté) - PROBLÈME: Valeur fixe, ne s'adapte pas au modèle choisi
  // model: 'technova',  // Était toujours fixe à 'technova'
  
  // ✅ NOUVEAU CODE DYNAMIQUE - SOLUTION: Sera défini automatiquement par loadModelConfig()
  model: null, // Sera mis à jour dynamiquement selon le modèle choisi dans OpenWebUI
  maxTokens: 1500,
  temperature: 0.7,
  

  // ==========================================
  // MESSAGE SYSTÈME - MAINTENANT DYNAMIQUE
  // ==========================================
  // ❌ ANCIEN CODE STATIQUE (commenté) - PROBLÈME: Message fixe pour tous les modèles
  /*
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
  */
  
  // ✅ NOUVEAU CODE DYNAMIQUE - SOLUTION: Sera généré automatiquement selon le modèle
  systemMessage: null, // Sera mis à jour dynamiquement selon le modèle choisi
  
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
  
  // ==========================================
  // QUESTIONS PRÉDÉFINIES - MAINTENANT DYNAMIQUES
  // ==========================================
  // ❌ ANCIEN CODE STATIQUE (commenté) - PROBLÈME: Questions fixes pour tous les modèles
  /*
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
  */
  
  // ✅ NOUVEAU CODE DYNAMIQUE - SOLUTION: Sera généré automatiquement selon le modèle
  predefinedQuestions: null, // Sera mis à jour dynamiquement selon le modèle choisi
  
  // ==========================================
  // NOUVELLES VARIABLES DYNAMIQUES
  // ==========================================
  // ✅ AJOUT: Variables pour stocker la configuration dynamique
  assistantName: null,    // Nom de l'assistant (ex: "TechNova Assistant", "GPT-4 Assistant")
  description: null,      // Description personnalisée selon le modèle
  currentModel: null,     // Modèle actuellement utilisé
  lastUpdate: null        // Timestamp de la dernière mise à jour
};

// ==========================================
// NOUVELLES FONCTIONS DYNAMIQUES
// ==========================================

// ✅ FONCTION PRINCIPALE: Charge la configuration d'un modèle spécifique
// 🎯 OBJECTIF: Remplace les valeurs statiques par des valeurs adaptées au modèle
// 📝 UTILISATION: loadModelConfig('gpt-4') pour charger la config GPT-4
async function loadModelConfig(modelName) {
  try {
    console.log(`🔄 Chargement de la configuration pour le modèle: ${modelName}`);
    // 1️⃣ APPEL RÉSEAU : Contact le backend
    // ✅ Appel au backend pour récupérer la configuration dynamique
    const response = await fetch(`${TECHNOVA_CONFIG.openWebUIUrl}/api/model-info/${modelName}`);
    
    if (!response.ok) {
      throw new Error(`Erreur récupération config: ${response.status}`);
    }
    // 2️⃣ RÉCUPÉRATION : Des données du modèle
    const modelConfig = await response.json();
    
    // 3️⃣ APPEL SUIVANT : Mise à jour de la configuration
    updateTechnovaConfig(modelConfig);
    
    console.log(`✅ Configuration mise à jour pour ${modelName}`);
    return modelConfig;
    
  } catch (error) {
    console.error(`❌ Erreur chargement config pour ${modelName}:`, error);
    
    // ✅ Fallback: Configuration par défaut si erreur
    const fallbackConfig = {
      model: modelName,
      assistantName: `${modelName} Assistant`,
      description: `Bonjour ! Je suis ${modelName}, votre assistant IA.`,
      quickQuestions: [
        { icon: '❓', text: 'Que peux-tu faire ?', question: 'Que peux-tu faire ?' },
        { icon: '💡', text: 'Aide-moi', question: 'Comment peux-tu m\'aider ?' }
      ],
      systemMessage: `Tu es ${modelName}, un assistant IA. Réponds de manière utile et précise.`
    };
    
    updateTechnovaConfig(fallbackConfig);
    return fallbackConfig;
  }
}

// ✅ FONCTION: Met à jour la configuration globale avec les nouvelles valeurs
// 🎯 OBJECTIF: Applique les changements à l'objet TECHNOVA_CONFIG
function updateTechnovaConfig(newConfig) {
  // ✅ Mise à jour des valeurs principales
  // ✅ MODIFICATION 1: Change le modèle
  TECHNOVA_CONFIG.model = newConfig.model;
  // ✅ MODIFICATION 2: Change le nom de l'assistant
  TECHNOVA_CONFIG.assistantName = newConfig.assistantName;
  // ✅ MODIFICATION 3: Change la description
  TECHNOVA_CONFIG.description = newConfig.description;
  // ✅ MODIFICATION 4: Change les questions rapides
  TECHNOVA_CONFIG.predefinedQuestions = newConfig.quickQuestions;
  // ✅ MODIFICATION 5: Change le message système (instructions IA)
  TECHNOVA_CONFIG.systemMessage = newConfig.systemMessage;
    // ✅ MODIFICATION 6: Stocke le modèle actuel
  TECHNOVA_CONFIG.currentModel = newConfig.model;
  // ✅ MODIFICATION 7: Timestamp de mise à jour
  TECHNOVA_CONFIG.lastUpdate = new Date().toISOString();
  
  console.log('📊 Configuration globale mise à jour:', {
    model: TECHNOVA_CONFIG.model,
    assistantName: TECHNOVA_CONFIG.assistantName,
    questionsCount: TECHNOVA_CONFIG.predefinedQuestions?.length || 0
  });
}

// ✅ FONCTION: Détecte automatiquement le modèle par défaut
// 🎯 OBJECTIF: Trouve le premier modèle disponible si aucun n'est spécifié
async function detectDefaultModel() {
  try {
    console.log('🔍 Détection du modèle par défaut...');
    
    // ✅ Récupération de la liste des modèles disponibles
    const response = await fetch(`${TECHNOVA_CONFIG.openWebUIUrl}${TECHNOVA_CONFIG.modelsEndpoint}`);
    
    if (!response.ok) {
      throw new Error(`Erreur récupération modèles: ${response.status}`);
    }
    
    const data = await response.json();
    
    // ✅ Recherche du premier modèle disponible
    let models = [];
    if (Array.isArray(data)) {
      models = data;
    } else if (data.models && Array.isArray(data.models)) {
      models = data.models;
    } else if (data.data && Array.isArray(data.data)) {
      models = data.data;
    }
    
    if (models.length > 0) {
      const defaultModel = models[0].id || models[0].name || models[0].model;
      console.log(`✅ Modèle par défaut détecté: ${defaultModel}`);
      return defaultModel;
    }
    
    throw new Error('Aucun modèle disponible');
    
  } catch (error) {
    console.error('❌ Erreur détection modèle par défaut:', error);
    return 'technova'; // Fallback
  }
}

// ✅ FONCTION: Initialise la configuration dynamique
// 🎯 OBJECTIF: Charge automatiquement la configuration au démarrage
async function initializeDynamicConfig(preferredModel = null) {
  try {
    console.log('🚀 Initialisation de la configuration dynamique...');
    
    // ✅ Détermine le modèle à utiliser
    const modelToUse = preferredModel || await detectDefaultModel();
    
    // ✅ Charge la configuration pour ce modèle
    await loadModelConfig(modelToUse);
    
    console.log('✅ Configuration dynamique initialisée');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur initialisation config dynamique:', error);
    return false;
  }
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

// ==========================================
// EXPORTS AMÉLIORÉS - INCLUT LES NOUVELLES FONCTIONS
// ==========================================
// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    TECHNOVA_CONFIG, 
    validateTechnovaConfig, 
    testTechnovaConnection,
    // ✅ NOUVELLES FONCTIONS DYNAMIQUES
    loadModelConfig,
    updateTechnovaConfig,
    detectDefaultModel,
    initializeDynamicConfig
  };
}

// Définir les variables globales pour le navigateur - SÉCURISÉES
if (typeof window !== 'undefined') {
  window.TECHNOVA_CONFIG = TECHNOVA_CONFIG;
  
  // ✅ AJOUT: Exposer les nouvelles fonctions globalement
  window.loadModelConfig = loadModelConfig;
  window.updateTechnovaConfig = updateTechnovaConfig;
  window.detectDefaultModel = detectDefaultModel;
  window.initializeDynamicConfig = initializeDynamicConfig;
  
  console.log('✅ Configuration TechNova SÉCURISÉE chargée (sans clé API exposée)');
  console.log('✅ Nouvelles fonctions dynamiques disponibles globalement');
  
  // 🚀 ACTIVATION AUTOMATIQUE: Initialiser le système dynamique au chargement
  console.log('🔄 Initialisation automatique du système dynamique...');
  
  // ✅ SOLUTION: Attendre que le DOM soit prêt puis initialiser
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('📄 DOM chargé, initialisation du système dynamique...');
      initializeDynamicConfig('webfrontaide').then(success => {
        if (success) {
          console.log('✅ Système dynamique initialisé avec succès');
          // Le déclenchement de la mise à jour visuelle
//🎯 DÉCLENCHEUR: Notifier les autres composants que la config est prête
          window.dispatchEvent(new CustomEvent('technovaConfigReady', {
            detail: { config: TECHNOVA_CONFIG }
          }));
        } else {
          console.warn('⚠️ Échec initialisation système dynamique, utilisation config par défaut');
        }
      });
    });
  } else {
    // DOM déjà chargé, initialiser immédiatement
    console.log('📄 DOM déjà chargé, initialisation immédiate...');
    setTimeout(() => {
      initializeDynamicConfig('webfrontaide').then(success => {
        if (success) {
          console.log('✅ Système dynamique initialisé avec succès');
          // 🎯 DÉCLENCHEUR: Notifier les autres composants que la config est prête
          window.dispatchEvent(new CustomEvent('technovaConfigReady', {
            detail: { config: TECHNOVA_CONFIG }
          }));
        } else {
          console.warn('⚠️ Échec initialisation système dynamique, utilisation config par défaut');
        }
      });
    }, 100); // Petit délai pour s'assurer que tout est chargé
  }
}
