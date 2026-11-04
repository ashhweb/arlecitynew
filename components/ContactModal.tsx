import { useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Modal } from "./Modal";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-gold-300 focus:ring-2 focus:ring-gold-300/30 aria-[invalid=true]:border-red-400/70";

/** UI-only contact form with validation. */
export function ContactModal({ open, onClose }: Props) {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const close = () => {
    onClose();
    setTimeout(() => {
      setSent(false);
      setErrors({});
      setValues({ name: "", email: "", message: "" });
    }, 300);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name.";
    if (!EMAIL_RE.test(values.email.trim())) next.email = "Please enter a valid email address.";
    if (values.message.trim().length < 10) next.message = "Your message should be at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  const bind = (key: keyof typeof values) => ({
    id: `contact-${key}`,
    value: values[key],
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `contact-${key}-error` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value })),
  });

  return (
    <Modal open={open} onClose={close} labelledBy="contact-title" className="max-w-lg">
      {sent ? (
        <div className="flex flex-col items-center py-4 text-center">
          <CheckCircle2 className="mb-4 h-14 w-14 text-gold-300" aria-hidden />
          <h2 id="contact-title" className="font-heading text-2xl font-semibold">
            Message sent
          </h2>
          <p className="mt-2 text-sm text-white/70" role="status">
            Thank you, {values.name.trim()}. Our team will get back to you shortly.
          </p>
          <button
            type="button"
            onClick={close}
            data-autofocus
            className="focus-ring mt-6 cursor-pointer rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-navy-900 transition hover:scale-105"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <h2 id="contact-title" className="font-heading text-2xl font-semibold">
              Contact ARLE
            </h2>
            <p className="mt-1 text-sm text-white/60">Questions, partnerships or a demo? Send us a note.</p>
          </div>
          <Field id="contact-name" label="Name" error={errors.name}>
            <input type="text" autoComplete="name" placeholder="Your name" className={inputClass} data-autofocus {...bind("name")} />
          </Field>
          <Field id="contact-email" label="Email" error={errors.email}>
            <input type="email" autoComplete="email" placeholder="you@company.com" className={inputClass} {...bind("email")} />
          </Field>
          <Field id="contact-message" label="Message" error={errors.message}>
            <textarea rows={4} placeholder="How can we help?" className={`${inputClass} resize-none`} {...bind("message")} />
          </Field>
          <button
            type="submit"
            className="focus-ring inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-navy-900 shadow-gold transition hover:-translate-y-0.5 hover:shadow-gold-lg"
          >
            <Send className="h-4 w-4" aria-hidden /> Send message
          </button>
        </form>
      )}
    </Modal>
  );
}
