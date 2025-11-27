import React, { useState, useEffect } from 'react';
import { useHealthStore } from '../store/useHealthStore';
import { motion } from 'framer-motion';
import { User, Save, ArrowLeft } from 'lucide-react';
import CalendarView from './CalendarView';
import TrendChart from './TrendChart';

const ProfileView = () => {
    const user = useHealthStore((state) => state.user);
    const updateProfile = useHealthStore((state) => state.updateProfile);
    const setView = useHealthStore((state) => state.setView);
    const assessment = useHealthStore((state) => state.assessment);

    const [formData, setFormData] = useState(user || {});

    useEffect(() => {
        if (user) setFormData(user);
    }, [user]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        updateProfile(formData);
        // Optional: Show success feedback
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setView(assessment ? 'assessment' : 'dashboard')}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Personal Profile</h2>
                        <p className="text-slate-500">Manage your health data and view history</p>
                    </div>
                </div>
            </motion.div>

            <div className="space-y-8">
                {/* Section 1: Trend Chart (Full Width) */}
                <div className="w-full">
                    {user?.history && <TrendChart data={user.history} goal={user?.riskGoal} />}
                </div>

                {/* Section 2: Profile Details */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <User size={20} className="text-blue-500" />
                        Profile Details
                    </h3>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Display Name</label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600">Height (cm)</label>
                                    <input
                                        type="number"
                                        value={formData.height || ''}
                                        onChange={(e) => handleChange('height', Number(e.target.value))}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={formData.weight || ''}
                                        onChange={(e) => handleChange('weight', Number(e.target.value))}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <span className="font-medium text-slate-700">Diabetes</span>
                                <button
                                    onClick={() => handleChange('diabetes', !formData.diabetes)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.diabetes ? 'bg-blue-500' : 'bg-slate-300'}`}
                                >
                                    <motion.div
                                        animate={{ x: formData.diabetes ? 24 : 2 }}
                                        className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <span className="font-medium text-slate-700">Family History</span>
                                <button
                                    onClick={() => handleChange('familyHistory', !formData.familyHistory)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.familyHistory ? 'bg-blue-500' : 'bg-slate-300'}`}
                                >
                                    <motion.div
                                        animate={{ x: formData.familyHistory ? 24 : 2 }}
                                        className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all active:scale-[0.98]"
                            >
                                <Save size={20} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 3: Calendar (Full Width) */}
                <div className="w-full">
                    <CalendarView />
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
