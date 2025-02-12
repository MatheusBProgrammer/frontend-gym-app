// src/components/AlunoCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AlunoCard.css";

const AlunoCard = ({ aluno, updateAluno, deleteAluno, updateMedidasAluno }) => {
  const navigate = useNavigate();

  // Estados para os modais de edição e atualização de medidas
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMedidasModal, setShowMedidasModal] = useState(false);

  // Estado para edição das informações do aluno
  const [alunoEdit, setAlunoEdit] = useState({
    id: aluno._id,
    genero: aluno.genero,
    objetivo: aluno.objetivo,
  });

  // Estado para atualização das medidas
  const [medidasForm, setMedidasForm] = useState({
    peso: aluno.medidasAtuais?.peso || "",
    altura: aluno.medidasAtuais?.altura || "",
    circunferenciaAbdominal: aluno.medidasAtuais?.circunferenciaAbdominal || "",
    circunferenciaQuadril: aluno.medidasAtuais?.circunferenciaQuadril || "",
    percentualGordura: aluno.medidasAtuais?.percentualGordura || "",
    massaMuscular: aluno.medidasAtuais?.massaMuscular || "",
  });

  // Função auxiliar para extrair mensagem de erro (caso necessário)
  const getErrorMessage = (error) => {
    return (
      error.response?.data?.message ||
      error.response?.data?.msg ||
      error.message ||
      "Ocorreu um erro. Tente novamente."
    );
  };

  const handleCardClick = () => navigate(`/aluno/${aluno._id}`);
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
  const handleUpdateMedidasClick = (e) => {
    e.stopPropagation();
    setShowMedidasModal(true);
  };

  // Atualiza os campos do modal de edição
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setAlunoEdit((prev) => ({ ...prev, [name]: value }));
  };

  // Atualiza os campos do modal de medidas
  const handleMedidasChange = (e) => {
    const { name, value } = e.target;
    setMedidasForm((prev) => ({ ...prev, [name]: value }));
  };

  // Ao submeter a edição
  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateAluno(alunoEdit);
    setShowEditModal(false);
  };

  // Ao submeter a atualização das medidas
  const handleMedidasSubmit = async (e) => {
    e.preventDefault();

    const medidasData = {
      peso: medidasForm.peso ? Number(medidasForm.peso) : undefined,
      altura: medidasForm.altura ? Number(medidasForm.altura) : undefined,
      circunferenciaAbdominal: medidasForm.circunferenciaAbdominal
        ? Number(medidasForm.circunferenciaAbdominal)
        : undefined,
      circunferenciaQuadril: medidasForm.circunferenciaQuadril
        ? Number(medidasForm.circunferenciaQuadril)
        : undefined,
      percentualGordura: medidasForm.percentualGordura
        ? Number(medidasForm.percentualGordura)
        : undefined,
      massaMuscular: medidasForm.massaMuscular
        ? Number(medidasForm.massaMuscular)
        : undefined,
    };

    try {
      await updateMedidasAluno(aluno._id, medidasData);
      setShowMedidasModal(false);
    } catch (error) {
      console.error("Erro ao atualizar medidas do aluno:", error);
      alert(getErrorMessage(error));
    }
  };

  return (
    <>
      <div className="aluno-card" onClick={handleCardClick}>
        <h4>{aluno.nome}</h4>
        <p>
          <strong>Email:</strong> {aluno.email}
        </p>
        <p>
          <strong>Gênero:</strong> {aluno.genero}
        </p>
        <p>
          <strong>Altura:</strong>{" "}
          {aluno.medidasAtuais?.altura
            ? `${aluno.medidasAtuais.altura} m`
            : "Não informado"}
        </p>
        <p>
          <strong>Peso:</strong>{" "}
          {aluno.medidasAtuais?.peso
            ? `${aluno.medidasAtuais.peso} kg`
            : "Não informado"}
        </p>
        <p>
          <strong>Objetivo:</strong> {aluno.objetivo}
        </p>
        <div className="actions-row">
          <button
            className="updateMedidasButton"
            onClick={handleUpdateMedidasClick}
          >
            Atualizar medidas
          </button>
          <button className="editAlunoButton" onClick={handleEditClick}>
            Editar
          </button>
          <button className="deleteAlunoButton" onClick={handleDeleteClick}>
            Excluir
          </button>
        </div>
      </div>

      {/* Modal de Editar Aluno */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Aluno</h2>
            <form onSubmit={handleEditSubmit}>
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

      {/* Modal de Atualizar Medidas */}
      {showMedidasModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Atualizar Medidas</h2>
            <form onSubmit={handleMedidasSubmit}>
              <label htmlFor="peso">Peso (kg):</label>
              <input
                id="peso"
                name="peso"
                type="number"
                step="0.1"
                value={medidasForm.peso}
                onChange={handleMedidasChange}
                required
              />
              <label htmlFor="altura">Altura (m):</label>
              <input
                id="altura"
                name="altura"
                type="number"
                step="0.01"
                value={medidasForm.altura}
                onChange={handleMedidasChange}
                required
              />
              <label htmlFor="circunferenciaAbdominal">
                Circ. Abdominal (cm):
              </label>
              <input
                id="circunferenciaAbdominal"
                name="circunferenciaAbdominal"
                type="number"
                step="0.1"
                value={medidasForm.circunferenciaAbdominal}
                onChange={handleMedidasChange}
              />
              <label htmlFor="circunferenciaQuadril">Circ. Quadril (cm):</label>
              <input
                id="circunferenciaQuadril"
                name="circunferenciaQuadril"
                type="number"
                step="0.1"
                value={medidasForm.circunferenciaQuadril}
                onChange={handleMedidasChange}
              />
              <label htmlFor="percentualGordura">% Gordura (%):</label>
              <input
                id="percentualGordura"
                name="percentualGordura"
                type="number"
                step="0.1"
                value={medidasForm.percentualGordura}
                onChange={handleMedidasChange}
              />
              <label htmlFor="massaMuscular">Massa Muscular (kg):</label>
              <input
                id="massaMuscular"
                name="massaMuscular"
                type="number"
                step="0.1"
                value={medidasForm.massaMuscular}
                onChange={handleMedidasChange}
              />
              <div className="modal-actions">
                <button type="submit" className="confirmEditButton">
                  Salvar
                </button>
                <button
                  type="button"
                  className="cancelEditButton"
                  onClick={() => setShowMedidasModal(false)}
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
