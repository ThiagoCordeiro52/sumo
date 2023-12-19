import { axiosInstance } from "../../axios";

export class StatisticsAPI {
    url = (stock="") => `/${stock}/sumo`;

    get<T>(ticket: string) {
        return axiosInstance.get<T>(this.url(ticket), {});
    }
}