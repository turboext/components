function formatNumber(num: number): string {
    return num.toString().replace(/\./g, ',');
}

const BILLION = 10 ** 9;
const MILLION = 10 ** 6;
const TEN_THOUSAND = 10 ** 4;
const THOUSAND = 10 ** 3;

/**
 * Функция для отображения общего числа заболевших как в rbc.
 * @param num число для форматирования данных как в rbc
 */
export function formatTotal(num: number): string {
    if (num >= BILLION) {
        return `${formatNumber(num / BILLION)} млрд`;
    } else if (num >= MILLION) {
        return `${formatNumber(num / MILLION)} млн`;
    } else if (num >= TEN_THOUSAND) {
        return `${formatNumber(num / THOUSAND)} тыс.`;
    }

    return num.toString();
}
