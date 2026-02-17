'use client';

import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'OTHER';

interface AuditLog {
    id: string;
    action: ActionType;
    entity: string;
    entity_id: string | null;
    details: string | null;
    pk: string | null;
    user_id: string | null;
    user_email: string | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    user: {
        name: string | null;
        email: string | null;
    } | null;
}

export function AdminLogs() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/logs?page=${page}&limit=50`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
                // Assuming the API returns pagination info, currently structured as { logs, pagination }
                // but let's be safe
                setTotalPages(data.pagination?.pages || 1);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const getActionColor = (action: ActionType) => {
        switch (action) {
            case 'CREATE': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'UPDATE': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'DELETE': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'LOGIN': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
            case 'LOGOUT': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
            default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
        }
    };

    return (
        <Card className="bg-black/40 backdrop-blur-md border-white/10 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold text-white">
                    Registro de Auditoría
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchLogs}
                    disabled={isLoading}
                    className="text-white/70 hover:text-white"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border border-white/10 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead className="text-white font-bold w-[180px]">Fecha/Hora</TableHead>
                                <TableHead className="text-white font-bold w-[100px]">Acción</TableHead>
                                <TableHead className="text-white font-bold w-[150px]">Entidad</TableHead>
                                <TableHead className="text-white font-bold">Detalles</TableHead>
                                <TableHead className="text-white font-bold w-[200px]">Usuario</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-white/50">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                        Cargando registros...
                                    </TableCell>
                                </TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-white/50">
                                        No hay registros disponibles.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id} className="border-white/10 hover:bg-white/5 transition-colors">
                                        <TableCell className="font-mono text-xs text-white/80">
                                            {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: es })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${getActionColor(log.action)} font-mono text-[10px]`}>
                                                {log.action}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-white/90 font-medium">
                                            {log.entity}
                                            {log.entity_id && (
                                                <span className="block text-[10px] text-white/50 font-mono mt-0.5">
                                                    ID: {log.entity_id.substring(0, 8)}...
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-white/70 text-sm max-w-[300px] truncate" title={log.details || ''}>
                                            {log.details || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-white/90 text-sm font-medium">
                                                    {log.user?.name || log.user_email?.split('@')[0] || 'Sistema'}
                                                </span>
                                                <span className="text-[10px] text-white/50">
                                                    {log.user_email || log.ip_address}
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Improved Pagination */}
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || isLoading}
                        className="border-white/10 text-white hover:bg-white/10 bg-transparent disabled:opacity-50"
                    >
                        Anterior
                    </Button>
                    <div className="text-sm text-white/70 font-mono">
                        Página {page} de {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || isLoading}
                        className="border-white/10 text-white hover:bg-white/10 bg-transparent disabled:opacity-50"
                    >
                        Siguiente
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
