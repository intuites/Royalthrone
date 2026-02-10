import express from "express";
import { Resend } from "resend";
import { supabase } from "../config/supabase.js";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  try {
    const data = req.body;

    // 1️⃣ Save to Supabase
    const { error } = await supabase.from("pitch_submissions").insert([data]);
    if (error) throw error;

    /* ===============================
       🎬 EMAIL TO ROYAL THRONE
    =============================== */
    const adminTemplate = `
    <div style="font-family: Arial, sans-serif; background:#0b0b0b; padding:40px;">
      <div style="max-width:700px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden;">

        <div style="background:#000; padding:25px; text-align:center;">
          <h1 style="color:#d4af37; margin:0;">Royal Throne Productions</h1>
          <p style="color:#aaa; margin-top:8px;">New Story Pitch Submission</p>
        </div>

        <div style="padding:30px; color:#111;">
          <h2 style="margin-top:0;">Pitch Details</h2>

          <table style="width:100%; border-collapse:collapse;">
            <tr><td><b>Script Writer Name</b></td><td>${data.first_name} ${data.last_name}</td></tr>
            <tr><td><b>Email</b></td><td>${data.email}</td></tr>
            <tr><td><b>Phone</b></td><td>${data.phone}</td></tr>
            <tr><td><b>Experience</b></td><td>${data.experience || "N/A"}</td></tr>
            <tr><td><b>SWA Title</b></td><td>${data.swa_title || "N/A"}</td></tr>
            <tr><td><b>SWA Number</b></td><td>${data.swa_number || "N/A"}</td></tr>
            <tr><td><b>SWA Date</b></td><td>${data.swa_date || "N/A"}</td></tr>
            <tr><td><b>Story Title</b></td><td>${data.story_title}</td></tr>
            <tr><td><b>Genre</b></td><td>${data.genre}</td></tr>
            <tr><td><b>Film Type</b></td><td>${data.film_type}</td></tr>
          </table>

          <hr style="margin:25px 0;">

          <h3>Logline</h3>
          <p>${data.logline}</p>

          <h3>Synopsis</h3>
          <p style="white-space:pre-line;">${data.synopsis}</p>
        </div>

        <div style="background:#f4f4f4; padding:15px; text-align:center; font-size:13px; color:#555;">
          Royal Throne Productions – Pitch Submission System
        </div>

      </div>
    </div>
    `;

    await resend.emails.send({
      from: "Royal Throne <onboarding@resend.dev>", //contact@royalthrone.in
      to: ["contact@royalthrone.in"],
      subject: `New Story Pitch — ${data.story_title}`,
      html: adminTemplate,
    });

    /* ===============================
       📩 AUTO REPLY TO WRITER
    =============================== */
    const writerTemplate = `
    <div style="font-family: Arial, sans-serif; background:#0b0b0b; padding:40px;">
      <div style="max-width:650px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden;">

        <div style="background:#000; padding:25px; text-align:center;">
          <h1 style="color:#d4af37; margin:0;">Royal Throne Productions</h1>
          <p style="color:#aaa; margin-top:8px;">Story Pitch Received</p>
        </div>

        <div style="padding:30px; color:#111;">
          <p>Dear <b>${data.first_name}</b>,</p>

          <p>
            Thank you for submitting your story titled
            <b>"${data.story_title}"</b> to Royal Throne Productions.
          </p>

          <p>
            Our creative team has received your pitch and it is now under review.
            If your story aligns with our current projects, our team will contact you.
          </p>

          <div style="margin:30px 0; padding:20px; background:#f7f7f7; border-left:5px solid #d4af37;">
            <b>Submitted Details</b><br/>
            Genre: ${data.genre}<br/>
            Type: ${data.film_type}<br/>
            Logline: ${data.logline}
          </div>

          <p>
            We appreciate your interest in working with Royal Throne Productions and
            wish you great success in your creative journey.
          </p>

          <p>
            Regards,<br/>
            <b>Royal Throne Productions</b><br/>
            <span style="color:#777;">rajpavan@royalthrone.in</span>
          </p>
        </div>

        <div style="background:#f4f4f4; padding:15px; text-align:center; font-size:13px; color:#555;">
          This is an automated message. Please do not reply.
        </div>

      </div>
    </div>
    `;

    await resend.emails.send({
      from: "Royal Throne <onboarding@resend.dev>",
      to: [data.email],
      subject: "Your Story Pitch Has Been Received",
      html: writerTemplate,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Pitch submission failed" });
  }
});

export default router;

// import express from "express";
// import { Resend } from "resend";
// import { supabase } from "../config/supabase.js";

// const router = express.Router();
// const resend = new Resend(process.env.RESEND_API_KEY);

// router.post("/", async (req, res) => {
//   try {
//     const data = req.body;

//     // 1️⃣ Save to Supabase
//     const { error } = await supabase.from("pitch_submissions").insert([data]);

//     if (error) throw error;

//     // 2️⃣ Email to Royal Throne
//     await resend.emails.send({
//       from: "Royal Throne <contact@royalthrone.in>",
//       to: ["contact@royalthrone.in"],
//       subject: `New Story Pitch: ${data.story_title}`,
//       html: `
//         <h2>New Pitch Received</h2>
//         <p><b>Name:</b> ${data.first_name} ${data.last_name}</p>
//         <p><b>Email:</b> ${data.email}</p>
//         <p><b>Phone:</b> ${data.phone}</p>
//         <p><b>Genre:</b> ${data.genre}</p>
//         <p><b>Type:</b> ${data.film_type}</p>
//         <p><b>Logline:</b> ${data.logline}</p>
//         <p><b>Synopsis:</b><br/>${data.synopsis}</p>
//       `,
//     });

//     // 3️⃣ Auto reply to writer
//     await resend.emails.send({
//       from: "Royal Throne <contact@royalthrone.in>",
//       to: [data.email],
//       subject: "We received your Story Pitch",
//       html: `
//         <h2>Dear ${data.first_name},</h2>
//         <p>Thank you for submitting your story titled <b>${data.story_title}</b>.</p>
//         <p>Our creative team will review it and contact you if shortlisted.</p>
//         <br/>
//         <p>Regards,<br/><b>Royal Throne Productions</b></p>
//       `,
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Pitch submission failed" });
//   }
// });

// export default router;
