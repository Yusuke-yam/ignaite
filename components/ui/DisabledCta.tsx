import type { ReactNode } from "react";

type DisabledCtaProps = {
  children: ReactNode;
  className?: string;
};

export function DisabledCta({
  children,
  className = "",
}: DisabledCtaProps) {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      className={className}
    >
      {children}
    </button>
  );
}
