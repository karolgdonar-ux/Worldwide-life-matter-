const form = document.getElementById("login-form");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {
      const { error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        message.textContent = "Error: " + error.message;
        alert("Error: " + error.message);
      } else {
        message.textContent = "Login successful!";
        alert("Welcome to Worldwide Life Matter!");
        window.location.href = "dashboard.html";
      }
    } catch (err) {
      message.textContent = "JavaScript Error: " + err.message;
      alert("JavaScript Error: " + err.message);
    }
  });
}
