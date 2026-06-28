import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";

import { ProblemsSection } from "@/components/sections/ProblemsSection";

const NEW_PROBLEMS = [
  "毎日同じ日々が繰り返され人生がつまらない",
  "自分が今後何をしたいのか分からない",
  "生き方の正解や成功方法を、他人・SNS・本に探してしまう",
  "「いつか何かできたらいいな」と思いながら、何も変わっていない",
  "自己啓発本は好きでよく読むが、現実は何も変わっていない",
  "副業や個人事業に憧れるが、「どうせ自分には無理」と思い込んでいる",
] as const;

const stylesheet = readFileSync(
  resolve(process.cwd(), "app/page.module.css"),
  "utf8",
);

function ruleFor(selector: string, occurrence: "first" | "last" = "first") {
  const start = occurrence === "first"
    ? stylesheet.indexOf(`${selector} {`)
    : stylesheet.lastIndexOf(`${selector} {`);
  expect(start).toBeGreaterThanOrEqual(0);
  const end = stylesheet.indexOf("}", start);
  return stylesheet.slice(start, end + 1);
}

it("見出しと6つの悩みを指定順で表示し旧コピーを削除する", () => {
  render(<ProblemsSection />);

  expect(
    screen.getByRole("heading", { level: 2, name: "こんなお悩みありませんか？" }),
  ).toBeVisible();
  expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual(
    NEW_PROBLEMS,
  );
  expect(screen.queryByText(/AIに興味はあるけど/)).not.toBeInTheDocument();
  expect(screen.queryByText(/ChatGPT触っただけで/)).not.toBeInTheDocument();
  expect(screen.queryByText(/収入に直結するスキル/)).not.toBeInTheDocument();
  expect(screen.queryByText(/生成AIが、あなたの武器/)).not.toBeInTheDocument();
});

it("人物をDOM上で先に置き左右3件ずつの意味的グループを持つ", () => {
  const { container } = render(<ProblemsSection />);
  const stage = container.querySelector('[data-problem-stage="true"]');
  const person = container.querySelector('[data-problem-person="true"]');
  const left = container.querySelector('[data-problem-side="left"]');
  const right = container.querySelector('[data-problem-side="right"]');

  expect(stage).not.toBeNull();
  expect(person).not.toBeNull();
  expect(stage?.firstElementChild).toBe(person);
  expect(within(left as HTMLElement).getAllByRole("listitem")).toHaveLength(3);
  expect(within(right as HTMLElement).getAllByRole("listitem")).toHaveLength(3);
  expect(screen.getByRole("img", { name: "悩みを抱える人" })).toBeVisible();
});

it("Desktopの中央人物・左右吹き出しと約30%上寄せをCSSで定義する", () => {
  expect(ruleFor(".problems")).toContain("padding: 60px 24px 96px");
  expect(ruleFor(".problemHeading")).toContain("text-align: center");
  expect(ruleFor(".problemStage")).toContain('grid-template-areas: "left person right"');
  expect(ruleFor(".problemPerson")).toContain("grid-area: person");
  expect(ruleFor(".problemBubblesLeft")).toContain("grid-area: left");
  expect(ruleFor(".problemBubblesRight")).toContain("grid-area: right");
  expect(ruleFor(".problemBubblesLeft .problemBubble::before")).toContain(
    "border-left-color: rgba(2, 39, 105, 0.18)",
  );
  expect(ruleFor(".problemBubblesLeft .problemBubble::before")).toContain(
    "right: -22px",
  );
  expect(ruleFor(".problemBubblesLeft .problemBubble::after")).toContain(
    "border-left-color: #FFFFFF",
  );
  expect(ruleFor(".problemBubblesLeft .problemBubble::after")).toContain(
    "right: -18px",
  );
  expect(ruleFor(".problemBubblesRight .problemBubble::before")).toContain(
    "border-right-color: rgba(2, 39, 105, 0.18)",
  );
  expect(ruleFor(".problemBubblesRight .problemBubble::before")).toContain(
    "left: -22px",
  );
  expect(ruleFor(".problemBubblesRight .problemBubble::after", "last")).toContain(
    "border-right-color: #FFFFFF",
  );
  expect(ruleFor(".problemBubblesRight .problemBubble::after", "last")).toContain(
    "left: -18px",
  );
  expect(ruleFor(".problemBubble")).toContain(
    'font-family: "Noto Sans CJK JP", "Noto Sans JP", sans-serif',
  );
  expect(ruleFor(".problemBubble")).toContain("font-size: 18px");
  expect(ruleFor(".problemBubble")).toContain("font-weight: 700");
  expect(ruleFor(".problemBubble")).toContain("height: auto");
  expect(ruleFor(".problemBubble")).toContain("min-height: auto");
  expect(ruleFor(".problemBubble:hover")).toContain("background: var(--gradient-gold)");
  expect(ruleFor(".problemBubble:hover")).toContain("border-color: #E7A200");
  expect(ruleFor(".problemBubble:hover")).toContain("box-shadow:");
  expect(ruleFor(".problemBubble:hover")).toContain("transform: translateY(-4px)");
  expect(ruleFor(".problemBubblesLeft .problemBubble:hover::after")).toContain(
    "border-left-color: #FEE21C",
  );
  expect(ruleFor(".problemBubblesRight .problemBubble:hover::after")).toContain(
    "border-right-color: #FEE21C",
  );
  expect(stylesheet).not.toContain(".problemConclusion");
});

it("Mobileを人物先頭の1列にし吹き出し先端を非表示にする", () => {
  expect(stylesheet).toMatch(
    /@media \(max-width: 809\.98px\)[\s\S]*?\.problems \{[^}]*padding: 48px 16px 82px/,
  );
  expect(stylesheet).toMatch(
    /@media \(max-width: 809\.98px\)[\s\S]*?\.problemStage \{[^}]*display: flex;[^}]*flex-direction: column/,
  );
  expect(stylesheet).toMatch(
    /@media \(max-width: 809\.98px\)[\s\S]*?\.problemPerson \{[^}]*margin: 0 auto/,
  );
  expect(stylesheet).toMatch(
    /@media \(max-width: 809\.98px\)[\s\S]*?\.problemBubble::before[^}]*display: none/,
  );
});
