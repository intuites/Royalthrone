import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";
import { supabase } from "../config/supabase.js";
import axios from "axios";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

/* ============================
   LOGIN
============================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;

    /* ============================
       CAPTCHA CHECK (NEW)
    ============================ */
    if (!captchaToken) {
      return res.status(400).json({ message: "Captcha missing" });
    }

    const captchaRes = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: captchaToken,
        },
      },
    );

    if (!captchaRes.data.success) {
      return res.status(403).json({ message: "Captcha failed" });
    }

    /* ============================
       EXISTING ADMIN LOGIN
    ============================ */
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.json({ token });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

/* ============================
   FORGOT PASSWORD
============================ */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const { data: admin } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .single();

    // Never reveal if user exists
    if (!admin) return res.json({ success: true });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await supabase
      .from("admin_users")
      .update({
        reset_token: token,
        reset_expires: expires,
      })
      .eq("id", admin.id);

    const resetLink = `${process.env.FRONTEND_URL}/admin/reset-password/${token}`;

    await resend.emails.send({
      from: "Royal Throne <onboarding@resend.dev>", //contact@royalthrone.in
      to: [email],
      subject: "Reset your Admin Password",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Password Reset</h2>
          <p>Click below to reset your password:</p>
          <a href="${resetLink}" style="
            display:inline-block;
            background:#d4af37;
            padding:12px 18px;
            color:#000;
            font-weight:bold;
            border-radius:6px;
            text-decoration:none">
            Reset Password
          </a>
          <p>This link expires in 15 minutes.</p>
          <br/>
          <p>Royal Throne Productions</p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Reset failed" });
  }
});

/* ============================
   RESET PASSWORD
============================ */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const { data: admin } = await supabase
      .from("admin_users")
      .select("*")
      .eq("reset_token", token)
      .gt("reset_expires", new Date().toISOString())
      .single();

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired link" });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await supabase
      .from("admin_users")
      .update({
        password_hash: hash,
        reset_token: null,
        reset_expires: null,
      })
      .eq("id", admin.id);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Reset failed" });
  }
});

export default router;

// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// import { Resend } from "resend";
// import { supabase } from "../config/supabase.js";
// import axios from "axios";

// const router = express.Router();
// const resend = new Resend(process.env.RESEND_API_KEY);

// /* ============================
//    LOGIN
// ============================ */
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const { data: admin, error } = await supabase
//     .from("admin_users")
//     .select("*")
//     .eq("email", email)
//     .single();

//   if (error || !admin) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const isMatch = await bcrypt.compare(password, admin.password_hash);

//   if (!isMatch) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = jwt.sign(
//     { id: admin.id, email: admin.email },
//     process.env.JWT_SECRET,
//     { expiresIn: "8h" },
//   );

//   res.json({ token });
// });

// /* ============================
//    FORGOT PASSWORD
// ============================ */
// router.post("/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;

//     const { data: admin } = await supabase
//       .from("admin_users")
//       .select("*")
//       .eq("email", email)
//       .single();

//     // Never reveal if user exists
//     if (!admin) return res.json({ success: true });

//     const token = crypto.randomBytes(32).toString("hex");
//     const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

//     await supabase
//       .from("admin_users")
//       .update({
//         reset_token: token,
//         reset_expires: expires,
//       })
//       .eq("id", admin.id);

//     const resetLink = `${process.env.FRONTEND_URL}/admin/reset-password/${token}`;

//     await resend.emails.send({
//       from: "Royal Throne <onboarding@resend.dev>", //contact@royalthrone.in
//       to: [email],
//       subject: "Reset your Admin Password",
//       html: `
//         <div style="font-family:Arial;padding:20px">
//           <h2>Password Reset</h2>
//           <p>Click below to reset your password:</p>
//           <a href="${resetLink}" style="
//             display:inline-block;
//             background:#d4af37;
//             padding:12px 18px;
//             color:#000;
//             font-weight:bold;
//             border-radius:6px;
//             text-decoration:none">
//             Reset Password
//           </a>
//           <p>This link expires in 15 minutes.</p>
//           <br/>
//           <p>Royal Throne Productions</p>
//         </div>
//       `,
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Reset failed" });
//   }
// });

// /* ============================
//    RESET PASSWORD
// ============================ */
// router.post("/reset-password", async (req, res) => {
//   try {
//     const { token, newPassword } = req.body;

//     const { data: admin } = await supabase
//       .from("admin_users")
//       .select("*")
//       .eq("reset_token", token)
//       .gt("reset_expires", new Date().toISOString())
//       .single();

//     if (!admin) {
//       return res.status(400).json({ message: "Invalid or expired link" });
//     }

//     const hash = await bcrypt.hash(newPassword, 10);

//     await supabase
//       .from("admin_users")
//       .update({
//         password_hash: hash,
//         reset_token: null,
//         reset_expires: null,
//       })
//       .eq("id", admin.id);

//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Reset failed" });
//   }
// });

// export default router;
