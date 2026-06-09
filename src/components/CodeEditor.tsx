"use client";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

/**
 * Editor de código com syntax highlight AO VIVO (CodeMirror).
 *
 * Como ele não é um <input> nativo, guardamos o conteúdo num
 * <input type="hidden" name={name}> — assim o valor é enviado junto
 * do formulário e a Server Action consegue ler com formData.get(name).
 */
export default function CodeEditor({
  name,
  defaultValue = "",
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [mounted, setMounted] = useState(false);

  // CodeMirror só renderiza no cliente; evita erro de SSR/hidratação
  useEffect(() => setMounted(true), []);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {mounted ? (
        <CodeMirror
          value={value}
          onChange={setValue}
          theme="dark"
          height="260px"
          placeholder={placeholder}
          extensions={[javascript({ jsx: true, typescript: true })]}
          basicSetup={{ lineNumbers: true, foldGutter: false }}
        />
      ) : (
        // fallback enquanto o editor não montou
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={11}
          placeholder={placeholder}
          className="w-full bg-[#282c34] p-3 font-mono text-sm text-zinc-100 outline-none"
        />
      )}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
