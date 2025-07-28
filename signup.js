// API configuration
const NUTRITION_API_KEY = 'demo_key'; // Replace with actual API key
const EXERCISE_API_URL = 'https://api.api-ninjas.com/v1/exercises';
const NUTRITION_API_URL = 'https://api.edamam.com/api/nutrition-data/v2';

// Initialize the signup page
document.addEventListener('DOMContentLoaded', function() {
    initializeSignupPage();
    setupEventListeners();
    loadRealTimeData();
});

// Initialize signup page
function initializeSignupPage() {
    const token = localStorage.getItem('fitlab_token');
    if (token) {
        window.location.href = 'dashboard.html';
        return;
    }
    animateStats();
}

// Setup event listeners
function setupEventListeners() {
    const signupForm = document.getElementById('signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    signupForm.addEventListener('submit', handleSignup);
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    passwordInput.addEventListener('input', validatePasswordMatch);
}

// Load real-time data
async function loadRealTimeData() {
    await Promise.all([
        loadNutritionData(),
        loadExerciseTip(),
        loadHealthStats()
    ]);
}

// Nutrition Tips
async function loadNutritionData() {
    try {
        const nutritionFacts = [
            "Bananas are rich in potassium (358mg per 100g) - great for post-workout recovery!",
            "Sweet potatoes provide 14.6g of complex carbs per 100g - perfect fuel for workouts!",
            "Local beans contain 21g of protein per 100g - excellent for muscle building!",
            "Avocados have 160 calories and healthy fats - ideal for sustained energy!",
            "Spinach is packed with iron (2.7mg per 100g) - essential for oxygen transport!"
        ];
        const randomFact = nutritionFacts[Math.floor(Math.random() * nutritionFacts.length)];
        document.getElementById('nutrition-fact').innerHTML = `
            <div class="nutrition-item"><strong>💡 Nutrition Tip:</strong><br>${randomFact}</div>
        `;
    } catch (error) {
        console.error('Error loading nutrition data:', error);
    }
}

// Exercise Tips
async function loadExerciseTip() {
    try {
        const exerciseTips = [
            { name: "Push-ups", instruction: "Keep your body in a straight line from head to heels. Start with 3 sets of 8-12 reps.", muscle: "chest, shoulders, triceps" },
            { name: "Squats", instruction: "Keep your feet shoulder-width apart and lower until thighs are parallel to floor. 3 sets of 15 reps.", muscle: "quadriceps, glutes" },
            { name: "Plank", instruction: "Hold your body straight for 30-60 seconds. Great for core strength!", muscle: "core, shoulders" },
            { name: "Jumping Jacks", instruction: "Great cardio exercise! Start with 3 sets of 30 seconds.", muscle: "full body cardio" }
        ];
        const randomTip = exerciseTips[Math.floor(Math.random() * exerciseTips.length)];
        document.getElementById('exercise-tip').innerHTML = `
            <div class="exercise-item"><strong>🏃‍♂️ ${randomTip.name}</strong><br>
            <small>Targets: ${randomTip.muscle}</small><br>${randomTip.instruction}</div>
        `;
    } catch (error) {
        console.error('Error loading exercise data:', error);
    }
}

// Health Stats
async function loadHealthStats() {
    try {
        const stats = {
            calories: Math.floor(1800 + Math.random() * 400),
            workoutTime: Math.floor(30 + Math.random() * 30),
            activeUsers: Math.floor(1200 + Math.random() * 100)
        };
        document.getElementById('calorie-stat').textContent = stats.calories;
        document.getElementById('workout-stat').textContent = stats.workoutTime;
        document.getElementById('users-stat').textContent = stats.activeUsers;
    } catch (error) {
        console.error('Error loading health stats:', error);
    }
}

// Animate stats
function animateStats() {
    const statsElements = document.querySelectorAll('.health-stats .stat h4');
    statsElements.forEach(el => {
        let current = 0;
        const target = parseInt(el.textContent, 10);
        const step = Math.ceil(target / 50);
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target;
                clearInterval(interval);
            } else {
                el.textContent = current;
            }
        }, 20);
    });
}

// Password Match Validation
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const message = document.getElementById('message');

    if (password !== confirmPassword) {
        message.style.display = 'block';
        message.className = 'message error';
        message.textContent = 'Passwords do not match';
        return false;
    } else {
        message.style.display = 'none';
        return true;
    }
}

// Handle Signup
function handleSignup(e) {
    e.preventDefault();

    if (!validatePasswordMatch()) return;

    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const fitnessGoal = document.getElementById('fitness-goal').value;
    const experience = document.getElementById('experience').value;
    const workoutTime = document.getElementById('workout-time').value;
    const dietaryPreference = document.getElementById('dietary-preference').value;

    const messageBox = document.getElementById('message');
    messageBox.style.display = 'block';

    let users = JSON.parse(localStorage.getItem('fitlab_users')) || [];

    if (users.some(user => user.email === email)) {
        messageBox.className = 'message error';
        messageBox.textContent = "An account with this email already exists. Please log in.";
        return;
    }

    users.push({ name, age, email, password, fitnessGoal, experience, workoutTime, dietaryPreference });
    localStorage.setItem('fitlab_users', JSON.stringify(users));

    messageBox.className = 'message success';
    messageBox.textContent = "Account created successfully! Redirecting to login...";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 2000);
}
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
