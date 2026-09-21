"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  MapPin,
  Pencil,
  User,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type ProjectStatus =
  | "Planning"
  | "In Progress"
  | "On Hold"
  | "Completed";

type Project = {
  id: number;
  project_number: string;
  customer_id: number;
  quotation_id: number | null;
  project_name: string;
  service: string;
  location: string | null;
  description: string | null;
  budget: number;
  status: ProjectStatus;
  start_date: string | null;
  expected_completion_date: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type Customer = {
  id: number;
  full_name: string;
  phone: string | null;
  email: string | null;
  location: string | null;
};

type CustomerOption = {
  id: number;
  full_name: string;
};

type Quotation = {
  id: number;
  quotation_number: string;
  customer_id: number | null;
  title: string | null;
  amount: number | null;
  status: string | null;
};

const STATUS_OPTIONS: ProjectStatus[] = [
  "Planning",
  "In Progress",
  "On Hold",
  "Completed",
];

const SERVICE_OPTIONS = [
  "Kitchen Renovation",
  "Bathroom Renovation",
  "Gypsum Installation",
  "TV Cabinet",
  "Wardrobes",
  "Full House Interior",
  "Office Interior",
  "Custom Interior",
  "Other",
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function formatDate(date: string | null) {
  if (!date) return "Not set";

  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusClasses(status: ProjectStatus) {
  switch (status) {
    case "Completed":
      return "border-green-200 bg-green-50 text-green-700";

    case "In Progress":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "On Hold":
      return "border-orange-200 bg-orange-50 text-orange-700";

    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = Number(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [quotation, setQuotation] = useState<Quotation | null>(null);

  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editProjectName, setEditProjectName] = useState("");
  const [editCustomerId, setEditCustomerId] = useState("");
  const [editQuotationId, setEditQuotationId] = useState("");
  const [editService, setEditService] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editExpectedCompletionDate, setEditExpectedCompletionDate] =
    useState("");
  const [editStatus, setEditStatus] =
    useState<ProjectStatus>("Planning");
  const [editDescription, setEditDescription] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    if (!projectId || Number.isNaN(projectId)) {
      setError("Invalid project ID.");
      setLoading(false);
      return;
    }

    loadProject();
  }, [projectId]);

  async function loadProject() {
    setLoading(true);
    setError("");

    try {
      const { data: projectData, error: projectError } =
        await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single();

      if (projectError) throw projectError;

      const projectRecord = projectData as Project;

      setProject(projectRecord);

      const [
        { data: customerData, error: customerError },
        { data: customersData, error: customersError },
        { data: quotationsData, error: quotationsError },
      ] = await Promise.all([
        supabase
          .from("customers")
          .select(
            "id, full_name, phone, email, location"
          )
          .eq("id", projectRecord.customer_id)
          .single(),

        supabase
          .from("customers")
          .select("id, full_name")
          .order("full_name", {
            ascending: true,
          }),

        supabase
          .from("quotations")
          .select(
            "id, quotation_number, customer_id, title, amount, status"
          )
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (customerError) throw customerError;
      if (customersError) throw customersError;
      if (quotationsError) throw quotationsError;

      setCustomer(customerData as Customer);
      setCustomers(
        (customersData || []) as CustomerOption[]
      );
      setQuotations(
        (quotationsData || []) as Quotation[]
      );

      if (projectRecord.quotation_id) {
        const quotationData =
          (quotationsData || []).find(
            (item) =>
              item.id === projectRecord.quotation_id
          );

        if (quotationData) {
          setQuotation(quotationData as Quotation);
        }
      } else {
        setQuotation(null);
      }
    } catch (err) {
      console.error("Error loading project:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load project."
      );
    } finally {
      setLoading(false);
    }
  }

  function openEditModal() {
    if (!project) return;

    setEditProjectName(project.project_name);
    setEditCustomerId(String(project.customer_id));
    setEditQuotationId(
      project.quotation_id
        ? String(project.quotation_id)
        : ""
    );
    setEditService(project.service);
    setEditLocation(project.location || "");
    setEditBudget(String(project.budget ?? ""));
    setEditStartDate(project.start_date || "");
    setEditExpectedCompletionDate(
      project.expected_completion_date || ""
    );
    setEditStatus(project.status);
    setEditDescription(project.description || "");
    setEditNotes(project.notes || "");

    setError("");
    setShowEditModal(true);
  }

  function closeEditModal() {
    if (saving) return;

    setShowEditModal(false);
  }

  const quotationsForCustomer = useMemo(() => {
    if (!editCustomerId) {
      return quotations;
    }

    return quotations.filter(
      (item) =>
        item.customer_id === Number(editCustomerId)
    );
  }, [quotations, editCustomerId]);

  function handleEditCustomerChange(value: string) {
    setEditCustomerId(value);

    if (
      editQuotationId &&
      quotations.find(
        (item) =>
          item.id === Number(editQuotationId)
      )?.customer_id !== Number(value)
    ) {
      setEditQuotationId("");
    }
  }

  async function saveProject(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!project) return;

    setError("");

    if (!editProjectName.trim()) {
      setError("Please enter a project name.");
      return;
    }

    if (!editCustomerId) {
      setError("Please select a customer.");
      return;
    }

    if (!editService) {
      setError("Please select a service.");
      return;
    }

    const numericBudget = Number(editBudget || 0);

    if (
      Number.isNaN(numericBudget) ||
      numericBudget < 0
    ) {
      setError("Please enter a valid project budget.");
      return;
    }

    setSaving(true);

    try {
      const completedAt =
        editStatus === "Completed"
          ? project.completed_at ||
            new Date().toISOString()
          : null;

      const updateData = {
        customer_id: Number(editCustomerId),
        quotation_id: editQuotationId
          ? Number(editQuotationId)
          : null,
        project_name: editProjectName.trim(),
        service: editService,
        location: editLocation.trim() || null,
        description:
          editDescription.trim() || null,
        budget: numericBudget,
        status: editStatus,
        start_date: editStartDate || null,
        expected_completion_date:
          editExpectedCompletionDate || null,
        completed_at: completedAt,
        notes: editNotes.trim() || null,
      };

      const { data, error: updateError } =
        await supabase
          .from("projects")
          .update(updateData)
          .eq("id", project.id)
          .select("*")
          .single();

      if (updateError) throw updateError;

      const updatedProject = data as Project;

      setProject(updatedProject);

      const selectedCustomer =
        customers.find(
          (item) =>
            item.id === updatedProject.customer_id
        );

      if (selectedCustomer) {
        const { data: fullCustomerData } =
          await supabase
            .from("customers")
            .select(
              "id, full_name, phone, email, location"
            )
            .eq("id", selectedCustomer.id)
            .single();

        if (fullCustomerData) {
          setCustomer(fullCustomerData as Customer);
        }
      }

      if (updatedProject.quotation_id) {
        const selectedQuotation =
          quotations.find(
            (item) =>
              item.id ===
              updatedProject.quotation_id
          );

        setQuotation(
          selectedQuotation
            ? (selectedQuotation as Quotation)
            : null
        );
      } else {
        setQuotation(null);
      }

      setShowEditModal(false);
    } catch (err) {
      console.error(
        "Error updating project:",
        err
      );

      if (err && typeof err === "object") {
        console.error(
          "Supabase update error details:",
          {
            message:
              "message" in err
                ? err.message
                : undefined,
            details:
              "details" in err
                ? err.details
                : undefined,
            hint:
              "hint" in err
                ? err.hint
                : undefined,
            code:
              "code" in err
                ? err.code
                : undefined,
          }
        );
      }

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update project."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(
    newStatus: ProjectStatus
  ) {
    if (!project) return;

    setError("");

    try {
      const completedAt =
        newStatus === "Completed"
          ? project.completed_at ||
            new Date().toISOString()
          : null;

      const { data, error: updateError } =
        await supabase
          .from("projects")
          .update({
            status: newStatus,
            completed_at: completedAt,
          })
          .eq("id", project.id)
          .select("*")
          .single();

      if (updateError) throw updateError;

      setProject(data as Project);
    } catch (err) {
      console.error(
        "Error updating project:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update project."
      );
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f0]">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2
            size={20}
            className="animate-spin text-[#b18a5a]"
          />
          Loading project...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] px-4 py-10">
        <div className="mx-auto max-w-[1200px]">
          <button
            type="button"
            onClick={() =>
              router.push("/admin/projects")
            }
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#b18a5a]"
          >
            <ArrowLeft size={17} />
            Back to Projects
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <h1 className="font-semibold">
              Project not found
            </h1>

            <p className="mt-1 text-sm">
              {error ||
                "The requested project could not be found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          type="button"
          onClick={() =>
            router.push("/admin/projects")
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#b18a5a]"
        >
          <ArrowLeft size={17} />
          Back to Projects
        </button>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div>
              <p className="font-semibold">
                Something went wrong
              </p>
              <p className="mt-1">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 transition hover:bg-red-100"
              aria-label="Close error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[#b18a5a]">
                {project.project_number}
              </p>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {project.project_name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <FileText size={15} />
                  {project.service}
                </span>

                {project.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} />
                    {project.location}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={project.status}
                onChange={(event) =>
                  updateStatus(
                    event.target
                      .value as ProjectStatus
                  )
                }
                className={`rounded-full border px-4 py-2 text-sm font-medium outline-none ${getStatusClasses(
                  project.status
                )}`}
              >
                {STATUS_OPTIONS.map(
                  (option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  )
                )}
              </select>

              <button
                type="button"
                onClick={openEditModal}
                className="inline-flex items-center gap-2 rounded-xl bg-[#b18a5a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9d784c]"
              >
                <Pencil size={16} />
                Edit Project
              </button>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Project information */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Project Information
              </h2>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <InfoItem
                  label="Service"
                  value={project.service}
                />

                <InfoItem
                  label="Budget"
                  value={formatCurrency(
                    project.budget
                  )}
                  emphasized
                />

                <InfoItem
                  label="Start Date"
                  value={formatDate(
                    project.start_date
                  )}
                  icon={
                    <CalendarDays size={16} />
                  }
                />

                <InfoItem
                  label="Expected Completion"
                  value={formatDate(
                    project.expected_completion_date
                  )}
                  icon={
                    <CalendarDays size={16} />
                  }
                />

                <InfoItem
                  label="Location"
                  value={
                    project.location ||
                    "Not provided"
                  }
                  icon={
                    <MapPin size={16} />
                  }
                />

                <InfoItem
                  label="Current Status"
                  value={project.status}
                  icon={
                    project.status ===
                    "Completed" ? (
                      <CheckCircle2
                        size={16}
                      />
                    ) : (
                      <Clock3 size={16} />
                    )
                  }
                />
              </div>
            </section>

            {/* Description */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Description
              </h2>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-600">
                {project.description ||
                  "No project description has been added."}
              </p>
            </section>

            {/* Notes */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Internal Notes
              </h2>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-600">
                {project.notes ||
                  "No internal notes have been added."}
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-[#b18a5a]/10 p-2 text-[#b18a5a]">
                  <User size={18} />
                </div>

                <h2 className="text-lg font-semibold text-gray-900">
                  Customer
                </h2>
              </div>

              {customer ? (
                <div className="mt-5">
                  <p className="text-base font-semibold text-gray-900">
                    {customer.full_name}
                  </p>

                  {customer.phone && (
                    <p className="mt-3 text-sm text-gray-600">
                      {customer.phone}
                    </p>
                  )}

                  {customer.email && (
                    <p className="mt-1 break-all text-sm text-gray-600">
                      {customer.email}
                    </p>
                  )}

                  {customer.location && (
                    <p className="mt-1 text-sm text-gray-600">
                      {customer.location}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-5 text-sm text-gray-500">
                  Customer information unavailable.
                </p>
              )}
            </section>

            {/* Quotation */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Linked Quotation
              </h2>

              {quotation ? (
                <div className="mt-5">
                  <p className="text-sm font-semibold text-[#b18a5a]">
                    {quotation.quotation_number}
                  </p>

                  {quotation.title && (
                    <p className="mt-2 font-medium text-gray-900">
                      {quotation.title}
                    </p>
                  )}

                  {quotation.amount !==
                    null && (
                    <p className="mt-3 text-xl font-semibold text-gray-900">
                      {formatCurrency(
                        quotation.amount
                      )}
                    </p>
                  )}

                  {quotation.status && (
                    <p className="mt-2 text-xs text-gray-500">
                      Status:{" "}
                      {quotation.status}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-5 text-sm text-gray-500">
                  No quotation is linked to this
                  project.
                </p>
              )}
            </section>

            {/* Timeline */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Project Timeline
              </h2>

              <div className="mt-5 space-y-5">
                <TimelineItem
                  title="Project Created"
                  date={formatDate(
                    project.created_at
                  )}
                  active
                />

                {project.start_date && (
                  <TimelineItem
                    title="Project Start"
                    date={formatDate(
                      project.start_date
                    )}
                    active
                  />
                )}

                {project.expected_completion_date && (
                  <TimelineItem
                    title="Expected Completion"
                    date={formatDate(
                      project.expected_completion_date
                    )}
                    active
                  />
                )}

                {project.completed_at && (
                  <TimelineItem
                    title="Project Completed"
                    date={formatDate(
                      project.completed_at
                    )}
                    active
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit Project
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update the details for{" "}
                  {project.project_name}.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close edit modal"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={saveProject}
              className="space-y-6 p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Project Name"
                  required
                >
                  <input
                    type="text"
                    value={editProjectName}
                    onChange={(event) =>
                      setEditProjectName(
                        event.target.value
                      )
                    }
                    className="form-input"
                    required
                  />
                </FormField>

                <FormField
                  label="Service"
                  required
                >
                  <select
                    value={editService}
                    onChange={(event) =>
                      setEditService(
                        event.target.value
                      )
                    }
                    className="form-input"
                    required
                  >
                    <option value="">
                      Select service
                    </option>

                    {SERVICE_OPTIONS.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                <FormField
                  label="Customer"
                  required
                >
                  <select
                    value={editCustomerId}
                    onChange={(event) =>
                      handleEditCustomerChange(
                        event.target.value
                      )
                    }
                    className="form-input"
                    required
                  >
                    <option value="">
                      Select customer
                    </option>

                    {customers.map(
                      (item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.full_name}
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                <FormField label="Quotation">
                  <select
                    value={editQuotationId}
                    onChange={(event) =>
                      setEditQuotationId(
                        event.target.value
                      )
                    }
                    className="form-input"
                  >
                    <option value="">
                      No quotation
                    </option>

                    {quotationsForCustomer.map(
                      (item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {
                            item.quotation_number
                          }
                          {item.title
                            ? ` — ${item.title}`
                            : ""}
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                <FormField label="Location">
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(event) =>
                      setEditLocation(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Karen, Nairobi"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Budget (KES)">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={editBudget}
                    onChange={(event) =>
                      setEditBudget(
                        event.target.value
                      )
                    }
                    placeholder="850000"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Start Date">
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(event) =>
                      setEditStartDate(
                        event.target.value
                      )
                    }
                    className="form-input"
                  />
                </FormField>

                <FormField label="Expected Completion">
                  <input
                    type="date"
                    value={
                      editExpectedCompletionDate
                    }
                    onChange={(event) =>
                      setEditExpectedCompletionDate(
                        event.target.value
                      )
                    }
                    className="form-input"
                  />
                </FormField>

                <FormField label="Status">
                  <select
                    value={editStatus}
                    onChange={(event) =>
                      setEditStatus(
                        event.target
                          .value as ProjectStatus
                      )
                    }
                    className="form-input"
                  >
                    {STATUS_OPTIONS.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </FormField>
              </div>

              <FormField label="Description">
                <textarea
                  value={editDescription}
                  onChange={(event) =>
                    setEditDescription(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Describe the project scope..."
                  className="form-input resize-none"
                />
              </FormField>

              <FormField label="Internal Notes">
                <textarea
                  value={editNotes}
                  onChange={(event) =>
                    setEditNotes(
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="Add internal project notes..."
                  className="form-input resize-none"
                />
              </FormField>

              {/* Modal buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#b18a5a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9d784c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Pencil size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .form-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(229 231 235);
          background: rgb(249 250 251);
          padding: 0.7rem 0.9rem;
          font-size: 0.875rem;
          color: rgb(17 24 39);
          outline: none;
          transition:
            border-color 150ms ease,
            background-color 150ms ease,
            box-shadow 150ms ease;
        }

        .form-input::placeholder {
          color: rgb(156 163 175);
        }

        .form-input:focus {
          border-color: #b18a5a;
          background: white;
          box-shadow: 0 0 0 3px rgb(177 138 90 / 0.1);
        }
      `}</style>
    </div>
  );
}

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon,
  emphasized = false,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  emphasized?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <div
        className={`mt-2 flex items-center gap-2 ${
          emphasized
            ? "text-lg font-semibold text-gray-900"
            : "text-sm font-medium text-gray-800"
        }`}
      >
        {icon && (
          <span className="text-[#b18a5a]">
            {icon}
          </span>
        )}

        {value}
      </div>
    </div>
  );
}

function TimelineItem({
  title,
  date,
  active = false,
}: {
  title: string;
  date: string;
  active?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
          active
            ? "bg-[#b18a5a]"
            : "bg-gray-300"
        }`}
      />

      <div>
        <p className="text-sm font-medium text-gray-800">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {date}
        </p>
      </div>
    </div>
  );
}