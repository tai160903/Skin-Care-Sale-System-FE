import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer";
import Banner from "./Header/Banner";
import Nav from "./Header/Nav";
function Layout() {
  return (
    <>
      <header>
        <Banner />
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default Layout;
