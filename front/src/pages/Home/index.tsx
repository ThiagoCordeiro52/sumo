import CheckIcon from "@mui/icons-material/Check";
import { Button } from "@mui/material";

export function Home() {
  return (
    <div className="bg-zinc-800 text-white text-center h-screen w-screen  flex justify-center items-center flex-col">
      <h1 className="mb-6 text-2xl font-bold text-slate-400">
        Desvende o potencial das ações - seu próximo grande investimento pode
        estar a um código de distância!
      </h1>
      <h2 className="mb-6">
        Descubra se é hora de investir - insira o código da ação:
      </h2>
      <form className="flex justify-center items-center space-x-4">
        <div className="w-72">
          <input
            className="bg-zinc-700 p-3 rounded-lg outline-none focus:outline-none w-full placeholder-slate-400"
            type="text"
            placeholder="MGLU3, PETR4, CPLE6..."
          />
        </div>

        <div className="rounded-lg w-fit h-4/5">
          <Button
            variant="contained"
            color="success"
            className="h-full"
            type="submit"
          >
            <span className="flex items-center">
              <CheckIcon /> <span>Confirmar</span>
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
