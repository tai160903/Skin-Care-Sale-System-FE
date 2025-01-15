import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import router from "./routes";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RouterProvider>
  </>,
);
