// TechNova Chat Widget SÉCURISÉ pour PRODUCTION
// ✅ Utilise un backend proxy - AUCUNE clé API exposée !

(function() {
  // Chargement des styles Tailwind CSS
  document.head.insertAdjacentHTML('beforeend', '<link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.16/tailwind.min.css" rel="stylesheet">');

  // Injection du CSS personnalisé pour Technova
  const style = document.createElement('style');
  style.innerHTML = `
  .hidden {
    display: none;
  }
  #technova-chat-widget-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    flex-direction: column;
    z-index: 1000;
  }
  #technova-chat-popup {
    height: 70vh;
    max-height: 70vh;
    transition: all 0.3s;
    overflow: hidden;
    border: 2px solid #3B82F6;
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }
  #technova-chat-bubble {
    background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
    transition: all 0.3s;
  }
  #technova-chat-bubble:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
  }
  #technova-chat-header {
    background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
  }
  .technova-message-user {
    background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
    color: white;
  }
  .technova-message-assistant {
    background: #F3F4F6;
    color: #1F2937;
    border-left: 4px solid #3B82F6;
  }
  .technova-typing-indicator {
    background: #F3F4F6;
    border-left: 4px solid #3B82F6;
  }
  .technova-quick-questions {
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
  }
  .technova-quick-question-btn {
    background: #BFDBFE;
    border: 1px solid #93C5FD;
    transition: all 0.2s;
  }
  .technova-quick-question-btn:hover {
    background: #93C5FD;
    color: #1E40AF;
  }
  @media (max-width: 768px) {
    #technova-chat-popup {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
    }
  }
  `;

  document.head.appendChild(style);

  // Créer le conteneur du widget Technova
  const chatWidgetContainer = document.createElement('div');
  chatWidgetContainer.id = 'technova-chat-widget-container';
  document.body.appendChild(chatWidgetContainer);
  
  // Injection du HTML personnalisé Technova
  chatWidgetContainer.innerHTML = `
    <div id="technova-chat-bubble" class="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer text-3xl">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </div>
    <div id="technova-chat-popup" class="hidden absolute bottom-20 right-0 w-96 bg-white rounded-lg shadow-md flex flex-col transition-all text-sm">
      <div id="technova-chat-header" class="flex justify-between items-center p-4 text-white rounded-t-lg">
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <!-- ❌ ANCIEN CODE STATIQUE (commenté) - PROBLÈME: Nom fixe "TechNova Assistant" -->
          <!-- <h3 class="m-0 text-lg font-semibold">TechNova Assistant</h3> -->
          
          <!-- ✅ NOUVEAU CODE DYNAMIQUE - SOLUTION: Nom mis à jour selon le modèle -->
          <h3 id="dynamic-assistant-name" class="m-0 text-lg font-semibold">Assistant</h3>
        </div>
        <button id="technova-close-popup" class="bg-transparent border-none text-white cursor-pointer hover:bg-blue-700 rounded p-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div id="technova-welcome-message" class="p-4 bg-blue-50 border-b border-blue-200">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <!-- ❌ ANCIEN CODE STATIQUE (commenté) - PROBLÈME: Icône fixe "TN" -->
            <!-- <span class="text-white font-bold text-sm">TN</span> -->
            
            <!-- ✅ NOUVEAU CODE DYNAMIQUE - SOLUTION: Icône adaptée au modèle -->
            <span id="dynamic-assistant-icon" class="text-white font-bold text-sm">AI</span>
          </div>
          <!-- ❌ ANCIEN CODE STATIQUE (commenté) - PROBLÈME: Titre fixe "Assistant TechNova" -->
          <!-- <div class="text-sm font-medium text-blue-800">Assistant TechNova</div> -->
          
          <!-- ✅ NOUVEAU CODE DYNAMIQUE - SOLUTION: Titre adapté au modèle -->
          <div id="dynamic-assistant-title" class="text-sm font-medium text-blue-800">Assistant</div>
        </div>
        <!-- ❌ ANCIEN CODE STATIQUE (commenté) - PROBLÈME: Description fixe TechNova -->
        <!-- <p class="text-xs text-blue-700">Bonjour ! Je suis votre assistant TechNova. Je peux vous aider avec nos produits (NovaCRM, NovaDesk, NovaMail) et répondre à vos questions sur notre entreprise.</p> -->
        
        <!-- ✅ NOUVEAU CODE DYNAMIQUE - SOLUTION: Description adaptée au modèle -->
        <p id="dynamic-assistant-description" class="text-xs text-blue-700">Initialisation en cours...</p>
      </div>
      
      <div id="technova-quick-questions" class="technova-quick-questions p-3 border-b">
        <p class="text-xs font-medium text-gray-600 mb-2">Questions rapides :</p>
        <!-- ❌ ANCIEN CODE STATIQUE (commenté) - PROBLÈME: Questions fixes TechNova -->
        <!-- 
        <div class="grid grid-cols-1 gap-2">
          <button class="technova-quick-question-btn text-xs p-2 rounded text-left" data-question="Qu'est-ce que TechNova ?">
            🏢 Qu'est-ce que TechNova ?
          </button>
          <button class="technova-quick-question-btn text-xs p-2 rounded text-left" data-question="Quels sont les produits TechNova ?">
            📦 Quels sont les produits TechNova ?
          </button>
          <button class="technova-quick-question-btn text-xs p-2 rounded text-left" data-question="Comment contacter TechNova ?">
            📞 Comment contacter TechNova ?
          </button>
        </div>
        -->
        
        <!-- ✅ NOUVEAU CODE DYNAMIQUE - SOLUTION: Questions générées automatiquement -->
        <div id="dynamic-quick-questions-container" class="grid grid-cols-1 gap-2">
          <button class="technova-quick-question-btn text-xs p-2 rounded text-left" data-question="Chargement...">
            ⏳ Chargement des questions...
          </button>
        </div>
      </div>
      
      <div id="technova-chat-messages" class="flex-1 p-4 overflow-y-auto max-h-80"></div>
      
      <div id="technova-chat-input-container" class="p-4 border-t border-gray-200">
        <div class="flex space-x-2 items-center">
          <input type="text" id="technova-chat-input" class="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-gray-800" placeholder="Posez votre question sur TechNova...">
          <button id="technova-chat-submit" class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div class="flex text-center text-xs pt-2 text-gray-500">
          <span class="flex-1">Powered by TechNova AI • <a href="#" class="text-blue-600 hover:underline">À propos</a></span>
        </div>
      </div>
    </div>
  `;

  // Récupération des éléments DOM
  const chatInput = document.getElementById('technova-chat-input');
  const chatSubmit = document.getElementById('technova-chat-submit');
  const chatMessages = document.getElementById('technova-chat-messages');
  const chatBubble = document.getElementById('technova-chat-bubble');
  const chatPopup = document.getElementById('technova-chat-popup');
  const closePopup = document.getElementById('technova-close-popup');
  const quickQuestionBtns = document.querySelectorAll('.technova-quick-question-btn');

  // Configuration Technova SÉCURISÉE (utilise la config externe)
  const CONFIG = window.TECHNOVA_CONFIG || {
    openWebUIUrl: 'https://votre-backend.herokuapp.com',
    apiKey: '', // ✅ Pas de clé API côté frontend !
    chatEndpoint: '/api/chat',
    modelsEndpoint: '/api/models',
    model: 'cyberAide',
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

  // Fonction pour afficher une alerte de problème backend
  function showBackendErrorAlert() {
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; max-width: 400px; z-index: 10000; color: #991b1b;">
        <div style="font-weight: bold; margin-bottom: 8px;">🔌 Problème de connexion</div>
        <div style="font-size: 14px; margin-bottom: 12px;">Impossible de se connecter au service TechNova. Veuillez réessayer plus tard.</div>
        <div style="font-size: 12px; color: #7f1d1d;">
          Si le problème persiste, contactez l'administrateur.
        </div>
        <button onclick="this.parentElement.remove()" style="margin-top: 8px; background: #dc2626; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Fermer</button>
      </div>
    `;
    document.body.appendChild(alertDiv);
    
    // Auto-remove après 10 secondes
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 10000);
  }

  // Historique des messages
  let messageHistory = [];
  
  // Ajouter le message système
  if (CONFIG.systemMessage) {
    messageHistory.push({ role: 'system', content: CONFIG.systemMessage });
  }

  // Gestionnaires d'événements
  chatSubmit.addEventListener('click', handleUserMessage);
  
  chatInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      handleUserMessage();
    }
  });

  chatBubble.addEventListener('click', togglePopup);
  closePopup.addEventListener('click', togglePopup);

  // Gestionnaire pour les questions rapides
  quickQuestionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const question = this.dataset.question;
      chatInput.value = question;
      handleUserMessage();
    });
  });

  function togglePopup() {
    chatPopup.classList.toggle('hidden');
    if (!chatPopup.classList.contains('hidden')) {
      chatInput.focus();
    }
  }

  async function handleUserMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Masquer les questions rapides après le premier message
    const quickQuestions = document.getElementById('technova-quick-questions');
    if (quickQuestions) {
      quickQuestions.style.display = 'none';
    }

    // Afficher le message utilisateur
    displayUserMessage(message);
    
    // Vider le champ de saisie
    chatInput.value = '';
    
    // Ajouter à l'historique
    messageHistory.push({ role: 'user', content: message });
    
    // Afficher l'indicateur de frappe
    showTypingIndicator();
    
    try {
      console.log('🚀 Envoi requête SÉCURISÉE au backend:', `${CONFIG.openWebUIUrl}${CONFIG.chatEndpoint}`);
      console.log('📝 Modèle:', CONFIG.model);
      console.log('🔐 Sécurité: Aucune clé API côté frontend');
      
      // ✅ Appel SÉCURISÉ au backend (pas directement à OpenWebUI)
      const response = await fetch(`${CONFIG.openWebUIUrl}${CONFIG.chatEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // ✅ AUCUNE clé API côté frontend - SÉCURISÉ !
        },
        body: JSON.stringify({
          model: CONFIG.model,
          messages: messageHistory,
          max_tokens: CONFIG.maxTokens,
          temperature: CONFIG.temperature,
          stream: CONFIG.stream
        })
      });

      console.log('📊 Statut de la réponse backend:', response.status);
      
      hideTypingIndicator();

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        console.error('❌ Erreur backend:', response.status, errorData);
        
        // Gestion spécifique des erreurs backend
        if (response.status === 500) {
          console.error('🔥 Erreur serveur backend');
          showBackendErrorAlert();
          displayAssistantMessage(CONFIG.errorMessages.serverError);
          return;
        } else if (response.status === 503) {
          console.error('🔌 Service temporairement indisponible');
          showBackendErrorAlert();
          displayAssistantMessage('Service temporairement indisponible. Veuillez réessayer dans quelques instants.');
          return;
        }
        
        throw new Error(`Erreur HTTP: ${response.status} - ${errorData.error || 'Erreur backend'}`);
      }

      const data = await response.json();
      console.log('📥 Données reçues du backend sécurisé');
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const aiResponse = data.choices[0].message.content;
        
        // Ajouter à l'historique
        messageHistory.push({ role: 'assistant', content: aiResponse });
        
        // Afficher la réponse
        displayAssistantMessage(aiResponse);
      } else {
        console.error('❌ Format de réponse inattendu:', data);
        displayAssistantMessage('Désolé, j\'ai reçu une réponse dans un format inattendu.');
      }
      
    } catch (error) {
      console.error('❌ Erreur TechNova backend:', error);
      hideTypingIndicator();
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showBackendErrorAlert();
        displayAssistantMessage(CONFIG.errorMessages.networkError);
      } else {
        displayAssistantMessage(CONFIG.errorMessages.general + ' Détails: ' + error.message);
      }
    }
  }

  function displayUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'flex justify-end mb-3';
    messageElement.innerHTML = `
      <div class="technova-message-user rounded-lg py-2 px-4 max-w-[75%] shadow-sm">
        ${escapeHtml(message)}
      </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function displayAssistantMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'flex mb-3';
    messageElement.innerHTML = `
      <div class="flex items-start space-x-2 max-w-[75%]">
        <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span class="text-white font-bold text-xs">IA</span>
        </div>
        <div class="technova-message-assistant rounded-lg py-2 px-4 shadow-sm">
          ${escapeHtml(message)}
        </div>
      </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.id = 'technova-typing-indicator';
    typingElement.className = 'flex mb-3';
    typingElement.innerHTML = `
      <div class="flex items-start space-x-2 max-w-[75%]">
        <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span class="text-white font-bold text-xs">IA</span>
        </div>
        <div class="technova-typing-indicator rounded-lg py-2 px-4 shadow-sm">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTypingIndicator() {
    const typingIndicator = document.getElementById('technova-typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Test de connexion SÉCURISÉ avec le backend
  async function testTechnovaConnection() {
    try {
      console.log('🧪 Test de connexion backend sécurisé...');
      
      // Tester l'endpoint de santé du backend
      if (CONFIG.healthEndpoint) {
        try {
          const healthResponse = await fetch(`${CONFIG.openWebUIUrl}${CONFIG.healthEndpoint}`);
          if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('✅ Backend sécurisé accessible:', healthData);
          }
        } catch (healthError) {
          console.log('⚠️ Endpoint santé non disponible');
        }
      }
      
      // Tester l'endpoint modèles via le backend sécurisé
      const response = await fetch(`${CONFIG.openWebUIUrl}${CONFIG.modelsEndpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // ✅ AUCUNE clé API côté frontend !
        }
      });
      
      console.log('📊 Statut test backend:', response.status);
      
      if (response.ok) {
        const data = await response.json();
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
        
        console.log('🔍 Modèles trouvés via backend:', models.length);
        
        // Chercher le modèle technova
        const technovaModel = models.find(model => 
          model.id === CONFIG.model || 
          model.name === CONFIG.model ||
          (model.model && model.model === CONFIG.model)
        );
        
        if (technovaModel) {
          console.log('✅ Modèle Technova accessible via backend sécurisé');
          return true;
        } else {
          console.log('❌ Modèle Technova non trouvé');
          return false;
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur test connexion backend:', response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur test connexion backend:', error);
      return false;
    }
  }

  // ==========================================
  // NOUVELLES FONCTIONS DYNAMIQUES DU WIDGET
  // ==========================================

  // ✅ FONCTION: Met à jour l'interface utilisateur avec la configuration dynamique
  // 🎯 OBJECTIF: Remplace les éléments statiques par les valeurs du modèle actuel
  function updateWidgetUI(modelConfig) {
    try {
      console.log('🔄 Mise à jour de l\'interface utilisateur...');
      
      // ✅ Mise à jour du nom de l'assistant dans l'en-tête
      const assistantNameEl = document.getElementById('dynamic-assistant-name');
      if (assistantNameEl && modelConfig.assistantName) {
        assistantNameEl.textContent = modelConfig.assistantName;
        console.log('✅ Nom assistant mis à jour:', modelConfig.assistantName);
      }
      
      // ✅ Mise à jour de l'icône de l'assistant
      const assistantIconEl = document.getElementById('dynamic-assistant-icon');
      if (assistantIconEl) {
        const iconMap = {
          'technova': 'TN',
          'gpt-4': 'G4',
          'gpt-3.5-turbo': 'G3',
          'claude': 'CL',
          'llama': 'LL',
          'mistral': 'MI',
          'gemini': 'GM'
        };
        const icon = iconMap[modelConfig.model] || 'IA';
        assistantIconEl.textContent = icon;
        console.log('✅ Icône assistant mis à jour:', icon);
      }
      
      // ✅ Mise à jour du titre de l'assistant
      const assistantTitleEl = document.getElementById('dynamic-assistant-title');
      if (assistantTitleEl && modelConfig.assistantName) {
        assistantTitleEl.textContent = modelConfig.assistantName;
        console.log('✅ Titre assistant mis à jour:', modelConfig.assistantName);
      }
      
      // ✅ Mise à jour de la description
      const assistantDescEl = document.getElementById('dynamic-assistant-description');
      if (assistantDescEl && modelConfig.description) {
        assistantDescEl.textContent = modelConfig.description;
        console.log('✅ Description assistant mise à jour');
      }
      
      // ✅ Mise à jour des questions rapides
      updateQuickQuestions(modelConfig.quickQuestions);
      
      // ✅ Mise à jour du placeholder de l'input
      const chatInputEl = document.getElementById('technova-chat-input');
      if (chatInputEl) {
        const placeholderMap = {
          'technova': 'Posez votre question sur TechNova...',
          'gpt-4': 'Posez votre question à GPT-4...',
          'gpt-3.5-turbo': 'Posez votre question à GPT-3.5...',
          'claude': 'Posez votre question à Claude...',
          'llama': 'Posez votre question à Llama...',
          'mistral': 'Posez votre question à Mistral...',
          'gemini': 'Posez votre question à Gemini...'
        };
        const placeholder = placeholderMap[modelConfig.model] || `Posez votre question à ${modelConfig.model}...`;
        chatInputEl.placeholder = placeholder;
        console.log('✅ Placeholder input mis à jour:', placeholder);
      }
      
      console.log('✅ Interface utilisateur mise à jour avec succès');
      
    } catch (error) {
      console.error('❌ Erreur mise à jour interface:', error);
    }
  }
  
  // ✅ FONCTION: Met à jour les questions rapides dynamiquement
  // 🎯 OBJECTIF: Remplace les questions statiques par celles adaptées au modèle
  function updateQuickQuestions(quickQuestions) {
    try {
      const container = document.getElementById('dynamic-quick-questions-container');
      if (!container) return;
      
      console.log('🔄 Mise à jour des questions rapides...');
      
      // ✅ Vider le conteneur
      container.innerHTML = '';
      
      // ✅ Ajouter les nouvelles questions
      if (quickQuestions && quickQuestions.length > 0) {
        quickQuestions.forEach(q => {
          const button = document.createElement('button');
          button.className = 'technova-quick-question-btn text-xs p-2 rounded text-left';
          button.setAttribute('data-question', q.question);
          button.textContent = `${q.icon} ${q.text}`;
          
          // ✅ Ajouter le gestionnaire d'événement
          button.addEventListener('click', function() {
            const question = this.dataset.question;
            chatInput.value = question;
            handleUserMessage();
          });
          
          container.appendChild(button);
        });
        
        console.log('✅ Questions rapides mises à jour:', quickQuestions.length);
      } else {
        // ✅ Fallback si pas de questions
        const button = document.createElement('button');
        button.className = 'technova-quick-question-btn text-xs p-2 rounded text-left';
        button.setAttribute('data-question', 'Comment puis-je vous aider ?');
        button.textContent = '❓ Comment puis-je vous aider ?';
        
        button.addEventListener('click', function() {
          const question = this.dataset.question;
          chatInput.value = question;
          handleUserMessage();
        });
        
        container.appendChild(button);
        console.log('✅ Question rapide par défaut ajoutée');
      }
      
    } catch (error) {
      console.error('❌ Erreur mise à jour questions rapides:', error);
    }
  }

  // ✅ FONCTION: Initialise le widget avec la configuration dynamique
  // 🎯 OBJECTIF: Charge automatiquement la configuration au démarrage du widget
  async function initializeWidget() {
    try {
      console.log('🚀 Initialisation du widget dynamique...');
      
      // ✅ Vérifier si les fonctions dynamiques sont disponibles
      if (typeof window.initializeDynamicConfig === 'function') {
        console.log('✅ Fonctions dynamiques disponibles');
        
        // ✅ Initialiser la configuration dynamique
        const success = await window.initializeDynamicConfig();
        
        if (success) {
          console.log('✅ Configuration dynamique initialisée');
          
          // ✅ Mettre à jour l'interface avec la nouvelle configuration
          const currentConfig = {
            model: CONFIG.model,
            assistantName: CONFIG.assistantName,
            description: CONFIG.description,
            quickQuestions: CONFIG.predefinedQuestions
          };
          
          updateWidgetUI(currentConfig);
          
          // ✅ Mettre à jour l'historique des messages avec le nouveau système
          messageHistory = [];
          if (CONFIG.systemMessage) {
            messageHistory.push({ role: 'system', content: CONFIG.systemMessage });
          }
          
          console.log('✅ Widget initialisé avec la configuration dynamique');
        } else {
          console.log('⚠️ Fallback: Configuration statique utilisée');
        }
      } else {
        console.log('⚠️ Fonctions dynamiques non disponibles - utilisation configuration statique');
      }
      
    } catch (error) {
      console.error('❌ Erreur initialisation widget dynamique:', error);
      console.log('⚠️ Fallback: Configuration statique utilisée');
    }
  }

  // ✅ FONCTION: Permet de changer de modèle dynamiquement
  // 🎯 OBJECTIF: Facilite le changement de modèle sans recharger la page
  async function switchModel(modelName) {
    try {
      console.log(`🔄 Changement vers le modèle: ${modelName}`);
      
      // ✅ Vérifier si les fonctions dynamiques sont disponibles
      if (typeof window.loadModelConfig === 'function') {
        // ✅ Charger la nouvelle configuration
        const newConfig = await window.loadModelConfig(modelName);
        
        // ✅ Mettre à jour l'interface
        updateWidgetUI(newConfig);
        
        // ✅ Réinitialiser l'historique des messages
        messageHistory = [];
        if (CONFIG.systemMessage) {
          messageHistory.push({ role: 'system', content: CONFIG.systemMessage });
        }
        
        console.log(`✅ Modèle changé vers: ${modelName}`);
        return true;
      } else {
        console.error('❌ Fonctions dynamiques non disponibles');
        return false;
      }
      
    } catch (error) {
      console.error(`❌ Erreur changement modèle vers ${modelName}:`, error);
      return false;
    }
  }

  // ✅ EXPOSITION DES FONCTIONS GLOBALEMENT
  // 🎯 OBJECTIF: Permet l'utilisation des fonctions depuis l'extérieur
  if (typeof window !== 'undefined') {
    window.updateWidgetUI = updateWidgetUI;
    window.switchModel = switchModel;
    window.initializeWidget = initializeWidget;
  }

  // ==========================================
  // INITIALISATION AMÉLIORÉE - MAINTENANT DYNAMIQUE
  // ==========================================
  console.log('✅ TechNova Chat Widget SÉCURISÉ initialisé (Production)');
  console.log('🔐 Sécurité: Aucune clé API exposée côté frontend');
  console.log('🔧 Configuration backend:', {
    url: CONFIG.openWebUIUrl,
    chatEndpoint: CONFIG.chatEndpoint,
    modelsEndpoint: CONFIG.modelsEndpoint
  });
  
  // ✅ NOUVEAU: Écouter l'événement de configuration prête
  console.log('🔄 Attente de la configuration dynamique...');
  
  // ✅ SOLUTION: Écouter l'événement technovaConfigReady
  window.addEventListener('technovaConfigReady', function(event) {
    console.log('🎉 Configuration dynamique reçue !', event.detail.config);
    
    // ✅ Mettre à jour l'interface avec la nouvelle configuration
    const modelConfig = {
      model: event.detail.config.model,
      assistantName: event.detail.config.assistantName,
      description: event.detail.config.description,
      quickQuestions: event.detail.config.predefinedQuestions
    };
     // 🔄 APPEL SUIVANT: Mise à jour de l'interface
    updateWidgetUI(modelConfig);
    
    // ✅ Mettre à jour l'historique des messages avec le nouveau système
    messageHistory = [];
    if (event.detail.config.systemMessage) {
      messageHistory.push({ role: 'system', content: event.detail.config.systemMessage });
    }
    
    console.log('✅ Widget mis à jour avec la configuration dynamique');
    
    // ✅ Test de connexion après configuration
    testTechnovaConnection().then(result => {
      if (result) {
        console.log('🎉 Test de connexion backend sécurisé réussi !');
      } else {
        console.log('⚠️ Test de connexion backend échoué - vérifiez le backend');
      }
    });
  });
  
  // ✅ FALLBACK: Si la configuration n'est pas prête après 3 secondes
  setTimeout(() => {
    if (!window.TECHNOVA_CONFIG || !window.TECHNOVA_CONFIG.model) {
      console.log('⚠️ Configuration dynamique non reçue - initialisation par défaut');
      initializeWidget().then(() => {
        console.log('✅ Widget initialisé avec configuration par défaut');
      });
    }
  }, 3000);
  
  // ✅ MANUEL: Fonction pour forcer l'initialisation si nécessaire
  function forceInitialization() {
    console.log('🔄 Initialisation forcée du widget...');
    initializeWidget().then(() => {
      console.log('✅ Widget forcé initialisé');
    });
  }
  
  // ✅ Exposer la fonction globalement
  window.forceInitialization = forceInitialization;
  
})();
