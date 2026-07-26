const form = document.getElementById("story-form");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const category = document.getElementById("category").value;
    const author = document.getElementById("author").value;
    const message = document.getElementById("message");

    const {
      data: { user },
      error: userError,
    } = await window.supabaseClient.auth.getUser();

    if (userError || !user) {
      alert("Please log in before submitting a story.");
      window.location.href = "login.html";
      return;
    }

    const { error } = await window.supabaseClient
      .from("stories")
      .insert([
        {
          title,
          content,
          category,
          author,
          user_id: user.id
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
  });
}
