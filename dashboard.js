const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", async () => {
  await window.supabaseClient.auth.signOut();

  alert("You have been logged out.");

  window.location.href = "login.html";
});
