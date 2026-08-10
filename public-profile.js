alert("public-profile.js loaded");

const profileMessage =
  document.getElementById("profile-message");

const publicProfile =
  document.getElementById("public-profile");

const avatar =
  document.getElementById("avatar");

const profileName =
  document.getElementById("profile-name");

const bio =
  document.getElementById("bio");

const country =
  document.getElementById("country");

const website =
  document.getElementById("website");

const userStories =
  document.getElementById("user-stories");


async function loadPublicProfile() {

  alert("Loading public profile...");

  const params =
    new URLSearchParams(window.location.search);

  const userId =
    params.get("id");

  if (!userId) {

    profileMessage.textContent =
      "No user profile was selected.";

    return;
  }

  const {
    data: profile,
    error: profileError
  } =
    await window.supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

  if (profileError) {

    console.error(profileError);

    profileMessage.textContent =
      "Error loading profile: " +
      profileError.message;

    return;
  }

  if (!profile) {

    profileMessage.textContent =
      "Profile not found.";

    return;
  }

  if (profile.avatar_url) {

    avatar.src =
      profile.avatar_url;

  }

  bio.textContent =
    profile.bio ||
    "No bio available.";

  country.textContent =
    profile.country ||
    "Not provided.";

  if (profile.website) {

    website.textContent =
      profile.website;

    website.href =
      profile.website;

  } else {

    website.textContent =
      "Not provided";

    website.removeAttribute("href");

  }

  profileMessage.style.display =
    "none";

  publicProfile.style.display =
    "block";

  await loadUserStories(userId);

}
async function loadUserStories(userId) {

  userStories.innerHTML =
    "<p>Loading stories...</p>";

  const {
    data: stories,
    error
  } =
    await window.supabaseClient
      .from("stories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false
      });

  if (error) {

    console.error(error);

    userStories.innerHTML =
      "<p>Error loading stories: " +
      error.message +
      "</p>";

    return;
  }

  if (!stories || stories.length === 0) {

    userStories.innerHTML =
      "<p>This user has not shared any stories yet.</p>";

    return;
  }

  userStories.innerHTML = "";

  stories.forEach(story => {

    const storyElement =
      document.createElement("div");

    storyElement.className =
      "story";

    storyElement.innerHTML = `

      ${
        story.image_url
          ? `
            <img
              src="${story.image_url}"
              alt="Story Image"
              class="story-image">
          `
          : ""
      }

      ${
        story.video_url
          ? `
            <video
              class="story-video"
              controls
              preload="metadata"
              width="100%">

              <source
                src="${story.video_url}"
                type="video/mp4">

              Your browser does not support
              video playback.

            </video>

            <br><br>
          `
          : ""
      }

      <p>
        <strong>Category:</strong>
        ${story.category || "Other"}
      </p>

      <h2>
        ${story.title || "Untitled Story"}
      </h2>

      <p>
        ${story.content || ""}
      </p>

      <small>
        By: ${story.author || "Anonymous"}
      </small>

      <hr>

    `;

    userStories.appendChild(
      storyElement
    );

  });

}
loadPublicProfile();
