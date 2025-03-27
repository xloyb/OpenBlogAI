import { SessionProvider } from 'next-auth/react';
import SessionUpdater from '@/components/SessionUpdater';
import './globals.css';

export const metadata = {
  title: 'My Next.js App',
  description: 'A secure Next.js application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          <SessionUpdater />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}