"use client";

import { useRef, useState } from "react";
import { Button } from "./ui/Button";

interface PhotoInputProps {
  label: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  required?: boolean;
}

const MAX_BYTES = 4 * 1024 * 1024;

export function PhotoInput({ label, value, onChange, required }: PhotoInputProps) {
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
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-error">*</span>}
      </label>

      {value ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="w-full max-h-64 object-cover rounded-xl border border-border" />
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="absolute top-2 right-2 bg-background/90 text-error rounded-full w-8 h-8 flex items-center justify-center shadow-sm border border-border"
          >
            ✕
          </button>
        </div>
      ) : (
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()} className="w-full py-6 border-dashed">
          Subir foto
        </Button>
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
