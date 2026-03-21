import React, { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const Acclist = ({ onEdit }) => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "accessories"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
        setSelected((prev) => (prev || data[0] || null));
        setLoading(false);
      },
      (err) => {
        console.error("Error loading accessories", err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this accessory?")) return;
    try {
      await deleteDoc(doc(db, "accessories", id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const filteredProducts = useMemo(() => {
    const searchTextLower = searchText.trim().toLowerCase();
    if (!searchTextLower) return products;

    return products.filter((item) => {
      return (
        item.name?.toLowerCase().includes(searchTextLower) ||
        item.category?.toLowerCase().includes(searchTextLower) ||
        item.price?.toString().includes(searchTextLower)
      );
    });
  }, [products, searchText]);

  useEffect(() => {
    if (!filteredProducts.length) {
      setSelected(null);
      return;
    }

    if (!filteredProducts.some((item) => item.id === selected?.id)) {
      setSelected(filteredProducts[0]);
    }
  }, [filteredProducts, selected?.id]);

  return (
    <section className="manage-view">
      <div className="manage-list">
        <header className="grid-header">
          <h2>Accessories</h2>
          <p className="subtle">
            {loading
              ? "Loading…"
              : `${filteredProducts.length} of ${products.length} items`}
          </p>
          <input
            type="text"
            placeholder="Search by name, category, or price"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </header>

        {loading ? (
          <div className="empty-state">Loading accessories…</div>
        ) : products.length === 0 ? (
          <div className="empty-state">No accessories yet. Add one above.</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">No results match your search.</div>
        ) : (
          <div className="product-list">
            {filteredProducts.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`card product-card list-item ${selected?.id === item.id ? "selected" : ""}`}
                onClick={() => setSelected(item)}
              >
                <div className="card-body">
                  <h3>{item.name}</h3>
                  <p className="subtle">{item.category}</p>
                  <p className="price">₹{item.price}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="manage-preview">
        <header className="grid-header">
          <h2>Preview</h2>
          <p className="subtle">Select an item to see a full view</p>
        </header>

        {selected ? (
          <div className="preview-card card">
            <div className="preview-image">
              {selected.image ? (
                <img src={selected.image} alt={selected.name} loading="lazy" />
              ) : (
                <div className="image-placeholder">No image</div>
              )}
            </div>
            <div className="card-body">
              <h3>{selected.name}</h3>
              <p className="subtle">{selected.category}</p>
              <p className="price">₹{selected.price}</p>
              <div className="card-actions">
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => onEdit?.(selected)}
                >
                  Edit
                </button>
                <button
                  className="danger-btn"
                  type="button"
                  onClick={() => handleDelete(selected.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">Select a product to preview</div>
        )}
      </div>
    </section>
  );
};
