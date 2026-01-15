import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeader } from "../utils/AuthService";
import RecipeCard from "../components/RecipeCard";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/RecipeDetail.css"; 

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";
  const category = params.get("category") || "";

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/recipes/", {
        headers: getAuthHeader(),
        params: { search, category },
      })
      .then((res) => setRecipes(res.data))
      .catch((err) => console.error(err));
  }, [search, category]);

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <div className="list-header">
        <span className="back-arrow" onClick={() => navigate(-1)}>
          <IoArrowBack />
        </span>
        <h2>Recipes</h2>
      </div>

      {recipes.length === 0 ? (
        <p>No recipes yet.</p>
      ) : (
        recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
      )}
    </div>
  );
}
