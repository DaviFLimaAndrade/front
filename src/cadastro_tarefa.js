import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Arquivo CSS para manter o estilo

const CadastroTarefa = () => {
  const [descricao, setDescricao] = useState("");
  const [setor, setSetor] = useState("");
  const [prioridade, setPrioridade] = useState("baixa"); // Prioridade padrão é baixa
  const [status, setStatus] = useState("a_fazer"); // Status padrão é "a fazer"
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioId, setUsuarioId] = useState(""); // Vai armazenar o ID do usuário
  const [message, setMessage] = useState(""); // Para exibir mensagens de erro ou sucesso
  const [loading, setLoading] = useState(false); // Controle de carregamento

  // Carregar usuários ao montar o componente
  useEffect(() => {
    setLoading(true);
    axios.get("http://127.0.0.1:8000/api/usuarios/") // Essa rota deve retornar os dados dos usuários
      .then((response) => {
        setUsuarios(response.data); // Agora estamos setando a resposta da API, que deve ter {id, nome, email}
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Erro ao carregar usuários:", error);
        setMessage("Erro ao carregar usuários.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifique se o usuário foi selecionado corretamente (deve ser o ID)
    if (!usuarioId) {
      setMessage("Por favor, selecione um usuário.");
      return;
    }

    // Estrutura do corpo da requisição
    const tarefaData = {
      descricao: descricao.trim(),
      nome_setor: setor.trim(),
      prioridade,
      status,
      usuario: usuarioId,  // ID do usuário
    };

    setLoading(true); // Inicia o carregamento enquanto envia a tarefa
    try {
      // Envia os dados para o backend
      const response = await axios.post("http://127.0.0.1:8000/api/tarefas/", tarefaData);
      
      // Mensagem de sucesso
      setMessage("Tarefa cadastrada com sucesso!");
      
      // Limpar os campos após o envio
      setDescricao("");
      setSetor("");
      setPrioridade("baixa");
      setStatus("a_fazer");
      setUsuarioId(""); // Limpar o ID do usuário
    } catch (error) {
      // Caso haja erro, exibe a mensagem de erro
      setMessage("Erro ao cadastrar a tarefa.");
      console.error("Erro ao cadastrar tarefa:", error);
    }
    setLoading(false); // Fim do carregamento
  };

  return (
    <div>
      <header className="header">
        <h1>Gerenciamento de Tarefas</h1>
        <nav>
          <a href="/">Cadastro de Usuários</a>
          <a href="/gerenciar-tarefas">Gerenciar Tarefas</a>
          <a href="/cadastrar-tarefas">Cadastrar Tarefa</a>
        </nav>
      </header>

      <div className="container">
        
        {loading && <p>Carregando...</p>} {/* Exibindo carregamento */}
        <form onSubmit={handleSubmit}>
        <h2>Cadastro de Tarefa</h2>
          <div>
            <label>Descrição:</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Setor:</label>
            <input
              type="text"
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Prioridade:</label>
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
            >
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div>
            <label>Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="a_fazer">A Fazer</option>
              <option value="fazendo">Fazendo</option>
              <option value="pronto">Pronto</option>
            </select>
          </div>
          <div>
            <label>Usuário:</label>
            <select
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              required
            >
              <option value="">Selecione um usuário</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome} {/* Exibe o nome do usuário */}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}>Cadastrar Tarefa</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default CadastroTarefa;
