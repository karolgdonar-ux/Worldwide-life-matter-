let currentUser = null;

async function getCurrentUser() {
  const { data } = await window.supabaseClient.auth.getUser();
  currentUser = data.user;
}

async function loadStories() {

  const container = document.getElementById("stories-list");

  const { data: stories, error } =
    await window.supabaseClient
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML =
      "<p>Error loading stories.</p>";
    return;
  }

  if (!stories || stories.length === 0) {
    container.innerHTML =
      "<p>No stories have been shared yet.</p>";
    return;
  }

  container.innerHTML = "";

  for (const story of stories) {

    const { count } =
      await window.supabaseClient
        .from("likes")
        .select("*", {
          count: "exact",
          head: true
        })
        .eq("story_id", story.id);

    let liked = false;

    if (currentUser) {

      const { data } =
        await window.supabaseClient
          .from("likes")
          .select("*")
          .eq("story_id", story.id)
          .eq("user_id", currentUser.id);

      liked = data.length > 0;
    }
    const { data: comments } =
      await window.supabaseClient
        .from("comments")
        .select("*")
        .eq("story_id", story.id)
        .order("created_at", { ascending: true });

    let commentsHtml = "";

    if (comments && comments.length > 0) {
      comments.forEach(comment => {
        commentsHtml += `
          <div class="comment">
            <strong>${comment.author || "Anonymous"}</strong><br>
            ${comment.comment}
            <hr>
          </div>
        `;
      });
    } else {
      commentsHtml = "<p>No comments yet.</p>";
    }

    container.innerHTML += `
      <div class="story">

        <h2>${story.title}</h2>

        <p>${story.content}</p>

        <small>
          By: ${story.author || "Anonymous"}
        </small>

        <br><br>

        <button onclick="toggleLike('${story.id}')">
          ${liked ? "💔 Unlike" : "❤️ Like"}
        </button>

        <span>${count || 0} Likes</span>

        <h3>Comments</h3>

        ${commentsHtml}

        ${
          currentUser
            ? `
            <textarea
              id="comment-${story.id}"
              placeholder="Write a comment..."
            ></textarea>

            <br>

            <button onclick="addComment('${story.id}')">
              Post Comment
            </button>
          `
            : "<p><em>Log in to comment.</em></p>"
        }

        <hr>

      </div>
    `;
  }
}
async function toggleLike(storyId) {

  if (!currentUser) {
    alert("Please log in first.");
    return;
  }

  const { data } =
    await window.supabaseClient
      .from("likes")
      .select("*")
      .eq("story_id", storyId)
      .eq("user_id", currentUser.id);

  if (data.length > 0) {

    await window.supabaseClient
      .from("likes")
      .delete()
      .eq("story_id", storyId)
      .eq("user_id", currentUser.id);

  } else {

    await window.supabaseClient
      .from("likes")
      .insert({
        story_id: storyId,
        user_id: currentUser.id
      });

  }

  loadStories();
}

async function addComment(storyId) {

  const box =
    document.getElementById("comment-" + storyId);

  const comment = box.value.trim();

  if (comment === "") {
    alert("Please write a comment.");
    return;
  }

  await window.supabaseClient
    .from("comments")
    .insert({
      story_id: storyId,
      user_id: currentUser.id,
      author: currentUser.email,
      comment: comment
    });

  loadStories();
}

getCurrentUser().then(loadStories);
