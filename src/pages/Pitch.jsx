import pitchus from "../assets/pitchus.png";
import "../styles/pitchus.css";
import { useEffect, useState } from "react";

export default function Pitch() {
  const [showTop, setShowTop] = useState(false);
  const [loading, setLoading] = useState(false);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Validate form
  const validate = (data) => {
    if (!data.first_name?.trim()) return "First name is required";
    if (!data.last_name?.trim()) return "Last name is required";
    if (!data.email?.trim()) return "Email is required";
    if (!data.phone?.trim()) return "Mobile number is required";
    if (!data.story_title?.trim()) return "Story title is required";
    if (!data.genre) return "Genre is required";
    if (!data.film_type) return "Type of film is required";
    if (!data.logline?.trim()) return "Logline is required";
    if (!data.synopsis?.trim()) return "Story synopsis is required";

    if (!/^\S+@\S+\.\S+$/.test(data.email))
      return "Please enter a valid email address";

    if (!/^\d{10}$/.test(data.phone))
      return "Please enter a valid 10-digit mobile number";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());

    const error = validate(payload);
    if (error) {
      alert(error);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        alert("Your pitch was submitted successfully! We’ll contact you soon.");
        e.target.reset();
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pitch-page">
        {/* HERO */}
        <section className="pitch-hero">
          <img src={pitchus} alt="Pitch Banner" className="pitch-hero-img" />
        </section>

        {/* FORM */}
        <section className="pitch-form-section">
          <div className="pitch-form-container">
            <h2 className="pitch-title">Story Pitch</h2>
            <p className="pitch-subtitle">
              Submit your story details and our creative team will get back to
              you.
            </p>

            <div className="pitch-card">
              <form className="pitch-form" onSubmit={handleSubmit}>
                <div className="pitch-grid">
                  <Field label="First Name" name="first_name" />
                  <Field label="Last Name" name="last_name" />
                  <Field label="Mobile Number" name="phone" />
                  <Field label="Email" name="email" type="email" />
                  <Field label="Previous Experience" name="experience" />
                  <Field label="SWA Registered Title" name="swa_title" />
                  <Field label="SWA Registration Number" name="swa_number" />
                  <Field
                    label="SWA Registration Date"
                    name="swa_date"
                    type="date"
                  />
                  <Field label="Story Working Title" name="story_title" />

                  <Select label="Genre" name="genre">
                    <option value="">Select Genre</option>
                    <option>Drama</option>
                    <option>Action</option>
                    <option>Romance</option>
                    <option>Thriller</option>
                    <option>Horror</option>
                    <option>Fiction</option>
                    <option>Nonfiction</option>
                  </Select>

                  <Select label="Type of Film" name="film_type">
                    <option value="">Select Type</option>
                    <option>Short Film</option>
                    <option>Feature Film</option>
                    <option>Web Series</option>
                    <option>Documentary</option>
                    <option>Animation</option>
                  </Select>

                  <Field label="Logline" name="logline" />
                </div>

                <div className="pitch-field pitch-full">
                  <label>Story Synopsis / Purpose of Collaboration</label>
                  <textarea name="synopsis" placeholder="Write your story..." />
                </div>

                <button
                  type="submit"
                  className="pitch-submit"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Pitch"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {showTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </>
  );
}

/* Reusable inputs */
function Field({ label, name, type = "text" }) {
  return (
    <div className="pitch-field">
      <label>{label}</label>
      <input name={name} type={type} />
    </div>
  );
}

function Select({ label, name, children }) {
  return (
    <div className="pitch-field">
      <label>{label}</label>
      <select name={name} defaultValue="">
        {children}
      </select>
    </div>
  );
}

// import pitchus from "../assets/pitchus.png";
// import "../styles/pitchus.css";
// import { useEffect, useState } from "react";

// export default function Pitch() {
//   const [showTop, setShowTop] = useState(false);

//   useEffect(() => {
//     const onScroll = () => {
//       setShowTop(window.scrollY > 300);
//     };

//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);
//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const form = new FormData(e.target);

//     const payload = Object.fromEntries(form.entries());

//     const res = await fetch("http://localhost:5000/api/pitch", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const result = await res.json();

//     if (result.success) {
//       alert("Pitch submitted successfully!");
//       e.target.reset();
//     } else {
//       alert("Submission failed");
//     }
//   };

//   return (
//     <>
//       <div className="pitch-page">

//         <section className="pitch-hero">
//           <img src={pitchus} alt="Pitch Banner" className="pitch-hero-img" />
//         </section>

//         <section className="pitch-form-section">
//           <div className="pitch-form-container">
//             <h2 className="pitch-title">Story Pitch</h2>
//             <p className="pitch-subtitle">
//               Submit your story details and we will get back to you.
//             </p>

//             <div className="pitch-card">
//               <form className="pitch-form" onSubmit={handleSubmit}>
//                 <div className="pitch-grid">
//                   <div className="pitch-field">
//                     <label>First Name</label>
//                     <input
//                       name="first_name"
//                       type="text"
//                       placeholder="Enter your first name"
//                     />
//                   </div>

//                   <div className="pitch-field">
//                     <label>Last Name</label>
//                     <input
//                       name="last_name"
//                       type="text"
//                       placeholder="Enter your last name"
//                     />
//                   </div>

//                   <div className="pitch-field">
//                     <label>Mobile Number</label>
//                     <input
//                       name="phone"
//                       type="tel"
//                       placeholder="Enter your mobile number"
//                     />
//                   </div>

//                   <div className="pitch-field">
//                     <label>Email Id</label>
//                     <input
//                       name="email"
//                       type="email"
//                       placeholder="Enter your Email id"
//                     />
//                   </div>

//                   <div className="pitch-field">
//                     <label>Previous Experience (If any)</label>
//                     <input
//                       name="experience"
//                       type="text"
//                       placeholder="Enter your Previous Experience"
//                     />
//                   </div>

//                   <div className="pitch-field">
//                     <label>SWA Registered Title</label>
//                     <input
//                       name="swa_title"
//                       type="text"
//                       placeholder="Enter SWA Registered Title"
//                     />
//                   </div>

//                   <div className="pitch-field">
//                     <label>SWA Registration Number</label>
//                     <input
//                       name="swa_number"
//                       type="text"
//                       placeholder="Enter SWA Registration Number"
//                     />
//                   </div>

//                   <div className="pitch-field">
//                     <label>SWA Registration Date</label>
//                     <input name="swa_date" type="date" />
//                   </div>

//                   <div className="pitch-field">
//                     <label>Story Working Title</label>
//                     <input
//                       name="story_title"
//                       type="text"
//                       placeholder="Enter Story Working Title"
//                     />
//                   </div>

//                   <div className="pitch-field">
//                     <label>Genre</label>
//                     <select name="genre" defaultValue="">
//                       <option value="" disabled>
//                         Select Genre
//                       </option>
//                       <option value="Drama">Drama</option>
//                       <option value="Action">Action</option>
//                       <option value="Romance">Romance</option>
//                       <option value="Fiction">Fiction</option>
//                       <option value="Nonfiction">Nonfiction</option>
//                       <option value="Horror">Horror</option>
//                       <option value="Thriller">Thriller</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>

//                   <div className="pitch-field">
//                     <label>Type of Film</label>
//                     <select name="film_type" defaultValue="">
//                       <option value="" disabled>
//                         Select Type
//                       </option>
//                       <option value="Short Film">Short Film</option>
//                       <option value="Feature Film">Feature Film</option>
//                       <option value="Web Series">Web Series</option>
//                       <option value="Documentary">Documentary</option>
//                       <option value="Animation">Animation</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>

//                   <div className="pitch-field">
//                     <label>Logline</label>
//                     <input
//                       name="logline"
//                       type="text"
//                       placeholder="Write your story logline..."
//                     />
//                   </div>
//                 </div>

//                 <div className="pitch-field pitch-full">
//                   <label>Story Synopsis / Purpose of Collaboration</label>
//                   <textarea
//                     name="synopsis"
//                     placeholder="Enter Story Synopsis "
//                   />
//                 </div>

//                 <button type="submit" className="pitch-submit">
//                   Submit Pitch
//                 </button>
//               </form>
//             </div>
//           </div>
//         </section>
//       </div>
//       {showTop && (
//         <button className="scroll-top-btn" onClick={scrollToTop}>
//           ↑
//         </button>
//       )}
//     </>
//   );
// }
