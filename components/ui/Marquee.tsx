import type { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  reverse?: boolean;
};

export function Marquee({
  children,
  className = "",
  trackClassName = "",
  reverse = false,
}: MarqueeProps) {
  return (
    <div className={className}>
      <div
        className={trackClassName}
        data-direction={reverse ? "reverse" : "forward"}
      >
        <div>{children}</div>
        <div aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
