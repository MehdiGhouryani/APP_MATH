# استفاده از سورس نمونه

`prototype-src` سورس React همین پیش‌نمایش آزموده است، نه patch پروژهٔ Next/Expo اولیه. `avatar-core.mjs` و `character-art.mjs` مستقل‌اند؛ App.jsx از کنترل‌های shadcn و alias `@kits/shadcn` استفاده می‌کند.

نمونهٔ کامپوننت‌های لازم در `kits/shadcn` همراه شده است. برای انتقال به پروژهٔ خود، import alias را به `kits/shadcn/Kit.jsx` نگاشت کنید، React/ReactDOM، radix-ui، lucide-react، class-variance-authority، clsx و tailwind-merge را فراهم کنید و classهای Tailwind3 را در کامپوننت‌ها build کنید. توکن‌های رنگ در style.css مرجع‌اند. دستور build استاندارد تازه یا lockfile جدید به‌صورت آزموده تحویل نشده؛ source و alias باید در toolchain تیم یکپارچه شوند.

برای دیدن بدون build، نسخهٔ منتشرشده در ClickUp را ببینید (`prototype/index.html` در 2.0.5 حذف شد). می‌توان با static server محلی بازش کرد؛ مثلاً از پوشهٔ prototype دستور `python -m http.server 8080` و سپس localhost:8080. فونت خارجی اختیاری است؛ هیچ auth/API/payment واقعی ندارد.

تست‌ها در `qa/prototype-tests` هستند. در محیط artifact این ۱۱ سناریو Playwright پاس شده‌اند؛ خود تست‌ها import نسبی `../src` دارند، پس برای اجرای مستقل آنها را کنار prototype-src با نام `src` قرار دهید یا مسیرها را متناسب با پروژه تغییر دهید. این تست‌ها testهای اپ اولیه را اجرا نمی‌کنند.

قبل از استفادهٔ تولیدی، license/NOTICEهای dependency و UI toolkit را از ناشر رسمی بررسی کنید. طرح شخصیت‌های جدید SVG اختصاصی این تحویل است، اما بررسی تعارض حقوقی/برند هنوز انجام نشده.
