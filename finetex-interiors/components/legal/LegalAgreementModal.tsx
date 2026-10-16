"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "finetex-legal-agreement-v1";

export default function LegalAgreementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [activeSection, setActiveSection] = useState<
    "terms" | "privacy" | null
  >(null);

  useEffect(() => {
    try {
      setIsOpen(localStorage.getItem(STORAGE_KEY) !== "accepted");
    } catch {
      setIsOpen(true);
    } finally {
      setIsChecking(false);
    }
  }, []);

  function handleAgree() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // The modal can still close if browser storage is unavailable.
    }

    setIsOpen(false);
  }

  if (isChecking || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="finetex-agreement-title"
        className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#e5e1d9] bg-[#f7f5f0] p-6 shadow-2xl sm:p-9"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#b18a5a]/40 bg-white">
            <span className="text-2xl font-semibold text-[#b18a5a]">F</span>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b18a5a]">
              FINETEX INTERIORS
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Quality Interior Solutions
            </p>
          </div>
        </div>

        <div className="my-6 h-px bg-[#e5e1d9]" />

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b18a5a]">
          Welcome
        </p>

        <h2
          id="finetex-agreement-title"
          className="mt-2 text-2xl font-semibold leading-tight text-[#1b1b1b] sm:text-3xl"
        >
          Before You Continue
        </h2>

        <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
          Please review our Terms and Conditions and Privacy Policy before
          using the FINETEX INTERIORS website. Select each section below to
          read the details without leaving this page.
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() =>
              setActiveSection(activeSection === "terms" ? null : "terms")
            }
            aria-expanded={activeSection === "terms"}
            className="flex w-full items-center justify-between rounded-xl border border-[#e5e1d9] bg-white p-4 text-left transition-colors hover:border-[#b18a5a]"
          >
            <span className="font-semibold text-[#252525]">
              Terms and Conditions
            </span>
            <span className="text-xl text-[#b18a5a]">
              {activeSection === "terms" ? "−" : "+"}
            </span>
          </button>

          {activeSection === "terms" && (
            <div className="max-h-64 overflow-y-auto rounded-xl border border-[#e5e1d9] bg-white p-4 text-sm leading-7 text-gray-700">
              <h3 className="font-semibold text-[#252525]">
                1. Our Services
              </h3>
              <p className="mt-1">
                FINETEX INTERIORS provides interior design, renovation, and
                related services, including kitchens, bathrooms, gypsum
                ceilings, TV cabinets, and wardrobes.
              </p>

              <h3 className="mt-4 font-semibold text-[#252525]">
                2. Website Information
              </h3>
              <p className="mt-1">
                Images, designs, descriptions, and project examples are
                provided for information and inspiration. Actual project
                results may vary depending on materials, measurements,
                availability, and site conditions.
              </p>

              <h3 className="mt-4 font-semibold text-[#252525]">
                3. Quotations and Payments
              </h3>
              <p className="mt-1">
                Estimates and enquiries submitted through this website are
                not automatically confirmed bookings or final quotations.
                Project scope, pricing, payment arrangements, materials, and
                timelines should be agreed upon before work begins.
              </p>

              <h3 className="mt-4 font-semibold text-[#252525]">
                4. Customer Responsibilities
              </h3>
              <p className="mt-1">
                Customers should provide accurate contact information and
                project details and obtain any permissions required for work
                on their property.
              </p>

              <h3 className="mt-4 font-semibold text-[#252525]">
                5. Intellectual Property
              </h3>
              <p className="mt-1">
                Website content, branding, photographs, and original design
                materials may not be copied or commercially reused without
                the appropriate authorization.
              </p>

              <h3 className="mt-4 font-semibold text-[#252525]">
                6. Acceptable Use
              </h3>
              <p className="mt-1">
                You must not misuse the website, attempt unauthorized access,
                interfere with its operation, or knowingly submit fraudulent
                enquiries or misleading information.
              </p>

              <h3 className="mt-4 font-semibold text-[#252525]">
                7. Changes and Applicable Law
              </h3>
              <p className="mt-1">
                Project changes may affect agreed costs and timelines. These
                terms are subject to applicable Kenyan law. Nothing in these
                terms removes any rights you have under applicable law.
              </p>

              <h3 className="mt-4 font-semibold text-[#252525]">
                8. Contact
              </h3>
              <p className="mt-1">
                Contact FINETEX INTERIORS using the telephone or WhatsApp
                details published on our website if you have questions about
                these terms.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              setActiveSection(activeSection === "privacy" ? null : "privacy")
            }
            aria-expanded={activeSection === "privacy"}
            className="flex w-full items-center justify-between rounded-xl border border-[#e5e1d9] bg-white p-4 text-left transition-colors hover:border-[#b18a5a]"
          >
            <span className="font-semibold text-[#252525]">
              Privacy Policy
            </span>
            <span className="text-xl text-[#b18a5a]">
              {activeSection === "privacy" ? "−" : "+"}
            </span>
          </button>

          {activeSection === "privacy" && (
            <div className="max-h-64 overflow-y-auto rounded-xl border border-[#e5e1d9] bg-white p-4 text-sm leading-7 text-gray-700">
              <h3 className="font-semibold text-[#252525]">
                1. Information We Collect
              </h3>
              <p className="mt-1">
                Depending on how you use our website, we may collect your
                name, phone number, email address if provided, project
                requirements, and information submitted through enquiries or
                estimate requests.
              </p>

              <h3 className="mt-4 font-semibold text-[#252525]">
                2. How We Use Information
              </h3>
              <p className="mt-1">
                We use relevant information to respond to enquiries, prepare
                estimates, arrange consultations, manage projects, communicate
                with customers, maintain security, and meet legal obligations.
              </p>

              <h3 className="mt-4 font-semibold text-[#252525]">
                3. Storage and Service Providers
              </h3>
              <p className="mt-1">
                Information may be processed by authorized hosting, database,
                communications, and security providers where needed to operate
                the website or deliver our services.
              </p>

              <h3 className="mt-4 font-semibold text-[#252525]">
                4. Cookies and Browser Storage
              </h3>
              <p className="mt-1">
                The website may use browser storage to remember preferences
                and your acknowledgement of this notice. Clearing browser
                storage may cause the notice to appear again.
              </p>

              <h3 className="mt-4 font-semibold text-[#252525]">
                5. Security and Retention
              </h3>
              <p className="mt-1">
                Reasonable measures should be used to protect personal
                information. Information should be retained only as long as
                reasonably necessary for its intended purpose, legal
                obligations, and legitimate business records.
              </p>

              <h3 className="mt-4 font-semibold text-[#252525]">
                6. Your Rights
              </h3>
              <p className="mt-1">
                Subject to applicable Kenyan data protection law, you may
                have rights to request access to or correction or deletion
                of your personal information and to exercise other applicable
                data protection rights.
              </p>

              <h3 className="mt-4 font-semibold text-[#252525]">
                7. Third Parties and Updates
              </h3>
              <p className="mt-1">
                Third-party websites have their own privacy policies. This
                policy may be updated when our practices or legal obligations
                change.
              </p>

              <h3 className="mt-4 font-semibold text-[#252525]">
                8. Privacy Enquiries
              </h3>
              <p className="mt-1">
                Contact FINETEX INTERIORS using the contact details published
                on our website to raise privacy questions or make a request
                concerning your information.
              </p>
            </div>
          )}
        </div>

        <p className="mt-5 text-xs leading-6 text-gray-500">
          By selecting I Agree, you acknowledge these Terms and Conditions
          and the Privacy Policy. This acknowledgement does not replace
          separate consent where the law requires it.
        </p>

        <button
          type="button"
          onClick={handleAgree}
          className="mt-5 w-full rounded-xl bg-[#b18a5a] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#967247] focus:outline-none focus:ring-2 focus:ring-[#b18a5a] focus:ring-offset-2"
        >
          I Agree
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          Thank you for visiting FINETEX INTERIORS.
        </p>
      </section>
    </div>
  );
}