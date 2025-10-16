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

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setTitulo(task.titulo);
    setDescricao(task.descricao);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return <div className="min-h-screen bg-white text-black flex justify-center items-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-500">Meu Painel de Tarefas</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sair
        </button>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Nova Tarefa
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(columns).map(([columnId, column]) => (
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`bg-gray-100 p-4 rounded-lg ${snapshot.isDraggingOver ? 'bg-blue-100' : ''}`}
                  >
                    <h2 className="font-bold mb-4">{column.name}</h2>
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-4 mb-4 rounded-lg shadow ${snapshot.isDragging ? 'bg-blue-50' : ''}`}
                          >
                            <h3 className="font-bold">{item.titulo}</h3>
                            <p className="text-sm text-gray-600">{item.descricao}</p>
                            <div className="flex justify-end gap-2 mt-4">
                              <button
                                onClick={() => openEditModal(item)}
                                className="text-blue-500 hover:text-blue-700 text-sm"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeleteTask(item.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
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
