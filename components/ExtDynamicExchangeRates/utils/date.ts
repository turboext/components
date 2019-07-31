export const getOffsetFrom = (date: Date, daysOffset: number = 0): Date => {
    const result = new Date();
    result.setDate(date.getDate() - daysOffset);

    return result;
};
