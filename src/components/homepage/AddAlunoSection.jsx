// src/components/AddAlunoSection.jsx
import React, { useEffect, useState } from "react";
import "./styles/AddAlunoSection.css";
import AlunoForm from "./AlunoForm";

const AddAlunoSection = ({
  showAddAluno,
  setShowAddAluno,
  error,
  successMessage,
}) => {
  // Estado inicial do formulário
  const initialFormData = {
    nome: "",
    email: "",
    senha: "",
    genero: "masculino",
    altura: "",
    peso: "",
    objetivo: "ganho de massa muscular",
    circunferenciaAbdominal: "",
    circunferenciaQuadril: "",
    percentualGordura: "",
    massaMuscular: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [displayError, setDisplayError] = useState("");
  const [displaySuccess, setDisplaySuccess] = useState("");

  // Atualiza o estado quando um erro ocorre e remove após 3 segundos
  useEffect(() => {
    if (error) {
      setDisplayError(error);
      const timer = setTimeout(() => setDisplayError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Atualiza o estado quando uma mensagem de sucesso ocorre e remove após 3 segundos
  useEffect(() => {
    if (successMessage) {
      setDisplaySuccess(successMessage);
      const timer = setTimeout(() => setDisplaySuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  /**
   * Atualiza o formData e realiza o cálculo automático de:
   * - percentual de gordura
   * - massa muscular
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (
        [
          "peso",
          "altura",
          "circunferenciaAbdominal",
          "circunferenciaQuadril",
        ].includes(name)
      ) {
        const peso = parseInt(newData.peso) || 0;
        const abd = parseInt(newData.circunferenciaAbdominal) || 0;
        const quad = parseInt(newData.circunferenciaQuadril) || 0;
        const alturaCm = parseInt(newData.altura) || 0; // Altura em cm
        const alturaMetros = alturaCm / 100; // Convertendo para metros

        if (peso > 0 && abd > 0 && quad > 0 && alturaCm > 0) {
          // Exemplo de cálculo usando altura (ajuste conforme sua fórmula real)
          const imc = peso / (alturaMetros * alturaMetros); // Exemplo com IMC

          // Fórmula dummy revisada (apenas exemplo)
          const rcq = abd / quad;
          const percentualGordura = Math.round(rcq * 50);
          const massaMuscular = Math.round(
            peso * (1 - percentualGordura / 100)
          );

          newData.percentualGordura = String(percentualGordura);
          newData.massaMuscular = String(massaMuscular);
        } else {
          newData.percentualGordura = "";
          newData.massaMuscular = "";
        }
      }

      return newData;
    });
  };
  /**
   * handleSubmit: monta o objeto final e envia ao backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      genero: formData.genero,
      objetivo: formData.objetivo,
      medidasAtuais: {
        peso: parseInt(formData.peso) || 0,
        altura: parseFloat(formData.altura) || 0,
        circunferenciaAbdominal:
          parseInt(formData.circunferenciaAbdominal) || 0,
        circunferenciaQuadril: parseInt(formData.circunferenciaQuadril) || 0,
        percentualGordura: parseInt(formData.percentualGordura) || 0,
        massaMuscular: parseInt(formData.massaMuscular) || 0,
      },
    };

    try {
      const response = await fetch("http://localhost:3000/api/aluno/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Resposta do servidor não é JSON.");
      }

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Erro ao cadastrar aluno");
      }

      console.log("Aluno cadastrado:", responseData);
      setDisplaySuccess("Aluno cadastrado com sucesso!");

      // Remover a mensagem de sucesso após 3 segundos
      setTimeout(() => setDisplaySuccess(""), 3000);

      // Resetar o formulário e fechar a seção
      setFormData(initialFormData);
      setShowAddAluno(false);
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setDisplayError(err.message || "Erro ao conectar com o servidor.");

      // Remover a mensagem de erro após 3 segundos
      setTimeout(() => setDisplayError(""), 3000);
    }
  };

  return (
    <div className="section add-aluno">
      <h3>Adicionar Aluno</h3>

      {displayError && <div className="error-message">{displayError}</div>}
      {displaySuccess && (
        <div className="success-message">{displaySuccess}</div>
      )}

      {!showAddAluno ? (
        <button
          onClick={() => setShowAddAluno(true)}
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
