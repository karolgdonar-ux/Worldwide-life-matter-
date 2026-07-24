async function logout() {
  const { error } = await window.supabaseClient.auth.signOut();

  if (error) {
    alert("Logout failed: " + error.message);
  } else {
    alert("You have been logged out.");
    window.location.href = "login.html";
  }
}
