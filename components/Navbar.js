// components/Navbar.js
import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Image src="hori.png" alt="Your Logo" />
      </div>
      <input
        type="checkbox"
        className={styles["menu-toggle"]}
        id="menu-toggle"
      />
      <label htmlFor="menu-toggle" className={styles["menu-icon"]}>
        &#9776;
      </label>
      <div className={styles["nav-links"]}>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/start">Getting Started</Link>
          </li>
          <li>
            <Link href="/tools">Tools</Link>
          </li>
          <li>
            <Link href="/apis">APIs</Link>
          </li>
        </ul>
      </div>
      <div className={styles.auth}>
        <Link className="loginBtn" href="/login">
          Login/Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
