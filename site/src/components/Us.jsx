import "./Us.css";
import { Link } from "react-router-dom";

export default function Us() {
  return (
    <div className="history-block">
      <div className="history-image">
        <img src="/img/history/1.jpeg" alt="Uma porta aberta por Deus" />
      </div>

      <div className="history-text">
        <h3>Porque o Sacolão da Doze </h3>

        <p>
          Tudo começou em 1992 com coragem, pouca condição e muita vontade de
          trabalhar. Val e Elias eram um casal jovem, recém-casados, dispostos a
          construir algo com as próprias mãos. Antes do Sacolão, tentaram a
          sorte com uma pastelaria. Havia empenho, havia conhecimento — mas o
          negócio deu muito trabalho e pouco retorno. 
        </p>
        <Link to="/about" className="btn btn-primary">
          Leia mais
        </Link>
      </div>
    </div>
  );
}
