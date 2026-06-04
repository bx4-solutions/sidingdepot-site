import { useState, useEffect } from "react";
import { Edit3, Check, MousePointer2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

/**
 * VisualEditToggle
 * Provides a "Design Mode" toggle to allow inline text editing for brainstorming.
 * This satisfies the request for "clicking and altering content directly".
 */
export function VisualEditToggle() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Enable/disable browser's designMode
    if (isEditMode) {
      document.designMode = "on";
      // Add a visual indicator to the body
      document.body.classList.add("design-mode-active");
    } else {
      document.designMode = "off";
      document.body.classList.remove("design-mode-active");
    }

    return () => {
      document.designMode = "off";
      document.body.classList.remove("design-mode-active");
    };
  }, [isEditMode]);

  // Shortcut Ctrl+E to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        setIsEditMode(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fixed bottom-24 right-6 z-[100] flex flex-col items-end gap-2 group pointer-events-none">
      {isEditMode && (
        <div className="bg-sd-black text-white text-[10px] px-2 py-1 rounded shadow-lg animate-pulse pointer-events-auto">
          Design Mode Active: Click any text to edit
        </div>
      )}
      
      <div className="flex items-center gap-2 pointer-events-auto">
        {showHint && !isEditMode && (
          <div className="bg-white border border-sd-gray-border p-2 rounded-lg shadow-xl text-xs max-w-[200px] animate-in fade-in slide-in-from-right-4">
            <p className="font-semibold text-sd-black">Modo de Edição Rápida</p>
            <p className="text-sd-gray-text mt-1">
              Ative para editar textos clicando neles. Use as <strong>Visual Edits</strong> do Lovable (no canto inferior esquerdo) para salvar permanentemente.
            </p>
          </div>
        )}
        
        <Button
          size="icon"
          variant={isEditMode ? "dark" : "outline"}
          className={cn(
            "h-12 w-12 rounded-full shadow-2xl transition-all hover:scale-110",
            isEditMode ? "bg-sd-green text-sd-black hover:bg-sd-green-hover border-none" : "bg-white"
          )}
          onClick={() => setIsEditMode(!isEditMode)}
          onMouseEnter={() => setShowHint(true)}
          onMouseLeave={() => setShowHint(false)}
          title={isEditMode ? "Sair do modo edição" : "Entrar no modo edição (Ctrl+E)"}
        >
          {isEditMode ? <Check className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
