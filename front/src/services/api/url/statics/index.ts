import { axiosInstance } from "../../axios";

export class StatisticsAPI {
    url = (stock: string) => `/${stock}/sumo`;

    get(ticket: string) {
        return axiosInstance.get(this.url(ticket));
    }
}