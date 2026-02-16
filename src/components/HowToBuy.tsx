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
            icon: <MapPin className="w-8 h-8 text-white" />,
            title: "1. Elige tu Lote",
            description: "Selecciona el lote que deseas adquirir en el mapa interactivo y completa el formulario con tus datos personales."
        },
        {
            icon: <CreditCard className="w-8 h-8 text-white" />,
            title: "2. Pago Seguro",
            description: "Serás redirigido a la plataforma segura de Transbank para realizar el pago de la reserva."
        },
        {
            icon: <Mail className="w-8 h-8 text-white" />,
            title: "3. Recibe Confirmación",
            description: "Si el pago es exitoso, recibirás un correo electrónico automático con el resumen detallado de tu compra."
        },
        {
            icon: <UserCheck className="w-8 h-8 text-white" />,
            title: "4. Valida tu Cuenta",
            description: "Si eres usuario nuevo, busca el correo 'Confirma tu correo electrónico - Alimin' y sigue las instrucciones. (Omite si ya estás registrado)."
        },
        {
            icon: <LayoutDashboard className="w-8 h-8 text-white" />,
            title: "5. Accede a tu Portal",
            description: "Ingresa a tu perfil en la plataforma y navega a la sección 'Mis Terrenos' para ver tu inversión."
        },
        {
            icon: <FileSignature className="w-8 h-8 text-white" />,
            title: "6. Firma Digital",
            description: "Lee tu contrato y fírmalo digitalmente ingresando el código de 4 dígitos que se enviará a tu correo."
        }
    ];

    return (
        <section className="py-20 bg-gray-50 border-t border-gray-200">
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
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center text-center group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-[#36595F]" />

                            <div className="w-16 h-16 rounded-2xl bg-[#36595F] flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                                {step.icon}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {step.title}
                            </h3>

                            <p className="text-gray-600 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Video Placeholder */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#36595F] rounded-3xl p-1 shadow-2xl overflow-hidden">
                        <div className="bg-black/20 rounded-[1.4rem] overflow-hidden aspect-video relative group cursor-pointer">
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-colors">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 transition-transform">
                                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white font-bold text-lg">Video Tutorial</p>
                                <p className="text-gray-300 text-sm">Aprende paso a paso cómo asegurar tu inversión</p>
                            </div>
                            {/* Placeholder message until video provided */}
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
                                Próximamente
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
