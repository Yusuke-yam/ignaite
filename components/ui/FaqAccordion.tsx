"use client";

import { useId, useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: readonly FaqItem[];
  initialOpenIndex?: number | null;
  className?: string;
};

export function FaqAccordion({
  items,
  initialOpenIndex = null,
  className = "",
}: FaqAccordionProps) {
  const rootId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(initialOpenIndex);

  return (
    <div className={className}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${rootId}-panel-${index}`;

        return (
          <article key={panelId}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              {item.question}
            </button>
            <div id={panelId} hidden={!isOpen}>
              {item.answer}
            </div>
          </article>
        );
      })}
    </div>
  );
}
