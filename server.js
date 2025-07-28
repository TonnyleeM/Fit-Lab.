const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fitlab_jwt_secret_key_2025';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database file paths
const DB_DIR = path.join(__dirname, 'database');
const USERS_DB = path.join(DB_DIR, 'users.json');
const WORKOUTS_DB = path.join(DB_DIR, 'workouts.json');
const MEALS_DB = path.join(DB_DIR, 'meals.json');
const PROGRESS_DB = path.join(DB_DIR, 'progress.json');

// Initialize database
async function initializeDatabase() {
    try {
        await fs.mkdir(DB_DIR, { recursive: true });
        
        // Initialize users.json
        try {
            await fs.access(USERS_DB);
        } catch {
            await fs.writeFile(USERS_DB, JSON.stringify([]));
        }
        
        // Initialize workouts.json
        try {
            await fs.access(WORKOUTS_DB);
        } catch {
            const workouts = {
                "beginner": {
                    "weight-loss": [
                        {
                            "id": "wl_beg_1",
                            "name": "Beginner Weight Loss - Week 1",
                            "duration": "30 minutes",
                            "exercises": [
                                {
                                    "name": "Jumping Jacks",
                                    "sets": 3,
                                    "reps": "30 seconds",
                                    "rest": "30 seconds",
                                    "instruction": "Keep a steady pace, land softly on your feet"
                                },
                                {
                                    "name": "Bodyweight Squats",
                                    "sets": 3,
                                    "reps": 12,
                                    "rest": "45 seconds",
                                    "instruction": "Keep your back straight, go down until thighs are parallel to floor"
                                },
                                {
                                    "name": "Push-ups (Knee)",
                                    "sets": 3,
                                    "reps": 8,
                                    "rest": "45 seconds",
                                    "instruction": "Keep body in straight line, lower chest to ground"
                                },
                                {
                                    "name": "Plank",
                                    "sets": 3,
                                    "reps": "20 seconds",
                                    "rest": "30 seconds",
                                    "instruction": "Keep body straight, don't let hips sag"
                                },
                                {
                                    "name": "Mountain Climbers",
                                    "sets": 3,
                                    "reps": "20 seconds",
                                    "rest": "40 seconds",
                                    "instruction": "Keep core tight, alternate legs quickly"
                                }
                            ]
                        }
                    ],
                    "muscle-gain": [
                        {
                            "id": "mg_beg_1",
                            "name": "Beginner Muscle Building - Week 1",
                            "duration": "35 minutes",
                            "exercises": [
                                {
                                    "name": "Push-ups",
                                    "sets": 3,
                                    "reps": 10,
                                    "rest": "60 seconds",
                                    "instruction": "Focus on controlled movement, full range of motion"
                                },
                                {
                                    "name": "Bodyweight Squats",
                                    "sets": 3,
                                    "reps": 15,
                                    "rest": "60 seconds",
                                    "instruction": "Go slow on the way down, explode up"
                                },
                                {
                                    "name": "Lunges",
                                    "sets": 3,
                                    "reps": "10 each leg",
                                    "rest": "60 seconds",
                                    "instruction": "Step forward, lower back knee almost to ground"
                                },
                                {
                                    "name": "Pike Push-ups",
                                    "sets": 3,
                                    "reps": 8,
                                    "rest": "60 seconds",
                                    "instruction": "Start in downward dog, lower head towards hands"
                                },
                                {
                                    "name": "Glute Bridges",
                                    "sets": 3,
                                    "reps": 15,
                                    "rest": "45 seconds",
                                    "instruction": "Squeeze glutes at the top, hold for 1 second"
                                }
                            ]
                        }
                    ],
                    "general-fitness": [
                        {
                            "id": "gf_beg_1",
                            "name": "General Fitness - Full Body",
                            "duration": "25 minutes",
                            "exercises": [
                                {
                                    "name": "Walking in Place",
                                    "sets": 1,
                                    "reps": "3 minutes",
                                    "rest": "30 seconds",
                                    "instruction": "Start with gentle pace, gradually increase intensity"
                                },
                                {
                                    "name": "Arm Circles",
                                    "sets": 2,
                                    "reps": "10 forward, 10 backward",
                                    "rest": "30 seconds",
                                    "instruction": "Keep arms straight, make controlled circles"
                                },
                                {
                                    "name": "Modified Squats",
                                    "sets": 3,
                                    "reps": 10,
                                    "rest": "60 seconds",
                                    "instruction": "Use chair for support if needed"
                                },
                                {
                                    "name": "Wall Push-ups",
                                    "sets": 3,
                                    "reps": 10,
                                    "rest": "45 seconds",
                                    "instruction": "Stand arm's length from wall, push off wall"
                                },
                                {
                                    "name": "Stretching",
                                    "sets": 1,
                                    "reps": "5 minutes",
                                    "rest": "0",
                                    "instruction": "Hold each stretch for 30 seconds"
                                }
                            ]
                        }
                    ]
                },
                "intermediate": {
                    "weight-loss": [
                        {
                            "id": "wl_int_1",
                            "name": "Intermediate Weight Loss HIIT",
                            "duration": "40 minutes",
                            "exercises": [
                                {
                                    "name": "Burpees",
                                    "sets": 4,
                                    "reps": 8,
                                    "rest": "45 seconds",
                                    "instruction": "Jump up, squat down, jump back, push-up, repeat"
                                },
                                {
                                    "name": "High Knees",
                                    "sets": 4,
                                    "reps": "45 seconds",
                                    "rest": "30 seconds",
                                    "instruction": "Bring knees up to chest level, pump arms"
                                },
                                {
                                    "name": "Jump Squats",
                                    "sets": 4,
                                    "reps": 12,
                                    "rest": "45 seconds",
                                    "instruction": "Squat down, jump up explosively"
                                },
                                {
                                    "name": "Push-up to T",
                                    "sets": 3,
                                    "reps": 10,
                                    "rest": "60 seconds",
                                    "instruction": "Push-up, rotate to side plank, alternate sides"
                                },
                                {
                                    "name": "Russian Twists",
                                    "sets": 3,
                                    "reps": 20,
                                    "rest": "45 seconds",
                                    "instruction": "Sit with feet lifted, twist torso side to side"
                                }
                            ]
                        }
                    ]
                }
            };
            await fs.writeFile(WORKOUTS_DB, JSON.stringify(workouts, null, 2));
        }
        
        // Initialize meals.json
        try {
            await fs.access(MEALS_DB);
        } catch {
            const meals = {
                "weight-loss": {
                    "breakfast": [
                        {
                            "name": "Banana Oat Smoothie",
                            "calories": 280,
                            "protein": 12,
                            "carbs": 45,
                            "fat": 8,
                            "ingredients": ["1 banana", "1/2 cup oats", "1 cup low-fat milk", "1 tbsp honey"],
                            "instructions": "Blend all ingredients until smooth. Great pre-workout meal!"
                        },
                        {
                            "name": "Ugali with Vegetables",
                            "calories": 320,
                            "protein": 8,
                            "carbs": 58,
                            "fat": 6,
                            "ingredients": ["1 cup ugali", "Mixed vegetables", "1 tsp oil"],
                            "instructions": "Serve ugali with steamed vegetables seasoned lightly."
                        }
                    ],
                    "lunch": [
                        {
                            "name": "Grilled Chicken with Sweet Potato",
                            "calories": 450,
                            "protein": 35,
                            "carbs": 40,
                            "fat": 12,
                            "ingredients": ["150g chicken breast", "1 medium sweet potato", "Green salad"],
                            "instructions": "Grill chicken, bake sweet potato, serve with fresh salad."
                        },
                        {
                            "name": "Bean and Vegetable Stew",
                            "calories": 380,
                            "protein": 18,
                            "carbs": 52,
                            "fat": 10,
                            "ingredients": ["1 cup cooked beans", "Mixed vegetables", "1 tbsp oil", "Spices"],
                            "instructions": "Simmer beans with vegetables and traditional spices."
                        }
                    ],
                    "dinner": [
                        {
                            "name": "Fish with Steamed Vegetables",
                            "calories": 320,
                            "protein": 28,
                            "carbs": 15,
                            "fat": 18,
                            "ingredients": ["150g tilapia", "Broccoli", "Carrots", "1 tbsp olive oil"],
                            "instructions": "Steam fish and vegetables, drizzle with olive oil."
                        }
                    ]
                },
                "muscle-gain": {
                    "breakfast": [
                        {
                            "name": "Protein Power Bowl",
                            "calories": 520,
                            "protein": 28,
                            "carbs": 45,
                            "fat": 22,
                            "ingredients": ["3 eggs", "1 slice whole grain bread", "1/2 avocado", "1 banana"],
                            "instructions": "Scramble eggs, serve with toast, avocado, and banana."
                        }
                    ],
                    "lunch": [
                        {
                            "name": "Chicken and Rice Bowl",
                            "calories": 680,
                            "protein": 42,
                            "carbs": 72,
                            "fat": 18,
                            "ingredients": ["200g chicken", "1.5 cups brown rice", "Mixed vegetables"],
                            "instructions": "Season and grill chicken, serve over rice with vegetables."
                        }
                    ],
                    "dinner": [
                        {
                            "name": "Beef Stew with Posho",
                            "calories": 580,
                            "protein": 38,
                            "carbs": 48,
                            "fat": 22,
                            "ingredients": ["150g lean beef", "1 cup posho", "Vegetables", "Spices"],
                            "instructions": "Slow cook beef with vegetables, serve with posho."
                        }
                    ]
                }
            };
            await fs.writeFile(MEALS_DB, JSON.stringify(meals, null, 2));
        }
        
        // Initialize progress.json
        try {
            await fs.access(PROGRESS_DB);
        } catch {
            await fs.writeFile(PROGRESS_DB, JSON.stringify({}));
        }
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Database helper functions
async function readJSONFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return null;
    }
}

async function writeJSONFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Routes

// Test route
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Fit Lab API is running!' });
});

// Auth Routes

// Register new user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, age, fitnessGoal, experience, password, workoutTime, dietaryPreference } = req.body;
        
        // Validation
        if (!name || !email || !age || !fitnessGoal || !experience || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All required fields must be provided' 
            });
        }
        
        // Check if user already exists
        const users = await readJSONFile(USERS_DB);
        if (!users) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User with this email already exists' 
            });
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            age: parseInt(age),
            fitnessGoal,
            experience,
            workoutTime: workoutTime || '30-45',
            dietaryPreference: dietaryPreference || 'omnivore',
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            isActive: true,
            profile: {
                currentWeight: null,
                targetWeight: null,
                height: null,
                workoutsCompleted: 0,
                totalWorkoutTime: 0,
                streakDays: 0,
                lastWorkout: null
            }
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save to database
        const saved = await writeJSONFile(USERS_DB, users);
        if (!saved) {
            return res.status(500).json({ success: false, message: 'Failed to save user data' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );
        
        // Remove password from response
        const userResponse = { ...newUser };
        delete userResponse.password;
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userResponse,
            token
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error during registration' 
        });
    }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }
        
        // Find user
        const users = await readJSONFile(USERS_DB);
        if (!users) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );
        
        // Remove password from response
        const userResponse = { ...user };
        delete userResponse.password;
        
        res.json({
            success: true,
            message: 'Login successful',
            user: userResponse,
            token
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error during login' 
        });
    }
});

// Verify token
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
    try {
        const users = await readJSONFile(USERS_DB);
        const user = users.find(u => u.id === req.user.userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const userResponse = { ...user };
        delete userResponse.password;
        
        res.json({ success: true, user: userResponse });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Workout Routes

// Get workout plan based on user's goal and experience
app.get('/api/workouts', authenticateToken, async (req, res) => {
    try {
        const users = await readJSONFile(USERS_DB);
        const user = users.find(u => u.id === req.user.userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const workouts = await readJSONFile(WORKOUTS_DB);
        if (!workouts) {
            return res.status(500).json({ success: false, message: 'Workouts database error' });
        }
        
        const userWorkouts = workouts[user.experience]?.[user.fitnessGoal] || [];
        
        res.json({
            success: true,
            workouts: userWorkouts,
            userProfile: {
                experience: user.experience,
                fitnessGoal: user.fitnessGoal,
                workoutTime: user.workoutTime
            }
        });
        
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Meal Routes

// Get meal plans based on user's goal
app.get('/api/meals', authenticateToken, async (req, res) => {
    try {
        const users = await readJSONFile(USERS_DB);
        const user = users.find(u => u.id === req.user.userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const meals = await readJSONFile(MEALS_DB);
        if (!meals) {
            return res.status(500).json({ success: false, message: 'Meals database error' });
        }
        
        const userMeals = meals[user.fitnessGoal] || meals['general-fitness'] || {};
        
        res.json({
            success: true,
            meals: userMeals,
            userProfile: {
                fitnessGoal: user.fitnessGoal,
                dietaryPreference: user.dietaryPreference
            }
        });
        
    } catch (error) {
        console.error('Error fetching meals:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Progress Routes

// Log workout completion
app.post('/api/progress/workout', authenticateToken, async (req, res) => {
    try {
        const { workoutId, duration, exercisesCompleted, notes } = req.body;
        
        const users = await readJSONFile(USERS_DB);
        const userIndex = users.findIndex(u => u.id === req.user.userId);
        
        if (userIndex === -1) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Update user profile
        users[userIndex].profile.workoutsCompleted += 1;
        users[userIndex].profile.totalWorkoutTime += parseInt(duration) || 30;
        users[userIndex].profile.lastWorkout = new Date().toISOString();
        
        // Save updated user data
        await writeJSONFile(USERS_DB, users);
        
        // Log progress entry
        const progress = await readJSONFile(PROGRESS_DB);
        if (!progress[req.user.userId]) {
            progress[req.user.userId] = { workouts: [], meals: [] };
        }
        
        progress[req.user.userId].workouts.push({
            id: Date.now().toString(),
            workoutId,
            duration: parseInt(duration) || 30,
            exercisesCompleted: exercisesCompleted || 0,
            notes: notes || '',
            completedAt: new Date().toISOString()
        });
        
        await writeJSONFile(PROGRESS_DB, progress);
        
        res.json({
            success: true,
            message: 'Workout logged successfully',
            stats: users[userIndex].profile
        });
        
    } catch (error) {
        console.error('Error logging workout:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get user progress
app.get('/api/progress', authenticateToken, async (req, res) => {
    try {
        const progress = await readJSONFile(PROGRESS_DB);
        const userProgress = progress[req.user.userId] || { workouts: [], meals: [] };
        
        const users = await readJSONFile(USERS_DB);
        const user = users.find(u => u.id === req.user.userId);
        
        res.json({
            success: true,
            progress: userProgress,
            profile: user?.profile || {}
        });
        
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Dashboard data
app.get('/api/dashboard', authenticateToken, async (req, res) => {
    try {
        const users = await readJSONFile(USERS_DB);
        const user = users.find(u => u.id === req.user.userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const progress = await readJSONFile(PROGRESS_DB);
        const userProgress = progress[user.id] || { workouts: [], meals: [] };
        
        // Get recent workouts (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentWorkouts = userProgress.workouts.filter(w => 
            new Date(w.completedAt) > sevenDaysAgo
        );
        
        // Calculate streak
        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        let streak = 0;
        const sortedWorkouts = userProgress.workouts.sort((a, b) => 
            new Date(b.completedAt) - new Date(a.completedAt)
        );
        
        // Simple streak calculation
        if (sortedWorkouts.length > 0) {
            const lastWorkoutDate = new Date(sortedWorkouts[0].completedAt).toDateString();
            if (lastWorkoutDate === today || lastWorkoutDate === yesterday.toDateString()) {
                streak = 1; // Simplified - in real app, calculate proper streak
            }
        }
        
        res.json({
            success: true,
            user: {
                name: user.name,
                fitnessGoal: user.fitnessGoal,
                experience: user.experience,
                profile: user.profile
            },
            stats: {
                workoutsThisWeek: recentWorkouts.length,
                totalWorkouts: user.profile.workoutsCompleted,
                totalWorkoutTime: user.profile.totalWorkoutTime,
                currentStreak: streak,
                lastWorkout: user.profile.lastWorkout
            },
            recentActivity: recentWorkouts.slice(0, 5)
        });
        
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Initialize database and start server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Fit Lab API server running on port ${PORT}`);
        console.log(`📊 Database initialized in: ${DB_DIR}`);
        console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
    });
}).catch(error => {
    console.error('Failed to start server:', error);
});