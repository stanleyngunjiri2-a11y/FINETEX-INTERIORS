
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  FileText,
  FolderKanban,
  Loader2,
  ReceiptText,
  TrendingUp,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Period = "This Month" | "Last 3 Months" | "This Year";

type Lead = {
  id: number;
  service: string;
  source: string;
  status: string;
  created_at: string;
};

type Quotation = {
  id: number;
  amount: number | string;
  status: string;
  created_at: string;
};

type Project = {
  id: number;
  project_name: string;
  service: string;
  budget: number | string;
  status: string;
  created_at: string;
};

type Invoice = {
  id: number;
  amount: number | string;
  amount_paid: number | string;
  status: string;
  issue_date: string;
  created_at: string;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AnalyticsPage() {
  const supabase = useMemo(() => createClient(), []);

  const [period, setPeriod] = useState<Period>("This Year");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const toNumber = (value: number | string | null | undefined) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };

  const getPeriodStart = (selectedPeriod: Period) => {
    const now = new Date();

    if (selectedPeriod === "This Month") {
      return new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (selectedPeriod === "Last 3 Months") {
      return new Date(now.getFullYear(), now.getMonth() - 2, 1);
    }

    return new Date(now.getFullYear(), 0, 1);
  };

  const isInPeriod = (dateValue: string, selectedPeriod: Period) => {
    const date = new Date(dateValue);
    return date >= getPeriodStart(selectedPeriod);
  };

  useEffect(() => {
    let mounted = true;

    const loadAnalytics = async () => {
      setLoading(true);
      setError("");

      const [
        { data: leadsData, error: leadsError },
        { data: quotationsData, error: quotationsError },
        { data: projectsData, error: projectsError },
        { data: invoicesData, error: invoicesError },
      ] = await Promise.all([
        supabase
          .from("leads")
          .select("id, service, source, status, created_at")
          .order("created_at", { ascending: false }),

        supabase
          .from("quotations")
          .select("id, amount, status, created_at")
          .order("created_at", { ascending: false }),

        supabase
          .from("projects")
          .select(
            "id, project_name, service, budget, status, created_at"
          )
          .order("created_at", { ascending: false }),

        supabase
          .from("invoices")
          .select(
            "id, amount, amount_paid, status, issue_date, created_at"
          )
          .order("created_at", { ascending: false }),
      ]);

      if (!mounted) return;

      if (
        leadsError ||
        quotationsError ||
        projectsError ||
        invoicesError
      ) {
        console.error("Analytics load errors:", {
          leadsError,
          quotationsError,
          projectsError,
          invoicesError,
        });

        setError(
          "Some analytics data could not be loaded. Please refresh and try again."
        );
        setLoading(false);
        return;
      }

      setLeads(leadsData ?? []);
      setQuotations(quotationsData ?? []);
      setProjects(projectsData ?? []);
      setInvoices(invoicesData ?? []);
      setLoading(false);
    };

    loadAnalytics();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const filteredData = useMemo(() => {
    return {
      leads: leads.filter((item) => isInPeriod(item.created_at, period)),
      quotations: quotations.filter((item) =>
        isInPeriod(item.created_at, period)
      ),
      projects: projects.filter((item) =>
        isInPeriod(item.created_at, period)
      ),
      invoices: invoices.filter((item) =>
        isInPeriod(item.issue_date || item.created_at, period)
      ),
    };
  }, [leads, quotations, projects, invoices, period]);

  const totals = useMemo(() => {
    const projectValue = filteredData.projects.reduce(
      (sum, project) => sum + toNumber(project.budget),
      0
    );

    const quotationValue = filteredData.quotations.reduce(
      (sum, quotation) => sum + toNumber(quotation.amount),
      0
    );

    const invoiceValue = filteredData.invoices.reduce(
      (sum, invoice) => sum + toNumber(invoice.amount),
      0
    );

    const amountCollected = filteredData.invoices.reduce(
      (sum, invoice) => sum + toNumber(invoice.amount_paid),
      0
    );

    const outstanding = Math.max(
      invoiceValue - amountCollected,
      0
    );

    const completedProjects = filteredData.projects.filter(
      (project) =>
        project.status.toLowerCase() === "completed"
    ).length;

    const acceptedQuotations = filteredData.quotations.filter(
      (quotation) =>
        quotation.status.toLowerCase() === "accepted"
    ).length;

    const conversionRate =
      filteredData.leads.length > 0
        ? (completedProjects / filteredData.leads.length) * 100
        : 0;

    const collectionRate =
      invoiceValue > 0
        ? (amountCollected / invoiceValue) * 100
        : 0;

    return {
      leads: filteredData.leads.length,
      quotations: filteredData.quotations.length,
      acceptedQuotations,
      projects: filteredData.projects.length,
      completedProjects,
      projectValue,
      quotationValue,
      invoiceValue,
      amountCollected,
      outstanding,
      conversionRate,
      collectionRate,
    };
  }, [filteredData]);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    let months: {
      month: string;
      year: number;
      monthIndex: number;
    }[] = [];

    if (period === "This Month") {
      months = [
        {
          month: MONTHS[now.getMonth()],
          year: currentYear,
          monthIndex: now.getMonth(),
        },
      ];
    } else if (period === "Last 3 Months") {
      for (let offset = 2; offset >= 0; offset--) {
        const date = new Date(
          currentYear,
          now.getMonth() - offset,
          1
        );

        months.push({
          month: MONTHS[date.getMonth()],
          year: date.getFullYear(),
          monthIndex: date.getMonth(),
        });
      }
    } else {
      months = MONTHS.map((month, index) => ({
        month,
        year: currentYear,
        monthIndex: index,
      }));
    }

    return months.map((month) => {
      const monthLeads = filteredData.leads.filter((lead) => {
        const date = new Date(lead.created_at);

        return (
          date.getFullYear() === month.year &&
          date.getMonth() === month.monthIndex
        );
      });

      const monthQuotations = filteredData.quotations.filter(
        (quotation) => {
          const date = new Date(quotation.created_at);

          return (
            date.getFullYear() === month.year &&
            date.getMonth() === month.monthIndex
          );
        }
      );

      const monthProjects = filteredData.projects.filter(
        (project) => {
          const date = new Date(project.created_at);

          return (
            date.getFullYear() === month.year &&
            date.getMonth() === month.monthIndex
          );
        }
      );

      const value = monthProjects.reduce(
        (sum, project) => sum + toNumber(project.budget),
        0
      );

      return {
        ...month,
        leads: monthLeads.length,
        quotations: monthQuotations.length,
        projects: monthProjects.length,
        value,
      };
    });
  }, [filteredData, period]);

  const popularServices = useMemo(() => {
    const serviceMap = new Map<string, number>();

    filteredData.leads.forEach((lead) => {
      const service = lead.service?.trim() || "Other";

      serviceMap.set(
        service,
        (serviceMap.get(service) || 0) + 1
      );
    });

    return Array.from(serviceMap.entries())
      .map(([name, requests]) => ({
        name,
        requests,
      }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 5);
  }, [filteredData.leads]);

  const leadSources = useMemo(() => {
    const sourceMap = new Map<string, number>();

    filteredData.leads.forEach((lead) => {
      const source = lead.source?.trim() || "Unknown";

      sourceMap.set(
        source,
        (sourceMap.get(source) || 0) + 1
      );
    });

    return Array.from(sourceMap.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredData.leads]);

  const maxValue = Math.max(
    ...monthlyData.map((item) => item.value),
    1
  );

  const maxServiceRequests = Math.max(
    ...popularServices.map((item) => item.requests),
    1
  );

  const maxSourceLeads = Math.max(
    ...leadSources.map((item) => item.count),
    1
  );

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="animate-spin" size={20} />
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#a67c52]">
            Business Performance
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#1f1f1f]">
            Analytics
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Live FINETEX INTERIORS business performance from your
            database.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          {(
            ["This Month", "Last 3 Months", "This Year"] as Period[]
          ).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                period === item
                  ? "bg-[#1f1f1f] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Users size={20} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Total Leads
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#1f1f1f]">
            {totals.leads}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            Customer enquiries received
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
            <FileText size={20} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Quotations
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#1f1f1f]">
            {totals.quotations}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            {totals.acceptedQuotations} accepted
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <FolderKanban size={20} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Projects
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#1f1f1f]">
            {totals.projects}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            {totals.completedProjects} completed
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <TrendingUp size={20} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Project Value
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#1f1f1f]">
            {formatCurrency(totals.projectValue)}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            Total value of projects
          </p>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
              <ReceiptText size={19} />
            </div>

            <p className="text-sm font-medium text-gray-500">
              Invoice Value
            </p>
          </div>

          <p className="mt-5 text-2xl font-bold text-[#1f1f1f]">
            {formatCurrency(totals.invoiceValue)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <CheckCircle2 size={19} />
            </div>

            <p className="text-sm font-medium text-gray-500">
              Amount Collected
            </p>
          </div>

          <p className="mt-5 text-2xl font-bold text-[#1f1f1f]">
            {formatCurrency(totals.amountCollected)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <BarChart3 size={19} />
            </div>

            <p className="text-sm font-medium text-gray-500">
              Outstanding
            </p>
          </div>

          <p className="mt-5 text-2xl font-bold text-[#1f1f1f]">
            {formatCurrency(totals.outstanding)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1eadf] text-[#a67c52]">
              <TrendingUp size={19} />
            </div>

            <p className="text-sm font-medium text-gray-500">
              Collection Rate
            </p>
          </div>

          <p className="mt-5 text-2xl font-bold text-[#1f1f1f]">
            {totals.collectionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1f1f1f]">
                Project Value
              </h2>

              <p className="text-sm text-gray-500">
                Project value created during the selected period
              </p>
            </div>

            <span className="text-sm font-semibold text-[#a67c52]">
              {period}
            </span>
          </div>

          <div className="mt-8 flex h-72 items-end gap-3 sm:gap-5">
            {monthlyData.map((item) => {
              const height =
                item.value > 0
                  ? `${(item.value / maxValue) * 100}%`
                  : "2%";

              return (
                <div
                  key={`${item.year}-${item.month}`}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div className="group relative flex h-full items-end">
                    <div
                      className="w-full rounded-t-xl bg-[#a67c52] transition-all duration-300 hover:bg-[#8f6845]"
                      style={{ height }}
                      title={formatCurrency(item.value)}
                    >
                      {item.value > 0 && (
                        <div className="absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#1f1f1f] px-2 py-1 text-xs text-white group-hover:block">
                          {formatCurrency(item.value)}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 text-center text-xs font-medium text-gray-500">
                    {item.month}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1f1f1f]">
            Conversion Rate
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Completed projects compared with leads
          </p>

          <div className="mt-10 flex justify-center">
            <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-[18px] border-gray-100">
              <div
                className="absolute inset-[-18px] rounded-full border-[18px] border-transparent border-t-[#a67c52] border-r-[#a67c52] rotate-45"
                style={{
                  opacity: totals.conversionRate > 0 ? 1 : 0.2,
                }}
              />

              <div className="text-center">
                <p className="text-4xl font-bold text-[#1f1f1f]">
                  {totals.conversionRate.toFixed(1)}%
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Conversion
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
            <div>
              <p className="text-xs text-gray-400">
                Leads
              </p>

              <p className="mt-1 text-lg font-bold text-[#1f1f1f]">
                {totals.leads}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Completed
              </p>

              <p className="mt-1 text-lg font-bold text-[#1f1f1f]">
                {totals.completedProjects}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services and Sources */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1f1f1f]">
            Popular Services
          </h2>

          <p className="text-sm text-gray-500">
            Services requested by leads
          </p>

          <div className="mt-6 space-y-5">
            {popularServices.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                No service data for this period.
              </p>
            ) : (
              popularServices.map((service, index) => (
                <div key={service.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {index + 1}. {service.name}
                    </span>

                    <span className="text-sm font-semibold text-[#1f1f1f]">
                      {service.requests}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#a67c52]"
                      style={{
                        width: `${
                          (service.requests /
                            maxServiceRequests) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1f1f1f]">
            Lead Sources
          </h2>

          <p className="text-sm text-gray-500">
            Where your leads are coming from
          </p>

          <div className="mt-6 space-y-4">
            {leadSources.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                No source data for this period.
              </p>
            ) : (
              leadSources.map((source) => (
                <div
                  key={source.name}
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-[#a67c52] shadow-sm">
                      {source.name.charAt(0).toUpperCase()}
                    </div>

                    <span className="text-sm font-medium text-gray-700">
                      {source.name}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-[#1f1f1f]">
                      {source.count}
                    </p>

                    <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-[#a67c52]"
                        style={{
                          width: `${
                            (source.count / maxSourceLeads) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Monthly Activity */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#1f1f1f]">
            Monthly Activity
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Live leads, quotations, projects and project value
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Month
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Leads
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Quotations
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Projects
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Project Value
                </th>
              </tr>
            </thead>

            <tbody>
              {monthlyData.map((item) => (
                <tr
                  key={`${item.year}-${item.month}`}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-[#1f1f1f]">
                    {item.month}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.leads}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.quotations}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.projects}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-[#a67c52]">
                    {formatCurrency(item.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Data Notice */}
      <div className="rounded-2xl border border-[#a67c52]/20 bg-[#a67c52]/5 p-6">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#a67c52] shadow-sm">
            <BarChart3 size={20} />
          </div>

          <div>
            <h3 className="font-bold text-[#1f1f1f]">
              Live database analytics
            </h3>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600">
              These figures are calculated from the current FINETEX
              database. Changes to leads, quotations, projects and
              invoices will be reflected when the analytics page is
              refreshed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
