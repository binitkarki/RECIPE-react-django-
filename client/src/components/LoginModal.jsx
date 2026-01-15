import "../styles/AuthModal.css";

export default function LoginModal({ isSignup, onClose, onSubmit, switchMode }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isSignup ? "Sign up" : "Log in"}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const username = e.target.username.value.trim();
            const password = e.target.password.value.trim();
            onSubmit(username, password);
          }}
        >
          <input name="username" type="text" placeholder="Username" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">{isSignup ? "Create account" : "Log in"}</button>
        </form>
        <button className="link" onClick={switchMode}>
          {isSignup ? "Already have an account? Log in" : "Haven’t registered? Sign up"}
        </button>
        <button className="link" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
