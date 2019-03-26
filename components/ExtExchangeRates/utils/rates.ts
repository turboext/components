interface IRawRates { base: string; rates: Record<string, number> }

export interface IRate { value: number; sign: number }
export type TRates = Record<string, IRate>;

export function selectRates(ratesList: string[], { base, rates }: IRawRates): TRates {
    const baseValue = rates[base];

    return ratesList.reduce((acc, currency) => {
        acc[currency] = { value: baseValue / rates[currency], sign: 0 };
        return acc;
    }, {});
}

export function diffRates(rate1: TRates, rate2: TRates): TRates {
    const result: TRates = {};

    Object.keys(rate1).forEach(currency => {
        if (!rate2[currency]) {
            result[currency] = rate1[currency];
            return;
        }

        result[currency] = {
            value: rate1[currency].value,
            sign: rate1[currency].value - rate2[currency].value
        };
    });

    return result;
}
