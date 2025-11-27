import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Cigarette, Activity, Droplet, User, Calendar } from 'lucide-react';
import { useHealthStore } from '../store/useHealthStore';

const AssessmentInputForm = () => {
    const userMetrics = useHealthStore((state) => state.userMetrics);
    const setMetrics = useHealthStore((state) => state.setMetrics);
    const runAssessment = useHealthStore((state) => state.runAssessment);
    const saveAssessment = useHealthStore((state) => state.saveAssessment);
    const setView = useHealthStore((state) => state.setView);
    const updateProfile = useHealthStore((state) => state.updateProfile);

    // Initialize with current metrics or defaults
    const [formData, setFormData] = useState({
        age: userMetrics.age || 45,
        gender: userMetrics.gender || 'male',
        sbp: userMetrics.sbp || 120,
        smoking: userMetrics.smoking || 0,
        cholesterol: userMetrics.lipids?.total || 200,
        hdl: userMetrics.lipids?.hdl || 50
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCalculate = () => {
        // Update store metrics
        setMetrics({
            age: Number(formData.age),
            gender: formData.gender,
            sbp: Number(formData.sbp),
            smoking: Number(formData.smoking),
            lipids: {
                total: Number(formData.cholesterol),
                hdl: Number(formData.hdl)
            }
        });

        // Also update profile birthDate roughly based on age if needed, 
        // but for now we just rely on metrics for calculation.
        // Actually, runAssessment uses calculateAge(user.birthDate) which might override this.
        // We need to ensure runAssessment uses the metrics we just set.
        // Looking at useHealthStore:
        // runAssessment: () => {
        //    const { userMetrics, user } = get();
        //    const currentAge = calculateAge(user.birthDate);
        //    const metricsWithAge = { ...userMetrics, age: currentAge };
        //    ...
        // }
        // It overrides age! We need to update birthDate in profile to match the age entered,
        // OR we need to modify the store to accept age directly.
        // Given the user wants "always choose them in the card", let's update the birthDate 
        // to a mock date matching the age so the store logic holds.

        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - Number(formData.age);
        const mockBirthDate = `${birthYear}-01-01`;

        updateProfile({
            birthDate: mockBirthDate,
            gender: formData.gender // Update gender in profile too
        });

        // Run and Save Assessment
        // We need to wait for the state update to propagate or just trust that updateProfile does it synchronously enough 
        // (Zustand set is sync usually, but let's be safe).
        // Actually, updateProfile updates userMetrics.age too.

        setTimeout(() => {
            runAssessment();
            saveAssessment();
            setView('assessment');
        }, 10);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-full overflow-y-auto"
        >
            <h3 className="text-xl font-bold text-slate-900 mb-6">Enter Data</h3>

            <div className="space-y-6">
                {/* Age & Gender Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Calendar size={18} className="text-slate-500" />
                            Age
                        </label>
                        <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => handleChange('age', e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 outline-none font-medium"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <User size={18} className="text-blue-500" />
                            Gender
                        </label>
                        <select
                            value={formData.gender}
                            onChange={(e) => handleChange('gender', e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                {/* SBP Input */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Activity size={18} className="text-rose-500" />
                        Systolic Blood Pressure
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="90"
                            max="200"
                            value={formData.sbp}
                            onChange={(e) => handleChange('sbp', e.target.value)}
                            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                        <div className="w-16 p-2 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-slate-900">
                            {formData.sbp}
                        </div>
                    </div>
                </div>

                {/* Cholesterol Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Droplet size={18} className="text-amber-500" />
                            Total Chol.
                        </label>
                        <input
                            type="number"
                            value={formData.cholesterol}
                            onChange={(e) => handleChange('cholesterol', e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Droplet size={18} className="text-emerald-500" />
                            HDL Chol.
                        </label>
                        <input
                            type="number"
                            value={formData.hdl}
                            onChange={(e) => handleChange('hdl', e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                        />
                    </div>
                </div>

                {/* Smoking Input */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Cigarette size={18} className="text-slate-500" />
                        Cigarettes / Day
                    </label>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleChange('smoking', Math.max(0, Number(formData.smoking) - 1))}
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 transition-colors"
                        >
                            -
                        </button>
                        <span className="flex-1 text-center font-bold text-xl text-slate-900">{formData.smoking}</span>
                        <button
                            onClick={() => handleChange('smoking', Number(formData.smoking) + 1)}
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
                >
                    <Activity size={20} />
                    Calculate & Save
                </button>
            </div>
        </motion.div>
    );
};

export default AssessmentInputForm;
