import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { render } from "@testing-library/react";
import { expect, it } from "vitest";

import HomePage from "@/app/page";

const stylesheet = readFileSync(
  resolve(process.cwd(), "app/page.module.css"),
  "utf8",
);

const customerCaseFilenames = [
  "customer-case-01.png",
  "customer-case-02.png",
  "customer-case-03.jpg",
  "customer-case-04.png",
  "customer-case-05.jpg",
  "customer-case-06.jpg",
  "customer-case-07.png",
  "customer-case-08.png",
  "customer-case-09.png",
  "customer-case-10.png",
  "customer-case-11.jpg",
  "customer-case-12.jpg",
  "customer-case-13.png",
  "customer-case-14.png",
  "customer-case-15.png",
] as const;

function ruleFor(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = stylesheet.match(new RegExp(`${escapedSelector} \\{([^}]*)\\}`));
  return match?.[1] ?? "";
}

it("受講生の声は顧客事例画像を2本のマーキーで表示する", () => {
  const { container } = render(<HomePage />);
  const reviews = container.querySelector("#reviews");

  expect(reviews).not.toBeNull();
  expect(reviews).toHaveTextContent("IgnAIteを受講したお客様の声");
  expect(reviews).not.toHaveTextContent("受講生から届いた声");
  expect(reviews).not.toHaveTextContent("累計口コミ数");
  expect(reviews).not.toHaveTextContent("3万件");
  const tracks = reviews!.querySelectorAll("[data-direction]");
  expect(tracks).toHaveLength(2);
  expect(tracks[0]).toHaveAttribute(
    "data-direction",
    "forward",
  );
  expect(tracks[1]).toHaveAttribute(
    "data-direction",
    "reverse",
  );

  const cards = reviews!.querySelectorAll("[data-customer-case-card='true']");
  expect(cards).toHaveLength(customerCaseFilenames.length * 2 * 2);
  const imageSources = Array.from(cards).map((card) =>
    decodeURIComponent(card.querySelector("img")?.getAttribute("src") ?? ""),
  );

  customerCaseFilenames.forEach((filename) => {
    expect(imageSources.some((src) => src.includes(filename))).toBe(true);
  });
  expect(reviews).not.toHaveTextContent("@AI learner");
});

it("顧客事例画像はpublic配下にあり、カード内に収まる指定を持つ", () => {
  customerCaseFilenames.forEach((filename) => {
    expect(
      existsSync(
        join(process.cwd(), "public/assets/images/customer-cases", filename),
      ),
    ).toBe(true);
  });

  expect(ruleFor(".customerCaseCard")).toContain("overflow: hidden");
  expect(
    ruleFor(".customerCaseCard :is(img, [data-safe-image])"),
  ).toContain("object-fit: contain");
  expect(
    ruleFor(".customerCaseCard :is(img, [data-safe-image])"),
  ).toContain("max-width: 100%");
});
