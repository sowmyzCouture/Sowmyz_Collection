import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";

export const Acc = ({ editing, onSaved, onCancel }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!status.message) return;
    const timeout = window.setTimeout(() => setStatus({ type: "", message: "" }), 3500);
    return () => window.clearTimeout(timeout);
  }, [status]);

  useEffect(() => {
    if (!editing) return;
    setName(editing.name ?? "");
    setCategory(editing.category ?? "");
    setPrice(editing.price?.toString() ?? "");
    setImageUrl(editing.image ?? "");
    setImageDataUrl("");
    setImageFile(null);
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !category.trim() || !price) {
      setStatus({
        type: "error",
        message: "Please fill in all fields (name + category + price)",
      });
      return;
    }

    const image = imageDataUrl || imageUrl?.trim() || "";

    setLoading(true);
    try {
      if (editing) {
        const accessoryRef = doc(db, "accessories", editing.id);
        await updateDoc(accessoryRef, {
          name: name.trim(),
          category: category.trim(),
          price: Number(price),
          image,
          updatedAt: serverTimestamp(),
        });
        setStatus({ type: "success", message: "Accessory updated successfully" });
        onSaved?.();
      } else {
        await addDoc(collection(db, "accessories"), {
          name: name.trim(),
          category: category.trim(),
          price: Number(price),
          image,
          createdAt: serverTimestamp(),
        });
        setStatus({ type: "success", message: "Accessory added successfully" });
      }

      setName("");
      setCategory("");
      setPrice("");
      setImageUrl("");
      setImageFile(null);
      setImageDataUrl("");
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Something went wrong, check console" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="add-accessory">
      <header className="form-header">
        <h1>{editing ? "Edit accessory" : "Add a new Product"}</h1>
        <p>
          {editing
            ? "Update the details below, or cancel to start a new one."
            : "Enter a name, price, and optionally upload a file or enter an image URL. Your list will update instantly."}
        </p>
      </header>

      <form className="card form-card" onSubmit={handleSubmit}>
        <label className="field">
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Floral dress"
            disabled={loading}
          />
        </label>

        <label className="field">
          <span>Category</span>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Blazer, Men’s blazer"
            list="dresses"
            disabled={loading}
          />
          <datalist id="dresses" >
            <option value="blazer">blazer</option>
            <option value="accessory">accessory</option>
            <option value="girlbaby">girlbaby</option>
          </datalist>
        </label>

        <label className="field">
          <span>Price (₹)</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 2499"
            min="0"
            step="1"
            disabled={loading}
          />
        </label>

        <label className="field">
          <span>Image (optional file)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setImageFile(file);
              if (!file) {
                setImageDataUrl("");
                return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                setImageDataUrl(reader.result?.toString() || "");
              };
              reader.readAsDataURL(file);
            }}
            disabled={loading}
          />
        </label>
 
        <label className="field">
          <span>Image (optional URL)</span>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="e.g. https://example.com/photo.jpg"
            disabled={loading}
          />
        </label>

        <div className="form-actions">
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading
              ? "Saving…"
              : editing
              ? "Update Accessory"
              : "Add Accessory"}
          </button>

          {editing && (
            <button
              type="button"
              className="secondary-btn"
              disabled={loading}
              onClick={() => {
                onCancel?.();
                setName("");
                setPrice("");
                setImageUrl("");
                setImageFile(null);
                setImageDataUrl("");
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {status.message && (
          <div className={`toast ${status.type}`}>{status.message}</div>
        )}
      </form>
    </section>
  );
};
