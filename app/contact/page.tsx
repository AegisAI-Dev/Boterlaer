"use client";

import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";

// Note: Since this is a client component, metadata needs to be set differently
// You can add this via the parent layout or use next/head in a wrapper

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // TODO: Replace this with your actual form submission logic
      // Options:
      // 1. Send to your own API endpoint: fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
      // 2. Use a service like Formspree: fetch('https://formspree.io/f/YOUR_FORM_ID', { method: 'POST', body: JSON.stringify(formData) })
      // 3. Use EmailJS or similar service
      // 4. Send to a serverless function

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Form submitted:", formData);

      // Success
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="garden-shell overflow-hidden">
      <section className="section-container pb-10 pt-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <p className="eyebrow">Contact en bezoek</p>
            <h1 className="font-display text-5xl leading-[0.96] text-botanical-forest md:text-7xl">
              Een bericht achterlaten voelt hier als een notitie in een herbarium.
            </h1>
            <p className="prose-custom max-w-2xl">
              Heb je vragen over de tuin, interesse in een plantje of wil je
              iets delen? Neem gerust contact op. De tuin is privé en bezoek is
              enkel mogelijk na persoonlijk overleg.
            </p>
            <div className="botanical-panel max-w-xl rounded-[2rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
                Bezoekregeling
              </p>
              <p className="mt-3 text-base leading-8 text-botanical-ink">
                Den Boterlaer is geen publieke bezoekerslocatie. De website
                dient om de tuin en collectie online te delen.
              </p>
            </div>
          </div>

          <div className="paper-panel rounded-[2.5rem] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
              Contactpunten
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="botanical-panel rounded-[1.75rem] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-botanical-gold">
                  Locatie
                </p>
                <div className="mt-4 space-y-1 text-sm leading-7 text-botanical-ink">
                  {settings?.contact?.address?.name && <p>{settings.contact.address.name}</p>}
                  {settings?.contact?.address?.street && <p>{settings.contact.address.street}</p>}
                  {settings?.contact?.address?.city && <p>{settings.contact.address.city}</p>}
                  {settings?.contact?.address?.country && <p>{settings.contact.address.country}</p>}
                </div>
              </div>

              <div className="botanical-panel rounded-[1.75rem] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-botanical-gold">
                  Bereikbaarheid
                </p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-botanical-ink">
                  {settings?.contact?.email ? (
                    <a
                      href={`mailto:${settings.contact.email}`}
                      className="block text-base font-semibold text-botanical-forest underline decoration-botanical-gold/70 underline-offset-4"
                    >
                      {settings.contact.email}
                    </a>
                  ) : (
                    <p className="italic text-botanical-ink/70">Email informatie wordt geladen...</p>
                  )}
                  {settings?.contact?.note && (
                    <p className="rounded-[1.25rem] border border-botanical-forest/10 bg-botanical-cream px-4 py-3">
                      {settings.contact.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <div className="paper-panel rounded-[2rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
                Praktisch
              </p>
              <h2 className="mt-4 font-display text-3xl text-botanical-forest">
                Bezoek enkel na afspraak
              </h2>
              <p className="mt-4 text-sm leading-7 text-botanical-ink">
                Dit is een privétuin die niet standaard open is voor bezoekers.
                Wil je de tuin graag zien? Neem dan contact op om de
                mogelijkheden te bespreken.
              </p>
            </div>

            <div className="botanical-panel rounded-[2rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
                Waarover kan je schrijven?
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-botanical-ink">
                <li>Vragen over planten en verzorging</li>
                <li>Interesse in een stekje of plantje</li>
                <li>Een mogelijke afspraak of bezoekaanvraag</li>
                <li>Reacties op blogartikels of foto’s</li>
              </ul>
            </div>
          </div>

          <div className="paper-panel rounded-[2.5rem] p-6 md:p-8">
            <div className="mb-6 border-b border-botanical-forest/10 pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
                Bericht versturen
              </p>
              <h2 className="mt-4 font-display text-4xl text-botanical-forest">
                Laat een botanische notitie achter.
              </h2>
              <p className="mt-4 text-sm leading-7 text-botanical-ink">
                Het formulier hieronder behoudt dezelfde werking en validatie,
                maar kreeg een rustigere, meer redactionele presentatie.
              </p>
            </div>

            {submitStatus === "success" && (
              <div className="mb-6 rounded-[1.5rem] border border-green-300 bg-green-50 px-5 py-4 text-green-800">
                <p className="font-semibold">Bedankt voor je bericht.</p>
                <p className="mt-1 text-sm">Ik neem zo snel mogelijk contact met je op.</p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 rounded-[1.5rem] border border-red-300 bg-red-50 px-5 py-4 text-red-800">
                <p className="font-semibold">Er is iets misgegaan.</p>
                <p className="mt-1 text-sm">Probeer het opnieuw of neem direct contact op via email.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-botanical-forest"
                  >
                    Naam *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full rounded-[1.25rem] border bg-white px-4 py-3.5 text-botanical-ink outline-none ${
                      errors.name ? "border-red-500" : "border-botanical-forest/15"
                    }`}
                    placeholder="Je naam"
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-botanical-forest"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-[1.25rem] border bg-white px-4 py-3.5 text-botanical-ink outline-none ${
                      errors.email ? "border-red-500" : "border-botanical-forest/15"
                    }`}
                    placeholder="jouw.email@example.com"
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-botanical-forest"
                >
                  Onderwerp
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-[1.25rem] border border-botanical-forest/15 bg-white px-4 py-3.5 text-botanical-ink outline-none"
                >
                  <option value="">Kies een onderwerp</option>
                  <option value="general">Algemene vraag</option>
                  <option value="plants">Vragen over planten</option>
                  <option value="cutting">Interesse in een stekje/plantje</option>
                  <option value="advice">Tuinadvies</option>
                  <option value="visit">Bezoek (na overleg)</option>
                  <option value="other">Anders</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-botanical-forest"
                >
                  Bericht *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={7}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full resize-none rounded-[1.5rem] border bg-white px-4 py-4 text-botanical-ink outline-none ${
                    errors.message ? "border-red-500" : "border-botanical-forest/15"
                  }`}
                  placeholder="Vertel me hoe ik je kan helpen..."
                />
                {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message}</p>}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-botanical-ink/75">* Verplichte velden</p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isSubmitting ? "Verzenden..." : "Verstuur bericht"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
