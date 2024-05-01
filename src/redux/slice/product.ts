import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface LoadingState {
  isLoadingScreenDisplay: boolean;
}

type ProductState = {
  products: Product[];
} & LoadingState;

const initialState: ProductState = {
  products: [],
  isLoadingScreenDisplay: false,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts(state, action) {
      state.products = action.payload;
    },
    addProduct(state, action) {
      state.products.push(action.payload);
    },
    setLoadingScreenDisplay: (state, action: PayloadAction<LoadingState["isLoadingScreenDisplay"]>) => {
      state.isLoadingScreenDisplay = action.payload;
    },
  },
});

export const { 
  setProducts, 
  addProduct,
  setLoadingScreenDisplay
 } = productSlice.actions;
export default productSlice.reducer;
