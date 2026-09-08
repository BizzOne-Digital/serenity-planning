"use client";

import { useState, FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  planningFor: "",
  interestedIn: "",
  preferredContactMethod: "Email",
  message: "",
  consent: false,
  website: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setFormError("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || {});
        setFormError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      setForm(initialState);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-card border border-gold-warm/30 bg-cream p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-gold-warm" aria-hidden="true" />
        <h3 className="font-serif text-xl font-semibold text-purple-deep">Thank you for reaching out.</h3>
        <p className="mt-2 text-ink/70">A member of Serenity Planning will contact you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
      >
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
      </div>

      {formError && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full Name" error={errors.fullName}>
          <input
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Phone" error={errors.phone}>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Who are you planning for?" error={errors.planningFor}>
          <select
            value={form.planningFor}
            onChange={(e) => setForm({ ...form, planningFor: e.target.value })}
            className="input"
          >
            <option value="">Select an option</option>
            <option>Myself</option>
            <option>Parent</option>
            <option>Spouse</option>
            <option>Loved One</option>
            <option>Other</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Interested In" error={errors.interestedIn}>
          <select
            required
            value={form.interestedIn}
            onChange={(e) => setForm({ ...form, interestedIn: e.target.value })}
            className="input"
          >
            <option value="">Select an option</option>
            <option>Burial Planning</option>
            <option>Cremation Planning</option>
            <option>Memorial Planning</option>
            <option>General Information</option>
            <option>Not Sure Yet</option>
          </select>
        </Field>
        <Field label="Preferred Contact Method" error={errors.preferredContactMethod}>
          <select
            required
            value={form.preferredContactMethod}
            onChange={(e) => setForm({ ...form, preferredContactMethod: e.target.value })}
            className="input"
          >
            <option>Email</option>
            <option>Phone</option>
            <option>Text</option>
          </select>
        </Field>
      </div>

      <Field label="Message" error={errors.message}>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="input"
        />
      </Field>

      <div>
        <label className="flex items-start gap-3 text-sm text-ink/80">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-ink/30 text-gold-warm focus:ring-gold-warm"
          />
          I consent to being contacted by Serenity Planning about my inquiry.
        </label>
        {errors.consent && <p className="mt-1 text-sm text-red-600">{errors.consent}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-warm px-7 py-3.5 text-base font-semibold text-purple-deep transition-colors hover:bg-gold-champagne disabled:opacity-60 md:w-auto"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Send My Request
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid rgba(29, 23, 33, 0.15);
          border-radius: 0.5rem;
          padding: 0.65rem 0.9rem;
          background: white;
        }
        .input:focus {
          outline: 2px solid #d6ad55;
          outline-offset: 1px;
        }
      `}</style>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
