import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CadastroUsuario from "./CadastrarUsuario";
import TarefaApp from "./gerenciamento_taref";
import CadastroTarefa from "./cadastro_tarefa";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CadastroUsuario />} />
        <Route path="/gerenciar-tarefas" element={<TarefaApp />} />
        <Route path="/cadastrar-tarefas" element={<CadastroTarefa/>} />
      </Routes>
    </Router>
  );
};

export default App;
