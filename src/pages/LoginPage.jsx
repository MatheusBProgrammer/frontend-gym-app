// src/pages/LoginPage.jsx
import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

// Componentes estilizados
import AuthForm from "../components/authpage/AuthForm";
import AuthInput from "../components/authpage/AuthInput";
import PrimaryButton from "../components/authpage/PrimaryButton";

// Import do CSS específico da página de Login
import "../styles/LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      // POST /api/professor/login
      const response = await api.post("/api/professor/login", { email, senha });
      const { _id, token } = response.data;

      const user = { _id, email };
      login(user, token);

      // Dispara a animação de saída (fade-out)
      setIsLeaving(true);
    } catch (err) {
      console.log("ERRO => ", err);
      setError("Falha no login. Verifique as credenciais ou tente novamente.");
    }
  }

  // Após a animação de saída terminar, navega para a página inicial
  function handleAnimationEnd() {
    if (isLeaving) {
      navigate("/");
    }
  }

  return (
    <div
      className={`login-page-container ${isLeaving ? "fade-out" : "fade-in"}`}
      onAnimationEnd={handleAnimationEnd}
      ref={containerRef}
    >
      <h1 className="app-title">ACADEMIA</h1>
      <AuthForm title="Login - Professor" error={error} onSubmit={handleLogin}>
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthInput
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <PrimaryButton type="submit">Entrar</PrimaryButton>
      </AuthForm>
    </div>
  );
}

export default LoginPage;
