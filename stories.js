/* =================================
   WORLDWIDE LIFE MATTER
   STORIES JAVASCRIPT
   PART 1 OF 3
================================= */

let currentUser = null;


/* =================================
   GET CURRENT USER
================================= */

async function getCurrentUser() {

  if (!window.supabaseClient) {

    console.error(
      "Supabase client not found."
    );

    currentUser = null;

    return null;

  }


  const {
    data,
    error
  } =
    await window.supabaseClient
      .auth
      .getUser();


  if (error) {

    console.error(
      "User error:",
      error
    );

    currentUser = null;

    return null;

  }


  currentUser =
    data.user || null;

  return currentUser;

}


/* =================================
   ESCAPE HTML
================================= */

function escapeHtml(value) {

  const div =
    document.createElement("div");

  div.textContent =
    value == null
      ? ""
      : String(value);

  return div.innerHTML;

}


/* =================================
   LOAD STORIES
================================= */

async function loadStories() {

  const container =
    document.getElementById(
      "stories-list"
    );

  const searchInput =
    document.getElementById(
      "search"
    );


  if (!container) {

    console.error(
      "stories-list element not found."
    );

    return;

  }


  const search =
    searchInput
      ? searchInput.value
          .trim()
          .toLowerCase()
      : "";


  container.innerHTML =
    "<p>Loading stories...</p>";


  if (!window.supabaseClient) {

    container.innerHTML =
      "<p>Supabase is not connected.</p>";

    return;

  }


  /* =============================
     GET STORIES
  ============================= */

  const {
    data: stories,
    error
  } =
    await window.supabaseClient
      .from("stories")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );


  if (error) {

    console.error(
      "Stories error:",
      error
    );

    container.innerHTML =
      "<p>Error loading stories: " +
      escapeHtml(error.message) +
      "</p>";

    return;

  }


  if (
    !stories ||
    stories.length === 0
  ) {

    container.innerHTML =
      "<p>No stories have been shared yet.</p>";

    return;

  }


  container.innerHTML = "";


  /* =============================
     BUILD EACH STORY
  ============================= */

  for (
    const story of stories
  ) {

    /* =========================
       SEARCH FILTER
    ========================= */

    const title =
      (
        story.title ||
        ""
      ).toLowerCase();

    const content =
      (
        story.content ||
        ""
      ).toLowerCase();

    const author =
      (
        story.author ||
        ""
      ).toLowerCase();


    if (
      search &&
      !title.includes(search) &&
      !content.includes(search) &&
      !author.includes(search)
    ) {

      continue;

    }


    /* =========================
       LIKE COUNT
    ========================= */

    let likeCount = 0;


    const {
      count,
      error: likeCountError
    } =
      await window.supabaseClient
        .from("likes")
        .select("*", {
          count: "exact",
          head: true
        })
        .eq(
          "story_id",
          story.id
        );


    if (likeCountError) {

      console.error(
        "Like count error:",
        likeCountError
      );

    } else {

      likeCount =
        count || 0;

    }


    /* =========================
       CHECK CURRENT USER LIKE
    ========================= */

    let liked = false;


    if (currentUser) {

      const {
        data: likeData,
        error: likeCheckError
      } =
        await window.supabaseClient
          .from("likes")
          .select("id")
          .eq(
            "story_id",
            story.id
          )
          .eq(
            "user_id",
            currentUser.id
          );


      if (likeCheckError) {

        console.error(
          "Like check error:",
          likeCheckError
        );

      }


      liked =
        !!(
          likeData &&
          likeData.length > 0
        );

  }
     /* ================================
   WORLDWIDE LIFE MATTER
   STORIES
   PART 2 OF 3
================================= */


/* ================================
   LOAD STORIES
================================ */

async function loadStories() {

  const container =
    document.getElementById("stories-list");

  const searchInput =
    document.getElementById("search");


  if (!container) {

    console.error(
      "stories-list element not found."
    );

    return;

  }


  const search =
    searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";


  container.innerHTML =
    "<p>Loading stories...</p>";


  const {
    data: stories,
    error
  } =
    await window.supabaseClient
      .from("stories")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );


  if (error) {

    console.error(
      "Stories loading error:",
      error
    );

    container.innerHTML =
      "<p>Error loading stories: " +
      escapeHtml(error.message) +
      "</p>";

    return;

  }


  if (
    !stories ||
    stories.length === 0
  ) {

    container.innerHTML =
      "<p>No stories have been shared yet.</p>";

    return;

  }


  container.innerHTML = "";


  for (
    const story of stories
  ) {

    /* ==============================
       SEARCH FILTER
    ============================== */

    const title =
      (story.title || "")
        .toLowerCase();

    const content =
      (story.content || "")
        .toLowerCase();

    const author =
      (story.author || "")
        .toLowerCase();


    if (
      search &&
      !title.includes(search) &&
      !content.includes(search) &&
      !author.includes(search)
    ) {

      continue;

    }


    /* ==============================
       LIKE COUNT
    ============================== */

    let likeCount = 0;


    const {
      count,
      error: likeError
    } =
      await window.supabaseClient
        .from("likes")
        .select("*", {
          count: "exact",
          head: true
        })
        .eq(
          "story_id",
          story.id
        );


    if (likeError) {

      console.error(
        "Like count error:",
        likeError
      );

    } else {

      likeCount =
        count || 0;

    }


    /* ==============================
       CHECK CURRENT USER LIKE
    ============================== */

    let liked = false;


    if (currentUser) {

      const {
        data: likeData,
        error: userLikeError
      } =
        await window.supabaseClient
          .from("likes")
          .select("id")
          .eq(
            "story_id",
            story.id
          )
          .eq(
            "user_id",
            currentUser.id
          );


      if (userLikeError) {

        console.error(
          "User like check error:",
          userLikeError
        );

      }


      liked =
        !!(
          likeData &&
          likeData.length > 0
        );

    }


    /* ==============================
       LOAD COMMENTS
    ============================== */

    const {
      data: comments,
      error: commentsError
    } =
      await window.supabaseClient
        .from("comments")
        .select("*")
        .eq(
          "story_id",
          story.id
        )
        .order(
          "created_at",
          {
            ascending: true
          }
        );


    let commentsHtml = "";


    if (
      !commentsError &&
      comments &&
      comments.length > 0
    ) {

      comments.forEach(
        (comment) => {

          commentsHtml += `

            <div class="comment">

              <strong>
                ${escapeHtml(
                  comment.author ||
                  "Anonymous"
                )}
              </strong>

              <br>

              ${escapeHtml(
                comment.comment ||
                ""
              )}

              <hr>

            </div>

          `;

        }
      );

    } else {

      commentsHtml =
        "<p>No comments yet.</p>";

    }


    /* ==============================
       AUTHOR PROFILE LINK
    ============================== */

    let authorHtml =
      escapeHtml(
        story.author ||
        "Anonymous"
      );


    if (story.user_id) {

      authorHtml = `

        <a
          href="public-profile.html?id=${encodeURIComponent(
            story.user_id
          )}"
          class="author-link"
        >
          ${escapeHtml(
            story.author ||
            "Anonymous"
          )}
        </a>

      `;

    }


    /* ==============================
       IMAGE
    ============================== */

    let imageHtml = "";


    if (story.image_url) {

      imageHtml = `

        <img
          src="${escapeHtml(
            story.image_url
          )}"
          alt="Story Image"
          class="story-image"
        >

      `;

    }


    /* ==============================
       VIDEO
    ============================== */

    let videoHtml = "";


    if (story.video_url) {

      videoHtml = `

        <video
          class="story-video"
          controls
          preload="metadata"
          width="100%"
        >

          <source
            src="${escapeHtml(
              story.video_url
            )}"
            type="video/mp4"
          >

          Your browser does not
          support video playback.

        </video>

        <br><br>

      `;

         }
     /* ==============================
   COMMENT BOX
============================== */

let commentBoxHtml = "";


if (currentUser) {

  commentBoxHtml = `

    <textarea
      id="comment-${escapeHtml(story.id)}"
      placeholder="Write a comment..."
    ></textarea>

    <br><br>

    <button
      onclick="addComment('${escapeHtml(story.id)}')"
    >
      Post Comment
    </button>

  `;

} else {

  commentBoxHtml = `

    <p>
      <em>
        Log in to comment.
      </em>
    </p>

  `;

}


/* ==============================
   STORY CARD
============================== */

container.innerHTML += `

  <div
    class="story"
    id="story-${escapeHtml(story.id)}"
  >

    ${imageHtml}

    ${videoHtml}


    <p>

      <strong>
        Category:
      </strong>

      ${escapeHtml(
        story.category ||
        "Other"
      )}

    </p>


    <h2>

      ${escapeHtml(
        story.title ||
        "Untitled Story"
      )}

    </h2>


    <p>

      ${escapeHtml(
        story.content ||
        ""
      )}

    </p>


    <small>

      By:
      ${authorHtml}

    </small>


    <br><br>


    <button
      onclick="toggleLike('${escapeHtml(story.id)}')"
    >

      ${
        liked
          ? "💔 Unlike"
          : "❤️ Like"
      }

    </button>


    <span>

      ${likeCount}
      Likes

    </span>


    <h3>
      Comments
    </h3>


    ${commentsHtml}


    ${commentBoxHtml}


    <hr>

  </div>

`;

  }

}


/* ================================
   LIKE STORY
================================ */

async function toggleLike(storyId) {

  if (!currentUser) {

    alert(
      "Please log in first."
    );

    return;

  }


  const {
    data,
    error
  } =
    await window.supabaseClient
      .from("likes")
      .select("id")
      .eq(
        "story_id",
        storyId
      )
      .eq(
        "user_id",
        currentUser.id
      );


  if (error) {

    alert(
      error.message
    );

    return;

  }


  if (
    data &&
    data.length > 0
  ) {

    const {
      error: deleteError
    } =
      await window.supabaseClient
        .from("likes")
        .delete()
        .eq(
          "story_id",
          storyId
        )
        .eq(
          "user_id",
          currentUser.id
        );


    if (deleteError) {

      alert(
        deleteError.message
      );

      return;

    }

  } else {

    const {
      error: insertError
    } =
      await window.supabaseClient
        .from("likes")
        .insert([
          {
            story_id:
              storyId,

            user_id:
              currentUser.id
          }
        ]);


    if (insertError) {

      alert(
        insertError.message
      );

      return;

    }


    /* ==============================
       CREATE LIKE NOTIFICATION
    ============================== */

    const {
      data: story,
      error: storyError
    } =
      await window.supabaseClient
        .from("stories")
        .select("user_id")
        .eq(
          "id",
          storyId
        )
        .maybeSingle();


    if (
      !storyError &&
      story &&
      story.user_id &&
      story.user_id !== currentUser.id
    ) {

      const {
        error: notificationError
      } =
        await window.supabaseClient
          .from("notifications")
          .insert([
            {
              user_id:
                story.user_id,

              actor_id:
                currentUser.id,

              type:
                "like",

              message:
                "Someone liked your story.",

              reference_id:
                storyId,

              is_read:
                false
            }
          ]);


      if (notificationError) {

        console.error(
          "Like notification error:",
          notificationError
        );

      }

    }

  }


  await loadStories();

}


/* ================================
   ADD COMMENT
================================ */

async function addComment(storyId) {

  if (!currentUser) {

    alert(
      "Please log in first."
    );

    return;

  }


  const textarea =
    document.getElementById(
      "comment-" + storyId
    );


  if (!textarea) {

    return;

  }


  const comment =
    textarea.value.trim();


  if (!comment) {

    alert(
      "Please write a comment."
    );

    return;

  }


  const {
    error
  } =
    await window.supabaseClient
      .from("comments")
      .insert([
        {
          story_id:
            storyId,

          user_id:
            currentUser.id,

          author:
            currentUser.email,

          comment:
            comment
        }
      ]);


  if (error) {

    alert(
      error.message
    );

    return;

  }


  /* ==============================
     GET STORY OWNER
  ============================== */

  const {
    data: story,
    error: storyError
  } =
    await window.supabaseClient
      .from("stories")
      .select("user_id")
      .eq(
        "id",
        storyId
      )
      .maybeSingle();


  /* ==============================
     CREATE COMMENT NOTIFICATION
  ============================== */

  if (
    !storyError &&
    story &&
    story.user_id &&
    story.user_id !== currentUser.id
  ) {

    const {
      error: notificationError
    } =
      await window.supabaseClient
        .from("notifications")
        .insert([
          {
            user_id:
              story.user_id,

            actor_id:
              currentUser.id,

            type:
              "comment",

            message:
              "Someone commented on your story.",

            reference_id:
              storyId,

            is_read:
              false
          }
        ]);


    if (notificationError) {

      console.error(
        "Comment notification error:",
        notificationError
      );

    }

  }


  await loadStories();

}


/* ================================
   OPEN STORY FROM URL
================================ */

function openStoryFromNotification() {

  const hash =
    window.location.hash;


  if (
    !hash ||
    !hash.startsWith("#story-")
  ) {

    return;

  }


  const storyId =
    decodeURIComponent(
      hash.substring(
        "#story-".length
      )
    );


  if (!storyId) {

    return;

  }


  let attempts = 0;

  const maxAttempts = 40;


  function findStory() {

    const storyElement =
      document.getElementById(
        "story-" + storyId
      );


    if (storyElement) {

      storyElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });


      storyElement.style.outline =
        "3px solid orange";


      setTimeout(() => {

        storyElement.style.outline =
          "";

      }, 3000);


      return;

    }


    attempts++;


    if (attempts < maxAttempts) {

      setTimeout(
        findStory,
        250
      );

    } else {

      console.error(
        "Story not found:",
        storyId
      );

    }

  }


  findStory();

}


/* ================================
   START STORIES PAGE
================================ */

async function startStoriesPage() {

  try {

    if (!window.supabaseClient) {

      console.error(
        "Supabase client not found."
      );

      return;

    }


    await getCurrentUser();

    await loadStories();

    openStoryFromNotification();

  } catch (error) {

    console.error(
      "Stories startup error:",
      error
    );

  }

}


/* ================================
   SEARCH
================================ */

function setupSearch() {

  const searchInput =
    document.getElementById(
      "search"
    );


  if (!searchInput) {

    return;

  }


  searchInput.addEventListener(
    "input",
    loadStories
  );

}


/* ================================
   START WHEN PAGE IS READY
================================ */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      setupSearch();

      startStoriesPage();

    }
  );

} else {

  setupSearch();

  startStoriesPage();

  }
