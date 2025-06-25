import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, BarChart3, CheckCircle, Package, RotateCcw, Shield, Truck, Users } from 'lucide-react';

const processFlow = [
    {
        step: '1',
        title: 'Return Initiation',
        description: 'Customer initiates return through any channel',
        icon: Users,
        color: 'from-blue-500 to-blue-600',
        details: ['Self-service portal', 'Agent-assisted returns', 'Bulk returns processing'],
    },
    {
        step: '2',
        title: 'Authorization & Tracking',
        description: 'Automated approval and return label generation',
        icon: CheckCircle,
        color: 'from-green-500 to-green-600',
        details: ['Instant authorization', 'Prepaid shipping labels', 'Real-time tracking'],
    },
    {
        step: '3',
        title: 'Quality Assessment',
        description: 'Intelligent evaluation and routing decisions',
        icon: Package,
        color: 'from-purple-500 to-purple-600',
        details: ['Automated inspection', 'Quality grading', 'Disposition routing'],
    },
    {
        step: '4',
        title: 'Recovery & Resale',
        description: 'Maximize value through optimized recovery paths',
        icon: RotateCcw,
        color: 'from-orange-500 to-orange-600',
        details: ['Refurbishment workflows', 'Multi-channel resale', 'Liquidation optimization'],
    },
];

const features = [
    {
        icon: BarChart3,
        title: 'Advanced Analytics',
        description: 'Real-time insights and predictive analytics for optimized decision making.',
        metrics: ['40% cost reduction', '85% faster processing', '95% accuracy'],
        color: 'from-indigo-500 to-indigo-600',
        benefits: [
            'Return trend analysis and forecasting',
            'Cost center tracking and optimization',
            'Performance dashboards and KPIs',
            'Predictive quality assessment',
        ],
    },
    {
        icon: Truck,
        title: 'Logistics Integration',
        description: 'Seamless connectivity with carriers, warehouses, and fulfillment centers.',
        metrics: ['50+ carrier integrations', '99.9% uptime', '24/7 monitoring'],
        color: 'from-green-500 to-green-600',
        benefits: [
            'Multi-carrier API integrations',
            'Warehouse management system sync',
            'Route optimization algorithms',
            'Real-time shipment tracking',
        ],
    },
    {
        icon: Shield,
        title: 'Enterprise Security',
        description: 'Bank-grade security with comprehensive compliance management.',
        metrics: ['SOC 2 certified', 'GDPR compliant', '256-bit encryption'],
        color: 'from-red-500 to-red-600',
        benefits: ['End-to-end data encryption', 'Role-based access control', 'Comprehensive audit trails', 'Regulatory compliance automation'],
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
        <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
            {/* Section Header */}
            <motion.div
                className="mb-16 text-center sm:mb-20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Badge variant="secondary" className="mb-4 text-sm">
                    Complete Solution
                </Badge>
                <h2 className="mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl">
                    End-to-End Reverse Logistics Platform
                </h2>
                <p className="mx-auto max-w-4xl text-lg text-muted-foreground sm:text-xl">
                    Transform returns from a cost center into a competitive advantage with our integrated platform that covers every aspect of reverse
                    logistics operations.
                </p>
            </motion.div>

            {/* Process Flow */}
            <motion.div className="mb-20" variants={containerVariants} initial="hidden" animate="visible">
                <div className="mb-12 text-center">
                    <h3 className="mb-4 text-2xl font-bold sm:text-3xl">Returns Process Flow</h3>
                    <p className="text-muted-foreground">See how Reflux streamlines your entire returns journey</p>
                </div>

                <div className="relative">
                    {/* Desktop Flow */}
                    <div className="hidden lg:block">
                        <div className="flex items-center justify-between">
                            {processFlow.map((step, index) => (
                                <motion.div key={index} className="flex flex-col items-center" variants={itemVariants}>
                                    {/* Step Card */}
                                    <Card className="group relative mb-4 w-64 transition-all duration-300 hover:shadow-lg">
                                        <CardContent className="p-6">
                                            <div
                                                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${step.color} text-white shadow-lg`}
                                            >
                                                <step.icon className="h-6 w-6" />
                                            </div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    Step {step.step}
                                                </Badge>
                                            </div>
                                            <h4 className="mb-2 text-lg font-semibold">{step.title}</h4>
                                            <p className="mb-4 text-sm text-muted-foreground">{step.description}</p>
                                            <ul className="space-y-1">
                                                {step.details.map((detail, detailIndex) => (
                                                    <li key={detailIndex} className="flex items-center text-xs text-muted-foreground">
                                                        <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>

                                    {/* Arrow */}
                                    {index < processFlow.length - 1 && (
                                        <motion.div
                                            className="absolute top-32 left-1/2 z-10 translate-x-8"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <ArrowRight className="h-8 w-8 text-primary" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Flow */}
                    <div className="lg:hidden">
                        <div className="space-y-6">
                            {processFlow.map((step, index) => (
                                <motion.div key={index} variants={itemVariants}>
                                    <Card className="transition-all duration-300 hover:shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r ${step.color} text-white shadow-lg`}
                                                >
                                                    <step.icon className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            Step {step.step}
                                                        </Badge>
                                                    </div>
                                                    <h4 className="mb-2 text-lg font-semibold">{step.title}</h4>
                                                    <p className="mb-4 text-sm text-muted-foreground">{step.description}</p>
                                                    <ul className="space-y-1">
                                                        {step.details.map((detail, detailIndex) => (
                                                            <li key={detailIndex} className="flex items-center text-sm text-muted-foreground">
                                                                <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                                                                {detail}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    {index < processFlow.length - 1 && (
                                        <div className="flex justify-center">
                                            <ArrowDown className="h-6 w-6 text-primary" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Core Features */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <div className="mb-12 text-center">
                    <h3 className="mb-4 text-2xl font-bold sm:text-3xl">Platform Capabilities</h3>
                    <p className="text-muted-foreground">Enterprise-grade features that deliver measurable results</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="group h-full transition-all duration-300 hover:shadow-lg">
                                <CardContent className="p-8">
                                    <div
                                        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${feature.color} text-white shadow-xl`}
                                    >
                                        <feature.icon className="h-8 w-8" />
                                    </div>

                                    <h4 className="mb-3 text-xl font-bold">{feature.title}</h4>
                                    <p className="mb-6 text-muted-foreground">{feature.description}</p>

                                    {/* Metrics */}
                                    <div className="mb-6 grid grid-cols-1 gap-3">
                                        {feature.metrics.map((metric, metricIndex) => (
                                            <Badge key={metricIndex} variant="secondary" className="justify-center py-2">
                                                {metric}
                                            </Badge>
                                        ))}
                                    </div>

                                    {/* Benefits */}
                                    <ul className="space-y-3">
                                        {feature.benefits.map((benefit, benefitIndex) => (
                                            <li key={benefitIndex} className="flex items-start text-sm">
                                                <CheckCircle className="mt-0.5 mr-3 h-4 w-4 shrink-0 text-green-500" />
                                                <span className="text-muted-foreground">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* ROI Section */}
            <motion.div
                className="mt-20 rounded-3xl bg-gradient-to-r from-green-50 to-blue-50 p-8 sm:p-12 dark:from-green-950/20 dark:to-blue-950/20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <div className="text-center">
                    <h3 className="mb-4 text-2xl font-bold sm:text-3xl">Proven ROI Within 90 Days</h3>
                    <p className="mb-8 text-muted-foreground">Our clients see immediate impact across key performance indicators</p>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { metric: '40%', label: 'Cost Reduction', description: 'Lower operational costs' },
                            { metric: '85%', label: 'Faster Processing', description: 'Reduced cycle times' },
                            { metric: '95%', label: 'Accuracy Rate', description: 'Improved quality control' },
                            { metric: '60%', label: 'Recovery Value', description: 'Higher product recovery' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="rounded-xl bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:bg-gray-900/80"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <div className="mb-2 text-3xl font-bold text-primary">{stat.metric}</div>
                                <div className="mb-1 font-semibold">{stat.label}</div>
                                <div className="text-sm text-muted-foreground">{stat.description}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
