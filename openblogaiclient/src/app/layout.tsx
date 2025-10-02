// Clean layout using new SimpleSidebar component

import { SessionProvider } from 'next-auth/react';
import SessionUpdater from '@/components/SessionUpdater';
import './globals.css';
import Layout from '@/components/Layout';

export const metadata: import('next').Metadata = {
  title: "OpenBlogAI",
  description: "Transform YouTube videos into engaging blog posts with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="modern" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <SessionProvider>
          <SessionUpdater />
          <Layout>{children}</Layout>
        </SessionProvider>
      </body>
    </html>
  );
}