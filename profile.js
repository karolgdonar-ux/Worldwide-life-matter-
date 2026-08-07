alert("profile.js loaded");

const avatarInput =
  document.getElementById("avatar");

const avatarPreview =
  document.getElementById("avatarPreview");

const bioInput =
  document.getElementById("bio");

const countryInput =
  document.getElementById("country");

const websiteInput =
  document.getElementById("website");

const saveButton =
  document.getElementById("saveProfile");

const message =
  document.getElementById("message");

let currentUser = null;

async function loadProfile() {

  alert("Loading profile...");

  const {
    data: { user },
    error
  } =
    await window.supabaseClient.auth.getUser();

  if (error || !user) {

    alert("Please log in first.");

    window.location.href = "login.html";

    return;

  }

  currentUser = user;

  alert("User found");

  const { data: profile, error: profileError } =
    await window.supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

  console.log(profile);
  console.log(profileError);

  if (profile) {

    bioInput.value =
      profile.bio || "";

    countryInput.value =
      profile.country || "";

    websiteInput.value =
      profile.website || "";

    if (profile.avatar_url) {

      avatarPreview.src =
        profile.avatar_url;

    }

  }

}

avatarInput.addEventListener("change", () => {

  const file =
    avatarInput.files[0];

  if (file) {

    avatarPreview.src =
      URL.createObjectURL(file);

  }

});
saveButton.addEventListener("click", async () => {

  alert("Save button clicked");

  try {

    alert("Inside try block");

    let avatarUrl = "";

    const file =
      avatarInput.files[0];

    if (file) {

      alert("Uploading profile image...");

      const fileName =
        currentUser.id + "-" + Date.now();

      const {
        error: uploadError
      } =
        await window.supabaseClient.storage
          .from("profile-images")
          .upload(fileName, file);

      if (uploadError) {

        alert(uploadError.message);

        throw uploadError;

      }

      alert("Image uploaded successfully");

      const {
        data: { publicUrl }
      } =
        window.supabaseClient.storage
          .from("profile-images")
          .getPublicUrl(fileName);

      avatarUrl = publicUrl;

    }

    alert("Preparing profile data");

    const profileData = {

      id: currentUser.id,

      bio:
        bioInput.value.trim(),

      country:
        countryInput.value.trim(),

      website:
        websiteInput.value.trim()

    };

    if (avatarUrl) {

      profileData.avatar_url =
        avatarUrl;

    }

    alert("Saving profile to database...");
    const { data, error } =
      await window.supabaseClient
        .from("profiles")
        .upsert(profileData)
        .select();

    console.log(data);
    console.log(error);

    if (error) {

      alert(error.message);

      throw error;

    }

    alert("Database saved successfully");

    message.textContent =
      "Profile saved successfully!";

    alert("Your profile has been updated!");

  } catch (error) {

    console.error(error);

    alert(error.message);

    message.textContent =
      "Error: " + error.message;

  }

});

loadProfile();
