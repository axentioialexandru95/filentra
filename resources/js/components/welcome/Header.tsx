import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Moon, Sun } from 'lucide-react';

interface HeaderProps {
    isDark: boolean;
    toggleTheme: () => void;
    auth: {
        user?: {
            name: string;
            email: string;
        };
    };
}

export function Header({ isDark, toggleTheme, auth }: HeaderProps) {
    // For demo purposes, redirect to the first available tenant
    // 1. Check if user has a tenant assigned
    // 2. If user has multiple tenants, show a selection
    // 3. Use the user's last accessed tenant
    const getDashboardUrl = () => {
        return route('dashboard');
    };

    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4">
                <nav className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <motion.div
                                className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 opacity-75 blur-sm"
                                animate={{ opacity: [0.75, 0.9, 0.75] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-xs font-bold text-white shadow-lg sm:h-10 sm:w-10 sm:text-sm">
                                F
                            </div>
                        </motion.div>
                        <div className="flex items-center">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                                Filentra
                            </span>
                            <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
                                <Badge variant="secondary" className="ml-1 text-xs sm:ml-2">
                                    Beta
                                </Badge>
                            </motion.div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Theme Toggle */}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleTheme}
                                className="h-8 w-8 p-0 transition-all duration-300 hover:bg-accent/50 sm:h-9 sm:w-9"
                            >
                                <motion.div initial={false} animate={{ rotate: isDark ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                </motion.div>
                            </Button>
                        </motion.div>

                        {auth.user ? (
                            <Link href={getDashboardUrl()}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="group h-8 px-3 shadow-lg transition-all duration-300 hover:shadow-xl sm:h-auto sm:px-4">
                                        <span className="hidden sm:inline">Dashboard</span>
                                        <span className="sm:hidden">Go</span>
                                        <motion.div className="ml-1 sm:ml-2" whileHover={{ x: 2 }}>
                                            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </motion.div>
                                    </Button>
                                </motion.div>
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <Link href={route('login')}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button variant="ghost" className="h-8 px-2 transition-all duration-300 hover:bg-accent/50 sm:h-auto sm:px-4">
                                            <span className="hidden sm:inline">Sign In</span>
                                            <span className="sm:hidden">Login</span>
                                        </Button>
                                    </motion.div>
                                </Link>
                                <Link href={route('register')}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button className="h-8 px-2 shadow-lg transition-all duration-300 hover:shadow-xl sm:h-auto sm:px-4">
                                            <span className="hidden sm:inline">Get Started</span>
                                            <span className="sm:hidden">Start</span>
                                        </Button>
                                    </motion.div>
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
