import { FeaturesSection } from '@/components/welcome/FeaturesSection';
import { Footer } from '@/components/welcome/Footer';
import { Header } from '@/components/welcome/Header';
import { HeroSection } from '@/components/welcome/HeroSection';
import { type SharedData } from '@/core/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isDark, setIsDark] = useState(false);

    // Theme management
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

        setIsDark(shouldBeDark);
        document.documentElement.classList.toggle('dark', shouldBeDark);
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        document.documentElement.classList.toggle('dark', newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    return (
        <>
            <Head title="Reflux - Advanced Reverse Logistics Management Platform">
                <meta
                    name="description"
                    content="Reflux is a comprehensive reverse logistics management platform that streamlines returns, refurbishments, and inventory recovery. Optimize your product lifecycle with intelligent tracking and analytics."
                />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-background">
                <Header isDark={isDark} toggleTheme={toggleTheme} auth={auth} />

                <HeroSection />

                <FeaturesSection />

                <Footer />
            </div>
        </>
    );
}
