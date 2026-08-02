const form = document.getElementById("story-form");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const title = document.getElementById("title").value.trim();
      const content = document.getElementById("content").value.trim();
      const category = document.getElementById("category").value;
      const author =
        document.getElementById("author").value.trim();

      const imageFile =
        document.getElementById("image").files[0];

      const videoFile =
        document.getElementById("video").files[0];

      const message =
        document.getElementById("message");

      const {
        data: { user },
        error: userError,
      } =
        await window.supabaseClient.auth.getUser();

      if (userError || !user) {
        alert("Please log in before submitting a story.");
        window.location.href = "login.html";
        return;
      }

      let imageUrl = "";
      let videoUrl = "";
      if (imageFile) {
        const fileName =
          Date.now() + "-" + imageFile.name;

        const { error: uploadError } =
          await window.supabaseClient.storage
            .from("story-images")
            .upload(fileName, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = window.supabaseClient.storage
          .from("story-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      if (videoFile) {
        const videoFileName =
          Date.now() + "-" + videoFile.name;

        const { error: videoUploadError } =
          await window.supabaseClient.storage
            .from("story-videos")
            .upload(videoFileName, videoFile);

        if (videoUploadError) {
          throw videoUploadError;
        }

        const {
          data: { publicUrl },
        } = window.supabaseClient.storage
          .from("story-videos")
          .getPublicUrl(videoFileName);

        videoUrl = publicUrl;
      }
      const { error } =
        await window.supabaseClient
          .from("stories")
          .insert([
            {
              title,
              content,
              category,
              author,
              image_url: imageUrl,
              video_url: videoUrl,
              user_id: user.id
            }
          ]);

      if (error) {
        throw error;
      }

      message.textContent =
        "Story submitted successfully!";

      alert("Thank you for sharing your story!");

      form.reset();

    } catch (error) {

      console.error(error);

      alert("Error: " + error.message);

      const message =
        document.getElementById("message");

      if (message) {
        message.textContent =
          "Error: " + error.message;
      }

    }
  });
}
