import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://crm-lead-management-dashboard.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'LeadFlow CRM – Lead Management Platform',
    template: '%s | LeadFlow CRM',
  },
  description:
    'A modern, high-performance CRM platform for managing lead pipelines, team assignments, and analytics. Built with Next.js, Tailwind CSS, and Supabase.',
  applicationName: 'LeadFlow CRM',
  keywords: [
    'CRM',
    'Lead Management',
    'Sales Pipeline',
    'Dashboard',
    'Next.js',
    'Supabase',
    'Analytics',
  ],
  authors: [{ name: 'LeadFlow' }],
  creator: 'LeadFlow',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'LeadFlow CRM – Lead Management Platform',
    description:
      'A modern, high-performance CRM platform for managing lead pipelines, team assignments, and analytics. Built with Next.js, Tailwind CSS, and Supabase.',
    url: siteUrl,
    siteName: 'LeadFlow CRM',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1440,
        height: 900,
        alt: 'LeadFlow CRM – Dashboard Preview',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LeadFlow CRM – Lead Management Platform',
    description:
      'A modern CRM platform for managing lead pipelines, team assignments, and analytics.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1440,
        height: 900,
        alt: 'LeadFlow CRM – Dashboard Preview',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
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
