import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RecipesAPI, CommentsAPI, BookmarksAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { IoIosTimer } from "react-icons/io";
import { IoPeopleSharp } from "react-icons/io5";
import { SiLevelsdotfyi } from "react-icons/si";
import { FaEye, FaHeart, FaBookmark } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import "../styles/RecipeDetail.css";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const incrementedRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      const res = await RecipesAPI.detail(id);
      setRecipe(res.data);
      setLikesCount(res.data.likes_count || 0);
      setLiked(res.data.liked);

      const c = await CommentsAPI.list(id);
      setComments(c.data);

      if (accessToken) {
        const b = await BookmarksAPI.list();
        const found = b.data.find((x) => x.recipe.id === Number(id));
        setBookmarked(!!found);
        setBookmarkId(found ? found.id : null);
      }

      if (!incrementedRef.current) {
        incrementedRef.current = true;
        try {
          const v = await RecipesAPI.view(id);
          setRecipe((prev) =>
            prev ? { ...prev, views: v.data.views } : prev
          );
        } catch {}
      }
    };
    load().catch(() => {});
  }, [id, accessToken]);

  if (!recipe) return <p>Loading...</p>;

  const toggleBookmark = async () => {
    if (!accessToken) return alert("Please log in to bookmark recipes.");
    if (bookmarked && bookmarkId) {
      await BookmarksAPI.remove(bookmarkId);
      setBookmarked(false);
      setBookmarkId(null);
    } else {
      const res = await BookmarksAPI.add(recipe.id);
      setBookmarked(true);
      setBookmarkId(res.data.id);
    }
  };

  const toggleLike = async () => {
    if (!accessToken) return alert("Please log in to like recipes.");
    const res = await RecipesAPI.like(recipe.id);
    setLiked(res.data.liked);
    setLikesCount(res.data.likes_count);
  };

  const addComment = async () => {
    if (!accessToken) return alert("Please log in to comment.");
    if (!commentText.trim()) return;
    const res = await CommentsAPI.add(id, commentText.trim());
    setComments((prev) => [res.data, ...prev]);
    setCommentText("");
  };

  const formattedDate = recipe.created_at
    ? new Date(recipe.created_at).toLocaleDateString()
    : "";

  const imageUrl = recipe.image
    ? recipe.image.startsWith("http")
      ? recipe.image
      : `http://localhost:8000${recipe.image}`
    : null;

  return (
    <div className="detail-page">
      <div className="topbar">
        <span className="back-arrow" onClick={() => navigate(-1)}>
          <IoArrowBack />
        </span>
      </div>

      {/* HERO SECTION */}
      <section className="hero">
        {imageUrl && (
          <div
            className="hero-bg-blur"
            style={{ backgroundImage: `url(${imageUrl})` }}
          ></div>
        )}

        {imageUrl && (
          <div className="hero-image-container">
            <img src={imageUrl} alt={recipe.title} className="hero-main-img" />
          </div>
        )}

        <div className="hero-overlay">
          <div className="title-block">
            <h1>{recipe.title}</h1>
            <small className="date">{formattedDate}</small>
            <div className="meta-row">
              <span>
                <IoIosTimer /> {recipe.cooking_time} min
              </span>
              <span>
                <IoPeopleSharp /> {recipe.servings}
              </span>
              <span>
                <SiLevelsdotfyi /> {recipe.difficulty}
              </span>
            </div>
          </div>

          <div className="hero-actions">
            <div className="pill">
              <FaEye /> {recipe.views ?? 0}
            </div>
            <button
              type="button"
              className={`like ${liked ? "active" : ""}`}
              onClick={toggleLike}
            >
              <FaHeart className="icon-heart" /> {likesCount}
            </button>
            <button
              type="button"
              className={`bookmark ${bookmarked ? "active" : ""}`}
              onClick={toggleBookmark}
            >
              <FaBookmark className="icon-bookmark" />
            </button>
          </div>
        </div>
      </section>

      {/* INGREDIENTS + STEPS SECTION */}
      <section className="stream">
        <div className="stream-col scroll-hover">
          <h2>Ingredients</h2>
          {recipe.ingredients?.length ? (
            <div className="ingredients-list">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="ingredient-row">
                  <span className="quantity">{ing.quantity}</span>{" "}
                  <span className="ingredient">{ing.item}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty">No ingredients available.</p>
          )}
        </div>

        <div className="stream-col scroll-hover">
          <h2>Steps</h2>
          {recipe.steps?.length ? (
            <div className="steps-list">
              {recipe.steps.map((step, i) => (
                <div key={i} className="step-row">
                  <span className="step-circle">{i + 1}</span>
                  <span className="step-text">{step}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty">No steps available.</p>
          )}
        </div>
      </section>

      {/* COMMENTS */}
      <section className="comments">
        <h3>Comments</h3>
        <div className="comment-form compact">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button onClick={addComment}>Post</button>
        </div>

        <div className="comment-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-header">
                <img
                  className="avatar"
                  src={`https://ui-avatars.com/api/?name=${c.author}`}
                  alt={c.author}
                />
                <strong>{c.author}</strong>
                <span>
                  {c.created_at
                    ? new Date(c.created_at).toLocaleDateString()
                    : ""}
                </span>
              </div>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
