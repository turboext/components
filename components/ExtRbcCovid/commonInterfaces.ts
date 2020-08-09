interface ICovidStats {
    perDay: number;
    total: number;
}
type CovidType = 'recovered' | 'infected' | 'died';
type CovidContent = Record<CovidType, ICovidStats>;

export interface ICovidInfo {
    [key: string]: CovidContent;
}
