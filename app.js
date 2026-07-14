const express = require("express");const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
function loadDB() {
  return JSON.parse(fs.readFileSync("database.json", "utf8"));
}

function saveDB(data) {
  fs.writeFileSync("database.json", JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  res.send("Welcome to I&I Server");
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  const db = loadDB();

  const admin = db.admins.find(
    a => a.username === username && a.password === password
  );

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password"
    });
  }

  res.json({
    success: true,
    message: "Welcome GUX"
  });
});
// Create a new post
app.post("/admin/post", (req, res) => {

  const { username, password, type, title, content } = req.body;

  const db = loadDB();

  const admin = db.admins.find(
    a => a.username === username && a.password === password
  );

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: "Only admin can create posts"
    });
  }

  db.posts.push({
    id: Date.now(),
    type,
    title,
    content,
    created_at: new Date().toISOString()
  });

  saveDB(db);

  res.json({
    success: true,
    message: "Post published"
  });

});
// Get all posts
app.get("/posts", (req, res) => {
  const db = loadDB();
  res.json(db.posts);
});

// User Registration
app.post("/register", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required"
    });
  }

  const db = loadDB();

  const exists = db.users.find(
    user => user.username === username
  );

  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Username already exists"
    });
  }

  db.users.push({
    id: Date.now(),
    username,
    password,
    role: "user",
    trialStart: new Date().toISOString(),
    subscription: "trial"
  });

  saveDB(db);

  res.json({
    success: true,
    message: "Registration successful"
  });

});// Start Server
app.listen(PORT, () => {
  console.log(`I&I Server running on port ${PORT}`);
});
// User Login
app.post("/login", (req, res) => {

  const { username, password } = req.body;

  const db = loadDB();

  const user = db.users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password"
    });
  }

  res.json({
    success: true,
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      subscription: user.subscription
    }
  });

});
