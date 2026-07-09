import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// project-imports
import router from 'routes';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

function App() {
  return <RouterProvider router={router} />;
  <ToastContainer position="top-right" autoClose={3000} />
}

export default App;
