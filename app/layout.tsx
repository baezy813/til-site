import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'TIL Journal',
  description: '매일 배운 것을 기록하는, 프론트엔드 개발자의 TIL.',
  openGraph: {
    title: 'TIL Journal',
    description: '매일 배운 것을 기록하는, 프론트엔드 개발자의 TIL.',
    type: 'website',
  },
};

// 다크모드 깜빡임 방지를 위해 hydration 전에 클래스를 미리 입히는 인라인 스크립트.
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('til-site-theme');
    var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefers ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
