let editingPostId = null;
const form = document.getElementById("postForm");

if (form) {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const type = document.getElementById("type").value;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
        type,
        title,
        content
      })
    });

    const data = await response.json();

    document.getElementById("message").innerText = data.message;

if (data.success) {

  form.reset();

  editingPostId = null;

document.getElementById("submitBtn").innerText =
  "Publish";

  loadPosts();

 }
  });

}
window.loadTopics = async function(){

  const response = await fetch("/topics");

  const topics = await response.json();

  const container = document.getElementById("topics");

  container.innerHTML = "";

  if (topics.length === 0) {

    container.innerHTML = "<p>No topics submitted yet</p>";

    return;

  }


  topics.forEach(t => {

    container.innerHTML += `
      <div class="post">

        <h3>💡 ${t.topic}</h3>

        <p>
          👤 User: ${t.username || "Unknown"}
        </p>

        <small>
          📅 ${t.created_at}
        </small>

      </div>
    `;

  });

};

window.loadPosts = async function(){

  const response = await fetch("/admin/posts");

  const posts = await response.json();

  const container = document.getElementById("adminPosts");

  container.innerHTML = "";


  posts.forEach(post => {

    let media = "";

    if (post.type === "photo") {

      media = `
        <img
          src="/uploads/${post.filename}"
          style="width:100%;border-radius:10px;"
        >
      `;

    } else {

      media = `
        <h3>${post.title || ""}</h3>
        <p>${post.content || ""}</p>
      `;

    }

let url = "/admin/post";
let method = "POST";

if(editingPostId){

  url = "/admin/post/" + editingPostId;
  method = "PUT";

 }

    container.innerHTML += `

      <div class="post">

        ${media}

        <br>
        <button onclick="editPost(${post.id})">
         ✏️ Edit
         </button>

        <button onclick="deletePost(${post.id})">
          🗑 Delete
        </button>

      </div>

    `;

  });

};

window.deletePost = async function(id){

  if(!confirm("Delete this post?")) return;

  const response = await fetch("/admin/post/" + id, {
    method: "DELETE"
  });

  const data = await response.json();

  alert(data.message);

  loadPosts();

};
window.editPost = async function(id){

  const response = await fetch("/admin/posts");

  const posts = await response.json();

  const post = posts.find(p => p.id == id);


  if(!post){
    alert("Post not found");
    return;
  }


  editingPostId = id;


  document.getElementById("title").value =
    post.title || "";

  document.getElementById("content").value =
    post.content || "";

document.getElementById("submitBtn").innerText =
  "Update Post";


  document.getElementById("message").innerText =
    "Editing post...";

};
let url = "/admin/post";
let method = "POST";

if (editingPostId) {
  url = "/admin/post/" + editingPostId;
  method = "PUT";
}
window.loadUsers = async function(){

  const response = await fetch("/admin/users");

  const users = await response.json();

  const container = document.getElementById("users");

  container.innerHTML = "";

  users.forEach(user => {

    container.innerHTML += `
      <div class="post">

        <h3>${user.username}</h3>

        <p>Subscription: ${user.subscription}</p>

        <button onclick="deleteUser(${user.id})">
          🗑 Delete User
        </button>

      </div>
    `;

  });

};
window.deleteUser = async function(id){

  if(!confirm("Delete this user?")) return;

  const response = await fetch("/admin/user/" + id, {
    method: "DELETE"
  });

  const data = await response.json();

  alert(data.message);

  loadUsers();

};
