import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "IgnAIte(イグナイト)",
  description: "未経験からAI活用のプロを目指す実践型スクール",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        {/* JS有効時のみ初期非表示にし、描画前にクラス付与してチラつきを防ぐ */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('reveal-enabled')",
          }}
        />
        {children}
      </body>
    </html>
  );
}
