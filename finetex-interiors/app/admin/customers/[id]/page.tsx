"use client";

import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Customer = {
  id: number;
  full_name: string;
  phone: string;
  location: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  updated_at?: string;
};

type Project = {
  id: number;
  project_number: string;
  project_name: string;
  service: string;
  location: string | null;
  budget: number | string;
  status: string;
  start_date: string | null;
  expected_completion_date: string | null;
  created_at: string;
};

type Quotation = {
  id: number;
  quotation_number: string;
  title: string;
  description: string | null;
  amount: number | string;
  status: string;
  valid_until: string | null;
  created_at: string;
};

const supabase = createClient();

const formatCurrency = (
  amount: number | string | null | undefined
) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(amount ?? 0));
};

const formatDate = (date: string | null | undefined) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusClasses = (status: string) => {
  const value = status.toLowerCase();

  if (
    value === "completed" ||
    value === "approved" ||
    value === "paid"
  ) {
    return "bg-green-100 text-green-700";
  }

  if (
    value === "in progress" ||
    value === "active" ||
    value === "sent"
  ) {
    return "bg-blue-100 text-blue-700";
  }

  if (
    value === "pending" ||
    value === "planning" ||
    value === "draft"
  ) {
    return "bg-amber-100 text-amber-700";
  }

  if (
    value === "on hold" ||
    value === "cancelled" ||
    value === "rejected"
  ) {
    return "bg-red-100 text-red-700";
  }

  return "bg-gray-100 text-gray-700";
};

export default function CustomerDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const rawId = params.id;
  const customerId = Number(
    Array.isArray(rawId) ? rawId[0] : rawId
  );

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    location: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    if (!Number.isFinite(customerId)) {
      setError("Invalid customer ID.");
      setLoading(false);
      return;
    }

    loadCustomer();
  }, [customerId]);

  const loadCustomer = async () => {
    setLoading(true);
    setError("");

    const [
      customerResult,
      projectsResult,
      quotationsResult,
    ] = await Promise.all([
      supabase
        .from("customers")
        .select(
          "id, full_name, phone, location, email, notes, created_at, updated_at"
        )
        .eq("id", customerId)
        .single(),

      supabase
        .from("projects")
        .select(
          "id, project_number, project_name, service, location, budget, status, start_date, expected_completion_date, created_at"
        )
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false }),

      supabase
        .from("quotations")
        .select(
          "id, quotation_number, title, description, amount, status, valid_until, created_at"
        )
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false }),
    ]);

    if (customerResult.error) {
      setError(
        customerResult.error.message || "Unable to load customer."
      );
      setLoading(false);
      return;
    }

    if (projectsResult.error) {
      console.error(
        "Projects loading error:",
        projectsResult.error
      );
    }

    if (quotationsResult.error) {
      console.error(
        "Quotations loading error:",
        quotationsResult.error
      );
    }

    setCustomer(customerResult.data as Customer);
    setProjects((projectsResult.data || []) as Project[]);
    setQuotations((quotationsResult.data || []) as Quotation[]);

    setLoading(false);
  };

  const openEditModal = () => {
    if (!customer) return;

    setEditForm({
      full_name: customer.full_name || "",
      phone: customer.phone || "",
      location: customer.location || "",
      email: customer.email || "",
      notes: customer.notes || "",
    });

    setSaveError("");
    setShowEditModal(true);
  };

  const saveCustomer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!customer) return;

    if (!editForm.full_name.trim()) {
      setSaveError("Customer name is required.");
      return;
    }

    if (!editForm.phone.trim()) {
      setSaveError("Phone number is required.");
      return;
    }

    setSaving(true);
    setSaveError("");

    const { data, error } = await supabase
      .from("customers")
      .update({
        full_name: editForm.full_name.trim(),
        phone: editForm.phone.trim(),
        location: editForm.location.trim() || null,
        email: editForm.email.trim() || null,
        notes: editForm.notes.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", customer.id)
      .select()
      .single();

    if (error) {
      setSaveError(error.message || "Unable to update customer.");
      setSaving(false);
      return;
    }

    setCustomer(data as Customer);
    setShowEditModal(false);
    setSaving(false);
  };

  const openWhatsApp = () => {
    if (!customer?.phone) return;

    const phone = customer.phone.replace(/\D/g, "");

    let formattedPhone = phone;

    if (formattedPhone.startsWith("0")) {
      formattedPhone = `254${formattedPhone.slice(1)}`;
    } else if (formattedPhone.startsWith("7")) {
      formattedPhone = `254${formattedPhone}`;
    }

    window.open(
      `https://wa.me/${formattedPhone}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const totalProjectValue = projects.reduce(
    (total, project) => total + Number(project.budget || 0),
    0
  );

  const totalQuotationValue = quotations.reduce(
    (total, quotation) => total + Number(quotation.amount || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-[#777]">
          <Loader2 className="animate-spin" size={22} />
          <span>Loading customer...</span>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-6">
        <button
          type="button"
          onClick={() => router.push("/admin/customers")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#555] hover:text-[#171717]"
        >
          <ArrowLeft size={18} />
          Back to Customers
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error || "Customer not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <div className="mx-auto max-w-[1200px] space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/customers")}
              className="mt-1 rounded-xl border border-[#e5e0d7] bg-white p-2.5 text-[#555] transition hover:bg-[#f5f2ec] hover:text-[#171717]"
              title="Back to customers"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <p className="text-sm text-[#888]">
                Customer Details
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
                {customer.full_name}
              </h1>

              <p className="mt-1 text-sm text-[#888]">
                Customer #{customer.id}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={openWhatsApp}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#20bd5a]"
            >
              <MessageCircle size={18} />
              WhatsApp
            </button>

            <button
              type="button"
              onClick={openEditModal}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2a2a]"
            >
              <Pencil size={17} />
              Edit Customer
            </button>
          </div>
        </div>

        {/* Customer information */}
        <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl border border-[#e5e0d7] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#171717]">
                  Contact Information
                </h2>
                <p className="mt-1 text-sm text-[#888]">
                  Customer contact and location details
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#f5f2ec] p-2 text-[#9b774d]">
                  <Phone size={18} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#999]">
                    Phone
                  </p>
                  <p className="mt-1 font-medium text-[#333]">
                    {customer.phone || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#f5f2ec] p-2 text-[#9b774d]">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#999]">
                    Email
                  </p>
                  <p className="mt-1 break-all font-medium text-[#333]">
                    {customer.email || "No email provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#f5f2ec] p-2 text-[#9b774d]">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#999]">
                    Location
                  </p>
                  <p className="mt-1 font-medium text-[#333]">
                    {customer.location || "No location provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#f5f2ec] p-2 text-[#9b774d]">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#999]">
                    Customer Since
                  </p>
                  <p className="mt-1 font-medium text-[#333]">
                    {formatDate(customer.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5e0d7] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-[#171717]">
              Customer Notes
            </h2>

            <p className="mt-1 text-sm text-[#888]">
              Internal notes about this customer
            </p>

            <div className="mt-5 min-h-[150px] rounded-xl bg-[#f7f5f0] p-4">
              {customer.notes ? (
                <p className="whitespace-pre-wrap text-sm leading-6 text-[#555]">
                  {customer.notes}
                </p>
              ) : (
                <p className="text-sm italic text-[#999]">
                  No notes have been added for this customer.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#e5e0d7] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#888]">Projects</p>
            <p className="mt-2 text-2xl font-bold text-[#171717]">
              {projects.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e0d7] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#888]">
              Project Value
            </p>
            <p className="mt-2 text-xl font-bold text-[#171717]">
              {formatCurrency(totalProjectValue)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e0d7] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#888]">Quotations</p>
            <p className="mt-2 text-2xl font-bold text-[#171717]">
              {quotations.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e0d7] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#888]">
              Quotation Value
            </p>
            <p className="mt-2 text-xl font-bold text-[#171717]">
              {formatCurrency(totalQuotationValue)}
            </p>
          </div>
        </section>

        {/* Projects */}
        <section className="rounded-2xl border border-[#e5e0d7] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#eee9e1] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#f5f2ec] p-2.5 text-[#9b774d]">
                <ClipboardList size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#171717]">
                  Projects
                </h2>
                <p className="text-sm text-[#888]">
                  Projects associated with this customer
                </p>
              </div>
            </div>

            <span className="rounded-full bg-[#f5f2ec] px-3 py-1 text-sm font-semibold text-[#666]">
              {projects.length}
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="p-8 text-center">
              <ClipboardList
                className="mx-auto text-[#bbb]"
                size={34}
              />
              <p className="mt-3 font-medium text-[#666]">
                No projects found
              </p>
              <p className="mt-1 text-sm text-[#999]">
                Projects created for this customer will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#eee9e1]">
              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() =>
                    router.push(`/admin/projects/${project.id}`)
                  }
                  className="block w-full p-5 text-left transition hover:bg-[#faf9f6] sm:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-[#9b774d]">
                          {project.project_number}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </div>

                      <h3 className="mt-2 text-base font-bold text-[#171717]">
                        {project.project_name}
                      </h3>

                      <p className="mt-1 text-sm text-[#777]">
                        {project.service}
                        {project.location
                          ? ` • ${project.location}`
                          : ""}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-5 sm:flex sm:items-center">
                      <div>
                        <p className="text-xs text-[#999]">
                          Budget
                        </p>
                        <p className="mt-1 font-semibold text-[#333]">
                          {formatCurrency(project.budget)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#999]">
                          Completion
                        </p>
                        <p className="mt-1 font-semibold text-[#333]">
                          {formatDate(
                            project.expected_completion_date
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Quotations */}
        <section className="rounded-2xl border border-[#e5e0d7] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#eee9e1] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#f5f2ec] p-2.5 text-[#9b774d]">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#171717]">
                  Quotations
                </h2>
                <p className="text-sm text-[#888]">
                  Quotations associated with this customer
                </p>
              </div>
            </div>

            <span className="rounded-full bg-[#f5f2ec] px-3 py-1 text-sm font-semibold text-[#666]">
              {quotations.length}
            </span>
          </div>

          {quotations.length === 0 ? (
            <div className="p-8 text-center">
              <FileText
                className="mx-auto text-[#bbb]"
                size={34}
              />
              <p className="mt-3 font-medium text-[#666]">
                No quotations found
              </p>
              <p className="mt-1 text-sm text-[#999]">
                Quotations created for this customer will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#eee9e1]">
              {quotations.map((quotation) => (
                <div
                  key={quotation.id}
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-[#9b774d]">
                          {quotation.quotation_number}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            quotation.status
                          )}`}
                        >
                          {quotation.status}
                        </span>
                      </div>

                      <h3 className="mt-2 font-bold text-[#171717]">
                        {quotation.title}
                      </h3>

                      {quotation.description && (
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#777]">
                          {quotation.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6 sm:flex sm:items-center">
                      <div>
                        <p className="text-xs text-[#999]">
                          Amount
                        </p>
                        <p className="mt-1 font-bold text-[#171717]">
                          {formatCurrency(quotation.amount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#999]">
                          Valid Until
                        </p>
                        <p className="mt-1 font-semibold text-[#333]">
                          {formatDate(quotation.valid_until)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Edit Customer Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#eee9e1] bg-white p-5">
              <div>
                <h2 className="text-xl font-bold text-[#171717]">
                  Edit Customer
                </h2>
                <p className="mt-1 text-sm text-[#888]">
                  Update customer information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-lg p-2 text-[#777] hover:bg-[#f5f2ec] hover:text-[#171717]"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={saveCustomer}
              className="space-y-5 p-5 sm:p-6"
            >
              {saveError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {saveError}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#444]">
                  Full Name
                </label>

                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      full_name: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#ddd7cd] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b18a5a] focus:ring-2 focus:ring-[#b18a5a]/10"
                  placeholder="Customer full name"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#444]">
                    Phone
                  </label>

                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        phone: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#ddd7cd] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b18a5a] focus:ring-2 focus:ring-[#b18a5a]/10"
                    placeholder="07XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#444]">
                    Email
                  </label>

                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        email: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#ddd7cd] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b18a5a] focus:ring-2 focus:ring-[#b18a5a]/10"
                    placeholder="customer@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#444]">
                  Location
                </label>

                <input
                  type="text"
                  value={editForm.location}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      location: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#ddd7cd] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b18a5a] focus:ring-2 focus:ring-[#b18a5a]/10"
                  placeholder="e.g. Runda, Nairobi"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#444]">
                  Notes
                </label>

                <textarea
                  value={editForm.notes}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      notes: event.target.value,
                    })
                  }
                  rows={5}
                  className="w-full resize-none rounded-xl border border-[#ddd7cd] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b18a5a] focus:ring-2 focus:ring-[#b18a5a]/10"
                  placeholder="Add internal notes about this customer..."
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#eee9e1] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-xl border border-[#ddd7cd] px-5 py-3 text-sm font-semibold text-[#555] transition hover:bg-[#f5f2ec]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
