// src/context/AlunoContext.jsx
import { createContext, useEffect, useState } from "react";
import api from "../api"; // Import da sua api

const AlunoContext = createContext({
  alunos: [],
  setAlunos: () => {},
  fetchAlunos: () => {},
});

export function AlunoProvider({ children }) {
  const [alunos, setAlunos] = useState([]);

  // Função para buscar alunos na API
  async function fetchAlunos() {
    try {
      const response = await api.get("/api/aluno");
      const data = response.data;
      setAlunos(data);
      localStorage.setItem("alunos", JSON.stringify(data));
    } catch (e) {
      console.error("Erro ao buscar alunos:", e);
    }
  }

  // Carrega os alunos do localStorage ao montar o componente
  useEffect(() => {
    const storedAlunos = localStorage.getItem("alunos");
    if (storedAlunos) {
      setAlunos(JSON.parse(storedAlunos));
    } else {
      fetchAlunos();
    }
  }, []);

  return (
    <AlunoContext.Provider
      value={{
        alunos,
        setAlunos,
        fetchAlunos,
      }}
    >
      {children}
    </AlunoContext.Provider>
  );
}

export default AlunoContext;
