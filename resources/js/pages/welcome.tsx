import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Props {
    auth?: {
        user?: {
            name: string;
            email: string;
        };
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    return (
        <>
            <Head title="Personal Finance Manager" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="relative min-h-screen flex flex-col items-center justify-center selection:bg-indigo-500 selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:justify-center lg:col-start-2">
                                <div className="flex items-center gap-3">
                                    <div className="text-4xl">💰</div>
                                    <h1 className="text-2xl font-bold text-gray-900">FinanceTracker</h1>
                                </div>
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth?.user ? (
                                    <div className="flex gap-4">
                                        <Link
                                            href="/finance"
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-indigo-500"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-indigo-500"
                                        >
                                            Profile
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex gap-4">
                                        <Link
                                            href="/login"
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-indigo-500"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-white ring-1 ring-transparent transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-indigo-700"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </header>

                        <main className="mt-6">
                            <div className="text-center">
                                <div className="text-8xl mb-8">💰</div>
                                <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                    Personal Finance Manager
                                </h1>
                                <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
                                    Take control of your financial future with our comprehensive personal finance management system. 
                                    Track income, expenses, and manage multiple accounts with precision using double-entry accounting.
                                </p>
                                
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    {auth?.user ? (
                                        <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500">
                                            <Link href="/finance">
                                                Go to Dashboard 📊
                                            </Link>
                                        </Button>
                                    ) : (
                                        <div className="flex gap-4">
                                            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500">
                                                <Link href="/register">
                                                    Get Started Free 🚀
                                                </Link>
                                            </Button>
                                            <Button asChild variant="outline" size="lg">
                                                <Link href="/login">
                                                    Sign In 👋
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-xl bg-white/60 backdrop-blur-sm p-6 shadow-sm border border-white/20">
                                    <div className="text-3xl mb-4">🏦</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Accounts</h3>
                                    <p className="text-gray-600">
                                        Manage cash, bank accounts, e-wallets, and credit cards all in one place.
                                    </p>
                                </div>

                                <div className="rounded-xl bg-white/60 backdrop-blur-sm p-6 shadow-sm border border-white/20">
                                    <div className="text-3xl mb-4">📈</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Income & Expense Tracking</h3>
                                    <p className="text-gray-600">
                                        Categorize and track every transaction with detailed reporting and analytics.
                                    </p>
                                </div>

                                <div className="rounded-xl bg-white/60 backdrop-blur-sm p-6 shadow-sm border border-white/20">
                                    <div className="text-3xl mb-4">⚖️</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Double-Entry Accounting</h3>
                                    <p className="text-gray-600">
                                        Ensure financial accuracy with professional double-entry bookkeeping principles.
                                    </p>
                                </div>

                                <div className="rounded-xl bg-white/60 backdrop-blur-sm p-6 shadow-sm border border-white/20">
                                    <div className="text-3xl mb-4">🔒</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
                                    <p className="text-gray-600">
                                        Your financial data is completely private and isolated from other users.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-16 rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg border border-white/30">
                                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                                    Key Features ✨
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">💳</div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Account Management</h4>
                                            <p className="text-gray-600">Create and manage various account types including cash, bank accounts, and e-wallets</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">📝</div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Transaction Recording</h4>
                                            <p className="text-gray-600">Log every financial transaction with detailed descriptions and categorization</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">📊</div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Balance Tracking</h4>
                                            <p className="text-gray-600">Real-time balance updates across all accounts with automatic calculations</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">🏷️</div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Expense Categories</h4>
                                            <p className="text-gray-600">Organize spending with customizable categories like groceries, utilities, and transportation</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!auth?.user && (
                                <div className="mt-16 text-center">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        Ready to Take Control of Your Finances? 🎯
                                    </h2>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Join thousands of users who trust our platform to manage their personal finances securely.
                                    </p>
                                    <div className="flex gap-4 justify-center">
                                        <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500">
                                            <Link href="/register">
                                                Create Free Account 🆓
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" size="lg">
                                            <Link href="/login">
                                                Already have an account? Sign In
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </main>

                        <footer className="py-16 text-center text-sm text-gray-500">
                            <p>Built with Laravel & React • Secure • Private • Professional</p>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}