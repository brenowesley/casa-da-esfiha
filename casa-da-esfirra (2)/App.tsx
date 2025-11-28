import React, { useState, useEffect, useMemo } from 'react';
import { Category, CartItem, Product } from './types';
import { MENU_ITEMS } from './constants';
import { formatCurrency, checkStoreOpen } from './utils';
import MenuItem from './components/MenuItem';
import Checkout from './components/Checkout';
import StoreStatus from './components/StoreStatus';
import { ShoppingBasket, Instagram } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'MENU' | 'CHECKOUT'>('MENU');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isStoreOpen, setIsStoreOpen] = useState(checkStoreOpen());

  // Check store status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsStoreOpen(checkStoreOpen());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === id);
      const product = MENU_ITEMS.find(p => p.id === id);
      
      if (!product) return prevCart;

      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          return prevCart.filter(item => item.id !== id);
        }
        return prevCart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item);
      } else if (delta > 0) {
        return [...prevCart, { ...product, quantity: 1 }];
      }
      return prevCart;
    });
  };

  const getQuantity = (id: string) => cart.find(item => item.id === id)?.quantity || 0;
  
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  // Group items by category
  const groupedMenu = useMemo(() => {
    const groups: Partial<Record<Category, Product[]>> = {};
    Object.values(Category).forEach(cat => {
      groups[cat] = MENU_ITEMS.filter(item => item.category === cat);
    });
    return groups;
  }, []);

  return (
    <div className="min-h-screen font-sans">
      
      {/* Header Hero */}
      <header className="bg-brand-red text-white pt-10 pb-16 px-4 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #ffcf33 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}>
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-md">
            Casa da Esfirra
          </h1>
          <p className="text-brand-yellow font-medium text-lg md:text-xl drop-shadow-sm">
            Sabor que conquista desde o primeiro pedaço!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 -mt-8 relative z-20">
        
        {view === 'MENU' ? (
          <>
            <StoreStatus isOpen={isStoreOpen} />

            <div className="max-w-2xl mx-auto mt-6 space-y-8 pb-24">
              {Object.entries(groupedMenu).map(([category, items]) => (
                <section key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <h2 className="bg-white px-6 py-4 border-b border-gray-100 text-xl font-bold text-brand-red flex items-center gap-2 sticky top-0 z-10">
                    <div className="w-1.5 h-6 bg-brand-red rounded-full mr-2"></div>
                    {category}
                  </h2>
                  <div className="divide-y divide-gray-50">
                    {(items as Product[])?.map(product => (
                      <MenuItem 
                        key={product.id} 
                        product={product} 
                        quantity={getQuantity(product.id)}
                        onUpdateQuantity={handleUpdateQuantity}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Floating Footer for Menu */}
            {subtotal > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 animate-slide-up">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium">Total do pedido</span>
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <button 
                    onClick={() => {
                        window.scrollTo(0,0);
                        setView('CHECKOUT');
                    }}
                    className="bg-brand-red hover:bg-brand-darkRed text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Avançar</span>
                    <ShoppingBasket size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Checkout 
            cart={cart} 
            subtotal={subtotal} 
            isStoreOpen={isStoreOpen}
            onBack={() => {
                window.scrollTo(0,0);
                setView('MENU');
            }} 
          />
        )}
      </main>

      <footer className="py-8 text-center text-gray-400 text-sm mt-8 pb-28">
        <p className="mb-4">© 2025 Casa da Esfirra — Sabor que conquista!</p>
        <a 
          href="https://www.instagram.com/casadaesfihaitabuna" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-brand-red font-semibold hover:text-brand-darkRed transition-colors"
        >
          <Instagram size={18} /> Siga-nos no Instagram
        </a>
      </footer>
    </div>
  );
};

export default App;