import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import './globals.css';
import { ClientsProvider } from '@/context/ClientsContext';
import { AppShell } from '@/components/layout/AppShell';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Toaster } from '@/components/ui/sonner';

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  title: 'זאפ CRM | מערכת אונבורדינג',
  description: 'מערכת ניהול לקוחות לצוות הפרודקשן של זאפ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable}>
      <body>
        <DemoModeBanner />
        <ClientsProvider>
          <AppShell>{children}</AppShell>
        </ClientsProvider>
        <Toaster position="bottom-center" richColors dir="rtl" />
      </body>
    </html>
  );
}
