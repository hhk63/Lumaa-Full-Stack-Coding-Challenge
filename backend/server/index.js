const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Lumaa";

// Middleware
app.use(cors());
app.use(express.json());

// TODO: 
// 1. Separate files
// 2. Frontend!!
// 3. Move files around and create new folders to make it easier to navigate

// User Routes -------------------------------------------------------------------------------------------
// Create a new user - implement hashing for password using bcrypt
app.post("/auth/register", async (req, res) => {
    try {
        const { username, user_password } = req.body;
        const hashedPassword = await bcrypt.hash(user_password, saltRounds);
        const newUser = await pool.query(
            "INSERT INTO Users (username, user_password) VALUES ($1,$2) RETURNING *", [username, hashedPassword]
        );
        res.json(newUser.rows);
    } catch (e) {
        console.error(e.message);
   }
});

// Login user, return a JWT
app.post("/auth/login", async (req, res) => {
    try {
        const { username, user_password } = req.body;
        const user = await pool.query("SELECT * FROM Users WHERE username = $1", [username]);
        
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid Username" });
        }
        const validatePassword = await bcrypt.compare(user_password, user.rows[0].user_password);
        if (!validatePassword) {
            return res.status(400).json({ message: "Invalid Password" });
        }
        
        const token = jwt.sign(
            { user_id: user.rows[0].user_id, username: user.rows[0].username }, JWT_SECRET);
        res.json({ token });
    } catch (e) {
        console.error(e.message);
   }
});

// Get all users - for testing purposes
app.get("/users", async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT * FROM Users");
        res.json(allUsers.rows);
    } catch (e) {
        console.error(e.message);
   }
});

// Delete user - for testing purposes
app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await pool.query("DELETE FROM Users WHERE user_id = $1", [id]);
        res.json("User Deleted Successfully!") 
    } catch (e) {
        console.error(e.message);
   }
});


// Task Routes -------------------------------------------------------------------------------------------
// Create a new task
app.post("/tasks", async (req, res) => {
    try {
        const { title, status } = req.body;
        const newTask = await pool.query(
            "INSERT INTO Tasks (title,is_complete) VALUES($1,$2) RETURNING *",
            [title, status]
        );
        res.json(newTask.rows[0]);
    } catch (e) {
        console.error(e.message);
    }
});

// Get all tasks
app.get("/tasks", async (req, res) => {
    try {
        const allTasks = await pool.query("SELECT * FROM Tasks");
        res.json(allTasks.rows);
    } catch (e) {
        console.error(e.message);
   }
});

// Get a task
app.get("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const task = await pool.query("SELECT * FROM Tasks WHERE task_id = $1", [id]);
        res.json(task.rows[0]);
    } catch (e) {
        console.error(e.message);
   }
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updateTask = await pool.query("UPDATE Tasks SET is_complete = $1 WHERE task_id = $2", [status, id]);
        res.json("Updated Task Status")
    } catch (e) {
        console.error(e.message);
   }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTask = await pool.query("DELETE FROM Tasks WHERE task_id = $1", [id]);
        res.json("Task Deleted Successfully!")
    } catch (e) {
        console.error(e.message);
   }
});

app.listen(5000, () => {
    console.log("Server has started on port 5000");
});
