"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  FolderKanban,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ReactNode } from "react";

const supabase = createClient();

type ProjectStatus =
  | "Planning"
  | "In Progress"
  | "On Hold"
  | "Completed";

type Project = {
  id: number;
  project_number: string;
  project_name: string;
  service: string;
  location: string | null;
  budget: number;
  status: ProjectStatus;
  expected_completion_date: string | null;
  created_at: string;
};

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
  title: string | null;
  amount: number | null;
  status: string | null;
  created_at: string;
};

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
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusClasses(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-50 text-green-700";

    case "In Progress":
      return "bg-blue-50 text-blue-700";

    case "Planning":
      return "bg-[#f1eadf] text-[#9b713c]";

    case "On Hold":
      return "bg-orange-50 text-orange-700";

    case "Approved":
      return "bg-green-50 text-green-700";

    case "Pending":
      return "bg-orange-50 text-orange-700";

    case "Draft":
      return "bg-gray-100 text-gray-700";

    case "Sent":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getRelativeDate(date: string) {
  const created = new Date(date);
  const now = new Date();

  const difference =
    now.getTime() - created.getTime();

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return formatDate(date);
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(
    []
  );
  const [quotations, setQuotations] = useState<Quotation[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
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
          .select(
            "id, project_number, project_name, service, location, budget, status, expected_completion_date, created_at"
          )
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("customers")
          .select(
            "id, full_name, phone, location, created_at"
          )
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("quotations")
          .select(
            "id, quotation_number, title, amount, status, created_at"
          )
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (projectsError) throw projectsError;
      if (customersError) throw customersError;
      if (quotationsError) throw quotationsError;

      setProjects((projectsData || []) as Project[]);
      setCustomers((customersData || []) as Customer[]);
      setQuotations(
        (quotationsData || []) as Quotation[]
      );
    } catch (err) {
      console.error(
        "Error loading dashboard:",
        err
      );

      if (err && typeof err === "object") {
        console.error(
          "Supabase dashboard error details:",
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
          : "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  const activeProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.status === "In Progress"
      ),
    [projects]
  );

  const completedProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.status === "Completed"
      ),
    [projects]
  );

  const planningProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.status === "Planning"
      ),
    [projects]
  );

  const onHoldProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.status === "On Hold"
      ),
    [projects]
  );

  const totalProjectValue = useMemo(
    () =>
      projects.reduce(
        (total, project) =>
          total + Number(project.budget || 0),
        0
      ),
    [projects]
  );

  const pendingQuotations = useMemo(
    () =>
      quotations.filter((quotation) => {
        const status =
          quotation.status?.toLowerCase();

        return (
          status === "pending" ||
          status === "sent" ||
          status === "draft"
        );
      }),
    [quotations]
  );

  const quotationValue = useMemo(
    () =>
      quotations.reduce(
        (total, quotation) =>
          total + Number(quotation.amount || 0),
        0
      ),
    [quotations]
  );

  const pipelineTotal = Math.max(
    projects.length,
    1
  );

  const recentProjects = projects.slice(0, 5);
  const recentCustomers = customers.slice(0, 5);
  const recentQuotations = quotations.slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#e5e0d7] border-t-[#b18a5a]" />

          <p className="mt-4 text-sm text-[#777]">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b18a5a]">
            Overview
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-[#777]">
            Welcome back. Here&apos;s what&apos;s happening
            at FINETEX.
          </p>
        </div>

        <Link
          href="/admin/projects"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b18a5a]"
        >
          <Plus size={17} />
          New Project
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">
            Dashboard error
          </p>

          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Customers"
          value={customers.length}
          description="Total customers"
          icon={Users}
        />

        <StatCard
          title="Active Projects"
          value={activeProjects.length}
          description={`${projects.length} total projects`}
          icon={FolderKanban}
        />

        <StatCard
          title="Pending Quotations"
          value={pendingQuotations.length}
          description={`${quotations.length} total quotations`}
          icon={FileText}
        />

        <StatCard
          title="Project Value"
          value={formatCurrency(
            totalProjectValue
          )}
          description={`${completedProjects.length} completed`}
          icon={TrendingUp}
        />
      </div>

      {/* Project overview + Quick Actions */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        {/* Project Status */}
        <section className="rounded-2xl border border-[#e5e0d7] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#171717]">
                Project Overview
              </h2>

              <p className="mt-1 text-sm text-[#888]">
                Current status of all FINETEX projects.
              </p>
            </div>

            <Link
              href="/admin/projects"
              className="hidden items-center gap-1 text-sm font-semibold text-[#171717] transition hover:text-[#b18a5a] sm:flex"
            >
              View projects
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-8 space-y-5">
            <ProjectStatusRow
              name="Planning"
              count={planningProjects.length}
              total={pipelineTotal}
            />

            <ProjectStatusRow
              name="In Progress"
              count={activeProjects.length}
              total={pipelineTotal}
            />

            <ProjectStatusRow
              name="On Hold"
              count={onHoldProjects.length}
              total={pipelineTotal}
            />

            <ProjectStatusRow
              name="Completed"
              count={completedProjects.length}
              total={pipelineTotal}
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#f7f5f0] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#999]">
                Total Project Value
              </p>

              <p className="mt-2 text-xl font-semibold text-[#171717]">
                {formatCurrency(
                  totalProjectValue
                )}
              </p>
            </div>

            <div className="rounded-xl bg-[#f7f5f0] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#999]">
                Quotation Value
              </p>

              <p className="mt-2 text-xl font-semibold text-[#171717]">
                {formatCurrency(
                  quotationValue
                )}
              </p>
            </div>
          </div>

          <Link
            href="/admin/projects"
            className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-[#171717] transition hover:text-[#b18a5a] sm:hidden"
          >
            View projects
            <ArrowRight size={15} />
          </Link>
        </section>

        {/* Quick Actions */}
        <section className="rounded-2xl border border-[#e5e0d7] bg-[#171717] p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d0a76a]">
            Quick Actions
          </p>

          <h2 className="mt-3 text-xl font-semibold">
            Manage FINETEX
          </h2>

          <div className="mt-6 space-y-3">
            <QuickAction
              href="/admin/customers"
              label="Customers"
            />

            <QuickAction
              href="/admin/quotations"
              label="Quotations"
            />

            <QuickAction
              href="/admin/projects"
              label="Projects"
            />

            <QuickAction
              href="/admin/projects"
              label="Create project"
            />
          </div>
        </section>
      </div>

      {/* Recent Projects */}
      <section className="mt-6 rounded-2xl border border-[#e5e0d7] bg-white">
        <SectionHeader
          title="Recent Projects"
          description="Latest projects added to FINETEX."
          href="/admin/projects"
          linkText="View all"
        />

        {recentProjects.length === 0 ? (
          <EmptyTableState
            message="No projects have been created yet."
          />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#eeeae3] text-left">
                    <TableHeading>
                      Project
                    </TableHeading>

                    <TableHeading>
                      Service
                    </TableHeading>

                    <TableHeading>
                      Location
                    </TableHeading>

                    <TableHeading>
                      Budget
                    </TableHeading>

                    <TableHeading>
                      Status
                    </TableHeading>

                    <TableHeading>
                      Due
                    </TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {recentProjects.map(
                    (project) => (
                      <tr
                        key={project.id}
                        className="border-b border-[#f0ede7] last:border-0"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="group"
                          >
                            <p className="text-sm font-semibold text-[#171717] group-hover:text-[#b18a5a]">
                              {
                                project.project_name
                              }
                            </p>

                            <p className="mt-1 text-xs text-[#999]">
                              {
                                project.project_number
                              }
                            </p>
                          </Link>
                        </td>

                        <td className="px-6 py-4 text-sm text-[#666]">
                          {project.service}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#666]">
                          {project.location ||
                            "Not set"}
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-[#171717]">
                          {formatCurrency(
                            project.budget
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              project.status
                            )}`}
                          >
                            {project.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-[#888]">
                          {formatDate(
                            project.expected_completion_date
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-[#eeeae3] md:hidden">
              {recentProjects.map(
                (project) => (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="block p-5 transition hover:bg-[#faf9f6]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#171717]">
                          {
                            project.project_name
                          }
                        </p>

                        <p className="mt-1 text-xs text-[#999]">
                          {
                            project.project_number
                          }
                        </p>

                        <p className="mt-2 text-sm text-[#666]">
                          {project.service}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-[#888]">
                      <span>
                        {project.location ||
                          "Location not set"}
                      </span>

                      <span>
                        {formatCurrency(
                          project.budget
                        )}
                      </span>
                    </div>
                  </Link>
                )
              )}
            </div>
          </>
        )}
      </section>

      {/* Customers + Quotations */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent Customers */}
        <section className="rounded-2xl border border-[#e5e0d7] bg-white">
          <SectionHeader
            title="Recent Customers"
            description="Latest customers added."
            href="/admin/customers"
            linkText="View all"
          />

          {recentCustomers.length === 0 ? (
            <EmptyTableState
              message="No customers have been added yet."
            />
          ) : (
            <div className="divide-y divide-[#eeeae3]">
              {recentCustomers.map(
                (customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between gap-4 p-5"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#171717]">
                        {customer.full_name}
                      </p>

                      <p className="mt-1 text-xs text-[#888]">
                        {customer.phone ||
                          "No phone number"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-[#999]">
                        {customer.location ||
                          "Location not set"}
                      </p>

                      <p className="mt-1 text-xs text-[#aaa]">
                        {getRelativeDate(
                          customer.created_at
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* Recent Quotations */}
        <section className="rounded-2xl border border-[#e5e0d7] bg-white">
          <SectionHeader
            title="Recent Quotations"
            description="Latest quotations created."
            href="/admin/quotations"
            linkText="View all"
          />

          {recentQuotations.length === 0 ? (
            <EmptyTableState
              message="No quotations have been created yet."
            />
          ) : (
            <div className="divide-y divide-[#eeeae3]">
              {recentQuotations.map(
                (quotation) => (
                  <div
                    key={quotation.id}
                    className="flex items-center justify-between gap-4 p-5"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#171717]">
                        {
                          quotation.quotation_number
                        }
                      </p>

                      <p className="mt-1 text-xs text-[#666]">
                        {quotation.title ||
                          "Untitled quotation"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#171717]">
                        {formatCurrency(
                          quotation.amount || 0
                        )}
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                          quotation.status ||
                            "Unknown"
                        )}`}
                      >
                        {quotation.status ||
                          "Unknown"}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>

      {/* Footer note */}
      <div className="mt-6 rounded-2xl border border-dashed border-[#d8d1c5] bg-white/60 p-5 text-center">
        <p className="text-sm text-[#888]">
          Dashboard data is now connected to your
          FINETEX database.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-2xl border border-[#e5e0d7] bg-white p-6">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1eadf] text-[#b18a5a]">
          <Icon size={20} strokeWidth={1.7} />
        </div>

        <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
          <TrendingUp size={13} />
          Live
        </span>
      </div>

      <p className="mt-5 text-sm text-[#777]">
        {title}
      </p>

      <p className="mt-1 text-3xl font-semibold text-[#171717]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#999]">
        {description}
      </p>
    </div>
  );
}

function ProjectStatusRow({
  name,
  count,
  total,
}: {
  name: string;
  count: number;
  total: number;
}) {
  const percentage =
    total > 0
      ? Math.min((count / total) * 100, 100)
      : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {name === "Completed" ? (
            <CheckCircle2
              size={15}
              className="text-green-600"
            />
          ) : (
            <Clock3
              size={15}
              className="text-[#b18a5a]"
            />
          )}

          <span className="text-sm font-medium text-[#555]">
            {name}
          </span>
        </div>

        <span className="text-sm font-semibold text-[#171717]">
          {count}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#eeeae3]">
        <div
          className="h-full rounded-full bg-[#b18a5a] transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function QuickAction({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm transition hover:bg-white/15"
    >
      <span>{label}</span>
      <ArrowRight size={16} />
    </Link>
  );
}

function SectionHeader({
  title,
  description,
  href,
  linkText,
}: {
  title: string;
  description: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 border-b border-[#eeeae3] p-6 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-lg font-semibold text-[#171717]">
          {title}
        </h2>

        <p className="mt-1 text-sm text-[#888]">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="inline-flex items-center gap-1 text-sm font-semibold text-[#171717] transition hover:text-[#b18a5a]"
      >
        {linkText}
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function TableHeading({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#999]">
      {children}
    </th>
  );
}

function EmptyTableState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="p-8 text-center">
      <p className="text-sm text-[#888]">
        {message}
      </p>
    </div>
  );
}