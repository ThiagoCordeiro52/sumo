import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Skeleton, Tooltip } from "@mui/material";
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
            className="bg-zinc-600 p-3 rounded-lg outline-none focus:outline-none w-full placeholder-slate-400"
            type="text"
            required
            placeholder="MGLU3, PETR4, CPLE6..."
            disabled={isLoading}
          />
        </div>

        <div className="rounded-lg w-40 h-full">
          <Button
            variant="contained"
            color="success"
            className="h-full w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <CircularProgress color="success" />}
            {!isLoading && (
              <span className="flex items-center">
                <CheckIcon /> <span>Confirmar</span>
              </span>
            )}
          </Button>
        </div>
      </form>
    );
  };

  const statisticsTable = () => {
    return (
      <div className="w-[90%]">
        <table className="text-white table-auto border-4 border-collapse border-slate-600">
          <thead className="text-gray-300">
            <tr>
              <th className="border-2 border-slate-500 p-3" colSpan={7}>
                <span> Indicador </span>
              </th>
              <th className="border-2 border-slate-500 p-3" colSpan={6}>
                Análises
              </th>
            </tr>
            <tr>
              <th className="border-2 border-slate-500 p-2">
                <Tooltip title="Cotação atual da ação">
                  <span>Valor atual</span>
                </Tooltip>
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Tooltip title="Valor total da empresa">
                  <span>Valor da empresa</span>
                </Tooltip>
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Tooltip title="Lucro por ação">
                  <span>LPA</span>
                </Tooltip>
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Tooltip title="Beta da ação: Indice de verificação da variação do preço esperada pelo mercado">
                  <span>Beta</span>
                </Tooltip>
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Tooltip title="Preço sobre vendas">
                  <span>PSR</span>
                </Tooltip>
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Tooltip title="Dividend Yield: Percentual de retorno do dividendo">
                  <span>DY</span>
                </Tooltip>
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Tooltip title="Preço sobre lucro">
                  <span>P/L</span>
                </Tooltip>
              </th>
              <th className="border-2 border-slate-500 p-2">Bazin</th>
              <th className="border-2 border-slate-500 p-2">Graham</th>
              <th className="border-2 border-slate-500 p-2">Graham revisado</th>
              <th className="border-2 border-slate-500 p-2">Número de Lynch</th>
              <th className="border-2 border-slate-500 p-2">
                Resultado de Lynch
              </th>
              <th className="border-2 border-slate-500 p-2">Resultado SUMO</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-2">${stock?.statistics.actual_value}</td>
              <td className="p-2">${stock?.statistics.enterprise_value}</td>
              <td className="p-2">${stock?.statistics.eps}</td>
              <td className="p-2">{stock?.statistics.beta5}</td>
              <td className="p-2">${stock?.statistics.price_sales}</td>
              <td className="p-2">{stock?.statistics.ta_dividend_yield}</td>
              <td className="p-2">{stock?.statistics.trailing_pe}</td>
              <td className="p-2">${stock?.bazin.toFixed(2)}</td>
              <td className="p-2">${stock?.graham.toFixed(2)}</td>
              <td className="p-2">${stock?.graham_revised.toFixed(2)}</td>
              <td className="p-2">{stock?.lynch_number.toFixed(2)}</td>
              <td className="p-2">{stock?.lynch_result}</td>
              <td className="p-2">{stock?.sumo_result}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderSkeletonsTable = () => {
    return (
      <div className="w-[90%]">
        <table className="text-white table-auto border-4 border-collapse border-slate-600">
          <thead className="text-gray-300 border-slate-600">
            <tr>
              <th className="border-2 border-slate-500 p-3" colSpan={7}>
                <Skeleton variant="rounded" width="100%" />
              </th>
              <th className="border-2 border-slate-500 p-3" colSpan={6}>
                <Skeleton variant="rounded" width="100%" />
              </th>
            </tr>
            <tr>
              <th className="border-2 border-slate-500 p-2">
                <Skeleton variant="rounded" width="80px" />
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Skeleton variant="rounded" width="80px" />
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Skeleton variant="rounded" width="80px" />
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Skeleton variant="rounded" width="80px" />
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Skeleton variant="rounded" width="80px" />
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Skeleton variant="rounded" width="80px" />
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Skeleton variant="rounded" width="80px" />
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Skeleton variant="rounded" width="80px" />
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Skeleton variant="rounded" width="80px" />
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Skeleton variant="rounded" width="80px" />
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Skeleton variant="rounded" width="80px" />
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Skeleton variant="rounded" width="80px" />
              </th>
              <th className="border-2 border-slate-500 p-2">
                <Skeleton variant="rounded" width="80px" />
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-2">
                <Skeleton variant="rounded" width="100%" />
              </td>
              <td className="p-2">
                <Skeleton variant="rounded" width="100%" />
              </td>
              <td className="p-2">
                <Skeleton variant="rounded" width="100%" />
              </td>
              <td className="p-2">
                <Skeleton variant="rounded" width="100%" />
              </td>
              <td className="p-2">
                <Skeleton variant="rounded" width="100%" />
              </td>
              <td className="p-2">
                <Skeleton variant="rounded" width="100%" />
              </td>
              <td className="p-2">
                <Skeleton variant="rounded" width="100%" />
              </td>
              <td className="p-2">
                <Skeleton variant="rounded" width="100%" />
              </td>
              <td className="p-2">
                <Skeleton variant="rounded" width="100%" />
              </td>
              <td className="p-2">
                <Skeleton variant="rounded" width="100%" />
              </td>
              <td className="p-2">
                <Skeleton variant="rounded" width="100%" />
              </td>
              <td className="p-2">
                <Skeleton variant="rounded" width="100%" />
              </td>
              <td className="p-2">
                <Skeleton variant="rounded" width="100%" />
              </td>
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
    <div className="bg-neutral-700 text-white text-center h-screen w-screen  flex justify-center items-center flex-col">
      <img src={Logo} width={"20%"} />
      <Header />
      {searchStock()}
      <span className="text-lg mt-6 mb-3 font-semibold font-mono">
        {stock?.statistics.name}
      </span>
      {isLoading && renderSkeletonsTable()}
      {!isLoading && stock && statisticsTable()}
    </div>
  );
}
