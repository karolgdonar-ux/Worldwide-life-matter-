const form = document.getElementById("story-form");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const author = document.getElementById("author").value;
    const message = document.getElementById("message");

    try {
      const { error } = await window.supabaseClient
        .from("stories")
        .insert([
          {
            title: title,
            content: content,
            author: author
          }
        ]);

      if (error) {
        message.textContent = "Error: " + error.message;
        alert("Error: " + error.message);
      } else {
        message.textContent = "Story submitted successfully!";
        alert("Thank you for sharing your story!");

        form.reset();
      }
    } catch (err) {
      message.textContent = "JavaScript Error: " + err.message;
      alert("JavaScript Error: " + err.message);
    }
  });
}
