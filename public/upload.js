const form = document.getElementById("uploadForm");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const fileInput = document.getElementById("photo");

  const formData = new FormData();
  formData.append("photo", fileInput.files[0]);

  const response = await fetch("/upload/photo", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  document.getElementById("message").innerText = data.message;

});
