const form = document.getElementById("story-form");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const category = document.getElementById("category").value;
    const author = document.getElementById("author").value;
    const imageFile = document.getElementById("image").files[0];
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

    let imageUrl = "";

    if (imageFile) {
      const fileName =
        Date.now() + "-" + imageFile.name;
      const { error: uploadError } =
        await window.supabaseClient.storage
          .from("story-images")
          .upload(fileName, imageFile);

      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = window.supabaseClient.storage
        .from("story-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    const { error } = await window.supabaseClient
      .from("stories")
      .insert([
        {
          title,
          content,
          category,
          author,
          image_url: imageUrl,
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
