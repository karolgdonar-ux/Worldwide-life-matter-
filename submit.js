alert("submit.js is loaded");

const form = document.getElementById("story-form");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

alert("Submit button clicked");

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const category = document.getElementById("category").value;
    const author = document.getElementById("author").value;
    const imageFile = document.getElementById("image").files[0];
const videoFile = document.getElementById("video").files[0];
    const message = document.getElementById("message");

    alert("Checking login...");

const {
  data: { user },
  error: userError,
} = await window.supabaseClient.auth.getUser();

alert("Finished checking login");	

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
if (videoFile) {
  const videoFileName =
    Date.now() + "-" + videoFile.name;

  const { error: videoUploadError } =
    await window.supabaseClient.storage
      .from("story-videos")
      .upload(videoFileName, videoFile);

  if (videoUploadError) {
    alert("Video upload failed: " + videoUploadError.message);
    return;
  }

  const {
    data: { publicUrl },
  } = window.supabaseClient.storage
    .from("story-videos")
    .getPublicUrl(videoFileName);

  videoUrl = publicUrl;
}
alert("About to save story");
alert("Story save request finished");

    const { error } = await window.supabaseClient
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
      message.textContent = "Error: " + error.message;
      alert("Error: " + error.message);
    } else {
      message.textContent = "Story submitted successfully!";
      alert("Thank you for sharing your story!");
      form.reset();
    }
  });
}
