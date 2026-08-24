export const EMAILJS_NOT_CONFIGURED_MESSAGE =
  "EmailJS has not been configured yet. Please add your EmailJS credentials to .env.local.";

export class EmailJSNotConfiguredError extends Error {
  constructor() {
    super(EMAILJS_NOT_CONFIGURED_MESSAGE);
    this.name = "EmailJSNotConfiguredError";
  }
}

export class EmailJSSecurityError extends Error {
  constructor() {
    super("EmailJS non-browser API access is disabled.");
    this.name = "EmailJSSecurityError";
  }
}

export type ContactFormPayload = {
  name: string;
  email: string;
  message: string;
};

export async function sendContactEmail(
  payload: ContactFormPayload
): Promise<void> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as {
      code?: string;
    } | null;

    if (result?.code === "EMAILJS_NOT_CONFIGURED") {
      throw new EmailJSNotConfiguredError();
    }

    if (result?.code === "EMAILJS_NON_BROWSER_DISABLED") {
      throw new EmailJSSecurityError();
    }

    throw new Error("Unable to send contact message.");
  }
}
