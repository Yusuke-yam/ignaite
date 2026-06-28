import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { width: 1280, height: 900 },
  { width: 768, height: 900 },
  { width: 390, height: 844 },
] as const;

const SECTION_IDS = [
  "hero",
  "campaign",
  "problems",
  "about",
  "reviews",
  "feature",
  "stories",
  "curriculum",
  "price",
  "flow",
  "final-cta",
  "faq",
  "footer",
] as const;

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.width}px`, () => {
    test.use({ viewport });

    test("全セクションを決定的な条件で撮影できる", async ({ page }) => {
      await page.goto("/");
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-delay: 0s !important;
            animation-duration: 0s !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-delay: 0s !important;
            transition-duration: 0s !important;
          }
        `,
      });
      await page.evaluate(async () => {
        await document.fonts.ready;
        const images = Array.from(document.images);
        images.forEach((image) => {
          image.loading = "eager";
        });
        await Promise.all(
          images.map(async (image) => {
            if (!image.complete) {
              await new Promise<void>((resolve) => {
                image.addEventListener("load", () => resolve(), { once: true });
                image.addEventListener("error", () => resolve(), { once: true });
              });
            }
            try {
              await image.decode();
            } catch {
              // 読み込み失敗はSafeImage側のフォールバック表示で検証する。
            }
          }),
        );
      });

      for (const sectionId of SECTION_IDS) {
        const section = page.locator(`#${sectionId}`);
        await expect(section).toBeVisible();
        await section.screenshot({
          animations: "disabled",
          path: `artifacts/current/${viewport.width}-${sectionId}.png`,
        });
      }
    });
  });
}
