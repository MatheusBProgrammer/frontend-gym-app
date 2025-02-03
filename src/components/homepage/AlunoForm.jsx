import "./styles/AlunoForm.css";

const AlunoForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  setShowForm,
}) => {
  return (
    <form onSubmit={handleSubmit} className="aluno-form">
      <input
        type="text"
        name="nome"
        placeholder="Nome completo"
        value={formData.nome}
        onChange={handleInputChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="senha"
        placeholder="Senha"
        value={formData.senha}
        onChange={handleInputChange}
        required
      />

      <select
        name="genero"
        value={formData.genero}
        onChange={handleInputChange}
        required
      >
        <option value="masculino">Masculino</option>
        <option value="feminino">Feminino</option>
        <option value="outro">Outro</option>
      </select>

      <input
        type="number"
        name="altura"
        step="0.01"
        placeholder="Altura (m)"
        value={formData.altura}
        onChange={handleInputChange}
        required
      />
      <input
        type="number"
        name="peso"
        placeholder="Peso (kg)"
        value={formData.peso}
        onChange={handleInputChange}
        required
      />

      <select
        name="objetivo"
        value={formData.objetivo}
        onChange={handleInputChange}
        required
      >
        <option value="ganho de massa muscular">Ganho de Massa</option>
        <option value="perda de peso">Perda de Peso</option>
        <option value="manutenção">Manutenção</option>
      </select>

      <div className="form-buttons">
        <button type="submit" className="primary-button">
          Cadastrar
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => setShowForm(false)}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default AlunoForm;
