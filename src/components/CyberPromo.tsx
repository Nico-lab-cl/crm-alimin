'use client';

import { CreditCard, Scale, Laptop } from 'lucide-react';

export const CyberPromo = () => {
    const promoItems = [
        {
            icon: CreditCard,
            title: "Pie en 3 Cuotas sin Interés",
            description: "Divide el valor de tu pie en 3 cuotas fijas sin interés. Sin bancos, directo con la inmobiliaria."
        },
        {
            icon: Scale,
            title: "Asesoría Legal Gratuita",
            description: "Nosotros nos encargamos de todo de manera gratuita. Asesoría legal completa, estudio de títulos y redacción de promesa."
        },
        {
            icon: Laptop,
            title: "Proceso Rápido y Seguro",
            description: "Selecciona tu lote, reserva en 5 minutos con Webpay y firma digitalmente desde la comodidad de tu casa."
        }
    ];

    return (
        <section className="py-20 bg-white/40 backdrop-blur-sm border-y border-slate-100">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                        ¿En qué consiste la <span className="text-alimin-gold font-black">Promo Cyber</span>?
                    </h2>
                    <p className="text-lg text-slate-600 font-medium">
                        Asegura tu terreno hoy mismo con facilidades de pago exclusivas y asesoría legal sin costos adicionales.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {promoItems.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100/85 flex flex-col items-center text-center group relative overflow-hidden"
                        >
                            {/* Gold Top line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-alimin-gold" />

                            {/* Icon Container */}
                            <div className="w-20 h-20 rounded-full bg-alimin-green/10 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-alimin-green transition-all duration-300 ring-1 ring-alimin-green/5">
                                <item.icon className="w-10 h-10 text-alimin-green group-hover:text-white transition-colors duration-300" />
                            </div>

                            {/* Text */}
                            <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-wide">
                                {item.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
