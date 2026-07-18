alert("script.js loaded!");

const form = document.getElementById("signup-form");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    alert("Create Account button clicked!");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {
      const { data, error } = await window.supabaseClient.auth.signUp({
        email,
        password
      });

      console.log(data);
      console.log(error);

      if (error) {
        message.textContent = "Error: " + error.message;
        alert(error.message);
      } else {
        message.textContent = "Success! Check your email to confirm your account.";
        alert("Signup successful!");
      }
    } catch (err) {
      console.error(err);
      message.textContent = err.message;
      alert("JavaScript Error: " + err.message);
    }
  });
}
