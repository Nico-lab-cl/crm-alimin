'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Instagram, Mail, MessageCircle, Youtube, Facebook } from 'lucide-react';
import Link from 'next/link';
import { trackPixelEvent } from '@/lib/metaTracking';

export const StickyContactBar = () => {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [isConsentPending, setIsConsentPending] = useState(false);

    useEffect(() => {
        // Toggle from specific interactions
        const handleToggle = (e: CustomEvent<{ show: boolean }>) => {
            setIsVisible(e.detail.show);
        };

        // Handle Cookie Banner interactions
        const handleCookieResolved = () => {
            setIsConsentPending(false);
        };

        // Check initial cookie state on mount
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsConsentPending(true); // Hide initially if banner should show
        }

        window.addEventListener('toggle-sticky-bar', handleToggle as EventListener);
        window.addEventListener('cookie-consent-resolved', handleCookieResolved);

        return () => {
            window.removeEventListener('toggle-sticky-bar', handleToggle as EventListener);
            window.removeEventListener('cookie-consent-resolved', handleCookieResolved);
        };
    }, []);

    // Hide on admin and seller routes
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/seller')) return null;

    if (!isVisible || isConsentPending) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-20 fade-in duration-700 w-[95%] max-w-fit">
            <div className="flex items-center gap-3 md:gap-4 bg-alimin-gold/95 backdrop-blur-md rounded-full shadow-2xl border border-white/20 p-2 pl-4 md:pl-6 pr-2 overflow-x-auto md:overflow-hidden max-w-full">

                {/* Helper Text */}
                <span className="text-white font-bold text-sm whitespace-nowrap hidden lg:block">
                    {/* Texto de ayuda */}
                    ¿Tienes alguna duda?
                </span>

                {/* Social Icons Container */}
                <div className="flex items-center gap-3">
                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com/inmobiliaria.alimin/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 hover:text-white transition-colors"
                        aria-label="Instagram"
                    >
                        <Instagram className="w-5 h-5" />
                    </a>

                    {/* Facebook */}
                    <a
                        href="https://www.facebook.com/alimininmobiliaria"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 hover:text-white transition-colors"
                        aria-label="Facebook"
                    >
                        <Facebook className="w-5 h-5" />
                    </a>

                    {/* TikTok - Custom SVG since it might not be in the lucide version */}
                    <a
                        href="https://www.tiktok.com/@inmobiliaria.alimin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 hover:text-white transition-colors"
                        aria-label="TikTok"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                        </svg>
                    </a>

                    {/* YouTube */}
                    <a
                        href="https://www.youtube.com/@alimininmobiliaria"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 hover:text-white transition-colors"
                        aria-label="YouTube"
                    >
                        <Youtube className="w-5 h-5" />
                    </a>

                    {/* Email */}
                    <a
                        href="mailto:Inmobiliaria@aliminspa.cl"
                        className="text-white/80 hover:text-white transition-colors"
                        aria-label="Email"
                    >
                        <Mail className="w-5 h-5" />
                    </a>
                </div>

                {/* Separator */}
                <div className="w-px h-6 bg-white/30 flex-shrink-0" />

                {/* WhatsApp CTA */}
                <a
                    href="https://wa.me/56973077128"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                        trackPixelEvent('Contact', {
                            content_name: 'WhatsApp Contact',
                            content_category: 'Sticky Bar'
                        });
                    }}
                    className="bg-alimin-green hover:bg-[#2b464a] text-white rounded-full px-4 py-2 flex items-center gap-2 transition-all hover:scale-105 whitespace-nowrap shadow-lg"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">Estamos en línea</span>
                </a>
            </div>
        </div>
    );
};
