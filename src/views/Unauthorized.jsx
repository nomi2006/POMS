import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid p-4 text-center">
      <div className="py-5">
        <div className="display-1 text-danger">
          <i className="ph ph-warning" />
        </div>
        <h1 className="text-danger">403</h1>
        <h3 className="fw-bold">Access Denied</h3>
        <p className="text-muted">
          You don't have permission to access this page.
        </p>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/dashboard')}
        >
          <i className="ph ph-house me-2" />
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}