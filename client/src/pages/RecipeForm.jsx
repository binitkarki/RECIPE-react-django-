import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RecipesAPI } from "../utils/api";
import "../styles/Forms.css";
import "../styles/Modal.css";

const CATEGORIES = [
  { value: "dessert", label: "Dessert" },
  { value: "appetizer", label: "Appetizer" },
  { value: "snack", label: "Snack" },
  { value: "main", label: "Main course" },
  { value: "beverage", label: "Beverage" },
  { value: "salad", label: "Salad" },
  { value: "soup", label: "Soup" },
];

export default function RecipeForm({ onSubmitted }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const editId = params.get("id"); 

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [cookingTime, setCookingTime] = useState(30);
  const [servings, setServings] = useState(1);
  const [category, setCategory] = useState("main");
  const [image, setImage] = useState(null);

  const [ingredients, setIngredients] = useState([{ quantity: "", item: "" }]);
  const [steps, setSteps] = useState([{ instruction: "" }]);

  
  useEffect(() => {
    if (editId) {
      RecipesAPI.detail(editId).then((res) => {
        const r = res.data;
        setTitle(r.title);
        setDescription(r.description);
        setDifficulty(r.difficulty);
        setCookingTime(r.cooking_time);
        setServings(r.servings);
        setCategory(r.category);

        
        setIngredients(
          Array.isArray(r.ingredients)
            ? r.ingredients.map((ing) => ({
                quantity: ing.quantity,
                item: ing.item,
              }))
            : []
        );

        
        setSteps(
          Array.isArray(r.steps)
            ? r.steps.map((s) => ({ instruction: s }))
            : []
        );
      });
    }
  }, [editId]);

  const handleIngredientChange = (index, field, value) => {
    const next = [...ingredients];
    next[index][field] = value;
    setIngredients(next);
  };
  const addIngredient = () =>
    setIngredients([...ingredients, { quantity: "", item: "" }]);

  const handleStepChange = (index, value) => {
    const next = [...steps];
    next[index].instruction = value;
    setSteps(next);
  };
  const addStep = () => setSteps([...steps, { instruction: "" }]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const ingredientsArray = ingredients
      .filter((i) => i.quantity.trim() || i.item.trim())
      .map((i) => ({
        quantity: i.quantity.trim(),
        item: i.item.trim(),
      }));

    const stepsArray = steps
      .map((s) => s.instruction.trim())
      .filter((line) => line);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("difficulty", difficulty);
    formData.append("cooking_time", cookingTime);
    formData.append("servings", servings);
    formData.append("category", category);


    formData.append("ingredients", JSON.stringify(ingredientsArray));
    formData.append("steps", JSON.stringify(stepsArray));

    if (image) formData.append("image", image);

    try {
      if (editId) {
        await RecipesAPI.update(editId, formData);
        alert("Recipe updated successfully!");
      } else {
        await RecipesAPI.create(formData);
        alert("Recipe created successfully!");
      }
      if (onSubmitted) onSubmitted();
      else navigate(-1);
    } catch (err) {
      alert("Failed to save recipe: " + err.message);
    }
  };

  const closeForm = () => {
    if (onSubmitted) onSubmitted();
    else navigate(-1);
  };

  return (
    <div className="modal-backdrop" onClick={closeForm}>
      <div className="modal-sheet tall" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header sticky">
          <button className="back-btn" onClick={closeForm}>
            &larr; Back
          </button>
          <button className="close-btn" onClick={closeForm}>
            ✕
          </button>
        </div>

        <form className="recipe-form scroll" onSubmit={handleSubmit}>
          <h2>{editId ? "Edit Recipe" : "Create Recipe"}</h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="form-row">
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="form-row">
            <label>Cooking Time (minutes):</label>
            <input
              type="number"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              min="1"
            />
          </div>

          <div className="form-row">
            <label>Servings:</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              min="1"
            />
          </div>

          <h3>Ingredients</h3>
          {ingredients.map((ing, i) => (
            <div className="two-column" key={i}>
              <input
                className="amount-bold"
                type="text"
                placeholder="Amount (e.g. 1 cup, 2 tbsp)"
                value={ing.quantity}
                onChange={(e) =>
                  handleIngredientChange(i, "quantity", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Ingredient (e.g. flour)"
                value={ing.item}
                onChange={(e) =>
                  handleIngredientChange(i, "item", e.target.value)
                }
              />
            </div>
          ))}
          <button type="button" onClick={addIngredient}>
            + Add Ingredient
          </button>

          <h3>Steps</h3>
          {steps.map((s, i) => (
            <div className="one-column" key={i}>
              <input
                type="text"
                placeholder={`Step ${i + 1} instruction`}
                value={s.instruction}
                onChange={(e) => handleStepChange(i, e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addStep}>
            + Add Step
          </button>

          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit">{editId ? "Update Recipe" : "Submit Recipe"}</button>
        </form>
      </div>
    </div>
  );
}
