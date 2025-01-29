import { createContext, useState, useEffect } from "react";

const initialAuthState = {
  user: null, // aqui armazenamos os dados do professor (ex.: {_id, email, nome...})
  token: null, // token JWT
};

export const AuthContext = createContext({
  ...initialAuthState,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(initialAuthState);

  // Carrega do localStorage ao montar
  useEffect(() => {
    const storedAuth = localStorage.getItem("authData");
    if (storedAuth) {
      setAuthData(JSON.parse(storedAuth));
    }
  }, []);

  // Sempre que authData mudar, salva ou remove do localStorage
  useEffect(() => {
    if (authData.token && authData.user) {
      localStorage.setItem("authData", JSON.stringify(authData));
    } else {
      localStorage.removeItem("authData");
    }
  }, [authData]);

  /**
   * login(user, token)
   * Configura user + token e atualiza o estado local.
   */
  function login(user, token) {
    setAuthData({ user, token });
  }

  /**
   * logout()
   * Limpa o estado e localStorage
   */
  function logout() {
    setAuthData(initialAuthState);
  }

  // Retorna true se houver token
  const isAuthenticated = !!authData.token;

  return (
    <AuthContext.Provider
      value={{
        user: authData.user,
        token: authData.token,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
