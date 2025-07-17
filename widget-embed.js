// TechNova Chat Widget - Code d'Intégration Universel
// 🎯 OBJECTIF: Intégration simple comme Tawk.to
// 📝 UTILISATION: Un seul fichier à charger depuis n'importe quel site

(function() {
    // 🔧 Configuration par défaut (peut être surchargée)
    const defaultConfig = {
        backendUrl: 'http://localhost:3001',
        model: 'cyberAide',
        position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
        theme: 'blue', // blue, green, purple, orange
        showWelcome: true,
        autoOpen: false,
        language: 'fr'
    };

    // 📋 Récupération de la configuration utilisateur
    const userConfig = window.TechnovaConfig || {};
    const config = { ...defaultConfig, ...userConfig };

    console.log('🚀 TechNova Widget Embed chargé avec la configuration:', config);

    // 🎨 Styles CSS selon le thème
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
        }
    };

    const currentTheme = themes[config.theme] || themes.blue;

    // 🎯 Création du style CSS dynamique
    const createStyles = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            /* TechNova Widget Embed Styles */
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
                background: linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%);
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

    // 🏗️ Création du conteneur principal
    const createWidget = () => {
        const container = document.createElement('div');
        container.className = `technova-embed-container technova-embed-position-${config.position}`;
        container.id = 'technova-embed-widget';

        // 💬 Bouton de chat
        const bubble = document.createElement('button');
        bubble.className = 'technova-embed-bubble';
        bubble.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.36 14.99 3.01 16.28L2.12 21.06C2.04 21.42 2.39 21.77 2.75 21.69L7.53 20.8C8.82 21.45 10.27 21.81 11.81 21.81C17.33 21.81 21.81 17.33 21.81 11.81C21.81 6.29 17.33 1.81 11.81 1.81H12V2Z" fill="currentColor"/>
                <path d="M8 11H16M8 15H13" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;

        // 🖼️ iFrame pour le chat
        const iframe = document.createElement('iframe');
        iframe.className = `technova-embed-iframe technova-embed-iframe-${config.position} technova-embed-hidden`;
        iframe.src = `${config.backendUrl}/widget-chat?model=${config.model}&theme=${config.theme}&lang=${config.language}`;
        iframe.title = 'TechNova Assistant';

        // 📢 Notification (optionnelle)
        const notification = document.createElement('div');
        notification.className = 'technova-embed-notification technova-embed-hidden';
        notification.textContent = '1';

        // 🔗 Assemblage
        container.appendChild(bubble);
        container.appendChild(iframe);
        container.appendChild(notification);

        // 🎯 Gestionnaire d'événements
        bubble.addEventListener('click', () => {
            iframe.classList.toggle('technova-embed-hidden');
            notification.classList.add('technova-embed-hidden');
            
            // 📊 Analytics (optionnel)
            if (window.gtag) {
                window.gtag('event', 'chat_opened', {
                    event_category: 'engagement',
                    event_label: 'technova_widget'
                });
            }
        });

        // 📬 Écouter les messages de l'iframe
        window.addEventListener('message', (event) => {
            if (event.origin !== new URL(config.backendUrl).origin) return;
            
            const { type, data } = event.data;
            
            switch (type) {
                case 'resize':
                    iframe.style.width = data.width + 'px';
                    iframe.style.height = data.height + 'px';
                    break;
                case 'close':
                    iframe.classList.add('technova-embed-hidden');
                    break;
                case 'notification':
                    notification.textContent = data.count;
                    notification.classList.remove('technova-embed-hidden');
                    break;
            }
        });

        return container;
    };

    // 🚀 Initialisation
    const init = () => {
        // ✅ Vérifier que le DOM est prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // ✅ Vérifier si le widget n'est pas déjà présent
        if (document.getElementById('technova-embed-widget')) {
            console.warn('⚠️ TechNova Widget déjà présent sur la page');
            return;
        }

        // ✅ Créer les styles et le widget
        createStyles();
        const widget = createWidget();
        document.body.appendChild(widget);

        // ✅ Ouverture automatique (optionnelle)
        if (config.autoOpen) {
            setTimeout(() => {
                widget.querySelector('.technova-embed-iframe').classList.remove('technova-embed-hidden');
            }, 2000);
        }

        // ✅ Afficher notification de bienvenue (optionnelle)
        if (config.showWelcome) {
            setTimeout(() => {
                widget.querySelector('.technova-embed-notification').classList.remove('technova-embed-hidden');
            }, 5000);
        }

        console.log('✅ TechNova Widget Embed initialisé avec succès');
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
            const iframe = document.querySelector('.technova-embed-iframe');
            if (iframe) {
                iframe.src = `${config.backendUrl}/widget-chat?model=${modelName}&theme=${config.theme}&lang=${config.language}`;
            }
        }
    };

    // 🚀 Démarrage
    init();
})();
