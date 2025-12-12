import styles from "./albumList.module.css";
import albumlogo from "../../assets/album.png";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "react-spinner-material";

// firebase imports
import { Timestamp } from "firebase/firestore";
import { addAlbumApi, deleteAlbumApi, fetchAlbumsApi } from "../../api/albumApi.js";

// components imports
import {AlbumForm} from "../albumForm/albumForm.jsx"
import { ImageList } from "../imageList/imageList.jsx";

export const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [active, setActive] = useState(null);

  const fetchAlbums = async () => {
    setLoading(true);
    const data = await fetchAlbumsApi();
    setAlbums(data);
    setLoading(false);
  };

  const deleteAlbum = async (id) => {
    await deleteAlbumApi(id);
    setAlbums((prev) => prev.filter((a) => a.id !== id));
    toast.success("Album deleted.");
  };

  const addAlbum = async (name) => {
    if (albums.find((a) => a.name === name)) {
      return toast.error("Album name already exists.");
    }
    setAdding(true);
    const newAlbum = await addAlbumApi({
      name,
      created: Timestamp.now(),
    });

    setAlbums((prev) => [newAlbum, ...prev]);
    setAdding(false);
    toast.success("Album added.");
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  if (loading) {
    return (
      <div className={styles.loader}>
        <Spinner color="#0077ff" />
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <>
        <div className={styles.top}>
          <h3>No albums found.</h3>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add album"}
          </button>
        </div>
        {showForm && <AlbumForm onAdd={addAlbum} />}
      </>
    );
  }

  return (
    <>
      {showForm && !active && (
        <AlbumForm loading={adding} onAdd={addAlbum} />
      )}

      {!active && (
        <div>
          <div className={styles.top}>
            <h3>Your albums</h3>
            <button
              className={showForm ? styles.active : ""}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "Add album"}
            </button>
          </div>

          <div className={styles.albumsList}>
            {albums.map((album) => (
              <div
                key={album.id}
                className={styles.album}
                onClick={() =>
                  setActive(active === album.name ? null : album.name)
                }
              >
                <img src={albumlogo} alt="album" />
                <span>{album.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {active && (
        <ImageList
          albumId={albums.find((a) => a.name === active).id}
          albumName={active}
          onBack={() => setActive(null)}
        />
      )}
    </>
  );
};
