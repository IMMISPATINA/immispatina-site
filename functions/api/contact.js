const clean = (value, max = 500) => String(value ?? "").trim().slice(0, max);

const escapeHtml = (value) =>
  clean(value, 4000)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return Response.json({ success: false, error: "Invalid request." }, { status: 415 });
    }

    const body = await request.json();

    const name = clean(body.name, 120);
    const email = clean(body.email, 160);
    const phone = clean(body.phone, 60);
    const nationality = clean(body.nationality, 80);
    const country = clean(body.country, 100);
    const service = clean(body.service, 100);
    const family = clean(body.family, 50);
    const language = clean(body.language, 50);
    const message = clean(body.message, 3000);

    if (!name || !email || !country || !service || !message) {
      return Response.json(
        { success: false, error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return Response.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const subject = `New IMMISPATINA consultation — ${service} — ${name}`;

    const text = [
      "New consultation request from immispatina.com",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone / WhatsApp: ${phone || "Not provided"}`,
      `Nationality: ${nationality || "Not provided"}`,
      `Current country: ${country}`,
      `Service: ${service}`,
      `Family members included: ${family || "Not provided"}`,
      `Preferred language: ${language || "Not provided"}`,
      "",
      "Message:",
      message
    ].join("\n");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#171719">
        <h2 style="color:#711322">New IMMISPATINA consultation request</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Name</b></td><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Email</b></td><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Phone / WhatsApp</b></td><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(phone || "Not provided")}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Nationality</b></td><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(nationality || "Not provided")}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Current country</b></td><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(country)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Service</b></td><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(service)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Family</b></td><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(family || "Not provided")}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Language</b></td><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(language || "Not provided")}</td></tr>
        </table>
        <h3 style="margin-top:28px">Message</h3>
        <div style="white-space:pre-wrap;background:#f7f3ee;padding:16px;border-radius:12px">${escapeHtml(message)}</div>
      </div>
    `;

    const result = await env.EMAIL.send({
      to: "info@immispatina.com",
      from: "website@immispatina.com",
      replyTo: email,
      subject,
      text,
      html
    });

    return Response.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error("Contact form error:", error);
    return Response.json(
      { success: false, error: "Unable to send consultation request." },
      { status: 500 }
    );
  }
}
