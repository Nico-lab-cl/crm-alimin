"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
}

export function Pagination({ currentPage, totalPages, totalItems, pageSize }: PaginationProps) {
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", pageNumber.toString());
        return `?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-[11px] font-medium text-gray-500">
                Mostrando <span className="font-bold text-gray-900">{startItem}</span> a <span className="font-bold text-gray-900">{endItem}</span> de <span className="font-bold text-gray-900">{totalItems}</span> contactos
            </div>

            <nav className="flex items-center gap-1">
                <Link
                    href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
                    className={`p-2 rounded-lg border border-gray-200 transition-all ${
                        currentPage > 1 
                        ? "bg-white text-gray-600 hover:bg-gray-50 active:scale-95" 
                        : "bg-gray-50 text-gray-300 cursor-not-allowed"
                    }`}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Link>

                <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Lógica simple para mostrar páginas cercanas a la actual
                        let pageNum = currentPage;
                        if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;

                        if (pageNum <= 0 || pageNum > totalPages) return null;

                        const isActive = pageNum === currentPage;
                        
                        return (
                            <Link
                                key={pageNum}
                                href={createPageURL(pageNum)}
                                className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                                    isActive
                                    ? "bg-[var(--alimin-gold)] text-black shadow-sm"
                                    : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 active:scale-95"
                                }`}
                            >
                                {pageNum}
                            </Link>
                        );
                    })}
                </div>

                <Link
                    href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
                    className={`p-2 rounded-lg border border-gray-200 transition-all ${
                        currentPage < totalPages 
                        ? "bg-white text-gray-600 hover:bg-gray-50 active:scale-95" 
                        : "bg-gray-50 text-gray-300 cursor-not-allowed"
                    }`}
                >
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </nav>
        </div>
    );
}
