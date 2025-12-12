import styles from "./navbar.module.css";
import logo from "../../assets/photofolio-icon.webp";

export const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div
        className={styles.logo}
        onClick={() => window.location.replace("/")}
      >
        <img src={logo} alt="logo" />
        <span className={styles.brand}>PhotoFolio</span>
      </div>
    </div>
  );
};
