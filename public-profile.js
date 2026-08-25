/* =================================
   WORLDWIDE LIFE MATTER
   PUBLIC PROFILE
   PART 1 OF 3
================================= */

let currentUser = null;


/* =================================
   GET PROFILE ID FROM URL
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
   SHOW PROFILE ERROR
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
   GET CURRENT USER
================================= */

async function getCurrentUser() {

  if (!window.supabaseClient) {

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
      "Current user error:",
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


    /* =============================
       GET PROFILE
    ============================= */

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


    /* =============================
       PROFILE NAME
    ============================= */

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


    /* =============================
       PROFILE PHOTO
    ============================= */

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


    /* =============================
       COUNTRY
    ============================= */

    const country =
      document.getElementById(
        "profile-country"
      );


    if (country) {

      country.textContent =
        profile.country ||
        "Not provided";

    }


    /* =============================
       BIO
    ============================= */

    const bio =
      document.getElementById(
        "profile-bio"
      );


    if (bio) {

      bio.textContent =
        profile.bio ||
        "No bio available.";

     }
     /* =================================
   WORLDWIDE LIFE MATTER
   PUBLIC PROFILE
   PART 1 OF 3
================================= */

let currentUser = null;


/* =================================
   GET PROFILE ID FROM URL
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
   SHOW PROFILE ERROR
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
   GET CURRENT USER
================================= */

async function getCurrentUser() {

  if (!window.supabaseClient) {

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
      "Current user error:",
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


    /* =============================
       GET PROFILE
    ============================= */

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


    /* =============================
       PROFILE NAME
    ============================= */

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


    /* =============================
       PROFILE PHOTO
    ============================= */

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


    /* =============================
       COUNTRY
    ============================= */

    const country =
      document.getElementById(
        "profile-country"
      );


    if (country) {

      country.textContent =
        profile.country ||
        "Not provided";

    }


    /* =============================
       BIO
    ============================= */

    const bio =
      document.getElementById(
        "profile-bio"
      );


    if (bio) {

      bio.textContent =
        profile.bio ||
        "No bio available.";

  }
     /* =================================
   FOLLOW SYSTEM
================================= */

async function setupFollowSystem(profileId) {

  const followersCount =
    document.getElementById(
      "followers-count"
    );

  const followingCount =
    document.getElementById(
      "following-count"
    );

  const followButton =
    document.getElementById(
      "follow-button"
    );

  const followMessage =
    document.getElementById(
      "follow-message"
    );


  if (
    !followersCount ||
    !followingCount ||
    !followButton
  ) {

    return;

  }


  /* =============================
     GET CURRENT USER
  ============================= */

  await getCurrentUser();


  /* =============================
     FOLLOWERS COUNT
  ============================= */

  const {
    count: followers,
    error: followersError
  } =
    await window.supabaseClient
      .from("followers")
      .select("*", {
        count: "exact",
        head: true
      })
      .eq(
        "following_id",
        profileId
      );


  if (followersError) {

    console.error(
      "Followers count error:",
      followersError
    );

  }


  followersCount.textContent =
    followers || 0;


  /* =============================
     FOLLOWING COUNT
  ============================= */

  const {
    count: following,
    error: followingError
  } =
    await window.supabaseClient
      .from("followers")
      .select("*", {
        count: "exact",
        head: true
      })
      .eq(
        "follower_id",
        profileId
      );


  if (followingError) {

    console.error(
      "Following count error:",
      followingError
    );

  }


  followingCount.textContent =
    following || 0;


  /* =============================
     CANNOT FOLLOW YOURSELF
  ============================= */

  if (
    currentUser &&
    currentUser.id === profileId
  ) {

    followButton.style.display =
      "none";

    return;

  }


  /* =============================
     NOT LOGGED IN
  ============================= */

  if (!currentUser) {

    followButton.textContent =
      "Log in to Follow";

    followButton.style.display =
      "inline-block";

    followButton.onclick =
      function () {

        window.location.href =
          "login.html";

      };

    return;

  }


  /* =============================
     CHECK FOLLOW STATUS
  ============================= */

  const {
    data: existingFollow,
    error: followCheckError
  } =
    await window.supabaseClient
      .from("followers")
      .select("id")
      .eq(
        "follower_id",
        currentUser.id
      )
      .eq(
        "following_id",
        profileId
      )
      .maybeSingle();


  if (followCheckError) {

    console.error(
      "Follow check error:",
      followCheckError
    );

  }


  if (existingFollow) {

    followButton.textContent =
      "Following";

    followButton.dataset.following =
      "true";

  } else {

    followButton.textContent =
      "Follow";

    followButton.dataset.following =
      "false";

  }


  followButton.style.display =
    "inline-block";


  /* =============================
     FOLLOW / UNFOLLOW
  ============================= */

  followButton.onclick =
    async function () {

      followButton.disabled =
        true;


      if (
        followButton.dataset.following ===
        "true"
      ) {

        /* =========================
           UNFOLLOW
        ========================= */

        const {
          error
        } =
          await window.supabaseClient
            .from("followers")
            .delete()
            .eq(
              "follower_id",
              currentUser.id
            )
            .eq(
              "following_id",
              profileId
            );


        if (error) {

          console.error(
            "Unfollow error:",
            error
          );

          if (followMessage) {

            followMessage.textContent =
              error.message;

          }

        } else {

          followButton.textContent =
            "Follow";

          followButton.dataset.following =
            "false";


          const currentCount =
            parseInt(
              followersCount.textContent
            ) || 0;


          followersCount.textContent =
            Math.max(
              0,
              currentCount - 1
            );

        }


      } else {

        /* =========================
           FOLLOW
        ========================= */

        const {
          error
        } =
          await window.supabaseClient
            .from("followers")
            .insert([
              {
                follower_id:
                  currentUser.id,

                following_id:
                  profileId
              }
            ]);


        if (error) {

          console.error(
            "Follow error:",
            error
          );

          if (followMessage) {

            followMessage.textContent =
              error.message;

          }

        } else {

          /* =========================
             FOLLOW NOTIFICATION
          ========================= */

          const {
            error: notificationError
          } =
            await window.supabaseClient
              .from("notifications")
              .insert([
                {
                  user_id:
                    profileId,

                  actor_id:
                    currentUser.id,

                  type:
                    "follow",

                  message:
                    "Someone started following you.",

                  reference_id:
                    currentUser.id,

                  is_read:
                    false
                }
              ]);


          if (notificationError) {

            console.error(
              "Follow notification error:",
              notificationError
            );

          }


          followButton.textContent =
            "Following";

          followButton.dataset.following =
            "true";


          const currentCount =
            parseInt(
              followersCount.textContent
            ) || 0;


          followersCount.textContent =
            currentCount + 1;

        }

      }


      followButton.disabled =
        false;

    };

}


/* =================================
   START PUBLIC PROFILE
================================= */

async function startPublicProfile() {

  try {

    if (!window.supabaseClient) {

      showError(
        "Supabase is not connected."
      );

      return;

    }


    const profileId =
      getProfileId();


    if (!profileId) {

      showError(
        "No profile was specified."
      );

      return;

    }


    await getCurrentUser();

    await loadPublicProfile();

    await setupFollowSystem(
      profileId
    );


  } catch (error) {

    console.error(
      "Public profile startup error:",
      error
    );

    showError(
      error.message ||
      "Unable to load profile."
    );

  }

}


/* =================================
   START PAGE
================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    startPublicProfile
  );

} else {

  startPublicProfile();

}
