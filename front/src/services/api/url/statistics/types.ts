export interface IStatistics {
    name: string;
    actual_value: number;
    eps: number;
    price_sales: number;
    trailing_pe: number;
    enterprise_value: number;
    beta5: number;
    ta_dividend_yield: number;
    fw_dividend_yield: number;
}

export interface IStatisticsAndAnalytics {
    statistics: IStatistics;
    graham: number;
    graham_revised: number;
    lynch_number: number;
    lynch_result: string;
    sumo_result: string;
}