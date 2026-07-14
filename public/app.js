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

    postsContainer.innerHTML += `
      <div class="post">
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <small>${post.type}</small>
        <hr>
      </div>
    `;

  });

}

loadPosts();
