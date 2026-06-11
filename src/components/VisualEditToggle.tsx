import { useState, useEffect, useRef, useCallback } from "react";
import { Edit3, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface EditingState {
  element: HTMLElement;
  originalText: string;
  rect: DOMRect;
}

export function VisualEditToggle() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [flashMessage, setFlashMessage] = useState<{ text: string; color: string } | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const toolbarClickedRef = useRef(false);

  const exitElement = useCallback(
    (confirm: boolean) => {
      if (!editing) return;
      const { element, originalText } = editing;
      element.removeAttribute("contenteditable");
      element.style.outline = "";
      element.style.cursor = "";
      if (!confirm) {
        element.textContent = originalText;
        setFlashMessage({ text: "✗ Cancelado", color: "bg-gray-700 text-white" });
      } else {
        setSavedCount((c) => c + 1);
        setFlashMessage({ text: "✓ Texto confirmado!", color: "bg-sd-green text-sd-black" });
      }
      setTimeout(() => setFlashMessage(null), 1500);
      setEditing(null);
    },
    [editing],
  );

  // Click handler in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // If toolbar button was just clicked, ignore this event
      if (toolbarClickedRef.current) {
        toolbarClickedRef.current = false;
        return;
      }

      // If there's already an element being edited, confirm it first
      if (editing) {
        exitElement(true);
      }

      // Only edit text-like elements
      const editable = target.closest(
        "p, h1, h2, h3, h4, h5, h6, span, li, a, label, td, th",
      ) as HTMLElement | null;
      if (!editable) return;

      const originalText = editable.textContent ?? "";
      editable.setAttribute("contenteditable", "true");
      editable.style.outline = "2px solid #b5f23d";
      editable.style.outlineOffset = "2px";
      editable.style.cursor = "text";
      editable.focus();

      const rect = editable.getBoundingClientRect();
      setEditing({ element: editable, originalText, rect });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isEditMode, editing, exitElement]);

  // Update toolbar position on scroll/resize
  useEffect(() => {
    if (!editing) return;
    const update = () => {
      setEditing((prev) => (prev ? { ...prev, rect: prev.element.getBoundingClientRect() } : null));
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [editing]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        setIsEditMode((prev) => !prev);
      }
      if (editing) {
        if (e.key === "Escape") {
          e.preventDefault();
          exitElement(false);
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          exitElement(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editing, exitElement]);

  // Cleanup when edit mode is toggled off
  useEffect(() => {
    if (!isEditMode) {
      if (editing) exitElement(false);
      document.body.classList.remove("design-mode-active");
    } else {
      document.body.classList.add("design-mode-active");
    }
  }, [isEditMode]);

  // Toolbar position: just below the edited element
  const toolbarStyle = editing
    ? (() => {
        const r = editing.rect;
        const top = r.bottom + window.scrollY + 6;
        const left = Math.max(8, r.left + window.scrollX);
        return { top, left };
      })()
    : null;

  return (
    <>
      {/* Floating confirm toolbar — appears near edited element */}
      {editing && toolbarStyle && (
        <div
          ref={toolbarRef}
          style={{
            position: "absolute",
            top: toolbarStyle.top,
            left: toolbarStyle.left,
            zIndex: 9999,
            cursor: "default",
          }}
          className="flex items-center gap-1 bg-white border border-sd-gray-border rounded-lg shadow-xl px-2 py-1 animate-in fade-in slide-in-from-top-1"
        >
          <span
            className="text-[10px] text-sd-gray-text mr-1 select-none"
            style={{ cursor: "default" }}
          >
            Edição de texto
          </span>
          <button
            style={{ cursor: "pointer" }}
            className="flex items-center gap-1 text-[11px] font-semibold bg-sd-green text-sd-black rounded px-2 py-0.5 hover:bg-sd-green-hover active:scale-95 active:brightness-90 transition-all select-none"
            onMouseDown={() => {
              toolbarClickedRef.current = true;
            }}
            onClick={(e) => {
              e.stopPropagation();
              exitElement(true);
            }}
          >
            ✓ OK
          </button>
          <button
            style={{ cursor: "pointer" }}
            className="flex items-center gap-1 text-[11px] text-sd-gray-text rounded px-2 py-0.5 hover:bg-sd-gray-light active:scale-95 active:brightness-90 transition-all select-none"
            onMouseDown={() => {
              toolbarClickedRef.current = true;
            }}
            onClick={(e) => {
              e.stopPropagation();
              exitElement(false);
            }}
          >
            <X className="w-3 h-3" /> Cancelar
          </button>
          <span
            className="text-[9px] text-sd-gray-text/60 ml-1 hidden sm:block"
            style={{ cursor: "default" }}
          >
            Ctrl+Enter / Esc
          </span>
        </div>
      )}

      {/* Flash notification — OK ou Cancelar */}
      {flashMessage && (
        <div
          className={`fixed bottom-40 right-6 z-[200] ${flashMessage.color} text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg animate-in fade-in`}
        >
          {flashMessage.text}
        </div>
      )}

      {/* Toggle button */}
      <div className="fixed bottom-24 right-6 z-[100] flex flex-col items-end gap-2 pointer-events-none">
        {isEditMode && savedCount > 0 && (
          <div className="bg-sd-black/80 text-white text-[10px] px-2 py-1 rounded shadow pointer-events-none">
            {savedCount} {savedCount === 1 ? "alteração" : "alterações"} feitas
          </div>
        )}

        <div className="flex items-center gap-2 pointer-events-auto">
          {showHint && !isEditMode && (
            <div className="bg-white border border-sd-gray-border p-2 rounded-lg shadow-xl text-xs max-w-[200px] animate-in fade-in slide-in-from-right-4">
              <p className="font-semibold text-sd-black">Modo de Edição</p>
              <p className="text-sd-gray-text mt-1">
                Ative para editar textos clicando neles. Use as <strong>Visual Edits</strong> do
                Lovable (no canto inferior esquerdo) para salvar permanentemente.
              </p>
            </div>
          )}

          <Button
            size="icon"
            variant={isEditMode ? "dark" : "outline"}
            className={cn(
              "h-12 w-12 rounded-full shadow-2xl transition-all hover:scale-110",
              isEditMode
                ? "bg-sd-green text-sd-black hover:bg-red-500 hover:text-white border-none"
                : "bg-white hover:bg-sd-green/10",
            )}
            onClick={() => setIsEditMode(!isEditMode)}
            onMouseEnter={() => setShowHint(true)}
            onMouseLeave={() => setShowHint(false)}
            title={isEditMode ? "Fechar modo edição (Ctrl+E)" : "Entrar no modo edição (Ctrl+E)"}
          >
            {isEditMode ? <X className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </>
  );
}
