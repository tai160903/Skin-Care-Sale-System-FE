import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import router from "./routes";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RouterProvider>
    </PersistGate>
  </Provider>,
);
