import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { DisabledCta } from "@/components/ui/DisabledCta";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Marquee } from "@/components/ui/Marquee";

it("CTAをリンクにせず無効状態で表示する", () => {
  render(<DisabledCta>無料説明会に参加する</DisabledCta>);

  const cta = screen.getByRole("button", {
    name: "無料説明会に参加する",
  });

  expect(cta).toHaveAttribute("aria-disabled", "true");
  expect(cta).toBeDisabled();
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});

it("FAQのARIA状態と回答表示を同期する", () => {
  render(<FaqAccordion items={[{ question: "質問", answer: "回答" }]} />);

  const trigger = screen.getByRole("button", { name: "質問" });
  const answer = screen.getByText("回答");

  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(trigger).toHaveAttribute("aria-controls", answer.id);
  expect(answer).toHaveAttribute("hidden");

  fireEvent.click(trigger);

  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(answer).not.toHaveAttribute("hidden");
  expect(answer).toBeVisible();

  fireEvent.click(trigger);

  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(answer).toHaveAttribute("hidden");
});

it("マルキーは元コンテンツを読み上げ対象にし複製だけを隠す", () => {
  const { container } = render(
    <Marquee>
      <p>受講生の口コミ</p>
    </Marquee>,
  );

  expect(container.firstElementChild).not.toHaveAttribute("aria-hidden");
  expect(screen.getAllByText("受講生の口コミ")).toHaveLength(2);
  expect(
    container.querySelectorAll('[aria-hidden="true"]'),
  ).toHaveLength(1);
});
