const form = document.getElementById("registerForm");

if (form) {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();

    document.getElementById("message").innerText = data.message;

  });

}

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();

    document.getElementById("message").innerText = data.message;

    if (data.success) {

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      window.location.href = "/dashboard.html";

    }

  });

}

async function loadPosts() {

  const postsContainer = document.getElementById("posts");

  if (!postsContainer) return;

  const response = await fetch("/posts");
  const posts = await response.json();
console.log(posts);

  postsContainer.innerHTML = "";

  posts.forEach(post => {

    if (post.type === "photo") {

      postsContainer.innerHTML += `
        <div class="post">
<img src="/uploads/${post.filename}" style="width:100%;border-radius:10px;">

<p>❤️ <span id="likes-${post.id}">${post.likes || 0}</span> Likes</p>

<button onclick="likePost(${post.id})">👍 Like</button>

<br>

<input
  type="text"
  id="comment-${post.id}"
  placeholder="Write a comment..."
>

<button onclick="addComment(${post.id})">
💬 Comment
</button>

<div id="comments-${post.id}"></div>

<hr>        </div>
      `;

    } else {

      postsContainer.innerHTML += `
        <div class="post">
<h3>${post.title}</h3>
<p>${post.content}</p>

<p>❤️ <span id="likes-${post.id}">${post.likes || 0}</span> Likes</p>

<button onclick="likePost(${post.id})">👍 Like</button>

<br><br>

<input
  type="text"
  id="comment-${post.id}"
  placeholder="Write a comment..."
>

<button onclick="addComment(${post.id})">
💬 Comment
</button>

<div id="comments-${post.id}"></div>

<hr>        </div>
      `;

    }

  });

}

loadPosts();
async function likePost(id) {

  const response = await fetch("/post/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
body: JSON.stringify({
  id,
  username: JSON.parse(localStorage.getItem("user")).username
})
});

  const data = await response.json();

  if (data.success) {
    document.getElementById("likes-" + id).innerText = data.likes;
  }

}
async function addComment(id) {

  const user = JSON.parse(localStorage.getItem("user"));

  const input = document.getElementById("comment-" + id);
  const comment = input.value.trim();

  if (!comment) return;

  const response = await fetch("/post/comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
body: JSON.stringify({
  id,
  username: JSON.parse(localStorage.getItem("user")).username
})
  });

  const data = await response.json();

  if (data.success) {

    const commentsDiv = document.getElementById("comments-" + id);
commentsDiv.innerHTML = "";

data.comments.forEach(c => {

  commentsDiv.innerHTML += `
  <div style="display:flex;align-items:center;margin:10px 0;">
    <img
      src="/uploads/${c.profilePhoto || 'default.png'}"
      width="40"
      height="40"
      style="border-radius:50%;margin-right:10px;object-fit:cover;"
    >
    <div>
      <b>${c.username}</b><br>
      ${c.text}
    </div>
  </div>
  `;

});
    input.value = "";
  }

}
// Upload Profile Photo

const profilePhotoForm = document.getElementById("profilePhotoForm");

if (profilePhotoForm) {

  profilePhotoForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    const photo = document.getElementById("photo").files[0];

    const formData = new FormData();

    formData.append("photo", photo);
    formData.append("username", user.username);

    const response = await fetch("/profile/photo", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    document.getElementById("message").innerText = data.message;

  });

}
// Search Users

async function searchUsers() {

  const q = document.getElementById("search").value.trim();

  if (!q) return;

  const response = await fetch("/users/search?q=" + encodeURIComponent(q));

  const users = await response.json();

  const results = document.getElementById("results");

  results.innerHTML = "";

  if (users.length === 0) {

    results.innerHTML = "<p>No users found.</p>";

    return;

  }

  users.forEach(user => {

    results.innerHTML += `
      <div style="border:1px solid #ccc;padding:10px;margin:10px 0;border-radius:8px;">
        <img
          src="/uploads/${user.profilePhoto || 'default.png'}"
          width="50"
          height="50"
          style="border-radius:50%;object-fit:cover;"
        >
<h3>${user.username}</h3>
<p>${user.subscription}</p>

<button onclick="viewProfile('${user.username}')">
👤 View Profile
</button>
      </div>
    `;

  });

}
function viewProfile(username) {

  localStorage.setItem("viewUser", username);

  window.location.href = "/user-profile.html";

}
async function submitTopic() {

  const user = JSON.parse(localStorage.getItem("user"));

  const topic = document.getElementById("topic").value.trim();

  if (!topic) return;

  const response = await fetch("/topic", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({

      username: user.username,

      topic

    })

  });

  const data = await response.json();

  document.getElementById("message").innerText = data.message;

  if (data.success) {
    document.getElementById("topic").value = "";
  }

}
