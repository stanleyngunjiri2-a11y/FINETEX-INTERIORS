"use client";

import { useMemo, useState } from "react";

type Period = "This Month" | "Last 3 Months" | "This Year";

const monthlyData = [
  { month: "Jan", leads: 18, quotations: 12, projects: 5, value: 680000 },
  { month: "Feb", leads: 24, quotations: 16, projects: 7, value: 920000 },
  { month: "Mar", leads: 31, quotations: 21, projects: 9, value: 1250000 },
  { month: "Apr", leads: 27, quotations: 18, projects: 8, value: 1100000 },
  { month: "May", leads: 36, quotations: 24, projects: 11, value: 1580000 },
  { month: "Jun", leads: 42, quotations: 29, projects: 13, value: 1920000 },
];

const popularServices = [
  { name: "Kitchen Renovation", requests: 38 },
  { name: "Wardrobes", requests: 31 },
  { name: "Gypsum Ceilings", requests: 24 },
  { name: "TV Cabinets", requests: 21 },
  { name: "Bathroom Renovation", requests: 17 },
];

const leadSources = [
  { name: "Instagram", leads: 46 },
  { name: "WhatsApp", leads: 35 },
  { name: "Facebook", leads: 24 },
  { name: "Website", leads: 19 },
  { name: "Referral", leads: 11 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("This Year");

  const totals = useMemo(() => {
    return monthlyData.reduce(
      (acc, month) => {
        acc.leads += month.leads;
        acc.quotations += month.quotations;
        acc.projects += month.projects;
        acc.value += month.value;

        return acc;
      },
      {
        leads: 0,
        quotations: 0,
        projects: 0,
        value: 0,
      }
    );
  }, []);

  const conversionRate =
    totals.leads > 0
      ? ((totals.projects / totals.leads) * 100).toFixed(1)
      : "0.0";

  const maxValue = Math.max(...monthlyData.map((item) => item.value));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
            Track FINETEX INTERIORS leads, quotations, projects, revenue and
            customer activity.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          {(["This Month", "Last 3 Months", "This Year"] as Period[]).map(
            (item) => (
              <button
                key={item}
                onClick={() => setPeriod(item)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  period === item
                    ? "bg-[#1f1f1f] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Leads */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
              👥
            </div>

            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
              +18.4%
            </span>
          </div>

          <p className="mt-5 text-sm text-gray-500">Total Leads</p>

          <h2 className="mt-1 text-3xl font-bold text-[#1f1f1f]">
            {totals.leads}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            Customer enquiries received
          </p>
        </div>

        {/* Quotations */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
              📄
            </div>

            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
              +12.7%
            </span>
          </div>

          <p className="mt-5 text-sm text-gray-500">Quotations</p>

          <h2 className="mt-1 text-3xl font-bold text-[#1f1f1f]">
            {totals.quotations}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            Quotations created
          </p>
        </div>

        {/* Projects */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
              🏗️
            </div>

            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
              +21.3%
            </span>
          </div>

          <p className="mt-5 text-sm text-gray-500">Projects Won</p>

          <h2 className="mt-1 text-3xl font-bold text-[#1f1f1f]">
            {totals.projects}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            Projects successfully secured
          </p>
        </div>

        {/* Revenue */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl">
              💰
            </div>

            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
              +24.6%
            </span>
          </div>

          <p className="mt-5 text-sm text-gray-500">Project Value</p>

          <h2 className="mt-1 text-2xl font-bold text-[#1f1f1f]">
            {formatCurrency(totals.value)}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            Total value of won projects
          </p>
        </div>
      </div>

      {/* Main Analytics */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Project Value Chart */}
        <div className="xl:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1f1f1f]">
                Project Value
              </h2>

              <p className="text-sm text-gray-500">
                Monthly project value performance
              </p>
            </div>

            <span className="text-sm font-semibold text-[#a67c52]">
              {period}
            </span>
          </div>

          <div className="mt-8 flex h-72 items-end gap-3 sm:gap-5">
            {monthlyData.map((item) => {
              const height = `${(item.value / maxValue) * 100}%`;

              return (
                <div
                  key={item.month}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div className="group relative flex h-full items-end">
                    <div
                      className="w-full rounded-t-xl bg-[#a67c52] transition-all duration-300 hover:bg-[#8f6845]"
                      style={{ height }}
                    >
                      <div className="absolute -top-10 left-1/2 hidden -translate-x-1/2 rounded-lg bg-[#1f1f1f] px-2 py-1 text-xs text-white group-hover:block">
                        {formatCurrency(item.value)}
                      </div>
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

        {/* Conversion */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1f1f1f]">
            Conversion Rate
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Leads converted into projects
          </p>

          <div className="mt-10 flex justify-center">
            <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-[18px] border-gray-100">
              <div className="absolute inset-[-18px] rounded-full border-[18px] border-transparent border-t-[#a67c52] border-r-[#a67c52] rotate-45" />

              <div className="text-center">
                <p className="text-4xl font-bold text-[#1f1f1f]">
                  {conversionRate}%
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Conversion
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
            <div>
              <p className="text-xs text-gray-400">Leads</p>
              <p className="mt-1 text-lg font-bold text-[#1f1f1f]">
                {totals.leads}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Projects</p>
              <p className="mt-1 text-lg font-bold text-[#1f1f1f]">
                {totals.projects}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services + Sources */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Popular Services */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#1f1f1f]">
              Popular Services
            </h2>

            <p className="text-sm text-gray-500">
              Most requested FINETEX services
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {popularServices.map((service, index) => (
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
                      width: `${(service.requests / 38) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Sources */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#1f1f1f]">
              Lead Sources
            </h2>

            <p className="text-sm text-gray-500">
              Where your customers are coming from
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {leadSources.map((source) => (
              <div
                key={source.name}
                className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-[#a67c52] shadow-sm">
                    {source.name.charAt(0)}
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    {source.name}
                  </span>
                </div>

                <span className="text-sm font-bold text-[#1f1f1f]">
                  {source.leads} leads
                </span>
              </div>
            ))}
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
            Overview of leads, quotations and projects
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
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
                  key={item.month}
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

      {/* Future Analytics */}
      <div className="rounded-2xl border border-dashed border-[#a67c52]/40 bg-[#a67c52]/5 p-6">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
            📊
          </div>

          <div>
            <h3 className="font-bold text-[#1f1f1f]">
              Real-time analytics coming next
            </h3>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600">
              These figures are currently demonstration data. Once the
              FINETEX database is connected, this dashboard will automatically
              calculate real leads, quotations, project values, conversion
              rates, service demand, lead sources and business performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}