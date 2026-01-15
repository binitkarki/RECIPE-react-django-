import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RecipesAPI } from "../utils/api";
import { IoIosTimer } from "react-icons/io";
import { IoPeopleSharp, IoArrowBack } from "react-icons/io5";
import { SiLevelsdotfyi } from "react-icons/si";
import "../styles/Grid.css";
import "../styles/RecipeDetail.css"; 

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";
  const category = params.get("category") || "";

  useEffect(() => {
    RecipesAPI.list(search, category)
      .then((res) => setRecipes(res.data))
      .catch(() => {});
  }, [search, category]);

  return (
    <div>
      <div className="list-header">
        {/* Back arrow instead of text button */}
        <span className="back-arrow" onClick={() => navigate(-1)}>
          <IoArrowBack />
        </span>
        <h2>
          Results {search ? `for "${search}"` : ""} {category ? `in ${category}` : ""}
        </h2>
      </div>

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
    </div>
  );
}
