import styles from "./albumForm.module.css"
import { useRef } from "react";

export const AlbumForm = ({ onAdd, loading }) => {
  const albumNameInput = useRef();

  const handleClear = () => (albumNameInput.current.value = "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const albumName = albumNameInput.current.value.trim();
    if (!albumName) return;
    onAdd(albumName);
    handleClear();
  };

  return (
    <div className={styles.albumForm}>
      <span>Create an album</span>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          required
          placeholder="Album Name"
          ref={albumNameInput}
          className={styles.input}
        />

        <button
          type="button"
          onClick={handleClear}
          disabled={loading}
          className={`${styles.button} ${styles.clearBtn}`}
        >
          Clear
        </button>

        <button className={styles.button} disabled={loading}>
          Create
        </button>
      </form>
    </div>
  );
};
