const form = document.getElementById("signup-form");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {
      const { data, error } = await window.supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: "https://karolgdonar-ux.github.io/Worldwide-life-matter-/"
        }
      });

      if (error) {
        message.textContent = "Error: " + error.message;
        alert("Error: " + error.message);
      } else {
        message.textContent =
          "Success! Check your email to confirm your account.";
        alert("Signup successful! Check your email.");
      }
    } catch (err) {
      message.textContent = "JavaScript Error: " + err.message;
      alert("JavaScript Error: " + err.message);
    }
  });
}
