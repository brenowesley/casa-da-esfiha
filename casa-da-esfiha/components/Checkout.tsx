import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Send, MapPin, User, CreditCard, ShoppingBag, Store, 
  CheckCircle, AlertTriangle, Banknote, QrCode, Bike, Receipt
} from 'lucide-react';
import { CartItem, CustomerData, PaymentMethod } from '../types';
import { formatCurrency, generateWhatsAppMessage, getDeliveryFee } from '../utils';
import { DELIVERY_FEES } from '../constants';

interface CheckoutProps {
  cart: CartItem[];
  subtotal: number;
  isStoreOpen: boolean;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, subtotal, isStoreOpen, onBack }) => {
  const [formData, setFormData] = useState<CustomerData>({
    name: '',
    deliveryType: 'delivery',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
    referencia: '',
    paymentMethod: 'Pix',
    changeFor: '',
    observation: ''
  });

  const [fee, setFee] = useState(0);
  const [feeStatus, setFeeStatus] = useState<'valid' | 'invalid' | 'pending' | 'none'>('none');

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('customerData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed, changeFor: '' }));
      } catch (e) {
        console.error("Failed to load saved data");
      }
    }
    window.scrollTo(0, 0);
  }, []);

  // Calculate Fee
  useEffect(() => {
    if (formData.deliveryType === 'delivery') {
      const calculatedFee = getDeliveryFee(formData.bairro);
      setFee(calculatedFee);

      if (formData.bairro.length > 3) {
        if (calculatedFee > 0) setFeeStatus('valid');
        else setFeeStatus('invalid');
      } else {
        setFeeStatus('pending');
      }
    } else {
      setFee(0);
      setFeeStatus('none');
    }
  }, [formData.bairro, formData.deliveryType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const setDeliveryType = (type: 'delivery' | 'pickup') => {
    setFormData(prev => ({ ...prev, deliveryType: type }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.deliveryType === 'delivery') {
        if (!formData.bairro || !formData.rua || !formData.numero) {
            alert("Por favor, preencha o endereço completo para entrega.");
            return;
        }
    }

    if (formData.paymentMethod === 'Dinheiro' && !formData.changeFor) {
        const confirmNoChange = window.confirm("Você não informou troco. É dinheiro trocado?");
        if (!confirmNoChange) return;
    }

    localStorage.setItem('customerData', JSON.stringify({
        name: formData.name,
        deliveryType: formData.deliveryType,
        bairro: formData.bairro,
        rua: formData.rua,
        numero: formData.numero,
        complemento: formData.complemento,
        referencia: formData.referencia,
        paymentMethod: formData.paymentMethod
    }));

    const total = subtotal + fee;
    const link = generateWhatsAppMessage(cart, formData, subtotal, fee, total, isStoreOpen);
    window.open(link, '_blank');
  };

  const total = subtotal + fee;

  return (
    <div className="max-w-xl mx-auto pb-32 animate-fade-in">
      
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Finalizar Pedido</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Resumo do Pedido Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5">
            <Receipt size={100} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingBag className="text-brand-red" size={20} /> Resumo
          </h3>
          <div className="space-y-3 mb-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-start text-sm border-b border-dashed border-gray-100 pb-2 last:border-0">
                <span className="text-gray-600 font-medium">
                  <span className="text-brand-red font-bold mr-1">{item.quantity}x</span> {item.name}
                </span>
                <span className="text-gray-900 font-semibold whitespace-nowrap">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500 pt-2">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {formData.deliveryType === 'delivery' && (
            <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
              <span>Taxa de Entrega</span>
              <span className={fee > 0 ? 'text-gray-900' : 'text-orange-500 font-medium'}>
                {fee > 0 ? formatCurrency(fee) : (feeStatus === 'pending' ? 'Calculando...' : 'A combinar')}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-xl font-bold text-brand-darkRed mt-3 pt-3 border-t border-gray-100">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Dados Pessoais */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="text-brand-red" size={20} /> Seus Dados
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Nome Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-brand-red transition-colors" />
                </div>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-yellow/50 focus:border-brand-yellow transition-all" 
                  placeholder="Como devemos te chamar?"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Tipo de Entrega</label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                    formData.deliveryType === 'delivery' 
                      ? 'bg-white text-brand-red shadow-md transform scale-[1.02]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Bike size={18} /> Entrega
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                    formData.deliveryType === 'pickup' 
                      ? 'bg-white text-brand-red shadow-md transform scale-[1.02]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Store size={18} /> Retirar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Endereço (Condicional) */}
        {formData.deliveryType === 'delivery' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="text-brand-red" size={20} /> Endereço de Entrega
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Bairro</label>
                <input 
                  type="text" 
                  name="bairro"
                  list="neighborhoods"
                  required
                  autoComplete="off"
                  value={formData.bairro}
                  onChange={handleChange}
                  placeholder="Digite seu bairro..."
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-yellow/50 focus:border-brand-yellow outline-none transition-all"
                />
                <datalist id="neighborhoods">
                  {Object.keys(DELIVERY_FEES).map(key => (
                    <option key={key} value={key.charAt(0).toUpperCase() + key.slice(1)} />
                  ))}
                </datalist>

                {/* Feedback da Taxa */}
                {formData.bairro && (
                   <div className={`mt-3 rounded-lg p-3 text-sm flex items-start gap-2 border ${
                     feeStatus === 'valid' ? 'bg-green-50 border-green-100 text-green-800' : 
                     feeStatus === 'invalid' ? 'bg-orange-50 border-orange-100 text-orange-800' : 'hidden'
                   }`}>
                     {feeStatus === 'valid' ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> : <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
                     <div>
                       {feeStatus === 'valid' && <span className="font-bold">Taxa de entrega: {formatCurrency(fee)}</span>}
                       {feeStatus === 'invalid' && <span>Taxa a combinar (bairro não tabelado ou verifique a grafia).</span>}
                     </div>
                   </div>
                )}
              </div>

              <div className="grid grid-cols-[2fr_1fr] gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Rua</label>
                  <input type="text" name="rua" required value={formData.rua} onChange={handleChange} placeholder="Nome da rua" className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-yellow/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Nº</label>
                  <input type="text" name="numero" required value={formData.numero} onChange={handleChange} placeholder="123" className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-yellow/50 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Complemento / Referência</label>
                <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Apto 101, Próximo à padaria..." className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-yellow/50 outline-none transition-all" />
              </div>
            </div>
          </div>
        )}

        {/* Pagamento */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="text-brand-red" size={20} /> Como vai pagar?
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'Pix', label: 'Pix', icon: QrCode },
              { id: 'Cartao', label: 'Cartão', icon: CreditCard },
              { id: 'Dinheiro', label: 'Dinheiro', icon: Banknote }
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                  formData.paymentMethod === method.id 
                    ? 'border-brand-red bg-red-50 text-brand-red font-bold shadow-sm' 
                    : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <method.icon size={24} />
                <span className="text-xs sm:text-sm">{method.label}</span>
              </button>
            ))}
          </div>

          {formData.paymentMethod === 'Dinheiro' && (
            <div className="mt-4 animate-fade-in p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <label className="block text-sm font-bold text-yellow-900 mb-2">Troco para quanto?</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-yellow-700 font-bold">R$</span>
                <input 
                  type="text" 
                  name="changeFor"
                  value={formData.changeFor} 
                  onChange={handleChange}
                  placeholder="0,00"
                  className="block w-full pl-10 pr-4 py-2.5 border border-yellow-300 rounded-lg bg-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-yellow-900 font-medium" 
                />
              </div>
              <p className="text-xs text-yellow-700 mt-2">Deixe em branco se tiver o valor exato.</p>
            </div>
          )}
        </div>

        {/* Observações */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <label className="block text-lg font-bold text-gray-800 mb-3">Alguma observação?</label>
          <textarea 
            name="observation" 
            rows={3} 
            value={formData.observation} 
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-yellow/50 outline-none transition-all resize-none"
            placeholder="Ex: Tira a cebola, capricha no molho..."
          ></textarea>
        </div>

      </form>

      {/* Footer Fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">Total a Pagar</span>
            <span className="text-2xl font-extrabold text-brand-darkRed">{formatCurrency(total)}</span>
          </div>
          <button 
            onClick={handleSubmit} 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3.5 rounded-full font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Send size={20} className="fill-current" />
            <span className="text-base sm:text-lg">Enviar Pedido</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default Checkout;