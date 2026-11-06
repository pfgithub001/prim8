import type { Metadata } from "next";
import { siteDescription, siteName } from "@/constants/site";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: { default: siteName, template: `%s · ${siteName}` },
  description: siteDescription,
  icons: { icon: "/assets/icon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
