// src/components/StyledText.tsx
import React from "react";

interface StyledTextProps {
  children: React.ReactNode;
}

const StyledText: React.FC<StyledTextProps> = ({ children }) => {
  // Pastikan children adalah string sebelum memprosesnya
  const text = typeof children === "string" ? children : "";

  // Jika children bukan string, atau string kosong, kembalikan langsung
  if (!text) {
    return <>{children}</>;
  }

  // Regex untuk mendeteksi teks di dalam tanda kutip ganda
  const quoteRegex = /"([^"]*)"/g;
  // Regex untuk mendeteksi teks di dalam kurung siku
  const bracketRegex = /\[(.*?)\]/g;

  // Lakukan proses untuk kurung siku terlebih dahulu
  let partsWithBrackets: React.ReactNode[] = [text];

  partsWithBrackets = partsWithBrackets.flatMap((part) => {
    if (typeof part === "string") {
      const matches = [...part.matchAll(bracketRegex)];
      if (matches.length === 0) {
        return [part];
      }

      const result: React.ReactNode[] = [];
      let lastIndex = 0;
      matches.forEach((match) => {
        const textBefore = part.substring(lastIndex, match.index);
        const bracketedText = match[1];

        if (textBefore) {
          result.push(textBefore);
        }

        result.push(
          <strong
            key={`bracket-${match.index}`}
            className="uppercase text-red-500"
          >
            {bracketedText}
          </strong>
        );

        lastIndex = match.index + match[0].length;
      });

      const textAfter = part.substring(lastIndex);
      if (textAfter) {
        result.push(textAfter);
      }

      return result;
    }
    return [part];
  });

  // Setelah itu, lakukan proses untuk tanda kutip
  const finalParts = partsWithBrackets.flatMap((part) => {
    if (typeof part === "string") {
      const matches = [...part.matchAll(quoteRegex)];
      if (matches.length === 0) {
        return [part];
      }

      const result: React.ReactNode[] = [];
      let lastIndex = 0;
      matches.forEach((match) => {
        const textBefore = part.substring(lastIndex, match.index);
        const quotedText = match[1];

        if (textBefore) {
          result.push(textBefore);
        }

        result.push(
          <span key={`quote-${match.index}`} className="italic text-blue-500">
            "{quotedText}"
          </span>
        );

        lastIndex = match.index + match[0].length;
      });

      const textAfter = part.substring(lastIndex);
      if (textAfter) {
        result.push(textAfter);
      }

      return result;
    }
    return [part];
  });

  return <>{finalParts}</>;
};

export default StyledText;
