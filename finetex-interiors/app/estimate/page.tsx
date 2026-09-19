"use client";

import { ChangeEvent, useMemo, useState } from "react";

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
  "KSh 100,000 – 250,000",
  "KSh 250,000 – 500,000",
  "KSh 500,000 – 1,000,000",
  "Above KSh 1,000,000",
  "Not sure yet",
];

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

export default function EstimatePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");

  const totalSteps = 4;

  const progress = useMemo(() => {
    return (step / totalSteps) * 100;
  }, [step]);

  const updateForm = (
    field: keyof FormData,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handlePhotoUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    const limitedFiles = imageFiles.slice(0, 6);

    setPhotos(limitedFiles);

    const previews = limitedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPhotoPreviews(previews);
    setError("");
  };

  const removePhoto = (index: number) => {
    setPhotos((previous) =>
      previous.filter((_, photoIndex) => photoIndex !== index)
    );

    setPhotoPreviews((previous) =>
      previous.filter((_, photoIndex) => photoIndex !== index)
    );
  };

  const validateStep = () => {
    if (step === 1 && !form.service) {
      setError("Please select a service.");
      return false;
    }

    if (step === 2) {
      if (!form.location) {
        setError("Please select your location.");
        return false;
      }

      if (!form.property) {
        setError("Please select the property type.");
        return false;
      }

      if (!form.budget) {
        setError("Please select your estimated budget.");
        return false;
      }
    }

    if (step === 4) {
      if (!form.name.trim()) {
        setError("Please enter your name.");
        return false;
      }

      if (!form.phone.trim()) {
        setError("Please enter your phone number.");
        return false;
      }
    }

    setError("");
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }

    if (step < totalSteps) {
      setStep((previous) => previous + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep((previous) => previous - 1);
      setError("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const exitEstimate = () => {
    window.location.href = "/services";
  };

  const submitEstimate = () => {
    if (!validateStep()) {
      return;
    }

    const message = `Hello FINETEX INTERIORS 👋

I'd like to request a free estimate.

SERVICE
${form.service}

PROJECT DETAILS
Location: ${form.location}
Property: ${form.property}
Budget: ${form.budget}

PROJECT DESCRIPTION
${form.description || "Not provided"}

CUSTOMER DETAILS
Name: ${form.name}
Phone: ${form.phone}
Preferred contact: ${form.preferredContact}

PROJECT PHOTOS
${
  photos.length > 0
    ? `${photos.length} photo(s) selected. I will attach them here on WhatsApp.`
    : "No photos attached yet."
}

Thank you.`;

    const whatsappNumber = "254768176570";

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="min-h-screen bg-neutral-50">

      {/* HERO */}
      <section className="bg-neutral-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            Free Estimate
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Tell Us About Your Project
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-neutral-300 sm:text-lg">
            Give us a few details about your space and project.
            We'll help you take the next step toward your ideal
            interior.
          </p>

        </div>
      </section>

      {/* FORM */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">

          {/* PROGRESS */}
          <div className="mb-10">

            <div className="mb-3 flex items-center justify-between text-sm font-medium">
              <span className="text-neutral-700">
                Step {step} of {totalSteps}
              </span>

              <span className="text-neutral-500">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs sm:text-sm">

              <span
                className={
                  step >= 1
                    ? "font-semibold text-amber-600"
                    : "text-neutral-400"
                }
              >
                Service
              </span>

              <span
                className={
                  step >= 2
                    ? "font-semibold text-amber-600"
                    : "text-neutral-400"
                }
              >
                Project
              </span>

              <span
                className={
                  step >= 3
                    ? "font-semibold text-amber-600"
                    : "text-neutral-400"
                }
              >
                Photos
              </span>

              <span
                className={
                  step >= 4
                    ? "font-semibold text-amber-600"
                    : "text-neutral-400"
                }
              >
                Details
              </span>

            </div>
          </div>

          {/* FORM CARD */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10">

            {/* ERROR */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div>

                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-600">
                  Step 01
                </p>

                <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                  What service are you interested in?
                </h2>

                <p className="mt-3 text-neutral-600">
                  Choose the service you'd like FINETEX to help you
                  with.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">

                  {services.map((service) => {
                    const selected = form.service === service;

                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() =>
                          updateForm("service", service)
                        }
                        className={`rounded-2xl border-2 p-5 text-left transition ${
                          selected
                            ? "border-amber-500 bg-amber-50 shadow-sm"
                            : "border-neutral-200 bg-white hover:border-amber-300 hover:bg-neutral-50"
                        }`}
                      >

                        <div className="flex items-center justify-between">

                          <span className="font-semibold text-neutral-900">
                            {service}
                          </span>

                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                              selected
                                ? "border-amber-500 bg-amber-500 text-white"
                                : "border-neutral-300 text-transparent"
                            }`}
                          >
                            ✓
                          </span>

                        </div>

                      </button>
                    );
                  })}

                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>

                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-600">
                  Step 02
                </p>

                <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                  Tell us about your project
                </h2>

                <p className="mt-3 text-neutral-600">
                  This helps us understand the project before we
                  contact you.
                </p>

                <div className="mt-8 space-y-6">

                  {/* LOCATION */}
                  <div>

                    <label
                      htmlFor="location"
                      className="mb-2 block text-sm font-semibold text-neutral-800"
                    >
                      Location
                    </label>

                    <select
                      id="location"
                      value={form.location}
                      onChange={(event) =>
                        updateForm(
                          "location",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    >
                      <option value="">
                        Select your location
                      </option>

                      {locations.map((location) => (
                        <option
                          key={location}
                          value={location}
                        >
                          {location}
                        </option>
                      ))}
                    </select>

                  </div>

                  {/* PROPERTY */}
                  <div>

                    <label
                      htmlFor="property"
                      className="mb-2 block text-sm font-semibold text-neutral-800"
                    >
                      Property Type
                    </label>

                    <select
                      id="property"
                      value={form.property}
                      onChange={(event) =>
                        updateForm(
                          "property",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    >
                      <option value="">
                        Select property type
                      </option>

                      {properties.map((property) => (
                        <option
                          key={property}
                          value={property}
                        >
                          {property}
                        </option>
                      ))}
                    </select>

                  </div>

                  {/* BUDGET */}
                  <div>

                    <label
                      htmlFor="budget"
                      className="mb-2 block text-sm font-semibold text-neutral-800"
                    >
                      Estimated Budget
                    </label>

                    <select
                      id="budget"
                      value={form.budget}
                      onChange={(event) =>
                        updateForm(
                          "budget",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    >
                      <option value="">
                        Select your budget
                      </option>

                      {budgets.map((budget) => (
                        <option
                          key={budget}
                          value={budget}
                        >
                          {budget}
                        </option>
                      ))}
                    </select>

                  </div>

                  {/* DESCRIPTION */}
                  <div>

                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-semibold text-neutral-800"
                    >
                      Project Description
                    </label>

                    <textarea
                      id="description"
                      value={form.description}
                      onChange={(event) =>
                        updateForm(
                          "description",
                          event.target.value
                        )
                      }
                      rows={6}
                      placeholder="Tell us about what you'd like to change, your preferred style, materials, size, or any other details..."
                      className="w-full resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none placeholder:text-neutral-400 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />

                  </div>

                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>

                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-600">
                  Step 03
                </p>

                <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                  Show us your space
                </h2>

                <p className="mt-3 text-neutral-600">
                  Upload photos of the space you'd like us to work
                  on. You can select up to 6 images.
                </p>

                {/* UPLOAD */}
                <label
                  htmlFor="photos"
                  className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-14 text-center transition hover:border-amber-400 hover:bg-amber-50"
                >

                  <span className="text-4xl">
                    📷
                  </span>

                  <span className="mt-4 text-lg font-bold text-neutral-900">
                    Upload Project Photos
                  </span>

                  <span className="mt-2 text-sm text-neutral-500">
                    PNG, JPG or JPEG • Up to 6 photos
                  </span>

                  <span className="mt-5 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white">
                    Choose Photos
                  </span>

                  <input
                    id="photos"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                </label>

                {/* PHOTO PREVIEWS */}
                {photoPreviews.length > 0 && (
                  <div className="mt-8">

                    <div className="mb-4 flex items-center justify-between">

                      <h3 className="font-bold text-neutral-900">
                        Selected Photos
                      </h3>

                      <span className="text-sm text-neutral-500">
                        {photos.length} selected
                      </span>

                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">

                      {photoPreviews.map((preview, index) => (
                        <div
                          key={preview}
                          className="group relative overflow-hidden rounded-xl border border-neutral-200"
                        >

                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt={`Project photo ${index + 1}`}
                            className="aspect-square w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-sm text-white transition hover:bg-red-600"
                            aria-label={`Remove photo ${index + 1}`}
                          >
                            ×
                          </button>

                        </div>
                      ))}

                    </div>

                    <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                      Your photos are only previewed on this page for
                      now. When WhatsApp opens, please attach these
                      photos to the conversation.
                    </p>

                  </div>
                )}

              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div>

                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-600">
                  Step 04
                </p>

                <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                  Your details
                </h2>

                <p className="mt-3 text-neutral-600">
                  Tell us how we can reach you.
                </p>

                <div className="mt-8 space-y-6">

                  {/* NAME */}
                  <div>

                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-neutral-800"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(event) =>
                        updateForm(
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none placeholder:text-neutral-400 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />

                  </div>

                  {/* PHONE */}
                  <div>

                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-neutral-800"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateForm(
                          "phone",
                          event.target.value
                        )
                      }
                      placeholder="e.g. 0712 345 678"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none placeholder:text-neutral-400 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />

                  </div>

                  {/* CONTACT METHOD */}
                  <div>

                    <p className="mb-3 text-sm font-semibold text-neutral-800">
                      Preferred Contact
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">

                      {["WhatsApp", "Phone Call"].map(
                        (contact) => {

                          const selected =
                            form.preferredContact === contact;

                          return (
                            <button
                              key={contact}
                              type="button"
                              onClick={() =>
                                updateForm(
                                  "preferredContact",
                                  contact
                                )
                              }
                              className={`rounded-xl border-2 px-5 py-4 text-left font-semibold transition ${
                                selected
                                  ? "border-amber-500 bg-amber-50 text-neutral-900"
                                  : "border-neutral-200 text-neutral-700 hover:border-amber-300"
                              }`}
                            >
                              <span className="mr-2">
                                {contact === "WhatsApp"
                                  ? "💬"
                                  : "📞"}
                              </span>

                              {contact}
                            </button>
                          );
                        }
                      )}

                    </div>
                  </div>

                  {/* SUMMARY */}
                  <div className="rounded-2xl bg-neutral-100 p-5">

                    <h3 className="mb-4 font-bold text-neutral-900">
                      Estimate Summary
                    </h3>

                    <div className="space-y-2 text-sm">

                      <div className="flex justify-between gap-4">
                        <span className="text-neutral-500">
                          Service
                        </span>

                        <span className="text-right font-semibold text-neutral-900">
                          {form.service}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-neutral-500">
                          Location
                        </span>

                        <span className="font-semibold text-neutral-900">
                          {form.location}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-neutral-500">
                          Property
                        </span>

                        <span className="font-semibold text-neutral-900">
                          {form.property}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-neutral-500">
                          Budget
                        </span>

                        <span className="text-right font-semibold text-neutral-900">
                          {form.budget}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-neutral-500">
                          Photos
                        </span>

                        <span className="font-semibold text-neutral-900">
                          {photos.length}
                        </span>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* NAVIGATION */}
            <div className="mt-10 border-t border-neutral-200 pt-6">

              {step === 1 ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  {/* BACK TO SERVICES */}
                  <button
                    type="button"
                    onClick={exitEstimate}
                    className="w-full rounded-xl border-2 border-neutral-300 bg-white px-6 py-4 font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 sm:w-auto"
                  >
                    ← Back to Services
                  </button>

                  {/* CONTINUE */}
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!form.service}
                    className={`w-full rounded-xl px-8 py-4 text-base font-bold transition-all sm:w-auto ${
                      !form.service
                        ? "cursor-not-allowed bg-neutral-200 text-neutral-400"
                        : "bg-amber-500 text-white shadow-md hover:bg-amber-600 hover:shadow-lg active:scale-[0.98]"
                    }`}
                  >
                    Continue →
                  </button>

                </div>
              ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  {/* LEFT NAVIGATION */}
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

                    {/* PREVIOUS STEP */}
                    <button
                      type="button"
                      onClick={previousStep}
                      className="w-full rounded-xl border-2 border-neutral-300 bg-white px-6 py-4 font-semibold text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 sm:w-auto"
                    >
                      ← Back
                    </button>

                    {/* EXIT ESTIMATE */}
                    <button
                      type="button"
                      onClick={exitEstimate}
                      className="w-full rounded-xl px-5 py-4 text-sm font-semibold text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 sm:w-auto"
                    >
                      Exit Estimate
                    </button>

                  </div>

                  {/* RIGHT NAVIGATION */}
                  {step < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full rounded-xl bg-amber-500 px-8 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-amber-600 hover:shadow-lg active:scale-[0.98] sm:w-auto"
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submitEstimate}
                      className="w-full rounded-xl bg-green-600 px-8 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg active:scale-[0.98] sm:w-auto"
                    >
                      💬 Request Estimate on WhatsApp
                    </button>
                  )}

                </div>
              )}

            </div>

          </div>

          {/* PRIVACY MESSAGE */}
          <p className="mt-6 text-center text-sm leading-6 text-neutral-500">
            Your information is used only to help FINETEX INTERIORS
            understand and respond to your project enquiry.
          </p>

        </div>
      </section>

    </main>
  );
}