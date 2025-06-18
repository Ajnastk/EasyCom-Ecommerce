"use client";

import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store/store";

export function Providers({ children }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        {/* {console.log("Redux Store: ",store)} */}
        {children}
      </ReduxProvider>
    </SessionProvider>
  );
}
