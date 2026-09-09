import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ORCA — Marine Intelligence',
  description: 'AI-powered marine intelligence for safer operations, healthier ecosystems and better decisions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: '#07141D', color: '#F5FAFC' }}>
        {children}
      </body>
    </html>
  );
}
