// src/pages/HomePage.jsx
import { useContext, useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { AuthContext } from "../context/AuthContext";
import AlunoContext from "../context/AlunoContext";
import api from "../api/index";

import "../styles/HomePage.css";
import AddAlunoSection from "../components/homepage/AddAlunoSection";
import GerenciarAlunosSection from "../components/homepage/GerenciarAlunosSection";

function HomePage() {
  const { logout } = useContext(AuthContext);
  const { alunos, fetchAlunos } = useContext(AlunoContext);

  const [profile, setProfile] = useState(null);
  const [showAddAluno, setShowAddAluno] = useState(false);

  // Form para cadastro de aluno
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    genero: "feminino",
    altura: "",
    peso: "",
    objetivo: "ganho de massa muscular",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Função auxiliar para extrair a mensagem de erro
  const getErrorMessage = (error) => {
    return (
      error.response?.data?.message ||
      error.response?.data?.msg ||
      error.message ||
      "Ocorreu um erro inesperado."
    );
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get("/api/professor/profile");
        setProfile(response.data);
      } catch (error) {
        console.error("Erro ao buscar perfil do professor:", error);
      }
    }

    fetchProfile();
    fetchAlunos();
  }, [fetchAlunos]);

  const handleLogout = () => {
    logout();
  };

  /* =========== Animações React-Spring =========== */
  const addAlunoSpring = useSpring({
    from: { y: 300, opacity: 0 },
    to: { y: 0, opacity: 1 },
    config: { tension: 160, friction: 50 },
  });

  const gerenciarAlunosSpring = useSpring({
    from: { x: 150, opacity: 0 },
    to: { x: 0, opacity: 1 },
    config: { tension: 160, friction: 50 },
  });

  /* =========== CADASTRAR ALUNO =========== */
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await api.post("/api/aluno/register", formData);
      fetchAlunos();

      // Reseta o form
      setFormData({
        nome: "",
        email: "",
        senha: "",
        genero: "feminino",
        altura: "",
        peso: "",
        objetivo: "ganho de massa muscular",
      });

      setShowAddAluno(false);
      setSuccessMessage("Aluno cadastrado com sucesso!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      setError(getErrorMessage(error));
      setTimeout(() => setError(""), 5000);
    }
  };

  /* =========== ATUALIZAR ALUNO =========== */
  const updateAluno = async (updatedData) => {
    try {
      await api.put("/api/aluno/update", updatedData);
      fetchAlunos();
      setSuccessMessage("Aluno atualizado com sucesso!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      setError(getErrorMessage(error));
      setTimeout(() => setError(""), 5000);
    }
  };

  /* =========== DELETAR ALUNO =========== */
  const deleteAluno = async (id) => {
    try {
      await api.delete(`/api/aluno/${id}`);
      fetchAlunos();
      setSuccessMessage("Aluno excluído com sucesso!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      setError(getErrorMessage(error));
      setTimeout(() => setError(""), 5000);
    }
  };

  /* =========== ATUALIZAR MEDIDAS DE ALUNO =========== */
  const updateMedidasAluno = async (alunoId, novasMedidas) => {
    try {
      await api.put(`/api/aluno/medidas/${alunoId}`, novasMedidas);
      fetchAlunos();
      setSuccessMessage("Medidas atualizadas com sucesso!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Erro ao atualizar medidas do aluno:", error);
      setError(getErrorMessage(error));
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        {profile && (
          <div className="profile-header">
            <h2>Bem-vindo, {profile.nome}!</h2>
            <button className="logoutButton" onClick={handleLogout}>
              Sair
            </button>
          </div>
        )}

        <div className="dashboard-container">
          {/* Caixa de Adicionar Aluno animada vindo da ESQUERDA */}
          <animated.div style={addAlunoSpring}>
            <AddAlunoSection
              showAddAluno={showAddAluno}
              setShowAddAluno={setShowAddAluno}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              error={error}
              successMessage={successMessage}
            />
          </animated.div>

          {/* Caixa de Gerenciar Alunos animada vindo da DIREITA */}
          <animated.div style={gerenciarAlunosSpring}>
            <GerenciarAlunosSection
              alunos={alunos}
              updateAluno={updateAluno}
              deleteAluno={deleteAluno}
              updateMedidasAluno={updateMedidasAluno}
            />
          </animated.div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
