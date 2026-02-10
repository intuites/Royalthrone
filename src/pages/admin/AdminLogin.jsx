import { useState, useRef } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../../styles/adminlogin.css";
import ReCAPTCHA from "react-google-recaptcha";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null); // ✅ FIX
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!captchaToken) {
      setError("Please verify captcha");
      return;
    }

    try {
      const res = await API.post("/admin/login", {
        email,
        password,
        captchaToken,
      });

      localStorage.setItem("admin_token", res.data.token);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid admin credentials");
      setCaptchaToken(null);
      captchaRef.current?.reset(); // ✅ optional but recommended
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2>Admin Login</h2>

        {error && <p className="admin-error">{error}</p>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <ReCAPTCHA
            ref={captchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={setCaptchaToken}
            theme="dark"
          />

          <button type="submit">Login</button>

          <p
            onClick={() => navigate("/admin/forgot-password")}
            style={{ cursor: "pointer", color: "#d4af37", marginTop: "12px" }}
          >
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
}

// updated
// import { useState } from "react";
// import API from "../../services/api";
// import { useNavigate } from "react-router-dom";
// import "../../styles/adminlogin.css";

// export default function AdminLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await API.post("/admin/login", { email, password });
//       localStorage.setItem("admin_token", res.data.token);
//       navigate("/admin/dashboard");
//     } catch {
//       setError("Invalid admin credentials");
//     }
//   };

//   return (
//     <div className="admin-login-page">
//       <div className="admin-login-card">
//         <h2>Admin Login</h2>

//         {error && <p className="admin-error">{error}</p>}

//         <form onSubmit={handleSubmit} className="admin-login-form">
//           <input
//             name="email"
//             type="email"
//             placeholder="Admin Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <input
//             name="password"
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <button type="submit">Login</button>
//           <p
//             onClick={() => navigate("/admin/forgot-password")}
//             style={{ cursor: "pointer", color: "#d4af37", marginTop: "12px" }}
//           >
//             Forgot Password?
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }
