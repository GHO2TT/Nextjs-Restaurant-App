import { configureStore, createSlice } from "@reduxjs/toolkit";
import { CartState } from "@/Types/types";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";

const INITIALSTATE: CartState = {
  products: [],
};

const cartSlice = createSlice({
  name: "cartSlicer",
  initialState: INITIALSTATE,
  reducers: {
    add(state, action: { payload: { product: any } }) {
      const { id, quantity } = action.payload.product;
      // const cartProducts = state.products;

      const existingProductIndex = state.products.findIndex(
        (item) => item.id === id
      );

      if (existingProductIndex !== -1) {
        state.products[existingProductIndex].quantity += quantity;
      } else {
        // state.products = [action.payload.product, ...cartProducts];
        state.products.unshift(action.payload.product);
      }
    },

    remove(state, action: { payload: { id: string } }) {
      // const cartProducts = state.products;
      const { id } = action.payload;

      state.products = state.products.filter((item) => item.id !== id);
    },
  },
});

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  cart: cartSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

export const { actions } = cartSlice;

export default store;
export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);
