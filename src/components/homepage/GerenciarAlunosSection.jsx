import React from "react";
import AlunoCard from "./AlunoCard";
import "./styles/GerenciarAlunosSection.css";

const GerenciarAlunosSection = ({ alunos, updateAluno, deleteAluno }) => {
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
