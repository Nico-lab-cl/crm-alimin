'use client';

import { useState, useEffect, useCallback } from 'react';
import { Map, Wallet, Users, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ONBOARDING_KEY = 'admin_onboarding_done';

interface OnboardingStep {
    title: string;
    description: string;
    icon: React.ElementType;
    position: 'bottom' | 'center';
}

const steps: OnboardingStep[] = [
    {
        title: '¡Bienvenido al panel móvil!',
        description: 'Hemos rediseñado la experiencia para que gestiones todo desde tu celular de forma rápida y cómoda.',
        icon: Map,
        position: 'center',
    },
    {
        title: 'Terrenos',
        description: 'Aquí ves todos los terrenos. Toca cualquiera para bloquearlo, desbloquearlo o asignarle un dueño al instante.',
        icon: Map,
        position: 'bottom',
    },
    {
        title: 'Pagos',
        description: 'Controla el estado de los pagos de pie y cuotas. Incluye un simulador de mora fácil de entender.',
        icon: Wallet,
        position: 'bottom',
    },
    {
        title: 'Usuarios',
        description: 'Administra a tus clientes: crea usuarios, cambia contraseñas y revisa el estado de sus contratos.',
        icon: Users,
        position: 'bottom',
    },
];

export function OnboardingTour() {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Only activate on mobile and if not previously completed
        if (typeof window === 'undefined') return;
        if (window.innerWidth >= 768) return;
        if (localStorage.getItem(ONBOARDING_KEY) === 'true') return;

        // Small delay so the UI is fully rendered
        const timer = setTimeout(() => setIsActive(true), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = useCallback(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleDismiss();
        }
    }, [currentStep]);

    const handleDismiss = useCallback(() => {
        setIsActive(false);
        localStorage.setItem(ONBOARDING_KEY, 'true');
    }, []);

    if (!isActive) return null;

    const step = steps[currentStep];
    const Icon = step.icon;
    const isLast = currentStep === steps.length - 1;

    return (
        <div className="fixed inset-0 z-[200] md:hidden">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleDismiss}
            />

            {/* Content Card */}
            <div className={cn(
                'absolute left-4 right-4 z-10 transition-all duration-500 ease-out',
                step.position === 'center'
                    ? 'top-1/2 -translate-y-1/2'
                    : 'bottom-24'
            )}>
                <div className="bg-gray-900/98 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl animate-scale-in">
                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-alimin-gold/15 flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-alimin-gold" />
                    </div>

                    {/* Text */}
                    <h3 className="text-lg font-bold text-white mb-1.5">
                        {step.title}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed mb-5">
                        {step.description}
                    </p>

                    {/* Progress + Actions */}
                    <div className="flex items-center justify-between">
                        {/* Progress dots */}
                        <div className="flex gap-1.5">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        'h-1.5 rounded-full transition-all duration-300',
                                        i === currentStep
                                            ? 'w-6 bg-alimin-gold'
                                            : i < currentStep
                                                ? 'w-1.5 bg-alimin-gold/40'
                                                : 'w-1.5 bg-white/10'
                                    )}
                                />
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                            {currentStep === 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDismiss}
                                    className="text-gray-400 hover:text-white text-xs h-9"
                                >
                                    Omitir
                                </Button>
                            )}
                            <Button
                                size="sm"
                                onClick={handleNext}
                                className="bg-alimin-gold hover:bg-[#d4aa52] text-alimin-green font-bold h-9 px-4 text-xs active:scale-95 transition-transform"
                            >
                                {isLast ? '¡Empezar!' : 'Siguiente'}
                                {!isLast && <ChevronRight className="w-3.5 h-3.5 ml-1" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
