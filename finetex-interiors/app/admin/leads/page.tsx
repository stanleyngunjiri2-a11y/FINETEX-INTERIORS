"use client";

import {
  MessageCircle,
  Search,
  SlidersHorizontal,
  MapPin,
  CalendarDays,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Quotation Sent"
  | "Negotiation"
  | "Won"
  | "Lost";

type Lead = {
  id: number;
  customer_id: number | null;
  customer_name: string;
  phone: string;
  service: string;
  location: string;
  property_type: string;
  budget: string;
  description: string | null;
  preferred_contact: string;
  source: string;
  status: LeadStatus;
  created_at: string;
};

const statusOptions: Array<LeadStatus | "All"> = [
  "All",
  "New",
  "Contacted",
  "Qualified",
  "Quotation Sent",
  "Negotiation",
  "Won",
  "Lost",
];

const statusStyles: Record<LeadStatus, string> = {
  New: "bg-blue-50 text-blue-700",
  Contacted: "bg-purple-50 text-purple-700",
  Qualified: "bg-indigo-50 text-indigo-700",
  "Quotation Sent": "bg-yellow-50 text-yellow-700",
  Negotiation: "bg-orange-50 text-orange-700",
  Won: "bg-green-50 text-green-700",
  Lost: "bg-red-50 text-red-700",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">(
    "All"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingLeadId, setUpdatingLeadId] = useState<number | null>(null);
  const [convertingLeadId, setConvertingLeadId] = useState<number | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error: fetchError } = await supabase
      .from("leads")
      .select(
        `
          id,
          customer_id,
          customer_name,
          phone,
          service,
          location,
          property_type,
          budget,
          description,
          preferred_contact,
          source,
          status,
          created_at
        `
      )
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Leads fetch error:", fetchError);
      setError("Unable to load leads. Please try again.");
      setLeads([]);
      setLoading(false);
      return;
    }

    setLeads((data ?? []) as Lead[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateLeadStatus = async (
    leadId: number,
    newStatus: LeadStatus
  ) => {
    setUpdatingLeadId(leadId);
    setError("");

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("leads")
      .update({
        status: newStatus,
      })
      .eq("id", leadId);

    if (updateError) {
      console.error("Lead status update error:", updateError);
      setError("Unable to update the lead status. Please try again.");
      setUpdatingLeadId(null);
      return;
    }

    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId
          ? { ...lead, status: newStatus }
          : lead
      )
    );

    setUpdatingLeadId(null);
  };

  const convertLeadToCustomer = async (lead: Lead) => {
    if (lead.customer_id) {
      return;
    }

    const confirmed = window.confirm(
      `Convert ${lead.customer_name} into a customer?`
    );

    if (!confirmed) {
      return;
    }

    setConvertingLeadId(lead.id);
    setError("");

    const supabase = createClient();

    const cleanPhone = lead.phone.trim();

    // First check whether a customer with this phone already exists.
    const { data: existingCustomer, error: existingCustomerError } =
      await supabase
        .from("customers")
        .select("id")
        .eq("phone", cleanPhone)
        .maybeSingle();

    if (existingCustomerError) {
      console.error(
        "Existing customer lookup error:",
        existingCustomerError
      );

      setError(
        "Unable to check existing customers. Please try again."
      );

      setConvertingLeadId(null);
      return;
    }

    let customerId: number;

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      // Create a new customer from the lead information.
      const { data: newCustomer, error: customerInsertError } =
        await supabase
          .from("customers")
          .insert({
            full_name: lead.customer_name,
            phone: cleanPhone,
            location: lead.location,
            notes: `Converted from website lead. Service: ${lead.service}. Property: ${lead.property_type}. Budget: ${lead.budget}.`,
          })
          .select("id")
          .single();

      if (customerInsertError || !newCustomer) {
        console.error(
          "Customer creation error:",
          customerInsertError
        );

        setError(
          "Unable to create the customer. Please try again."
        );

        setConvertingLeadId(null);
        return;
      }

      customerId = newCustomer.id;
    }

    // Link the lead to the customer.
    const { error: leadUpdateError } = await supabase
      .from("leads")
      .update({
        customer_id: customerId,
      })
      .eq("id", lead.id);

    if (leadUpdateError) {
      console.error(
        "Lead customer link error:",
        leadUpdateError
      );

      setError(
        "Customer was found/created, but the lead could not be linked. Please try again."
      );

      setConvertingLeadId(null);
      return;
    }

    setLeads((currentLeads) =>
      currentLeads.map((currentLead) =>
        currentLead.id === lead.id
          ? {
              ...currentLead,
              customer_id: customerId,
            }
          : currentLead
      )
    );

    setConvertingLeadId(null);
  };

  const filteredLeads = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return leads.filter((lead) => {
      const matchesSearch =
        lead.customer_name.toLowerCase().includes(searchValue) ||
        lead.phone.toLowerCase().includes(searchValue) ||
        lead.service.toLowerCase().includes(searchValue) ||
        lead.location.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "").replace(/^0/, "254");

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        "Hello, this is FINETEX INTERIORS. We are following up on your interior project enquiry."
      )}`,
      "_blank"
    );
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatBudget = (budget: string) => {
    return budget.startsWith("KSh") || budget.startsWith("KES")
      ? budget
      : `KSh ${budget}`;
  };

  return (
    <div className="space-y-8">
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
          onClick={fetchLeads}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e2ddd4] bg-white px-5 py-3 text-sm font-semibold text-[#555] transition hover:border-[#b18a5a] hover:text-[#171717] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Total Leads"
          value={String(leads.length)}
          description="All enquiries"
        />

        <SummaryCard
          label="New"
          value={String(
            leads.filter((lead) => lead.status === "New").length
          )}
          description="Need attention"
        />

        <SummaryCard
          label="In Progress"
          value={String(
            leads.filter(
              (lead) =>
                lead.status === "Contacted" ||
                lead.status === "Qualified" ||
                lead.status === "Quotation Sent" ||
                lead.status === "Negotiation"
            ).length
          )}
          description="Active opportunities"
        />

        <SummaryCard
          label="Won"
          value={String(
            leads.filter((lead) => lead.status === "Won").length
          )}
          description="Converted opportunities"
        />
      </div>

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
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Statuses" : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-700">{error}</p>

          <button
            type="button"
            onClick={fetchLeads}
            className="mt-3 text-sm font-medium text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#e7e2d9] bg-white">
          <div className="flex items-center gap-3 text-sm text-[#777]">
            <Loader2 size={20} className="animate-spin text-[#b18a5a]" />
            Loading leads...
          </div>
        </div>
      ) : (
        <>
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
              <table className="w-full min-w-[1250px]">
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
                      Customer
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
                        <p className="text-sm font-semibold text-[#171717]">
                          {lead.customer_name}
                        </p>

                        <p className="mt-1 text-xs text-[#999]">
                          {lead.phone}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-[#555]">
                        {lead.service}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-[#555]">
                          <MapPin
                            size={15}
                            className="text-[#b18a5a]"
                          />
                          {lead.location}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-[#333]">
                        {formatBudget(lead.budget)}
                      </td>

                      <td className="px-6 py-5">
                        <StatusSelect
                          lead={lead}
                          updatingLeadId={updatingLeadId}
                          onChange={updateLeadStatus}
                        />
                      </td>

                      <td className="px-6 py-5">
                        {lead.customer_id ? (
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                            <CheckCircle2 size={14} />
                            Linked
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => convertLeadToCustomer(lead)}
                            disabled={convertingLeadId === lead.id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#b18a5a] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#9e794e] disabled:cursor-wait disabled:opacity-60"
                          >
                            {convertingLeadId === lead.id ? (
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                            ) : (
                              <UserPlus size={14} />
                            )}

                            {convertingLeadId === lead.id
                              ? "Converting..."
                              : "Convert"}
                          </button>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-xs text-[#888]">
                          <CalendarDays size={14} />
                          {formatDate(lead.created_at)}
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

            {filteredLeads.length === 0 && <EmptyState />}
          </div>

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
                      {lead.customer_name}
                    </h3>

                    <p className="mt-1 text-xs text-[#999]">
                      {lead.phone}
                    </p>
                  </div>

                  <StatusSelect
                    lead={lead}
                    updatingLeadId={updatingLeadId}
                    onChange={updateLeadStatus}
                    mobile
                  />
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

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                      Property
                    </p>

                    <p className="mt-1 text-sm text-[#444]">
                      {lead.property_type}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                        Location
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-sm text-[#444]">
                        <MapPin
                          size={14}
                          className="text-[#b18a5a]"
                        />
                        {lead.location}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                        Budget
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#333]">
                        {formatBudget(lead.budget)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                      Date
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 text-sm text-[#666]">
                      <CalendarDays size={14} />
                      {formatDate(lead.created_at)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {lead.customer_id ? (
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                      <CheckCircle2 size={17} />
                      Customer Linked
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => convertLeadToCustomer(lead)}
                      disabled={convertingLeadId === lead.id}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b18a5a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#9e794e] disabled:cursor-wait disabled:opacity-60"
                    >
                      {convertingLeadId === lead.id ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <UserPlus size={17} />
                      )}

                      {convertingLeadId === lead.id
                        ? "Converting..."
                        : "Convert to Customer"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => openWhatsApp(lead.phone)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                  >
                    <MessageCircle size={17} />
                    Contact on WhatsApp
                  </button>
                </div>
              </div>
            ))}

            {filteredLeads.length === 0 && <EmptyState />}
          </div>
        </>
      )}

      <div className="rounded-2xl border border-dashed border-[#d8cbb9] bg-[#fbf8f2] p-5">
        <p className="text-sm font-semibold text-[#8b6a42]">
          Live database
        </p>

        <p className="mt-1 text-sm leading-6 text-[#777]">
          These enquiries are loaded directly from the FINETEX INTERIORS
          database. New enquiries submitted through the website estimate form
          will appear here automatically.
        </p>
      </div>
    </div>
  );
}

function StatusSelect({
  lead,
  updatingLeadId,
  onChange,
  mobile = false,
}: {
  lead: Lead;
  updatingLeadId: number | null;
  onChange: (leadId: number, status: LeadStatus) => void;
  mobile?: boolean;
}) {
  const isUpdating = updatingLeadId === lead.id;

  return (
    <div className="relative">
      <select
        value={lead.status}
        disabled={isUpdating}
        onChange={(event) =>
          onChange(lead.id, event.target.value as LeadStatus)
        }
        className={`${mobile ? "max-w-[145px]" : ""} rounded-full border-0 px-3 py-1.5 pr-8 text-xs font-semibold outline-none ring-1 ring-inset ring-transparent transition focus:ring-[#b18a5a] disabled:cursor-wait disabled:opacity-60 ${statusStyles[lead.status]}`}
      >
        {statusOptions
          .filter(
            (status): status is LeadStatus => status !== "All"
          )
          .map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
      </select>

      {isUpdating && (
        <Loader2
          size={13}
          className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin"
        />
      )}
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