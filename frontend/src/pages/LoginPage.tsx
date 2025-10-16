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
    <div className="min-h-screen bg-white flex flex-col justify-center items-center">
      <div className="bg-gray-200 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-black text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Entrar
            </button>
          </div>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-700">
            Crie uma agora
          </Link>
        </p>
      </div>
    </div>
  );
};