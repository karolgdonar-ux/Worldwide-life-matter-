async function loadProfile() {
  const {
    data: { user },
    error,
  } = await window.supabaseClient.auth.getUser();

  if (error || !user) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("user-email").textContent =
    "📧 " + user.email;

  document.getElementById("my-stories").innerHTML = `
    <p>Welcome, ${user.email}!</p>
    <p>Your personal story management page is ready.</p>
    <p>In the next step, we'll show all the stories you have submitted here, with Edit and Delete buttons.</p>
  `;
}

loadProfile();
document.getElementById("logout-btn").addEventListener("click", async () => {
  await window.supabaseClient.auth.signOut();
  window.location.href = "login.html";
});
