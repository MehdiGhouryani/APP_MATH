import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Math Learning Product',
  description: 'Primary-school personal math learning platform',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
