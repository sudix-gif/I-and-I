const express = require("express");const fs = require("fs");
const multer = require("multer");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload =
 multer({ storage });

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
  likes: 0,
  comments: [],
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
  subscription: "trial",
  profilePhoto: ""
});

  saveDB(db);

  res.json({
    success: true,
    message: "Registration successful"
});
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
  subscription: user.subscription,
  profilePhoto: user.profilePhoto
}    
  });
});
// Update Profile
app.post("/profile/update", (req, res) => {

  const { oldUsername, username, password } = req.body;

  const db = loadDB();

  const user = db.users.find(
    u => u.username === oldUsername
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  user.username = username;
  user.password = password;

  saveDB(db);

  res.json({
    success: true,
    message: "Profile updated"
  });
});
// Upload Photo
app.post("/upload/photo", upload.single("photo"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No photo uploaded"
    });
  }

  const db = loadDB();

db.posts.push({
  id: Date.now(),
  type: "photo",
  filename: req.file.filename,
  likes: 0,
  comments: [],
  created_at: new Date().toISOString()
});
  saveDB(db);


  res.json({
    success: true,
    message: "Photo uploaded successfully"
  });

});
// Upload Profile Photo
app.post("/profile/photo", upload.single("photo"), (req, res) => {

  const { username } = req.body;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No photo uploaded"
    });
  }

  const db = loadDB();

  const user = db.users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  user.profilePhoto = req.file.filename;

  saveDB(db);

  res.json({
    success: true,
    message: "Profile photo uploaded",
    filename: req.file.filename
  });
});
// Like Post (One Like Per User)
app.post("/post/like", (req, res) => {

  const { id, username } = req.body;

  const db = loadDB();

  const post = db.posts.find(
    p => p.id == id
  );

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found"
    });
  }


  if (!post.likedBy) {
    post.likedBy = [];
  }


  if (post.likedBy.includes(username)) {

    return res.json({
      success: false,
      message: "Already liked",
      likes: post.likes || 0
    });

  }


  post.likedBy.push(username);

  post.likes = post.likedBy.length;


  saveDB(db);


  res.json({
    success: true,
    likes: post.likes
  });
});

// Add Comment
app.post("/post/comment", (req, res) => {

const { id, username, comment } = req.body;
  const db = loadDB();

  const post = db.posts.find(p => p.id == id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found"
    });
  }

  if (!post.comments) {
    post.comments = [];
  }

const user = db.users.find(u => u.username === username);

post.comments.push({
  username,
  profilePhoto: user ? user.profilePhoto : "",
  text: comment
});
  saveDB(db);

  res.json({    success: true,
    comments: post.comments

  });
});

// Search Users
app.get("/users/search", (req, res) => {

  const db = loadDB();

  const query = (req.query.q || "").toLowerCase();

  const users = db.users.filter(user =>
    user.username.toLowerCase().includes(query)
  );

  res.json(users);

});

// Submit Topic
app.post("/topic", (req, res) => {

  const { username, topic } = req.body;

  if (!topic || topic.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Topic is required"
    });
  }

  const db = loadDB();

  db.topics.push({
    id: Date.now(),
    username,
    topic,
    created_at: new Date().toISOString()
  });

  saveDB(db);

  res.json({
    success: true,
    message: "Topic submitted successfully"
  });
});
app.get("/topics", (req, res) => {

  const db = loadDB();

  res.json(db.topics);
	});
// Get User Profile
app.get("/user/:username", (req, res) => {

  const username = req.params.username;

  const db = loadDB();

  const user = db.users.find(
    u => u.username === username
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  const posts = db.posts.filter(
    p => p.username === username
  );

  res.json({
    success: true,
    user: {
      username: user.username,
      profilePhoto: user.profilePhoto,
      subscription: user.subscription
    },
    posts: posts
  });

});
app.get("/admin/posts", (req, res) => {

  const db = loadDB();

  res.json(db.posts);

});
app.delete("/admin/post/:id", (req, res) => {

  const id = Number(req.params.id);

  const db = loadDB();

  db.posts = db.posts.filter(post => post.id !== id);

  saveDB(db);

  res.json({
    success: true,
    message: "Post deleted"
  });

});
app.put("/admin/post/:id", (req,res)=>{

  const id = Number(req.params.id);

  const {title, content} = req.body;

  const db = loadDB();

  const post = db.posts.find(p => p.id === id);

  if(!post){
    return res.status(404).json({
      success:false,
      message:"Post not found"
    });
  }

  post.title = title;
  post.content = content;

  saveDB(db);

  res.json({
    success:true,
    message:"Post updated"
  });

});
app.get("/admin/users", (req, res) => {

  const db = loadDB();

  res.json(db.users);

});
app.delete("/admin/user/:id", (req, res) => {

  const id = Number(req.params.id);

  const db = loadDB();

  db.users = db.users.filter(u => u.id !== id);

  saveDB(db);

  res.json({
    success: true,
    message: "User deleted"
  });

});

app.listen(PORT, () => {
  console.log(`I&I Server running on port ${PORT}`);
});

