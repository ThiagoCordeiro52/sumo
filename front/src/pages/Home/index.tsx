import CheckIcon from "@mui/icons-material/Check";

export function Home() {
  return (
    <div className="bg-zinc-900 text-white text-center h-screen w-screen  flex justify-center items-center flex-col">
      <h1 className="mb-6">
        Desvende o potencial das ações - seu próximo grande investimento pode
        estar a um código de distância!
      </h1>
      <h2 className="mb-6">
        Descubra se é hora de investir - insira o código da ação:
      </h2>
      <form className="flex justify-center align-middle space-x-2">
        <input
          className="bg-zinc-800 text-zinc-400 p-2 rounded-lg mr outline-none focus:outline-none"
          type="text"
          placeholder="MGLU3, PETR4, CPLE6..."
        ></input>

        <button className="bg-green-600 hover:bg-green-500 p-2 rounded-lg">
          <CheckIcon /> Confirmar
        </button>
      </form>
    </div>
  );
}
