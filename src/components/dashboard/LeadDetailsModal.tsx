"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, User, Phone, MapPin, Globe, Calendar, Link as LinkIcon, Compass, Activity, Info, MessageSquare, Mail } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ActivityTimeline } from "./ActivityTimeline";

interface LeadDetailsModalProps {
  lead: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadDetailsModal({ lead, isOpen, onClose }: LeadDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [showLogPrompt, setShowLogPrompt] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Normalize data for display
  const displayName = lead?.nombre || (lead?.first_name ? `${lead.first_name} ${lead.last_name || ''}` : 'Lead');
  const displayEmail = lead?.email;
  const displayPhone = lead?.celular || lead?.phone;
  const displayCity = lead?.ciudad;
  const displaySource = lead?.fuente || lead?.source || 'Lead';

  useEffect(() => {
    if (displayEmail && isOpen) {
        refreshActivities();
    }
  }, [displayEmail, isOpen]);

  const refreshActivities = () => {
    if (!displayEmail) return;
    setLoadingActivities(true);
    fetch(`/api/activities?email=${displayEmail}`)
      .then(res => res.json())
      .then(data => {
        setActivities(data);
        setLoadingActivities(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingActivities(false);
      });
  };

  useEffect(() => {
    // Escuchar cuando el usuario vuelve a la App (solo en móvil)
    const isCapacitor = typeof window !== 'undefined' && (window as any).Capacitor;
    if (!isCapacitor || !isOpen) return;

    let appListener: any;
    
    const initListener = async () => {
        const { App } = await import('@capacitor/app');
        appListener = await App.addListener('appStateChange', ({ isActive }: { isActive: boolean }) => {
            if (isActive && localStorage.getItem('pending_whatsapp_log') === lead?.id) {
                setShowLogPrompt(true);
                localStorage.removeItem('pending_whatsapp_log');
            }
        });
    };

    initListener();
    return () => {
        if (appListener) appListener.remove();
    };
  }, [isOpen, lead?.id]);

  const handleWhatsAppClick = () => {
    localStorage.setItem('pending_whatsapp_log', lead?.id);
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return;
    setIsSavingNote(true);
    try {
        const res = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contactId: lead.id, content: noteContent })
        });
        if (res.ok) {
            setNoteContent("");
            setShowLogPrompt(false);
            refreshActivities();
            setActiveTab('activity');
        }
    } catch (error) {
        console.error("Error saving note:", error);
    } finally {
        setIsSavingNote(false);
    }
  };

  if (!lead) return null;

  const getSourceDisplay = (source: string | null) => {
    if (!source) return "Directo / Desconocido";
    const s = source.toLowerCase();
    if (s.includes("google")) return "Google Ads";
    if (s.includes("facebook") || s.includes("ig") || s.includes("meta")) return "Meta (FB/IG)";
    if (s.includes("organic")) return "Búsqueda Orgánica";
    return source;
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                {/* Header */}
                <div className="bg-[var(--alimin-green)] px-6 py-6 sm:px-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[var(--alimin-gold)] font-bold text-xl uppercase shadow-inner">
                        {displayName.charAt(0)}
                      </div>
                      <div>
                        <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-white">
                          {displayName}
                        </Dialog.Title>
                        <p className="mt-1 text-sm text-white/60">
                          {displayEmail}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-full p-1 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                      onClick={onClose}
                    >
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                        activeTab === 'details' ? 'bg-[var(--alimin-gold)] text-[var(--alimin-green)] shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Info className="w-3.5 h-3.5" />
                      DETALLES
                    </button>
                    <button
                      onClick={() => setActiveTab('activity')}
                      className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                        activeTab === 'activity' ? 'bg-[var(--alimin-gold)] text-[var(--alimin-green)] shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      ACTIVIDAD CRUZADA
                      {activities.length > 0 && (
                        <span className="bg-[var(--alimin-green)] text-white px-1.5 py-0.5 rounded text-[8px] border border-white/20">
                          {activities.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white px-6 py-6 sm:px-8 sm:py-8 min-h-[400px]">
                  {activeTab === 'details' ? (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      {/* Grid Informative */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Información de Contacto</h4>
                          
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-[var(--alimin-gold)]" />
                            <span className="text-gray-700 font-medium">{displayPhone || "Sin teléfono"}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-sm">
                            <MapPin className="h-4 w-4 text-[var(--alimin-gold)]" />
                            <span className="text-gray-700 font-medium">{displayCity || "Sin ciudad"}</span>
                          </div>

                          <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-[var(--alimin-gold)]" />
                            <span className="text-gray-700 font-medium">
                              Captado: {lead.created_at ? format(new Date(lead.created_at), "dd 'de' MMMM, yyyy", { locale: es }) : "—"}
                            </span>
                          </div>

                          <div className="flex gap-2 pt-2">
                            {displayPhone && (
                              <a 
                                href={`https://wa.me/${displayPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${displayName}, te contacto de Lomas del Mar por tu interés en ${lead.proyecto || 'nuestros proyectos'}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleWhatsAppClick}
                                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white text-[10px] font-bold py-2 rounded-lg hover:bg-[#128C7E] transition-all shadow-sm"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                WHATSAPP
                              </a>
                            )}
                            {displayEmail && (
                              <a 
                                href={`mailto:${displayEmail}?subject=${encodeURIComponent(`Contacto Lomas del Mar - ${lead.proyecto || ''}`)}&body=${encodeURIComponent(`Hola ${displayName},\n\nEspero que estés bien. Te contacto de Lomas del Mar...`)}`}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-black transition-all shadow-sm"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                EMAIL
                              </a>
                            )}
                          </div>

                          {/* WhatsApp Assistant Prompt */}
                          {showLogPrompt && (
                            <div className="mt-4 animate-in fade-in zoom-in duration-300">
                                <div className="bg-[var(--alimin-gold)]/10 border border-[var(--alimin-gold)]/20 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare className="w-4 h-4 text-[var(--alimin-gold)]" />
                                        <h5 className="text-xs font-bold text-[var(--alimin-green)]">¿Cómo te fue con {displayName}?</h5>
                                    </div>
                                    <textarea 
                                        value={noteContent}
                                        onChange={(e) => setNoteContent(e.target.value)}
                                        placeholder="Escribe un resumen de la conversación..."
                                        className="w-full text-xs p-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[var(--alimin-gold)] outline-none min-h-[80px]"
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button 
                                            onClick={() => setShowLogPrompt(false)}
                                            className="text-[10px] font-bold text-gray-400 px-3 py-1"
                                        >
                                            IGNORAR
                                        </button>
                                        <button 
                                            onClick={handleSaveNote}
                                            disabled={isSavingNote || !noteContent.trim()}
                                            className="bg-[var(--alimin-green)] text-white text-[10px] font-bold px-4 py-1.5 rounded-lg shadow-sm disabled:opacity-50"
                                        >
                                            {isSavingNote ? 'GUARDANDO...' : 'REGISTRAR NOTA'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Interés / Proyecto</h4>
                          <div className="flex items-center gap-3 text-sm">
                            <Globe className="h-4 w-4 text-[var(--alimin-gold)]" />
                            <span className="bg-gray-100 text-[var(--alimin-green)] px-3 py-1 rounded-full text-xs font-bold">
                              {lead.proyecto || lead.meta_form_name || "General"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-400 italic">
                            <LinkIcon className="h-4 w-4" />
                            <span>Fuente: {displaySource}</span>
                          </div>
                        </div>
                      </div>

                      <hr className="border-gray-100" />

                      {/* UTM / Tracking - Only if it has UTM info */}
                      {(lead.utm_source || lead.utm_medium || lead.utm_campaign) ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Compass className="h-4 w-4 text-[var(--alimin-gold)]" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Atribución y Origen (UTM)</h4>
                          </div>
                          
                          <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border border-gray-100">
                            <div className="flex flex-col">
                              <span className="text-[9px] uppercase font-bold text-gray-400">Canal Principal</span>
                              <span className="text-sm font-bold text-[var(--alimin-green)]">{getSourceDisplay(lead.utm_source)}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] uppercase font-bold text-gray-400">Medio</span>
                              <span className="text-sm font-medium text-gray-700">{lead.utm_medium || "Directo"}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] uppercase font-bold text-gray-400">Campaña</span>
                              <span className="text-sm font-medium text-gray-700">{lead.utm_campaign || "Desconocida"}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Compass className="h-4 w-4" />
                          <span className="text-xs font-medium">No hay datos UTM disponibles para este lead.</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                      {loadingActivities ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                          <div className="w-8 h-8 border-4 border-[var(--alimin-gold)] border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Consultando toda la red Alimin...</p>
                        </div>
                      ) : (
                        <ActivityTimeline activities={activities} />
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 sm:px-8 border-t border-gray-100 flex justify-end pb-safe">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg border border-transparent bg-[var(--alimin-green)] px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-[var(--alimin-green-hover)] focus:outline-none transition-all"
                    onClick={onClose}
                  >
                    Cerrar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
