import {
    MapPin,
    CreditCard,
    Mail,
    UserCheck,
    LayoutDashboard,
    FileSignature,
    Play
} from 'lucide-react';

export const HowToBuy = () => {
    const steps = [
        {
            icon: <MapPin className="stroke-current" />,
            title: "1. Elige tu Lote",
            description: "Selecciona el lote que deseas adquirir en el mapa interactivo y completa el formulario con tus datos personales."
        },
        {
            icon: <CreditCard className="stroke-current" />,
            title: "2. Pago Seguro",
            description: "Serás redirigido a la plataforma segura de Transbank para realizar el pago de la reserva."
        },
        {
            icon: <Mail className="stroke-current" />,
            title: "3. Recibe Confirmación",
            description: "Si el pago es exitoso, recibirás un correo electrónico automático con el resumen detallado de tu compra."
        },
        {
            icon: <UserCheck className="stroke-current" />,
            title: "4. Valida tu Cuenta",
            description: "Si eres usuario nuevo, busca el correo 'Confirma tu correo electrónico - Alimin' y sigue las instrucciones. (Omite si ya estás registrado)."
        },
        {
            icon: <LayoutDashboard className="stroke-current" />,
            title: "5. Accede a tu Portal",
            description: "Ingresa a tu perfil en la plataforma y navega a la sección 'Mis Terrenos' para ver tu inversión."
        },
        {
            icon: <FileSignature className="stroke-current" />,
            title: "6. Firma Digital",
            description: "Lee tu contrato y fírmalo digitalmente ingresando el código de 4 dígitos que se enviará a tu correo."
        }
    ];

    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        ¿Cómo comprar tu terreno?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Sigue estos simples pasos para convertirte en propietario en Lomas del Mar.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-7xl mx-auto">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="bg-[#36595F] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-[#36595F]/50 flex flex-col items-center text-center group relative overflow-hidden"
                        >
                            {/* Gold accent line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#E0B457]" />

                            {/* Icon Container - Darker shade of green for contrast */}
                            <div className="w-20 h-20 rounded-2xl bg-[#2a464b] flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
                                <div className="text-[#E0B457]">
                                    {/* Clone element to force color if needed, or just wrap */}
                                    {/* Ensure icons inherit color or are explicitly set */}
                                    <div className="[&>svg]:w-10 [&>svg]:h-10 [&>svg]:text-[#E0B457]">
                                        {step.icon}
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 tracking-wide">
                                {step.title}
                            </h3>

                            <p className="text-gray-200 leading-relaxed font-medium">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Video Container */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#36595F] rounded-3xl p-1 shadow-2xl overflow-hidden ring-4 ring-[#E0B457]/20">
                        <div className="bg-black/20 rounded-[1.4rem] overflow-hidden aspect-video relative group">
                            <video
                                className="w-full h-full object-cover"
                                controls
                                poster="/video-poster.jpg" // Optional: Add a poster image if available, or remove
                            >
                                <source src="/alimin-tutorial.mp4" type="video/mp4" />
                                Tu navegador no soporta el elemento de video.
                            </video>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
