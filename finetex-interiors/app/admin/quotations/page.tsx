
"use client";

import {
  ArrowUpRight,
  CalendarDays,
  FileText,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type QuotationStatus =
  | "Draft"
  | "Sent"
  | "Accepted"
  | "Rejected"
  | "Expired";

type Customer = {
  id: number;
  full_name: string;
  phone: string;
};

type QuotationItem = {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number;
};

type Quotation = {
  id: number;
  quotation_number: string;
  customer_id: number;
  title: string;
  description: string | null;
  amount: number;
  status: QuotationStatus;
  valid_until: string | null;
  notes: string | null;
  created_at: string;
  customer: Customer | null;
};

type FormItem = {
  description: string;
  quantity: string;
  unit_price: string;
};

const quotationStatuses: QuotationStatus[] = [
  "Draft",
  "Sent",
  "Accepted",
  "Rejected",
  "Expired",
];

const statusStyles: Record<QuotationStatus, string> = {
  Draft: "bg-gray-100 text-gray-600",
  Sent: "bg-blue-50 text-blue-700",
  Accepted: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
  Expired: "bg-orange-50 text-orange-700",
};

export default function QuotationsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    QuotationStatus | "All"
  >("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<FormItem[]>([
    {
      description: "",
      quantity: "1",
      unit_price: "",
    },
  ]);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError("");

    const [quotationsResult, customersResult] = await Promise.all([
      supabase
        .from("quotations")
        .select(`
          id,
          quotation_number,
          customer_id,
          title,
          description,
          amount,
          status,
          valid_until,
          notes,
          created_at,
          customer:customers (
            id,
            full_name,
            phone
          )
        `)
        .order("created_at", { ascending: false }),

      supabase
        .from("customers")
        .select("id, full_name, phone")
        .order("full_name", { ascending: true }),
    ]);

    if (quotationsResult.error) {
      setError(
        `Failed to load quotations: ${quotationsResult.error.message}`
      );
      setLoading(false);
      return;
    }

    if (customersResult.error) {
      setError(
        `Failed to load customers: ${customersResult.error.message}`
      );
      setLoading(false);
      return;
    }

    const formattedQuotations = (quotationsResult.data ?? []).map(
      (quotation) => ({
        ...quotation,
        amount: Number(quotation.amount),
        customer: Array.isArray(quotation.customer)
          ? quotation.customer[0] ?? null
          : quotation.customer,
      })
    ) as Quotation[];

    setQuotations(formattedQuotations);
    setCustomers((customersResult.data ?? []) as Customer[]);
    setLoading(false);
  }

  const filteredQuotations = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return quotations.filter((quotation) => {
      const matchesSearch =
        quotation.quotation_number
          .toLowerCase()
          .includes(searchTerm) ||
        quotation.title.toLowerCase().includes(searchTerm) ||
        quotation.customer?.full_name
          .toLowerCase()
          .includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" ||
        quotation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotations, search, statusFilter]);

  const acceptedCount = quotations.filter(
    (quotation) => quotation.status === "Accepted"
  ).length;

  const pendingCount = quotations.filter(
    (quotation) =>
      quotation.status === "Draft" ||
      quotation.status === "Sent"
  ).length;

  const acceptedValue = quotations
    .filter((quotation) => quotation.status === "Accepted")
    .reduce((total, quotation) => total + quotation.amount, 0);

  const formTotal = items.reduce((total, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unit_price) || 0;

    return total + quantity * unitPrice;
  }, 0);

  function resetForm() {
    setTitle("");
    setDescription("");
    setCustomerId("");
    setValidUntil("");
    setNotes("");
    setItems([
      {
        description: "",
        quantity: "1",
        unit_price: "",
      },
    ]);
    setError("");
  }

  function openNewQuotation() {
    resetForm();
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    resetForm();
  }

  function viewQuotation(quotationId: number) {
    if (!quotationId) {
      console.error("Invalid quotation ID:", quotationId);
      return;
    }

    router.push(`/admin/quotations/${quotationId}`);
  }

  function updateItem(
    index: number,
    field: keyof FormItem,
    value: string
  ) {
    setItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((currentItems) => [
      ...currentItems,
      {
        description: "",
        quantity: "1",
        unit_price: "",
      },
    ]);
  }

  function removeItem(index: number) {
    if (items.length === 1) return;

    setItems((currentItems) =>
      currentItems.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  }

  function generateQuotationNumber() {
    const year = new Date().getFullYear();

    const highestNumber = quotations.reduce((highest, quotation) => {
      const match = quotation.quotation_number.match(
        /QT-(\d+)/
      );

      if (!match) return highest;

      return Math.max(highest, Number(match[1]));
    }, 0);

    return `QT-${String(highestNumber + 1).padStart(3, "0")}-${year}`;
  }

  async function createQuotation() {
    setError("");

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a quotation title.");
      return;
    }

    const validItems = items.filter(
      (item) =>
        item.description.trim() &&
        Number(item.quantity) > 0 &&
        Number(item.unit_price) >= 0
    );

    if (validItems.length === 0) {
      setError("Please add at least one valid quotation item.");
      return;
    }

    const calculatedAmount = validItems.reduce(
      (total, item) =>
        total +
        Number(item.quantity) * Number(item.unit_price),
      0
    );

    setSaving(true);

    const quotationNumber = generateQuotationNumber();

    const { data: quotation, error: quotationError } =
      await supabase
        .from("quotations")
        .insert({
          quotation_number: quotationNumber,
          customer_id: Number(customerId),
          title: title.trim(),
          description: description.trim() || null,
          amount: calculatedAmount,
          status: "Draft",
          valid_until: validUntil || null,
          notes: notes.trim() || null,
        })
        .select(`
          id,
          quotation_number,
          customer_id,
          title,
          description,
          amount,
          status,
          valid_until,
          notes,
          created_at,
          customer:customers (
            id,
            full_name,
            phone
          )
        `)
        .single();

    if (quotationError || !quotation) {
      setError(
        `Failed to create quotation: ${
          quotationError?.message ?? "Unknown error"
        }`
      );
      setSaving(false);
      return;
    }

    const quotationItems = validItems.map((item) => ({
      quotation_id: quotation.id,
      description: item.description.trim(),
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
    }));

    const { error: itemsError } = await supabase
      .from("quotation_items")
      .insert(quotationItems);

    if (itemsError) {
      await supabase
        .from("quotations")
        .delete()
        .eq("id", quotation.id);

      setError(
        `Quotation items could not be saved: ${itemsError.message}`
      );
      setSaving(false);
      return;
    }

    const formattedQuotation = {
      ...quotation,
      amount: Number(quotation.amount),
      customer: Array.isArray(quotation.customer)
        ? quotation.customer[0] ?? null
        : quotation.customer,
    } as Quotation;

    setQuotations((current) => [
      formattedQuotation,
      ...current,
    ]);

    setSaving(false);
    setShowModal(false);
    resetForm();
  }

  async function updateQuotationStatus(
    quotationId: number,
    newStatus: QuotationStatus
  ) {
    setUpdatingId(quotationId);

    const { error: updateError } = await supabase
      .from("quotations")
      .update({
        status: newStatus,
      })
      .eq("id", quotationId);

    if (updateError) {
      setError(
        `Failed to update quotation status: ${updateError.message}`
      );
      setUpdatingId(null);
      return;
    }

    setQuotations((current) =>
      current.map((quotation) =>
        quotation.id === quotationId
          ? {
              ...quotation,
              status: newStatus,
            }
          : quotation
      )
    );

    setUpdatingId(null);
  }

  async function deleteQuotation(quotation: Quotation) {
    const confirmed = window.confirm(
      `Delete ${quotation.quotation_number}? This will also delete its quotation items.`
    );

    if (!confirmed) return;

    setDeletingId(quotation.id);
    setError("");

    const { error: deleteError } = await supabase
      .from("quotations")
      .delete()
      .eq("id", quotation.id);

    if (deleteError) {
      setError(
        `Failed to delete quotation: ${deleteError.message}`
      );
      setDeletingId(null);
      return;
    }

    setQuotations((current) =>
      current.filter(
        (item) => item.id !== quotation.id
      )
    );

    setDeletingId(null);
  }

  function openWhatsApp(customer: Customer | null) {
    if (!customer?.phone) {
      setError("This customer does not have a phone number.");
      return;
    }

    const phone = customer.phone.replace(/\D/g, "");

    const message = `Hello ${customer.full_name}, this is FINETEX INTERIORS. We are following up regarding your quotation.`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  function formatCurrency(amount: number) {
    return `KES ${amount.toLocaleString("en-KE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

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
            Create, track and manage project quotations for
            FINETEX INTERIORS customers.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewQuotation}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
        >
          <Plus size={17} />
          New Quotation
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 text-red-500 hover:text-red-700"
          >
            <X size={17} />
          </button>
        </div>
      )}

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
          label="Accepted"
          value={String(acceptedCount)}
          description="Accepted quotations"
        />

        <SummaryCard
          label="Accepted Value"
          value={formatCurrency(acceptedValue)}
          description="Accepted projects"
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search quotation number, customer or title..."
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

            {quotationStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border border-[#e7e2d9] bg-white px-6 py-16 text-center">
          <Loader2
            size={24}
            className="mx-auto animate-spin text-[#b18a5a]"
          />

          <p className="mt-4 text-sm font-medium text-[#555]">
            Loading quotations...
          </p>
        </div>
      ) : (
        <>
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
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b border-[#e7e2d9] bg-[#faf9f6] text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                      Quotation
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                      Title
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
                          {quotation.quotation_number}
                        </p>

                        <p className="mt-1 text-xs text-[#999]">
                          {quotation.valid_until
                            ? `Valid until ${formatDate(
                                quotation.valid_until
                              )}`
                            : "No expiry date"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-[#333]">
                          {quotation.customer?.full_name ??
                            "Unknown customer"}
                        </p>

                        <p className="mt-1 text-xs text-[#999]">
                          {quotation.customer?.phone ?? ""}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-[#555]">
                        {quotation.title}
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-[#333]">
                        {formatCurrency(quotation.amount)}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-xs text-[#888]">
                          <CalendarDays size={14} />
                          {formatDate(quotation.created_at)}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <select
                          value={quotation.status}
                          disabled={
                            updatingId === quotation.id
                          }
                          onChange={(event) =>
                            updateQuotationStatus(
                              quotation.id,
                              event.target
                                .value as QuotationStatus
                            )
                          }
                          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${statusStyles[quotation.status]}`}
                        >
                          {quotationStatuses.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openWhatsApp(
                                quotation.customer
                              )
                            }
                            className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                            title="Contact customer on WhatsApp"
                            aria-label={`WhatsApp ${quotation.customer?.full_name ?? "customer"}`}
                          >
                            <MessageCircle size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              viewQuotation(quotation.id)
                            }
                            className="rounded-lg bg-[#171717] p-2 text-white transition hover:bg-[#b18a5a] focus:outline-none focus:ring-2 focus:ring-[#b18a5a] focus:ring-offset-2"
                            title="View quotation"
                            aria-label={`View ${quotation.quotation_number}`}
                          >
                            <ArrowUpRight size={17} />
                          </button>

                          <button
                            type="button"
                            disabled={
                              deletingId === quotation.id
                            }
                            onClick={() =>
                              deleteQuotation(quotation)
                            }
                            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                            title="Delete quotation"
                            aria-label={`Delete ${quotation.quotation_number}`}
                          >
                            {deletingId ===
                            quotation.id ? (
                              <Loader2
                                size={17}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredQuotations.length === 0 && (
              <EmptyState />
            )}
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
                      {quotation.quotation_number}
                    </p>

                    <p className="mt-1 text-xs text-[#999]">
                      {quotation.customer?.full_name ??
                        "Unknown customer"}
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
                      Title
                    </p>

                    <p className="mt-1 text-sm text-[#444]">
                      {quotation.title}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                        Amount
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#333]">
                        {formatCurrency(
                          quotation.amount
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                        Date
                      </p>

                      <p className="mt-1 flex items-center justify-end gap-1.5 text-xs text-[#666]">
                        <CalendarDays size={13} />
                        {formatDate(
                          quotation.created_at
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                      Valid Until
                    </p>

                    <p className="mt-1 text-sm text-[#555]">
                      {quotation.valid_until
                        ? formatDate(
                            quotation.valid_until
                          )
                        : "No expiry date"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      viewQuotation(quotation.id)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[#b18a5a] focus:outline-none focus:ring-2 focus:ring-[#b18a5a]"
                  >
                    <ArrowUpRight size={17} />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openWhatsApp(
                        quotation.customer
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-3 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                  >
                    <MessageCircle size={17} />
                    WhatsApp
                  </button>

                  <button
                    type="button"
                    disabled={
                      deletingId === quotation.id
                    }
                    onClick={() =>
                      deleteQuotation(quotation)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                  >
                    {deletingId === quotation.id ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={17} />
                    )}
                    Delete
                  </button>
                </div>

                <div className="mt-3">
                  <select
                    value={quotation.status}
                    disabled={
                      updatingId === quotation.id
                    }
                    onChange={(event) =>
                      updateQuotationStatus(
                        quotation.id,
                        event.target
                          .value as QuotationStatus
                      )
                    }
                    className={`w-full rounded-xl border-0 px-4 py-3 text-sm font-semibold outline-none ${statusStyles[quotation.status]}`}
                  >
                    {quotationStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}

            {filteredQuotations.length === 0 && (
              <EmptyState />
            )}
          </div>
        </>
      )}

      {/* New Quotation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e7e2d9] px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b18a5a]">
                  New Record
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#171717]">
                  Create Quotation
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-[#777] hover:bg-[#f5f2ec] hover:text-[#171717] disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {/* Customer */}
                <div>
                  <label className="text-sm font-semibold text-[#333]">
                    Customer
                  </label>

                  <select
                    value={customerId}
                    onChange={(event) =>
                      setCustomerId(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-[#b18a5a]"
                  >
                    <option value="">
                      Select a customer
                    </option>

                    {customers.map((customer) => (
                      <option
                        key={customer.id}
                        value={customer.id}
                      >
                        {customer.full_name} —{" "}
                        {customer.phone}
                      </option>
                    ))}
                  </select>

                  {customers.length === 0 && (
                    <p className="mt-2 text-xs text-[#999]">
                      No customers exist yet. Create a
                      customer first from the Customers
                      page.
                    </p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm font-semibold text-[#333]">
                    Quotation Title
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(event) =>
                      setTitle(event.target.value)
                    }
                    placeholder="e.g. Kitchen Renovation"
                    className="mt-2 w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none placeholder:text-[#aaa] focus:border-[#b18a5a]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-semibold text-[#333]">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    rows={3}
                    placeholder="Brief description of the proposed work..."
                    className="mt-2 w-full resize-none rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none placeholder:text-[#aaa] focus:border-[#b18a5a]"
                  />
                </div>

                {/* Items */}
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <label className="text-sm font-semibold text-[#333]">
                        Quotation Items
                      </label>

                      <p className="mt-1 text-xs text-[#999]">
                        Add the work or materials included
                        in this quotation.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addItem}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#f1eadf] px-3 py-2 text-xs font-semibold text-[#8b6a42] hover:bg-[#e9dfcf]"
                    >
                      <Plus size={14} />
                      Add Item
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-[#e7e2d9] bg-[#faf9f6] p-4"
                      >
                        <div className="grid gap-3 md:grid-cols-[1fr_100px_140px_auto] md:items-end">
                          <div>
                            <label className="text-xs font-medium text-[#777]">
                              Description
                            </label>

                            <input
                              type="text"
                              value={item.description}
                              onChange={(event) =>
                                updateItem(
                                  index,
                                  "description",
                                  event.target.value
                                )
                              }
                              placeholder="e.g. Kitchen cabinets"
                              className="mt-1.5 w-full rounded-lg border border-[#e2ddd4] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b18a5a]"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-[#777]">
                              Qty
                            </label>

                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={item.quantity}
                              onChange={(event) =>
                                updateItem(
                                  index,
                                  "quantity",
                                  event.target.value
                                )
                              }
                              className="mt-1.5 w-full rounded-lg border border-[#e2ddd4] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b18a5a]"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-[#777]">
                              Unit Price
                            </label>

                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unit_price}
                              onChange={(event) =>
                                updateItem(
                                  index,
                                  "unit_price",
                                  event.target.value
                                )
                              }
                              placeholder="KES"
                              className="mt-1.5 w-full rounded-lg border border-[#e2ddd4] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b18a5a]"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(index)
                            }
                            disabled={items.length === 1}
                            className="flex h-10 items-center justify-center rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                            title="Remove item"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

                        <div className="mt-3 text-right text-xs text-[#777]">
                          Item total:{" "}
                          <span className="font-semibold text-[#333]">
                            {formatCurrency(
                              (Number(item.quantity) ||
                                0) *
                                (Number(item.unit_price) ||
                                  0)
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-[#171717] px-4 py-4 text-white">
                    <span className="text-sm font-medium">
                      Quotation Total
                    </span>

                    <span className="text-lg font-semibold">
                      {formatCurrency(formTotal)}
                    </span>
                  </div>
                </div>

                {/* Valid Until */}
                <div>
                  <label className="text-sm font-semibold text-[#333]">
                    Valid Until
                  </label>

                  <input
                    type="date"
                    value={validUntil}
                    onChange={(event) =>
                      setValidUntil(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-[#b18a5a]"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm font-semibold text-[#333]">
                    Notes
                  </label>

                  <textarea
                    value={notes}
                    onChange={(event) =>
                      setNotes(event.target.value)
                    }
                    rows={3}
                    placeholder="Optional internal notes..."
                    className="mt-2 w-full resize-none rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none placeholder:text-[#aaa] focus:border-[#b18a5a]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#e7e2d9] bg-[#faf9f6] px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-[#ddd5c9] bg-white px-5 py-3 text-sm font-semibold text-[#555] hover:bg-[#f5f2ec] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={createQuotation}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2b2b2b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {saving
                  ? "Creating..."
                  : "Create Quotation"}
              </button>
            </div>
          </div>
        </div>
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
        Create a quotation or change your search/filter.
      </p>
    </div>
  );
}
