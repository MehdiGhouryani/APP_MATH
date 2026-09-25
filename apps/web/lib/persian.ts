/**
 * Persian localization and formatting utilities for Math Learning Platform
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\d/g, (match) => PERSIAN_DIGITS[Number(match)] ?? match);
}

export interface GradeMeta {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  active: boolean;
  stationCount: number;
  description: string;
  color: string;
}

export const GRADES: GradeMeta[] = [
  {
    id: 'G1',
    code: 'grade-1',
    title: 'پایه اول ابتدایی',
    subtitle: 'شمارش، الگوها، جمع و تفریق تا ۲۰',
    active: true,
    stationCount: 25,
    description: '۲۵ ایستگاه آموزشی، ۶۴ مهارت پایه‌ای با همراهی ۴ شخصیت تعاملی',
    color: '#3B82F6',
  },
  {
    id: 'G2',
    code: 'grade-2',
    title: 'پایه دوم ابتدایی',
    subtitle: 'اعداد سه‌رقمی، جمع و تفریق فرآیندی',
    active: false,
    stationCount: 28,
    description: 'در حال آماده‌سازی معماری و محتوای آموزشی',
    color: '#10B981',
  },
  {
    id: 'G3',
    code: 'grade-3',
    title: 'پایه سوم ابتدایی',
    subtitle: 'جدول ضرب، تقسیم، کسر و محیط',
    active: false,
    stationCount: 30,
    description: 'در حال آماده‌سازی معماری و محتوای آموزشی',
    color: '#F59E0B',
  },
  {
    id: 'G4',
    code: 'grade-4',
    title: 'پایه چهارم ابتدایی',
    subtitle: 'اعداد بزرگ، ضرب چندرقمی، زاویه و مساحت',
    active: false,
    stationCount: 32,
    description: 'در حال آماده‌سازی معماری و محتوای آموزشی',
    color: '#8B5CF6',
  },
  {
    id: 'G5',
    code: 'grade-5',
    title: 'پایه پنجم ابتدایی',
    subtitle: 'عملیات کسرها، اعداد اعشاری، تقارن و حجم',
    active: false,
    stationCount: 32,
    description: 'در حال آماده‌سازی معماری و محتوای آموزشی',
    color: '#EC4899',
  },
  {
    id: 'G6',
    code: 'grade-6',
    title: 'پایه ششم ابتدایی',
    subtitle: 'کسر، اعشار، نسبت و تناسب، درصد و آمار',
    active: false,
    stationCount: 34,
    description: 'در حال آماده‌سازی معماری و محتوای آموزشی',
    color: '#06B6D4',
  },
];

export interface CompanionCharacter {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarBg: string;
  themeColor: string;
  personality: string;
  reactions: {
    idle: string;
    correct: string;
    wrong: string;
    hint: string;
    recovery: string;
    pass: string;
  };
}

export const CHARACTERS: Record<string, CompanionCharacter> = {
  aria: {
    id: 'aria',
    name: 'آریا',
    role: 'راهنمای اصلی و دوست صمیمی',
    description: 'اژدهای کوچک و کنجکاو آبی‌رنگ که گام‌به‌گام در مسیر ریاضی کنار کودک است.',
    avatarBg: '#EFF6FF',
    themeColor: '#3B82F6',
    personality: 'پرانرژی، حامی و مهربان',
    reactions: {
      idle: 'آماده‌ای با هم یه قدم جدید برداریم؟',
      correct: 'آفرین قهرمان! دقیقاً درست بود!',
      wrong: 'اصلاً اشکالی نداره، با هم دوباره نگاه می‌کنیم!',
      hint: 'بیا به شکل‌ها خوب دقت کنیم؛ سرنخ اینجاست...',
      recovery: 'خیلی خوب داری تلاش می‌کنی، من کنارتم!',
      pass: 'هورااا! ایستگاه رو با موفقیت فتح کردی!',
    },
  },
  qbo: {
    id: 'qbo',
    name: 'کیوبو',
    role: 'دستیار هوشمند حل مسئله',
    description: 'ربات مکعبی دوست‌داشتنی با صفحه‌نمایش جذاب که مسئله‌ها را ساده می‌کند.',
    avatarBg: '#F0FDF4',
    themeColor: '#10B981',
    personality: 'دقیق، متفکر و آرامش‌بخش',
    reactions: {
      idle: 'پردازش داده‌ها آماده است. بزن بریم!',
      correct: 'محاسبه عالی! سیستم تایید کرد!',
      wrong: 'داده‌ها نیاز به بررسی دارن، دوباره امتحان کن!',
      hint: 'الگوریتم حل: اول دسته‌ها رو بشمار.',
      recovery: 'گام‌های کوچک را مرحله به مرحله طی می‌کنیم.',
      pass: 'عملیات با ۱۰۰٪ موفقیت به اتمام رسید!',
    },
  },
  jiko: {
    id: 'jiko',
    name: 'جیکو',
    role: 'همراه شاد و جشن پیروزی',
    description: 'پرنده کوچک و باهوش با بال‌های رنگین‌کمانی که شادی را به یادگیری می‌آورد.',
    avatarBg: '#FEF3C7',
    themeColor: '#F59E0B',
    personality: 'شاداب، شوخ‌طبع و پر از انگیزه',
    reactions: {
      idle: 'جیک جیک! پرواز به سوی ریاضی!',
      correct: 'وای محشر بود! ستاره گرفتی!',
      wrong: 'اشکال نداره دوست من، بال‌هاتو تکون بده!',
      hint: 'یه نگاه به رنگ‌ها بنداز، ببین چی تکرار شده!',
      recovery: 'تو قوی‌ترین ریاضی‌دان دنیایی!',
      pass: 'جشن و پایکوبی! آفرین به پشتکارت!',
    },
  },
  dana: {
    id: 'dana',
    name: 'دانا',
    role: 'کاشف طبیعت و الگوها',
    description: 'سنجاب خردمند جنگل که شیفته الگوهای هندسی و شمارش بلوط‌هاست.',
    avatarBg: '#FDF2F8',
    themeColor: '#EC4899',
    personality: 'صبور، کاشف و جزئی‌نگر',
    reactions: {
      idle: 'طبیعت پر از الگوهای ریاضیه؛ کشفشون کنیم!',
      correct: 'الگوی طلایی رو پیدا کردی! عالیه!',
      wrong: 'بیا برگ‌ها رو دوباره مرتب کنیم.',
      hint: 'به فاصله‌ها دقت کن؛ هر چند تا تکرار میشه؟',
      recovery: 'آرامش، صبوری و کشف دوباره راه حل.',
      pass: 'نشان طلایی کاشف ریاضی به تو تعلق گرفت!',
    },
  },
};

export interface StationSummary {
  id: string;
  code: string;
  title: string;
  badgeTitle: string;
  stepCount: number;
  skillsCount: number;
  status: 'UNLOCKED' | 'LOCKED' | 'COMPLETED';
  progressPercent: number;
  encounters: Array<{
    id: string;
    step: number;
    title: string;
    subtitle: string;
    type: 'LEARN' | 'GUIDED' | 'PRACTICE' | 'CHECK_1' | 'CHECK_2' | 'RECOVERY' | 'PASS';
    status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';
  }>;
}

export const GRADE_1_STATIONS: StationSummary[] = [
  {
    id: 'G1-ST01',
    code: 'ST01',
    title: 'شمارش و الگوهای ساده (۰ تا ۱۰)',
    badgeTitle: 'ایستگاه ۰۱',
    stepCount: 6,
    skillsCount: 3,
    status: 'UNLOCKED',
    progressPercent: 40,
    encounters: [
      { id: 'e01', step: 1, title: 'یادگیری تعاملی (Learn)', subtitle: 'دیدن و درک اشیاء، دسته‌ها و نمادها', type: 'LEARN', status: 'COMPLETED' },
      { id: 'e02', step: 2, title: 'تمرین هدایت‌شده (Guided)', subtitle: 'حل مسئله با سرنخ و راهنمایی فعال', type: 'GUIDED', status: 'COMPLETED' },
      { id: 'e03', step: 3, title: 'تمرین مستقل (Practice)', subtitle: 'حل تمرین به تنهایی و تثبیت درک', type: 'PRACTICE', status: 'IN_PROGRESS' },
      { id: 'e04', step: 4, title: 'سنجش مستقل ۱ (Check 1)', subtitle: 'اثبات درک بدون دخالت و سرنخ', type: 'CHECK_1', status: 'LOCKED' },
      { id: 'e05', step: 5, title: 'سنجش مستقل ۲ (Check 2)', subtitle: 'تثبیت و اعتبارسنجی مستقل دوم', type: 'CHECK_2', status: 'LOCKED' },
      { id: 'e06', step: 6, title: 'پایان موفقیت‌آمیز (Pass)', subtitle: 'جشن عبور از ایستگاه و پاداش', type: 'PASS', status: 'LOCKED' },
    ],
  },
  {
    id: 'G1-ST02',
    code: 'ST02',
    title: 'شمارش و تناظر یک‌به‌یک (تا ۱۰)',
    badgeTitle: 'ایستگاه ۰۲',
    stepCount: 6,
    skillsCount: 3,
    status: 'LOCKED',
    progressPercent: 0,
    encounters: [],
  },
  {
    id: 'G1-ST03',
    code: 'ST03',
    title: 'مقایسه دسته‌ها (بیشتر، کمتر، مساوی)',
    badgeTitle: 'ایستگاه ۰۳',
    stepCount: 6,
    skillsCount: 2,
    status: 'LOCKED',
    progressPercent: 0,
    encounters: [],
  },
  {
    id: 'G1-ST04',
    code: 'ST04',
    title: 'شکل‌های هندسی پایه و تقارن',
    badgeTitle: 'ایستگاه ۰۴',
    stepCount: 6,
    skillsCount: 2,
    status: 'LOCKED',
    progressPercent: 0,
    encounters: [],
  },
  {
    id: 'G1-ST05',
    code: 'ST05',
    title: 'مفهوم جمع و ترکیب دسته‌ها (تا ۵)',
    badgeTitle: 'ایستگاه ۰۵',
    stepCount: 6,
    skillsCount: 3,
    status: 'LOCKED',
    progressPercent: 0,
    encounters: [],
  },
];
