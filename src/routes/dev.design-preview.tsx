import { createFileRoute } from "@tanstack/react-router";
import { ServiceCard } from "@/components/site/ServiceCard";
import { SERVICES } from "@/data/site";

export const Route = createFileRoute("/dev/design-preview")({
  component: DesignPreview,
});

function DesignPreview() {
  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900">Design Preview — ServiceCard Premium</h1>
          <p className="mt-1 text-sm text-gray-500">
            Hover cada card para ver o padrão premium. Esta página não afeta a home.
          </p>
        </div>

        {/* Grid idêntico ao da home — 4 colunas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.slice(0, 8).map((s, i) => (
            <ServiceCard
              key={s.slug}
              Icon={s.Icon}
              title={s.title}
              description={s.short}
              to={`/${s.slug}`}
              image={s.image}
              priority={i < 2}
            />
          ))}
        </div>

        <div className="mt-16 rounded-xl bg-white border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Padrão visual aplicado</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ Foto sempre visível — zero opacity:0 no hover</li>
            <li>✅ Zoom suave (scale-105) na foto ao hover</li>
            <li>✅ Overlay escuro profundo no hover — texto sempre legível</li>
            <li>✅ Descrição aparece no hover via max-h transition</li>
            <li>✅ Seta do CTA desliza para direita</li>
            <li>✅ Barra verde no topo mantida</li>
            <li>✅ Ícone com fundo verde translúcido</li>
            <li>✅ Mobile-safe — conteúdo sempre legível sem hover</li>
            <li>⚠️ Assets de logo real (James Hardie, GAF) necessários para próxima fase</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
