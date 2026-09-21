
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Phone,
  MapPin,
  CalendarDays,
  ArrowRight,
  Users,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type PipelineStage =
  | "New Lead"
  | "Contacted"
  | "Site Visit"
  | "Quotation"
  | "Approved"
  | "Project"
  | "Completed";

type Customer = {
  id: number;
  full_name: string;
  phone: string | null;
  location: string | null;
  created_at: string;
};

type Quotation = {
  id: number;
  quotation_number: string;
  customer_id: number;
  title: string;
  amount: number;
  status: string;
  created_at: string;
  customer?: Customer | null;
};

type Project = {
  id: number;
  project_number: string;
  customer_id: number;
  quotation_id: number | null;
  project_name: string;
  service: string;
  location: string | null;
  budget: number;
  status: string;
  expected_completion_date: string | null;
  created_at: string;
  customer?: Customer | null;
};

type PipelineRecord = {
  id: string;
  sourceId: number;
  name: string;
  service: string;
  location: string;
  value: number;
  date: string;
  phone: string;
  stage: PipelineStage;
  source: "customer" | "quotation" | "project";
};

const stages: {
  name: PipelineStage;
  description: string;
}[] = [
  {
    name: "New Lead",
    description: "New enquiries",
  },
  {
    name: "Contacted",
    description: "Client contacted",
  },
  {
    name: "Site Visit",
    description: "Visit scheduled",
  },
  {
    name: "Quotation",
    description: "Quote prepared",
  },
  {
    name: "Approved",
    description: "Quote accepted",
  },
  {
    name: "Project",
    description: "Work in progress",
  },
  {
    name: "Completed",
    description: "Project finished",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function stageColor(stage: PipelineStage) {
  switch (stage) {
    case "New Lead":
      return "bg-blue-100 text-blue-700";

    case "Contacted":
      return "bg-purple-100 text-purple-700";

    case "Site Visit":
      return "bg-orange-100 text-orange-700";

    case "Quotation":
      return "bg-yellow-100 text-yellow-700";

    case "Approved":
      return "bg-green-100 text-green-700";

    case "Project":
      return "bg-indigo-100 text-indigo-700";

    case "Completed":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getDotColor(stage: PipelineStage) {
  switch (stage) {
    case "New Lead":
      return "bg-blue-500";

    case "Contacted":
      return "bg-purple-500";

    case "Site Visit":
      return "bg-orange-500";

    case "Quotation":
      return "bg-yellow-500";

    case "Approved":
      return "bg-green-500";

    case "Project":
      return "bg-indigo-500";

    case "Completed":
      return "bg-gray-500";

    default:
      return "bg-gray-400";
  }
}

function getCustomerStage(customer: Customer): PipelineStage {
  /*
   * Customers without a quotation or project are treated as new leads.
   *
   * Since the current database does not yet store explicit
   * "Contacted" or "Site Visit" stages, those stages will remain
   * available for the future dedicated lead workflow.
   */
  return "New Lead";
}

function getQuotationStage(quotation: Quotation): PipelineStage {
  const status = quotation.status.toLowerCase();

  if (status === "accepted") {
    return "Approved";
  }

  if (status === "rejected" || status === "expired") {
    return "Quotation";
  }

  return "Quotation";
}

function getProjectStage(project: Project): PipelineStage {
  const status = project.status.toLowerCase();

  if (
    status === "completed" ||
    status === "complete" ||
    status === "finished"
  ) {
    return "Completed";
  }

  return "Project";
}

function normalizePhone(phone: string | null) {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    return `254${cleaned.slice(1)}`;
  }

  if (cleaned.startsWith("254")) {
    return cleaned;
  }

  return cleaned;
}

export default function PipelinePage() {
  const supabase = createClient();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  async function loadPipeline(showRefreshLoader = false) {
    try {
      setError("");

      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [customersResult, quotationsResult, projectsResult] =
        await Promise.all([
          supabase
            .from("customers")
            .select("id, full_name, phone, location, created_at")
            .order("created_at", { ascending: false }),

          supabase
            .from("quotations")
            .select(
              "id, quotation_number, customer_id, title, amount, status, created_at"
            )
            .order("created_at", { ascending: false }),

          supabase
            .from("projects")
            .select(
              "id, project_number, customer_id, quotation_id, project_name, service, location, budget, status, expected_completion_date, created_at"
            )
            .order("created_at", { ascending: false }),
        ]);

      if (customersResult.error) {
        throw new Error(customersResult.error.message);
      }

      if (quotationsResult.error) {
        throw new Error(quotationsResult.error.message);
      }

      if (projectsResult.error) {
        throw new Error(projectsResult.error.message);
      }

      const customerData = (customersResult.data ?? []) as Customer[];
      const quotationData = (quotationsResult.data ?? []) as Quotation[];
      const projectData = (projectsResult.data ?? []) as Project[];

      const customerMap = new Map(
        customerData.map((customer) => [customer.id, customer])
      );

      setCustomers(customerData);

      setQuotations(
        quotationData.map((quotation) => ({
          ...quotation,
          customer: customerMap.get(quotation.customer_id) ?? null,
        }))
      );

      setProjects(
        projectData.map((project) => ({
          ...project,
          customer: customerMap.get(project.customer_id) ?? null,
        }))
      );
    } catch (err) {
      console.error("Pipeline loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load pipeline data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadPipeline();
  }, []);

  const pipelineRecords = useMemo<PipelineRecord[]>(() => {
    const records: PipelineRecord[] = [];

    const projectCustomerIds = new Set(
      projects.map((project) => project.customer_id)
    );

    const quotationCustomerIds = new Set(
      quotations.map((quotation) => quotation.customer_id)
    );

    /*
     * Customers without quotations or projects become New Leads.
     */
    customers
      .filter(
        (customer) =>
          !projectCustomerIds.has(customer.id) &&
          !quotationCustomerIds.has(customer.id)
      )
      .forEach((customer) => {
        records.push({
          id: `customer-${customer.id}`,
          sourceId: customer.id,
          name: customer.full_name,
          service: "New enquiry",
          location: customer.location || "Location not provided",
          value: 0,
          date: customer.created_at,
          phone: normalizePhone(customer.phone),
          stage: getCustomerStage(customer),
          source: "customer",
        });
      });

    /*
     * Quotations that don't yet have a project become
     * Quotation or Approved records.
     */
    quotations
      .filter(
        (quotation) =>
          !projects.some(
            (project) => project.quotation_id === quotation.id
          )
      )
      .forEach((quotation) => {
        const customer = quotation.customer;

        records.push({
          id: `quotation-${quotation.id}`,
          sourceId: quotation.id,
          name: customer?.full_name || "Unknown Customer",
          service: quotation.title,
          location: customer?.location || "Location not provided",
          value: Number(quotation.amount) || 0,
          date: quotation.created_at,
          phone: normalizePhone(customer?.phone || null),
          stage: getQuotationStage(quotation),
          source: "quotation",
        });
      });

    /*
     * Projects become Project or Completed records.
     */
    projects.forEach((project) => {
      const customer = project.customer;

      records.push({
        id: `project-${project.id}`,
        sourceId: project.id,
        name: customer?.full_name || "Unknown Customer",
        service: project.service || project.project_name,
        location:
          project.location ||
          customer?.location ||
          "Location not provided",
        value: Number(project.budget) || 0,
        date: project.created_at,
        phone: normalizePhone(customer?.phone || null),
        stage: getProjectStage(project),
        source: "project",
      });
    });

    return records;
  }, [customers, quotations, projects]);

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return pipelineRecords;
    }

    return pipelineRecords.filter(
      (record) =>
        record.name.toLowerCase().includes(query) ||
        record.service.toLowerCase().includes(query) ||
        record.location.toLowerCase().includes(query)
    );
  }, [pipelineRecords, search]);

  const totalPipelineValue = useMemo(
    () =>
      pipelineRecords.reduce(
        (total, record) => total + record.value,
        0
      ),
    [pipelineRecords]
  );

  const activeRecords = useMemo(
    () =>
      pipelineRecords.filter(
        (record) => record.stage !== "Completed"
      ).length,
    [pipelineRecords]
  );

  const completedProjects = useMemo(
    () =>
      pipelineRecords.filter(
        (record) => record.stage === "Completed"
      ).length,
    [pipelineRecords]
  );

  const totalCustomers = customers.length;

  function openWhatsApp(record: PipelineRecord) {
    if (!record.phone) return;

    const message = `Hello ${record.name}, this is FINETEX INTERIORS regarding your ${record.service} project.`;

    window.open(
      `https://wa.me/${record.phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 size={20} className="animate-spin" />
          Loading pipeline...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#b58b2a]">
            Sales & Project Pipeline
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Pipeline
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Track FINETEX clients from enquiry, through quotations and
            projects, to completion.
          </p>
        </div>

        <div className="flex w-full gap-2 lg:w-auto">
          <div className="relative w-full lg:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
            />
          </div>

          <button
            type="button"
            onClick={() => loadPipeline(true)}
            disabled={refreshing}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            Failed to load pipeline
          </p>

          <p className="mt-1 text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Customers
            </p>

            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Users size={19} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {totalCustomers}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Customers in the database
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Active Pipeline
            </p>

            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
              <ArrowRight size={19} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {activeRecords}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Records not yet completed
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Pipeline Value
            </p>

            <div className="rounded-xl bg-green-50 p-2.5 text-green-600">
              <ArrowRight size={19} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {formatCurrency(totalPipelineValue)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Quotations and project budgets
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Completed
            </p>

            <div className="rounded-xl bg-gray-100 p-2.5 text-gray-700">
              <CalendarDays size={19} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {completedProjects}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Completed projects
          </p>
        </div>
      </div>

      {/* PIPELINE */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Client Pipeline
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Live data from customers, quotations and projects.
            </p>
          </div>
        </div>

        {/* KANBAN BOARD */}
        <div className="overflow-x-auto p-5 sm:p-6">
          <div className="flex min-w-[1450px] gap-4">
            {stages.map((stage) => {
              const stageRecords = filteredRecords.filter(
                (record) => record.stage === stage.name
              );

              const stageValue = stageRecords.reduce(
                (total, record) => total + record.value,
                0
              );

              return (
                <div
                  key={stage.name}
                  className="flex w-[200px] shrink-0 flex-col"
                >
                  {/* COLUMN HEADER */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-800">
                        {stage.name}
                      </h3>

                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-600">
                        {stageRecords.length}
                      </span>
                    </div>

                    <p className="mt-1 text-[11px] text-gray-400">
                      {stage.description}
                    </p>

                    {stageRecords.length > 0 && (
                      <p className="mt-1 text-[11px] font-medium text-[#b58b2a]">
                        {formatCurrency(stageValue)}
                      </p>
                    )}
                  </div>

                  {/* COLUMN */}
                  <div className="min-h-[500px] rounded-2xl bg-[#f7f5f0] p-2">
                    <div className="space-y-3">
                      {stageRecords.length === 0 ? (
                        <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/60 p-4 text-center">
                          <p className="text-xs text-gray-400">
                            No records here
                          </p>
                        </div>
                      ) : (
                        stageRecords.map((record) => (
                          <div
                            key={record.id}
                            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                          >
                            {/* CLIENT */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h4 className="truncate text-sm font-bold text-gray-900">
                                  {record.name}
                                </h4>

                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                  {record.service}
                                </p>
                              </div>

                              <span
                                className={`h-2 w-2 shrink-0 rounded-full ${getDotColor(
                                  record.stage
                                )}`}
                              />
                            </div>

                            {/* SOURCE */}
                            <div className="mt-3">
                              <span
                                className={`rounded-full px-2 py-1 text-[10px] font-semibold ${stageColor(
                                  record.stage
                                )}`}
                              >
                                {record.source}
                              </span>
                            </div>

                            {/* VALUE */}
                            <div className="mt-4 rounded-lg bg-gray-50 p-2.5">
                              <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                Value
                              </p>

                              <p className="mt-0.5 text-sm font-bold text-gray-900">
                                {record.value > 0
                                  ? formatCurrency(record.value)
                                  : "Not set"}
                              </p>
                            </div>

                            {/* LOCATION */}
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                              <MapPin size={13} />

                              <span className="truncate">
                                {record.location}
                              </span>
                            </div>

                            {/* DATE */}
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                              <CalendarDays size={13} />

                              <span>{formatDate(record.date)}</span>
                            </div>

                            {/* ACTION */}
                            <div className="mt-4">
                              {record.phone ? (
                                <button
                                  type="button"
                                  onClick={() => openWhatsApp(record)}
                                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#b58b2a] px-2 py-2 text-[11px] font-semibold text-white transition hover:bg-[#9d771f]"
                                >
                                  <Phone size={13} />
                                  WhatsApp
                                </button>
                              ) : (
                                <div className="rounded-lg bg-gray-50 px-2 py-2 text-center text-[11px] text-gray-400">
                                  No phone number
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="rounded-xl bg-white p-2.5 text-[#b58b2a]">
            <ArrowRight size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              How the live pipeline works
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Pipeline records are now generated from the real FINETEX
              database. Customers without quotations or projects appear as
              new leads, quotations appear in the quotation stages, accepted
              quotations appear as approved, and projects move through active
              and completed stages according to their database status.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-600">
              {stages.map((stage, index) => (
                <div
                  key={stage.name}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`rounded-full px-2.5 py-1 ${stageColor(
                      stage.name
                    )}`}
                  >
                    {stage.name}
                  </span>

                  {index < stages.length - 1 && (
                    <ArrowRight
                      size={12}
                      className="text-gray-400"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
