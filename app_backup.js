const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());

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

// Start Server
app.listen(PORT, () => {
  console.log(`I&I Server running on port ${PORT}`);
});
