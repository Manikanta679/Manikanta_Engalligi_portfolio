# EmailJS Setup — Contact Form

The contact form sends messages through the portfolio's `/api/contact` server route and [EmailJS](https://www.emailjs.com/) using three environment variables stored in **`.env.local`** (never committed to git). See `.env.example` for a template reference of all project env vars.

## 1. Create an EmailJS account

1. Go to [emailjs.com](https://www.emailjs.com/) and sign up (free tier is sufficient for a portfolio contact form).
2. Verify your email address when prompted.

## 2. Connect Gmail as an email service

1. In the EmailJS dashboard, open **Email Services**.
2. Click **Add New Service** and choose **Gmail**.
3. Click **Connect Account** and sign in with the Gmail account that should send/receive contact form messages (e.g. `manikantahandral@gmail.com`).
4. Save the service and note the **Service ID** (e.g. `service_abc123`).

> **Tip:** On the free plan, emails are sent from your connected Gmail account. Set the template **To Email** to the inbox where you want to receive messages.

## 3. Allow server-side EmailJS requests

1. Open **Account → Security** in EmailJS.
2. Enable **Allow EmailJS API for non-browser applications**.
3. Save the setting.

This is required because the portfolio sends through its own server route rather than making a third-party request directly from the visitor's browser.

## 4. Create an email template

1. Open **Email Templates** → **Create New Template**.
2. Set **To Email** to your inbox (e.g. `manikantahandral@gmail.com`).
3. Set **From Name** to `{{from_name}}` and **Reply To** to `{{reply_to}}` so you can reply directly to the sender.
4. Use these template variables — they must match exactly what the app sends:

| Variable         | Description             |
| ---------------- | ----------------------- |
| `{{from_name}}`  | Sender's name           |
| `{{from_email}}` | Sender's email address  |
| `{{reply_to}}`   | Reply-to (sender email) |
| `{{message}}`    | Message body            |

Example template body:

```
New contact form message

From: {{from_name}} ({{from_email}})

{{message}}
```

5. Save the template and note the **Template ID** (e.g. `template_xyz789`).

## 5. Get your Public Key

1. Open **Account** → **API Keys** (or **General**).
2. Copy the **Public Key** (e.g. `aBcDeFgHiJkLmNoPq`).

## 6. Add credentials to `.env.local`

Open `.env.local` in the project root (create it from the EmailJS section if missing) and paste your three values:

```env
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-public-key-here
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc123
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xyz789
```

| Variable                          | Where to copy from                                |
| --------------------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`  | **Account → API Keys → Public Key**               |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID`  | **Email Services → your service → Service ID**    |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | **Email Templates → your template → Template ID** |

Do **not** use `.env.example` at runtime — it is a template reference only. Only `.env.local` is loaded during local development.

## 7. Restart the dev server

Next.js reads env vars at startup. After editing `.env.local`:

```bash
npm run dev
```

In development, the browser console logs which EmailJS vars are loaded or missing (values are never logged):

```
✓ EmailJS Public Key loaded
✓ EmailJS Service ID loaded
✗ EmailJS Template ID missing
```

## 8. Test the contact form

1. Open [http://localhost:3000](http://localhost:3000) and scroll to **Contact**.
2. Fill in Name, Email, and Message, then click **Send Message**.
3. Check your inbox and the EmailJS dashboard **Logs** tab for delivery status.

If any env var is missing, the form shows:

> EmailJS has not been configured yet. Please add your EmailJS credentials to .env.local.

## 9. Deploy to production

Add the same three `NEXT_PUBLIC_*` variables in your hosting provider's environment settings (Vercel, Netlify, etc.) and redeploy. Do not commit `.env.local`.
