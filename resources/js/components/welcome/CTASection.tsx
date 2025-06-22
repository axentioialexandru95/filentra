import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

interface CTASectionProps {
    onJoinWaitlist: () => void;
}

export function CTASection({ onJoinWaitlist }: CTASectionProps) {
    return (
        <section className="container mx-auto px-6 py-32">
            <motion.div className="relative" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
                <motion.div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-xl"
                    animate={{ opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
                    <CardContent className="relative p-16 text-center">
                        <motion.h2
                            className="mb-6 text-4xl font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Ready to Build Your Next SaaS?
                        </motion.h2>
                        <motion.p
                            className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-blue-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Join our waiting list and be among the first to get access to Filentra. Start building production-ready SaaS applications
                            today.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                size="lg"
                                className="hover:shadow-3xl bg-white px-8 py-4 text-lg text-blue-600 shadow-2xl transition-all duration-300 hover:bg-blue-50"
                                onClick={onJoinWaitlist}
                            >
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="mr-3">
                                    <Star className="h-6 w-6" />
                                </motion.div>
                                Join Waiting List Now
                                <ArrowRight className="ml-3 h-6 w-6" />
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </section>
    );
}
