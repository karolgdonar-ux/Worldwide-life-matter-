const form = document.getElementById("signup-form");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    const { error } = await window.supabaseClient.auth.signUp({
      password
    });

    if (error) {
      message.textContent = "Error: " + error.message;
    } else {
      message.textContent =
        "Success! Check your email to confirm your account.";
    }
  });
}
