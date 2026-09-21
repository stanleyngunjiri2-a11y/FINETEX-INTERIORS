"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type FormData = {
  service: string;
  location: string;
  property: string;
  budget: string;
  description: string;
  name: string;
  phone: string;
  preferredContact: string;
};

const initialForm: FormData = {
  service: "",
  location: "",
  property: "",
  budget: "",
  description: "",
  name: "",
  phone: "",
  preferredContact: "WhatsApp",
};

const services = [
  "Kitchen",
  "Bathroom",
  "Wardrobe",
  "TV Cabinet",
  "Gypsum Ceiling",
  "Full Interior Renovation",
  "Other",
];

const locations = [
  "Nairobi",
  "Kiambu",
  "Thika",
  "Ruiru",
  "Limuru",
  "Other",
];

const properties = [
  "Apartment",
  "House",
  "Office",
  "Shop / Commercial Space",
  "Other",
];

const budgets = [
  "Below KSh 100,000",
  "KSh 100,000–250,000",
  "KSh 250,000–500,000",
  "KSh 500,000–1,000,000",
  "Above KSh 1,000,000",
  "Not sure yet",
];

export default function EstimatePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateForm = (field: keyof FormData, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const goToNextStep = () => {
    setError("");

    if (step === 1 && !form.service) {
      setError("Please select a service.");
      return;
    }

    if (
      step === 2 &&
      (!form.location || !form.property || !form.budget)
    ) {
      setError("Please complete all project details.");
      return;
    }

    setStep((current) => Math.min(current + 1, 3));
  };

  const goToPreviousStep = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.service ||
      !form.location ||
      !form.property ||
      !form.budget ||
      !form.preferredContact
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error: leadError } = await supabase.from("leads").insert({
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        service: form.service,
        location: form.location,
        property_type: form.property,
        budget: form.budget,
        description: form.description.trim() || null,
        preferred_contact: form.preferredContact,
        source: "Website",
        status: "New",
      });

      if (leadError) {
        console.error("Lead submission error:", leadError);
        setError(
          "Something went wrong while submitting your enquiry. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      const message = `Hello FINETEX INTERIORS,

I'd like to request a free estimate.

SERVICE
${form.service}

PROJECT DETAILS
Location: ${form.location}
Property: ${form.property}
Budget: ${form.budget}

PROJECT DESCRIPTION
${form.description.trim() || "Not provided"}

CUSTOMER DETAILS
Name: ${form.name.trim()}
Phone: ${form.phone.trim()}
Preferred contact: ${form.preferredContact}

Thank you.`;

      const whatsappUrl =
        `https://wa.me/254725408173?text=${encodeURIComponent(message)}`;

      window.location.href = whatsappUrl;
    } catch (submissionError) {
      console.error("Unexpected submission error:", submissionError);
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#b18a5a]"
          >
            <span aria-hidden="true">←</span>
            Exit Estimate
          </a>
        </div>

        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#b18a5a]">
            Free Estimate
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-[#1f1f1f] md:text-5xl">
            Let&apos;s Plan Your Space
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
            Tell us a little about your project and the FINETEX INTERIORS
            team will get back to you with the next steps.
          </p>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((number) => (
              <div key={number} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                    step >= number
                      ? "bg-[#b18a5a] text-white"
                      : "border border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {number}
                </div>

                {number < 3 && (
                  <div
                    className={`h-px w-16 md:w-24 ${
                      step > number ? "bg-[#b18a5a]" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mx-auto mt-4 flex max-w-md justify-between text-xs font-medium uppercase tracking-wider text-gray-500">
            <span className={step >= 1 ? "text-[#b18a5a]" : ""}>
              Service
            </span>

            <span className={step >= 2 ? "text-[#b18a5a]" : ""}>
              Project
            </span>

            <span className={step >= 3 ? "text-[#b18a5a]" : ""}>
              Your Details
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm md:p-10"
        >

          {step === 1 && (
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#1f1f1f]">
                  What would you like us to work on?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Choose the interior service you are interested in.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {services.map((service) => {
                  const selected = form.service === service;

                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => updateForm("service", service)}
                      className={`rounded-xl border p-5 text-left transition ${
                        selected
                          ? "border-[#b18a5a] bg-[#b18a5a]/10 ring-1 ring-[#b18a5a]"
                          : "border-gray-200 bg-white hover:border-[#b18a5a] hover:bg-[#fdfbf8]"
                      }`}
                    >
                      <span
                        className={`font-medium ${
                          selected ? "text-[#8f6d45]" : "text-[#1f1f1f]"
                        }`}
                      >
                        {service}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#1f1f1f]">
                  Tell us about your project
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  These details help us understand the scope of your project.
                </p>
              </div>

              <div className="space-y-6">

                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-[#1f1f1f]"
                  >
                    Project Location
                  </label>

                  <select
                    id="location"
                    value={form.location}
                    onChange={(event) =>
                      updateForm("location", event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#b18a5a] focus:ring-1 focus:ring-[#b18a5a]"
                    required
                  >
                    <option value="">Select location</option>

                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="property"
                    className="mb-2 block text-sm font-medium text-[#1f1f1f]"
                  >
                    Property Type
                  </label>

                  <select
                    id="property"
                    value={form.property}
                    onChange={(event) =>
                      updateForm("property", event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#b18a5a] focus:ring-1 focus:ring-[#b18a5a]"
                    required
                  >
                    <option value="">Select property type</option>

                    {properties.map((property) => (
                      <option key={property} value={property}>
                        {property}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="budget"
                    className="mb-2 block text-sm font-medium text-[#1f1f1f]"
                  >
                    Estimated Budget
                  </label>

                  <select
                    id="budget"
                    value={form.budget}
                    onChange={(event) =>
                      updateForm("budget", event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#b18a5a] focus:ring-1 focus:ring-[#b18a5a]"
                    required
                  >
                    <option value="">Select budget range</option>

                    {budgets.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-[#1f1f1f]"
                  >
                    Tell us more about your project
                    <span className="ml-1 font-normal text-gray-400">
                      (optional)
                    </span>
                  </label>

                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                    rows={5}
                    placeholder="Describe what you would like us to design or renovate..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b18a5a] focus:ring-1 focus:ring-[#b18a5a]"
                  />
                </div>

              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#1f1f1f]">
                  How can we reach you?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Give us your contact details so we can discuss your project.
                </p>
              </div>

              <div className="space-y-6">

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-[#1f1f1f]"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateForm("name", event.target.value)
                    }
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b18a5a] focus:ring-1 focus:ring-[#b18a5a]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-[#1f1f1f]"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateForm("phone", event.target.value)
                    }
                    placeholder="e.g. 0712 345 678"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b18a5a] focus:ring-1 focus:ring-[#b18a5a]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-[#1f1f1f]">
                    Preferred Contact Method
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {["WhatsApp", "Phone Call"].map((method) => {
                      const selected = form.preferredContact === method;

                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() =>
                            updateForm("preferredContact", method)
                          }
                          className={`rounded-xl border p-4 text-left transition ${
                            selected
                              ? "border-[#b18a5a] bg-[#b18a5a]/10 ring-1 ring-[#b18a5a]"
                              : "border-gray-200 hover:border-[#b18a5a]"
                          }`}
                        >
                          <span
                            className={`text-sm font-medium ${
                              selected
                                ? "text-[#8f6d45]"
                                : "text-[#1f1f1f]"
                            }`}
                          >
                            {method}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              <div className="mt-8 rounded-xl bg-[#f7f5f0] p-5">
                <p className="text-sm leading-6 text-gray-600">
                  Your information is used only to help FINETEX INTERIORS
                  understand and respond to your project enquiry.
                </p>
              </div>
            </section>
          )}

          {error && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-10 flex items-center justify-between gap-4">

            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  disabled={isSubmitting}
                  className="rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-[#1f1f1f] transition hover:border-[#b18a5a] hover:text-[#b18a5a] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back
                </button>
              )}
            </div>

            {step < 3 ? (
              <button
                type="button"
                onClick={goToNextStep}
                className="rounded-full bg-[#1f1f1f] px-7 py-3 text-sm font-semibold !text-white transition hover:bg-[#b18a5a] hover:!text-white"
                style={{ color: "#ffffff" }}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[#1f1f1f] px-7 py-3 text-sm font-semibold !text-white transition hover:bg-[#b18a5a] hover:!text-white disabled:cursor-not-allowed disabled:opacity-60"
                style={{ color: "#ffffff" }}
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Request Estimate on WhatsApp"}
              </button>
            )}

          </div>

          <p className="mt-6 text-center text-xs leading-5 text-gray-500">
            Your information is used only to help FINETEX INTERIORS understand
            and respond to your project enquiry.
          </p>

        </form>
      </div>
    </main>
  );
}
