const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Temporary admin account
const ADMIN = {
  username: "gux",
  password: "gux123"
};


// Home page
app.get("/", (req, res) => {
  res.send("Welcome to I&I Server");
});


// Admin Login
app.post("/admin/login", (req, res) => {

  const { username, password } = req.body;

  if (
    username === ADMIN.username &&
    password === ADMIN.password
  ) {
    return res.json({
      success: true,
      message: "Welcome to I&I Admin Panel",
      admin: username
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid username or password"
  });

});


// Start server
app.listen(PORT, () => {
  console.log(`I&I Server running on port ${PORT}`);
});
