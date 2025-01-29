import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

// Componentes estilizados (opcional)
import AuthForm from "../components/authpage/AuthForm";
import AuthInput from "../components/authpage/AuthInput";
import GoldButton from "../components/authpage/GoldButton";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  // Agora pegamos "login" do contexto, em vez de setUser/setToken
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      // POST /api/professor/login
      const response = await api.post("/api/professor/login", { email, senha });
      // Exemplo de resposta: { _id, token }
      const { _id, token } = response.data;

      // Crie um objeto user com as infos que deseja armazenar (nome, email, etc.)
      const user = { _id, email };

      // Salva no AuthContext
      login(user, token);

      // Redireciona para a Home
      navigate("/");
    } catch (err) {
      console.log("ERRO => ", err);
      setError("Falha no login. Verifique as credenciais ou tente novamente.");
    }
  }

  return (
    <div style={styles.wrapper}>
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

        <GoldButton type="submit">Entrar</GoldButton>
      </AuthForm>
    </div>
  );
}

const styles = {
  wrapper: {
    // Tela inteira com gradiente sutil
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #FFFAF0 0%, #FCECD3 100%)",
  },
};

export default LoginPage;
