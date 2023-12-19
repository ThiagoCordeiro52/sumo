import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "../../services/api/url";
import Header from "../../components/Header";
import { IStatisticsAndAnalytics } from "../../services/api/url/statistics/types";

import Logo from "../../assets/logo.png";

export function Home() {
  const [search, setSearch] = useState<string>("");

  const getStatisticsData = (): Promise<IStatisticsAndAnalytics> => {
    return api.statistic
      .get(search.toUpperCase())
      .then((response) => response.data as IStatisticsAndAnalytics);
  };

  const {
    data: stock,
    isLoading,
    refetch,
  } = useQuery<IStatisticsAndAnalytics>({
    queryKey: ["statistic", search],
    queryFn: getStatisticsData,
    enabled: search.trim() !== "",
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = ((event.target as HTMLFormElement)[0] as HTMLInputElement)
      .value;
    if (value !== "") {
      setSearch(value);
    }
  };

  const searchStock = () => {
    return (
      <form
        className="flex justify-center items-center space-x-4"
        onSubmit={onSubmit}
      >
        <div className="w-72">
          <input
            className="bg-zinc-700 p-3 rounded-lg outline-none focus:outline-none w-full placeholder-slate-400"
            type="text"
            required
            placeholder="MGLU3, PETR4, CPLE6..."
            disabled={isLoading}
          />
        </div>

        <div className="rounded-lg w-fit h-full">
          <Button
            variant="contained"
            color="success"
            className="h-full"
            type="submit"
            disabled={isLoading}
          >
            <span className="flex items-center">
              <CheckIcon /> <span>Confirmar</span>
            </span>
          </Button>
        </div>
      </form>
    );
  };

  const statisticsTable = () => {
    return (
      <div className="w-[90%]">
        <table className="text-white table-auto border-2 border-collapse border-slate-600">
          <thead className="text-gray-300">
            <tr>
              <th className="border border-slate-500" colSpan={7}>
                Indicador
              </th>
              <th className="border border-slate-500" colSpan={6}>
                Análises
              </th>
            </tr>
            <tr>
              <th className="border border-slate-500 p-2">Valor atual</th>
              <th className="border border-slate-500 p-2">Valor da empresa</th>
              <th className="border border-slate-500 p-2">
                LPA (Lucro por ação)
              </th>
              <th className="border border-slate-500 p-2">Beta</th>
              <th className="border border-slate-500 p-2">
                PSR (Preço sobre vendas)
              </th>
              <th className="border border-slate-500 p-2">
                DY (Dividend Yield)
              </th>
              <th className="border border-slate-500 p-2">
                P/L (Preço sobre lucro)
              </th>
              <th className="border border-slate-500 p-2">Bazin</th>
              <th className="border border-slate-500 p-2">Graham</th>
              <th className="border border-slate-500 p-2">Graham revisado</th>
              <th className="border border-slate-500 p-2">Número de Lynch</th>
              <th className="border border-slate-500 p-2">
                Resultado de Lynch
              </th>
              <th className="border border-slate-500 p-2">Resultado SUMO</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{stock?.statistics.actual_value}</td>
              <td>{stock?.statistics.enterprise_value}</td>
              <td>{stock?.statistics.eps}</td>
              <td>{stock?.statistics.beta5}</td>
              <td>{stock?.statistics.price_sales}</td>
              <td>{stock?.statistics.ta_dividend_yield}</td>
              <td>{stock?.statistics.trailing_pe}</td>
              <td>{stock?.bazin.toFixed(2)}</td>
              <td>{stock?.graham.toFixed(2)}</td>
              <td>{stock?.graham_revised.toFixed(2)}</td>
              <td>{stock?.lynch_number.toFixed(2)}</td>
              <td>{stock?.lynch_result}</td>
              <td>{stock?.sumo_result}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="bg-zinc-800 text-white text-center h-screen w-screen  flex justify-center items-center flex-col">
      <img src={Logo} width={"20%"} />
      <Header />
      {searchStock()}
      <span className="text-lg mt-6 mb-3 font-semibold font-mono">
        {stock?.statistics.name}
      </span>
      {isLoading && <CircularProgress color="success" />}
      {!isLoading && statisticsTable()}
    </div>
  );
}
