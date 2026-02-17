import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/contexts/ThemeContext';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';

export const metadata: Metadata = {
  title: 'EdgeScope - Edge Traffic Intelligence Dashboard',
  description: 'Real-time edge traffic intelligence and anomaly detection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
