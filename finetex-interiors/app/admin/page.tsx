import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  FileText,
  FolderKanban,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Total Leads",
    value: "24",
    change: "+12%",
    description: "from last month",
    icon: ClipboardList,
  },
  {
    title: "Customers",
    value: "12",
    change: "+8%",
    description: "from last month",
    icon: Users,
  },
  {
    title: "Active Projects",
    value: "7",
    change: "+2",
    description: "this month",
    icon: FolderKanban,
  },
  {
    title: "Pending Quotations",
    value: "5",
    change: "3 new",
    description: "need attention",
    icon: FileText,
  },
];

const pipeline = [
  {
    name: "New Leads",
    count: 24,
    color: "bg-[#d0a76a]",
  },
  {
    name: "Contacted",
    count: 16,
    color: "bg-[#9b8a72]",
  },
  {
    name: "Site Visit",
    count: 9,
    color: "bg-[#777]",
  },
  {
    name: "Quotation",
    count: 7,
    color: "bg-[#555]",
  },
  {
    name: "Approved",
    count: 4,
    color: "bg-[#333]",
  },
  {
    name: "Project",
    count: 7,
    color: "bg-[#171717]",
  },
];

const recentLeads = [
  {
    name: "John Kamau",
    service: "Kitchen Renovation",
    location: "Nairobi",
    date: "Today",
    status: "New",
  },
  {
    name: "Mary Wanjiku",
    service: "Custom Wardrobe",
    location: "Ruiru",
    date: "Today",
    status: "Contacted",
  },
  {
    name: "David Mwangi",
    service: "TV Cabinet",
    location: "Kiambu",
    date: "Yesterday",
    status: "Site Visit",
  },
  {
    name: "Brian Otieno",
    service: "Gypsum Ceiling",
    location: "Thika",
    date: "Yesterday",
    status: "Quotation",
  },
];

function statusStyles(status: string) {
  switch (status) {
    case "New":
      return "bg-[#f1eadf] text-[#9b713c]";

    case "Contacted":
      return "bg-blue-50 text-blue-700";

    case "Site Visit":
      return "bg-purple-50 text-purple-700";

    case "Quotation":
      return "bg-orange-50 text-orange-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function AdminDashboard() {
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
            Welcome back. Here&apos;s what&apos;s happening at FINETEX.
          </p>
        </div>

        <Link
          href="/admin/leads"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b18a5a]"
        >
          <Plus size={17} />
          Add Lead
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#e5e0d7] bg-white p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1eadf] text-[#b18a5a]">
                  <Icon size={20} strokeWidth={1.7} />
                </div>

                <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  <TrendingUp size={13} />
                  {stat.change}
                </span>
              </div>

              <p className="mt-5 text-sm text-[#777]">
                {stat.title}
              </p>

              <p className="mt-1 text-3xl font-semibold text-[#171717]">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-[#999]">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main dashboard grid */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        {/* Pipeline */}
        <section className="rounded-2xl border border-[#e5e0d7] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#171717]">
                Sales Pipeline
              </h2>

              <p className="mt-1 text-sm text-[#888]">
                Track leads from first contact to project.
              </p>
            </div>

            <Link
              href="/admin/pipeline"
              className="hidden items-center gap-1 text-sm font-semibold text-[#171717] transition hover:text-[#b18a5a] sm:flex"
            >
              View pipeline
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-8 space-y-5">
            {pipeline.map((stage) => (
              <div key={stage.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#555]">
                    {stage.name}
                  </span>

                  <span className="text-sm font-semibold text-[#171717]">
                    {stage.count}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#eeeae3]">
                  <div
                    className={`h-full rounded-full ${stage.color}`}
                    style={{
                      width: `${Math.min(
                        (stage.count / 24) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/pipeline"
            className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-[#171717] transition hover:text-[#b18a5a] sm:hidden"
          >
            View pipeline
            <ArrowRight size={15} />
          </Link>
        </section>

        {/* Quick actions */}
        <section className="rounded-2xl border border-[#e5e0d7] bg-[#171717] p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d0a76a]">
            Quick Actions
          </p>

          <h2 className="mt-3 text-xl font-semibold">
            Manage FINETEX
          </h2>

          <div className="mt-6 space-y-3">
            <Link
              href="/admin/leads"
              className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm transition hover:bg-white/15"
            >
              <span>View leads</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/admin/customers"
              className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm transition hover:bg-white/15"
            >
              <span>Customers</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/admin/quotations"
              className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm transition hover:bg-white/15"
            >
              <span>Create quotation</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/admin/projects"
              className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm transition hover:bg-white/15"
            >
              <span>Manage projects</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>

      {/* Recent Leads */}
      <section className="mt-6 rounded-2xl border border-[#e5e0d7] bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-[#eeeae3] p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-[#171717]">
              Recent Leads
            </h2>

            <p className="mt-1 text-sm text-[#888]">
              Latest enquiries submitted to FINETEX.
            </p>
          </div>

          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#171717] transition hover:text-[#b18a5a]"
          >
            View all
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#eeeae3] text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#999]">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#999]">
                  Service
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#999]">
                  Location
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#999]">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#999]">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentLeads.map((lead) => (
                <tr
                  key={lead.name}
                  className="border-b border-[#f0ede7] last:border-0"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[#171717]">
                      {lead.name}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#666]">
                    {lead.service}
                  </td>

                  <td className="px-6 py-4 text-sm text-[#666]">
                    {lead.location}
                  </td>

                  <td className="px-6 py-4 text-sm text-[#888]">
                    {lead.date}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-[#eeeae3] md:hidden">
          {recentLeads.map((lead) => (
            <div key={lead.name} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#171717]">
                    {lead.name}
                  </p>

                  <p className="mt-1 text-sm text-[#666]">
                    {lead.service}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles(
                    lead.status
                  )}`}
                >
                  {lead.status}
                </span>
              </div>

              <div className="mt-3 flex gap-4 text-xs text-[#999]">
                <span>{lead.location}</span>
                <span>{lead.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom note */}
      <div className="mt-6 rounded-2xl border border-dashed border-[#d8d1c5] bg-white/60 p-5 text-center">
        <p className="text-sm text-[#888]">
          Admin system is currently running with demo data.
          <span className="font-medium text-[#666]">
            {" "}
            Database integration comes next.
          </span>
        </p>
      </div>
    </div>
  );
}