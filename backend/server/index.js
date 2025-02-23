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

// User Routes
// Create a new user
app.post("/auth/register", async (req, res) => {
    try {
        const { username, user_password } = req.body;
        const hashedPassword = await bcrypt.hash(user_password, saltRounds);
        const newUser = await pool.query(
            "INSERT INTO Users (username, user_password) VALUES ($1,$2) RETURNING *", [username, hashedPassword]
        );
        const token = jwt.sign(
            { user_id: newUser.rows[0].user_id, username: newUser.rows[0].username }, JWT_SECRET);
        res.json({ token, user_id: newUser.rows[0].user_id });
    } catch (e) {
        console.error(e.message);
   }
});

// Login user
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
        res.json({ token, user_id: user.rows[0].user_id });
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


// Task Routes 
// Create a new task
app.post("/tasks", async (req, res) => {
    try {
        const { title, task_description, status, user_id } = req.body;
        const newTask = await pool.query(
            "INSERT INTO Tasks (title,task_description,is_complete,user_id) VALUES($1,$2,$3,$4) RETURNING *",
            [title, task_description, status,user_id]
        );
        res.json(newTask.rows[0]);
    } catch (e) {
        console.error(e.message);
    }
});

// Get all tasks for a specific user_id
app.get("/tasks/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const allTasks = await pool.query("SELECT * FROM Tasks WHERE user_id = $1", [user_id]);
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
