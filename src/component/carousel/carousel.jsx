import styles from "./carousel.module.css";

export const Carousel = ({ onNext, onPrev, onCancel, url, title }) => {
  return (
    <div className={styles.carousel}>
      <button className={styles.closeBtn} onClick={onCancel}>x</button>
      <button className={styles.navBtn} onClick={onPrev}>{"<"}</button>

      <img src={url} alt={title} className={styles.image} />

      <button className={styles.navBtn} onClick={onNext}>{">"}</button>
    </div>
  );
};
