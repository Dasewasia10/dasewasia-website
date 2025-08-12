// src/components/StyledText.tsx
import React from "react";

interface StyledTextProps {
  children: React.ReactNode;
}

const StyledText: React.FC<StyledTextProps> = ({ children }) => {
  const processText = (text: string) => {
    // Regex untuk mendeteksi teks di dalam tanda kutip ganda
    const quoteRegex = /"([^"]*)"/g;
    // Regex untuk mendeteksi teks di dalam kurung siku
    const bracketRegex = /\[(.*?)\]/g;

    let parts: (string | React.ReactNode)[] = [text];

    // Proses untuk kurung siku
    parts = parts.flatMap((part) => {
      if (typeof part !== "string") return part;
      const matches = [...part.matchAll(bracketRegex)];
      if (matches.length === 0) return part;

      const result: (string | React.ReactNode)[] = [];
      let lastIndex = 0;
      matches.forEach((match) => {
        result.push(part.substring(lastIndex, match.index));
        result.push(
          <strong
            key={`bracket-${match.index}`}
            className="uppercase text-red-500"
          >
            {match[1]}
          </strong>
        );
        lastIndex = match.index + match[0].length;
      });
      result.push(part.substring(lastIndex));
      return result.filter(Boolean);
    });

    // Proses untuk tanda kutip
    const finalParts = parts.flatMap((part) => {
      if (typeof part !== "string") return part;
      const matches = [...part.matchAll(quoteRegex)];
      if (matches.length === 0) return part;

      const result: (string | React.ReactNode)[] = [];
      let lastIndex = 0;
      matches.forEach((match) => {
        result.push(part.substring(lastIndex, match.index));
        result.push(
          <span key={`quote-${match.index}`} className="italic text-blue-500">
            "{match[1]}"
          </span>
        );
        lastIndex = match.index + match[0].length;
      });
      result.push(part.substring(lastIndex));
      return result.filter(Boolean);
    });

    return finalParts;
  };

  // Gunakan fungsi untuk memproses children
  const renderedChildren = React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return processText(child);
    }
    return child;
  });

  return <>{renderedChildren}</>;
};

export default StyledText;
