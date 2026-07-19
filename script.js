alert("script.js loaded!");
alert("window.supabase = " + typeof window.supabase);
alert("window.supabaseClient = " + typeof window.supabaseClient);

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
        password: password
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
      message.textContent = err.message;
      alert("JavaScript Error: " + err.message);
    }
  });
}
