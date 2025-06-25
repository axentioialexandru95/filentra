import { cn } from '@/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { ExternalLink, Mail, Sparkles } from 'lucide-react';

export function HeroSection() {
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
        <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
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

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div className="mx-auto flex max-w-5xl flex-col items-center" variants={staggerContainer} initial="hidden" animate="visible">
                    <div className="flex flex-col items-center gap-4 text-center sm:gap-6">
                        {/* Logo Section - inspired by Hero12 */}
                        <motion.div
                            className="rounded-xl bg-background/30 p-3 shadow-sm backdrop-blur-sm sm:p-4"
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <motion.div
                                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-blue-600 text-xl font-bold text-white shadow-xl sm:h-16 sm:w-16 sm:text-2xl"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                R
                            </motion.div>
                        </motion.div>

                        {/* Hero Content */}
                        <motion.div variants={fadeInUp}>
                            <motion.div className="mb-4">
                                <Badge variant="secondary" className="shadow-sm">
                                    <Sparkles className="mr-2 h-3 w-3" />
                                    Advanced Reverse Logistics Platform
                                </Badge>
                            </motion.div>

                            <h1 className="mb-4 text-3xl font-bold tracking-tight text-pretty sm:mb-6 sm:text-4xl lg:text-5xl xl:text-6xl">
                                Transform your{' '}
                                <motion.span
                                    className="text-primary"
                                    animate={{
                                        textShadow: [
                                            '0 0 0px rgba(34, 197, 94, 0)',
                                            '0 0 20px rgba(34, 197, 94, 0.5)',
                                            '0 0 0px rgba(34, 197, 94, 0)',
                                        ],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    returns process
                                </motion.span>
                                <br />
                                with <span className="text-primary">Reflux</span>
                            </h1>

                            <p className="mx-auto max-w-3xl text-base text-muted-foreground sm:text-lg lg:text-xl">
                                Streamline your reverse logistics operations with intelligent tracking, automated processing, and real-time analytics.
                                Turn returns from a cost center into a competitive advantage.
                            </p>
                        </motion.div>

                        {/* CTA Buttons - inspired by Hero12 */}
                        <motion.div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4" variants={fadeInUp}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    className="h-12 px-6 shadow-sm transition-shadow hover:shadow sm:h-auto sm:px-4"
                                    onClick={() => {
                                        // Scroll to features section
                                        const featuresSection = document.querySelector('section:nth-of-type(2)');
                                        if (featuresSection) {
                                            featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }}
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    View Solution
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="outline"
                                    className="group h-12 px-6 sm:h-auto sm:px-4"
                                    onClick={() => {
                                        // Scroll to ROI section
                                        const roiSection = document.querySelector('[class*="from-green-50"]');
                                        if (roiSection) {
                                            roiSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }
                                    }}
                                >
                                    View ROI
                                    <motion.div className="ml-2" whileHover={{ x: 2 }}>
                                        <ExternalLink className="h-4 w-4 transition-transform" />
                                    </motion.div>
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Key Benefits */}
                        <motion.div className="mt-8 w-full max-w-4xl sm:mt-12" variants={fadeInUp}>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        title: 'Reduce Costs',
                                        description: 'Cut reverse logistics costs by up to 40% through automation and optimization',
                                        icon: '💰',
                                    },
                                    {
                                        title: 'Increase Recovery',
                                        description: 'Maximize product value recovery with intelligent routing and refurbishment',
                                        icon: '♻️',
                                    },
                                    {
                                        title: 'Improve Experience',
                                        description: 'Deliver seamless return experiences that build customer loyalty',
                                        icon: '⭐',
                                    },
                                ].map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        className="group rounded-xl border bg-card/50 p-6 backdrop-blur-sm transition-all hover:bg-card/80 hover:shadow-lg"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <div className="mb-3 text-3xl">{benefit.icon}</div>
                                        <h3 className="mb-2 text-lg font-semibold">{benefit.title}</h3>
                                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Tech Stack - inspired by Hero12 */}
                        <motion.div className="mt-12 flex flex-col items-center gap-4 sm:mt-16 lg:mt-20 lg:gap-5" variants={fadeInUp}>
                            <p className="text-sm font-medium text-muted-foreground sm:text-base lg:text-left">
                                Trusted by leading retailers worldwide
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                                {[
                                    {
                                        name: 'Returns Management',
                                        logo: null,
                                        fallback: 'RM',
                                    },
                                    {
                                        name: 'Inventory Tracking',
                                        logo: null,
                                        fallback: 'IT',
                                    },
                                    {
                                        name: 'Quality Control',
                                        logo: null,
                                        fallback: 'QC',
                                    },
                                    {
                                        name: 'Analytics',
                                        logo: null,
                                        fallback: 'AN',
                                    },
                                    {
                                        name: 'Automation',
                                        logo: null,
                                        fallback: 'AU',
                                    },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={feature.name}
                                        className={cn(
                                            'group flex aspect-square h-10 items-center justify-center rounded-lg border border-border bg-card/50 p-0 backdrop-blur-sm transition-all duration-300 hover:shadow-lg sm:h-12',
                                        )}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {feature.logo ? (
                                            <img
                                                src={feature.logo}
                                                alt={`${feature.name} logo`}
                                                className="h-5 saturate-0 transition-all group-hover:saturate-100 sm:h-6"
                                                onError={(e) => {
                                                    // Fallback to text if image fails to load
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = `<span class="text-xs font-bold transition-all duration-300 group-hover:scale-110">${feature.fallback}</span>`;
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <span className="text-xs font-bold transition-all duration-300 group-hover:scale-110 sm:text-sm">
                                                {feature.fallback}
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
