'use client';

import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Inter } from 'next/font/google';
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
        {/* <ThemeRegistry> */}
          <AuthProvider>
            {children}
          </AuthProvider>
        {/* </ThemeRegistry> */}
      </body>
    </html>
  );
}
