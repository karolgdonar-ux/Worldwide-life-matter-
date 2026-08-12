alert("Public profile JavaScript is running");

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
  document.getElementById("profileWebsiteContainer");

const storyCount =
  document.getElementById("storyCount");

const likeCount =
  document.getElementById("likeCount");

const userStories =
  document.getElementById("userStories");


function getProfileId() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get("id");

}


function escapeHtml(value) {

  const div =
    document.createElement("div");

  div.textContent =
    value == null
      ? ""
      : String(value);

  return div.innerHTML;

}


function showError(message) {

  if (loading) {

    loading.style.display = "none";

  }

  if (errorBox) {

    errorBox.textContent =
      "Error loading profile: " + message;

    errorBox.style.display =
      "block";

  }

}


async function loadPublicProfile() {

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


    /* ==========================
       GET PROFILE
    ========================== */

    const {
      data: profile,
      error
    } =
      await window.supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .maybeSingle();


    if (error) {

      console.error(error);

      showError(
        error.message
      );

      return;

    }


    if (!profile) {

      showError(
        "This profile does not exist."
      );

      return;

    }


    /* ==========================
       DISPLAY PROFILE IMMEDIATELY
    ========================== */

    profileName.textContent =
      profile.name ||
      profile.username ||
      profile.full_name ||
      profile.display_name ||
      "Worldwide Life Matter User";


    profileCountry.textContent =
      "🌍 " +
      (
        profile.country ||
        "Country not provided"
      );


    profileBio.textContent =
      profile.bio ||
      "No bio available.";


    if (profile.avatar_url) {

      profileAvatar.src =
        profile.avatar_url;

    }


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


    /* SHOW PROFILE NOW */

    profileSection.style.display =
      "flex";


    loading.style.display =
      "none";


    /* ==========================
       LOAD STORIES SEPARATELY
    ========================== */

    try {

      const {
        data: stories,
        error: storiesError
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


      if (storiesError) {

        console.error(
          "Stories error:",
          storiesError
        );

        storyCount.textContent =
          "0";

        userStories.innerHTML =
          "<p>Stories could not be loaded.</p>";

      } else {

        storyCount.textContent =
          stories.length;


        displayStories(
          stories
        );


        /* ========================
           COUNT LIKES
        ======================== */

        let totalLikes = 0;


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

        }


        likeCount.textContent =
          totalLikes;

      }


      profileStats.style.display =
        "flex";

      storiesSection.style.display =
        "block";


    } catch (storyError) {

      console.error(
        "Story loading error:",
        storyError
      );

      profileStats.style.display =
        "flex";

      storiesSection.style.display =
        "block";

    }


  } catch (error) {

    console.error(
      "Profile error:",
      error
    );

    showError(
      error.message
    );

  }

}


function displayStories(stories) {

  if (!stories || stories.length === 0) {

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
    story => {

      let imageHtml = "";


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

              ${story.created_at
                ? new Date(
                    story.created_at
                  ).toLocaleDateString()
                : ""}

            </small>

          </div>

        </article>

      `;

    }
  );

}


loadPublicProfile();
