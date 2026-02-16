import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackToSiteButton() {
    return (
        <div className="fixed top-24 left-4 z-50">
            <Link href="/">
                {/* Mobile: Icon Only */}
                <Button
                    variant="secondary"
                    size="icon"
                    className="md:hidden shadow-lg border border-border bg-background/80 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center p-0"
                    title="Volver al Sitio"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>

                {/* Desktop: Full Button */}
                <Button
                    variant="secondary"
                    className="hidden md:flex shadow-lg hover:shadow-xl transition-all border border-border bg-background/80 backdrop-blur gap-2"
                >
                    <Home className="w-4 h-4" />
                    Volver al Sitio
                </Button>
            </Link>
        </div>
    );
}
