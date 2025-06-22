import { cn } from '@/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { motion } from 'framer-motion';
import { CheckCircle, ExternalLink, Mail, Sparkles } from 'lucide-react';

interface HeroSectionProps {
    isSubmitted: boolean;
    data: { email: string };
    setData: (key: string, value: string) => void;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function HeroSection({ isSubmitted, data, setData, processing, onSubmit }: HeroSectionProps) {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    return (
        <section className="relative overflow-hidden py-32">
            {/* Background Pattern - inspired by Hero12 */}
            <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
                <motion.img
                    alt="background"
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
                    className="opacity-90 [mask-image:radial-gradient(75%_75%_at_center,white,transparent)]"
                    animate={{
                        scale: [1, 1.02, 1],
                        opacity: [0.9, 0.95, 0.9],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <div className="relative z-10 container m-auto">
                <motion.div className="mx-auto flex max-w-5xl flex-col items-center" variants={staggerContainer} initial="hidden" animate="visible">
                    <div className="flex flex-col items-center gap-6 text-center">
                        {/* Logo Section - inspired by Hero12 */}
                        <motion.div
                            className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm"
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <motion.div
                                className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-2xl font-bold text-white shadow-xl"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                F
                            </motion.div>
                        </motion.div>

                        {/* Hero Content */}
                        <motion.div variants={fadeInUp}>
                            <motion.div className="mb-4">
                                <Badge variant="secondary" className="shadow-sm">
                                    <Sparkles className="mr-2 h-3 w-3" />
                                    Laravel 12 + React 19 + TypeScript
                                </Badge>
                            </motion.div>

                            <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                                Build your next{' '}
                                <motion.span
                                    className="text-primary"
                                    animate={{
                                        textShadow: [
                                            '0 0 0px rgba(59, 130, 246, 0)',
                                            '0 0 20px rgba(59, 130, 246, 0.5)',
                                            '0 0 0px rgba(59, 130, 246, 0)',
                                        ],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    SaaS project
                                </motion.span>
                                <br />
                                with <span className="text-primary">Filentra</span>
                            </h1>

                            <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                                Skip months of setup and focus on building your SaaS. Filentra provides everything you need: multi-tenancy, RBAC,
                                modern UI, comprehensive testing, and developer tools designed for junior developers.
                            </p>
                        </motion.div>

                        {/* CTA Buttons - inspired by Hero12 */}
                        <motion.div className="mt-6 flex justify-center gap-3" variants={fadeInUp}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    className="shadow-sm transition-shadow hover:shadow"
                                    onClick={() => {
                                        const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
                                        if (emailInput) {
                                            emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            emailInput.focus();
                                        }
                                    }}
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Join Waitlist
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" className="group">
                                    Learn more
                                    <motion.div className="ml-2" whileHover={{ x: 2 }}>
                                        <ExternalLink className="h-4 w-4 transition-transform" />
                                    </motion.div>
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Waitlist Form */}
                        <motion.div className="mt-12 w-full max-w-2xl" variants={fadeInUp}>
                            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                                <Card className="border border-border bg-card/50 shadow-lg backdrop-blur-sm">
                                    <CardContent className="p-8">
                                        <form onSubmit={onSubmit} className="space-y-6">
                                            <div className="text-center">
                                                <h3 className="mb-2 text-2xl font-bold text-foreground">Join the Waiting List</h3>
                                                <p className="text-muted-foreground">
                                                    Be the first to know when Filentra launches. Get early access and special pricing.
                                                </p>
                                            </div>
                                            {!isSubmitted ? (
                                                <div className="flex flex-col gap-3 sm:flex-row">
                                                    <Input
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        className="h-12 flex-1 transition-all duration-300"
                                                        required
                                                    />
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button
                                                            type="submit"
                                                            disabled={processing}
                                                            size="lg"
                                                            className="shadow-lg transition-shadow hover:shadow-xl"
                                                        >
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Join Waitlist
                                                        </Button>
                                                    </motion.div>
                                                </div>
                                            ) : (
                                                <motion.div
                                                    className="flex items-center justify-center space-x-3 text-green-600 dark:text-green-400"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', stiffness: 500 }}
                                                >
                                                    <CheckCircle className="h-6 w-6" />
                                                    <span className="text-lg font-semibold">Thanks! You're on the list!</span>
                                                </motion.div>
                                            )}
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>

                        {/* Tech Stack - inspired by Hero12 */}
                        <motion.div className="mt-20 flex flex-col items-center gap-5" variants={fadeInUp}>
                            <p className="font-medium text-muted-foreground lg:text-left">Built with cutting-edge technologies</p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                {[
                                    {
                                        name: 'Laravel',
                                        logo: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/laravel-icon.svg',
                                        fallback: 'L',
                                    },
                                    {
                                        name: 'React',
                                        logo: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/react-icon.svg',
                                        fallback: 'R',
                                    },
                                    {
                                        name: 'TypeScript',
                                        logo: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/typescript-icon.svg',
                                        fallback: 'T',
                                    },
                                    {
                                        name: 'Tailwind',
                                        logo: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/tailwind-icon.svg',
                                        fallback: 'T',
                                    },
                                    {
                                        name: 'Inertia',
                                        logo: null,
                                        fallback: 'I',
                                    },
                                ].map((tech, index) => (
                                    <motion.div
                                        key={tech.name}
                                        className={cn(
                                            'group flex aspect-square h-12 items-center justify-center rounded-lg border border-border bg-card/50 p-0 backdrop-blur-sm transition-all duration-300 hover:shadow-lg',
                                        )}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {tech.logo ? (
                                            <img
                                                src={tech.logo}
                                                alt={`${tech.name} logo`}
                                                className="h-6 saturate-0 transition-all group-hover:saturate-100"
                                                onError={(e) => {
                                                    // Fallback to text if image fails to load
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = `<span class="text-xs font-bold transition-all duration-300 group-hover:scale-110">${tech.fallback}</span>`;
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <span className="text-xs font-bold transition-all duration-300 group-hover:scale-110">
                                                {tech.fallback}
                                            </span>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
