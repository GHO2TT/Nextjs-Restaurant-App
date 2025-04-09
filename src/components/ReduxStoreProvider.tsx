"use client";
import { Provider } from "react-redux";
import store, { persistor } from "@/utils/store";
import { PersistGate } from "redux-persist/integration/react";

export default function ReduxProvider({ children }: React.PropsWithChildren) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
