import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1) Importar useNavigate
import "./styles/GerenciarAlunosSection.css"; // Seu arquivo de estilos

const AlunoCard = ({ aluno, updateAluno, deleteAluno }) => {
  const navigate = useNavigate(); // 2) Inicializar o hook

  const [showEditModal, setShowEditModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [alunoEdit, setAlunoEdit] = useState({
    id: aluno._id,
    genero: aluno.genero,
    objetivo: aluno.objetivo,
    senha: "", // A senha só será alterada se o usuário preencher esse campo.
  });

  // 3) Função para navegar ao clicar no card
  const handleCardClick = () => {
    navigate(`/aluno/${aluno._id}`);
  };

  // 4) Impedir a propagação de clique nos botões
  const handleEditClick = (e) => {
    e.stopPropagation();
    setShowEditModal(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm("Deseja realmente excluir este aluno?")) {
      deleteAluno(aluno._id);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setAlunoEdit({ ...alunoEdit, [name]: value });
    if (name === "senha") {
      setPasswordError("");
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    // Validação da senha se ela estiver preenchida
    if (alunoEdit.senha !== "") {
      if (alunoEdit.senha.length < 6) {
        setPasswordError("* A senha deve ter no mínimo 6 caracteres.");
        return;
      }
      if (!/[0-9]/.test(alunoEdit.senha)) {
        setPasswordError("* A senha deve conter pelo menos um número.");
        return;
      }
      if (!/[a-z]/.test(alunoEdit.senha)) {
        setPasswordError(
          "* A senha deve conter pelo menos uma letra minúscula."
        );
        return;
      }
      if (!/[A-Z]/.test(alunoEdit.senha)) {
        setPasswordError(
          "* A senha deve conter pelo menos uma letra maiúscula."
        );
        return;
      }
      if (!/[\W_]/.test(alunoEdit.senha)) {
        setPasswordError(
          "* A senha deve conter pelo menos um caractere especial."
        );
        return;
      }
    }

    updateAluno(alunoEdit);
    setShowEditModal(false);
  };

  return (
    <>
      {/* 3) Ao clicar no card inteiro, navega para /aluno/:id */}
      <div className="aluno-card" onClick={handleCardClick}>
        <h4>{aluno.nome}</h4>
        <p>
          <strong>Email:</strong> {aluno.email}
        </p>
        <p>
          <strong>Gênero:</strong> {aluno.genero}
        </p>
        <p>
          <strong>Altura:</strong> {aluno.altura}m
        </p>
        <p>
          <strong>Peso:</strong> {aluno.peso}kg
        </p>
        <p>
          <strong>Objetivo:</strong> {aluno.objetivo}
        </p>

        <div className="actions-row">
          {/* 4) Prevenir que o clique suba para o onClick do card */}
          <button className="editAlunoButton" onClick={handleEditClick}>
            Editar
          </button>
          <button className="deleteAlunoButton" onClick={handleDeleteClick}>
            Excluir
          </button>
        </div>
      </div>

      {/* Modal de edição */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Aluno</h2>
            <form onSubmit={handleEditSubmit}>
              <label htmlFor="genero">Gênero:</label>
              <select
                id="genero"
                name="genero"
                value={alunoEdit.genero}
                onChange={handleEditInputChange}
              >
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
                <option value="outro">Outro</option>
              </select>

              <label htmlFor="objetivo">Objetivo:</label>
              <select
                id="objetivo"
                name="objetivo"
                value={alunoEdit.objetivo}
                onChange={handleEditInputChange}
              >
                <option value="ganho de massa muscular">
                  Ganho de Massa Muscular
                </option>
                <option value="perda de peso">Perda de Peso</option>
                <option value="condicionamento">
                  Melhorar Condicionamento
                </option>
              </select>

              <label htmlFor="senha">Nova Senha (opcional):</label>
              <div className="password-input-container">
                <input
                  id="senha"
                  name="senha"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Digite nova senha"
                  value={alunoEdit.senha}
                  onChange={handleEditInputChange}
                />
                <span
                  className="toggle-password"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  style={{
                    marginLeft: "8px",
                  }} // Adicione esta linha
                >
                  {passwordVisible ? (
                    <svg
                      className="olho-senha"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 0 24 24"
                      width="20"
                      fill="#333"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 6a9.77 9.77 0 018.94 6 9.77 9.77 0 01-17.88 0A9.77 9.77 0 0112 6m0-2C6.48 4 1.73 7.11 0 12c1.73 4.89 6.48 8 12 8s10.27-3.11 12-8c-1.73-4.89-6.48-8-12-8zm0 5a3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3z" />
                    </svg>
                  ) : (
                    // Ícone de "olho aberto"
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 0 24 24"
                      width="20"
                      fill="#333"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5 5 0 9.27-3.11 11-7.5-1.73-4.39-6-7.5-11-7.5zm0 5a3 3 0 110 6 3 3 0 010-6z" />
                    </svg>
                  )}
                </span>
              </div>
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}

              <div className="modal-actions">
                <button type="submit" className="confirmEditButton">
                  Salvar
                </button>
                <button
                  type="button"
                  className="cancelEditButton"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AlunoCard;
