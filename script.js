// Import configuration
// Note: config.js must be loaded before this script

class IceCreamAI {
    constructor() {
        // Check if CONFIG is available
        if (typeof CONFIG === 'undefined') {
            console.error('❌ CONFIG not loaded. Make sure config.js is loaded before script.js');
            return;
        }
        
        this.openRouterApiKey = CONFIG.OPENROUTER.API_KEY;
        this.apiUrl = CONFIG.OPENROUTER.API_URL;
        this.model = CONFIG.OPENROUTER.MODEL;
        this.temperature = CONFIG.OPENROUTER.TEMPERATURE;
        this.maxTokens = CONFIG.OPENROUTER.MAX_TOKENS;
        this.conversationHistory = [];
        this.isTyping = false;
        this.currentUser = null;
        
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.cacheElements();
        this.bindEvents();
        this.loadTheme();
        this.loadConversationHistory();
    }

    cacheElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageForm = document.getElementById('messageForm');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.clearChatBtn = document.getElementById('clearChat');
        this.themeToggle = document.getElementById('themeToggle');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.attachmentBtn = document.getElementById('attachmentBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.userInfo = document.getElementById('userInfo');
    }

    bindEvents() {
        this.messageForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.clearChatBtn.addEventListener('click', () => this.clearChat());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.attachmentBtn.addEventListener('click', () => this.handleAttachment());
        
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.logout());
        }
        
        this.messageInput.addEventListener('input', () => this.handleInputChange());
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSubmit(e);
            }
        });

        document.addEventListener('DOMContentLoaded', () => {
            this.messageInput.focus();
        });
    }

    handleInputChange() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText || this.isTyping;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.handleInputChange();
        
        await this.generateResponse(message);
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        const avatar = sender === 'user' ? '👤' : '🤖';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(content)}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        if (sender === 'user') {
            this.conversationHistory.push({ role: 'user', content });
            this.saveConversationHistory();
        }
    }

    async generateResponse(userMessage, uploadedFile = null) {
        this.isTyping = true;
        this.showTypingIndicator();
        this.sendBtn.disabled = true;

        try {
            const userName = this.currentUser ? this.currentUser.name : 'there';
            let systemMessage = `You are Ice Cream AI, a friendly and sweet AI assistant with a delightful ice cream theme. You should be warm, helpful, and occasionally use ice cream-related metaphors and puns to make conversations more enjoyable. Be knowledgeable but approachable, and always maintain a positive and cheerful tone. If users ask about your theme, embrace it enthusiastically! The user's name is ${userName}. Feel free to address them by name occasionally to make the conversation more personal.`;

            let messages = [
                {
                    role: 'system',
                    content: systemMessage
                },
                ...this.conversationHistory
            ];

            // Add file analysis context if file is uploaded
            if (uploadedFile) {
                const fileContext = await this.analyzeFile(uploadedFile);
                messages.push({
                    role: 'system',
                    content: `The user has uploaded a file: ${uploadedFile.name}. File analysis: ${fileContext}. Please help the user with this file.`
                });
            }

            messages.push({ role: 'user', content: userMessage });

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.openRouterApiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Ice Cream AI Chat'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: this.temperature,
                    max_tokens: this.maxTokens,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            this.hideTypingIndicator();
            this.addMessage(aiResponse, 'ai');
            this.conversationHistory.push({ role: 'assistant', content: aiResponse });
            this.saveConversationHistory();

        } catch (error) {
            console.error('Error generating response:', error);
            this.hideTypingIndicator();
            
            let errorMessage = 'Oops! Something went wrong. ';
            if (error.message.includes('401')) {
                errorMessage += 'Please check your OpenRouter API key.';
            } else if (error.message.includes('429')) {
                errorMessage += 'Rate limit exceeded. Please try again later.';
            } else {
                errorMessage += 'Please try again.';
            }
            
            this.addMessage(errorMessage, 'ai');
        } finally {
            this.isTyping = false;
            this.sendBtn.disabled = false;
            this.messageInput.focus();
        }
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showWelcomeMessage() {
        const userName = this.currentUser ? this.currentUser.name : 'there';
        this.chatMessages.innerHTML = `
            <div class="welcome-message">
                <div class="ice-cream-icon">🍨</div>
                <h2>Welcome back, ${userName}! 🍦</h2>
                <p>Your sweet companion for all questions. How can I help you today?</p>
            </div>
        `;
    }

    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.showWelcomeMessage();
            this.conversationHistory = [];
            this.saveConversationHistory();
            this.messageInput.focus();
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(CONFIG.STORAGE.THEME_KEY, newTheme);
        
        this.themeToggle.innerHTML = newTheme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem(CONFIG.STORAGE.THEME_KEY) || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        this.themeToggle.innerHTML = savedTheme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    }

    saveConversationHistory() {
        try {
            if (this.currentUser) {
                this.currentUser.chatHistory = [...this.conversationHistory];
                this.updateUserInStorage();
            } else {
                localStorage.setItem('ice-cream-ai-history', JSON.stringify(this.conversationHistory));
            }
        } catch (error) {
            console.warn('Could not save conversation history:', error);
        }
    }

    loadConversationHistory() {
        try {
            if (this.currentUser) {
                this.conversationHistory = this.currentUser.chatHistory || [];
                if (this.conversationHistory.length > 0) {
                    this.chatMessages.innerHTML = '';
                    this.conversationHistory.forEach(msg => {
                        this.addMessage(msg.content, msg.role === 'user' ? 'user' : 'ai');
                    });
                } else {
                    this.showWelcomeMessage();
                }
            } else {
                const saved = localStorage.getItem('ice-cream-ai-history');
                if (saved) {
                    this.conversationHistory = JSON.parse(saved);
                    if (this.conversationHistory.length > 0) {
                        this.chatMessages.innerHTML = '';
                        this.conversationHistory.forEach(msg => {
                            this.addMessage(msg.content, msg.role === 'user' ? 'user' : 'ai');
                        });
                    } else {
                        this.showWelcomeMessage();
                    }
                } else {
                    this.showWelcomeMessage();
                }
            }
        } catch (error) {
            console.warn('Could not load conversation history:', error);
            this.showWelcomeMessage();
        }
    }

    handleAttachment() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,.txt,.pdf,.doc,.docx';
        
        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                // Allow user to add text along with file upload
                const userText = prompt('Add a message with your file upload (optional):');
                const message = userText ? userText : `I've uploaded a file: ${file.name}`;
                
                this.addMessage(message, 'user');
                
                // Generate response with file analysis
                await this.generateResponse(message, file);
            }
        });
        
        input.click();
    }

    async analyzeFile(file) {
        try {
            if (file.type.startsWith('image/')) {
                return `This is an image file named "${file.name}" (${this.formatFileSize(file.size)}). The file type is ${file.type}. You can help the user analyze this image, describe what's in it, or answer questions about it.`;
            } else if (file.type === 'text/plain') {
                const text = await this.readTextFile(file);
                return `This is a text file named "${file.name}" (${this.formatFileSize(file.size)}). Content preview: ${text.substring(0, 500)}${text.length > 500 ? '...' : ''}`;
            } else if (file.type === 'application/pdf') {
                return `This is a PDF file named "${file.name}" (${this.formatFileSize(file.size)}). PDF files can contain documents, forms, or other content. You can help the user understand what might be in this PDF or answer questions about it.`;
            } else if (file.type.includes('word') || file.type.includes('document')) {
                return `This is a Word document named "${file.name}" (${this.formatFileSize(file.size)}). This document likely contains text, formatting, and possibly images. You can help the user understand what might be in this document.`;
            } else {
                return `This is a file named "${file.name}" (${this.formatFileSize(file.size)}) of type ${file.type}. You can help the user understand what this file type is used for and how to work with it.`;
            }
        } catch (error) {
            console.error('Error analyzing file:', error);
            return `This is a file named "${file.name}" (${this.formatFileSize(file.size)}). The file could not be fully analyzed, but you can still help the user with general questions about this type of file.`;
        }
    }

    async readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateApiKey(newKey) {
        if (typeof updateApiKey === 'function') {
            const success = updateApiKey(newKey);
            if (success) {
                this.openRouterApiKey = CONFIG.OPENROUTER.API_KEY;
            }
            return success;
        }
        return false;
    }

    loadApiKey() {
        // API key is now loaded from config.js environment variables
        console.log('🔑 API key loaded from environment configuration');
    }

    validateApiKey() {
        if (typeof validateApiKey === 'function') {
            return validateApiKey(this.openRouterApiKey);
        }
        return false;
    }

    checkAuthentication() {
        const userData = sessionStorage.getItem(CONFIG.STORAGE.CURRENT_USER_KEY);
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUserInfo();
        } else {
            window.location.href = 'login.html';
        }
    }

    updateUserInfo() {
        if (this.userInfo && this.currentUser) {
            this.userInfo.innerHTML = `
                <div class="user-avatar">${this.currentUser.name.charAt(0).toUpperCase()}</div>
                <span class="user-name">${this.currentUser.name}</span>
            `;
        }
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem(CONFIG.STORAGE.CURRENT_USER_KEY);
            window.location.href = 'login.html';
        }
    }

    updateUserInStorage() {
        if (!this.currentUser) return;
        
        try {
            const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE.USERS_KEY) || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex] = this.currentUser;
                localStorage.setItem(CONFIG.STORAGE.USERS_KEY, JSON.stringify(users));
            }
        } catch (error) {
            console.warn('Could not update user in storage:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if API key is properly configured
    if (typeof CONFIG !== 'undefined' && CONFIG.OPENROUTER.API_KEY === 'sk-or-v1-your-api-key-here') {
        console.warn('⚠️ Please update your OpenRouter API key in the .env file');
        console.log('📝 Get your API key from: https://openrouter.ai/');
        
        // Show a user-friendly message instead of blocking the app
        const apiWarning = document.createElement('div');
        apiWarning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b9d;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-family: 'Quicksand', sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        apiWarning.innerHTML = '⚠️ Please configure your OpenRouter API key in .env file';
        document.body.appendChild(apiWarning);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (apiWarning.parentNode) {
                apiWarning.parentNode.removeChild(apiWarning);
            }
        }, 10000);
    }
    
    window.iceCreamAI = new IceCreamAI();
});

window.addEventListener('beforeunload', () => {
    if (window.iceCreamAI) {
        window.iceCreamAI.saveConversationHistory();
    }
});
