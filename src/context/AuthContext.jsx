import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // ✅ Direct access using UID as document ID
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const role = docSnap.data().role || 'User';
            setUserRole(role);
            localStorage.setItem('userRole', role);
          } else {
            setUserRole('User');
            localStorage.setItem('userRole', 'User');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole('User');
          localStorage.setItem('userRole', 'User');
        }
      } else {
        setUser(null);
        setUserRole(null);
        localStorage.removeItem('userRole');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userRole,
    loading,
    isAuthenticated: !!user,
    isAdmin: userRole === 'Admin',
    hasRole: (requiredRole) => {
      if (!userRole) return false;
      if (userRole === 'Admin') return true;
      if (Array.isArray(requiredRole)) {
        return requiredRole.includes(userRole);
      }
      return userRole === requiredRole;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}