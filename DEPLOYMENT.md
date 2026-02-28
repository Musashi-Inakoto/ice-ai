# 🚀 Vercel Deployment Guide

This guide will help you deploy your Ice Cream AI Chat application to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **OpenRouter API Key**: Make sure your API key is configured

## 🔧 Environment Setup

### 1. Configure Environment Variables

In your Vercel dashboard, set the following environment variables:

```
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

**Steps:**
1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add your OpenRouter API key

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy your project
vercel --prod
```

#### Option B: Using GitHub Integration

1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to main branch

## 📁 Project Structure for Vercel

```
windsurf-project-2/
├── index.html          # Main chat application
├── login.html          # Login page
├── styles.css          # Main app styles
├── login-styles.css    # Login page styles
├── script.js           # Main app JavaScript
├── login-script.js     # Login functionality
├── config.js           # Environment configuration
├── vercel.json         # Vercel configuration
├── package.json        # Node.js dependencies
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## ⚙️ Vercel Configuration

The `vercel.json` file includes:

- **Static Build**: Configured for static site hosting
- **Routing**: Proper routing for SPA functionality
- **Security Headers**: XSS protection, content type options
- **Caching**: Optimized caching for static assets

## 🔒 Security Considerations

- ✅ API keys are stored in Vercel environment variables
- ✅ Security headers are configured
- ✅ Client-side data storage (localStorage/sessionStorage)
- ⚠️ Note: In production, consider server-side authentication

## 🌐 Deployment URLs

After deployment, your app will be available at:
- **Production**: `https://your-project-name.vercel.app`
- **Preview**: `https://your-branch-name.your-project-name.vercel.app`

## 🐛 Troubleshooting

### Common Issues:

1. **API Key Not Working**
   - Ensure environment variable is set in Vercel dashboard
   - Check that the key starts with `sk-or-v1-`

2. **Routing Issues**
   - Verify `vercel.json` routing configuration
   - Check that all HTML files are in the root directory

3. **Build Failures**
   - Ensure all files are committed to Git
   - Check that `package.json` is valid JSON

4. **CORS Issues**
   - The app uses client-side API calls
   - OpenRouter API supports CORS for web applications

## 📱 Testing Your Deployment

1. **Login Test**: Use demo credentials (`demo@icecream.ai` / `demo123`)
2. **Chat Test**: Send a message and verify AI response
3. **File Upload Test**: Upload a file with custom message
4. **Theme Test**: Toggle between light/dark themes
5. **Responsive Test**: Check on mobile devices

## 🔄 Continuous Deployment

With GitHub integration:
- Push to `main` → Production deployment
- Push to other branches → Preview deployments
- Automatic deployments on every push

## 📊 Monitoring

Monitor your deployment through:
- Vercel Analytics (if enabled)
- Vercel Logs for debugging
- OpenRouter API dashboard for usage stats

## 🎉 Success!

Your Ice Cream AI Chat is now live on Vercel! 🍦✨

---

**Need Help?**
- [Vercel Documentation](https://vercel.com/docs)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [GitHub Issues](https://github.com/yourusername/ice-cream-ai-chat/issues)
