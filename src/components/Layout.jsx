import React from 'react';
import { useHealthStore } from '../store/useHealthStore';
import { LogOut, Flame } from 'lucide-react';

const Layout = ({ children }) => {
    const user = useHealthStore((state) => state.user);
    const logout = useHealthStore((state) => state.logout);
    const setView = useHealthStore((state) => state.setView);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-20 pointer-events-none"></div>
            <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                        WB
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">Well-Beat</span>
                </div>
                <nav className="flex items-center gap-4">
                    {user && (
                        <>
                            {/* Streak Counter */}
                            <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                                <Flame className="text-orange-500 fill-orange-500" size={18} />
                                <span className="text-sm font-bold text-orange-700">{user.streak || 0} Day Streak</span>
                            </div>

                            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                                <button
                                    onClick={() => setView('profile')}
                                    className="flex items-center gap-3 hover:bg-slate-100 p-2 rounded-xl transition-all text-left group"
                                >
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{user.name}</p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-slate-100 group-hover:border-blue-200 transition-colors"
                                    />
                                </button>
                                <button
                                    onClick={logout}
                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                                    title="Sign Out"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    )}
                </nav>
            </header>
            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
