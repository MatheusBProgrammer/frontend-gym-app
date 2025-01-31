import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import AlunoContext from "../context/AlunoContext";
import Button from "../components/alunopage/Button";
import Modal from "../components/alunopage/Modal";
import Input from "../components/alunopage/Input";
import Select from "../components/alunopage/Select";
import "../styles/AlunoPage.css";

function AlunoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alunos, fetchAlunos } = useContext(AlunoContext);
  const [aluno, setAluno] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Estados para formulários
  const emptyTreino = { grupoMuscular: "", observacoes: "" };
  const emptyExercicio = {
    nome: "",
    tipo: "musculacao",
    repeticoes: 12,
    series: 4,
    descanso: 90,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/aluno/${id}`);
        setAluno(response.data);
      } catch (error) {
        console.error("Erro ao buscar aluno:", error);
        navigate("/");
      }
    };

    const cachedAluno = alunos.find((a) => a._id === id);
    if (cachedAluno) {
      setAluno(cachedAluno);
    } else {
      fetchData();
    }
  }, [id, alunos, navigate]);

  // --- Ajuste para DELETE com body via axios.delete(...) ---
  const handleCRUD = async (method, endpoint, data) => {
    try {
      setLoading(true);
      // Se for DELETE, precisamos enviar o body em "data"
      if (method === api.delete) {
        await method(endpoint, { data });
      } else {
        await method(endpoint, data);
      }
      const updated = await api.get(`/api/aluno/${id}`);
      setAluno(updated.data);
      fetchAlunos();
    } catch (error) {
      console.error("Erro na operação:", error);
    } finally {
      setLoading(false);
      setModalType(null);
    }
  };

  // Cria nova rotina
  const handleCreateRotina = () =>
    handleCRUD(api.post, `/api/aluno/rotina/${id}`);

  // Deleta TODAS as rotinas
  const handleDeleteRotinas = () =>
    handleCRUD(api.delete, `/api/aluno/rotina/deletar-rotinas`, {
      alunoId: id,
    });

  // Deleta UMA rotina específica
  const handleDeleteRotina = (rotinaId) =>
    handleCRUD(api.delete, `/api/aluno/rotina/deletar-rotina`, {
      alunoId: id,
      rotinaId,
    });

  // Adiciona ou atualiza um treino
  const handleTreinoAction = (rotinaId, treinoId = null, data) => {
    const baseEndpoint = `/api/aluno/rotina/${id}/${rotinaId}/treinos`;
    const method = treinoId ? api.put : api.post;
    const endpoint = treinoId ? `${baseEndpoint}/${treinoId}` : baseEndpoint;
    return handleCRUD(method, endpoint, data);
  };

  // Adiciona ou atualiza um exercício
  const handleExercicioAction = (
    rotinaId,
    treinoId,
    exercicioId = null,
    data
  ) => {
    const baseEndpoint = `/api/aluno/rotina/${id}/${rotinaId}/treinos/${treinoId}/exercicios`;
    const method = exercicioId ? api.put : api.post;
    const endpoint = exercicioId
      ? `${baseEndpoint}/${exercicioId}`
      : baseEndpoint;
    return handleCRUD(method, endpoint, data);
  };

  // Deleta treino ou exercício (já existia)
  const handleDelete = (type, ids) => {
    const endpoints = {
      treino: `/api/aluno/rotina/${id}/${ids.rotinaId}/treinos/${ids.treinoId}`,
      exercicio: `/api/aluno/rotina/${id}/${ids.rotinaId}/treinos/${ids.treinoId}/exercicios/${ids.exercicioId}`,
    };
    return handleCRUD(api.delete, endpoints[type]);
  };

  if (!aluno) return <div className="loading">Carregando...</div>;

  return (
    <div className="aluno-page">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Voltar
      </button>

      <div className="header-section">
        <h1>{aluno.nome}</h1>
        <div className="actions">
          <Button onClick={() => setModalType("nova_rotina")}>
            + Nova Rotina
          </Button>{" "}
          <Button variant="danger" onClick={handleDeleteRotinas}>
            Remover Todas as rotinas
          </Button>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <label>Email</label>
          <p>{aluno.email}</p>
        </div>
        <div className="info-item">
          <label>Gênero</label>
          <p>{aluno.genero}</p>
        </div>
        <div className="info-item">
          <label>Objetivo</label>
          <p className="objetivo">{aluno.objetivo}</p>
        </div>
      </div>

      <h2>Rotinas de Treino</h2>

      {aluno.rotinas.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma rotina cadastrada</p>
        </div>
      ) : (
        aluno.rotinas.map((rotina) => (
          <div key={rotina._id} className="rotina-card">
            <div className="rotina-header">
              <h3>
                Rotina de {new Date(rotina.createdAt).toLocaleDateString()}
              </h3>
              <div className="rotina-actions">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedItem({ rotinaId: rotina._id });
                    setFormData(emptyTreino);
                    setModalType("novo_treino");
                  }}
                >
                  + Novo Treino
                </Button>

                {/* Botão para REMOVER somente ESTA rotina */}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteRotina(rotina._id)}
                >
                  Apagar Esta Rotina
                </Button>
              </div>
            </div>

            {rotina.treinos.map((treino) => (
              <div key={treino._id} className="treino-card">
                <div className="treino-header">
                  <h4>{treino.grupoMuscular}</h4>
                  <div className="treino-actions">
                    <div className="treino-header-icons">
                      <Button
                        icon="edit"
                        onClick={() => {
                          setSelectedItem({
                            rotinaId: rotina._id,
                            treinoId: treino._id,
                          });
                          setFormData(treino);
                          setModalType("editar_treino");
                        }}
                      >
                        Editar treino
                      </Button>
                      <Button
                        icon="delete"
                        variant="danger"
                        onClick={() =>
                          handleDelete("treino", {
                            rotinaId: rotina._id,
                            treinoId: treino._id,
                          })
                        }
                      >
                        Apagar treino
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="observacoes">{treino.observacoes}</p>

                <div className="exercicios-list">
                  {treino.exercicios.map((exercicio) => (
                    <div key={exercicio._id} className="exercicio-item">
                      <div className="exercicio-info">
                        <h5>{exercicio.nome}</h5>
                        <div className="exercicio-details">
                          <span>Tipo: {exercicio.tipo}</span>
                          <span>
                            {exercicio.series}x{exercicio.repeticoes}
                          </span>
                          <span>Descanso: {exercicio.descanso}s</span>
                        </div>
                      </div>
                      <div className="exercicio-actions">
                        <Button
                          onClick={() => {
                            setSelectedItem({
                              rotinaId: rotina._id,
                              treinoId: treino._id,
                              exercicioId: exercicio._id,
                            });
                            setFormData(exercicio);
                            setModalType("editar_exercicio");
                          }}
                        >
                          Editar exercício
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() =>
                            handleDelete("exercicio", {
                              rotinaId: rotina._id,
                              treinoId: treino._id,
                              exercicioId: exercicio._id,
                            })
                          }
                        >
                          Apagar exercício
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedItem({
                        rotinaId: rotina._id,
                        treinoId: treino._id,
                      });
                      setFormData(emptyExercicio);
                      setModalType("novo_exercicio");
                    }}
                  >
                    + Novo Exercício
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Modais */}
      <Modal
        isOpen={modalType === "nova_rotina"}
        onClose={() => setModalType(null)}
        title="Nova Rotina"
      >
        <p>Tem certeza que deseja criar uma nova rotina?</p>
        <div className="modal-actions">
          <Button onClick={handleCreateRotina} loading={loading}>
            Confirmar
          </Button>
          <Button variant="secondary" onClick={() => setModalType(null)}>
            Cancelar
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={modalType?.includes("treino")}
        onClose={() => setModalType(null)}
        title={`${modalType?.includes("editar") ? "Editar" : "Novo"} Treino`}
      >
        <Input
          label="Grupo Muscular"
          value={formData.grupoMuscular || ""}
          onChange={(e) =>
            setFormData({ ...formData, grupoMuscular: e.target.value })
          }
        />
        <Input
          label="Observações"
          type="textarea"
          value={formData.observacoes || ""}
          onChange={(e) =>
            setFormData({ ...formData, observacoes: e.target.value })
          }
        />
        <div className="modal-actions">
          <Button
            onClick={() =>
              handleTreinoAction(
                selectedItem.rotinaId,
                selectedItem.treinoId,
                formData
              )
            }
            loading={loading}
          >
            Salvar
          </Button>
          <Button variant="secondary" onClick={() => setModalType(null)}>
            Cancelar
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={modalType?.includes("exercicio")}
        onClose={() => setModalType(null)}
        title={`${modalType?.includes("editar") ? "Editar" : "Novo"} Exercício`}
      >
        <Input
          label="Nome do Exercício"
          value={formData.nome || ""}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        />
        <Select
          label="Tipo"
          value={formData.tipo || "musculacao"}
          options={[
            { value: "musculacao", label: "Musculação" },
            { value: "cardio", label: "Cardio" },
            { value: "funcional", label: "Funcional" },
          ]}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
        />
        <div className="form-row">
          <Input
            label="Séries"
            type="number"
            value={formData.series || ""}
            onChange={(e) =>
              setFormData({ ...formData, series: e.target.value })
            }
          />
          <Input
            label="Repetições"
            type="number"
            value={formData.repeticoes || ""}
            onChange={(e) =>
              setFormData({ ...formData, repeticoes: e.target.value })
            }
          />
          <Input
            label="Descanso (segundos)"
            type="number"
            value={formData.descanso || ""}
            onChange={(e) =>
              setFormData({ ...formData, descanso: e.target.value })
            }
          />
        </div>
        <div className="modal-actions">
          <Button
            onClick={() =>
              handleExercicioAction(
                selectedItem.rotinaId,
                selectedItem.treinoId,
                selectedItem.exercicioId,
                formData
              )
            }
            loading={loading}
          >
            Salvar
          </Button>
          <Button variant="secondary" onClick={() => setModalType(null)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default AlunoPage;
