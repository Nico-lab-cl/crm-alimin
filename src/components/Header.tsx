"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationBell } from '@/components/NotificationBell';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Briefcase, Settings, LogOut, FileText, Map as MapIcon, PlusCircle } from 'lucide-react';

const logo = '/Diseño sin título.svg';

interface HeaderProps {
  projectName: string;
}

export const Header = ({ projectName }: HeaderProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    document.documentElement.style.setProperty('--header-height', '88px');
  }, []);

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header
      className="bg-alimin-green/95 backdrop-blur-md border-b border-alimin-gold/20 fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[88px]"
    >
      <div className="container mx-auto px-4 h-[88px] flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 md:gap-4 min-w-0 hover:opacity-90 transition-opacity"
              aria-label="Ir al inicio"
            >
              <img src={logo} alt="Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-base md:text-xl font-bold text-white whitespace-nowrap">
                  Lomas Del Mar
                </h1>
                <p className="text-xs md:text-sm text-white/80 uppercase tracking-wide hidden md:block">
                  Tu terreno a pasos del mar
                </p>
              </div>
            </Link>

            {/* Theme Toggle - Left Side */}
            <div className="hidden md:flex ml-4 border-l pl-4 border-border">
              <ThemeToggle />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Notification Bell - visible for logged-in users */}
            {session && (
              <div className="flex mr-1">
                <NotificationBell />
              </div>
            )}

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10 transition-colors">
                    <Avatar className="h-10 w-10 border-2 border-white/40 hover:border-white transition-colors">
                      <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                      <AvatarFallback className="bg-white/10 text-white font-bold backdrop-blur-sm">
                        {getInitials(session.user?.name || 'Usuario')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      {(session as any).isImpersonating ? (
                        <>
                          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-1">
                            Simulando a:
                          </p>
                          <p className="text-xs leading-none text-amber-600 font-bold">
                            {session.user?.email}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Vía: {(session as any).adminEmail}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user?.email}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-primary mt-1">
                        {session.user?.role === 'ADMIN' ? 'Administrador' :
                          session.user?.role === 'SELLER' ? 'Vendedor' : 'Cliente'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* USER / CLIENTE OPTIONS */}
                  {session.user?.role === 'USER' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/user/plots" className="cursor-pointer">
                          <MapIcon className="mr-2 h-4 w-4" />
                          <span>Terrenos</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/user/documents" className="cursor-pointer">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Documentos</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/user/change-password" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Cambiar Contraseña</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* SELLER / VENDEDOR OPTIONS */}
                  {session.user?.role === 'SELLER' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/dashboard" className="cursor-pointer">
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>Mi Pipeline de Ventas</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/new-lead" className="cursor-pointer">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          <span>Registrar Nuevo Cliente</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* ADMIN OPTIONS */}
                  {session.user?.role === 'ADMIN' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Panel de Administración</span>
                        </Link>
                      </DropdownMenuItem>
                      {session.user?.email !== 'postventa@lomasdelmar.cl' && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin/lots" className="cursor-pointer">
                            <MapIcon className="mr-2 h-4 w-4" />
                            <span>Gestión de Lotes</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </>
                  )}

                  <DropdownMenuSeparator />
                  
                  {(session as any).isImpersonating && (
                    <DropdownMenuItem 
                      className="bg-amber-50 text-amber-700 font-bold focus:bg-amber-100 focus:text-amber-800 cursor-pointer"
                      onClick={async () => {
                        const { stopImpersonating } = await import('@/actions/dashboard');
                        await stopImpersonating();
                        window.location.href = '/admin/dashboard';
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Volver a Vista Admin</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={async () => {
                      if ((session as any).isImpersonating) {
                        try {
                          const { stopImpersonating } = await import('@/actions/dashboard');
                          await stopImpersonating();
                        } catch (e) {}
                      }
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
                <a
                  href="https://pagos.aliminspa.cl/login"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 md:px-6 border-alimin-gold/60 bg-transparent text-alimin-gold hover:bg-alimin-gold/10 hover:text-alimin-gold shadow-sm transition-all rounded-full font-medium"
                  >
                    Portal de Pagos
                  </Button>
                </a>
                <div className="flex flex-col items-center gap-1">
                  <Link href="/login">
                    <Button
                      variant="default"
                      size="sm"
                      className="h-9 px-6 bg-[#36595F] hover:bg-[#2b464a] text-white shadow-md hover:shadow-lg transition-all rounded-full font-medium"
                    >
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register" className="text-[10px] text-muted-foreground hover:text-primary transition-colors underline decoration-dotted">
                    Registrarse
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
