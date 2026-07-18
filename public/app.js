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
    body: JSON.stringify({ id })
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
      username: user.username,
      comment
    })
  });

  const data = await response.json();

  if (data.success) {

    const commentsDiv = document.getElementById("comments-" + id);

    commentsDiv.innerHTML = "";

    data.comments.forEach(c => {
      commentsDiv.innerHTML += `
        <p><b>${c.username}</b>: ${c.text}</p>
      `;
    });

    input.value = "";
  }

}
