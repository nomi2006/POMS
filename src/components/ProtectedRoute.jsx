import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "config/firebase";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3 text-muted">Loading...</h5>
      </div>
    );
  }

  if (user) {
    return children;
  }
  return <Navigate to="/login" replace />;
}