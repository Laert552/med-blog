import type { Metadata } from "next";
import "./globals.css";
import { ru } from '@/lib/i18n/ru'

export const metadata: Metadata = {
  title: ru.metadata.title,
  description: ru.metadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
