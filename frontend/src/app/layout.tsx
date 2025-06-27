import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-provider";
import { ProgressBar } from "@/contexts/progress-bar-provider";
import { Toaster } from "sonner";



export const metadata: Metadata = {
  title: {
    template: "%s - Smart Inventory & Budget Manager",
    default: "Smart Inventory & Budget Manager",
  },
  description: "Smart Inventory & Budget Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProgressBar className="bg-primary h-0.5">
            {children}
          </ProgressBar>
        </ThemeProvider>
        <Toaster />
      </body>
    </html >
  );
}
