import { toDoubleDigits } from '../../ExtExchangeRates/utils/date';

const months = {
    0: 'январь',
    1: 'февраль',
    2: 'март',
    3: 'апрель',
    4: 'май',
    5: 'июнь',
    6: 'июль',
    7: 'август',
    8: 'сентябрь',
    9: 'октябрь',
    10: 'ноябрь',
    11: 'декабрь'
};

const russianTimezones = {
    [60 * 2]: 'МСК-1',
    [60 * 3]: 'МСК',
    [60 * 4]: 'МСК+1',
    [60 * 5]: 'МСК+2',
    [60 * 6]: 'МСК+3',
    [60 * 7]: 'МСК+4',
    [60 * 8]: 'МСК+5',
    [60 * 9]: 'МСК+6',
    [60 * 10]: 'МСК+7',
    [60 * 11]: 'МСК+8',
    [60 * 12]: 'МСК+9'
};

function getTimezone(date: Date): string {
    return russianTimezones[-date.getTimezoneOffset()] || 'МСК';
}

export function formatDate(date: Date): string {
    const month = months[date.getMonth()];
    const day = toDoubleDigits(date.getDate());
    const hours = toDoubleDigits(date.getHours());
    const minutes = toDoubleDigits(date.getMinutes());
    const timezone = getTimezone(date);

    return `${day} ${month}, ${hours}:${minutes} ${timezone}`;
}
