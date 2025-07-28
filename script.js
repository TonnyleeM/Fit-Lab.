// Global variables
let currentUser = null;
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const signupModal = document.getElementById('signup-modal');
const loginModal = document.getElementById('login-modal');
const authLink = document.getElementById('auth-link');
const dashboardLink = document.getElementById('dashboard-link');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

// Initialize app
function initializeApp() {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('fitconnect_user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUIForLoggedInUser();
    }
}

// Setup event listeners
function setupEventListeners() {
    // CTA buttons
    document.getElementById('start-journey').addEventListener('click', showAuthModal);
    document.getElementById('join-now').addEventListener('click', showAuthModal);
    
    // Auth links
    authLink.addEventListener('click', handleAuthClick);
    
    // Modal controls
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });
    
    // Switch between login and signup
    document.getElementById('show-login').addEventListener('click', showLoginModal);
    document.getElementById('show-signup').addEventListener('click', showSignupModal);
    
    // Form submissions
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModals();
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('fitconnect_token');
    if (token) {
        // Verify token with backend
        fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = data.user;
                updateUIForLoggedInUser();
            } else {
                localStorage.removeItem('fitconnect_token');
                localStorage.removeItem('fitconnect_user');
            }
        })
        .catch(error => {
            console.error('Auth verification failed:', error);
            localStorage.removeItem('fitconnect_token');
            localStorage.removeItem('fitconnect_user');
        });
    }
}

// Handle auth click
function handleAuthClick(e) {
    e.preventDefault();
    if (currentUser) {
        logout();
    } else {
        showAuthModal();
    }
}

// Show appropriate auth modal
function showAuthModal() {
    if (currentUser) {
        window.location.href = 'dashboard.html';
    } else {
        showSignupModal();
    }
}

// Show signup modal
function showSignupModal() {
    closeModals();
    signupModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Show login modal
function showLoginModal() {
    closeModals();
    loginModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close all modals
function closeModals() {
    signupModal.style.display = 'none';
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle signup
async function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        age: parseInt(formData.get('age')),
        fitnessGoal: formData.get('fitnessGoal'),
        experience: formData.get('experience'),
        password: formData.get('password')
    };
    
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('fitconnect_token', data.token);
            localStorage.setItem('fitconnect_user', JSON.stringify(data.user));
            
            showMessage('Account created successfully! Welcome to FitConnect Rwanda!', 'success');
            closeModals();
            updateUIForLoggedInUser();
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showMessage(data.message || 'Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('