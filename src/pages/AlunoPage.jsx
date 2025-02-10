import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import AlunoContext from "../context/AlunoContext";
import Button from "../components/alunopage/Button";
import Modal from "../components/alunopage/Modal";
import Input from "../components/alunopage/Input";
import Select from "../components/alunopage/Select";
import "../styles/AlunoPage.css";

// Importações para os gráficos e registro dos componentes do Chart.js
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Função auxiliar para capitalizar a primeira letra de uma string
const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Array com os grupos musculares pré-definidos
const grupoMuscularOptions = [
  { value: "peito", label: "Peitoral" },
  { value: "costas", label: "Costas" },
  { value: "ombros", label: "Ombros" },
  { value: "biceps", label: "Bíceps" },
  { value: "triceps", label: "Tríceps" },
  { value: "gluteos", label: "Glúteos" },
  { value: "quadriceps", label: "Quadríceps" },
  { value: "posterior-coxa", label: "Posterior da Coxa" },
  { value: "panturrilhas", label: "Panturrilhas" },
  { value: "adutores", label: "Adutores" },
  { value: "abdutores", label: "Abdutores" },
  { value: "abdominal", label: "Abdominal" },
  { value: "lombar", label: "Lombar" },
  { value: "obliquos", label: "Oblíquos" },
  { value: "trapezio", label: "Trapézio" },
  { value: "antebracos", label: "Antebraços" },
];

// Array com as opções de métricas para o gráfico de evolução
const metricsOptions = [
  { value: "peso", label: "Peso (kg)" },
  { value: "altura", label: "Altura" },
  { value: "circunferenciaAbdominal", label: "Circ. Abdominal (cm)" },
  { value: "circunferenciaQuadril", label: "Circ. Quadril (cm)" },
  { value: "percentualGordura", label: "Percentual de Gordura (%)" },
  { value: "massaMuscular", label: "Massa Muscular (kg)" },
];

function AlunoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alunos, fetchAlunos } = useContext(AlunoContext);

  const [aluno, setAluno] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Estados para exibir os gráficos
  const [showChart, setShowChart] = useState(false);
  const [showEvolucao, setShowEvolucao] = useState(false);
  const [historicoMedidas, setHistoricoMedidas] = useState([]);

  // Função para buscar o histórico de medidas (usando POST)
  const fetchHistoricoMedidas = async () => {
    try {
      const response = await api.post(`/api/aluno/medidas/historico/${id}`, {
        alunoId: id,
      });
      setHistoricoMedidas(response.data);
    } catch (error) {
      console.error("Erro ao buscar histórico de medidas:", error);
    }
  };

  // Alterna a exibição do gráfico de evolução e busca os dados se necessário
  const handleToggleEvolucao = () => {
    if (!showEvolucao) {
      fetchHistoricoMedidas();
    }
    setShowEvolucao(!showEvolucao);
  };

  // Estados para formulários
  const emptyTreino = { grupoMuscular: "", observacoes: "" };
  const emptyExercicio = {
    nome: "",
    tipo: "musculacao",
    repeticoes: 12,
    series: 4,
    descanso: 90,
    observacoes: "",
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

  // Função genérica para operações CRUD
  const handleCRUD = async (method, endpoint, data) => {
    try {
      setLoading(true);
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

  // Operações com rotinas, treinos e exercícios
  const handleCreateRotina = () =>
    handleCRUD(api.post, `/api/aluno/rotina/${id}`);
  const handleDeleteRotinas = () =>
    handleCRUD(api.delete, `/api/aluno/rotina/deletar-rotinas`, {
      alunoId: id,
    });
  const handleDeleteRotina = (rotinaId) =>
    handleCRUD(api.delete, `/api/aluno/rotina/deletar-rotina`, {
      alunoId: id,
      rotinaId,
    });
  const handleTreinoAction = (rotinaId, treinoId = null, data) => {
    const baseEndpoint = `/api/aluno/rotina/${id}/${rotinaId}/treinos`;
    const method = treinoId ? api.put : api.post;
    const endpoint = treinoId ? `${baseEndpoint}/${treinoId}` : baseEndpoint;
    return handleCRUD(method, endpoint, data);
  };
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
  const handleDelete = (type, ids) => {
    const endpoints = {
      treino: `/api/aluno/rotina/${id}/${ids.rotinaId}/treinos/${ids.treinoId}`,
      exercicio: `/api/aluno/rotina/${id}/${ids.rotinaId}/treinos/${ids.treinoId}/exercicios/${ids.exercicioId}`,
    };
    return handleCRUD(api.delete, endpoints[type]);
  };

  if (!aluno) return <div className="loading">Carregando...</div>;

  // Função para calcular a distribuição de exercícios por grupo muscular (para o Pie Chart)
  const computeMuscleGroupDistribution = () => {
    const distribution = {};
    if (aluno.rotinas && Array.isArray(aluno.rotinas)) {
      aluno.rotinas.forEach((rotina) => {
        if (rotina.treinos && Array.isArray(rotina.treinos)) {
          rotina.treinos.forEach((treino) => {
            const group = treino.grupoMuscular;
            if (group && treino.exercicios && treino.exercicios.length > 0) {
              distribution[group] =
                (distribution[group] || 0) + treino.exercicios.length;
            }
          });
        }
      });
    }
    return distribution;
  };

  const muscleGroupData = computeMuscleGroupDistribution();
  const pieChartData = {
    labels: Object.keys(muscleGroupData),
    datasets: [
      {
        label: "Exercícios por Grupo Muscular",
        data: Object.values(muscleGroupData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FFCD56",
          "#C9CBCF",
          "#36E2EB",
          "#80FF80",
          "#FFC0CB",
          "#BDB76B",
          "#4682B4",
          "#556B2F",
          "#8B008B",
          "#FF8C00",
        ],
        hoverOffset: 10,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Gráfico de Exercícios por Grupo Muscular",
        font: { size: 12 },
      },
      legend: { position: "bottom" },
    },
    animation: { duration: 800 },
  };

  // Preparando dados para o gráfico de evolução (Line Chart)
  const historicoMedidasSorted = [...historicoMedidas].sort(
    (a, b) => new Date(a.data) - new Date(b.data)
  );

  // Cores definidas para cada métrica (na mesma ordem de metricsOptions)
  const datasetColors = [
    {
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "rgba(75,192,192,0.2)",
    },
    {
      borderColor: "rgba(255,99,132,1)",
      backgroundColor: "rgba(255,99,132,0.2)",
    },
    {
      borderColor: "rgba(54,162,235,1)",
      backgroundColor: "rgba(54,162,235,0.2)",
    },
    {
      borderColor: "rgba(255,206,86,1)",
      backgroundColor: "rgba(255,206,86,0.2)",
    },
    {
      borderColor: "rgba(153,102,255,1)",
      backgroundColor: "rgba(153,102,255,0.2)",
    },
    {
      borderColor: "rgba(255,159,64,1)",
      backgroundColor: "rgba(255,159,64,0.2)",
    },
  ];

  const evolutionChartData = {
    labels: historicoMedidasSorted.map((item) =>
      new Date(item.data).toLocaleDateString()
    ),
    datasets: metricsOptions.map((metric, index) => ({
      label: metric.label,
      data: historicoMedidasSorted.map((item) => item.medidas[metric.value]),
      borderColor: datasetColors[index].borderColor,
      backgroundColor: datasetColors[index].backgroundColor,
      fill: false,
      tension: 0.1,
    })),
  };

  const evolutionChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Evolução das Medidas" },
    },
  };

  // Cria um array de opções para o select de treino com placeholder
  const grupoMuscularOptionsWithPlaceholder = [
    { value: "", label: "Selecione o Grupo Muscular", disabled: true },
    ...grupoMuscularOptions,
  ];

  return (
    <div className="aluno-page">
      {/* Cabeçalho */}
      <header className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
        <h1>{aluno.nome}</h1>
        <Button variant="outline" onClick={() => setShowChart(!showChart)}>
          {showChart ? "Ocultar Gráfico" : "Ver Gráfico"}
        </Button>
        <Button variant="outline" onClick={handleToggleEvolucao}>
          {showEvolucao ? "Ocultar Evolução" : "Ver Evolução"}
        </Button>
      </header>

      {/* Gráfico de Exercícios por Grupo Muscular (Pie Chart) */}
      {showChart && (
        <div
          className="chart-container"
          style={{ height: "500px", width: "100%" }}
        >
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      )}

      {/* Gráfico de Evolução das Medidas (Line Chart) */}
      {showEvolucao && historicoMedidas.length > 0 && (
        <div
          className="chart-container"
          style={{ height: "500px", width: "100%" }}
        >
          <Line data={evolutionChartData} options={evolutionChartOptions} />
        </div>
      )}
      {showEvolucao && historicoMedidas.length === 0 && (
        <div
          className="chart-container"
          style={{ height: "500px", width: "100%" }}
        >
          <p>Não há dados de evolução disponíveis.</p>
        </div>
      )}

      {/* Informações do Aluno */}
      <section className="student-details">
        <div className="detail-card">
          <label>Email</label>
          <p>{aluno.email}</p>
        </div>
        <div className="detail-card">
          <label>Gênero</label>
          <p>{aluno.genero}</p>
        </div>
        <div className="detail-card">
          <label>Objetivo</label>
          <p>{aluno.objetivo}</p>
        </div>
      </section>

      {/* Ações Gerais */}
      <section className="actions">
        <Button onClick={() => setModalType("nova_rotina")} variant="primary">
          + Nova Rotina
        </Button>
        <Button onClick={handleDeleteRotinas} variant="danger">
          Remover Todas as Rotinas
        </Button>
      </section>

      {/* Rotinas de Treino */}
      <section className="rotinas">
        <h2>Rotinas de Treino</h2>
        {aluno.rotinas.length === 0 ? (
          <p className="empty">Nenhuma rotina cadastrada.</p>
        ) : (
          aluno.rotinas.map((rotina, index) => (
            <div key={rotina._id} className="rotina">
              <div className="rotina-header">
                {/* 
                  Aqui é aplicado o nome automático da rotina com uma sequência alfabética,
                  baseada no índice (A para o primeiro, B para o segundo, etc.)
                */}
                <h3>
                  Rotina {String.fromCharCode(65 + index)} -{" "}
                  {new Date(rotina.createdAt).toLocaleDateString()}
                </h3>
                <div className="rotina-actions">
                  <Button
                    onClick={() => {
                      setSelectedItem({ rotinaId: rotina._id });
                      setFormData(emptyTreino);
                      setModalType("novo_treino");
                    }}
                    variant="outline"
                  >
                    + Novo Treino
                  </Button>
                  <Button
                    onClick={() => handleDeleteRotina(rotina._id)}
                    variant="danger"
                  >
                    Apagar Rotina
                  </Button>
                </div>
              </div>
              {rotina.treinos.map((treino) => (
                <div key={treino._id} className="treino">
                  <div className="treino-header">
                    {/* Aqui aplicamos a capitalização para o grupo muscular */}
                    <h4>
                      {treino.grupoMuscular
                        ? capitalizeFirstLetter(treino.grupoMuscular)
                        : "Sem grupo definido"}
                    </h4>
                    <div className="treino-actions">
                      <Button
                        onClick={() => {
                          setSelectedItem({
                            rotinaId: rotina._id,
                            treinoId: treino._id,
                          });
                          setFormData(treino);
                          setModalType("editar_treino");
                        }}
                        variant="outline"
                      >
                        Editar Treino
                      </Button>
                      <Button
                        onClick={() =>
                          handleDelete("treino", {
                            rotinaId: rotina._id,
                            treinoId: treino._id,
                          })
                        }
                        variant="danger"
                      >
                        Apagar Treino
                      </Button>
                    </div>
                  </div>
                  <p className="observacoes">{treino.observacoes}</p>
                  <div className="exercicios">
                    {treino.exercicios.map((exercicio) => (
                      <div key={exercicio._id} className="exercicio">
                        <div className="exercicio-info">
                          {/* Capitaliza o nome do exercício na exibição */}
                          <h5>{capitalizeFirstLetter(exercicio.nome)}</h5>
                          <p>Tipo: {exercicio.tipo}</p>
                          <p>
                            {exercicio.series}x{exercicio.repeticoes}
                          </p>
                          <p>Descanso: {exercicio.descanso}s</p>
                          {exercicio.observacoes && (
                            <p>Observações: {exercicio.observacoes}</p>
                          )}
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
                            variant="outline"
                          >
                            Editar Exercício
                          </Button>
                          <Button
                            onClick={() =>
                              handleDelete("exercicio", {
                                rotinaId: rotina._id,
                                treinoId: treino._id,
                                exercicioId: exercicio._id,
                              })
                            }
                            variant="danger"
                          >
                            Apagar Exercício
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        setSelectedItem({
                          rotinaId: rotina._id,
                          treinoId: treino._id,
                        });
                        setFormData(emptyExercicio);
                        setModalType("novo_exercicio");
                      }}
                      variant="outline"
                    >
                      + Novo Exercício
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </section>

      {/* Modal para Nova Rotina */}
      <Modal
        isOpen={modalType === "nova_rotina"}
        onClose={() => setModalType(null)}
        title="Nova Rotina"
      >
        <p>Deseja criar uma nova rotina?</p>
        <div className="modal-actions">
          <Button
            onClick={handleCreateRotina}
            variant="primary"
            loading={loading}
          >
            Confirmar
          </Button>
          <Button onClick={() => setModalType(null)} variant="outline">
            Cancelar
          </Button>
        </div>
      </Modal>

      {/* Modal para Novo/Editar Treino */}
      <Modal
        isOpen={modalType && modalType.includes("treino")}
        onClose={() => setModalType(null)}
        title={
          modalType && modalType.includes("editar")
            ? "Editar Treino"
            : "Novo Treino"
        }
      >
        <Select
          label="Grupo Muscular"
          value={formData.grupoMuscular || ""}
          onChange={(e) =>
            setFormData({ ...formData, grupoMuscular: e.target.value })
          }
          options={grupoMuscularOptionsWithPlaceholder}
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
            variant="primary"
            loading={loading}
          >
            Salvar
          </Button>
          <Button onClick={() => setModalType(null)} variant="outline">
            Cancelar
          </Button>
        </div>
      </Modal>

      {/* Modal para Novo/Editar Exercício */}
      <Modal
        isOpen={modalType && modalType.includes("exercicio")}
        onClose={() => setModalType(null)}
        title={
          modalType && modalType.includes("editar")
            ? "Editar Exercício"
            : "Novo Exercício"
        }
      >
        <Input
          label="Nome do Exercício"
          value={formData.nome || ""}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          // Ao perder o foco, transforma a primeira letra em maiúscula
          onBlur={() =>
            setFormData({
              ...formData,
              nome: capitalizeFirstLetter(formData.nome),
            })
          }
        />
        <Select
          label="Tipo"
          value={formData.tipo || "musculacao"}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          options={[
            { value: "musculacao", label: "Musculação" },
            { value: "cardio", label: "Cardio" },
            { value: "funcional", label: "Funcional" },
          ]}
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
        <Input
          label="Observação"
          value={formData.observacoes || ""}
          onChange={(e) =>
            setFormData({ ...formData, observacoes: e.target.value })
          }
        />
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
            variant="primary"
            loading={loading}
          >
            Salvar
          </Button>
          <Button onClick={() => setModalType(null)} variant="outline">
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default AlunoPage;
