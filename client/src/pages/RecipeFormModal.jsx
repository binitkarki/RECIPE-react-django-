import RecipeForm from "./RecipeForm";
import { useNavigate } from "react-router-dom";
import "../styles/Modal.css";

export default function RecipeFormModal() {
  const navigate = useNavigate();

  const close = () => navigate(-1);

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="back-btn" onClick={close}>&larr; Back</button>
          <button className="close-btn" onClick={close}>✕</button>
        </div>
        <RecipeForm onSubmitted={close} />
      </div>
    </div>
  );
}
