import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { QuickView } from "../../pages";
const MainLayout = () => {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
        <QuickView />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;