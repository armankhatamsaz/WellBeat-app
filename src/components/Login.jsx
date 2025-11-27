import React, { useState } from 'react';
import { useHealthStore } from '../store/useHealthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Login = () => {
    const login = useHealthStore((state) => state.login);
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock login/register logic
        if (formData.email && formData.password) {
            login({
                name: formData.name || 'User',
                email: formData.email,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
            });
        }
    };



    const handleGoogleLogin = () => {
        login({
            name: 'Alex Doe',
            email: 'alex.doe@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/50 max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-500/30">
                        <Heart size={32} fill="currentColor" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {isRegistering ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-slate-500">
                        {isRegistering
                            ? 'Start your heart health journey today.'
                            : 'Sign in to continue tracking your progress.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {isRegistering && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 overflow-hidden"
                            >
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all mt-6"
                    >
                        <span>{isRegistering ? 'Sign Up' : 'Sign In'}</span>
                        <ArrowRight size={20} />
                    </button>
                </form>



                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-500">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-3"
                >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    <span>Google</span>
                </button>

                <div className="mt-8 text-center">
                    <p className="text-slate-600">
                        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="ml-2 text-blue-600 font-bold hover:underline"
                        >
                            {isRegistering ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
