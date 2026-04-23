import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LocalCartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  vendorId?: string;
}

interface CartState {
  localItems: LocalCartItem[];
}

// Helper to load from localStorage
const loadCartFromStorage = (): LocalCartItem[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('mallx_guest_cart');
  return saved ? JSON.parse(saved) : [];
};

const initialState: CartState = {
  localItems: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToLocalCart: (state, action: PayloadAction<LocalCartItem>) => {
      const existing = state.localItems.find(item => item.productId === action.payload.productId);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.localItems.push(action.payload);
      }
      localStorage.setItem('mallx_guest_cart', JSON.stringify(state.localItems));
    },
    removeFromLocalCart: (state, action: PayloadAction<string>) => {
      state.localItems = state.localItems.filter(item => item.productId !== action.payload);
      localStorage.setItem('mallx_guest_cart', JSON.stringify(state.localItems));
    },
    updateLocalQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.localItems.find(i => i.productId === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      localStorage.setItem('mallx_guest_cart', JSON.stringify(state.localItems));
    },
    clearLocalCart: (state) => {
      state.localItems = [];
      localStorage.removeItem('mallx_guest_cart');
    },
  },
});

export const { addToLocalCart, removeFromLocalCart, updateLocalQuantity, clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
