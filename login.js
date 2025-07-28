// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Initialize login page
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginPage();
    setupEventListeners();
    loadWelcomeData();
});

// Initialize login page
function initializeLoginPage() {
    // Check if user is already logged in
    const token = localStorage.getItem('fitlab_token');
    if (token) {
        // Verify token and redirect if valid
        verifyTokenAndRedirect();
    }
    
    // Pre-fill demo credentials for testing
    const demoMode = localStorage.getItem('demo_mode') === 'true';
    if (demoMode) {
        document.getElementById('email').value = 'demo@fitlab.com';
        document.getElementById('password').value = 'demo123';
    }
    
    // Animate welcome stats
    animateWelcomeStats();
}

// Setup event listeners
function setupEventListeners() {
    const loginForm = document.getElementById('login-form');
    const passwordToggle = document.getElementById('password-toggle');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Password visibility toggle
    passwordToggle.addEventListener('click', togglePasswordVisibility);
    
    // Input validation
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    
    // Enter key handling
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.tagName !== 'BUTTON') {
            handleLogin(e);
        }
    });
}

// Verify existing token and redirect
async function verifyTokenAndRedirect() {
    try {
        const token = localStorage.getItem('fitlab_token');
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        if (data.success) {
            showMessage('You are already logged in. Redirecting to dashboard...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Invalid token, remove it
            localStorage.removeItem('fitlab_token');
            localStorage.removeItem('fitlab_user');
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('fitlab_token');
        localStorage.removeItem('fitlab_user');
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validation
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        showLoading(true);
        setButtonLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store user data and token
            localStorage.setItem('fitlab_token', data.token);
            localStorage.setItem('fitlab_user', JSON.stringify(data.user));
            
            // Store remember me preference
            if (remember) {
                localStorage.setItem('fitlab_remember', 'true');
            }
            
            showMessage('Login successful! Welcome back to Fit Lab!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } else {
            showMessage(data.message || 'Login failed. Please check your credentials.', 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
        showLoading(false);
        setButtonLoading(false);
    }
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('password-toggle-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}

// Email validation
function validateEmail() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    
    if (email && !isValidEmail(email)) {
        emailInput.style.borderColor = '#e74c3c';
        showMessage('Please enter a valid email address', 'error');
        return false;
    } else if (email) {
        emailInput.style.borderColor = '#2ecc71';
    }
    return true;
}

// Password validation
function validatePassword() {
    const passwordInput = document.getElementById('password');
    const password = passwordInput.value;
    
    if (password && password.length < 6) {
        passwordInput.style.borderColor = '#e74c3c';
        return false;
    } else if (password) {
        passwordInput.style.borderColor = '#2ecc71';
    }
    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show loading overlay
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = show ? 'flex' : 'none';
}

// Set button loading state
function setButtonLoading(loading) {
    const button = document.querySelector('.login-button');
    const buttonText = document.getElementById('login-btn-text');
    const loader = document.getElementById('login-loader');
    
    if (loading) {
        button.disabled = true;
        buttonText.style.display = 'none';
        loader.style.display = 'inline-block';
    } else {
        button.disabled = false;
        buttonText.style.display = 'inline';
        loader.style.display = 'none';
    }
}

// Show message
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto-hide success messages
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Load welcome data (stats, success stories, tips)
async function loadWelcomeData() {
    try {
        // Load real-time stats
        await loadWelcomeStats();
        
        // Load success story
        await loadSuccessStory();
        
        // Load health tip
        await loadHealthTip();
        
    } catch (error) {
        console.error('Error loading welcome data:', error);
    }
}

// Load welcome stats
async function loadWelcomeStats() {
    try {
        // Simulate real-time data (in production, fetch from API)
        const stats = {
            activeUsers: Math.floor(1200 + Math.random() * 100),
            workoutsToday: Math.floor(400 + Math.random() * 100),
            goalsAchieved: Math.floor(85 + Math.random() * 10)
        };
        
        // Animate numbers
        animateNumber('active-users', stats.activeUsers);
        animateNumber('workouts-today', stats.workoutsToday);
        animateNumber('goals-achieved', stats.goalsAchieved, '%');
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load success story
async function loadSuccessStory() {
    try {
        const stories = [
            "\"I lost 15kg in 3 months with Fit Lab's personalized workout plans. The community support kept me motivated every day!\" - Sarah K.",
            "\"From beginner to running 10K! Fit Lab's progressive training helped me achieve what I thought was impossible.\" - James M.",
            "\"The nutrition guidance changed my life. I have more energy than ever and feel amazing!\" - Grace T.",
            "\"Fit Lab made fitness fun and accessible. I work out from home and love every session!\" - Peter R."
        ];
        
        const randomStory = stories[Math.floor(Math.random() * stories.length)];
        document.getElementById('success-story').innerHTML = `
            <p>${randomStory}</p>
        `;
        
    } catch (error) {
        console.error('Error loading success story:', error);
        document.getElementById('success-story').innerHTML = `
            <p>Join thousands of successful Fit Lab members on their fitness journey!</p>
        `;
    }
}

// Load health tip
async function loadHealthTip() {
    try {
        const tips = [
            "Start your day with 10 minutes of light stretching to improve flexibility and energy levels.",
            "Drink water 30 minutes before meals to aid digestion and control portion sizes.",
            "Take a 5-minute walk every hour to boost circulation and reduce stress.",
            "Practice deep breathing for 2 minutes to lower cortisol and improve focus.",
            "Eat slowly and chew thoroughly - it takes 20 minutes for your brain to register fullness."
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        document.getElementById('health-tip').innerHTML = `
            <p><strong>💡 Tip:</strong> ${randomTip}</p>
        `;
        
    } catch (error) {
        console.error('Error loading health tip:', error);
        document.getElementById('health-tip').innerHTML = `
            <p>Stay consistent with small daily actions for big long-term results!</p>
        `;
    }
}

// Animate welcome stats
function animateWelcomeStats() {
    const stats = document.querySelectorAll('.welcome-stat');
    stats.forEach((stat, index) => {
        setTimeout(() => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateX(-20px)';
            stat.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                stat.style.opacity = '1';
                stat.style.transform = 'translateX(0)';
            }, 100);
        }, index * 200);
    });
}

// Animate number counting
function animateNumber(elementId, targetNumber, suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startNumber = 0;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    function updateNumber() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * easeOut);
        
        element.textContent = currentNumber.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    updateNumber();
}

// Handle demo login
function loginDemo() {
    document.getElementById('email').value = 'demo@fitlab.com';
    document.getElementById('password').value = 'demo123';
    
    // Trigger form submission
    const form = document.getElementById('login-form');
    form.dispatchEvent(new Event('submit'));
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + D for demo login (development only)
    if ((e.ctrlKey || e.metaKey) &&