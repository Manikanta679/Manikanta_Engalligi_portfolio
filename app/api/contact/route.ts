import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

type ContactRequest = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

function getEmailjsConfig() {
  return {
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
  };
}

export async function POST(request: Request) {
  let body: ContactRequest;

  try {
    body = (await request.json()) as ContactRequest;
  } catch {
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (
    !name ||
    name.length > 100 ||
    !EMAIL_PATTERN.test(email) ||
    email.length > 254 ||
    !message ||
    message.length > 5_000
  ) {
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400 });
  }

  const { publicKey, serviceId, templateId } = getEmailjsConfig();

  if (!publicKey || !serviceId || !templateId) {
    return NextResponse.json(
      { code: "EMAILJS_NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          from_name: name,
          from_email: email,
          reply_to: email,
          message,
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error(
        `[Contact API] EmailJS rejected the request (${response.status}): ${detail}`
      );
      const nonBrowserAccessDisabled =
        response.status === 403 &&
        detail.includes("non-browser environments is currently disabled");

      return NextResponse.json(
        {
          code: nonBrowserAccessDisabled
            ? "EMAILJS_NON_BROWSER_DISABLED"
            : "EMAIL_DELIVERY_FAILED",
        },
        { status: nonBrowserAccessDisabled ? 503 : 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Contact API] EmailJS request failed:", error);
    return NextResponse.json(
      { code: "EMAIL_DELIVERY_FAILED" },
      { status: 502 }
    );
  }
}
