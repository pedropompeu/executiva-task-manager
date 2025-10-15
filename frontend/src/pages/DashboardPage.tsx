import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Task {
  id: string;
  titulo: string;
  descricao: string;
  status: 'PENDENTE' | 'EM ANDAMENTO' | 'CONCLUÍDA';
}

export const DashboardPage = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]); 
  const [titulo, setTitulo] = useState(''); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login'); 
        return;
      }

      try {
        const response = await api.get('/tasks');
        setTasks(response.data); 
      } catch (error) {
        console.error('Falha ao buscar tarefas:', error);
        navigate('/login'); 
      } finally {
        setLoading(false); 
      }
    };

    fetchTasks();
  }, [navigate]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return; 

    try {
      const response = await api.post('/tasks', { titulo, descricao: '' });
      setTasks([...tasks, response.data]); 
      setTitulo('');
    } catch (error) {
      console.error('Falha ao criar tarefa:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id)); // 
    } catch (error) {
      console.error('Falha ao apagar tarefa:', error);
    }
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    try {
      const response = await api.patch(`/tasks/${id}/status`, { status });
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
    } catch (error) {
      console.error('Falha ao atualizar status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); 
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-900 text-white flex justify-center items-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-sky-400">Meu Painel de Tarefas</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sair
        </button>
      </header>

      <main className="max-w-4xl mx-auto">
        <form onSubmit={handleCreateTask} className="mb-8 flex gap-4">
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Nova tarefa..."
            className="flex-grow bg-slate-800 p-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
          >
            Adicionar
          </button>
        </form>

        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
                <span className={`font-medium ${task.status === 'CONCLUÍDA' ? 'line-through text-gray-500' : ''}`}>
                  {task.titulo}
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                    className="bg-slate-700 rounded p-1 text-sm"
                  >
                    <option value="PENDENTE">Pendente</option>
                    <option value="EM ANDAMENTO">Em Andamento</option>
                    <option value="CONCLUÍDA">Concluída</option>
                  </select>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Nenhuma tarefa encontrada. Que tal adicionar uma?</p>
          )}
        </div>
      </main>
    </div>
  );
};