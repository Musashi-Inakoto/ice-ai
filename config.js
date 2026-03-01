// Environment Configuration
// This file handles environment variables and API configuration

// Load environment variables from .env file (for development)
function loadEnvVariables() {
    // In a real production environment, these would be server-side environment variables
    // For this demo, we'll simulate environment variable loading
    
    const envVars = {
        OPENROUTER_API_KEY: '' // Default fallback
    };

    // Try to load from .env file content (simulated)
    // In a real Node.js environment, you'd use dotenv package
    try {
        // This would be replaced by actual .env file reading in production
        // For now, we'll use the placeholder that should be replaced
        console.log('🔧 Environment variables loaded');
        console.log('📝 Make sure to update the .env file with your actual OpenRouter API key');
    } catch (error) {
        console.warn('⚠️ Could not load environment variables:', error);
    }

    return envVars;
}

// Export configuration object
const CONFIG = {
    // OpenRouter API Configuration
    OPENROUTER: {
        API_KEY: loadEnvVariables().OPENROUTER_API_KEY,
        API_URL: 'https://openrouter.ai/api/v1/chat/completions',
        MODEL: 'anthropic/claude-3-haiku',
        TEMPERATURE: 0.7,
        MAX_TOKENS: 1000
    },
    
    // App Configuration
    APP: {
        NAME: 'Ice Cream AI',
        VERSION: '1.0.0',
        THEME: 'light'
    },
    
    // Storage Configuration
    STORAGE: {
        USERS_KEY: 'ice-cream-ai-users',
        THEME_KEY: 'ice-cream-ai-theme',
        REMEMBERED_USER_KEY: 'ice-cream-ai-remembered-user',
        CURRENT_USER_KEY: 'ice-cream-ai-current-user'
    }
};

// Function to update API key (for development)
function updateApiKey(newKey) {
    if (newKey && newKey.trim()) {
        CONFIG.OPENROUTER.API_KEY = newKey.trim();
        console.log('✅ API key updated successfully');
        return true;
    }
    return false;
}

// Function to validate API key format
function validateApiKey(key) {
    return key && key.startsWith('sk-or-v1-') && key.length > 20;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, updateApiKey, validateApiKey };
} else {
    window.CONFIG = CONFIG;
    window.updateApiKey = updateApiKey;
    window.validateApiKey = validateApiKey;
}
