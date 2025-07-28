
// API placeholders (optional for real data in the future)
const NUTRITION_API_KEY = 'demo_key';
const EXERCISE_API_URL = 'https://api.api-ninjas.com/v1/exercises';
const NUTRITION_API_URL = 'https://api.edamam.com/api/nutrition-data/v2';

document.addEventListener('DOMContentLoaded', () => {
    initializeSignupPage();
    setupEventListeners();
    loadRealTimeData();
});

// Redirect if already logged in
function initializeSignupPage() {
    const token = localStorage.getItem('fitlab_token');
    if (token) {
        window.location.href = 'dashboard.html';
    }
    animateStats();
}

// Setup form listeners
function setupEventListeners() {
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.getElementById('password').addEventListener('input', validatePasswordMatch);
    document.getElementById('confirm-password').addEventListener('input', validatePasswordMatch);
}

// Load all live tips/stats
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
        const facts = [
            "Bananas are rich in potassium (358mg per 100g) - great for post-workout recovery!",
            "Sweet potatoes provide 14.6g of complex carbs per 100g - perfect fuel for workouts!",
            "Local beans contain 21g of protein per 100g - excellent for muscle building!",
            "Avocados have 160 calories and healthy fats - ideal for sustained energy!",
            "Spinach is packed with iron (2.7mg per 100g) - essential for oxygen transport!"
        ];
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        document.getElementById('nutrition-fact').innerHTML = `
            <div class="nutrition-item"><strong>💡 Nutrition Tip:</strong><br>${randomFact}</div>
        `;
    } catch (error) {
        console.error('Nutrition data error:', error);
    }
}

// Exercise Tips
async function loadExerciseTip() {
    try {
        const tips = [
            { name: "Push-ups", instruction: "3 sets of 8-12 reps.", muscle: "chest, shoulders, triceps" },
            { name: "Squats", instruction: "3 sets of 15 reps.", muscle: "quadriceps, glutes" },
            { name: "Plank", instruction: "Hold 30-60s.", muscle: "core, shoulders" },
            { name: "Jumping Jacks", instruction: "3 sets of 30 seconds.", muscle: "full body cardio" }
        ];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        document.getElementById('exercise-tip').innerHTML = `
            <div class="exercise-item"><strong>🏃‍♂️ ${randomTip.name}</strong><br>
            <small>Targets: ${randomTip.muscle}</small><br>${randomTip.instruction}</div>
        `;
    } catch (error) {
        console.error('Exercise data error:', error);
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
        console.error('Health stats error:', error);
    }
}

// Animate health numbers
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

// Password match check
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

// Signup submission handler
async function handleSignup(e) {
    e.preventDefault();

    if (!validatePasswordMatch()) return;

    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();
    const fitnessGoal = document.getElementById('fitness-goal').value;
    const experience = document.getElementById('experience').value;
    const workoutTime = document.getElementById('workout-time').value;
    const dietaryPreference = document.getElementById('dietary-preference').value;
    const messageBox = document.getElementById('message');

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: name,
                email,
                password,
                age,
                fitnessGoal,
                experience,
                workoutTime,
                dietaryPreference
            })
        });

        const data = await response.json();

        if (response.ok) {
            messageBox.className = 'message success';
            messageBox.textContent = '✅ Account created successfully! Redirecting to login...';
            messageBox.style.display = 'block';
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            messageBox.className = 'message error';
            messageBox.textContent = data.message || '❌ Registration failed.';
            messageBox.style.display = 'block';
        }
    } catch (error) {
        console.error(error);
        messageBox.className = 'message error';
        messageBox.textContent = '❌ Server error. Please try again.';
        messageBox.style.display = 'block';
    }
}
