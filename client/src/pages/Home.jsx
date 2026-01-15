import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RecipesAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { IoIosTimer } from "react-icons/io";
import { IoPeopleSharp } from "react-icons/io5";
import { SiLevelsdotfyi } from "react-icons/si";
import "../styles/Grid.css";
import "../styles/Fab.css";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    RecipesAPI.list().then((res) => setRecipes(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h2>Recently added</h2>
      <div className="grid grid-6">
        {recipes.map((r) => (
          <Link to={`/recipes/${r.id}`} className="image-card hover-zoom" key={r.id}>
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
        ))}
      </div>

      {user && (
        <button className="fab" title="Add new recipe" onClick={() => navigate("/create")}>
          +
        </button>
      )}
    </div>
  );
}
