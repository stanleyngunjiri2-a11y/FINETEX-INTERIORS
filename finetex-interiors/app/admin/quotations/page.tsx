"use client";

import {
  ArrowUpRight,
  CalendarDays,
  FileText,
  MessageCircle,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

type QuotationStatus =
  | "Draft"
  | "Sent"
  | "Approved"
  | "Rejected"
  | "Expired";

type Quotation = {
  id: string;
  customer: string;
  service: string;
  amount: string;
  date: string;
  validUntil: string;
  status: QuotationStatus;
};

const quotations: Quotation[] = [
  {
    id: "QT-001",
    customer: "Kevin Otieno",
    service: "Full Interior Renovation",
    amount: "KES 850,000",
    date: "Sep 5, 2026",
    validUntil: "Sep 20, 2026",
    status: "Approved",
  },
  {
    id: "QT-002",
    customer: "Mercy Njeri",
    service: "Gypsum Ceiling",
    amount: "KES 220,000",
    date: "Sep 4, 2026",
    validUntil: "Sep 18, 2026",
    status: "Sent",
  },
  {
    id: "QT-003",
    customer: "Brian Mwangi",
    service: "Kitchen Renovation",
    amount: "KES 350,000",
    date: "Sep 4, 2026",
    validUntil: "Sep 19, 2026",
    status: "Draft",
  },
  {
    id: "QT-004",
    customer: "James Kamau",
    service: "Kitchen Renovation",
    amount: "KES 320,000",
    date: "Aug 29, 2026",
    validUntil: "Sep 12, 2026",
    status: "Approved",
  },
  {
    id: "QT-005",
    customer: "Grace Njeri",
    service: "Gypsum Ceiling",
    amount: "KES 280,000",
    date: "Aug 27, 2026",
    validUntil: "Sep 10, 2026",
    status: "Sent",
  },
  {
    id: "QT-006",
    customer: "Mary Wanjiku",
    service: "Wardrobes",
    amount: "KES 210,000",
    date: "Aug 20, 2026",
    validUntil: "Sep 3, 2026",
    status: "Rejected",
  },
];

const statusStyles: Record<QuotationStatus, string> = {
  Draft: "bg-gray-100 text-gray-600",
  Sent: "bg-blue-50 text-blue-700",
  Approved: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
  Expired: "bg-orange-50 text-orange-700",
};

export default function QuotationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    QuotationStatus | "All"
  >("All");

  const filteredQuotations = useMemo(() => {
    return quotations.filter((quotation) => {
      const matchesSearch =
        quotation.id.toLowerCase().includes(search.toLowerCase()) ||
        quotation.customer
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        quotation.service
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        quotation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const approvedCount = quotations.filter(
    (quotation) => quotation.status === "Approved"
  ).length;

  const pendingCount = quotations.filter(
    (quotation) =>
      quotation.status === "Draft" ||
      quotation.status === "Sent"
  ).length;

  const approvedValue = quotations
    .filter((quotation) => quotation.status === "Approved")
    .reduce((total, quotation) => {
      const amount = Number(
        quotation.amount.replace(/[^0-9]/g, "")
      );

      return total + amount;
    }, 0);

  const openWhatsApp = (customer: string) => {
    const message = `Hello ${customer}, this is FINETEX INTERIORS. We are following up regarding your quotation.`;

    window.open(
      `https://wa.me/254768176570?text=${encodeURIComponent(message)}`,
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
            Quotations
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777]">
            Create, track and manage project quotations for FINETEX
            INTERIORS customers.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
        >
          <Plus size={17} />
          New Quotation
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Total Quotations"
          value={String(quotations.length)}
          description="All quotations"
        />

        <SummaryCard
          label="Pending"
          value={String(pendingCount)}
          description="Draft or sent"
        />

        <SummaryCard
          label="Approved"
          value={String(approvedCount)}
          description="Won quotations"
        />

        <SummaryCard
          label="Approved Value"
          value={`KES ${approvedValue.toLocaleString()}`}
          description="Approved projects"
        />
      </div>

      {/* Search + Filter */}
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
              placeholder="Search quotation number, customer or service..."
              className="w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#aaa] focus:border-[#b18a5a] focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | QuotationStatus
                  | "All"
              )
            }
            className="rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm text-[#555] outline-none focus:border-[#b18a5a]"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#e7e2d9] bg-white lg:block">
        <div className="border-b border-[#e7e2d9] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1eadf] text-[#b18a5a]">
              <FileText size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#171717]">
                Quotation Directory
              </h2>

              <p className="mt-1 text-xs text-[#999]">
                {filteredQuotations.length} quotation
                {filteredQuotations.length === 1
                  ? ""
                  : "s"}{" "}
                found
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-[#e7e2d9] bg-[#faf9f6] text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Quotation
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Service
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredQuotations.map((quotation) => (
                <tr
                  key={quotation.id}
                  className="border-b border-[#eeeae3] last:border-0 hover:bg-[#fcfbf9]"
                >
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-[#171717]">
                      {quotation.id}
                    </p>

                    <p className="mt-1 text-xs text-[#999]">
                      Valid until {quotation.validUntil}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-[#333]">
                      {quotation.customer}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-sm text-[#555]">
                    {quotation.service}
                  </td>

                  <td className="px-6 py-5 text-sm font-semibold text-[#333]">
                    {quotation.amount}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs text-[#888]">
                      <CalendarDays size={14} />
                      {quotation.date}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[quotation.status]}`}
                    >
                      {quotation.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openWhatsApp(quotation.customer)
                        }
                        className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                        title="Send via WhatsApp"
                      >
                        <MessageCircle size={17} />
                      </button>

                      <button
                        type="button"
                        className="rounded-lg p-2 text-[#777] transition hover:bg-[#f5f2ec] hover:text-[#171717]"
                        title="View quotation"
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

        {filteredQuotations.length === 0 && <EmptyState />}
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 lg:hidden">
        <div>
          <h2 className="text-base font-semibold text-[#171717]">
            Quotation Directory
          </h2>

          <p className="mt-1 text-xs text-[#999]">
            {filteredQuotations.length} quotation
            {filteredQuotations.length === 1
              ? ""
              : "s"}{" "}
            found
          </p>
        </div>

        {filteredQuotations.map((quotation) => (
          <div
            key={quotation.id}
            className="rounded-2xl border border-[#e7e2d9] bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#171717]">
                  {quotation.id}
                </p>

                <p className="mt-1 text-xs text-[#999]">
                  {quotation.customer}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusStyles[quotation.status]}`}
              >
                {quotation.status}
              </span>
            </div>

            <div className="mt-5 space-y-4 border-t border-[#eeeae3] pt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                  Service
                </p>

                <p className="mt-1 text-sm text-[#444]">
                  {quotation.service}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                    Amount
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#333]">
                    {quotation.amount}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                    Date
                  </p>

                  <p className="mt-1 flex items-center justify-end gap-1.5 text-xs text-[#666]">
                    <CalendarDays size={13} />
                    {quotation.date}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                  Valid Until
                </p>

                <p className="mt-1 text-sm text-[#555]">
                  {quotation.validUntil}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                openWhatsApp(quotation.customer)
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
            >
              <MessageCircle size={17} />
              Contact Customer
            </button>
          </div>
        ))}

        {filteredQuotations.length === 0 && <EmptyState />}
      </div>

      {/* Demo Notice */}
      <div className="rounded-2xl border border-dashed border-[#d8cbb9] bg-[#fbf8f2] p-5">
        <p className="text-sm font-semibold text-[#8b6a42]">
          Demo data
        </p>

        <p className="mt-1 text-sm leading-6 text-[#777]">
          These quotations are sample records for the admin
          interface. Later, FINETEX administrators will be able to
          create real quotations, generate quotation documents and
          send them directly to customers.
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
      <p className="text-xs font-medium text-[#999]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#aaa]">
        {description}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-12 text-center">
      <p className="text-sm font-medium text-[#555]">
        No quotations found
      </p>

      <p className="mt-1 text-xs text-[#999]">
        Try changing your search or status filter.
      </p>
    </div>
  );
}
