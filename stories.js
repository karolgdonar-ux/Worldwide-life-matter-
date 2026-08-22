alert("stories.js loaded");

let currentUser = null;


/* ================================
   GET CURRENT USER
================================ */

async function getCurrentUser() {

  const {
    data,
    error
  } = await window.supabaseClient.auth.getUser();

  if (error) {

    console.error("User error:", error);

    currentUser = null;

    return;

  }

  currentUser = data.user || null;

}


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
      ? searchInput.value
          .trim()
          .toLowerCase()
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
    .order("created_at", {
      ascending: false
    });


  if (error) {

    console.error(
      "Stories error:",
      error
    );

    container.innerHTML =
      "<p>Error loading stories: " +
      error.message +
      "</p>";

    return;

  }


  if (!stories || stories.length === 0) {

    container.innerHTML =
      "<p>No stories have been shared yet.</p>";

    return;

  }


  container.innerHTML = "";


  for (const story of stories) {


    /* ================================
       SEARCH FILTER
    ================================= */

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


    /* ================================
       GET LIKE COUNT
    ================================= */

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


    if (!likeCountError) {

      likeCount =
        count || 0;

    }


    /* ================================
       CHECK IF CURRENT USER LIKED
    ================================= */

    let liked = false;


    if (currentUser) {

      const {
        data: likeData
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


      liked =
        !!(
          likeData &&
          likeData.length > 0
        );

    }


    /* ================================
       LOAD COMMENTS
    ================================= */

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


    let commentsHtml =
      "";


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


    /* ================================
       AUTHOR PROFILE LINK
    ================================= */

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


    /* ================================
       IMAGE
    ================================= */

    let imageHtml =
      "";


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


    /* ================================
       VIDEO
    ================================= */

    let videoHtml =
      "";


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


    /* ================================
       COMMENT BOX
    ================================= */

    let commentBoxHtml =
      "";


    if (currentUser) {

      commentBoxHtml = `

        <textarea
          id="comment-${escapeHtml(
            story.id
          )}"
          placeholder="Write a comment..."
        ></textarea>

        <br><br>

        <button
          onclick="addComment('${escapeHtml(
            story.id
          )}')"
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


    /* ================================
       STORY HTML
    ================================= */

    container.innerHTML += `

      <div class="story">

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
          onclick="toggleLike('${escapeHtml(
            story.id
          )}')"
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

async function toggleLike(
  storyId
) {

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

  } else {

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

  }


  await loadStories();

}


/* ================================
   ADD COMMENT
================================ */

async function addComment(
  storyId
) {

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


  await loadStories();

}


/* ================================
   ESCAPE HTML
================================ */

function escapeHtml(
  value
) {

  const div =
    document.createElement(
      "div"
    );

  div.textContent =
    value == null
      ? ""
      : String(value);

  return div.innerHTML;

}


/* ================================
   START STORIES PAGE
================================ */

async function startStoriesPage() {

  alert(
    "Stories JavaScript is running"
  );


  await getCurrentUser();


  await loadStories();

}


/* ================================
   SEARCH
================================ */

const searchInput =
  document.getElementById(
    "search"
  );


if (searchInput) {

  searchInput.addEventListener(
    "input",
    loadStories
  );

}


/* ================================
   START
================================ */

startStoriesPage();
