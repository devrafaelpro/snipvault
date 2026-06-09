import { codeToHtml } from "shiki";

// Bloco de código sempre com tema escuro (cores embutidas = sempre funciona).
export default async function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  let html: string;
  try {
    html = await codeToHtml(code, { lang: language, theme: "github-dark" });
  } catch {
    // linguagem desconhecida -> mostra como texto puro
    html = await codeToHtml(code, { lang: "text", theme: "github-dark" });
  }

  return (
    <div
      className="overflow-x-auto text-sm [&_pre]:!m-0 [&_pre]:!bg-[#24292e] [&_pre]:p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
