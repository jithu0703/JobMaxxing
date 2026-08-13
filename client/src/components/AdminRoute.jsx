import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  async function fetchRole() {
    try {
      const token = localStorage.getItem("authToken");
      console.log("Token for auth:", token);

      const res = await axios.get("http://localhost:5000/user/role", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Role API response:", res.data);

      if (res.data.role === "admin") setIsAdmin(true);
      else setIsAdmin(false);
    } catch (err) {
      console.error("Role fetch error", err);
      setIsAdmin(false);
    }
  }
  fetchRole();
}, []);

  useEffect(() => {
    if (isAdmin === false) {
      navigate("/unauthorized", { replace: true });
    }
  }, [isAdmin, navigate]);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  // If isAdmin === true, render children
  return isAdmin ? children : null;
}

export default AdminRoute;
