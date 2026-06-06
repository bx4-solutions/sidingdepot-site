import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";

export const Route = createFileRoute("/dev/hotspot-calibrator")({
  component: HotspotCalibrator,
});

const INITIAL_PINS = [
  { id: "roofing", label: "Roofing", top: 28, left: 50, color: "#e11d48" },
  { id: "gutters", label: "Gutters (Calha)", top: 39, left: 16, color: "#f97316" },
  { id: "siding", label: "Siding", top: 70, left: 10, color: "#eab308" },
  { id: "windows", label: "Windows", top: 56, left: 22, color: "#22c55e" },
  { id: "doors", label: "Doors", top: 76, left: 48, color: "#06b6d4" },
  { id: "deck", label: "Deck / Porch", top: 78, left: 74, color: "#8b5cf6" },
  { id: "painting", label: "Painting", top: 60, left: 83, color: "#ec4899" },
];

type Pin = (typeof INITIAL_PINS)[number];

function HotspotCalibrator() {
  const [pins, setPins] = useState<Pin[]>(INITIAL_PINS);
  const [dragging, setDragging] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const left = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
      const top = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
      setPins((prev) =>
        prev.map((p) =>
          p.id === dragging
            ? { ...p, top: Math.round(top * 10) / 10, left: Math.round(left * 10) / 10 }
            : p,
        ),
      );
    },
    [dragging],
  );

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const copyCode = () => {
    const lines = pins
      .map((p) => `  { id: "${p.id}", top: "${p.top}%", left: "${p.left}%" }`)
      .join(",\n");
    navigator.clipboard.writeText(`[\n${lines}\n]`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-2xl font-bold mb-2">Hotspot Calibrator</h1>
        <p className="text-gray-400 text-sm mb-6">
          Arraste cada pin colorido para o lugar certo na foto. Quando terminar, clique em{" "}
          <strong className="text-white">Copiar Coordenadas</strong> e cole no chat.
        </p>

        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          {/* Image container */}
          <div
            ref={containerRef}
            className="relative rounded-xl overflow-hidden select-none"
            style={{ aspectRatio: "16/10", cursor: dragging ? "grabbing" : "default" }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src="/projects/project-2.webp"
              alt="House"
              className="w-full h-full object-cover block pointer-events-none"
              draggable={false}
            />

            {pins.map((pin) => (
              <div
                key={pin.id}
                className="absolute"
                style={{
                  top: `${pin.top}%`,
                  left: `${pin.left}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 20,
                  cursor: "grab",
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setDragging(pin.id);
                }}
              >
                <div
                  className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold px-2 py-0.5 rounded shadow-lg"
                  style={{ background: pin.color, color: "#fff" }}
                >
                  {pin.label}
                </div>
                <div
                  className="rounded-full border-2 border-white"
                  style={{
                    width: 28,
                    height: 28,
                    background: pin.color,
                    boxShadow: `0 0 0 3px ${pin.color}55, 0 4px 12px rgba(0,0,0,0.5)`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-3">
            <div className="bg-gray-900 rounded-xl p-4">
              <h2 className="text-white font-semibold text-sm mb-3">Coordenadas atuais</h2>
              <div className="flex flex-col gap-2">
                {pins.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: p.color }}
                    />
                    <span className="text-gray-300 text-xs flex-1">{p.label}</span>
                    <span className="text-gray-500 text-xs font-mono">
                      {p.top}% / {p.left}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={copyCode}
              className="w-full py-3 rounded-xl font-bold text-sm transition-colors"
              style={{ background: copied ? "#22c55e" : "#b4d236", color: "#0a0a0a" }}
            >
              {copied ? "✓ Copiado!" : "Copiar Coordenadas"}
            </button>

            <div className="bg-gray-900 rounded-xl p-4">
              <h2 className="text-white font-semibold text-sm mb-2">Como usar</h2>
              <ol className="text-gray-400 text-xs space-y-1 list-decimal list-inside">
                <li>Arraste cada pin colorido</li>
                <li>Posicione sobre o elemento correto</li>
                <li>Clique "Copiar Coordenadas"</li>
                <li>Cole o resultado aqui no chat</li>
              </ol>
            </div>

            <button
              onClick={() => setPins(INITIAL_PINS)}
              className="w-full py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white text-xs transition-colors"
            >
              Resetar posições
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
