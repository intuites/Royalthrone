import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../utils/adminAuth";
import "../../styles/admindashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) navigate("/admin/login");
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-panel">
        <h1>Admin Dashboard</h1>
        <p>Welcome, Admin</p>

        <div className="admin-actions">
          <button
            className="admin-btn"
            onClick={() => navigate("/admin/movies")}
          >
            Manage Movies
          </button>

          <button className="admin-btn logout" onClick={adminLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { adminLogout } from "../../utils/adminAuth";
// import "../../styles/admindashboard.css";

// export default function AdminDashboard() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("admin_token");
//     if (!token) navigate("/admin/login");
//   }, []);

//   return (
//     <div style={{ padding: 40 }}>
//       <h1>Admin Dashboard</h1>
//       <p>Welcome, Admin</p>

//       <button onClick={() => navigate("/admin/movies")}>Manage Movies</button>

//       <br />
//       <br />

//       <button onClick={adminLogout}>Logout</button>
//     </div>
//   );
// }
