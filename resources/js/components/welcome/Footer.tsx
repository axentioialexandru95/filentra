import { Badge } from '@/shared/components/ui/badge';
import { motion } from 'framer-motion';

export function Footer() {
    return (
        <footer className="border-t bg-card/50 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-16">
                <motion.div
                    className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center space-x-4">
                        <motion.div className="relative" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <motion.div
                                className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 opacity-50 blur-sm"
                                animate={{ opacity: [0.5, 0.7, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-bold text-white">
                                F
                            </div>
                        </motion.div>
                        <div>
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                                Filentra
                            </span>
                            <Badge variant="outline" className="ml-2 text-xs">
                                Beta
                            </Badge>
                        </div>
                    </div>
                    <motion.div className="text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        Built with Laravel 12 + React 19 + TypeScript
                    </motion.div>
                </motion.div>
            </div>
        </footer>
    );
}
