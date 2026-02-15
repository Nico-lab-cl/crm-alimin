import {
    Droplets,
    Zap,
    ShieldCheck,
    Car,
    Footprints,
    Sun,
    Trees,
    FileCheck
} from 'lucide-react';

const features = [
    {
        icon: Droplets,
        title: "Agua Certificada",
        description: "Resolución sanitaria Seremi de Salud",
        highlight: false
    },
    {
        icon: Zap,
        title: "Luz Eléctrica",
        description: "Red aérea instalada y operativa",
        highlight: false
    },

    {
        icon: ShieldCheck,
        title: "Acceso Controlado",
        description: "Portón automático de seguridad",
        highlight: false
    },
    {
        icon: Car,
        title: "Calles Compactadas",
        description: "Caminos estables con maicillo",
        highlight: false
    },
    {
        icon: Footprints,
        title: "Veredas y Soleras",
        description: "Urbanización ordenada y completa",
        highlight: false
    },
    {
        icon: Sun,
        title: "Luminarias Solares",
        description: "Iluminación sustentable en calles",
        highlight: false
    },
    {
        icon: Trees,
        title: "Áreas Verdes",
        description: "Espacios naturales comunitarios",
        highlight: false
    }
];

export const ProjectFeatures = () => {
    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                {/* Encabezado de la sección */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        Todo lo que incluye tu terreno
                    </h2>
                    <p className="text-lg text-slate-600">
                        No vendemos promesas, vendemos realidad. Tu terreno cuenta con urbanización de alto estándar lista para disfrutar.
                    </p>
                </div>

                {/* Grid de Características */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`
                group relative p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 bg-alimin-green shadow-sm hover:shadow-lg border border-alimin-green/50
              `}
                        >
                            {/* Icono con fondo */}
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors bg-white/10 text-alimin-gold group-hover:bg-white/20">
                                <feature.icon className="w-6 h-6" />
                            </div>

                            {/* Textos */}
                            <h3 className="text-xl font-bold text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-white/80 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
