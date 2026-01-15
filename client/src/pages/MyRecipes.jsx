// src/pages/MyRecipes.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RecipesAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { IoIosTimer } from "react-icons/io";
import { IoPeopleSharp } from "react-icons/io5";
import { SiLevelsdotfyi } from "react-icons/si";
import { IoArrowBack } from "react-icons/io5";   
import "../styles/Grid.css";
import "../styles/RecipeDetail.css";             

export default function MyRecipes() {
  const { user, accessToken } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) { navigate("/"); return; }
    RecipesAPI.mine().then((res) => setRecipes(res.data)).catch(() => {});
  }, [accessToken, navigate]);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    await RecipesAPI.remove(id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <div className="list-header">
        <span className="back-arrow" onClick={() => navigate(-1)}>
          <IoArrowBack />
        </span>
        <h2>My recipes{user ? ` — ${user.username}` : ""}</h2>
      </div>
      <div className="grid grid-6">
        {recipes.map((r) => (
          <div className="card-block" key={r.id}>
            <Link to={`/recipes/${r.id}`} className="image-card hover-zoom">
              <img src={r.image} alt={r.title} />
              <div className="image-overlay">
                <h4 className="overlay-title">{r.title}</h4>
                <div className="overlay-meta icons">
                  <span><IoIosTimer /> {r.cooking_time} min</span>
                  <span><IoPeopleSharp /> {r.servings}</span>
                  <span><SiLevelsdotfyi /> {r.difficulty}</span>
                </div>
              </div>
            </Link>
            <div className="card-actions">
              <button onClick={() => navigate(`/recipes/${r.id}`)}>View</button>
              <button onClick={() => navigate(`/create?id=${r.id}`)}>Edit</button>
              <button className="danger" onClick={() => onDelete(r.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
