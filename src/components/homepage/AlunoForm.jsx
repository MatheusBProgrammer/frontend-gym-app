// src/components/AlunoForm.jsx
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

      {/* MEDIDAS */}
      <input
        type="number"
        name="altura"
        step="0.01"
        placeholder="Altura (cm)"
        value={formData.altura}
        onChange={handleInputChange}
        required
      />

      <input
        type="number"
        name="peso"
        step="1"
        placeholder="Peso (kg)"
        value={formData.peso}
        onChange={handleInputChange}
        required
      />

      <input
        type="number"
        name="circunferenciaAbdominal"
        step="1"
        placeholder="Abdominal (cm)"
        value={formData.circunferenciaAbdominal}
        onChange={handleInputChange}
      />

      <input
        type="number"
        name="circunferenciaQuadril"
        step="1"
        placeholder="Quadril (cm)"
        value={formData.circunferenciaQuadril}
        onChange={handleInputChange}
      />

      {/* OBJETIVO */}
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

      {/* MOSTRAR CAMPOS CALCULADOS (opcional) */}
      {formData.percentualGordura && (
        <div>
          <label>Percentual de Gordura: {formData.percentualGordura}%</label>
        </div>
      )}
      {formData.massaMuscular && (
        <div>
          <label>Massa Muscular: {formData.massaMuscular} kg</label>
        </div>
      )}

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
