"use client";

import {
  MessageCircle,
  Search,
  SlidersHorizontal,
  UserPlus,
  MapPin,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import { useMemo, useState } from "react";

type LeadStatus =
  | "New"
  | "Contacted"
  | "Site Visit"
  | "Quotation"
  | "Approved"
  | "Project";

type Lead = {
  id: number;
  name: string;
  phone: string;
  service: string;
  location: string;
  budget: string;
  status: LeadStatus;
  date: string;
};

const leads: Lead[] = [
  {
    id: 1,
    name: "Brian Mwangi",
    phone: "0712345678",
    service: "Kitchen Renovation",
    location: "Ruiru",
    budget: "KES 350,000",
    status: "New",
    date: "Today",
  },
  {
    id: 2,
    name: "Sarah Wanjiku",
    phone: "0723456789",
    service: "Wardrobes",
    location: "Kiambu",
    budget: "KES 180,000",
    status: "Contacted",
    date: "Today",
  },
  {
    id: 3,
    name: "David Kamau",
    phone: "0734567890",
    service: "TV Cabinet",
    location: "Thika",
    budget: "KES 95,000",
    status: "Site Visit",
    date: "Yesterday",
  },
  {
    id: 4,
    name: "Mercy Njeri",
    phone: "0745678901",
    service: "Gypsum Ceiling",
    location: "Nairobi",
    budget: "KES 220,000",
    status: "Quotation",
    date: "Yesterday",
  },
  {
    id: 5,
    name: "Kevin Otieno",
    phone: "0756789012",
    service: "Full Interior Renovation",
    location: "Nairobi",
    budget: "KES 850,000",
    status: "Approved",
    date: "2 days ago",
  },
  {
    id: 6,
    name: "Ann Chebet",
    phone: "0767890123",
    service: "Bathroom Renovation",
    location: "Limuru",
    budget: "KES 160,000",
    status: "Project",
    date: "3 days ago",
  },
];

const statusStyles: Record<LeadStatus, string> = {
  New: "bg-blue-50 text-blue-700",
  Contacted: "bg-purple-50 text-purple-700",
  "Site Visit": "bg-orange-50 text-orange-700",
  Quotation: "bg-yellow-50 text-yellow-700",
  Approved: "bg-green-50 text-green-700",
  Project: "bg-[#f1eadf] text-[#8b6a42]",
};

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">(
    "All"
  );

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search) ||
        lead.service.toLowerCase().includes(search.toLowerCase()) ||
        lead.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/^0/, "254");

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        "Hello, this is FINETEX INTERIORS. We are following up on your interior project enquiry."
      )}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
            Management
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">
            Leads
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777]">
            Manage enquiries from potential FINETEX INTERIORS customers and
            move them through your sales process.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
        >
          <UserPlus size={17} />
          Add Lead
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Total Leads"
          value={String(leads.length)}
          description="All enquiries"
        />

        <SummaryCard
          label="New"
          value={String(leads.filter((lead) => lead.status === "New").length)}
          description="Need attention"
        />

        <SummaryCard
          label="In Progress"
          value={String(
            leads.filter(
              (lead) =>
                lead.status === "Contacted" ||
                lead.status === "Site Visit" ||
                lead.status === "Quotation"
            ).length
          )}
          description="Active opportunities"
        />

        <SummaryCard
          label="Converted"
          value={String(
            leads.filter(
              (lead) =>
                lead.status === "Approved" || lead.status === "Project"
            ).length
          )}
          description="Won opportunities"
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#e7e2d9] bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search leads by name, phone, service or location..."
              className="w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#aaa] focus:border-[#b18a5a] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={17} className="text-[#888]" />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as LeadStatus | "All"
                )
              }
              className="rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm text-[#555] outline-none focus:border-[#b18a5a]"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Site Visit">Site Visit</option>
              <option value="Quotation">Quotation</option>
              <option value="Approved">Approved</option>
              <option value="Project">Project</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#e7e2d9] bg-white lg:block">
        <div className="border-b border-[#e7e2d9] px-6 py-5">
          <h2 className="text-base font-semibold text-[#171717]">
            All Leads
          </h2>

          <p className="mt-1 text-xs text-[#999]">
            {filteredLeads.length} lead
            {filteredLeads.length === 1 ? "" : "s"} found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-[#e7e2d9] bg-[#faf9f6] text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Service
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Location
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Budget
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Date
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-[#eeeae3] last:border-0 hover:bg-[#fcfbf9]"
                >
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-sm font-semibold text-[#171717]">
                        {lead.name}
                      </p>

                      <p className="mt-1 text-xs text-[#999]">
                        {lead.phone}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-[#555]">
                    {lead.service}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-[#555]">
                      <MapPin size={15} className="text-[#b18a5a]" />
                      {lead.location}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-[#333]">
                    {lead.budget}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[lead.status]}`}
                    >
                      {lead.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs text-[#888]">
                      <CalendarDays size={14} />
                      {lead.date}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openWhatsApp(lead.phone)}
                        className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                        title="Contact on WhatsApp"
                      >
                        <MessageCircle size={17} />
                      </button>

                      <button
                        type="button"
                        className="rounded-lg p-2 text-[#777] transition hover:bg-[#f5f2ec] hover:text-[#171717]"
                        title="View lead"
                      >
                        <ArrowUpRight size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <EmptyState />
        )}
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 lg:hidden">
        <div>
          <h2 className="text-base font-semibold text-[#171717]">
            All Leads
          </h2>

          <p className="mt-1 text-xs text-[#999]">
            {filteredLeads.length} lead
            {filteredLeads.length === 1 ? "" : "s"} found
          </p>
        </div>

        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="rounded-2xl border border-[#e7e2d9] bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-[#171717]">
                  {lead.name}
                </h3>

                <p className="mt-1 text-xs text-[#999]">
                  {lead.phone}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusStyles[lead.status]}`}
              >
                {lead.status}
              </span>
            </div>

            <div className="mt-5 space-y-3 border-t border-[#eeeae3] pt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                  Service
                </p>

                <p className="mt-1 text-sm text-[#444]">
                  {lead.service}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                    Location
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[#444]">
                    <MapPin size={14} className="text-[#b18a5a]" />
                    {lead.location}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                    Budget
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#333]">
                    {lead.budget}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                  Date
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-[#666]">
                  <CalendarDays size={14} />
                  {lead.date}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openWhatsApp(lead.phone)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
            >
              <MessageCircle size={17} />
              Contact on WhatsApp
            </button>
          </div>
        ))}

        {filteredLeads.length === 0 && <EmptyState />}
      </div>

      {/* Demo Notice */}
      <div className="rounded-2xl border border-dashed border-[#d8cbb9] bg-[#fbf8f2] p-5">
        <p className="text-sm font-semibold text-[#8b6a42]">
          Demo data
        </p>

        <p className="mt-1 text-sm leading-6 text-[#777]">
          These leads are currently sample records. In the next stage, we will
          connect this section to a real database so enquiries submitted
          through the FINETEX estimate form automatically appear here.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e7e2d9] bg-white p-5">
      <p className="text-xs font-medium text-[#999]">{label}</p>

      <p className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#aaa]">{description}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-12 text-center">
      <p className="text-sm font-medium text-[#555]">
        No leads found
      </p>

      <p className="mt-1 text-xs text-[#999]">
        Try changing your search or status filter.
      </p>
    </div>
  );
}
