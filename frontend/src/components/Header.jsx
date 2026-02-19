import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getNavLinkClass = (isActive) => {
        const base = "text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 relative py-1";
        const activeState = isActive 
            ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-indigo-500" 
            : "text-zinc-500 hover:text-zinc-200";
        return `${base} ${activeState}`;
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/live-recording', label: 'Live Record' },
        { path: '/upload', label: 'Upload' },
        { path: '/youtube', label: 'YouTube' }
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-md">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.3)] group-hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]">
                        <Zap className="w-4 h-4 text-white fill-current" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold tracking-widest text-zinc-100 uppercase leading-tight">Echo-Note</span>
                        <span className="text-[8px] text-zinc-600 font-mono uppercase tracking-tighter leading-none">Muhammed Shan</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <ul className="flex gap-8">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <NavLink 
                                    to={link.path} 
                                    className={({ isActive }) => getNavLinkClass(isActive)}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className="h-4 w-px bg-zinc-800 mx-2" />

                    {/* System Status Display */}
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] text-zinc-600 font-mono tracking-widest uppercase">Node Active</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex md:hidden items-center">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-zinc-400 hover:text-white p-2 transition-colors"
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-black border-b border-zinc-900 animate-in slide-in-from-top-2 duration-300">
                    <ul className="flex flex-col p-6 gap-6">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <NavLink 
                                    to={link.path} 
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) => getNavLinkClass(isActive)}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                        <li className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                            <span className="text-[9px] text-zinc-600 font-mono tracking-widest uppercase">System: Secure</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Header;