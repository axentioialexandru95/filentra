import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { motion } from 'framer-motion';
import { CheckCircle, LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    features: string[];
    color: string;
    index: number;
}

export function FeatureCard({ icon: Icon, title, description, features, color, index }: FeatureCardProps) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }}>
            <Card className="group relative overflow-hidden border border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl">
                {/* Animated Background */}
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-all duration-500`}
                    whileHover={{ opacity: 0.1 }}
                />

                <CardHeader className="relative">
                    <div className="flex items-center space-x-3">
                        <motion.div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg transition-all duration-300 sm:h-12 sm:w-12`}
                            whileHover={{ scale: 1.1 }}
                        >
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </motion.div>
                        <CardTitle className="text-lg transition-colors duration-300 group-hover:text-primary sm:text-xl">{title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-relaxed sm:text-base">{description}</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                    <ul className="space-y-3">
                        {features.map((item, idx) => (
                            <motion.li
                                key={idx}
                                className="group/item flex items-center space-x-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + idx * 0.05 }}
                            >
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <CheckCircle className="h-4 w-4 text-green-500 transition-transform duration-200" />
                                </motion.div>
                                <span className="text-xs text-muted-foreground transition-colors duration-200 group-hover/item:text-foreground sm:text-sm">
                                    {item}
                                </span>
                            </motion.li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </motion.div>
    );
}
