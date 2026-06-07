import type { Metadata } from "next";
import { Providers } from "./providers";
import "../styles/index.css";

export const metadata: Metadata = {
  title: "HoshiDex",
  description:
    "A modern Pokémon encyclopedia with forms, stats, generations, maintenance tools, and interactive media showcases.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
