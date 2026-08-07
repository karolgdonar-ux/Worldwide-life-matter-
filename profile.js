const avatarInput = document.getElementById("avatar");
const avatarPreview = document.getElementById("avatarPreview");
const bioInput = document.getElementById("bio");
const countryInput = document.getElementById("country");
const websiteInput = document.getElementById("website");
const saveButton = document.getElementById("saveProfile");
const message = document.getElementById("message");

let currentUser = null;

async function loadProfile() {

  const {
    data: { user },
    error
  } = await window.supabaseClient.auth.getUser();

  if (error || !user) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  const { data: profile } =
    await window.supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

  if (profile) {

    bioInput.value = profile.bio || "";
    countryInput.value = profile.country || "";
    websiteInput.value = profile.website || "";

    if (profile.avatar_url) {
      avatarPreview.src = profile.avatar_url;
    }

  }

}
avatarInput.addEventListener("change", () => {

  const file = avatarInput.files[0];

  if (file) {
    avatarPreview.src =
      URL.createObjectURL(file);
  }

});

saveButton.addEventListener("click", async () => {

  try {

    let avatarUrl = "";

    const file = avatarInput.files[0];

    if (file) {

      const fileName =
        currentUser.id + "-" + Date.now();

      const { error: uploadError } =
        await window.supabaseClient.storage
          .from("profile-images")
          .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = window.supabaseClient.storage
        .from("profile-images")
        .getPublicUrl(fileName);

      avatarUrl = publicUrl;

    }

    const profileData = {
      id: currentUser.id,
      bio: bioInput.value.trim(),
      country: countryInput.value.trim(),
      website: websiteInput.value.trim()
    };

    if (avatarUrl) {
      profileData.avatar_url = avatarUrl;
    }
    const { error } =
      await window.supabaseClient
        .from("profiles")
        .upsert(profileData);

    if (error) {
      throw error;
    }

    message.textContent =
      "Profile saved successfully!";

    alert("Your profile has been updated!");

  } catch (error) {

    console.error(error);

    message.textContent =
      "Error: " + error.message;

    alert("Error: " + error.message);

  }

});

loadProfile();
