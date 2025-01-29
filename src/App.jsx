// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Páginas
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./components/PrivateRoute";
import { AlunoProvider } from "./context/AlunoContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AlunoProvider>
          <Routes>
            {/* Rota de Login para Professor */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rota Home (após login) */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
          </Routes>
        </AlunoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
