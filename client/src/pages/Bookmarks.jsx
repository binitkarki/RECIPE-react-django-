import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookmarksAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { IoIosTimer } from "react-icons/io";
import { IoPeopleSharp } from "react-icons/io5";
import { SiLevelsdotfyi } from "react-icons/si";
import { IoArrowBack } from "react-icons/io5";
import "../styles/Grid.css";
import "../styles/RecipeDetail.css"; 

export default function Bookmarks() {
  const { accessToken } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) { navigate("/"); return; }
    BookmarksAPI.list().then((res) => setBookmarks(res.data)).catch(() => {});
  }, [accessToken, navigate]);

  const removeBookmark = async (bookmarkId) => {
    await BookmarksAPI.remove(bookmarkId);
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
  };

  return (
    <div>
      <div className="list-header">
        <span className="back-arrow" onClick={() => navigate(-1)}>
          <IoArrowBack />
        </span>
        <h2>Bookmarked recipes</h2>
      </div>
      <div className="grid grid-6">
        {bookmarks.map((b) => (
          <div className="card-block" key={b.id}>
            <Link to={`/recipes/${b.recipe.id}`} className="image-card hover-zoom">
              <img src={b.recipe.image} alt={b.recipe.title} />
              <div className="image-overlay">
                <h4 className="overlay-title">{b.recipe.title}</h4>
                <div className="overlay-meta icons">
                  <span><IoIosTimer /> {b.recipe.cooking_time} min</span>
                  <span><IoPeopleSharp /> {b.recipe.servings}</span>
                  <span><SiLevelsdotfyi /> {b.recipe.difficulty}</span>
                </div>
              </div>
            </Link>
            <div className="card-actions">
              <button onClick={() => removeBookmark(b.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
