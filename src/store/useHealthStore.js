import { create } from 'zustand';
import { calculateRisk } from '../utils/mockRiskLogic';

// Helper function to calculate streak
const calculateStreak = (history) => {
    if (!history || history.length === 0) return 0;

    // Sort by date descending
    const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

    let streak = 0;
    const today = new Date().setHours(0, 0, 0, 0);

    // Check if the most recent entry is today or yesterday to start the streak
    const lastEntryDate = new Date(sortedHistory[0].date).setHours(0, 0, 0, 0);
    const diffDays = (today - lastEntryDate) / (1000 * 60 * 60 * 24);

    if (diffDays > 1) return 0; // Streak broken

    streak = 1;
    let currentDate = lastEntryDate;

    for (let i = 1; i < sortedHistory.length; i++) {
        const entryDate = new Date(sortedHistory[i].date).setHours(0, 0, 0, 0);
        const diff = (currentDate - entryDate) / (1000 * 60 * 60 * 24);

        if (diff === 1) {
            streak++;
            currentDate = entryDate;
        } else if (diff === 0) {
            // Same day, continue
            continue;
        } else {
            break; // Streak broken
        }
    }
    return streak;
};

// Helper to calculate age from birthDate
const calculateAge = (birthDate) => {
    if (!birthDate) return 45; // Default fallback
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

export const useHealthStore = create((set, get) => ({
    isAuthenticated: false,
    user: null,
    currentView: 'dashboard', // 'dashboard' or 'profile'
    streakExtended: false, // Flag to trigger celebration

    setView: (view) => set({ currentView: view }),
    resetStreakExtended: () => set({ streakExtended: false }),

    userMetrics: {
        age: 45,
        gender: 'male',
        sbp: 120,
        lipids: { total: 200, hdl: 50 },
        smoking: 0, // Cigarettes per day
    },

    assessment: null,

    // Auth Actions
    login: (userData) => {
        // Mock history for demonstration
        const mockHistory = [
            {
                date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                riskScore: 4,
                riskCategory: 'Low',
                metrics: { age: 55, gender: 'male', sbp: 118, smoking: 0, lipids: { total: 190, hdl: 55 } }
            },
            {
                date: new Date(Date.now() - 86400000 * 2).toISOString(),
                riskScore: 5,
                riskCategory: 'Low',
                metrics: { age: 55, gender: 'male', sbp: 120, smoking: 0, lipids: { total: 195, hdl: 52 } }
            },
            {
                date: new Date(Date.now() - 86400000 * 5).toISOString(),
                riskScore: 8,
                riskCategory: 'Low',
                metrics: { age: 55, gender: 'male', sbp: 125, smoking: 2, lipids: { total: 210, hdl: 48 } }
            },
            {
                date: new Date(Date.now() - 86400000 * 12).toISOString(),
                riskScore: 12,
                riskCategory: 'Moderate',
                metrics: { age: 55, gender: 'male', sbp: 135, smoking: 5, lipids: { total: 230, hdl: 45 } }
            },
            {
                date: new Date(Date.now() - 86400000 * 25).toISOString(),
                riskScore: 15,
                riskCategory: 'High',
                metrics: { age: 54, gender: 'male', sbp: 142, smoking: 10, lipids: { total: 245, hdl: 40 } }
            },
            {
                date: new Date(Date.now() - 86400000 * 45).toISOString(),
                riskScore: 14,
                riskCategory: 'Moderate',
                metrics: { age: 54, gender: 'male', sbp: 138, smoking: 12, lipids: { total: 240, hdl: 42 } }
            },
            {
                date: new Date(Date.now() - 86400000 * 60).toISOString(),
                riskScore: 18,
                riskCategory: 'High',
                metrics: { age: 54, gender: 'male', sbp: 145, smoking: 15, lipids: { total: 255, hdl: 38 } }
            },
            {
                date: new Date(Date.now() - 86400000 * 90).toISOString(),
                riskScore: 22,
                riskCategory: 'High',
                metrics: { age: 54, gender: 'male', sbp: 150, smoking: 20, lipids: { total: 265, hdl: 35 } }
            },
            {
                date: new Date(Date.now() - 86400000 * 120).toISOString(),
                riskScore: 20,
                riskCategory: 'High',
                metrics: { age: 53, gender: 'male', sbp: 148, smoking: 20, lipids: { total: 260, hdl: 36 } }
            },
            {
                date: new Date(Date.now() - 86400000 * 150).toISOString(),
                riskScore: 25,
                riskCategory: 'Very High',
                metrics: { age: 53, gender: 'male', sbp: 155, smoking: 25, lipids: { total: 270, hdl: 32 } }
            }
        ];

        const currentStreak = calculateStreak(mockHistory);
        const latestMetrics = mockHistory[0]?.metrics || {};

        set({
            isAuthenticated: true,
            user: {
                name: 'Alex Doe',
                email: 'alex.doe@example.com',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
                height: 175,
                weight: 70,
                diabetes: false,
                familyHistory: false,
                streak: currentStreak,
                riskGoal: 5, // Default goal
                history: mockHistory,
                birthDate: '1980-01-01', // Default birth date
                ...userData
            },
            // Smart Defaults: Pre-fill metrics from latest history
            userMetrics: {
                age: calculateAge('1980-01-01'), // Initial calculation
                gender: latestMetrics.gender || 'male',
                sbp: latestMetrics.sbp || 120,
                lipids: latestMetrics.lipids || { total: 200, hdl: 50 },
                smoking: latestMetrics.smoking || 0,
            }
        });
    },

    logout: () => set({ isAuthenticated: false, user: null, assessment: null }),

    // Profile Actions
    updateProfile: (updates) => set((state) => {
        const updatedUser = { ...state.user, ...updates };
        // If birthDate changed, update userMetrics.age
        let updatedMetrics = { ...state.userMetrics };
        if (updates.birthDate) {
            updatedMetrics.age = calculateAge(updates.birthDate);
        }
        return {
            user: updatedUser,
            userMetrics: updatedMetrics
        };
    }),

    // Metrics & Assessment
    setMetrics: (metrics) => set((state) => ({
        userMetrics: { ...state.userMetrics, ...metrics }
    })),

    runAssessment: () => {
        const { userMetrics, user } = get();
        // Recalculate age to be sure
        const currentAge = calculateAge(user.birthDate);
        const metricsWithAge = { ...userMetrics, age: currentAge };

        // Pass optional profile data to calculation if needed
        const result = calculateRisk({ ...metricsWithAge, ...user });

        set({ assessment: result, userMetrics: metricsWithAge });
    },

    saveAssessment: () => {
        const { assessment, user, userMetrics } = get();
        if (!assessment || !user) return;

        const newHistoryItem = {
            date: new Date().toISOString(),
            riskScore: assessment.riskScore,
            riskCategory: assessment.riskCategory,
            metrics: { ...userMetrics }
        };

        const newHistory = [newHistoryItem, ...user.history];
        const newStreak = calculateStreak(newHistory);
        const streakExtended = newStreak > (user.streak || 0);

        set({
            user: {
                ...user,
                history: newHistory,
                streak: newStreak
            },
            // assessment: null, // Keep assessment to show results
            streakExtended // Trigger celebration if true
        });
    },

    resetAssessment: () => set({ assessment: null })
}));
