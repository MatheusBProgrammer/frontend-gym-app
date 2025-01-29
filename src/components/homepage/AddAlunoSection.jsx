import { useState } from "react";
import AlunoForm from "./AlunoForm";
import "./styles/AddAlunoSection.css";
const AddAlunoSection = ({
  showAddAluno,
  setShowAddAluno,
  formData,
  handleInputChange,
  handleSubmit,
  error,
  successMessage,
}) => {
  return (
    <div className="section add-aluno">
      <h3>Adicionar Aluno</h3>
      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {!showAddAluno ? (
        <button
          onClick={() => {
            setShowAddAluno(true);
            setError("");
            setSuccessMessage("");
          }}
          className="primary-button"
        >
          Novo Aluno
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
