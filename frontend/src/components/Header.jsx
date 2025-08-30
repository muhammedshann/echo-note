import React from "react";
import { Brain, Menu } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="/" className="flex items-center space-x-3">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                            <Brain className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            EchoNote
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                            Features
                        </a>
                        <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                            Testimonials
                        </a>
                        <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                            Pricing
                        </a>
                        <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                            About
                        </a>
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        <a href="/login">
                            <button className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                Sign In
                            </button>
                        </a>
                        <a href="/dashboard">
                            <button className="px-5 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200">
                                Get Started
                            </button>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-5 w-5 text-gray-700" />
                        ) : (
                            <Menu className="h-5 w-5 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-100 shadow-lg mx-6 rounded-lg overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        <nav className="p-6 space-y-4">
                            <a
                                href="#features"
                                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Features
                            </a>
                            <a
                                href="#testimonials"
                                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Testimonials
                            </a>
                            <a
                                href="#pricing"
                                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Pricing
                            </a>
                            <a
                                href="#about"
                                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </a>

                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                <a href="/login" className="block">
                                    <button
                                        className="w-full px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 text-left"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign In
                                    </button>
                                </a>
                                <a href="/dashboard" className="block">
                                    <button
                                        className="w-full px-5 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Get Started
                                    </button>
                                </a>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;