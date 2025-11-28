import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils';
import { Plus, Minus } from 'lucide-react';

interface MenuItemProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (id: string, delta: number) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ product, quantity, onUpdateQuantity }) => {
  return (
    <div className={`
      flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors
      ${quantity > 0 ? 'bg-brand-yellow/5 border-l-4 border-l-brand-red pl-3' : ''}
    `}>
      <div className="flex-1 pr-4">
        <h3 className={`font-semibold text-gray-800 ${quantity > 0 ? 'text-brand-darkRed' : ''}`}>
          {product.name}
        </h3>
        <p className="text-brand-red font-bold">{formatCurrency(product.price)}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdateQuantity(product.id, -1)}
          disabled={quantity === 0}
          className={`
            w-8 h-8 flex items-center justify-center rounded-full transition-all
            ${quantity === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-brand-yellow text-brand-darkRed hover:bg-brand-yellowHover shadow-sm hover:scale-105 active:scale-95'}
          `}
          aria-label="Decrease quantity"
        >
          <Minus size={16} strokeWidth={3} />
        </button>

        <span className={`w-6 text-center font-bold ${quantity > 0 ? 'text-black' : 'text-gray-400'}`}>
          {quantity}
        </span>

        <button
          onClick={() => onUpdateQuantity(product.id, 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-yellow text-brand-darkRed hover:bg-brand-yellowHover shadow-sm transition-all hover:scale-105 active:scale-95"
          aria-label="Increase quantity"
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default MenuItem;