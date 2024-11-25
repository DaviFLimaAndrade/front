import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Arquivo CSS atualizado para replicar a aparência

const TarefaApp = () => {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(false); // Controle de carregamento

  // Estado para controlar as edições
  const [editandoTarefa, setEditandoTarefa] = useState(null);
  const [tarefaEditada, setTarefaEditada] = useState({
    descricao: "",
    nome_setor: "",
    prioridade: "",
    status: "",
  });

  // Função para buscar tarefas
  const fetchTarefas = async () => {
    setLoading(true); // Inicia o carregamento
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/tarefas/");
      console.log(response.data); // Verifique os dados retornados no console
      setTarefas(response.data); // Atualiza o estado com as tarefas
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  // Função para excluir uma tarefa
  const deleteTarefa = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tarefas/${id}/`);
      fetchTarefas(); // Atualiza a lista após excluir
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  // Função para alterar o status de uma tarefa
  const updateStatus = async (id, novoStatus) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/tarefas/${id}/`, { status: novoStatus });
      fetchTarefas(); // Atualiza a lista após a alteração
    } catch (error) {
      console.error("Erro ao alterar status:", error);
    }
  };

  // Função para editar a tarefa
  const editarTarefa = (tarefa) => {
    setEditandoTarefa(tarefa.id); // Marca que estamos editando essa tarefa
    setTarefaEditada({
      descricao: tarefa.descricao,
      nome_setor: tarefa.nome_setor,
      prioridade: tarefa.prioridade,
      status: tarefa.status,
    });
  };

  // Função para salvar as alterações da tarefa
  const salvarTarefa = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/tarefas/${id}/`, tarefaEditada);
      setEditandoTarefa(null); // Finaliza o modo de edição
      fetchTarefas(); // Atualiza a lista de tarefas
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
    }
  };

  useEffect(() => {
    fetchTarefas();
  }, []);

  // Filtrar tarefas por status
  const tarefasPorStatus = (status) =>
    tarefas.filter((tarefa) => tarefa.status === status);

  return (
    <div>
      <header className="header">
        <h1>Gerenciamento de Tarefas</h1>
        <nav>
          <a href="/">Logout</a>
          <a href="/cadastrar-tarefas">Cadastro de Tarefas</a>
          <a href="/gerenciar-tarefas">Gerenciar Tarefas</a>
        </nav>
      </header>
      <div className="container">
        {loading && <p>Carregando tarefas...</p>} {/* Exibe um carregamento enquanto as tarefas são buscadas */}

        {["a_fazer", "fazendo", "pronto"].map((status) => (
          <div className="coluna" key={status}>
            <h2>{status}</h2>
            {tarefasPorStatus(status).length === 0 ? (
              <p>Nenhuma tarefa para este status.</p>
            ) : (
              tarefasPorStatus(status).map((tarefa) => (
                <div key={tarefa.id} className="tarefa">
                  {editandoTarefa === tarefa.id ? (
                    <>
                      <p>
                        <b>Descrição:</b>
                        <input
                          type="text"
                          value={tarefaEditada.descricao}
                          onChange={(e) =>
                            setTarefaEditada({
                              ...tarefaEditada,
                              descricao: e.target.value,
                            })
                          }
                        />
                      </p>
                      <p>
                        <b>Setor:</b>
                        <input
                          type="text"
                          value={tarefaEditada.nome_setor}
                          onChange={(e) =>
                            setTarefaEditada({
                              ...tarefaEditada,
                              nome_setor: e.target.value,
                            })
                          }
                        />
                      </p>
                      <p>
                        <b>Prioridade:</b>
                        <input
                          type="text"
                          value={tarefaEditada.prioridade}
                          onChange={(e) =>
                            setTarefaEditada({
                              ...tarefaEditada,
                              prioridade: e.target.value,
                            })
                          }
                        />
                      </p>
                      <p>
                        <b>Status:</b>
                        <input
                          type="text"
                          value={tarefaEditada.status}
                          onChange={(e) =>
                            setTarefaEditada({
                              ...tarefaEditada,
                              status: e.target.value,
                            })
                          }
                        />
                      </p>
                      <div className="botoes">
                        <button onClick={() => salvarTarefa(tarefa.id)}>
                          Salvar
                        </button>
                        <button onClick={() => setEditandoTarefa(null)}>
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        <b>Descrição:</b> {tarefa.descricao}
                      </p>
                      <p>
                        <b>Setor:</b> {tarefa.nome_setor}
                      </p>
                      <p>
                        <b>Prioridade:</b> {tarefa.prioridade}
                      </p>
                      <p>
                        <b>Vinculado:</b> {tarefa.vinculado ? "Sim" : "Não"}
                      </p>
                      <p>
                        <b>Status:</b> {tarefa.status}
                      </p>
                      <div className="botoes">
                        <button onClick={() => editarTarefa(tarefa)}>
                          Editar
                        </button>
                        <button onClick={() => deleteTarefa(tarefa.id)}>
                          Excluir
                        </button>
                        <button onClick={() => updateStatus(tarefa.id, "a_fazer")}>
                          A Fazer
                        </button>
                        <button onClick={() => updateStatus(tarefa.id, "fazendo")}>
                          Fazendo
                        </button>
                        <button onClick={() => updateStatus(tarefa.id, "pronto")}>
                          Pronto
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TarefaApp;
