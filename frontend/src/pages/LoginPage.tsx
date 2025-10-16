import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/signin', { email, password });
      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      navigate('/');
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Ocorreu um erro ao tentar fazer login.');
      } else {
        setError('Não foi possível conectar ao servidor.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-indigo-600">✅ Executiva</h1>
        <p className="text-slate-500">Seu gerenciador de tarefas simples e eficiente.</p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-slate-800 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-slate-800 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Entrar
            </button>
          </div>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-800">
            Crie uma agora
          </Link>
        </p>
      </div>
    </div>
  );
};