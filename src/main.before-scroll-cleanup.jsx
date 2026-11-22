import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import ScrollAnimations from "./components/app/ScrollAnimations";
import { store } from "./store/store";
import { queryClient } from "./services/queryClient";
import "./index.css";
import "./theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollAnimations />
          <App />
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 2500,
              style: {
                background: "#1D2429",
                color: "#fff",
                borderRadius: "12px",
                padding: "14px 18px",
              },
              success: {
                iconTheme: {
                  primary: "#FC7311",
                  secondary: "#fff",
                },
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
