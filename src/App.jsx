// import { Outlet, useLocation } from "react-router-dom";
// import Header from "./components/Header/Header";
// import Footer from "./components/Footer";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Loading from "./components/Loading";
// import { useEffect, useState } from "react";

import { ToastContainer } from "react-toastify";
import Router from "./routes";

// function App() {
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();
//   const [showHeader, setShowHeader] = useState(true);
//   const [showFooter, setShowFooter] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     const timer = setTimeout(() => setLoading(false), 300);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     const hideHeaderAndFooterPaths = [
//       "/signin",
//       "/signup",
//       "/verify-email",
//       "/forgot-password",
//       "/verify-reset-password",
//     ];

//     if (hideHeaderAndFooterPaths.includes(location.pathname)) {
//       setShowHeader(false);
//       setShowFooter(false);
//     } else {
//       setShowHeader(true);
//       setShowFooter(true);
//     }
//   }, [location.pathname]);

//   return (
//     <>
//       {loading ? (
//         <Loading />
//       ) : (
//         <>
//           {showHeader && <Header />}
//           <main>
//             <Outlet />
//           </main>
//           {showFooter && <Footer />}
//           <ToastContainer limit={1} />
//         </>
//       )}
//     </>
//   );
// }

// export default App;
function App() {
  return (
    <>
      <Router />
      <ToastContainer limit={4} autoClose={1000} stacked />
    </>
  );
}

export default App;
