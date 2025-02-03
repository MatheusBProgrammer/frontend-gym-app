import React, { useEffect, useState } from "react";
import "./styles/AddAlunoSection.css";
import AlunoForm from "./AlunoForm";

const AddAlunoSection = ({
  showAddAluno,
  setShowAddAluno,
  formData,
  handleInputChange,
  handleSubmit,
  error,
  successMessage,
}) => {
  // Estados locais para gerenciar a exibição das mensagens
  const [displayError, setDisplayError] = useState("");
  const [displaySuccess, setDisplaySuccess] = useState("");

  // Quando a prop "error" mudar, exibe a mensagem e a remove após 3s
  useEffect(() => {
    if (error) {
      setDisplayError(error);
      const timer = setTimeout(() => {
        setDisplayError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Quando a prop "successMessage" mudar, exibe a mensagem e a remove após 3s
  useEffect(() => {
    if (successMessage) {
      setDisplaySuccess(successMessage);
      const timer = setTimeout(() => {
        setDisplaySuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="section add-aluno">
      <h3>Adicionar Aluno</h3>

      {displayError && <div className="error-message">{displayError}</div>}
      {displaySuccess && (
        <div className="success-message">{displaySuccess}</div>
      )}

      {!showAddAluno ? (
        <button
          onClick={() => {
            setShowAddAluno(true);
          }}
          className="primary-button"
        >
          + Novo Aluno
        </button>
      ) : (
        <AlunoForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setShowForm={setShowAddAluno}
        />
      )}
    </div>
  );
};

export default AddAlunoSection;
