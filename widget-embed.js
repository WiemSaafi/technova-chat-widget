// TechNova Chat Widget - Code d'Intégration Universel REFACTORISÉ
// 🎯 OBJECTIF: Interface créée immédiatement + réponses toujours affichées
// 📝 UTILISATION: Un seul fichier à charger depuis n'importe quel site
// 🔧 VERSION: WordPress Compatible avec interface garantie

(function() {
    // 🛡️ PROTECTION ULTRA-RENFORCÉE CONTRE LES ERREURS D'EXTENSIONS DE NAVIGATEUR
    const originalConsoleError = console.error;
    
    // Intercepter TOUTES les erreurs d'extensions
    window.addEventListener('error', (e) => {
        if (e.message && (
            e.message.includes('extension') || 
            e.message.includes('chrome-extension') ||
            e.message.includes('runtime.lastError') ||
            e.message.includes('message channel closed') ||
            e.message.includes('listener indicated')
        )) {
            console.log('🔕 TechNova: Erreur d\'extension/runtime ignorée:', e.message);
            e.preventDefault();
            e.stopPropagation();
            return true;
        }
    });
    
    // Protection console.error pour éviter les logs d'extensions
    console.error = function(...args) {
        const message = args.join(' ');
        if (message.includes('extension') || message.includes('runtime.lastError')) {
            console.log('🔕 Extension error filtered:', message);
            return;
        }
        originalConsoleError.apply(console, args);
    };
    
    // Protection unhandledrejection
    window.addEventListener('unhandledrejection', (e) => {
        if (e.reason && e.reason.message && e.reason.message.includes('extension')) {
            console.log('🔕 Extension promise rejection ignored');
            e.preventDefault();
            return true;
        }
    });
    
    // 🔍 DIAGNOSTIC WORDPRESS AUTOMATIQUE
    const wordPressDiagnostic = () => {
        console.log('🔍 DIAGNOSTIC TECHNOVA WORDPRESS:');
        console.log('- jQuery disponible:', typeof jQuery !== 'undefined');
        console.log('- Document prêt:', document.readyState);
        console.log('- WPCode détecté:', !!document.querySelector('script[src*="wpcode"]'));
        console.log('- Extensions actives:', typeof chrome !== 'undefined' && chrome.runtime ? 'Oui' : 'Non');
        console.log('- URL actuelle:', window.location.href);
    };
    
    // Lancer le diagnostic
    wordPressDiagnostic();

    // 🆕 LECTURE DES PARAMÈTRES DATA-* DU SCRIPT - VERSION AMÉLIORÉE
    let currentScript = document.currentScript;
    
    // 🔧 FALLBACK : Si currentScript ne fonctionne pas (WordPress/WPCode), chercher par src
    if (!currentScript) {
        const scripts = document.querySelectorAll('script[src*="widget-embed.js"]');
        currentScript = scripts[scripts.length - 1]; // Prendre le dernier script
        console.log('🔄 Fallback script detection:', currentScript);
    }
    
    const scriptAttributes = {
        model: currentScript ? currentScript.getAttribute('data-model') : null,
        url: currentScript ? currentScript.getAttribute('data-url') : null,
        theme: currentScript ? currentScript.getAttribute('data-theme') : null,
        position: currentScript ? currentScript.getAttribute('data-position') : null,
        language: currentScript ? currentScript.getAttribute('data-language') : null,
        autoOpen: currentScript ? currentScript.getAttribute('data-auto-open') === 'true' : null,
        showWelcome: currentScript ? currentScript.getAttribute('data-welcome') !== 'false' : null
    };

    console.log('🔍 Script utilisé pour détection:', currentScript);
    console.log('🔍 Attributs data-* détectés:', scriptAttributes);
    
    // 🔧 LOG DÉTAILLÉ pour le modèle
    if (scriptAttributes.model) {
        console.log(`✅ MODÈLE DÉTECTÉ: "${scriptAttributes.model}" - sera utilisé !`);
    } else {
        console.log('⚠️ Aucun data-model détecté, utilisation du modèle par défaut');
    }
    
    // 🔧 LOG DÉTAILLÉ pour le thème
    if (scriptAttributes.theme) {
        console.log(`✅ THÈME DÉTECTÉ: "${scriptAttributes.theme}" - sera utilisé !`);
    } else {
        console.log('⚠️ Aucun data-theme détecté, utilisation du thème par défaut');
    }

    // 🔧 Configuration par défaut (peut être surchargée par data-* et TechnovaConfig)
    const defaultConfig = {
        backendUrl: scriptAttributes.url || 'https://gkwww04kwcwc00gockw8ocw4.jstr.fr',
        model: scriptAttributes.model || 'assistant',
        apiKey: scriptAttributes.apiKey || currentScript?.getAttribute('data-api-key') || null,
        position: scriptAttributes.position || 'bottom-right',
        theme: scriptAttributes.theme || 'blue',
        showWelcome: scriptAttributes.showWelcome !== null ? scriptAttributes.showWelcome : true,
        autoOpen: scriptAttributes.autoOpen !== null ? scriptAttributes.autoOpen : false,
        language: scriptAttributes.language || 'fr'
    };

    // 📋 Récupération de la configuration utilisateur (pour compatibilité descendante)
    const userConfig = window.TechnovaConfig || {};
    
    // ✨ NOUVEAU : Ordre de priorité - data-* > userConfig > defaultConfig
    const config = { 
        ...defaultConfig, 
        ...userConfig
        // Les data-* sont déjà intégrés dans defaultConfig avec la priorité maximale
    };

    console.log('📊 Configuration finale:', config);

    // 🎨 Styles CSS selon le thème - ÉTENDU avec plus de choix
    const themes = {
        blue: {
            primary: '#3B82F6',
            secondary: '#1E40AF',
            accent: '#BFDBFE'
        },
        green: {
            primary: '#10B981',
            secondary: '#059669',
            accent: '#A7F3D0'
        },
        purple: {
            primary: '#8B5CF6',
            secondary: '#7C3AED',
            accent: '#C4B5FD'
        },
        orange: {
            primary: '#F59E0B',
            secondary: '#D97706',
            accent: '#FCD34D'
        },
        red: {
            primary: '#EF4444',
            secondary: '#DC2626',
            accent: '#FCA5A5'
        },
        pink: {
            primary: '#EC4899',
            secondary: '#DB2777',
            accent: '#F9A8D4'
        },
        yellow: {
            primary: '#F59E0B',
            secondary: '#D97706',
            accent: '#FDE68A'
        },
        dark: {
            primary: '#374151',
            secondary: '#111827',
            accent: '#9CA3AF'
        },
        teal: {
            primary: '#14B8A6',
            secondary: '#0F766E',
            accent: '#99F6E4'
        }
    };

    const currentTheme = themes[config.theme] || themes.blue;

    // 🎯 Création du style CSS dynamique
    const createStyles = (themeColors) => {
        // Supprimer l'ancien style s'il existe
        const existingStyle = document.getElementById('technova-dynamic-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'technova-dynamic-styles';
        style.innerHTML = `
            /* TechNova Widget Embed Styles - DYNAMIQUE */
            .technova-embed-container {
                position: fixed;
                z-index: 2147483647;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .technova-embed-position-bottom-right {
                bottom: 20px;
                right: 20px;
            }
            
            .technova-embed-position-bottom-left {
                bottom: 20px;
                left: 20px;
            }
            
            .technova-embed-position-top-right {
                top: 20px;
                right: 20px;
            }
            
            .technova-embed-position-top-left {
                top: 20px;
                left: 20px;
            }
            
            .technova-embed-bubble {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 100%);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                border: none;
                color: white;
                font-size: 24px;
            }
            
            .technova-embed-bubble:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
            }
            
            .technova-embed-iframe {
                width: 400px;
                height: 600px;
                border: none;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                background: white;
                position: absolute;
                transition: all 0.3s ease;
            }
            
            .technova-embed-iframe-bottom-right {
                bottom: 80px;
                right: 0;
            }
            
            .technova-embed-iframe-bottom-left {
                bottom: 80px;
                left: 0;
            }
            
            .technova-embed-iframe-top-right {
                top: 80px;
                right: 0;
            }
            
            .technova-embed-iframe-top-left {
                top: 80px;
                left: 0;
            }
            
            .technova-embed-hidden {
                display: none;
            }
            
            .technova-embed-notification {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #EF4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                animation: technova-pulse 2s infinite;
            }
            
            @keyframes technova-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            /* Styles du chat intégré */
            .technova-chat-header {
                background: linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 100%);
                color: white;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 12px 12px 0 0;
            }
            
            .technova-chat-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .technova-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background 0.2s;
            }
            
            .technova-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .technova-chat-body {
                flex: 1;
                display: flex;
                flex-direction: column;
                height: calc(600px - 60px);
            }
            
            .technova-chat-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                max-height: 300px;
                background: white;
            }
            
            .technova-welcome-message {
                background: linear-gradient(135deg, ${themeColors.accent}20 0%, ${themeColors.accent}30 100%);
                border: 1px solid ${themeColors.accent};
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 16px;
                text-align: center;
            }
            
            .technova-welcome-message h4 {
                margin: 0 0 8px 0;
                color: ${themeColors.secondary};
                font-size: 16px;
            }
            
            .technova-welcome-message p {
                margin: 0;
                color: ${themeColors.secondary};
                font-size: 14px;
                line-height: 1.5;
            }
            
            .technova-message {
                margin-bottom: 12px;
                display: flex;
                flex-direction: column;
            }
            
            .technova-message-user {
                align-items: flex-end;
            }
            
            .technova-message-assistant {
                align-items: flex-start;
            }
            
            .technova-message-content {
                max-width: 85%;
                padding: 10px 14px;
                border-radius: 16px;
                font-size: 14px;
                line-height: 1.4;
                word-wrap: break-word;
            }
            
            .technova-message-user .technova-message-content {
                background: linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 100%);
                color: white;
                border-bottom-right-radius: 4px;
            }
            
            .technova-message-assistant .technova-message-content {
                background: #F3F4F6;
                color: #1F2937;
                border-bottom-left-radius: 4px;
                border-left: 4px solid ${themeColors.primary};
            }
            
            .technova-quick-questions {
                padding: 16px;
                border-top: 1px solid #e5e7eb;
                background: #f9fafb;
            }
            
            .technova-quick-questions h4 {
                margin: 0 0 8px 0;
                font-size: 12px;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .technova-questions-grid {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            
            .technova-quick-question {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 8px 12px;
                font-size: 12px;
                color: #374151;
                cursor: pointer;
                transition: all 0.2s;
                text-align: left;
            }
            
            .technova-quick-question:hover {
                background: ${themeColors.primary};
                color: white;
                border-color: ${themeColors.primary};
            }
            
            .technova-chat-input-container {
                padding: 16px;
                border-top: 1px solid #e5e7eb;
                background: white;
                border-radius: 0 0 12px 12px;
            }
            
            .technova-input-wrapper {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            
            .technova-chat-input {
                flex: 1;
                border: 1px solid #d1d5db;
                border-radius: 24px;
                padding: 10px 16px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            }
            
            .technova-chat-input:focus {
                border-color: ${themeColors.primary};
            }
            
            .technova-send-btn {
                background: linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 100%);
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s;
            }
            
            .technova-send-btn:hover {
                transform: scale(1.05);
            }
            
            .technova-send-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }
            
            .technova-loading {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 14px;
                background: #F3F4F6;
                border-radius: 16px;
                border-bottom-left-radius: 4px;
                max-width: 85%;
                font-size: 14px;
                color: #6b7280;
            }
            
            .technova-loading-dots {
                display: flex;
                gap: 4px;
            }
            
            .technova-loading-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #9ca3af;
                animation: technova-bounce 1.4s infinite ease-in-out both;
            }
            
            .technova-loading-dot:nth-child(1) { animation-delay: -0.32s; }
            .technova-loading-dot:nth-child(2) { animation-delay: -0.16s; }
            
            @keyframes technova-bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }

            @media (max-width: 768px) {
                .technova-embed-iframe {
                    width: 100vw;
                    height: 100vh;
                    border-radius: 0;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 2147483647;
                }
            }
        `;
        document.head.appendChild(style);
    };

    // 🚀 ★★★ NOUVELLE APPROCHE : INTERFACE BASIQUE IMMÉDIATE ★★★
    const createBasicWidget = () => {
        console.log('🚀 Création de l\'interface basique IMMÉDIATE');
        
        // Vérifier si le widget n'existe pas déjà
        if (document.getElementById('technova-embed-widget')) {
            console.warn('⚠️ Widget déjà présent, abandon création');
            return null;
        }

        // 1. Créer les styles immédiatement
        createStyles(currentTheme);
        
        // 2. Créer le conteneur principal
        const container = document.createElement('div');
        container.className = `technova-embed-container technova-embed-position-${config.position}`;
        container.id = 'technova-embed-widget';

        // 3. Créer le bouton flottant
        const bubble = document.createElement('button');
        bubble.className = 'technova-embed-bubble';
        bubble.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.36 14.99 3.01 16.28L2.12 21.06C2.04 21.42 2.39 21.77 2.75 21.69L7.53 20.8C8.82 21.45 10.27 21.81 11.81 21.81C17.33 21.81 21.81 17.33 21.81 11.81C21.81 6.29 17.33 1.81 11.81 1.81H12V2Z" fill="currentColor"/>
                <path d="M8 11H16M8 15H13" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;

        // 4. Créer l'interface de chat BASIQUE (sera enrichie plus tard)
        const chatInterface = document.createElement('div');
        chatInterface.className = `technova-embed-iframe technova-embed-iframe-${config.position} technova-embed-hidden`;
        
        // ✅ CRUCIAL : Créer immédiatement la structure avec #technova-messages
        chatInterface.innerHTML = `
            <div class="technova-chat-header">
                <h3>💬 Assistant</h3>
                <button class="technova-close-btn">×</button>
            </div>
            
            <div class="technova-chat-body">
                <div class="technova-chat-messages" id="technova-messages">
                    <div class="technova-welcome-message">
                        <h4>👋 Bienvenue !</h4>
                        <p>Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider ?</p>
                    </div>
                </div>
                
                <div class="technova-quick-questions">
                    <h4>Questions rapides</h4>
                    <div class="technova-questions-grid">
                        <button class="technova-quick-question" data-question="Que peux-tu faire ?">
                            ❓ Que peux-tu faire ?
                        </button>
                        <button class="technova-quick-question" data-question="Comment peux-tu m'aider ?">
                            💡 Comment peux-tu m'aider ?
                        </button>
                        <button class="technova-quick-question" data-question="Quelles sont tes capacités ?">
                            🔧 Quelles sont tes capacités ?
                        </button>
                    </div>
                </div>
                
                <div class="technova-chat-input-container">
                    <div class="technova-input-wrapper">
                        <input 
                            type="text" 
                            class="technova-chat-input"
                            placeholder="Posez votre question..."
                            maxlength="500"
                        >
                        <button class="technova-send-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 5. Créer la notification
        const notification = document.createElement('div');
        notification.className = 'technova-embed-notification technova-embed-hidden';
        notification.textContent = '1';

        // 6. Assembler le widget
        container.appendChild(bubble);
        container.appendChild(chatInterface);
        container.appendChild(notification);

        // 7. Ajouter au DOM IMMÉDIATEMENT
        document.body.appendChild(container);
        
        console.log('✅ Interface basique créée - #technova-messages disponible');
        
        // 8. Attacher les événements immédiatement
        attachBasicEvents(container);
        
        return container;
    };

    // 🔧 Attachement des événements de base
    const attachBasicEvents = (container) => {
        console.log('⚡ Attachement événements de base');
        
        const bubble = container.querySelector('.technova-embed-bubble');
        const chatInterface = container.querySelector('.technova-embed-iframe');
        const closeBtn = container.querySelector('.technova-close-btn');
        const sendBtn = container.querySelector('.technova-send-btn');
        const input = container.querySelector('.technova-chat-input');
        const quickQuestions = container.querySelectorAll('.technova-quick-question');
        const notification = container.querySelector('.technova-embed-notification');
        
        // Bouton d'ouverture/fermeture
        if (bubble) {
            bubble.addEventListener('click', () => {
                console.log('🖱️ Bouton chat cliqué');
                chatInterface.classList.toggle('technova-embed-hidden');
                notification.classList.add('technova-embed-hidden');
                
                // Focus sur l'input si le chat s'ouvre
                if (!chatInterface.classList.contains('technova-embed-hidden')) {
                    setTimeout(() => input && input.focus(), 100);
                }
            });
        }
        
        // Bouton fermer
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('🔄 Fermeture du chat');
                chatInterface.classList.add('technova-embed-hidden');
            });
        }
        
        // Bouton envoyer
        if (sendBtn) {
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🚀 Bouton envoyer cliqué');
                sendMessage();
            });
        }
        
        // Input Enter
        if (input) {
            input.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    console.log('🚀 Enter pressée');
                    sendMessage();
                }
            });
        }
        
        // Questions rapides
        quickQuestions.forEach((button, index) => {
            const question = button.getAttribute('data-question');
            if (question) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`🚀 Question rapide cliquée: ${question}`);
                    
                    // Feedback visuel
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 150);
                    
                    sendQuickQuestion(question);
                });
            }
        });
        
        console.log('✅ Événements de base attachés');
    };

    // 🔄 ★★★ ENRICHISSEMENT ASYNCHRONE (EN PARALLÈLE) ★★★
    const enrichWidgetAsync = async () => {
        console.log('🎨 Enrichissement asynchrone du widget...');
        
        try {
            // Récupérer les infos du modèle depuis l'API
            const modelInfo = await getModelInfo(config.model);
            
            // Mettre à jour l'interface avec les infos récupérées
            updateWidgetWithModelInfo(modelInfo);
            
            console.log('✅ Widget enrichi avec succès');
            
        } catch (error) {
            console.warn('⚠️ Enrichissement échoué, widget reste fonctionnel:', error.message);
        }
    };
    
    // 📝 Mise à jour du widget avec les infos du modèle
    const updateWidgetWithModelInfo = (modelInfo) => {
        console.log('🔄 Mise à jour avec infos modèle:', modelInfo);
        
        // Mettre à jour le titre
        const header = document.querySelector('#technova-embed-widget .technova-chat-header h3');
        if (header && modelInfo.assistantName) {
            header.textContent = `💬 ${modelInfo.assistantName}`;
        }
        
        // Mettre à jour le message de bienvenue
        const welcomeMessage = document.querySelector('#technova-embed-widget .technova-welcome-message');
        if (welcomeMessage && modelInfo.description) {
            welcomeMessage.innerHTML = `
                <h4>👋 Bienvenue !</h4>
                <p>${modelInfo.description}</p>
            `;
        }
        
        // Mettre à jour les questions rapides
        const questionsGrid = document.querySelector('#technova-embed-widget .technova-questions-grid');
        if (questionsGrid && modelInfo.quickQuestions) {
            questionsGrid.innerHTML = modelInfo.quickQuestions.map(q => `
                <button class="technova-quick-question" data-question="${q.question}">
                    ${q.icon} ${q.text}
                </button>
            `).join('');
            
            // Réattacher les événements sur les nouvelles questions
            questionsGrid.querySelectorAll('.technova-quick-question').forEach(button => {
                const question = button.getAttribute('data-question');
                if (question) {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log(`🚀 Question rapide enrichie cliquée: ${question}`);
                        
                        button.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            button.style.transform = 'scale(1)';
                        }, 150);
                        
                        sendQuickQuestion(question);
                    });
                }
            });
        }
        
        // Sauvegarder pour utilisation dans sendToAPI
        currentModelInfo = modelInfo;
        
        console.log('✅ Interface mise à jour avec les infos du modèle');
    };

    // 🔄 Récupération des infos dynamiques du modèle depuis l'API
    const getModelInfo = async (modelName) => {
        try {
            console.log(`🔍 Récupération des infos pour le modèle: ${modelName}`);
            
            const response = await fetch(`${config.backendUrl}/api/model-info/${modelName}`);
            
            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }
            
            const modelInfo = await response.json();
            console.log('✅ Infos modèle reçues:', modelInfo);
            
            return modelInfo;
        } catch (error) {
            console.warn('⚠️ Erreur récupération infos modèle:', error);
            
            // Fallback - Configuration par défaut si l'API ne répond pas
            return {
                assistantName: `${config.model.charAt(0).toUpperCase() + config.model.slice(1)} Assistant`,
                description: `Bonjour ! Je suis votre assistant ${config.model}. Comment puis-je vous aider ?`,
                quickQuestions: [
                    { icon: '❓', text: 'Que peux-tu faire ?', question: 'Que peux-tu faire comme assistant IA ?' },
                    { icon: '💡', text: 'Aide-moi', question: 'Comment peux-tu m\'aider ?' },
                    { icon: '🔧', text: 'Tes capacités', question: 'Quelles sont tes principales capacités ?' }
                ]
            };
        }
    };

    // 🚀 ★★★ INITIALISATION NOUVELLE VERSION ★★★
    const init = () => {
        console.log('🚀 Initialisation NOUVELLE VERSION - Interface immédiate');
        
        // Vérifier si le widget n'est pas déjà présent
        if (document.getElementById('technova-embed-widget')) {
            console.warn('⚠️ TechNova Widget déjà présent sur la page');
            return;
        }

        // 1. ✅ CRÉER L'INTERFACE IMMÉDIATEMENT (synchrone)
        const widget = createBasicWidget();
        
        if (!widget) {
            console.error('❌ Échec création du widget');
            return;
        }

        // 2. ✅ ENRICHIR EN PARALLÈLE (asynchrone, sans bloquer)
        enrichWidgetAsync();

        // 3. ✅ FONCTIONNALITÉS OPTIONNELLES
        // Ouverture automatique (optionnelle)
        if (config.autoOpen) {
            setTimeout(() => {
                const iframe = widget.querySelector('.technova-embed-iframe');
                if (iframe) {
                    iframe.classList.remove('technova-embed-hidden');
                }
            }, 2000);
        }

        // Afficher notification de bienvenue (optionnelle)
        if (config.showWelcome) {
            setTimeout(() => {
                const notification = widget.querySelector('.technova-embed-notification');
                if (notification) {
                    notification.classList.remove('technova-embed-hidden');
                }
            }, 5000);
        }

        console.log('✅ Widget initialisé avec interface immédiate');
    };

    // 📨 Variables globales pour le chat
    let isLoading = false;
    let messages = [];
    let currentModelInfo = null;

    // 🚀 ★★★ FONCTIONS GLOBALES OPTIMISÉES ★★★
    // 📝 Fonction pour envoyer un message - VERSION GARANTIE
    const sendMessage = async () => {
        console.log('⚡ sendMessage - Démarrage');
        const input = document.querySelector('.technova-chat-input');
        
        if (!input) {
            console.error('❌ Input de chat introuvable');
            return;
        }
        
        const message = input.value.trim();
        
        if (!message) {
            console.log('⚠️ Message vide - annulation');
            return;
        }
        
        if (isLoading) {
            console.log('⚠️ Chargement en cours - attente...');
            return;
        }
        
        console.log('✅ Message à envoyer:', message);
        
        // Actions instantanées
        addMessage('user', message);
        input.value = '';
        showLoading();
        
        // Envoi vers API
        try {
            await sendToAPI(message);
        } catch (error) {
            console.error('❌ Erreur envoi message:', error);
            hideLoading();
        }
    };

    // ⚡ Fonction pour questions rapides - VERSION GARANTIE
    const sendQuickQuestion = async (question) => {
        console.log('🚀 QUESTION RAPIDE - Traitement:', question);
        
        if (!question) {
            console.error('❌ Question vide');
            return;
        }
        
        console.log('✅ Question sélectionnée:', question);
        
        // Ajouter directement le message sans passer par l'input
        addMessage('user', question);
        showLoading();
        
        // Envoi direct vers l'API
        try {
            await sendToAPI(question);
        } catch (error) {
            console.error('❌ Erreur question rapide:', error);
            hideLoading();
            addMessage('assistant', '❌ Erreur lors de l\'envoi de votre question. Veuillez réessayer.');
        }
    };

    // 💬 ★★★ FONCTION ADDMESSAGE GARANTIE ★★★
    const addMessage = (role, content) => {
        console.log(`📝 Ajout message ${role}:`, content.substring(0, 50) + '...');
        
        // ✅ VÉRIFICATION ET CRÉATION FORCÉE si nécessaire
        let messagesContainer = document.getElementById('technova-messages');
        
        if (!messagesContainer) {
            console.warn('⚠️ Container #technova-messages introuvable - vérification du widget');
            
            // Vérifier si le widget principal existe
            const widget = document.getElementById('technova-embed-widget');
            if (!widget) {
                console.error('❌ Widget principal introuvable - recréation');
                init(); // Recréer le widget
                messagesContainer = document.getElementById('technova-messages');
            }
        }
        
        if (!messagesContainer) {
            console.error('❌ IMPOSSIBLE de trouver ou créer #technova-messages');
            return;
        }
        
        // ✅ Créer le message
        const messageDiv = document.createElement('div');
        messageDiv.className = `technova-message technova-message-${role}`;
        
        messageDiv.innerHTML = `
            <div class="technova-message-content">
                ${content}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Sauvegarder dans l'historique
        messages.push({ role, content });
        
        console.log('✅ Message ajouté avec succès');
    };

    // ⏳ Afficher le loading
    const showLoading = () => {
        const messagesContainer = document.getElementById('technova-messages');
        if (!messagesContainer) {
            console.warn('⚠️ Container messages introuvable pour loading');
            return;
        }
        
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'technova-message technova-message-assistant';
        loadingDiv.id = 'technova-loading-message';
        
        loadingDiv.innerHTML = `
            <div class="technova-loading">
                <span>Assistant répond</span>
                <div class="technova-loading-dots">
                    <div class="technova-loading-dot"></div>
                    <div class="technova-loading-dot"></div>
                    <div class="technova-loading-dot"></div>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        isLoading = true;
    };

    // 🚫 Masquer le loading
    const hideLoading = () => {
        const loadingMessage = document.getElementById('technova-loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }
        isLoading = false;
    };

    // 🚀 SYSTÈME DE COMMUNICATION ULTRA-ROBUSTE AVEC RETRY CORS
    const sendWithRetry = async (url, options, retries = 3) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`🔄 Tentative ${attempt}/${retries} vers ${url}`);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
                
                // 🛡️ OPTIONS RENFORCÉES POUR CORS
                const corsOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    mode: 'cors',
                    credentials: 'omit',
                    ...options,
                    signal: controller.signal
                };
                
                console.log(`📡 Envoi requête avec options CORS:`, {
                    method: corsOptions.method,
                    headers: corsOptions.headers,
                    mode: corsOptions.mode,
                    url: url
                });
                
                const response = await fetch(url, corsOptions);
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                console.log(`✅ Requête réussie (tentative ${attempt})`);
                return response;
                
            } catch (error) {
                console.warn(`⚠️ Tentative ${attempt} échouée:`, error.message);
                
                // 🔍 DIAGNOSTIC DÉTAILLÉ DES ERREURS CORS
                if (error.message.includes('CORS')) {
                    console.error('🚨 ERREUR CORS DÉTECTÉE:', {
                        message: error.message,
                        url: url,
                        attempt: attempt,
                        userAgent: navigator.userAgent
                    });
                }
                
                // Si c'est une erreur d'extension, on ignore
                if (error.message && error.message.includes('extension')) {
                    console.log('🔕 Erreur d\'extension ignorée lors du fetch');
                    continue;
                }
                
                // Si c'est la dernière tentative, on lance l'erreur
                if (attempt === retries) {
                    throw error;
                }
                
                // Attendre avant la prochaine tentative (backoff exponentiel)
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 3000);
                console.log(`⏳ Attente de ${delay}ms avant retry...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };

    // 🚀 Envoyer à l'API backend - VERSION OPENWEBUI COMPATIBLE
    const sendToAPI = async (userMessage) => {
        try {
            // ✅ ENDPOINT OPENWEBUI CORRECT VIA BACKEND
            const endpoint = `${config.backendUrl}/api/chat`;
            console.log('🔗 Envoi vers Backend → OpenWebUI:', endpoint);
            
            // 🔄 Message système dynamique selon le modèle
            const systemMessage = currentModelInfo && currentModelInfo.systemMessage 
                ? currentModelInfo.systemMessage 
                : `Tu es ${config.model}, un assistant IA. Tu peux aider avec diverses tâches et questions. Réponds de manière utile et précise.`;
            
            console.log('🎯 Message système utilisé:', systemMessage.substring(0, 50) + '...');
            
            // ✅ FORMAT OPENAI COMPATIBLE POUR OPENWEBUI
            const requestData = {
                model: config.model,
                messages: [
                    {
                        role: 'system',
                        content: systemMessage
                    },
                    ...messages.slice(-6), // Garder seulement les 6 derniers messages
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                max_tokens: 1500,
                temperature: 0.7,
                stream: false
            };

            console.log('📋 Données envoyées:', requestData);
            
            // ✅ HEADERS AVEC AUTHENTIFICATION BEARER SI API KEY DISPONIBLE
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            
            // 🔑 AJOUT AUTHENTIFICATION BEARER SI API KEY EXISTE
            if (config.apiKey) {
                headers['Authorization'] = `Bearer ${config.apiKey}`;
                console.log('🔑 Authentification Bearer ajoutée');
            } else {
                console.log('ℹ️ Pas d\'API key - Connexion via backend sécurisé');
            }
            
            // 🔄 UTILISER LE SYSTÈME DE RETRY
            const response = await sendWithRetry(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestData)
            }, 3);
            
            hideLoading();
            
            const data = await response.json();
            console.log('✅ Réponse reçue:', data);
            
            // 🔧 EXTRACTION ROBUSTE DU MESSAGE
            let assistantMessage = '';
            
            // ✅ TENTATIVE 1: Format OpenAI standard
            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                assistantMessage = data.choices[0].message.content;
                console.log('✅ Format OpenAI détecté');
            }
            // ✅ TENTATIVE 2: Format OpenWebUI direct
            else if (data.response) {
                assistantMessage = data.response;
                console.log('✅ Format OpenWebUI détecté');
            }
            // ✅ TENTATIVE 3: Format content direct
            else if (data.content) {
                assistantMessage = data.content;
                console.log('✅ Format content détecté');
            }
            // ✅ TENTATIVE 4: Format message direct
            else if (data.message) {
                assistantMessage = data.message;
                console.log('✅ Format message détecté');
            }
            // ✅ TENTATIVE 5: Si c'est directement un string
            else if (typeof data === 'string' && data.length > 0) {
                assistantMessage = data;
                console.log('✅ Format string direct détecté');
            }
            else {
                console.error('❌ Format de réponse API non reconnu:', data);
                assistantMessage = '❌ Réponse reçue mais format inattendu. Vérifiez la console pour les détails.';
            }
            
            // ✅ VERIFICATION FINALE du message
            if (!assistantMessage || assistantMessage.trim() === '') {
                console.error('❌ Message extrait VIDE!');
                assistantMessage = '❌ Réponse reçue mais contenu vide. Vérifiez la configuration du modèle.';
            }
            
            console.log('📝 Message FINAL extrait:', {
                length: assistantMessage.length,
                preview: assistantMessage.substring(0, 100) + (assistantMessage.length > 100 ? '...' : '')
            });
            
            // 🎯 AFFICHAGE FORCÉ avec vérification
            try {
                addMessage('assistant', assistantMessage);
                console.log('✅ Message ajouté à l\'interface avec succès');
                
                // Vérifier que le message apparaît bien dans le DOM
                setTimeout(() => {
                    const messages = document.querySelectorAll('.technova-message-assistant');
                    console.log(`🔍 Nombre total de messages assistant dans le DOM: ${messages.length}`);
                    if (messages.length > 0) {
                        const lastMessage = messages[messages.length - 1];
                        console.log('✅ Dernier message visible:', lastMessage.textContent.substring(0, 50) + '...');
                    }
                }, 100);
                
            } catch (error) {
                console.error('❌ Erreur lors de l\'ajout du message à l\'interface:', error);
                // Fallback: essayer d'afficher directement
                const messagesContainer = document.getElementById('technova-messages');
                if (messagesContainer) {
                    messagesContainer.innerHTML += `
                        <div class="technova-message technova-message-assistant">
                            <div class="technova-message-content">${assistantMessage}</div>
                        </div>
                    `;
                    console.log('🔄 Message ajouté via fallback');
                }
            }
            
        } catch (error) {
            hideLoading();
            console.error('❌ Erreur chat finale:', error);
            
            // 🎯 MESSAGES D'ERREUR SPÉCIFIQUES
            let errorMessage = '❌ Désolé, je rencontre des difficultés techniques.';
            
            if (error.message.includes('404')) {
                errorMessage = `🔍 Service introuvable - Vérifiez la configuration: ${config.backendUrl}`;
            } else if (error.message.includes('401') || error.message.includes('403')) {
                errorMessage = '🔑 Erreur d\'authentification - Vérifiez la configuration.';
            } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
                errorMessage = '⚙️ Erreur serveur - Le service rencontre un problème temporaire.';
            } else if (error.name === 'AbortError') {
                errorMessage = '⏰ Timeout - La réponse prend trop de temps.';
            } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
                errorMessage = '🌐 Impossible de joindre le service - Vérifiez votre connexion.';
            } else if (error.message.includes('CORS')) {
                errorMessage = '🔒 Erreur CORS - Configuration serveur requise.';
            }
            
            console.log('💡 INFO DE DÉBOGAGE:');
            console.log(`- URL Backend: ${config.backendUrl}`);
            console.log(`- Modèle configuré: ${config.model}`);
            console.log(`- API Key présente: ${config.apiKey ? 'Oui' : 'Non'}`);
            
            addMessage('assistant', errorMessage + ' (Détails: ' + error.message + ')');
        }
    };

    // 🎯 Fonction globale pour contrôler le widget
    window.TechnovaWidget = {
        open: () => {
            const iframe = document.querySelector('.technova-embed-iframe');
            if (iframe) iframe.classList.remove('technova-embed-hidden');
        },
        close: () => {
            const iframe = document.querySelector('.technova-embed-iframe');
            if (iframe) iframe.classList.add('technova-embed-hidden');
        },
        toggle: () => {
            const iframe = document.querySelector('.technova-embed-iframe');
            if (iframe) iframe.classList.toggle('technova-embed-hidden');
        },
        setModel: (modelName) => {
            config.model = modelName;
            console.log('🔄 Modèle changé pour:', modelName);
        }
    };

    // 🚀 ★★★ DÉMARRAGE NOUVELLE VERSION ★★★
    const wordPressCompatibleInit = () => {
        console.log('🔄 Initialisation WordPress-compatible NOUVELLE VERSION...');
        
        // Attendre que l'environnement soit minimal
        let attempts = 0;
        const maxAttempts = 5; // Réduit pour plus de réactivité
        
        const tryInit = () => {
            attempts++;
            
            // Vérifier si l'environnement est minimal pour fonctionner
            const isMinimallyReady = document.body && !document.getElementById('technova-embed-widget');
            
            if (isMinimallyReady || attempts >= maxAttempts) {
                console.log(`✅ Initialisation après ${attempts} tentatives`);
                init();
            } else {
                console.log(`⏳ Attente environnement (${attempts}/${maxAttempts})...`);
                setTimeout(tryInit, 100); // Réduit à 100ms
            }
        };
        
        tryInit();
    };

    // 🚀 DÉMARRAGE IMMÉDIAT
    if (document.readyState === 'loading') {
        // Document pas encore prêt
        document.addEventListener('DOMContentLoaded', wordPressCompatibleInit);
    } else {
        // Document prêt ou en cours - démarrer rapidement
        setTimeout(wordPressCompatibleInit, 50); // Démarrage très rapide
    }

    console.log('🚀 TechNova Widget Embed REFACTORISÉ chargé - Interface garantie !');

})();
