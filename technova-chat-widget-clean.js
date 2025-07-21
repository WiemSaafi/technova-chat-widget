// TechNova Chat Widget - Version propre sans erreurs
(function() {
  // CSS Styles
  const style = document.createElement('style');
  style.innerHTML = `
    .hidden { display: none; }
    #technova-chat-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
    #technova-chat-popup {
      width: 350px;
      height: 500px;
      background: white;
      border: 2px solid #3B82F6;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
      display: none;
      flex-direction: column;
    }
    #technova-chat-bubble {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
    }
    #technova-chat-header {
      background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
      color: white;
      padding: 15px;
      border-radius: 12px 12px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #technova-chat-messages {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      max-height: 300px;
    }
    #technova-chat-input-container {
      padding: 15px;
      border-top: 1px solid #e5e7eb;
    }
    #technova-chat-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      margin-bottom: 10px;
    }
    #technova-chat-submit {
      background: #3B82F6;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      width: 100%;
    }
    .technova-message-user {
      background: #3B82F6;
      color: white;
      padding: 8px 12px;
      border-radius: 12px;
      margin: 5px 0;
      text-align: right;
      margin-left: 50px;
    }
    .technova-message-bot {
      background: #f3f4f6;
      color: #1f2937;
      padding: 8px 12px;
      border-radius: 12px;
      margin: 5px 0;
      margin-right: 50px;
      border-left: 4px solid #3B82F6;
    }
  `;
  document.head.appendChild(style);

  // Create widget container
  const container = document.createElement('div');
  container.id = 'technova-chat-widget-container';
  container.innerHTML = `
    <div id="technova-chat-bubble">
      💬
    </div>
    <div id="technova-chat-popup">
      <div id="technova-chat-header">
        <h3>TechNova Assistant</h3>
        <button id="technova-close">×</button>
      </div>
      <div id="technova-chat-messages"></div>
      <div id="technova-chat-input-container">
        <input type="text" id="technova-chat-input" placeholder="Posez votre question...">
        <button id="technova-chat-submit">Envoyer</button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // Get elements
  const bubble = document.getElementById('technova-chat-bubble');
  const popup = document.getElementById('technova-chat-popup');
  const closeBtn = document.getElementById('technova-close');
  const input = document.getElementById('technova-chat-input');
  const submit = document.getElementById('technova-chat-submit');
  const messages = document.getElementById('technova-chat-messages');

  // Config
  const CONFIG = {
    backendUrl: 'https://gkwww04kwcwc00gockw8ocw4.jstr.fr',
    chatEndpoint: '/api/chat',
    model: 'technova'
  };

  // Event listeners
  bubble.addEventListener('click', function() {
    popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
  });

  closeBtn.addEventListener('click', function() {
    popup.style.display = 'none';
  });

  submit.addEventListener('click', sendMessage);
  
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Functions
  function addMessage(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'technova-message-user' : 'technova-message-bot';
    messageDiv.textContent = content;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, true);
    input.value = '';

    try {
      const response = await fetch(CONFIG.backendUrl + CONFIG.chatEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: CONFIG.model,
          messages: [
            { role: 'system', content: 'Tu es un assistant IA utile.' },
            { role: 'user', content: message }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          addMessage(data.choices[0].message.content, false);
        } else {
          addMessage('Erreur: Format de réponse inattendu', false);
        }
      } else {
        addMessage('Erreur: Impossible de contacter le serveur', false);
      }
    } catch (error) {
      addMessage('Erreur: ' + error.message, false);
    }
  }

  console.log('TechNova Chat Widget chargé avec succès');
})();
