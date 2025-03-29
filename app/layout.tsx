"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider as NextThemesProvider } from "next-themes";

const inter = Inter({ subsets: ['latin'] });

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </NextThemesProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <title>CultureStream - Das Fenster zur Welt</title>
        <meta name="description" content="Verbinden Sie sich mit Menschen weltweit durch innovative Live-Stream-Portale." />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
