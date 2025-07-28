// API Configuration - UPDATED TO PORT 3001
const API_BASE_URL = 'http://localhost:3001/api';

// Initialize registration page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Registration page loaded');
    initializeRegistrationPage();
    setupRegistrationEventListeners();
});

// Initialize registration page
function initializeRegistrationPage() {
    console.log('🔧 Initializing registration page');
    
    // Check if user is already logged in (safely)
    try {
        const token = localStorage.getItem('fitlab_token');
        if (token) {
            console.log('🔑 Existing token found, verifying...');
            verifyTokenAndRedirect();
        }
    } catch (error) {
        console.log('⚠️ localStorage not available, continuing with registration');
    }
}

// Setup event listeners for registration
function setupRegistrationEventListeners() {
    console.log('👂 Setting up event listeners');
    
    const registrationForm = document.getElementById('registration-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
        console.log('✅ Form submission listener added');
    } else {
        console.error('❌ Registration form not found! Make sure your HTML has id="registration-form"');
    }

    // Password validation
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePasswords);
    }
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswords);
    }

    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', validateRegistrationEmail);
    }
}

// Handle registration form submission
async function handleRegistration(e) {
    e.preventDefault();
    console.log('🚀 Registration form submitted');

    // Clear previous messages
    clearRegistrationMessage();

    // Get form elements
    const formData = getRegistrationFormData();
    console.log('📋 Form data collected:', { ...formData, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });

    if (!formData) {
        showRegistrationMessage('Please fill in all required fields', 'error');
        return;
    }

    // Validate form data
    if (!validateRegistrationForm(formData)) {
        return; // Error messages already shown by validation functions
    }

    try {
        showRegistrationLoading(true);
        setRegistrationButtonLoading(true);

        console.log('🌐 Making API request to:', `${API_BASE_URL}/auth/register`);
        console.log('📤 Sending registration data for:', formData.email);

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log('📥 Response status:', response.status);
        console.log('📥 Response ok:', response.ok);

        let data;
        try {
            data = await response.json();
            console.log('📋 Registration response:', data);
        } catch (parseError) {
            console.error('❌ Failed to parse response as JSON:', parseError);
            throw new Error('Server returned invalid response');
        }

        if (response.ok && data.success && data.token) {
            console.log('✅ Registration successful!');
            showRegistrationMessage('Registration successful! Redirecting to dashboard...', 'success');

            // Store user token and basic info (safely)
            try {
                localStorage.setItem('fitlab_token', data.token);
                localStorage.setItem('fitlab_user', JSON.stringify(data.user));
                console.log('💾 User data stored locally');
            } catch (error) {
                console.log('⚠️ Could not store to localStorage, but registration was successful');
            }

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                console.log('🔄 Redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            }, 2000);

        } else {
            console.log('❌ Registration failed:', data.message);
            showRegistrationMessage(data.message || 'Registration failed', 'error');
        }

    } catch (error) {
        console.error('🔥 Registration error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showRegistrationMessage('Cannot connect to server. Please check if the server is running on port 3001.', 'error');
        } else if (error.message.includes('invalid response')) {
            showRegistrationMessage('Server error. Please try again later.', 'error');
        } else {
            showRegistrationMessage('Something went wrong. Please try again.', 'error');
        }
    } finally {
        showRegistrationLoading(false);
        setRegistrationButtonLoading(false);
    }
}

// === Helper functions below ===

// Get form data
function getRegistrationFormData() {
    const username = document.getElementById('username')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    const age = document.getElementById('age')?.value;
    const fitnessGoal = document.getElementById('fitness-goal')?.value;
    const experience = document.getElementById('experience')?.value;
    const workoutTime = document.getElementById('workout-time')?.value;
    const dietaryPreference = document.getElementById('dietary-preference')?.value;

    if (!username || !email || !password || !confirmPassword) {
        console.log('❌ Missing required fields:', { username: !!username, email: !!email, password: !!password, confirmPassword: !!confirmPassword });
        return null;
    }

    return {
        username,
        email,
        password,
        confirmPassword,
        age,
        fitnessGoal,
        experience,
        workoutTime,
        dietaryPreference
    };
}

// Validate passwords match
function validatePasswords() {
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
        showRegistrationMessage('Passwords do not match', 'error');
        return false;
    } else if (password && confirmPassword && password === confirmPassword) {
        clearRegistrationMessage();
    }
    return true;
}

// Validate form (you can extend with more rules)
function validateRegistrationForm(formData) {
    if (!isValidEmail(formData.email)) {
        showRegistrationMessage('Please enter a valid email address', 'error');
        return false;
    }
    if (formData.password.length < 6) {
        showRegistrationMessage('Password must be at least 6 characters', 'error');
        return false;
    }
    if (formData.password !== formData.confirmPassword) {
        showRegistrationMessage('Passwords do not match', 'error');
        return false;
    }
    return true;
}

// Better email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Email validation on blur
function validateRegistrationEmail() {
    const email = document.getElementById('email')?.value;
    if (email && !isValidEmail(email)) {
        showRegistrationMessage('Please enter a valid email address', 'error');
    } else if (email && isValidEmail(email)) {
        clearRegistrationMessage();
    }
}

// Show messages
function showRegistrationMessage(message, type = 'info') {
    const messageDiv = document.getElementById('registration-message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
    }
    console.log(`📢 Message (${type}):`, message);
}

// Clear messages
function clearRegistrationMessage() {
    const messageDiv = document.getElementById('registration-message');
    if (messageDiv) {
        messageDiv.textContent = '';
        messageDiv.className = '';
        messageDiv.style.display = 'none';
    }
}

// Show/hide loading indicator
function showRegistrationLoading(isLoading) {
    const loader = document.getElementById('registration-loading');
    if (loader) {
        loader.style.display = isLoading ? 'block' : 'none';
    }
}

// Change button to loading state
function setRegistrationButtonLoading(isLoading) {
    const btn = document.getElementById('register-btn');
    if (btn) {
        btn.disabled = isLoading;
        btn.textContent = isLoading ? 'Registering...' : 'Register';
    }
}

// Optional: Verify token before redirecting
function verifyTokenAndRedirect() {
    console.log('🔍 Verifying existing token...');
    // For now just redirect if token exists (more secure = use backend verification)
    window.location.href = 'dashboard.html';
}