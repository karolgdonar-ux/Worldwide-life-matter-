document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;

  if (!supabase) {
    console.error("Supabase client not found.");
    return;
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.log("No logged-in user. Notifications are hidden.");
    return;
  }

  // Create notification button
  const header = document.querySelector(".top-header nav");

  if (!header) {
    console.error("Header not found.");
    return;
  }

  const notificationButton = document.createElement("button");
  notificationButton.id = "notification-button";
  notificationButton.innerHTML = "🔔 <span id=\"notification-count\">0</span>";
  notificationButton.title = "Notifications";

  notificationButton.style.cssText = `
    margin-left: 15px;
    padding: 8px 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 18px;
  `;

  header.appendChild(notificationButton);

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

    const unread = data.filter(notification => !notification.is_read);

    document.getElementById("notification-count").textContent = unread.length;

    console.log("Notifications:", data);
  }

  await loadNotifications();

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
      (payload) => {
        console.log("New notification:", payload.new);
        loadNotifications();
        alert("🔔 You have a new notification!");
      }
    )
    .subscribe();

  // Mark unread notifications as read
  notificationButton.addEventListener("click", async () => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      console.error("Error marking notifications as read:", error);
      return;
    }

    document.getElementById("notification-count").textContent = "0";

    alert("Notifications marked as read.");
  });
});
