import { Category, Product, DeliveryFeeMap } from './types';

export const OPENING_HOUR = 17;
export const OPENING_MINUTE = 30;
export const CLOSING_HOUR = 22;
export const CLOSING_MINUTE = 30;

export const MENU_ITEMS: Product[] = [
  // Tradicionais
  { id: 't1', name: 'Carne', price: 6.00, category: Category.TRADICIONAL },
  { id: 't2', name: 'Carne com queijo', price: 7.00, category: Category.TRADICIONAL },
  { id: 't3', name: 'Carne com bacon', price: 10.00, category: Category.TRADICIONAL },
  { id: 't4', name: 'Queijo', price: 7.00, category: Category.TRADICIONAL },
  { id: 't5', name: 'Queijo com milho', price: 8.00, category: Category.TRADICIONAL },
  { id: 't6', name: 'Calabresa', price: 7.00, category: Category.TRADICIONAL },
  { id: 't7', name: 'Calabresa com queijo', price: 8.00, category: Category.TRADICIONAL },
  { id: 't8', name: 'Frango', price: 7.00, category: Category.TRADICIONAL },
  { id: 't9', name: 'Frango com catupiry', price: 8.00, category: Category.TRADICIONAL },
  { id: 't10', name: 'Mista', price: 8.00, category: Category.TRADICIONAL },

  // Premium
  { id: 'p1', name: 'Carne seca com banana e queijo', price: 10.00, category: Category.PREMIUM },
  { id: 'p2', name: 'Atum com queijo', price: 9.00, category: Category.PREMIUM },
  { id: 'p3', name: 'Bacon', price: 9.00, category: Category.PREMIUM },
  { id: 'p4', name: 'Salaminho', price: 9.00, category: Category.PREMIUM },
  { id: 'p5', name: 'Palmito', price: 10.00, category: Category.PREMIUM },
  { id: 'p7', name: 'Tomate seco', price: 9.00, category: Category.PREMIUM },

  // Doces
  { id: 'd1', name: 'Romeu e Julieta', price: 9.00, category: Category.DOCE },
  { id: 'd2', name: 'Chocolate com granulado', price: 9.00, category: Category.DOCE },
  { id: 'd3', name: 'Doce de leite', price: 9.00, category: Category.DOCE },
  { id: 'd4', name: 'Chocolate com M&M', price: 10.00, category: Category.DOCE },
  { id: 'd5', name: 'Nutella', price: 10.00, category: Category.DOCE },
  { id: 'd6', name: 'Bueno', price: 10.00, category: Category.DOCE },
  { id: 'd7', name: 'Pistache', price: 10.00, category: Category.DOCE },
  { id: 'd8', name: 'Ninho', price: 10.00, category: Category.DOCE },

  // Bebidas
  { id: 'b1', name: 'Refrigerante lata 350ml', price: 6.00, category: Category.BEBIDAS },
  { id: 'b2', name: 'Refrigerante 1 litro', price: 10.00, category: Category.BEBIDAS },
];

export const DELIVERY_FEES: DeliveryFeeMap = {
  // Taxas Baixas
  "centro": 7,
  "goes calmon": 8,
  "pontalzinho": 8,
  "mangabinha": 8,
  "conceicao": 8,
  "castalia": 8,
  "sao lourenco": 8,
  
  // Taxas Médias
  "banco raso": 9,
  "sao jose": 9,
  "sarinha alcantara": 12,
  "fatima": 10,
  "santo antonio": 10,
  "sao pedro": 10,
  "gloria": 10,
  "jardim primavera": 10,
  "santa ines": 12,
  "sao judas": 10,

  // Taxas Altas
  "california": 12,
  "joao soares": 12,
  "sao roque": 12,
  "sao caetano": 12,
  "novo sao caetano": 12,
  "monte libano": 12,
  "lomanto": 12,
  "monte cristo": 12,
  "jardim vitoria": 12,
  "santana": 12, 
  "odilon": 12,
  "parque boa vista": 12,
  "jacana": 13,
  "jaçana": 13,
  "pedro geronimo": 13,
  "fonseca": 13,
  "vila zanor": 13,

  // Taxas Distantes
  "ferradas": 15,
  "salobrinho": 15,
  "vila esperanca": 15,
  "nova itabuna": 15,
  "maria pinheiro": 15,
  "mutira": 15,
  "vale do sol": 15,
  "novo horizonte": 15,
  "santa clara": 15
};