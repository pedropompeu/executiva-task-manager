import React from 'react';

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
}

export const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  titulo, 
  setTitulo, 
  descricao, 
  setDescricao, 
  modalTitle,
  submitButtonText
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-black text-center mb-6">{modalTitle}</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="titulo">
              Título
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="descricao">
              Descrição
            </label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
