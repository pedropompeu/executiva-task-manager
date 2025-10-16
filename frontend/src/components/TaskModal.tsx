import React from 'react';

type TaskStatus = 'PENDENTE' | 'EM ANDAMENTO' | 'CONCLUÍDA';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  titulo: string;
  setTitulo: (titulo: string) => void;
  descricao: string;
  setDescricao: (descricao: string) => void;
  modalTitle: string;
  submitButtonText: string;
  isEditMode?: boolean;
  status?: TaskStatus;
  setStatus?: (status: TaskStatus) => void;
}

const statusStyles: { [key in TaskStatus]: string } = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  'EM ANDAMENTO': 'bg-blue-100 text-blue-800',
  CONCLUÍDA: 'bg-green-100 text-green-800',
};

export const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  titulo, 
  setTitulo, 
  descricao, 
  setDescricao, 
  modalTitle,
  submitButtonText,
  isEditMode = false,
  status,
  setStatus,
}) => {
  if (!isOpen) return null;

 return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-4">{modalTitle}</h2>

        {isEditMode && setStatus && (
          <div className="mb-6 flex justify-center">
            <div className="inline-flex gap-2 p-1 bg-slate-100 rounded-full">
              {(Object.keys(statusStyles) as TaskStatus[]).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${
                    status === s 
                      ? `bg-white shadow text-indigo-600` 
                      : 'bg-transparent text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase().replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="titulo">
              Título
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="descricao">
              Descrição
            </label>
            <textarea
              id="descricao"
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>
          
          <div className="flex items-center justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};