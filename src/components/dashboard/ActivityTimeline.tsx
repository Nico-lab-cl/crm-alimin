import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Globe, Mail, FileText, PhoneCall, MapPin, Compass } from "lucide-react";
import { ActivityEvent } from "@/lib/activities";

interface ActivityTimelineProps {
    activities: ActivityEvent[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
    if (activities.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-gray-400 text-sm">No se encontró actividad cruzada para este usuario.</p>
            </div>
        );
    }

    const getIcon = (type: ActivityEvent['type']) => {
        switch (type) {
            case 'web_lead': return <Globe className="w-4 h-4 text-white" />;
            case 'newsletter': return <Mail className="w-4 h-4 text-white" />;
            case 'crm_note': return <FileText className="w-4 h-4 text-white" />;
            case 'crm_call': return <PhoneCall className="w-4 h-4 text-white" />;
            case 'crm_reservation': return <MapPin className="w-4 h-4 text-white" />;
            default: return <Compass className="w-4 h-4 text-white" />;
        }
    };

    const getBgColor = (source: ActivityEvent['source']) => {
        switch (source) {
            case 'Aliminspa.cl': return 'bg-blue-500';
            case 'Lomas del Mar': return 'bg-[var(--alimin-green)]';
            case 'Meta Ads': return 'bg-pink-600';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {activities.map((event, idx) => (
                    <li key={event.id}>
                        <div className="relative pb-8">
                            {idx !== activities.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-100" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-4">
                                <div>
                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm ${getBgColor(event.source)}`}>
                                        {getIcon(event.type)}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900">{event.title}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${getBgColor(event.source)}`}>
                                                        {event.source.toUpperCase()}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-medium">
                                                        {format(new Date(event.date), "dd MMM, HH:mm", { locale: es })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {event.description}
                                        </p>
                                        
                                        {event.metadata?.author && (
                                            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase">
                                                    {event.metadata.author.charAt(0)}
                                                </div>
                                                <span className="text-[11px] text-gray-500 font-medium">
                                                    Registrado por {event.metadata.author}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
