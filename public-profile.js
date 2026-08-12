alert("Public profile JavaScript is running");


/* =================================
   ELEMENTS
================================= */

const loading =
  document.getElementById("profileLoading");

const errorBox =
  document.getElementById("profileError");

const profileSection =
  document.getElementById("profileSection");

const profileStats =
  document.getElementById("profileStats");

const storiesSection =
  document.getElementById("userStoriesSection");

const profileAvatar =
  document.getElementById("profileAvatar");

const profileName =
  document.getElementById("profileName");

const profileCountry =
  document.getElementById("profileCountry");

const profileBio =
  document.getElementById("profileBio");

const profileWebsite =
  document.getElementById("profileWebsite");

const profileWebsiteContainer =
  document.getElementById(
    "profileWebsiteContainer"
  );

const storyCount =
  document.getElementById("storyCount");

const likeCount =
  document.getElementById("likeCount");

const userStories =
  document.getElementById("userStories");


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
   SHOW ERROR
================================= */

function showError(message) {

  if (loading) {

    loading.style.display = "none";

  }

  if (profileSection) {

    profileSection.style.display = "none";

  }

  if (profileStats) {

    profileStats.style.display = "none";

  }

  if (storiesSection) {

    storiesSection.style.display = "none";

  }

  if (errorBox) {

    errorBox.textContent =
      "Error loading profile: " + message;

    errorBox.style.display = "block";

  }

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
   LOAD PROFILE
================================= */

async function loadPublicProfile() {

  try {

    const profileId =
      getProfileId();


    /* =============================
       CHECK ID
    ============================= */

    if (!profileId) {

      showError(
        "No profile was specified."
      );

      return;

    }


    /* =============================
       CHECK SUPABASE
    ============================= */

    if (!window.supabaseClient) {

      showError(
        "Supabase is not connected."
      );

      return;

    }


    console.log(
      "Loading public profile:",
      profileId
    );


    /* =============================
       LOAD PROFILE
    ============================= */

    const {
      data: profile,
      error: profileError
    } =
      await window.supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .maybeSingle();


    console.log(
      "Profile:",
      profile
    );

alert(
  "Profile data: " +
  JSON.stringify(profile)
);

    if (profileError) {

      console.error(
        "Profile error:",
        profileError
      );

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


    /* =============================
       PROFILE NAME
    ============================= */

    const name =
      profile.name ||
      profile.username ||
      profile.full_name ||
      profile.display_name ||
      "Worldwide Life Matter User";


    profileName.textContent =
      name;


    /* =============================
       COUNTRY
    ============================= */

    const country =
      profile.country ||
      "Country not provided";


    profileCountry.textContent =
      "🌍 " + country;


    /* =============================
       BIO
    ============================= */

    profileBio.textContent =
      profile.bio ||
      "No bio available.";


    /* =============================
       PROFILE PHOTO
    ============================= */

    if (profile.avatar_url) {

      profileAvatar.src =
        profile.avatar_url;

    }


    /* =============================
       WEBSITE
    ============================= */

    if (profile.website) {

      let website =
        profile.website.trim();


      if (
        !website.startsWith("http://") &&
        !website.startsWith("https://")
      ) {

        website =
          "https://" + website;

      }


      profileWebsite.href =
        website;

      profileWebsite.textContent =
        profile.website;

      profileWebsiteContainer.style.display =
        "block";

    } else {

      profileWebsiteContainer.style.display =
        "none";

    }


    /* =============================
       SHOW PROFILE
    ============================= */

    profileSection.style.display =
      "flex";


    /* =============================
       LOAD USER STORIES
    ============================= */

    const {
      data: stories,
      error: storiesError
    } =
      await window.supabaseClient
        .from("stories")
        .select("*")
        .eq("user_id", profileId)
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    console.log(
      "User stories:",
      stories
    );


    if (storiesError) {

      console.error(
        "Stories error:",
        storiesError
      );

      storyCount.textContent =
        "0";

      userStories.innerHTML =
        "<p>Unable to load stories.</p>";

    } else {

      storyCount.textContent =
        stories
          ? stories.length
          : 0;


      displayStories(
        stories || []
      );

    }


    /* =============================
       LOAD TOTAL LIKES
    ============================= */

    let totalLikes = 0;


    if (stories && stories.length > 0) {

      for (
        const story of stories
      ) {

        const {
          count,
          error: likesError
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


        if (!likesError) {

          totalLikes +=
            count || 0;

        }

      }

    }


    likeCount.textContent =
      totalLikes;


    /* =============================
       SHOW STATS AND STORIES
    ============================= */

    profileStats.style.display =
      "flex";

    storiesSection.style.display =
      "block";


    /* =============================
       HIDE LOADING
    ============================= */

    loading.style.display =
      "none";


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
   DISPLAY STORIES
================================= */

function displayStories(stories) {

  if (!userStories) {

    return;

  }


  if (
    !stories ||
    stories.length === 0
  ) {

    userStories.innerHTML = `

      <div class="empty-profile-stories">

        <p>
          This user has not shared any stories yet.
        </p>

      </div>

    `;

    return;

  }


  userStories.innerHTML = "";


  stories.forEach(
    (story) => {


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


      let dateHtml =
        "";


      if (story.created_at) {

        const date =
          new Date(
            story.created_at
          );


        if (
          !isNaN(
            date.getTime()
          )
        ) {

          dateHtml = `

            <small>
              ${escapeHtml(
                date.toLocaleDateString()
              )}
            </small>

          `;

        }

      }


      const category =
        story.category ||
        "Other";


      const title =
        story.title ||
        "Untitled Story";


      const content =
        story.content ||
        "";


      userStories.innerHTML += `

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
                category
              )}
            </p>


            <h3>

              ${escapeHtml(
                title
              )}

            </h3>


            <p>

              ${escapeHtml(
                content
              )}

            </p>


            ${dateHtml}


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
  );

}


/* =================================
   START
================================= */

loadPublicProfile();
