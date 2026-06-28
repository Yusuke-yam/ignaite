import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";

import { SafeImage } from "@/components/ui/SafeImage";
import { ASSETS } from "@/lib/assets";
import HomePage from "@/app/page";

const globalStylesheet = readFileSync(
  resolve(process.cwd(), "app/globals.css"),
  "utf8",
);

describe("LP素材", () => {
  it("キャンペーン素材名と画像内容の意味を一致させる", () => {
    expect(ASSETS.guaranteeBanner).toBe("assets/images/guarantee-visual.png");
    expect(ASSETS.campaignBanner).toBe("assets/images/campaign-visual.png");
  });

  it("フッターは透過背景の白抜きIgnAIteロゴ素材を使用する", () => {
    expect(ASSETS.footerLogo).toBe("assets/images/service-logo-footer-white.png");

    const { container } = render(createElement(HomePage));
    const footer = container.querySelector("#footer");
    const footerLogo = footer?.querySelector("img[alt='IgnAIte']");
    const renderedSrc = decodeURIComponent(footerLogo?.getAttribute("src") ?? "");

    expect(renderedSrc).toContain("service-logo-footer-white.png");
  });

  it.each(
    Object.values(ASSETS).flatMap((value) =>
      Array.isArray(value) ? value : [value],
    ),
  )("必須素材 %s がpublic配下に存在する", (assetPath) => {
    expect(existsSync(join(process.cwd(), "public", assetPath))).toBe(true);
  });

  it("ASSETSの相対パスをルート相対パスへ正規化する", () => {
    render(
      createElement(SafeImage, {
        src: ASSETS.heroPerson,
        alt: "ヒーロー人物",
        width: 640,
        height: 480,
      }),
    );

    const renderedSrc = screen
      .getByRole("img", { name: "ヒーロー人物" })
      .getAttribute("src");

    expect(screen.getByRole("img", { name: "ヒーロー人物" })).toHaveAttribute(
      "data-safe-image",
    );
    expect(renderedSrc).not.toBeNull();
    expect(new URL(renderedSrc!).searchParams.get("url")).toBe(
      "/assets/images/hero-person.png",
    );
  });

  it("About・Feature・共通CTAで専用生成素材を使用する", () => {
    const { container } = render(createElement(HomePage));
    const imageSources = Array.from(container.querySelectorAll("img")).map(
      (image) => decodeURIComponent(image.getAttribute("src") ?? ""),
    );

    expect(imageSources.some((src) => src.includes("coaching-ai-support-2.png"))).toBe(true);
    expect(imageSources.some((src) => src.includes("feature-backdrop-generated.png"))).toBe(true);
    expect(
      imageSources.filter((src) => src.includes("cta-people-generated.png")),
    ).toHaveLength(2);
    ["flow-01-generated.png", "flow-02-generated.png", "flow-03-generated.png"].forEach(
      (filename) => {
        expect(imageSources.some((src) => src.includes(filename))).toBe(true);
      },
    );
    const flowImages = Array.from(container.querySelectorAll("img")).filter((image) =>
      decodeURIComponent(image.getAttribute("src") ?? "").includes("flow-0"),
    );
    expect(flowImages).toHaveLength(3);
    flowImages.forEach((image) => expect(image).toHaveAttribute("loading", "eager"));
  });

  it("画像失敗時に同じ表示枠の代替要素へ切り替える", () => {
    render(
      createElement(SafeImage, {
        src: "/assets/images/missing.png",
        alt: "人物",
        width: 640,
        height: 480,
      }),
    );

    fireEvent.error(screen.getByRole("img", { name: "人物" }));

    expect(
      screen.getByRole("img", { name: "人物を表示できません" }),
    ).toHaveAttribute("data-safe-image");
    expect(
      screen.getByRole("img", { name: "人物を表示できません" }).style.getPropertyValue(
        "--safe-image-ratio",
      ),
    ).toBe("640 / 480");
  });

  it("画像失敗時も指定した表示寸法を維持する", () => {
    render(
      createElement(SafeImage, {
        src: "/assets/images/missing.png",
        alt: "受講生",
        width: 320,
        height: 180,
      }),
    );

    fireEvent.error(screen.getByRole("img", { name: "受講生" }));

    const fallback = screen.getByRole("img", {
      name: "受講生を表示できません",
    });

    expect(fallback.style.width).toBe("");
    expect(fallback.style.height).toBe("");
    expect(fallback.style.getPropertyValue("--safe-image-width")).toBe("320px");
    expect(fallback.style.getPropertyValue("--safe-image-ratio")).toBe("320 / 180");
    expect(globalStylesheet).toMatch(
      /\[data-safe-image-fallback\][\s\S]*?width: var\(--safe-image-width\)/,
    );
  });

  it("装飾画像の失敗表示を読み上げ対象にしない", () => {
    const { container } = render(
      createElement(SafeImage, {
        src: "/assets/images/missing-decoration.png",
        alt: "",
        width: 240,
        height: 183,
      }),
    );

    fireEvent.error(container.querySelector("img") as HTMLImageElement);

    const fallback = container.querySelector("span");
    expect(fallback).toHaveAttribute("aria-hidden", "true");
    expect(fallback).not.toHaveAttribute("aria-label");
  });
});
