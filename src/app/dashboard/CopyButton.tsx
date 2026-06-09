"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // alguns navegadores bloqueiam clipboard fora de https; ignoramos
    }
  }

  return (
    <button
      onClick={copy}
      type="button"
      className="rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-1 font-mono text-xs text-zinc-100 backdrop-blur transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? "copiado ✓" : "copiar"}
    </button>
  );
}
