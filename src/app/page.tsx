import Link from 'next/link';
import { ArrowRight, CheckCircle2, LayoutDashboard, Users, BarChart3, Shield, Zap, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Navigation */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                                <img src="/logo.svg" alt="LeadFlow Logo" className="h-5 w-5 invert" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">LeadFlow</span>
                        </div>

                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
                            <a href="#solutions" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Solutions</a>
                            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Pricing</a>
                        </nav>

                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                                Log in
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-200">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="absolute top-0 right-0 -z-10 w-1/3 h-1/3 bg-indigo-50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 -z-10 w-1/4 h-1/4 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 animate-fade-in">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                            <span>Version 2.0 is now live</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 animate-slide-up">
                            Scale your sales <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                                effortlessly with LeadFlow
                            </span>
                        </h1>

                        <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10 leading-relaxed animate-slide-up animation-delay-100">
                            The all-in-one lead management platform designed for high-growth teams.
                            Track pipelines, automate assignments, and close deals faster than ever.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-200">
                            <Link href="/signup">
                                <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group shadow-xl shadow-indigo-200">
                                    Start Your Free Trial
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="secondary" className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-full text-base font-bold hover:bg-gray-50 transition-all">
                                    Book a Demo
                                </Button>
                            </Link>
                        </div>

                        {/* Mockup Preview */}
                        <div className="mt-20 relative max-w-5xl mx-auto animate-fade-in animation-delay-300">
                            <div className="relative rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl">
                                <div className="rounded-xl overflow-hidden bg-gray-50 aspect-[16/10]">
                                    <img
                                        src="/images/dashboard-desktop.png"
                                        alt="LeadFlow Dashboard Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 hidden lg:block w-64 p-4 rounded-xl bg-white shadow-xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Conversion</p>
                                        <p className="text-lg font-bold text-gray-900">+12.4%</p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-[70%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                                Designed for speed and efficiency
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Stop juggling spreadsheets. LeadFlow gives you the tools to manage your entire sales cycle in one place.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'Smart Pipeline',
                                    desc: 'Visual Kanban boards that help you track every lead from acquisition to close.',
                                    icon: LayoutDashboard,
                                    color: 'bg-blue-50 text-blue-600'
                                },
                                {
                                    title: 'Team Assignment',
                                    desc: 'Automatically route leads to the right agents based on capacity and skill.',
                                    icon: Users,
                                    color: 'bg-emerald-50 text-emerald-600'
                                },
                                {
                                    title: 'Real-time Analytics',
                                    desc: 'Gain deep insights into your sales performance with dynamic reporting.',
                                    icon: BarChart3,
                                    color: 'bg-purple-50 text-purple-600'
                                },
                                {
                                    title: 'Secure by Design',
                                    desc: 'Enterprise-grade security with Supabase integration and role-based access.',
                                    icon: Shield,
                                    color: 'bg-indigo-50 text-indigo-600'
                                },
                                {
                                    title: 'Lightning Fast',
                                    desc: 'Built on Next.js 16 for a modern, high-performance experience.',
                                    icon: Zap,
                                    color: 'bg-amber-50 text-amber-600'
                                },
                                {
                                    title: 'Goal Tracking',
                                    desc: 'Set and monitor sales targets for your entire team easily.',
                                    icon: Target,
                                    color: 'bg-red-50 text-red-600'
                                }
                            ].map((feature, i) => (
                                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Closing CTA */}
                <section className="py-24">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-indigo-600 rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-300">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/50 to-transparent pointer-events-none" />

                            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 tracking-tight relative z-10">
                                Ready to transform your <br className="hidden sm:block" /> sales workflow?
                            </h2>
                            <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto relative z-10">
                                Join thousands of high-performing teams already using LeadFlow to scale their business.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                                <Link href="/signup">
                                    <Button
                                        style={{ color: '#4f46e5' }}
                                        className="w-full sm:w-auto bg-white hover:bg-gray-50 px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                                    >
                                        Get Started Now
                                    </Button>
                                </Link>
                                <Link href="/login" className="text-white font-medium hover:underline flex items-center gap-1 transition-all">
                                    Existing customer? Sign in <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                        <div className="col-span-2 lg:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                                    <img src="/logo.svg" alt="LeadFlow Logo" className="h-5 w-5 invert" />
                                </div>
                                <span className="text-xl font-bold text-gray-900 tracking-tight">LeadFlow</span>
                            </div>
                            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                                Empowering sales teams with better data, faster workflows, and seamless lead management.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-gray-900 font-bold mb-6">Product</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Features</a></li>
                                <li><a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Integrations</a></li>
                                <li><a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Pricing</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-gray-900 font-bold mb-6">Company</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Blog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-gray-900 font-bold mb-6">Legal</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400">
                            © 2026 LeadFlow CRM Platform. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="h-5 w-5 bg-gray-200 rounded-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
