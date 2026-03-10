import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui';

export const metadata: Metadata = {
  title: 'LeadFlow CRM – Lead Management Platform',
  description: 'Custom CRM and Lead Management Dashboard for sales teams',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://leadflow-crm.vercel.app'),
  openGraph: {
    title: 'LeadFlow CRM – Lead Management Platform',
    description: 'Custom CRM and Lead Management Dashboard for sales teams',
    url: '/',
    siteName: 'LeadFlow',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1440,
        height: 900,
        alt: 'LeadFlow CRM Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LeadFlow CRM',
    description: 'Lead Management Dashboard for sales teams',
    creator: '@LeadFlow',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
