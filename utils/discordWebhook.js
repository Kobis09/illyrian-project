// utils/discordWebhook.js

// 🔹 Send normal Discord notifications (Invest & Mining events)
export async function sendDiscordNotification(title, message, color = 0x3498db) {
  try {
    const webhookURL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK;

    if (!webhookURL) {
      console.error("❌ Discord webhook URL is missing. Check your .env.local file.");
      return;
    }

    const payload = {
      username: "Illyrian Tracker",
      avatar_url: "https://i.ibb.co/vvC0D3mY/illyrian-logo.png",
      embeds: [
        {
          title,
          description: message,
          color, // ✅ dynamic color support
          footer: { text: "Illyrian Project Wallet Tracker" },
          timestamp: new Date(),
        },
      ],
    };

    const response = await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ Failed to send Discord notification: ${response.status} ${response.statusText}\n${errorText}`
      );
    } else {
      console.log("✅ Discord notification sent successfully!");
    }
  } catch (error) {
    console.error("❌ Discord Webhook Error:", error);
  }
}
