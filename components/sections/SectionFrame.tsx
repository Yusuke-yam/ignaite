import type { ReactNode } from "react";
import type { SectionId } from "@/content/lp-content";

type SectionFrameProps = {
  id: SectionId;
  children: ReactNode;
  className?: string;
};

export function SectionFrame({
  id,
  children,
  className = "",
}: SectionFrameProps) {
  return (
    <section id={id} data-lp-section className={className}>
      {children}
    </section>
  );
}
