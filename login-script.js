class LoginManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.checkExistingSession();
    }

    cacheElements() {
        this.loginForm = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.rememberMeCheckbox = document.getElementById('rememberMe');
        this.loginBtn = document.getElementById('loginBtn');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.emailError = document.getElementById('emailError');
        this.passwordError = document.getElementById('passwordError');
        this.signupLink = document.getElementById('signupLink');
        this.forgotPasswordLink = document.querySelector('.forgot-password');
    }

    bindEvents() {
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.passwordToggle.addEventListener('click', () => this.togglePassword());
        this.signupLink.addEventListener('click', (e) => this.handleSignup(e));
        this.forgotPasswordLink.addEventListener('click', (e) => this.handleForgotPassword(e));
        
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
    }

    checkExistingSession() {
        const rememberedUser = localStorage.getItem(CONFIG.STORAGE.REMEMBERED_USER_KEY);
        if (rememberedUser) {
            const user = this.users.find(u => u.email === rememberedUser);
            if (user) {
                this.emailInput.value = user.email;
                this.rememberMeCheckbox.checked = true;
            }
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        
        if (!this.validateForm(email, password)) {
            return;
        }

        this.showLoading(true);
        
        try {
            await this.simulateLoginDelay();
            
            const user = this.authenticateUser(email, password);
            
            if (user) {
                this.handleSuccessfulLogin(user);
            } else {
                this.showError('password', 'Invalid email or password');
            }
        } catch (error) {
            this.showError('password', 'Login failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    validateForm(email, password) {
        let isValid = true;
        
        if (!email) {
            this.showError('email', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!password) {
            this.showError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            this.showError('password', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    authenticateUser(email, password) {
        return this.users.find(user => 
            user.email.toLowerCase() === email.toLowerCase() && 
            user.password === password
        );
    }

    handleSuccessfulLogin(user) {
        this.currentUser = user;
        
        if (this.rememberMeCheckbox.checked) {
            localStorage.setItem(CONFIG.STORAGE.REMEMBERED_USER_KEY, user.email);
        } else {
            localStorage.removeItem(CONFIG.STORAGE.REMEMBERED_USER_KEY);
        }
        
        sessionStorage.setItem(CONFIG.STORAGE.CURRENT_USER_KEY, JSON.stringify(user));
        
        this.showSuccessAnimation();
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    handleSignup(e) {
        e.preventDefault();
        
        const email = prompt('Enter your email address for signup:');
        if (!email || !this.isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        const existingUser = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            alert('An account with this email already exists. Please login instead.');
            return;
        }
        
        const password = prompt('Enter your password (min 6 characters):');
        if (!password || password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        
        const name = prompt('Enter your name:');
        if (!name || name.trim() === '') {
            alert('Please enter your name');
            return;
        }
        
        const newUser = this.createUser(email, password, name.trim());
        alert('Account created successfully! You can now login.');
        
        this.emailInput.value = email;
        this.passwordInput.value = password;
        this.passwordInput.focus();
    }

    handleForgotPassword(e) {
        e.preventDefault();
        
        const email = prompt('Enter your email address to reset password:');
        if (!email || !this.isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
            const newPassword = prompt('Enter your new password (min 6 characters):');
            if (newPassword && newPassword.length >= 6) {
                user.password = newPassword;
                this.saveUsers();
                alert('Password reset successfully! You can now login with your new password.');
                this.emailInput.value = email;
                this.passwordInput.value = '';
                this.passwordInput.focus();
            } else {
                alert('Password must be at least 6 characters');
            }
        } else {
            alert('No account found with this email address.');
        }
    }

    createUser(email, password, name) {
        const newUser = {
            id: Date.now().toString(),
            email: email.toLowerCase(),
            password: password,
            name: name,
            createdAt: new Date().toISOString(),
            chatHistory: []
        };
        
        this.users.push(newUser);
        this.saveUsers();
        
        return newUser;
    }

    togglePassword() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        
        const icon = this.passwordToggle.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    }

    showError(field, message) {
        const errorElement = field === 'email' ? this.emailError : this.passwordError;
        const inputElement = field === 'email' ? this.emailInput : this.passwordInput;
        
        errorElement.textContent = message;
        inputElement.style.borderColor = 'var(--error-color)';
        
        setTimeout(() => {
            errorElement.textContent = '';
            inputElement.style.borderColor = '';
        }, 5000);
    }

    clearError(field) {
        const errorElement = field === 'email' ? this.emailError : this.passwordError;
        const inputElement = field === 'email' ? this.emailInput : this.passwordInput;
        
        errorElement.textContent = '';
        inputElement.style.borderColor = '';
    }

    showLoading(show) {
        this.loadingOverlay.style.display = show ? 'flex' : 'none';
        this.loginBtn.disabled = show;
        this.googleBtn.disabled = show;
    }

    showSuccessAnimation() {
        this.loginBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
        this.loginBtn.style.background = 'var(--success-color)';
    }

    simulateLoginDelay() {
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    loadUsers() {
        const savedUsers = localStorage.getItem(CONFIG.STORAGE.USERS_KEY);
        if (savedUsers) {
            return JSON.parse(savedUsers);
        }
        
        const defaultUsers = [
            {
                id: '1',
                email: 'demo@icecream.ai',
                password: 'demo123',
                name: 'Demo User',
                createdAt: new Date().toISOString(),
                chatHistory: []
            }
        ];
        
        this.saveUsers(defaultUsers);
        return defaultUsers;
    }

    saveUsers(users = this.users) {
        localStorage.setItem(CONFIG.STORAGE.USERS_KEY, JSON.stringify(users));
    }

    static getCurrentUser() {
        const userData = sessionStorage.getItem(CONFIG.STORAGE.CURRENT_USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    static logout() {
        sessionStorage.removeItem(CONFIG.STORAGE.CURRENT_USER_KEY);
        window.location.href = 'login.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.loginManager = new LoginManager();
});

window.addEventListener('beforeunload', () => {
    if (window.loginManager && window.loginManager.currentUser) {
        sessionStorage.setItem('ice-cream-ai-current-user', JSON.stringify(window.loginManager.currentUser));
    }
});
