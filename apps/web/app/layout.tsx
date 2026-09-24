import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Math Learning Product',
  description: 'Primary-school personal math learning platform with learning runtime and adult projections',
  openGraph: {
    title: 'Math Learning Product',
    description: 'Primary-school personal math learning platform with learning runtime and adult projections',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
