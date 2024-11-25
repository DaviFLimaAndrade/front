import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importa o hook de navegação

const CadastroUsuario = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Hook para navegação

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/cadastrar_usuario/", {
        nome: username,
        email,
      });
      setMessage("Usuário criado com sucesso!");
      setTimeout(() => navigate("/gerenciar-tarefas"), 1500); // Redireciona após 1,5 segundos
    } catch (error) {
      if (error.response) {
        setMessage(`Erro: ${error.response.data.detail || "Erro ao criar usuário."}`);
      } else {
        setMessage("Erro ao criar usuário. Tente novamente.");
      }
    }
  };

  return (
    <div>
      <header className="header">
        <h1>Gerenciamento de Tarefas</h1>
        <nav>
          <a href="/">Cadastro de Usuários</a>
          <a href="cadastrar-tarefas">Cadastro de Tarefas</a>
          <a href="gerenciar-tarefas">Gerenciar Tarefas</a>
        </nav>
      </header>
      <div className="content">
      <div className="container">
        
        <form onSubmit={handleSubmit}>
          <div>
          <h2>Cadastro de Usuários</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Nome"
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
          </div>
          <button type="submit">Cadastrar</button>
        </form>
        {message && <p>{message}</p>}
      </div>
      </div>
      
    </div>
  );
};

export default CadastroUsuario;
