const express = require("express");
const { Pool } = require("pg");
const cors = require("cors"); // Import the cors middleware

const pool = new Pool({
  user: "postgres",
  host: "4.188.186.11",
  database: "postgres",
  password: "juhishah2",
  port: 5432, // Default PostgreSQL port
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Use the cors middleware

app.use(express.static("public"));

app.get("/users", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM public.users4");
    const users = result.rows;
    client.release();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch users." });
  }
});

// Define a route handler for POST requests to /register
app.post("/register", async (req, res) => {
  try {
    const { username, email } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO public.users4 (username, email) VALUES ($1, $2) RETURNING *",
      [username, email]
    );
    const user = result.rows[0];
    client.release();
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Failed to register user." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
