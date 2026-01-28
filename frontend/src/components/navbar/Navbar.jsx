import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Search from "../../features/search/components/Search";
import styles from "./Navbar.module.css";

import {
  HiOutlineLogout,
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
  HiOutlineUser,
} from "react-icons/hi";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai";
import { useCartContext } from "../../context/CartContext";
import { Cart } from "../../pages";
import Button from "../ui/button/Button";
import { useAuthContext } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { openModal, closeModal } from "../../store/modalSlice";
import { useDispatch, useSelector } from "react-redux";
const navLinks = [
  { label: "Laptops", path: "collections/laptops" },
  { label: "Monitors", path: "collections/monitors" },
  { label: "Workstations", path: "collections/workstations" },
  { label: "Accessories", path: "collections/accessories" },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const {activeModal} = useSelector(state => state.modal);
  const { isAdmin, isAuthenticated, logout } = useAuthContext();
  const { items } = useCartContext();

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track window width
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldShowMenu = menuOpen || windowWidth >= 768;
  const showCart = activeModal === "cart"; // automatically shows close button when cart modal is open

  // Admin handlers
  const handleDashboardClick = () => navigate("/admin");
  const handleLogoutClick = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <nav
      className={`sec-container ${styles.navbar} ${
        isScrolled ? styles.scrolled : ""
      } ${menuOpen ? styles.menuOpen : ""}`}
    >
      {/* TOP BAR */}
      <div className={styles.navTop}>
        <div className={styles.topLeft}>
          <button
            className={styles.menuBtn}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
          >
            {menuOpen ? <RxCross2 size={28} /> : <RxHamburgerMenu size={28} />}
          </button>

          <Link to="/" className={styles.logo}>
            <img src="/images/logo-dell.avif" alt="Dell logo" />
          </Link>

          <div className={styles.searchDesktop}>
            <Search />
          </div>
        </div>

        {!showCart ? (
          <div className={styles.userCartBtns}>
            {isScrolled &&
              (showSearch ? (
                <button
                  className={styles.searchBtn}
                  aria-label="Search"
                  onClick={() => setShowSearch(false)}
                >
                  <RxCross2 />
                </button>
              ) : (
                <button
                  className={styles.searchBtn}
                  aria-label="Search"
                  onClick={() => setShowSearch(true)}
                >
                  <FiSearch />
                </button>
              ))}

            {/* Admin / User Buttons */}
            {!isAdmin ? (
              <>
                {!isAuthenticated ? (
                  <button
                    className={styles.userBtn}
                    onClick={() => navigate("/auth/login")}
                    title="Account"
                  >
                    <HiOutlineUser />
                    <span className={styles.btnText}>Account</span>
                  </button>
                ) : (
                  <>
                    <button
                      className={styles.userBtn}
                      onClick={handleLogoutClick} title="Logout"
                    >
                      <HiOutlineLogout />
                      <span className={styles.btnText}>Logout</span>
                    </button>
                    <button
                      className={styles.userBtn}
                      onClick={() => navigate('/profile')} title="Profile"
                    >
                      <FaUserCircle />
                      <span className={styles.btnText}>Profile</span>
                    </button>
                    <button
                      className={styles.userBtn}
                      onClick={() => navigate('/orders')} title="Orders"
                    >
                      <HiOutlineShoppingBag />
                      <span className={styles.btnText}>Orders</span>
                    </button>
                  </>
                )}

                <button
                  className={styles.cartBtn}
                  onClick={() => dispatch(openModal({type: 'cart'}))} title="Cart"
                >
                  <HiOutlineShoppingCart />
                  <span className={styles.cartText}>Cart</span>
                  {items.length > 0 && (
                    <span className={styles.cartCount}>{items.length}</span>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  className={styles.adminBtn}
                  onClick={handleDashboardClick} title="Dashboard"
                >
                  <AiOutlineDashboard />
                  <span className={styles.btnText}>Dashboard</span>
                </button>

                <button className={styles.adminBtn} onClick={handleLogoutClick} title="Logout">
                  <HiOutlineLogout />
                  <span className={styles.btnText}>Logout</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => dispatch(closeModal())} >
            <span>Close</span> <RxCross2 size={22} title="Close" />
          </Button>
        )}
      </div>

      {/* Cart and Search */}
      <Cart />
      {!showCart && showSearch && <Search />}
      {!isScrolled && !showSearch && (
        <div className={styles.navBottom}>
          <Search />
        </div>
      )}

      {/* Responsive Menu */}
      {shouldShowMenu && (
        <ul className={styles.navLinks}>
          {navLinks.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              onClick={() => windowWidth < 768 && setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
