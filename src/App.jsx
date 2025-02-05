import { ToastContainer } from "react-toastify";
import Router from "./routes";

function App() {
  return (
    <>
      <Router />
      <ToastContainer limit={4} autoClose={1000} stacked />
    </>
  );
}

export default App;
