import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <Routes>
      {/* Rota para a página de Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rota para a página de Cadastro */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Rota principal/protegida para o Dashboard */}
      <Route path="/" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;