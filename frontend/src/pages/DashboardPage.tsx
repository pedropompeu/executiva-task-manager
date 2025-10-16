import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { TaskModal } from '../components/TaskModal';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

type TaskStatus = 'PENDENTE' | 'EM ANDAMENTO' | 'CONCLUÍDA';

interface Task {
  id: string;
  titulo: string;
  descricao: string;
  status: TaskStatus;
  order: number;
}

interface Columns {
  [key: string]: {
    name: string;
    items: Task[];
  };
}

const columnStyles: { [key in TaskStatus]: { header: string; tag: string } } = {
  PENDENTE: { header: 'border-t-4 border-yellow-400', tag: 'bg-yellow-100 text-yellow-800' },
  'EM ANDAMENTO': { header: 'border-t-4 border-blue-400', tag: 'bg-blue-100 text-blue-800' },
  CONCLUÍDA: { header: 'border-t-4 border-green-400', tag: 'bg-green-100 text-green-800' },
};

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
  const [status, setStatus] = useState<TaskStatus>('PENDENTE');

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) { navigate('/login'); return; }
      try {
        const response = await api.get('/tasks');
        setTasks(response.data.sort((a: Task, b: Task) => a.order - b.order));
      } catch (error) { console.error('Falha ao buscar tarefas:', error); navigate('/login'); } 
      finally { setLoading(false); }
    };
    fetchTasks();
  }, [navigate]);

  useEffect(() => {
    setColumns({
      PENDENTE: { name: 'Pendente', items: tasks.filter((task) => task.status === 'PENDENTE') },
      'EM ANDAMENTO': { name: 'Em Andamento', items: tasks.filter((task) => task.status === 'EM ANDAMENTO') },
      CONCLUÍDA: { name: 'Concluída', items: tasks.filter((task) => task.status === 'CONCLUÍDA') },
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

      newColumns[source.droppableId] = { ...sourceColumn, items: sourceItems };
      newColumns[destination.droppableId] = { ...destColumn, items: destItems };
      
      api.patch(`/tasks/${removed.id}`, { status: newStatus });

    } else {
      destItems.splice(destination.index, 0, removed);
      newColumns[destination.droppableId] = { ...destColumn, items: destItems };
    }

    const allTasks = Object.values(newColumns).flatMap(col => col.items);
    const tasksWithNewOrder = allTasks.map((task, index) => ({ ...task, order: index }));

    setTasks(tasksWithNewOrder);

    const orderPayload = tasksWithNewOrder.map(t => ({ id: t.id, order: t.order }));
    await api.post('/tasks/order', orderPayload);
  };

  const openCreateModal = () => {
    setTitulo('');
    setDescricao('');
    setStatus('PENDENTE');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setTitulo(task.titulo);
    setDescricao(task.descricao);
    setStatus(task.status);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedTask(null);
    setTitulo('');
    setDescricao('');
    setStatus('PENDENTE');
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    try {
      const response = await api.post('/tasks', { titulo, descricao });
      setTasks(prevTasks => [...prevTasks, response.data].sort((a,b) => a.order - b.order));
      closeModal();
    } catch (error) { console.error('Falha ao criar tarefa:', error); }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !titulo.trim()) return;
    try {
      const response = await api.patch(`/tasks/${selectedTask.id}`, { 
        titulo, 
        descricao, 
        status 
      });
      
      setTasks(tasks.map((task) => (task.id === selectedTask.id ? response.data : task)));
      closeModal();
    } catch (error) { 
      console.error('Falha ao atualizar tarefa:', error); 
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) { console.error('Falha ao apagar tarefa:', error); }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };
  
  if (loading) {
    return <div className="min-h-screen bg-slate-100 text-slate-600 flex justify-center items-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap justify-between items-center gap-4 mb-10 max-w-7xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold text-indigo-600">Meu Painel</h1>
          <p className="text-slate-500 mt-1">Organize suas tarefas de forma fácil e intuitiva.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={openCreateModal} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transition-transform hover:scale-105">
            + Nova Tarefa
          </button>
          <button onClick={handleLogout} title="Sair" className="bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-transform hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(columns).map(([columnId, column]) => (
              <div key={columnId} className={`bg-slate-200/60 rounded-xl ${columnStyles[columnId as TaskStatus].header}`}>
                <h2 className="font-bold text-lg p-4 text-slate-700">{column.name}</h2>
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className={`p-4 pt-0 min-h-[200px] transition-colors duration-300 rounded-b-xl ${snapshot.isDraggingOver ? 'bg-indigo-100' : ''}`}>
                      <div className="space-y-4">
                        {column.items.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`bg-white p-4 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ${snapshot.isDragging ? 'shadow-2xl scale-105' : ''}`}>
                                <div className="flex justify-between items-start">
                                  <h3 className="font-semibold text-slate-900 pr-2">{item.titulo}</h3>
                                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${columnStyles[item.status].tag}`}>
                                    {item.status.replace('_', ' ')}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 mt-2">{item.descricao}</p>
                                <div className="flex justify-end gap-3 mt-4">
                                  <button onClick={() => openEditModal(item)} className="text-slate-500 hover:text-indigo-600 p-1 rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                                  </button>
                                  <button onClick={() => handleDeleteTask(item.id)} className="text-slate-500 hover:text-red-600 p-1 rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033C6.91 2.75 6 3.704 6 4.884v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
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
              </div>
            ))}
          </div>
        </DragDropContext>
      </main>

      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={closeModal}
        onSubmit={handleCreateTask}
        titulo={titulo}
        setTitulo={setTitulo}
        descricao={descricao}
        setDescricao={setDescricao}
        modalTitle="Criar Nova Tarefa"
        submitButtonText="Criar Tarefa"
      />

      {selectedTask && (
        <TaskModal
          isOpen={isEditModalOpen}
          onClose={closeModal}
          onSubmit={handleUpdateTask}
          titulo={titulo}
          setTitulo={setTitulo}
          descricao={descricao}
          setDescricao={setDescricao}
          modalTitle="Editar Tarefa"
          submitButtonText="Salvar Alterações"
          isEditMode={true}
          status={status}
          setStatus={setStatus}
        />
      )}
    </div>
  );
};