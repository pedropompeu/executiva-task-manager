import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { TaskModal } from '../components/TaskModal';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Task {
  id: string;
  titulo: string;
  descricao: string;
  status: 'PENDENTE' | 'EM ANDAMENTO' | 'CONCLUÍDA';
  order: number;
}

interface Columns {
  [key: string]: {
    name: string;
    items: Task[];
  };
}

export const DashboardPage = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Columns>({});
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/tasks');
        setTasks(response.data.sort((a: Task, b: Task) => a.order - b.order));
      } catch (error) {
        console.error('Falha ao buscar tarefas:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  useEffect(() => {
    setColumns({
      PENDENTE: {
        name: 'Pendente',
        items: tasks.filter((task) => task.status === 'PENDENTE'),
      },
      'EM ANDAMENTO': {
        name: 'Em Andamento',
        items: tasks.filter((task) => task.status === 'EM ANDAMENTO'),
      },
      CONCLUÍDA: {
        name: 'Concluída',
        items: tasks.filter((task) => task.status === 'CONCLUÍDA'),
      },
    });
  }, [tasks]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const newColumns = { ...columns };
    const sourceColumn = newColumns[source.droppableId];
    const destColumn = newColumns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId !== destination.droppableId) {
      const newStatus = destination.droppableId as Task['status'];
      removed.status = newStatus;
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...newColumns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      });

      await api.patch(`/tasks/${removed.id}/status`, { status: newStatus });
    } else {
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...newColumns,
        [destination.droppableId]: { ...destColumn, items: destItems },
      });
    }

    const allTasks = Object.values(newColumns).flatMap(col => col.items);
    const tasksWithNewOrder = allTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    setTasks(tasksWithNewOrder.sort((a, b) => a.order - b.order));

    const orderPayload = tasksWithNewOrder.map(t => ({ id: t.id, order: t.order }));
    await api.post('/tasks/order', orderPayload);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !descricao.trim()) return;

    try {
      const response = await api.post('/tasks', { titulo, descricao });
      setTasks([...tasks, response.data]);
      setTitulo('');
      setDescricao('');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Falha ao criar tarefa:', error);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !titulo.trim() || !descricao.trim()) return;

    try {
      const response = await api.patch(`/tasks/${selectedTask.id}`, { titulo, descricao });
      setTasks(tasks.map((task) => (task.id === selectedTask.id ? response.data : task)));
      setTitulo('');
      setDescricao('');
      setIsEditModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Falha ao atualizar tarefa:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Falha ao apagar tarefa:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setTitulo(task.titulo);
    setDescricao(task.descricao);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-100 text-slate-600 flex justify-center items-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold text-indigo-600">Meu Painel</h1>
          <p className="text-slate-500">Organize suas tarefas de forma fácil e intuitiva.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transition-transform hover:scale-105"
          >
            Nova Tarefa
          </button>
          <button
            onClick={handleLogout}
            title="Sair"
            className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(columns).map(([columnId, column]) => (
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`bg-slate-200 p-4 rounded-xl shadow-inner transition-colors duration-300 ${snapshot.isDraggingOver ? 'bg-indigo-100' : ''}`}
                  >
                    <h2 className="font-bold text-lg mb-4 text-slate-700 pl-2">{column.name}</h2>
                    <div className="space-y-4">
                      {column.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ${snapshot.isDragging ? 'shadow-2xl scale-105' : ''}`}
                            >
                              <h3 className="font-semibold text-slate-900">{item.titulo}</h3>
                              <p className="text-sm text-slate-600 mt-1">{item.descricao}</p>
                              <div className="flex justify-end gap-3 mt-4">
                                <button
                                  onClick={() => openEditModal(item)}
                                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(item.id)}
                                  className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                                >
                                  Excluir
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </main>

      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        titulo={titulo}
        setTitulo={setTitulo}
        descricao={descricao}
        setDescricao={setDescricao}
        modalTitle="Nova Tarefa"
        submitButtonText="Criar"
      />

      {selectedTask && (
        <TaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
            setTitulo('');
            setDescricao('');
          }}
          onSubmit={handleUpdateTask}
          titulo={titulo}
          setTitulo={setTitulo}
          descricao={descricao}
          setDescricao={setDescricao}
          modalTitle="Editar Tarefa"
          submitButtonText="Salvar"
        />
      )}
    </div>
  );
};