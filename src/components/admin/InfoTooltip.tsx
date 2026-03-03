'use client';

import { HelpCircle } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';

interface InfoTooltipProps {
    content: React.ReactNode;
    className?: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
}

export function InfoTooltip({ content, className, side = 'top' }: InfoTooltipProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        'inline-flex items-center justify-center w-5 h-5 rounded-full',
                        'text-gray-400/60 hover:text-gray-300 hover:bg-white/10',
                        'transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-alimin-gold/50',
                        'min-w-[44px] min-h-[44px] -m-2.5 p-2.5', // 44px touch target with visual 20px size
                        className
                    )}
                    aria-label="Más información"
                >
                    <HelpCircle className="w-4 h-4" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                side={side}
                className="w-72 bg-gray-900 border-white/10 text-gray-200 text-sm p-3 shadow-xl"
            >
                {content}
            </PopoverContent>
        </Popover>
    );
}
