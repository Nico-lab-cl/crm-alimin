'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Cookie, X } from 'lucide-react'
import Link from 'next/link'

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if the user has already consented or declined
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
            // Slight delay to not overwhelm on immediate load
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted')
        setIsVisible(false)
        window.dispatchEvent(new Event('cookie-consent-resolved'))
        // Here you would typically trigger event pushing to dataLayer 
        // Example: window.dispatchEvent(new Event('cookies-accepted'))
    }

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined')
        setIsVisible(false)
        window.dispatchEvent(new Event('cookie-consent-resolved'))
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 pb-20 animate-in slide-in-from-bottom-5 duration-500">
            <div className="max-w-6xl mx-auto">
                <div className="bg-[#36595F] border border-[#E0B457]/30 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8 backdrop-blur-md">

                    {/* Content Section */}
                    <div className="flex items-start gap-4 flex-1">
                        <div className="hidden sm:flex shrink-0 w-10 h-10 bg-[#E0B457]/20 rounded-full items-center justify-center">
                            <Cookie className="w-5 h-5 text-[#E0B457]" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-white font-semibold text-sm md:text-base flex items-center gap-2">
                                <Cookie className="w-4 h-4 text-[#E0B457] sm:hidden" />
                                Valoramos tu privacidad
                            </h3>
                            <p className="text-white/90 text-xs md:text-sm leading-relaxed">
                                Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar nuestro tráfico y mostrarte publicidad relacionada con tus preferencias.
                                Al hacer clic en "Aceptar", consientes el uso de todas las cookies.
                            </p>
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className="flex flex-row md:flex-col lg:flex-row items-center gap-2 w-full md:w-auto shrink-0 relative">
                        <Button
                            variant="outline"
                            onClick={handleDecline}
                            className="w-full lg:w-auto text-xs md:text-sm h-9 md:h-10 bg-transparent border-[#E0B457] text-[#E0B457] hover:bg-[#E0B457]/10 hover:text-[#E0B457]"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleAccept}
                            className="w-full lg:w-auto text-xs md:text-sm h-9 md:h-10 bg-[#E0B457] hover:bg-[#C9A04B] text-white font-bold"
                        >
                            Aceptar todas
                        </Button>
                        <button
                            onClick={handleDecline}
                            className="absolute -top-10 right-0 md:relative md:top-auto md:right-auto text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                            aria-label="Cerrar banner"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
