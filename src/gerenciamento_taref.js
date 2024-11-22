import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Arquivo CSS atualizado para replicar a aparência

const TarefaApp = () => {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(false); // Controle de carregamento

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
                  <p><b>Descrição:</b> {tarefa.descricao}</p>
                  <p><b>Setor:</b> {tarefa.nome_setor}</p>
                  <p><b>Prioridade:</b> {tarefa.prioridade}</p>
                  <p><b>Vinculado:</b> {tarefa.vinculado ? "Sim" : "Não"}</p>
                  <p><b>Status:</b> {tarefa.status}</p>
                  <div className="botoes">
                    <button onClick={() => updateStatus(tarefa.id, "a_fazer")}>
                      A Fazer
                    </button>
                    <button onClick={() => updateStatus(tarefa.id, "fazendo")}>
                      Fazendo
                    </button>
                    <button onClick={() => updateStatus(tarefa.id, "pronto")}>
                      Pronto
                    </button>
                    <button onClick={() => deleteTarefa(tarefa.id)}>
                      Excluir
                    </button>
                  </div>
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
