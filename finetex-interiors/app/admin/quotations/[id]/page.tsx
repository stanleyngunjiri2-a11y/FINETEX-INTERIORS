"use client";

import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Loader2,
  MessageCircle,
  Pencil,
  User,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  email: string | null;
  location: string | null;
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
  updated_at: string;
};

type QuotationItem = {
  id: number;
  quotation_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  created_at: string;
};

const quotationStatuses: QuotationStatus[] = [
  "Draft",
  "Sent",
  "Accepted",
  "Rejected",
  "Expired",
];

const statusStyles: Record<QuotationStatus, string> = {
  Draft: "bg-gray-100 text-gray-700",
  Sent: "bg-blue-50 text-blue-700",
  Accepted: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
  Expired: "bg-orange-50 text-orange-700",
};

export default function QuotationDetailsPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const rawId = params.id;
  const quotationId = Number(
    Array.isArray(rawId) ? rawId[0] : rawId
  );

  const [quotation, setQuotation] =
    useState<Quotation | null>(null);
  const [customer, setCustomer] =
    useState<Customer | null>(null);
  const [items, setItems] = useState<QuotationItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] =
    useState(false);
  const [error, setError] = useState("");

  const [showEditModal, setShowEditModal] =
    useState(false);
  const [saving, setSaving] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] =
    useState("");
  const [editValidUntil, setEditValidUntil] =
    useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    if (!Number.isFinite(quotationId) || quotationId <= 0) {
      setError("Invalid quotation ID.");
      setLoading(false);
      return;
    }

    fetchQuotation();
  }, [quotationId]);

  async function fetchQuotation() {
    setLoading(true);
    setError("");

    const { data: quotationData, error: quotationError } =
      await supabase
        .from("quotations")
        .select(
          `
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
            updated_at
          `
        )
        .eq("id", quotationId)
        .single();

    if (quotationError || !quotationData) {
      setError(
        `Failed to load quotation: ${
          quotationError?.message ?? "Quotation not found."
        }`
      );
      setLoading(false);
      return;
    }

    const [
      customerResult,
      itemsResult,
    ] = await Promise.all([
      supabase
        .from("customers")
        .select(
          "id, full_name, phone, email, location"
        )
        .eq("id", quotationData.customer_id)
        .single(),

      supabase
        .from("quotation_items")
        .select(
          "id, quotation_id, description, quantity, unit_price, created_at"
        )
        .eq("quotation_id", quotationId)
        .order("created_at", { ascending: true }),
    ]);

    if (customerResult.error) {
      setError(
        `Failed to load customer: ${customerResult.error.message}`
      );
      setLoading(false);
      return;
    }

    if (itemsResult.error) {
      setError(
        `Failed to load quotation items: ${itemsResult.error.message}`
      );
      setLoading(false);
      return;
    }

    setQuotation({
      ...quotationData,
      amount: Number(quotationData.amount),
    } as Quotation);

    setCustomer(
      (customerResult.data ?? null) as Customer | null
    );

    setItems(
      (itemsResult.data ?? []).map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
      })) as QuotationItem[]
    );

    setLoading(false);
  }

  const calculatedItemsTotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.quantity * item.unit_price,
      0
    );
  }, [items]);

  function formatCurrency(amount: number) {
    return `KES ${amount.toLocaleString("en-KE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }

  function formatDate(date: string | null) {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function openWhatsApp() {
    if (!customer?.phone) {
      setError(
        "This customer does not have a phone number."
      );
      return;
    }

    const phone = customer.phone.replace(/\D/g, "");

    const message = `Hello ${customer.full_name}, this is FINETEX INTERIORS. We are following up regarding quotation ${quotation?.quotation_number}.`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  }

  async function updateStatus(
    newStatus: QuotationStatus
  ) {
    if (!quotation) return;

    setUpdatingStatus(true);
    setError("");

    const { error: updateError } = await supabase
      .from("quotations")
      .update({
        status: newStatus,
      })
      .eq("id", quotation.id);

    if (updateError) {
      setError(
        `Failed to update status: ${updateError.message}`
      );
      setUpdatingStatus(false);
      return;
    }

    setQuotation({
      ...quotation,
      status: newStatus,
    });

    setUpdatingStatus(false);
  }

  function openEditModal() {
    if (!quotation) return;

    setEditTitle(quotation.title);
    setEditDescription(
      quotation.description ?? ""
    );
    setEditValidUntil(
      quotation.valid_until ?? ""
    );
    setEditNotes(quotation.notes ?? "");
    setShowEditModal(true);
  }

  function closeEditModal() {
    if (saving) return;

    setShowEditModal(false);
  }

  async function saveQuotation() {
    if (!quotation) return;

    setError("");

    if (!editTitle.trim()) {
      setError("Please enter a quotation title.");
      return;
    }

    setSaving(true);

    const { data, error: updateError } =
      await supabase
        .from("quotations")
        .update({
          title: editTitle.trim(),
          description:
            editDescription.trim() || null,
          valid_until:
            editValidUntil || null,
          notes: editNotes.trim() || null,
        })
        .eq("id", quotation.id)
        .select(
          `
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
            updated_at
          `
        )
        .single();

    if (updateError || !data) {
      setError(
        `Failed to update quotation: ${
          updateError?.message ?? "Unknown error"
        }`
      );
      setSaving(false);
      return;
    }

    setQuotation({
      ...data,
      amount: Number(data.amount),
    } as Quotation);

    setSaving(false);
    setShowEditModal(false);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#e7e2d9] bg-white px-6 py-20 text-center">
        <Loader2
          size={28}
          className="mx-auto animate-spin text-[#b18a5a]"
        />

        <p className="mt-4 text-sm font-medium text-[#555]">
          Loading quotation...
        </p>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => router.push("/admin/quotations")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#555] hover:text-[#171717]"
        >
          <ArrowLeft size={17} />
          Back to Quotations
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-700">
          {error || "Quotation not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.push("/admin/quotations")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#666] transition hover:text-[#171717]"
          >
            <ArrowLeft size={17} />
            Back to Quotations
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
            Quotation Details
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-[#171717]">
              {quotation.quotation_number}
            </h1>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[quotation.status]}`}
            >
              {quotation.status}
            </span>
          </div>

          <p className="mt-2 text-sm text-[#777]">
            {quotation.title}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openWhatsApp}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <MessageCircle size={17} />
            WhatsApp Customer
          </button>

          <button
            type="button"
            onClick={openEditModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
          >
            <Pencil size={17} />
            Edit Quotation
          </button>
        </div>
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#e7e2d9] bg-white p-5">
          <p className="text-xs font-medium text-[#999]">
            Quotation Total
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#171717]">
            {formatCurrency(quotation.amount)}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e7e2d9] bg-white p-5">
          <p className="text-xs font-medium text-[#999]">
            Created
          </p>

          <p className="mt-2 text-sm font-semibold text-[#333]">
            {formatDate(quotation.created_at)}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e7e2d9] bg-white p-5">
          <p className="text-xs font-medium text-[#999]">
            Valid Until
          </p>

          <p className="mt-2 text-sm font-semibold text-[#333]">
            {formatDate(quotation.valid_until)}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e7e2d9] bg-white p-5">
          <p className="text-xs font-medium text-[#999]">
            Line Items
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#171717]">
            {items.length}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Main quotation */}
        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-[#e7e2d9] bg-white">
            <div className="border-b border-[#e7e2d9] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1eadf] text-[#b18a5a]">
                  <FileText size={19} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-[#171717]">
                    Quotation Breakdown
                  </h2>

                  <p className="mt-1 text-xs text-[#999]">
                    Work and materials included in this quotation.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-[#eeeae3] bg-[#faf9f6] text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                      Description
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#999]">
                      Qty
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#999]">
                      Unit Price
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#999]">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#eeeae3] last:border-0"
                    >
                      <td className="px-6 py-5 text-sm font-medium text-[#333]">
                        {item.description}
                      </td>

                      <td className="px-6 py-5 text-right text-sm text-[#555]">
                        {item.quantity}
                      </td>

                      <td className="px-6 py-5 text-right text-sm text-[#555]">
                        {formatCurrency(item.unit_price)}
                      </td>

                      <td className="px-6 py-5 text-right text-sm font-semibold text-[#333]">
                        {formatCurrency(
                          item.quantity * item.unit_price
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {items.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-[#999]">
                No quotation items found.
              </div>
            )}

            <div className="border-t border-[#e7e2d9] bg-[#faf9f6] px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-[#555]">
                  Calculated Items Total
                </span>

                <span className="text-lg font-semibold text-[#171717]">
                  {formatCurrency(calculatedItemsTotal)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4 border-t border-[#e7e2d9] pt-3">
                <span className="text-sm font-semibold text-[#333]">
                  Quotation Amount
                </span>

                <span className="text-xl font-bold text-[#b18a5a]">
                  {formatCurrency(quotation.amount)}
                </span>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="rounded-2xl border border-[#e7e2d9] bg-white p-6">
            <h2 className="text-base font-semibold text-[#171717]">
              Description
            </h2>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#666]">
              {quotation.description ||
                "No description provided."}
            </p>
          </section>

          {/* Notes */}
          <section className="rounded-2xl border border-[#e7e2d9] bg-white p-6">
            <h2 className="text-base font-semibold text-[#171717]">
              Notes
            </h2>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#666]">
              {quotation.notes || "No notes provided."}
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <section className="rounded-2xl border border-[#e7e2d9] bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1eadf] text-[#b18a5a]">
                <User size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Customer
                </p>

                <h2 className="mt-1 text-base font-semibold text-[#171717]">
                  {customer?.full_name ??
                    "Unknown customer"}
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-medium text-[#aaa]">
                  Phone
                </p>

                <p className="mt-1 text-sm text-[#444]">
                  {customer?.phone ||
                    "No phone number"}
                </p>
              </div>

              {customer?.email && (
                <div>
                  <p className="text-xs font-medium text-[#aaa]">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm text-[#444]">
                    {customer.email}
                  </p>
                </div>
              )}

              {customer?.location && (
                <div>
                  <p className="text-xs font-medium text-[#aaa]">
                    Location
                  </p>

                  <p className="mt-1 text-sm text-[#444]">
                    {customer.location}
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/admin/customers/${customer?.id}`
                )
              }
              disabled={!customer}
              className="mt-6 w-full rounded-xl border border-[#ddd5c9] bg-white px-4 py-3 text-sm font-semibold text-[#555] transition hover:bg-[#f5f2ec] hover:text-[#171717] disabled:cursor-not-allowed disabled:opacity-50"
            >
              View Customer
            </button>
          </section>

          {/* Status */}
          <section className="rounded-2xl border border-[#e7e2d9] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">
              Quotation Status
            </p>

            <select
              value={quotation.status}
              disabled={updatingStatus}
              onChange={(event) =>
                updateStatus(
                  event.target.value as QuotationStatus
                )
              }
              className={`mt-3 w-full rounded-xl border-0 px-4 py-3 text-sm font-semibold outline-none ${statusStyles[quotation.status]}`}
            >
              {quotationStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {updatingStatus && (
              <div className="mt-3 flex items-center gap-2 text-xs text-[#999]">
                <Loader2
                  size={14}
                  className="animate-spin"
                />
                Updating status...
              </div>
            )}
          </section>

          {/* Dates */}
          <section className="rounded-2xl border border-[#e7e2d9] bg-white p-6">
            <div className="flex items-center gap-3">
              <CalendarDays
                size={19}
                className="text-[#b18a5a]"
              />

              <h2 className="text-base font-semibold text-[#171717]">
                Dates
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium text-[#aaa]">
                  Created
                </p>

                <p className="mt-1 text-sm text-[#444]">
                  {formatDate(quotation.created_at)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-[#aaa]">
                  Valid Until
                </p>

                <p className="mt-1 text-sm text-[#444]">
                  {formatDate(quotation.valid_until)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-[#aaa]">
                  Last Updated
                </p>

                <p className="mt-1 text-sm text-[#444]">
                  {formatDate(quotation.updated_at)}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e7e2d9] px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b18a5a]">
                  Edit Record
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#171717]">
                  Edit Quotation
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-lg p-2 text-[#777] hover:bg-[#f5f2ec] hover:text-[#171717] disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6">
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-[#333]">
                    Quotation Title
                  </label>

                  <input
                    type="text"
                    value={editTitle}
                    onChange={(event) =>
                      setEditTitle(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-[#b18a5a]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#333]">
                    Description
                  </label>

                  <textarea
                    value={editDescription}
                    onChange={(event) =>
                      setEditDescription(
                        event.target.value
                      )
                    }
                    rows={4}
                    className="mt-2 w-full resize-none rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-[#b18a5a]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#333]">
                    Valid Until
                  </label>

                  <input
                    type="date"
                    value={editValidUntil}
                    onChange={(event) =>
                      setEditValidUntil(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-[#b18a5a]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#333]">
                    Notes
                  </label>

                  <textarea
                    value={editNotes}
                    onChange={(event) =>
                      setEditNotes(event.target.value)
                    }
                    rows={4}
                    placeholder="Optional internal notes..."
                    className="mt-2 w-full resize-none rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none placeholder:text-[#aaa] focus:border-[#b18a5a]"
                  />
                </div>

                <div className="rounded-xl bg-[#faf9f6] p-4">
                  <p className="text-xs font-medium text-[#999]">
                    Quotation Amount
                  </p>

                  <p className="mt-1 text-lg font-semibold text-[#171717]">
                    {formatCurrency(quotation.amount)}
                  </p>

                  <p className="mt-1 text-xs text-[#999]">
                    The amount is calculated from the quotation
                    items.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#e7e2d9] bg-[#faf9f6] px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-xl border border-[#ddd5c9] bg-white px-5 py-3 text-sm font-semibold text-[#555] hover:bg-[#f5f2ec] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveQuotation}
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
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

