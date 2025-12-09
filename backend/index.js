require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const authrouter = require("./routers/auth.routes");
const collegerouter = require("./routers/college.routes");
const studentRouter = require("./routers/student.routes");
const profilerouter = require("./routers/userProfile.route");
const employerRouter = require("./routers/employer.routes");
const internshipRouter = require("./routers/internship.routes");
const logbookRouter = require("./routers/logbook.routes");

const app = express();

/* ---------------------- ALLOWED ORIGINS ---------------------- */
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "https://your-frontend-domain.vercel.app",
  "https://prashiskshan-main-new-integration-six.vercel.app",
  "https://prashiskshan-main-new-in-git-642e5b-abhisheks-projects-680a2fd9.vercel.app",
  "https://prashiskshan-main-new-integration-oq47uyt9u.vercel.app",
  "https://prashiskshan-main-new-integration-abhisheks-projects-680a2fd9.vercel.app",
  "https://delightful-mud-030378300-preview.eastasia.3.azurestaticapps.net",
  "https://delightful-mud-030378300.3.azurestaticapps.net",
  "https://graceful-meringue-990a41.netlify.app",
  "https://genuine-parfait-23963c.netlify.app"
];

/* ---------------------- CORS CONFIG ---------------------------- */
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS blocked."), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ---------------------- HEADER MIDDLEWARE ---------------------- */
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

/* ---------------------- BODY PARSER --------------------------- */
app.use(express.json());

/* ---------------------- ROUTES -------------------------------- */
app.use("/auth", authrouter);
app.use("/api/college", collegerouter);
app.use("/api/student", studentRouter);
app.use("/api/company", employerRouter);
app.use("/internships", internshipRouter);
app.use("/logbooks", logbookRouter);
app.use("/profile", profilerouter);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ server_time: result.rows[0].now });
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

/* ---------------------- START SERVER --------------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});