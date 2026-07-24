const params = new URLSearchParams(window.location.search);
const storyId = params.get("id");

const form = document.getElementById("edit-form");
const message = document.getElementById("message");

async function loadStory() {
  const { data, error } = await window.supabaseClient
    .from("stories")
    .select("*")
    .eq("id", storyId)
    .single();

  if (error) {
    message.textContent = "Error loading story.";
    return;
  }

  document.getElementById("title").value = data.title;
  document.getElementById("content").value = data.content;
}

loadStory();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  const { error } = await window.supabaseClient
    .from("stories")
    .update({
      title: title,
      content: content
    })
    .eq("id", storyId);

  if (error) {
    message.textContent = "Error: " + error.message;
  } else {
    alert("Story updated successfully!");
    window.location.href = "profile.html";
  }
});
