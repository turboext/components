function toDoubleDigits(num: number): string {
    return num >= 10 ? num.toString() : `0${num}`;
}

export function getYesterday(): Date {
    const today = new Date();
    today.setDate(today.getDate() - 1);

    return today;
}

export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = toDoubleDigits(date.getMonth());
    const day = toDoubleDigits(date.getDate());

    return `${year}-${month}-${day}`;
}
