"use client";

import { useCallback, useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  EmailJSNotConfiguredError,
  EmailJSSecurityError,
  sendContactEmail,
} from "@/lib/emailjs";

type FormFields = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

type FormStatus = "idle" | "submitting" | "success" | "error";

type SubmitErrorKind = "config" | "security" | "generic" | null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClassName =
  "w-full rounded-lg border border-border/50 bg-background/40 px-4 py-2.5 text-sm transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function ContactForm() {
  const t = useTranslations("contact.form");

  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submitError, setSubmitError] = useState<SubmitErrorKind>(null);

  const validate = useCallback((): FormErrors => {
    const next: FormErrors = {};

    if (!fields.name.trim()) {
      next.name = t("validation.nameRequired");
    }

    if (!fields.email.trim()) {
      next.email = t("validation.emailRequired");
    } else if (!EMAIL_PATTERN.test(fields.email.trim())) {
      next.email = t("validation.emailInvalid");
    }

    if (!fields.message.trim()) {
      next.message = t("validation.messageRequired");
    }

    return next;
  }, [fields, t]);

  const handleChange = (field: keyof FormFields, value: string): void => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (status === "success" || status === "error") {
      setStatus("idle");
      setSubmitError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setStatus("submitting");

    try {
      await sendContactEmail({
        name: fields.name.trim(),
        email: fields.email.trim(),
        message: fields.message.trim(),
      });
      setFields({ name: "", email: "", message: "" });
      setStatus("success");
    } catch (error) {
      if (error instanceof EmailJSNotConfiguredError) {
        setSubmitError("config");
      } else if (error instanceof EmailJSSecurityError) {
        setSubmitError("security");
      } else {
        setSubmitError("generic");
      }
      setStatus("error");
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
      aria-label={t("title")}
    >
      <h3 className="text-lg font-semibold tracking-tight">{t("title")}</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-sm font-medium">
            {t("nameLabel")}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={fields.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder={t("namePlaceholder")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            disabled={isSubmitting}
            className={cn(
              inputClassName,
              errors.name &&
                "border-destructive/60 focus:border-destructive/60 focus:ring-destructive/30"
            )}
          />
          {errors.name ? (
            <p
              id="contact-name-error"
              role="alert"
              className="text-destructive text-sm"
            >
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-sm font-medium">
            {t("emailLabel")}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={fields.email}
            onChange={(event) => handleChange("email", event.target.value)}
            placeholder={t("emailPlaceholder")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            disabled={isSubmitting}
            className={cn(
              inputClassName,
              errors.email &&
                "border-destructive/60 focus:border-destructive/60 focus:ring-destructive/30"
            )}
          />
          {errors.email ? (
            <p
              id="contact-email-error"
              role="alert"
              className="text-destructive text-sm"
            >
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-message" className="text-sm font-medium">
            {t("messageLabel")}
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            value={fields.message}
            onChange={(event) => handleChange("message", event.target.value)}
            placeholder={t("messagePlaceholder")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
            disabled={isSubmitting}
            className={cn(
              inputClassName,
              "min-h-[8rem] resize-y",
              errors.message &&
                "border-destructive/60 focus:border-destructive/60 focus:ring-destructive/30"
            )}
          />
          {errors.message ? (
            <p
              id="contact-message-error"
              role="alert"
              className="text-destructive text-sm"
            >
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      {status === "success" ? (
        <p
          role="status"
          aria-live="polite"
          className="border-primary/30 bg-primary/10 text-foreground rounded-lg border px-4 py-3 text-sm"
        >
          {t("success")}
        </p>
      ) : null}

      {status === "error" ? (
        <p
          role="alert"
          aria-live="assertive"
          className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm"
        >
          {submitError === "config"
            ? t("errorConfig")
            : submitError === "security"
              ? t("errorSecurity")
              : t("error")}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            {t("sending")}
          </>
        ) : (
          <>
            <Send aria-hidden />
            {t("send")}
          </>
        )}
      </Button>
    </form>
  );
}
