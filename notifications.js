document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;

  if (!supabase) {
    console.error("Supabase client not found.");
    return;
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.log("No logged-in user.");
    return;
  }

  // Use the notification button already in index.html
  const notificationButton =
    document.getElementById("notification-button");

  const notificationCount =
    document.getElementById("notification-count");

  if (!notificationButton || !notificationCount) {
    console.error("Notification button not found.");
    return;
  }

  // Create notification panel
  const panel = document.createElement("div");
  panel.id = "notification-panel";

  panel.style.cssText = `
    display: none;
    position: absolute;
    top: 60px;
    right: 10px;
    width: 300px;
    max-height: 400px;
    overflow-y: auto;
    background: white;
    color: #222;
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.25);
    z-index: 9999;
  `;

  panel.innerHTML = `
    <h3 style="margin-top:0;">🔔 Notifications</h3>
    <div id="notification-list">
      Loading...
    </div>
  `;

  document.body.appendChild(panel);

  // Load notifications
  async function loadNotifications() {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading notifications:", error);
      return;
    }

    const unread = data.filter(
      notification => !notification.is_read
    );

    notificationCount.textContent = unread.length;

    const list = document.getElementById("notification-list");

    if (data.length === 0) {
      list.innerHTML = `
        <p>No notifications yet.</p>
      `;
      return;
    }

    list.innerHTML = data.map(notification => {
      const message =
        notification.message ||
        notification.content ||
        notification.title ||
        "New notification";

      return `
  <div
    class="notification-item"
    data-story-id="${notification.reference_id || ""}"
    style="
          padding:10px;
          margin-bottom:8px;
          border-bottom:1px solid #ddd;
          ${notification.is_read ? "opacity:0.6;" : ""}
        ">
          <strong>${message}</strong>
          <br>
          <small>
            ${new Date(notification.created_at).toLocaleString()}
          </small>
        </div>
      `;
    }).join("");
  }

  await loadNotifications();

  // Open / close notification panel
  notificationButton.addEventListener("click", async () => {
  if (panel.style.display === "none") {
    panel.style.display = "block";
    await loadNotifications();
  } else {
    panel.style.display = "none";
  }
});

document
  .getElementById("notification-list")
  .addEventListener("click", (event) => {

    const notification =
      event.target.closest(".notification-item");

    if (!notification) return;

    const storyId =
      notification.dataset.storyId;

    if (!storyId) return;

    window.location.href =
      "stories.html#story-" +
      encodeURIComponent(storyId);
  });

  // Listen for new notifications
  supabase
    .channel("notifications-" + user.id)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: "user_id=eq." + user.id
      },
      async (payload) => {
        console.log("New notification:", payload.new);

        await loadNotifications();

        panel.style.display = "block";
      }
    )
    .subscribe();
});
