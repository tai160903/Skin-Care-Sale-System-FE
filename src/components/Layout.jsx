import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer";
import Nav from "./Header/Nav";
import Banner from "./Header/Banner";

function Layout() {
  const location = useLocation();
  const pathname = location.pathname;

  const paths = [
    "/login",
    "/signin",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/profile/:userId",
  ];

  const hideHeaderFooter = paths.some((path) => {
    if (path.includes(":userId")) {
      return pathname.startsWith("/profile/");
    }
    return path === pathname;
  });
  return (
    <>
      {!hideHeaderFooter && (
        <header>
          <Banner />
          <Header />
          <Nav />
        </header>
      )}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {!hideHeaderFooter && (
        <footer>
          <Footer />
        </footer>
      )}
    </>
  );
}

export default Layout;
