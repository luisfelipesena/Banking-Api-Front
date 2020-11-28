import { useForm } from "react-hook-form";
import React from "react";
import { ObterClientes } from "./obterClientes";
import { CriarCobranca } from "./criarCobranca";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export const Form = () => {
  const { register, handleSubmit, watch } = useForm();

  const [clientes, setClientes] = React.useState([]);
  const [cliente, setCliente] = React.useState(null);

  const token = localStorage.getItem("token");

  const descricao = watch("descricao");
  const valor = watch("valor");
  const vencimento = watch("vencimento");

  React.useEffect(() => {
    ObterClientes(token).then((r) => setClientes(r));
  }, [token]);

  return (
    <div className="formulario-cobranca">
      <form
        onSubmit={handleSubmit(async (dados) => {
          const cobranca = await CriarCobranca(
            cliente.id,
            dados.descricao,
            dados.valor,
            dados.vencimento
          );
          if (cobranca) {
            alert("Cobrança realizada com Sucesso !!");
            window.location.href = "/home";
          }
          alert("Cobrança não realizada, logue novamente");
        })}
      >
        <label>
          <span>Cliente</span>
          <Autocomplete
            className="select"
            id="clientes"
            options={clientes}
            onSelect={(ev) => setCliente(ev.target.value)}
            getOptionLabel={(option) => {
              return option.nome;
            }}
            style={{ width: "99.5%" }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" />
            )}
          />
        </label>
        <label>
          <span>Descrição</span>
          <input ref={register} name="descricao" className="descricao-input" />
          <span className="descricao-select">
            A descrição informada será impressa no boleto
          </span>
        </label>
        <div className="inputs">
          <label>
            <span>Valor</span>
            <input
              ref={register}
              name="valor"
              className="valor"
              placeholder="R$ 0,00"
              type="number"
              min="0"
              pattern="[0-9]+([,\.][0-9]+)?"
              step="any"
            />
          </label>
          <label>
            <span>Vencimento</span>
            <input
              min={new Date(+new Date() + 1000 * 60 * 60 * 24)
                .toLocaleDateString()
                .split("/")
                .reverse()
                .join("-")}
              ref={register}
              name="vencimento"
              className="vencimento"
              type="date"
            />
          </label>
        </div>
        <div className="form-botoes">
          <button
            onClick={() => {
              window.location.href = "/home";
            }}
          >
            Cancelar
          </button>
          <button
            className={
              cliente && descricao && valor && vencimento ? "completo" : ""
            }
          >
            Criar cobrança
          </button>
        </div>
      </form>
    </div>
  );
};
