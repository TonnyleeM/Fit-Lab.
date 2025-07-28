// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuthenticationAndRedirect();
    initializeDashboard();
    animateStats();
});

// Check if user is authenticated, redirect if not
function checkAuthenticationAndRedirect() {
    const token = localStorage.getItem('fitlab_token');
    //if (!token) {
      //  alert('Please log in to access the dashboard');
        //window.location.href = '../login.html';
        //return;
    //}
    // Always verify token and user with backend
    verifyAuthTokenAndUser();
}

// Verify authentication token and user with backend
async function verifyAuthTokenAndUser() {
    try {
        const token = localStorage.getItem('fitlab_token');
        const response = await fetch('https://your-render-backend-url.onrender.com/api/auth/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!data.success || !data.user) {
            // Token is invalid or user not found, remove and redirect
            localStorage.removeItem('fitlab_token');
            localStorage.removeItem('fitlab_user');
            alert('Your session has expired or your account is invalid. Please log in again.');
            window.location.href = '../login.html';
            return;
        }
        // Store the latest user info from DB
        localStorage.setItem('fitlab_user', JSON.stringify(data.user));
        initializeDashboard();
    } catch (error) {
        console.error('Token verification failed:', error);
        alert('Unable to verify your session. Please log in again.');
        localStorage.removeItem('fitlab_token');
        localStorage.removeItem('fitlab_user');
        window.location.href = '../login.html';
    }
}

function initializeDashboard() {
    // Get authenticated user data from localStorage (synced with DB)
    const user = JSON.parse(localStorage.getItem('fitlab_user') || '{}');
    const token = localStorage.getItem('fitlab_token');
    if (!token || !user.name) {
        console.error('No valid user session found');
        return;
    }
    // Update welcome message with real user data
    const welcomeMsg = document.getElementById('user-welcome');
    if (welcomeMsg) {
        welcomeMsg.textContent = `Welcome back, ${user.name}!`;
    }
    // Update stats with user-specific or realistic data
    updateDashboardStats();
    // Load user-specific content based on fitness goals
    loadPersonalizedContent(user);
}

// Load personalized content based on user preferences  
function loadPersonalizedContent(user) {
    // Customize workout recommendations based on fitness goal
    if (user.fitnessGoal) {
        const goalElement = document.querySelector('.welcome-banner p');
        if (goalElement) {
            const goalMessages = {
                'weight-loss': 'Focus on your weight loss journey with our fat-burning workouts!',
                'build-muscle': 'Build strength and muscle with our targeted training programs!',
                'endurance': 'Boost your endurance with our cardio and stamina workouts!',
                'general-fitness': 'Maintain overall wellness with our balanced fitness approach!'
            };
            
            const message = goalMessages[user.fitnessGoal] || goalMessages['general-fitness'];
            goalElement.textContent = message;
        }
    }
    
    // Customize experience level content
    if (user.experience) {
        console.log(`User experience level: ${user.experience}`);
        // Could be used to show appropriate workout difficulty levels
    }
}

function updateDashboardStats() {
    // Simulate dynamic stats
    const stats = {
        calories: Math.floor(1000 + Math.random() * 500),
        workouts: Math.floor(10 + Math.random() * 10),
        avgTime: Math.floor(30 + Math.random() * 30),
        progress: Math.floor(60 + Math.random() * 30)
    };

    document.getElementById('calories-burned').textContent = stats.calories.toLocaleString();
    document.getElementById('workouts-completed').textContent = stats.workouts;
    document.getElementById('workout-time').textContent = stats.avgTime;
    document.getElementById('goal-progress').textContent = stats.progress;
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent.replace(/,/g, ''));
        let currentValue = 0;
        const increment = finalValue / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                stat.textContent = finalValue.toLocaleString();
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(currentValue).toLocaleString();
            }
        }, 30);
    });
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear all user data
        localStorage.removeItem('fitlab_token');
        localStorage.removeItem('fitlab_user');
        localStorage.removeItem('fitlab_remember');
        
        // Show logout message
        alert('You have been logged out successfully');
        
        // Redirect to login/home page
        window.location.href = '../login.html'; // Redirect to login page
    }
}

function startWorkout() {
    openModal('workout-modal');
}

function watchVideo(videoUrl) {
    // Open video in new tab
    window.open(videoUrl, '_blank');
    
    // Optional: Show a confirmation message
    setTimeout(() => {
        const videoTitle = getVideoTitle(videoUrl);
        alert(`🎥 Opening ${videoTitle}! Enjoy your workout session.`);
    }, 500);
}

function getVideoTitle(url) {
    if (url.includes('9rKtfaZCkZQ')) return 'Weight Loss Workout';
    if (url.includes('1y2pbhUCy28')) return 'Muscle Building Workout';
    if (url.includes('yWnacRo2VbA')) return 'Cardio Workout';
    return 'Workout Video';
}

function contactCoach(method, contact) {
    if (method === 'email') {
        // Open email client
        window.location.href = `mailto:${contact}?subject=FitLab Consultation Request&body=Hello, I would like to schedule a consultation regarding my fitness goals.`;
    } else if (method === 'phone') {
        // For mobile devices, this will open the phone dialer
        // For desktop, show the number
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            window.location.href = `tel:${contact}`;
        } else {
            alert(`📱 Coach Contact Number: ${contact}\n\nClick to copy this number and call your coach!`);
            // Try to copy to clipboard
            navigator.clipboard.writeText(contact).then(() => {
                console.log('Phone number copied to clipboard');
            }).catch(() => {
                console.log('Could not copy to clipboard');
            });
        }
    }
}

function logMeal() {
    openModal('nutrition-modal');
}

function viewProgress() {
    alert('📊 Detailed progress analytics coming soon!');
}

function joinCommunity() {
    alert('👥 Community features launching soon! Connect with other fitness enthusiasts.');
}

function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const message = input.value.trim();
    
    if (!message) return;

    const chatMessages = document.getElementById('chat-messages');
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.style.cssText = 'margin-bottom: 1rem; padding: 0.5rem; background: #00C851; color: white; border-radius: 10px; margin-left: 20%;';
    userMsg.innerHTML = `<strong>You:</strong> ${message}`;
    chatMessages.appendChild(userMsg);

    // Simulate AI response
    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.style.cssText = 'margin-bottom: 1rem; padding: 0.5rem; background: white; border-radius: 10px; margin-right: 20%; border-left: 4px solid #00C851;';
        
        const responses = [
            "Great question! For optimal results, I recommend focusing on compound exercises like squats and deadlifts.",
            "Based on your fitness goals, try incorporating 150 minutes of moderate activity per week as recommended by WHO.",
            "Remember to stay hydrated and get adequate sleep for recovery! Rwanda's climate makes hydration extra important.",
            "That's a common concern among youth. Start with bodyweight exercises and gradually increase intensity.",
            "Nutrition plays a crucial role. Try incorporating local foods like beans, sweet potatoes, and leafy greens for balanced nutrition."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        aiMsg.innerHTML = `<strong>AI:</strong> ${randomResponse}`;
        chatMessages.appendChild(aiMsg);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);

    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle Enter key in AI chat
document.addEventListener('keypress', function(e) {
    if (e.target.id === 'ai-input' && e.key === 'Enter') {
        sendAIMessage();
    }
});

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}