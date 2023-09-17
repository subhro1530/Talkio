// components/Navbar.js
import Link from "next/link";
import { useState } from "react"; // Import useState
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false); // Initialize state

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the state
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>Your Logo</div>
      <div className={`${styles["nav-links"]} ${menuOpen ? "active" : ""}`}>
        <ul>
          <li>
            <Link href="/">
              <a>Getting Started</a>
            </Link>
          </li>
          <li>
            <Link href="/tools">
              <a>Tools</a>
            </Link>
          </li>
          <li>
            <Link href="/apis">
              <a>APIs</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className={styles.auth}>
        <Link href="/login">
          <a>Login/Signup</a>
        </Link>
      </div>
      <div className="menu-toggle" onClick={toggleMenu}>
        <span>&#9776;</span>
      </div>
    </nav>
  );
};

export default Navbar;
