import { FeaturesSection } from '@/components/welcome/FeaturesSection';
import { Footer } from '@/components/welcome/Footer';
import { Header } from '@/components/welcome/Header';
import { HeroSection } from '@/components/welcome/HeroSection';
import { type SharedData } from '@/core/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const { data, setData, processing } = useForm({
        email: '',
        interests: 'general',
    });

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

    const handleWaitlistSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Submit to backend
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('interests', data.interests);

        fetch('/waitlist', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                Accept: 'application/json',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then(() => {
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsSubmitted(false);
                    setData('email', '');
                }, 5000);
            })
            .catch((error) => {
                console.error('Error:', error);
                // Still show success for UX, but log error
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsSubmitted(false);
                    setData('email', '');
                }, 5000);
            });
    };

    return (
        <>
            <Head title="Filentra - The Laravel + React Boilerplate for Modern SaaS">
                <meta
                    name="description"
                    content="Filentra is a comprehensive Laravel + React boilerplate with multi-tenancy, RBAC, and modern developer tools. Built for junior developers and production-ready."
                />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-background">
                <Header isDark={isDark} toggleTheme={toggleTheme} auth={auth} />

                <HeroSection isSubmitted={isSubmitted} data={data} setData={setData} processing={processing} onSubmit={handleWaitlistSubmit} />

                <FeaturesSection />

                <Footer />
            </div>
        </>
    );
}
