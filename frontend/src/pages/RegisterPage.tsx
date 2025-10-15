import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios'; 

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(''); 

    try {
      await api.post('/auth/signup', { email, password });
      
      navigate('/login');

    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Ocorreu um erro ao tentar registar.');
      } else {
        setError('Não foi possível conectar ao servidor.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Criar Conta</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-slate-700 text-white leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-slate-700 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Registar
            </button>
          </div>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-sky-400 hover:text-sky-600">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};