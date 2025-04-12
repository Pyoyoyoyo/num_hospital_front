'use client';

import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Inter } from 'next/font/google';
import NextAppDirEmotionCacheProvider from '@/components/EmotionCache';
import { SnackbarProvider } from 'notistack';
// import ThemeRegistry from '@/components/ThemeRegistry';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAppDirEmotionCacheProvider options={{ key: 'emotion' }}>
          <SnackbarProvider maxSnack={3}>
            {/* <ThemeRegistry> */}
              <AuthProvider>
                {children}
              </AuthProvider>
            {/* </ThemeRegistry> */}
          </SnackbarProvider>
        </NextAppDirEmotionCacheProvider>
      </body>
    </html>
  );
}
