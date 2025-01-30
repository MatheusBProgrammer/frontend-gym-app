import { Link } from "react-router-dom";
import "./styles/AlunoCard.css";

const AlunoCard = ({ aluno }) => {
  const handleAction = (e, actionType) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`${actionType} aluno ${aluno._id}`);
  };

  return (
    <Link to={`/aluno/${aluno._id}`} className="aluno-card">
      <div className="card-content">
        <div className="header-section">
          <h3>{aluno.nome}</h3>
          <button
            className="icon-button add-workout"
            onClick={(e) => handleAction(e, "add-workout")}
            title="Adicionar treino"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        </div>

        <div className="info-section">
          <div className="detail-item">
            <label>Email</label>
            <p>{aluno.email}</p>
          </div>
          <div className="detail-item">
            <label>Objetivo</label>
            <span
              className={`objetivo-tag ${aluno.objetivo.replace(/\s/g, "-")}`}
            >
              {aluno.objetivo}
            </span>
          </div>
        </div>

        <div className="actions-bottom">
          <button
            className="icon-button edit"
            onClick={(e) => handleAction(e, "edit")}
            title="Editar aluno"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>

          <button
            className="icon-button delete"
            onClick={(e) => handleAction(e, "delete")}
            title="Excluir aluno"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default AlunoCard;
