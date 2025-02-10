import React from "react";
import AlunoCard from "./AlunoCard";
import "./styles/GerenciarAlunosSection.css";

/**
 * Componente responsável por renderizar a lista de alunos
 * e passar as funções de update/delete para cada AlunoCard.
 */
const GerenciarAlunosSection = ({
  alunos,
  updateAluno,
  deleteAluno,
  updateMedidasAluno,
}) => {
  return (
    <div className="section gerenciar-alunos">
      <h3>Gerenciar Alunos</h3>

      <div className="alunos-list">
        {alunos.length > 0 ? (
          alunos.map((aluno) => (
            <AlunoCard
              key={aluno._id}
              aluno={aluno}
              updateAluno={updateAluno}
              deleteAluno={deleteAluno}
              updateMedidasAluno={updateMedidasAluno} // <-- repassa aqui
            />
          ))
        ) : (
          <p>Nenhum aluno cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default GerenciarAlunosSection;
