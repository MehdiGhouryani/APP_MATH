const FA = '۰۱۲۳۴۵۶۷۸۹';
const AR = '٠١٢٣٤٥٦٧٨٩';

/** Latin/Arabic-Indic digits -> Persian digits (display only). */
export function toFa(value: number | string): string {
  return String(value)
    .replace(/[0-9]/g, (d) => FA[Number(d)]!)
    .replace(/[٠-٩]/g, (d) => FA[AR.indexOf(d)]!);
}

/** Persian/Arabic-Indic -> Latin digits (for parsing user input). */
export function toEn(value: string): string {
  return value.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d))).replace(/[٠-٩]/g, (d) => String(AR.indexOf(d)));
}
