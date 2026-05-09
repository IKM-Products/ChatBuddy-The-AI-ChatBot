const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

/**
 * Appends a message bubble to the chat window
 * @param {string} text - The message content
 * @param {string} sender - 'user' or 'bot'
 */
function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    
    // Auto-scroll to the latest message
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

/**
 * Handles the user input and fetches AI response from the local backend
 */
async function handleChat() {
    const message = userInput.value.trim();
    
    // Prevent sending empty messages
    if (!message) return;

    // 1. Show user message
    appendMessage(message, 'user');
    userInput.value = '';

    // 2. Create and show typing indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot');
    loadingDiv.innerText = 'ChatBuddy is thinking...';
    chatWindow.appendChild(loadingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        // 3. Request response from your Node.js backend
        // This URL matches your backend port (3000) exactly
        const response = await fetch('http://127.0.0.1:3000/chat', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        // Check if the server returned a success status
        if (!response.ok) throw new Error('Server issues');

        const data = await response.json();

        // 4. Clean up: Remove loading indicator safely and show AI response
        if (chatWindow.contains(loadingDiv)) {
            chatWindow.removeChild(loadingDiv);
        }
        appendMessage(data.text, 'bot');

    } catch (error) {
        // Handle connection or server errors
        if (chatWindow.contains(loadingDiv)) {
            chatWindow.removeChild(loadingDiv);
        }
        appendMessage("Sorry, I'm having trouble connecting right now. Is the server running?", 'bot');
        console.error("Fetch error:", error);
    }
}

// Event Listeners
sendBtn.addEventListener('click', handleChat);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleChat();
    }
});