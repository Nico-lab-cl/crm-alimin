import { webPrisma as prisma } from "@/lib/prisma";
import { Globe, Users, Mail, Search } from "lucide-react";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { NewsletterTable } from "@/components/dashboard/NewsletterTable";
import { Pagination } from "@/components/dashboard/Pagination";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    tab?: string;
    page?: string;
    search?: string;
  }>;
}

export default async function WebLeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentTab = params.tab || "leads";
  const page = Number(params.page) || 1;
  const pageSize = 10;
  const search = params.search || "";

  let data: any[] = [];
  let totalCount = 0;

  if (currentTab === "leads") {
    const where = search ? {
      OR: [
        { nombre: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    [data, totalCount] = await Promise.all([
      prisma.leads.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { created_at: "desc" },
      }),
      prisma.leads.count({ where }),
    ]);
  } else {
    const where = search ? {
      email: { contains: search, mode: 'insensitive' as const }
    } : {};

    [data, totalCount] = await Promise.all([
      prisma.newsletter_subscribers.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { created_at: "desc" },
      }),
      prisma.newsletter_subscribers.count({ where }),
    ]);
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-6 h-full flex flex-col">
      {/* ── Project Header ── */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
          <div className="h-7 w-7 rounded bg-[var(--alimin-green)] flex items-center justify-center flex-shrink-0">
              <Globe className="h-4 w-4 text-white" />
          </div>
          <div className="flex items-baseline gap-2">
              <h1 className="text-lg font-bold text-gray-800 leading-tight">Aliminspa.cl</h1>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sitio Web</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
              <span className="text-xl font-bold text-[var(--alimin-green)]">{totalCount}</span>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{currentTab === 'leads' ? 'Leads' : 'Suscriptores'}</span>
          </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 mb-3 border-b border-gray-100 px-1">
        <Link
          href="/dashboard/web?tab=leads"
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
            currentTab === "leads" 
            ? "border-[var(--alimin-gold)] text-gray-900" 
            : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <Users className="w-3.5 h-3.5 inline mr-1" />
          Clientes Potenciales
        </Link>
        <Link
          href="/dashboard/web?tab=newsletter"
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
            currentTab === "newsletter" 
            ? "border-[var(--alimin-gold)] text-gray-900" 
            : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <Mail className="w-3.5 h-3.5 inline mr-1" />
          Boletín
        </Link>
      </div>

      {/* ── Filters bar ── */}
      <form method="GET" className="bg-white rounded-lg border border-gray-200 shadow-sm p-2 mb-3 flex flex-wrap gap-2 items-center">
          <input type="hidden" name="tab" value={currentTab} />
          <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Buscar por nombre o email..."
                  className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--alimin-green)]"
              />
          </div>
          <div className="flex gap-1 ml-auto">
              <button
                  type="submit"
                  className="bg-[var(--alimin-green)] text-white text-[11px] font-bold px-3 py-1.5 rounded hover:opacity-90 transition shadow-sm"
              >
                  Filtrar
              </button>
              <Link
                  href={`/dashboard/web?tab=${currentTab}`}
                  className="text-[11px] font-bold px-3 py-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
              >
                  Limpiar
              </Link>
          </div>
      </form>

      {/* Table Container */}
      {currentTab === "leads" ? (
        <LeadsTable leads={data} />
      ) : (
        <NewsletterTable subscribers={data} />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalCount}
        pageSize={pageSize}
      />
    </div>
  );
}
