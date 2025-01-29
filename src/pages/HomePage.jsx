import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AlunoContext from "../context/AlunoContext";
import api from "../api";
import "../styles/HomePage.css";
import AddAlunoSection from "../components/homepage/AddAlunoSection";
import GerenciarAlunosSection from "../components/homepage/GerenciarAlunosSection";

function HomePage() {
  const { logout } = useContext(AuthContext);
  const { alunos, fetchAlunos } = useContext(AlunoContext);
  const [profile, setProfile] = useState(null);
  const [showAddAluno, setShowAddAluno] = useState(false);
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
      if (
        error.response &&
        error.response.data.msg === "Já existe um aluno com esse email"
      ) {
        setError("Este email já está cadastrado no sistema!");
      } else {
        setError("Ocorreu um erro ao cadastrar o aluno. Tente novamente.");
      }
    }
  };

  function handleLogout() {
    logout();
  }

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
          <AddAlunoSection
            showAddAluno={showAddAluno}
            setShowAddAluno={setShowAddAluno}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            error={error}
            successMessage={successMessage}
          />

          <GerenciarAlunosSection alunos={alunos} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
