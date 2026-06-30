/** Renderiza un texto con saltos de línea (\n) como <br/>. */
export function Multiline({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {line}
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}
