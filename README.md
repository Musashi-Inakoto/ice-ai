# 🍦 Ice Cream AI Chat

A modern, ice cream themed chat AI application with user authentication and OpenRouter API integration.

## 🚀 Features

- **User Authentication**: Login with email/password or Google login simulation
- **Per-User Chat History**: Each user's conversations are saved and restored
- **Modern UI**: Beautiful ice cream themed design with animations
- **Dark/Light Theme**: Toggle between themes
- **File Attachments**: Support for image and file uploads
- **Responsive Design**: Works on desktop and mobile
- **Environment Configuration**: Secure API key management

## 📁 Project Structure

```
windsurf-project-2/
├── index.html          # Main chat application
├── login.html          # Login page
├── styles.css          # Main app styles
├── login-styles.css    # Login page styles
├── script.js           # Main app JavaScript
├── login-script.js     # Login functionality
├── config.js           # Environment configuration
├── .env                # Environment variables
└── README.md           # This file
```

## 🔧 Setup

### 1. Configure OpenRouter API Key

Edit the `.env` file and replace the placeholder with your actual OpenRouter API key:

```env
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

Get your API key from [OpenRouter.ai](https://openrouter.ai/)

### 2. Run the Application

Open `login.html` in your web browser to start the application.

## 🧪 Test Credentials

- **Email**: `demo@icecream.ai`
- **Password**: `demo123`

## 🔐 Authentication Features

- **Email/Password Login**: Traditional login with validation
- **Google Login**: Simulated Google authentication
- **Remember Me**: Keeps user logged in across sessions
- **Sign Up**: Create new accounts
- **Forgot Password**: Reset password functionality
- **Logout**: Secure logout with confirmation

## 💾 Data Storage

- **Users**: Stored in localStorage (`ice-cream-ai-users`)
- **Sessions**: Stored in sessionStorage (`ice-cream-ai-current-user`)
- **Themes**: User theme preferences saved
- **Chat History**: Per-user conversation history

## 🎨 UI Features

- **Ice Cream Theme**: Sweet, colorful design
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-friendly layout
- **Dark Mode**: Toggle between light and dark themes
- **Typing Indicators**: Visual feedback during AI responses
- **File Upload**: Support for attachments

## 🔌 API Configuration

The application uses environment variables for secure API configuration:

```javascript
// config.js
const CONFIG = {
    OPENROUTER: {
        API_KEY: process.env.OPENROUTER_API_KEY,
        API_URL: 'https://openrouter.ai/api/v1/chat/completions',
        MODEL: 'anthropic/claude-3-haiku',
        TEMPERATURE: 0.7,
        MAX_TOKENS: 1000
    }
};
```

## 🚨 Security Notes

- API keys are stored in environment variables, not in the code
- User passwords are stored in localStorage (for demo purposes)
- In production, use server-side authentication and secure storage
- Never commit actual API keys to version control

## 🛠️ Development

### Adding New Features

1. Update `config.js` for new configuration options
2. Modify styles in `styles.css` or `login-styles.css`
3. Add functionality to appropriate JavaScript files
4. Update HTML structure as needed

### Configuration

All configuration is managed through `config.js`:

```javascript
// Update API model
CONFIG.OPENROUTER.MODEL = 'anthropic/claude-3-sonnet';

// Update app settings
CONFIG.APP.NAME = 'Your App Name';
```

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🍦 Enjoy!

Have fun chatting with your ice cream themed AI assistant! 🎉
