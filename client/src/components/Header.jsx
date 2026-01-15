import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthAPI } from "../utils/api";
import LoginModal from "./LoginModal";
import "../styles/Header.css";

export default function Header() {
  const { user, login, logout } = useAuth();
  const [search, setSearch] = useState("");   // single search input
  const [showAuth, setShowAuth] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const onSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const openLogin = () => { setIsSignup(false); setShowAuth(true); };

  const onAuthSubmit = async (username, password) => {
    try {
      if (isSignup) await AuthAPI.register(username, password);
      const res = await AuthAPI.login(username, password);
      login({ username, access: res.data.access });
      setShowAuth(false);
    } catch {
      alert("Authentication failed");
    }
  };

  return (
    <header className="header">
      <Link to="/" className="logo">Recipe</Link>

      <form className="search" onSubmit={onSearch}>
        <input
          type="text"
          placeholder="Search recipes by title, ingredient, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {!user ? (
        <div className="auth-cta">
          <button className="primary" onClick={openLogin}>Log in</button>
        </div>
      ) : (
        <div className="profile">
          <button className="avatar" onClick={() => setMenuOpen((v) => !v)}>
            {user.username.charAt(0).toUpperCase()}
          </button>
          {menuOpen && (
            <div className="menu">
              <button onClick={() => navigate("/my-recipes")}>My recipes</button>
              <button onClick={() => navigate("/bookmarks")}>Bookmarks</button>
              <button onClick={() => { logout(); navigate("/"); }}>Log out</button>
            </div>
          )}
        </div>
      )}

      {showAuth && (
        <LoginModal
          isSignup={isSignup}
          onClose={() => setShowAuth(false)}
          onSubmit={onAuthSubmit}
          switchMode={() => setIsSignup((v) => !v)}
        />
      )}
    </header>
  );
}
