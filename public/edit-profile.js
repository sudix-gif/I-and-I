const form = document.getElementById("editProfileForm");

if (form) {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "/login.html";
  }

  document.getElementById("username").value = user.username;

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        oldUsername: user.username,
        username,
        password
      })
    });

    const data = await response.json();

    document.getElementById("message").innerText = data.message;

    if (data.success) {

      user.username = username;

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

    }

  });

}
