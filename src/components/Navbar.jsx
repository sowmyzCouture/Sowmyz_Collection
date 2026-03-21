import React from "react";

export const Navbar = ({ page, onNavigate }) => {
  return (
    <nav className="navbar">
      <div className="navbar__brand" onClick={() => onNavigate("add")}> 
        <span className="brand-dot" />
        <span>Sowmyz Lab</span>
      </div>
      <div className="navbar__links">
        <button
          type="button"
          className={page === "add" ? "active" : ""}
          onClick={() => onNavigate("add")}
        >
          Add
        </button>
        <button
          type="button"
          className={page === "manage" ? "active" : ""}
          onClick={() => onNavigate("manage")}
        >
          Manage
        </button>
      </div>
    </nav>
  );
};
