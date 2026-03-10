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
        url: '/logo.svg', // Will be enhanced by opengraph-image if needed
        width: 1200,
        height: 630,
        alt: 'LeadFlow CRM Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LeadFlow CRM',
    description: 'Lead Management Dashboard for sales teams',
    creator: '@LeadFlow',
    images: ['/logo.svg'],
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
