import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ماجراجویی ریاضی — گام‌های کوچک، یادگیری عمیق',
  description: 'پلتفرم آموزش تعاملی ریاضی دبستان بر پایه رویکرد شناختی و یادگیری اختصاصی',
  openGraph: {
    title: 'ماجراجویی ریاضی — گام‌های کوچک، یادگیری عمیق',
    description: 'پلتفرم آموزش تعاملی ریاضی دبستان بر پایه رویکرد شناختی و یادگیری اختصاصی',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
