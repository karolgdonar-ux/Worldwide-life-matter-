async function loadProfile() {
  const {
    data: { user },
    error
  } = await window.supabaseClient.auth.getUser();

  if (error || !user) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("user-email").textContent =
    "📧 " + user.email;

  const { data: stories, error: storyError } =
    await window.supabaseClient
      .from("stories")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

  const container = document.getElementById("my-stories");

  if (storyError) {
    container.innerHTML =
      "<p>Error loading your stories.</p>";
    return;
  }

  if (!stories || stories.length === 0) {
    container.innerHTML =
      "<p>You haven't shared any stories yet.</p>";
    return;
  }

  container.innerHTML = "";

   stories.forEach((story) => {
  container.innerHTML += `
    <div class="story">
      <h2>${story.title}</h2>
      <p>${story.content}</p>
      <small>By: ${story.author}</small>
      <br><br>

      <button onclick="editStory('${story.id}')">✏️ Edit</button>

      <button onclick="deleteStory('${story.id}')">🗑️ Delete</button>

      <hr>
    </div>
  `;
});

}

loadProfile();

document.getElementById("logout-btn").addEventListener("click", async () => {
  await window.supabaseClient.auth.signOut();
  window.location.href = "login.html";
});
async function deleteStory(id) {
  const confirmed = confirm("Are you sure you want to delete this story?");

  if (!confirmed) return;

  const { error } = await window.supabaseClient
    .from("stories")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Error deleting story: " + error.message);
  } else {
    alert("Story deleted successfully!");
    location.reload();
  }
}

function editStory(id) {
  window.location.href = "edit-story.html?id=" + id;
}
