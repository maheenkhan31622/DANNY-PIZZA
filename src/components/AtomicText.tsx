import React from 'react';

/**
 * Matches atomic numeric+unit or parenthetical unit phrases so they never split mid-phrase
 * across lines in either mobile or desktop views:
 * e.g., "(1.5 Litre)", "1.5 Litre", "(4 Pcs)", "Rs. 2,999", "4:30 PM", "2:00 AM",
 * "1 Small Pizza", "2 Medium Pizzas", "2 Large Pizzas", "4 Chilled Drinks", "Sector 5-A/2"
 */
const ATOMIC_SEGMENT_REGEX =
  /(\([^)]+\)|Rs\.\s?[\d,]+|\d+(?:\.\d+)?\s?(?:Litre|Litres|L|ml|kg|g|Pcs|Pc|km|mins|min|PM|AM)|\d+\s+(?:Small|Medium|Large|Chilled|Chicken|Seekh|garlic)\s+(?:Pizza|Pizzas|Drink|Drinks|Tikka|Kababs|naans)|Sector\s+[\w/-]+)/gi;

export function AtomicText({ text }: { text: string }) {
  const normalized = text.replace(/\u00A0/g, ' ');
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of normalized.matchAll(ATOMIC_SEGMENT_REGEX)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) {
      parts.push(normalized.slice(lastIndex, idx));
    }
    parts.push(
      <span key={`${idx}-${match[0]}`} className="whitespace-nowrap">
        {match[0]}
      </span>
    );
    lastIndex = idx + match[0].length;
  }

  if (lastIndex < normalized.length) {
    parts.push(normalized.slice(lastIndex));
  }

  return <>{parts}</>;
}
