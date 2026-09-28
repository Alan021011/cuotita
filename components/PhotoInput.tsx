"use client";

import { useRef, useState } from "react";
import { Icon } from "./ui/Icon";

interface PhotoInputProps {
  label: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  required?: boolean;
  /** Primary evidence gets the big drop zone; optional extras a compact one. */
  size?: "lg" | "sm";
  icon?: string;
  hint?: string;
}

const MAX_BYTES = 4 * 1024 * 1024;

export function PhotoInput({ label, value, onChange, required, size = "lg", icon = "photo_camera", hint }: PhotoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Sube una imagen (foto del daño).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("La imagen es muy pesada (máx. 4MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.onerror = () => setError("No se pudo leer la imagen.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex w-full flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
        {label} {required && <span className="text-primary">*</span>}
      </span>

      {value ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="max-h-64 w-full rounded-xl border border-border object-cover" />
          <button
            type="button"
            aria-label="Quitar foto"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/90 text-error"
          >
            <Icon name="close" className="text-lg" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-primary/40 bg-background text-left transition-colors hover:border-primary hover:bg-primary/5 ${
            size === "lg" ? "flex-col justify-center px-4 py-8 text-center" : "px-4 py-3.5"
          }`}
        >
          <span
            className={`flex shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ${
              size === "lg" ? "h-14 w-14" : "h-10 w-10"
            }`}
          >
            <Icon name={icon} className={size === "lg" ? "text-3xl" : "text-xl"} />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">Tomar o subir foto</span>
            {hint && <span className="mt-0.5 text-xs text-muted">{hint}</span>}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
