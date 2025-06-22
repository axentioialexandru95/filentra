import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Moon, Sun } from 'lucide-react';

interface HeaderProps {
    isDark: boolean;
    toggleTheme: () => void;
    auth: { user?: object | null };
}

export function Header({ isDark, toggleTheme, auth }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-6 py-4">
                <nav className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <motion.div
                                className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 opacity-75 blur-sm"
                                animate={{ opacity: [0.75, 0.9, 0.75] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-bold text-white shadow-lg">
                                F
                            </div>
                        </motion.div>
                        <div>
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                                Filentra
                            </span>
                            <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
                                <Badge variant="secondary" className="ml-2 text-xs">
                                    Beta
                                </Badge>
                            </motion.div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleTheme}
                                className="h-9 w-9 p-0 transition-all duration-300 hover:bg-accent/50"
                            >
                                <motion.div initial={false} animate={{ rotate: isDark ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                </motion.div>
                            </Button>
                        </motion.div>

                        {auth.user ? (
                            <Link href={route('dashboard')}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="group shadow-lg transition-all duration-300 hover:shadow-xl">
                                        Dashboard
                                        <motion.div className="ml-2" whileHover={{ x: 2 }}>
                                            <ArrowRight className="h-4 w-4" />
                                        </motion.div>
                                    </Button>
                                </motion.div>
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link href={route('login')}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button variant="ghost" className="transition-all duration-300 hover:bg-accent/50">
                                            Sign In
                                        </Button>
                                    </motion.div>
                                </Link>
                                <Link href={route('register')}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button className="shadow-lg transition-all duration-300 hover:shadow-xl">Get Started</Button>
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
