import styles from "./imageList.module.css";
import backlogo from "../../assets/back.png";
import editlogo from "../../assets/edit.png";
import searchlogo from "../../assets/search.png";
import trashlogo from "../../assets/trash.png";
import clearlogo from "../../assets/clear.png";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "react-spinner-material";

// components
import { ImageForm } from "../imageForm/imageFormComponent.jsx";
import { Carousel } from "../carousel/Carousel.jsx";

// api
import {
  fetchImagesApi,
  addImageApi,
  updateImageApi,
  deleteImageApi,
} from "../../api/imageApi.js";

export const ImageList = ({ albumId, albumName, onBack }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [mode, setMode] = useState(null); // "add" | "update"
  const [currentImage, setCurrentImage] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    const data = await fetchImagesApi(albumId);
    setImages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, [albumId]);

  const handleAdd = async ({ title, url }) => {
    const newImage = await addImageApi(albumId, { title, url });
    setImages([newImage, ...images]);
    toast.success("Image added.");
    setMode(null);
  };

  const handleUpdate = async ({ title, url }) => {
    const updated = await updateImageApi(albumId, currentImage.id, {
      title,
      url,
    });
    setImages(images.map((i) => (i.id === updated.id ? updated : i)));
    toast.success("Image updated.");
    setMode(null);
    setCurrentImage(null);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteImageApi(albumId, id);
    setImages(images.filter((i) => i.id !== id));
    toast.success("Image deleted.");
  };

  const filtered = images.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.loader}>
        <Spinner color="#0077ff" />
      </div>
    );
  }

  if (selectedImageIndex !== null) {
    const img = filtered[selectedImageIndex];
    return (
      <Carousel
        title={img.title}
        url={img.url}
        onNext={() =>
          setSelectedImageIndex(
            selectedImageIndex === filtered.length - 1 ? 0 : selectedImageIndex + 1
          )
        }
        onPrev={() =>
          setSelectedImageIndex(
            selectedImageIndex === 0 ? filtered.length - 1 : selectedImageIndex - 1
          )
        }
        onCancel={() => setSelectedImageIndex(null)}
      />
    );
  }

  return (
    <>
      {mode === "add" && <ImageForm albumName={albumName} onAdd={handleAdd} />}

      {mode === "update" && (
        <ImageForm
          albumName={albumName}
          onUpdate={handleUpdate}
          updateIntent={currentImage}
        />
      )}

      <div className={styles.top}>
        <span onClick={onBack}>
          <img src={backlogo} alt="back" />
        </span>

        <h3>Images in {albumName}</h3>

        <div className={styles.search}>
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search ? (
            <img src={clearlogo} alt="clear" onClick={() => setSearch("")} />
          ) : (
            <img src={searchlogo} alt="search" />
          )}
        </div>

        {mode ? (
          <button className={styles.active} onClick={() => setMode(null)}>
            Cancel
          </button>
        ) : (
          <button onClick={() => setMode("add")}>Add image</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <h4 style={{ textAlign: "center" }}>No images found.</h4>
      ) : (
        <div className={styles.imageList}>
          {filtered.map((img, i) => (
            <div
              key={img.id}
              className={styles.image}
              onClick={() => setSelectedImageIndex(i)}
            >
              <div
                className={styles.update}
                onClick={(e) => {
                  e.stopPropagation();
                  setMode("update");
                  setCurrentImage(img);
                }}
              >
                <img src={editlogo} alt="edit" />
              </div>

              <div className={styles.delete} onClick={(e) => handleDelete(e, img.id)}>
                <img src={trashlogo} alt="delete" />
              </div>

              <img
                src={img.url}
                alt={img.title}
                onError={(e) => (e.currentTarget.src = "/assets/warning.png")}
              />
              <span>{img.title.substring(0, 20)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
