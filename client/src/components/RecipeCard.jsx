import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
        <h3>{recipe.title}</h3>
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            style={{ width: "100%", height: "200px", objectFit: "cover" }}
          />
        )}
      </div>
    </Link>
  );
}
