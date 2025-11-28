export enum Category {
  TRADICIONAL = 'Esfihas Tradicionais',
  PREMIUM = 'Esfihas Premium',
  DOCE = 'Esfihas Doces',
  BEBIDAS = 'Bebidas'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DeliveryFeeMap {
  [key: string]: number;
}

export type DeliveryType = 'delivery' | 'pickup';
export type PaymentMethod = 'Pix' | 'Cartao' | 'Dinheiro';

export interface CustomerData {
  name: string;
  deliveryType: DeliveryType;
  bairro: string;
  rua: string;
  numero: string;
  complemento: string;
  referencia: string;
  paymentMethod: PaymentMethod;
  changeFor: string; // Troco
  observation: string;
}