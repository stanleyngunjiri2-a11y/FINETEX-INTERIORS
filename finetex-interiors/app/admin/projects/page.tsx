
"use client";

import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
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
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusClasses(status: ProjectStatus) {
  switch (status) {
    case "Completed":
      return "bg-green-50 text-green-700 border-green-200";

    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "On Hold":
      return "bg-orange-50 text-orange-700 border-orange-200";

    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function getStatusIcon(status: ProjectStatus) {
  switch (status) {
    case "Completed":
      return <CheckCircle2 size={14} />;

    case "In Progress":
      return <Clock3 size={14} />;

    case "On Hold":
      return <Clock3 size={14} />;

    default:
      return <CalendarDays size={14} />;
  }
}

function getQuotationStatusClasses(status: string | null) {
  switch (status) {
    case "Accepted":
      return "bg-green-50 text-green-700 border-green-200";

    case "Sent":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200";

    case "Expired":
      return "bg-gray-100 text-gray-600 border-gray-200";

    default:
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }
}

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | ProjectStatus
  >("All");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [quotationId, setQuotationId] = useState("");
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expectedCompletionDate, setExpectedCompletionDate] =
    useState("");
  const [status, setStatus] =
    useState<ProjectStatus>("Planning");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [
        { data: projectsData, error: projectsError },
        { data: customersData, error: customersError },
        { data: quotationsData, error: quotationsError },
      ] = await Promise.all([
        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("customers")
          .select("id, full_name")
          .order("full_name", { ascending: true }),

        supabase
          .from("quotations")
          .select(
            "id, quotation_number, customer_id, title, amount, status"
          )
          .order("created_at", { ascending: false }),
      ]);

      if (projectsError) throw projectsError;
      if (customersError) throw customersError;
      if (quotationsError) throw quotationsError;

      setProjects((projectsData || []) as Project[]);
      setCustomers((customersData || []) as Customer[]);
      setQuotations((quotationsData || []) as Quotation[]);
    } catch (err) {
      console.error("Error loading project data:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load project data."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setProjectName("");
    setCustomerId("");
    setQuotationId("");
    setService("");
    setLocation("");
    setBudget("");
    setStartDate("");
    setExpectedCompletionDate("");
    setStatus("Planning");
    setDescription("");
    setNotes("");
  }

  function closeCreateModal() {
    if (saving) return;

    setShowCreateModal(false);
    resetForm();
  }

  async function getNextProjectNumber() {
    const { data, error } = await supabase
      .from("projects")
      .select("project_number")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    const currentYear = new Date().getFullYear();

    let highestNumber = 0;

    for (const project of data || []) {
      const value = project.project_number;

      if (!value) continue;

      const match = value.match(/^PRJ-(\d+)/i);

      if (match) {
        const number = Number(match[1]);

        if (Number.isFinite(number)) {
          highestNumber = Math.max(
            highestNumber,
            number
          );
        }
      }
    }

    return `PRJ-${String(highestNumber + 1).padStart(
      3,
      "0"
    )}-${currentYear}`;
  }

  async function createProject(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!projectName.trim()) {
      setError("Please enter a project name.");
      return;
    }

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }

    if (!service) {
      setError("Please select a service.");
      return;
    }

    if (quotationId) {
      const selectedQuotation = quotations.find(
        (quotation) =>
          quotation.id === Number(quotationId)
      );

      if (
        selectedQuotation &&
        selectedQuotation.customer_id !== Number(customerId)
      ) {
        setError(
          "The selected quotation does not belong to the selected customer."
        );
        return;
      }
    }

    const numericBudget = Number(budget || 0);

    if (
      Number.isNaN(numericBudget) ||
      numericBudget < 0
    ) {
      setError("Please enter a valid project budget.");
      return;
    }

    setSaving(true);

    try {
      const projectNumber =
        await getNextProjectNumber();

      const insertData = {
        project_number: projectNumber,
        customer_id: Number(customerId),
        quotation_id: quotationId
          ? Number(quotationId)
          : null,
        project_name: projectName.trim(),
        service,
        location: location.trim() || null,
        description: description.trim() || null,
        budget: numericBudget,
        status,
        start_date: startDate || null,
        expected_completion_date:
          expectedCompletionDate || null,
        notes: notes.trim() || null,
        completed_at:
          status === "Completed"
            ? new Date().toISOString()
            : null,
      };

      const { data, error: insertError } =
        await supabase
          .from("projects")
          .insert(insertData)
          .select("*")
          .single();

      if (insertError) throw insertError;

      setProjects((current) => [
        data as Project,
        ...current,
      ]);

      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error("Error creating project:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create project."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateProjectStatus(
    projectId: number,
    newStatus: ProjectStatus
  ) {
    setError("");

    try {
      const updateData: {
        status: ProjectStatus;
        completed_at?: string | null;
      } = {
        status: newStatus,
      };

      if (newStatus === "Completed") {
        updateData.completed_at =
          new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      const { data, error: updateError } =
        await supabase
          .from("projects")
          .update(updateData)
          .eq("id", projectId)
          .select("*")
          .single();

      if (updateError) throw updateError;

      setProjects((current) =>
        current.map((project) =>
          project.id === projectId
            ? (data as Project)
            : project
        )
      );
    } catch (err) {
      console.error(
        "Error updating project status:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update project status."
      );
    }
  }

  async function deleteProject(projectId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );

    if (!confirmed) return;

    setError("");

    try {
      const { error: deleteError } =
        await supabase
          .from("projects")
          .delete()
          .eq("id", projectId);

      if (deleteError) throw deleteError;

      setProjects((current) =>
        current.filter(
          (project) => project.id !== projectId
        )
      );
    } catch (err) {
      console.error(
        "Error deleting project:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete project."
      );
    }
  }

  const customerMap = useMemo(() => {
    return new Map(
      customers.map((customer) => [
        customer.id,
        customer,
      ])
    );
  }, [customers]);

  const quotationMap = useMemo(() => {
    return new Map(
      quotations.map((quotation) => [
        quotation.id,
        quotation,
      ])
    );
  }, [quotations]);

  const filteredProjects = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return projects.filter((project) => {
      const customer = customerMap.get(
        project.customer_id
      );

      const quotation = project.quotation_id
        ? quotationMap.get(project.quotation_id)
        : undefined;

      const matchesSearch =
        !searchValue ||
        project.project_name
          .toLowerCase()
          .includes(searchValue) ||
        project.project_number
          .toLowerCase()
          .includes(searchValue) ||
        project.service
          .toLowerCase()
          .includes(searchValue) ||
        project.location
          ?.toLowerCase()
          .includes(searchValue) ||
        customer?.full_name
          ?.toLowerCase()
          .includes(searchValue) ||
        quotation?.quotation_number
          ?.toLowerCase()
          .includes(searchValue) ||
        quotation?.title
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    projects,
    search,
    statusFilter,
    customerMap,
    quotationMap,
  ]);

  const totalValue = useMemo(() => {
    return projects.reduce(
      (total, project) =>
        total + Number(project.budget || 0),
      0
    );
  }, [projects]);

  const completedCount = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.status === "Completed"
      ).length,
    [projects]
  );

  const activeCount = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.status === "In Progress"
      ).length,
    [projects]
  );

  const planningCount = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.status === "Planning"
      ).length,
    [projects]
  );

  const quotationsForCustomer = useMemo(() => {
    if (!customerId) return [];

    return quotations.filter(
      (quotation) =>
        quotation.customer_id ===
        Number(customerId)
    );
  }, [quotations, customerId]);

  const selectedQuotation = useMemo(() => {
    if (!quotationId) return null;

    return (
      quotations.find(
        (quotation) =>
          quotation.id === Number(quotationId)
      ) || null
    );
  }, [quotations, quotationId]);

  function handleCustomerChange(value: string) {
    setCustomerId(value);

    if (!value) {
      setQuotationId("");
      return;
    }

    if (
      quotationId &&
      quotations.find(
        (quotation) =>
          quotation.id === Number(quotationId)
      )?.customer_id !== Number(value)
    ) {
      setQuotationId("");
    }
  }

  function handleQuotationChange(value: string) {
    setQuotationId(value);

    if (!value) return;

    const quotation = quotations.find(
      (item) => item.id === Number(value)
    );

    if (
      quotation &&
      quotation.customer_id === Number(customerId) &&
      (!budget || Number(budget) === 0) &&
      quotation.amount !== null
    ) {
      setBudget(String(quotation.amount));
    }
  }

  function viewProject(projectId: number) {
    router.push(`/admin/projects/${projectId}`);
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-[#b18a5a]">
              <FolderKanban size={17} />
              <span className="font-medium">
                Admin
              </span>
              <span className="text-gray-400">
                /
              </span>
              <span className="text-gray-500">
                Projects
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Projects
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage FINETEX INTERIORS projects
              from planning to completion.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setShowCreateModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#b18a5a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9d784c]"
          >
            <Plus size={18} />
            New Project
          </button>
        </div>

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

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total Projects"
            value={projects.length}
            icon={<FolderKanban size={20} />}
          />

          <SummaryCard
            label="In Progress"
            value={activeCount}
            icon={<Clock3 size={20} />}
          />

          <SummaryCard
            label="Completed"
            value={completedCount}
            icon={
              <CheckCircle2 size={20} />
            }
          />

          <SummaryCard
            label="Total Project Value"
            value={formatCurrency(totalValue)}
            icon={
              <ArrowUpRight size={20} />
            }
          />
        </div>

        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search projects, customers, quotations..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#b18a5a] focus:bg-white focus:ring-2 focus:ring-[#b18a5a]/10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  "All",
                  ...STATUS_OPTIONS,
                ] as (
                  | "All"
                  | ProjectStatus
                )[]
              ).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setStatusFilter(option)
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    statusFilter === option
                      ? "bg-[#b18a5a] text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredProjects.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {projects.length}
            </span>{" "}
            projects
          </p>

          <div className="hidden text-xs text-gray-400 sm:block">
            Planning: {planningCount}
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Loader2
                size={20}
                className="animate-spin text-[#b18a5a]"
              />
              Loading projects...
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            hasFilters={
              Boolean(search.trim()) ||
              statusFilter !== "All"
            }
            onCreate={() => {
              setError("");
              setShowCreateModal(true);
            }}
          />
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Project
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Quotation
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Service
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Budget
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Dates
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredProjects.map(
                      (project) => {
                        const customer =
                          customerMap.get(
                            project.customer_id
                          );

                        const quotation =
                          project.quotation_id
                            ? quotationMap.get(
                                project.quotation_id
                              )
                            : undefined;

                        return (
                          <tr
                            key={project.id}
                            className="transition hover:bg-gray-50/70"
                          >
                            <td className="px-5 py-4">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {
                                    project.project_name
                                  }
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  {
                                    project.project_number
                                  }
                                </p>

                                <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                                  <MapPin
                                    size={13}
                                  />
                                  {project.location ||
                                    "Location not set"}
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-medium text-gray-800">
                                {customer?.full_name ||
                                  "Unknown customer"}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              {quotation ? (
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">
                                    {
                                      quotation.quotation_number
                                    }
                                  </p>

                                  {quotation.title && (
                                    <p className="mt-1 max-w-[180px] truncate text-xs text-gray-500">
                                      {quotation.title}
                                    </p>
                                  )}

                                  {quotation.status && (
                                    <span
                                      className={`mt-2 inline-flex rounded-full border px-2 py-1 text-[10px] font-medium ${getQuotationStatusClasses(
                                        quotation.status
                                      )}`}
                                    >
                                      {quotation.status}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">
                                  No quotation
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm text-gray-700">
                                {project.service}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(
                                  project.budget
                                )}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <div className="space-y-1 text-xs">
                                <p className="text-gray-700">
                                  <span className="text-gray-400">
                                    Start:
                                  </span>{" "}
                                  {formatDate(
                                    project.start_date
                                  )}
                                </p>

                                <p className="text-gray-700">
                                  <span className="text-gray-400">
                                    Due:
                                  </span>{" "}
                                  {formatDate(
                                    project.expected_completion_date
                                  )}
                                </p>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <select
                                value={
                                  project.status
                                }
                                onChange={(event) =>
                                  updateProjectStatus(
                                    project.id,
                                    event.target
                                      .value as ProjectStatus
                                  )
                                }
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium outline-none ${getStatusClasses(
                                  project.status
                                )}`}
                              >
                                {STATUS_OPTIONS.map(
                                  (option) => (
                                    <option
                                      key={option}
                                      value={
                                        option
                                      }
                                    >
                                      {option}
                                    </option>
                                  )
                                )}
                              </select>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    viewProject(
                                      project.id
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-[#b18a5a] hover:text-[#9d784c]"
                                >
                                  View
                                  <ArrowUpRight
                                    size={14}
                                  />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteProject(
                                      project.id
                                    )
                                  }
                                  className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                                  aria-label={`Delete ${project.project_name}`}
                                >
                                  <Trash2
                                    size={16}
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4 md:hidden">
              {filteredProjects.map(
                (project) => {
                  const customer =
                    customerMap.get(
                      project.customer_id
                    );

                  const quotation =
                    project.quotation_id
                      ? quotationMap.get(
                          project.quotation_id
                        )
                      : undefined;

                  return (
                    <div
                      key={project.id}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium text-[#b18a5a]">
                            {
                              project.project_number
                            }
                          </p>

                          <h3 className="mt-1 font-semibold text-gray-900">
                            {
                              project.project_name
                            }
                          </h3>

                          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                            <MapPin
                              size={13}
                            />
                            {project.location ||
                              "Location not set"}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            deleteProject(
                              project.id
                            )
                          }
                          className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                          aria-label={`Delete ${project.project_name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-400">
                            Customer
                          </p>

                          <p className="mt-1 font-medium text-gray-800">
                            {customer?.full_name ||
                              "Unknown customer"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Service
                          </p>

                          <p className="mt-1 font-medium text-gray-800">
                            {project.service}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Quotation
                          </p>

                          <p className="mt-1 font-medium text-gray-800">
                            {quotation?.quotation_number ||
                              "None"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Budget
                          </p>

                          <p className="mt-1 font-semibold text-gray-900">
                            {formatCurrency(
                              project.budget
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Due Date
                          </p>

                          <p className="mt-1 font-medium text-gray-800">
                            {formatDate(
                              project.expected_completion_date
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                            project.status
                          )}`}
                        >
                          {getStatusIcon(
                            project.status
                          )}
                          {project.status}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            viewProject(
                              project.id
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-[#b18a5a] hover:text-[#9d784c]"
                        >
                          View
                          <ArrowUpRight
                            size={14}
                          />
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Create New Project
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a new FINETEX INTERIORS
                  project.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={createProject}
              className="space-y-6 p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Project Name"
                  required
                >
                  <input
                    type="text"
                    value={projectName}
                    onChange={(event) =>
                      setProjectName(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Karen Kitchen Renovation"
                    className="form-input"
                    required
                  />
                </FormField>

                <FormField
                  label="Service"
                  required
                >
                  <select
                    value={service}
                    onChange={(event) =>
                      setService(
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
                    value={customerId}
                    onChange={(event) =>
                      handleCustomerChange(
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
                      (customer) => (
                        <option
                          key={customer.id}
                          value={customer.id}
                        >
                          {customer.full_name}
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                <FormField label="Quotation">
                  <select
                    value={quotationId}
                    onChange={(event) =>
                      handleQuotationChange(
                        event.target.value
                      )
                    }
                    className="form-input"
                    disabled={!customerId}
                  >
                    <option value="">
                      {customerId
                        ? "Select quotation"
                        : "Select customer first"}
                    </option>

                    {quotationsForCustomer.map(
                      (quotation) => (
                        <option
                          key={quotation.id}
                          value={quotation.id}
                        >
                          {
                            quotation.quotation_number
                          }
                          {quotation.title
                            ? ` — ${quotation.title}`
                            : ""}
                        </option>
                      )
                    )}
                  </select>

                  {selectedQuotation && (
                    <div className="mt-2 rounded-xl border border-[#b18a5a]/20 bg-[#b18a5a]/5 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Selected quotation
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {
                              selectedQuotation.quotation_number
                            }
                          </p>
                        </div>

                        <div className="text-right">
                          {selectedQuotation.amount !==
                            null && (
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(
                                selectedQuotation.amount
                              )}
                            </p>
                          )}

                          {selectedQuotation.status && (
                            <span
                              className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${getQuotationStatusClasses(
                                selectedQuotation.status
                              )}`}
                            >
                              {
                                selectedQuotation.status
                              }
                            </span>
                          )}
                        </div>
                      </div>

                      {selectedQuotation.amount !==
                        null &&
                        (!budget ||
                          Number(budget) === 0) && (
                          <p className="mt-2 text-xs text-gray-500">
                            The quotation amount has
                            been added as the project
                            budget.
                          </p>
                        )}
                    </div>
                  )}
                </FormField>

                <FormField label="Location">
                  <input
                    type="text"
                    value={location}
                    onChange={(event) =>
                      setLocation(
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
                    value={budget}
                    onChange={(event) =>
                      setBudget(
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
                    value={startDate}
                    onChange={(event) =>
                      setStartDate(
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
                      expectedCompletionDate
                    }
                    onChange={(event) =>
                      setExpectedCompletionDate(
                        event.target.value
                      )
                    }
                    className="form-input"
                  />
                </FormField>

                <FormField label="Status">
                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(
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
                  value={description}
                  onChange={(event) =>
                    setDescription(
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
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  rows={3}
                  placeholder="Add internal project notes..."
                  className="form-input resize-none"
                />
              </FormField>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCreateModal}
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Create Project
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

        .form-input:disabled {
          cursor: not-allowed;
          opacity: 0.6;
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

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-[#b18a5a]/10 p-3 text-[#b18a5a]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  hasFilters,
  onCreate,
}: {
  hasFilters: boolean;
  onCreate: () => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b18a5a]/10 text-[#b18a5a]">
        <FolderKanban size={26} />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-900">
        {hasFilters
          ? "No matching projects"
          : "No projects found"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {hasFilters
          ? "Try changing your search or status filter."
          : "Create your first project to start tracking FINETEX INTERIORS work."}
      </p>

      {!hasFilters && (
        <button
          type="button"
          onClick={onCreate}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#b18a5a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9d784c]"
        >
          <Plus size={17} />
          Create Project
        </button>
      )}
    </div>
  );
}
