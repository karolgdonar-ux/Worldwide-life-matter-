let currentUser = null;


/* =================================
   GET PROFILE ID
================================= */

function getProfileId() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get("id");

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
   SHOW ERROR
================================= */

function showError(message) {

  const loading =
    document.getElementById(
      "profile-loading"
    );

  const content =
    document.getElementById(
      "profile-content"
    );

  const errorBox =
    document.getElementById(
      "profile-error"
    );


  if (loading) {

    loading.style.display =
      "none";

  }


  if (content) {

    content.style.display =
      "none";

  }


  if (errorBox) {

    errorBox.style.display =
      "block";

    errorBox.innerHTML = `

      <p>
        Error loading profile:
        ${escapeHtml(message)}
      </p>

    `;

  }

}


/* =================================
   LOAD PUBLIC PROFILE
================================= */

async function loadPublicProfile() {

  const loading =
    document.getElementById(
      "profile-loading"
    );

  const content =
    document.getElementById(
      "profile-content"
    );


  try {

    const profileId =
      getProfileId();


    if (!profileId) {

      showError(
        "No profile was specified."
      );

      return;

    }


    if (!window.supabaseClient) {

      showError(
        "Supabase is not connected."
      );

      return;

    }


    const {
      data: profile,
      error: profileError
    } =
      await window.supabaseClient
        .from("profiles")
        .select("*")
        .eq(
          "id",
          profileId
        )
        .maybeSingle();


    if (profileError) {

      showError(
        profileError.message
      );

      return;

    }


    if (!profile) {

      showError(
        "This profile does not exist."
      );

      return;

    }


    /* PROFILE NAME */

    const nameElement =
      document.getElementById(
        "profile-name"
      );


    if (nameElement) {

      nameElement.textContent =
        profile.name ||
        profile.username ||
        profile.full_name ||
        profile.display_name ||
        "Worldwide Life Matter Member";

    }


    /* PROFILE PHOTO */

    const avatar =
      document.getElementById(
        "profile-avatar"
      );


    if (
      avatar &&
      profile.avatar_url
    ) {

      avatar.src =
        profile.avatar_url;

    }
    /* COUNTRY */

    const country =
      document.getElementById(
        "profile-country"
      );


    if (country) {

      country.textContent =
        profile.country ||
        "Not provided";

    }


    /* BIO */

    const bio =
      document.getElementById(
        "profile-bio"
      );


    if (bio) {

      bio.textContent =
        profile.bio ||
        "No bio available.";

    }


    /* WEBSITE */

    const website =
      document.getElementById(
        "profile-website"
      );

    const noWebsite =
      document.getElementById(
        "no-website"
      );


    if (
      website &&
      profile.website
    ) {

      let websiteUrl =
        profile.website.trim();


      if (
        !websiteUrl.startsWith(
          "http://"
        ) &&
        !websiteUrl.startsWith(
          "https://"
        )
      ) {

        websiteUrl =
          "https://" +
          websiteUrl;

      }


      website.href =
        websiteUrl;

      website.textContent =
        profile.website;

      website.style.display =
        "inline";


      if (noWebsite) {

        noWebsite.style.display =
          "none";

      }

    }


    /* SHOW PROFILE */

    if (loading) {

      loading.style.display =
        "none";

    }


    if (content) {

      content.style.display =
        "block";

    }


    /* LOAD STORIES */

    await loadUserStories(
      profileId
    );


  } catch (error) {

    console.error(
      "Public profile error:",
      error
    );

    showError(
      error.message
    );

  }

}


/* =================================
   LOAD USER STORIES
================================= */

async function loadUserStories(
  profileId
) {

  const storiesContainer =
    document.getElementById(
      "user-stories"
    );

  const storyCount =
    document.getElementById(
      "story-count"
    );

  const likeCount =
    document.getElementById(
      "like-count"
    );


  if (!storiesContainer) {

    return;

  }


  const {
    data: stories,
    error
  } =
    await window.supabaseClient
      .from("stories")
      .select("*")
      .eq(
        "user_id",
        profileId
      )
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

    storiesContainer.innerHTML =
      "<p>Unable to load stories.</p>";

    return;

  }


  /* STORY COUNT */

  if (storyCount) {

    storyCount.textContent =
      stories
        ? stories.length
        : 0;

  }


  /* NO STORIES */

  if (
    !stories ||
    stories.length === 0
  ) {

    storiesContainer.innerHTML = `

      <div class="empty-profile-stories">

        <p>
          This user has not shared any stories yet.
        </p>

      </div>

    `;


    if (likeCount) {

      likeCount.textContent =
        "0";

    }

    return;

  }


  /* PREPARE STORIES */

  storiesContainer.innerHTML =
    "";

  let totalLikes =
    0;


  for (
    const story of stories
  ) {

    const {
      count
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


    totalLikes +=
      count || 0;


    let imageHtml =
      "";


    if (story.image_url) {

      imageHtml = `

        <img
          src="${escapeHtml(
            story.image_url
          )}"
          alt="Story image"
          class="profile-story-image"
        >

      `;

    }


    let dateText =
      "";


    if (story.created_at) {

      dateText =
        new Date(
          story.created_at
        ).toLocaleDateString();

    }


    storiesContainer.innerHTML += `

      <article
        class="profile-story-card"
      >

        ${imageHtml}

        <div
          class="profile-story-content"
        >

          <p
            class="profile-story-category"
          >
            ${escapeHtml(
              story.category ||
              "Other"
            )}
          </p>


          <h3>
            ${escapeHtml(
              story.title ||
              "Untitled Story"
            )}
          </h3>


          <p>
            ${escapeHtml(
              story.content ||
              ""
            )}
          </p>


          <small>
            ${escapeHtml(
              dateText
            )}
          </small>


          <br><br>


          <a
            href="stories.html"
            class="read-story-link"
          >
            View Stories
          </a>

        </div>

      </article>

    `;

  }


  /* TOTAL LIKES */

  if (likeCount) {

    likeCount.textContent =
      totalLikes;

  }

}
/* =================================
   START PUBLIC PROFILE
================================= */

loadPublicProfile();
