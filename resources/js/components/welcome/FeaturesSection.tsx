import { motion } from 'framer-motion';
import { Code, Layers, Shield, TestTube, Wand2 } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const features = [
    {
        icon: Layers,
        title: 'Single Panel Architecture',
        description: 'One unified dashboard that adapts to user roles. Simpler to build, easier to maintain.',
        features: ['Role-based content adaptation', 'Unified navigation system', 'Progressive feature disclosure'],
        color: 'from-blue-500 to-blue-600',
    },

    {
        icon: Shield,
        title: 'RBAC & Permissions',
        description: 'Spatie Laravel Permission integration with feature flags and role-based access control.',
        features: ['Role & permission management', 'Laravel Pennant feature flags', 'Fine-grained permissions'],
        color: 'from-green-500 to-green-600',
    },
    {
        icon: Code,
        title: 'Modern Tech Stack',
        description: 'Latest versions of Laravel, React, and TypeScript with cutting-edge features.',
        features: ['Laravel 12 + React 19', 'TypeScript + Inertia.js', 'Tailwind + Radix UI'],
        color: 'from-orange-500 to-orange-600',
    },
    {
        icon: Wand2,
        title: 'Developer Tools',
        description: 'Comprehensive tooling for code generation, testing, and quality assurance.',
        features: ['Module scaffolding', 'Database designer UI', 'API docs generator'],
        color: 'from-indigo-500 to-indigo-600',
    },
    {
        icon: TestTube,
        title: 'Comprehensive Testing',
        description: 'Full testing suite with Pest, Jest, and Dusk for backend, frontend, and E2E testing.',
        features: ['Pest PHP testing', 'Jest frontend testing', 'Laravel Dusk E2E'],
        color: 'from-red-500 to-red-600',
    },
];

export function FeaturesSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
            <motion.div
                className="mb-12 text-center sm:mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl lg:text-4xl">
                    Everything You Need to Build Modern SaaS
                </h2>
                <p className="mx-auto max-w-3xl text-base text-muted-foreground sm:text-lg lg:text-xl">
                    From authentication to role-based access control, we've got you covered with production-ready features that scale.
                </p>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {features.map((feature, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <FeatureCard
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            features={feature.features}
                            color={feature.color}
                            index={index}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
