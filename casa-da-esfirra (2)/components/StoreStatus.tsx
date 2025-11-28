import React from 'react';
import { OPENING_HOUR, OPENING_MINUTE, CLOSING_HOUR, CLOSING_MINUTE } from '../constants';

interface StoreStatusProps {
  isOpen: boolean;
}

const StoreStatus: React.FC<StoreStatusProps> = ({ isOpen }) => {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday
  const isMonday = today === 1;

  // Formata hora/minuto com zero à esquerda se necessário (ex: 17:30)
  const pad = (n: number) => n.toString().padStart(2, '0');
  const openTime = `${pad(OPENING_HOUR)}:${pad(OPENING_MINUTE)}`;
  const closeTime = `${pad(CLOSING_HOUR)}:${pad(CLOSING_MINUTE)}`;

  return (
    <div className={`
      mx-auto max-w-2xl mt-6 rounded-xl shadow-sm border px-4 py-4 text-center font-bold text-sm md:text-base transition-colors duration-300
      ${isOpen 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800'}
    `}>
      {isOpen ? (
        <span className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <span className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            ✅ Estamos Abertos!
          </span>
          <span className="font-normal text-sm opacity-90 hidden sm:inline">-</span>
          <span className="text-xs sm:text-sm font-normal">
            Fecha às {closeTime}h
          </span>
        </span>
      ) : (
        <span className="flex flex-col items-center justify-center gap-1">
           <span className="flex items-center gap-2">⛔ Loja Fechada</span>
           <span className="text-xs font-normal opacity-90">
             {isMonday 
               ? "Hoje (Segunda) não abrimos. Funcionamos de Terça a Domingo." 
               : `Abrimos hoje às ${openTime}h. (Terça a Domingo)`}
           </span>
        </span>
      )}
    </div>
  );
};

export default StoreStatus;