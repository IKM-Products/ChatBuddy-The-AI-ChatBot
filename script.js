const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function handleChat() {
    const message = userInput.value.trim();
    if (!message) return;
    appendMessage(message, 'user');
    userInput.value = '';

    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot');
    loadingDiv.innerText = 'ChatBuddy is thinking...';
    chatWindow.appendChild(loadingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        const response = await fetch('http://127.0.0.1:3000/chat', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        if (!response.ok) throw new Error('Server issues');

        const data = await response.json();
        if (chatWindow.contains(loadingDiv)) {
            chatWindow.removeChild(loadingDiv);
        }
        appendMessage(data.text, 'bot');

    } catch (error) {
        if (chatWindow.contains(loadingDiv)) {
            chatWindow.removeChild(loadingDiv);
        }
        appendMessage("Sorry, I'm having trouble connecting right now. Is the server running?", 'bot');
        console.error("Fetch error:", error);
    }
}

sendBtn.addEventListener('click', handleChat);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleChat();
    }
});
