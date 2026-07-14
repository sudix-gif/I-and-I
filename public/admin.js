const form = document.getElementById("postForm");

if (form) {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const type = document.getElementById("type").value;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    const response = await fetch("/admin/post", {
      method: "POST",
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
    }

  });

}
