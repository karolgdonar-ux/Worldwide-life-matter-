alert("Public profile JavaScript is running");


/* =================================
   GET PROFILE ID FROM URL
================================= */

const urlParams =
  new URLSearchParams(
    window.location.search
  );

const profileId =
  urlParams.get("id");


/* =================================
   PAGE ELEMENTS
================================= */

const loading =
  document.getElementById(
    "profile-loading"
  );

const profileContent =
  document.getElementById(
    "profile-content"
  );

const profileError =
  document.getElementById(
    "profile-error"
  );

const avatar =
  document.getElementById(
    "profile-avatar"
  );

const profileName =
  document.getElementById(
    "profile-name"
  );

const profileCountry =
  document.getElementById(
    "profile-country"
  );

const profileBio =
  document.getElementById(
    "profile-bio"
  );

const profileWebsite =
  document.getElementById(
    "profile-website"
  );

const noWebsite =
  document.getElementById(
    "no-website"
  );

const storyCount =
  document.getElementById(
    "story-count"
  );

const likeCount =
  document.getElementById(
    "like-count"
  );

const userStories =
  document.getElementById(
    "user-stories"
  );


/* =================================
   ESCAPE HTML
================================= */

function escapeHtml(value) {

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


/* =================================
   LOAD PUBLIC PROFILE
================================= */

async function loadPublicProfile() {

  try {

    if (!profileId) {

      throw new Error(
        "No profile was specified."
      );

    }


    /* ===============================
       GET PROFILE
    =============================== */

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
        .single();


    if (profileError) {

      throw profileError;

    }


    if (!profile) {

      throw new Error(
        "Profile not found."
      );

    }


    /* ===============================
       PROFILE NAME
    =============================== */

    profileName.textContent =
      profile.username ||
      profile.full_name ||
      profile.display_name ||
      "Worldwide Life Matter User";


    /* ===============================
       COUNTRY
    =============================== */

    profileCountry.textContent =
      profile.country ||
      "Not provided";


    /* ===============================
       BIO
    =============================== */

    profileBio.textContent =
      profile.bio ||
      "No bio available.";


    /* ===============================
       PROFILE IMAGE
    =============================== */

    if (profile.avatar_url) {

      avatar.src =
        profile.avatar_url;

    }


    /* ===============================
       WEBSITE
    =============================== */

    if (profile.website) {

      profileWebsite.href =
        profile.website;

      profileWebsite.style.display =
        "inline";

      noWebsite.style.display =
        "none";

    } else {

      profileWebsite.style.display =
        "none";

      noWebsite.style.display =
        "inline";

    }


    /* ===============================
       GET USER STORIES
    =============================== */

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

      throw storiesError;

    }


    const userStoriesData =
      stories || [];


    /* ===============================
       STORY COUNT
    =============================== */

    storyCount.textContent =
      userStoriesData.length;


    /* ===============================
       CALCULATE LIKES
    =============================== */

    let totalLikes = 0;


    for (
      const story
      of userStoriesData
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


    /* ===============================
       DISPLAY STORIES
    =============================== */

    if (
      userStoriesData.length === 0
    ) {

      userStories.innerHTML = `

        <p>
          This user has not published
          any stories yet.
        </p>

      `;

    } else {

      userStories.innerHTML =
        "";


      userStoriesData.forEach(
        (story) => {

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


          let videoHtml =
            "";


          if (story.video_url) {

            videoHtml = `

              <video
                controls
                width="100%"
                class="story-video"
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

            `;

          }


          const storyDate =
            story.created_at
              ? new Date(
                  story.created_at
                ).toLocaleDateString()
              : "";


          userStories.innerHTML += `

            <article
              class="story"
            >

              ${imageHtml}

              ${videoHtml}


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

                ${storyDate}

              </small>


              <hr>

            </article>

          `;

        }
      );

    }


    /* ===============================
       SHOW PROFILE
    =============================== */

    loading.style.display =
      "none";

    profileError.style.display =
      "none";

    profileContent.style.display =
      "block";


  } catch (error) {

    console.error(
      "Public profile error:",
      error
    );


    loading.style.display =
      "none";

    profileContent.style.display =
      "none";

    profileError.style.display =
      "block";

    profileError.innerHTML = `

      <p>
        Error loading profile:
        ${escapeHtml(
          error.message
        )}
      </p>

    `;

  }

}


/* =================================
   START
================================= */

loadPublicProfile();
