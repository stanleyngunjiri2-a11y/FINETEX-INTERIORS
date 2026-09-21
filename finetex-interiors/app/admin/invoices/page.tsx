
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  FileText,
  Loader2,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type InvoiceStatus = "Unpaid" | "Partially Paid" | "Paid";

type Customer = {
  id: number;
  full_name: string;
  phone: string | null;
  location: string | null;
};

type Project = {
  id: number;
  project_number: string;
  project_name: string;
  customer_id: number;
  budget: number;
  status: string;
};

type Quotation = {
  id: number;
  quotation_number: string;
  title: string;
  customer_id: number;
  amount: number;
  status: string;
};

type Invoice = {
  id: number;
  invoice_number: string;
  customer_id: number;
  project_id: number | null;
  quotation_id: number | null;
  title: string;
  description: string | null;
  amount: number;
  amount_paid: number;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customer?: Customer | null;
  project?: Project | null;
  quotation?: Quotation | null;
};

type InvoiceForm = {
  invoice_number: string;
  customer_id: string;
  project_id: string;
  quotation_id: string;
  title: string;
  description: string;
  amount: string;
  amount_paid: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  notes: string;
};

const emptyForm: InvoiceForm = {
  invoice_number: "",
  customer_id: "",
  project_id: "",
  quotation_id: "",
  title: "",
  description: "",
  amount: "",
  amount_paid: "0",
  status: "Unpaid",
  issue_date: new Date().toISOString().slice(0, 10),
  due_date: "",
  notes: "",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function statusClasses(status: InvoiceStatus) {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700";

    case "Partially Paid":
      return "bg-yellow-100 text-yellow-700";

    case "Unpaid":
    default:
      return "bg-red-100 text-red-700";
  }
}

function normalizePhone(phone: string | null) {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    return `254${cleaned.slice(1)}`;
  }

  return cleaned;
}

export default function InvoicesPage() {
  const supabase = createClient();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | InvoiceStatus>(
    "All"
  );

  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(
    null
  );

  const [form, setForm] = useState<InvoiceForm>(emptyForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [
        invoicesResult,
        customersResult,
        projectsResult,
        quotationsResult,
      ] = await Promise.all([
        supabase
          .from("invoices")
          .select(
            `
              id,
              invoice_number,
              customer_id,
              project_id,
              quotation_id,
              title,
              description,
              amount,
              amount_paid,
              status,
              issue_date,
              due_date,
              notes,
              created_at,
              updated_at
            `
          )
          .order("created_at", { ascending: false }),

        supabase
          .from("customers")
          .select("id, full_name, phone, location")
          .order("full_name", { ascending: true }),

        supabase
          .from("projects")
          .select(
            "id, project_number, project_name, customer_id, budget, status"
          )
          .order("created_at", { ascending: false }),

        supabase
          .from("quotations")
          .select(
            "id, quotation_number, title, customer_id, amount, status"
          )
          .order("created_at", { ascending: false }),
      ]);

      if (invoicesResult.error) {
        throw new Error(invoicesResult.error.message);
      }

      if (customersResult.error) {
        throw new Error(customersResult.error.message);
      }

      if (projectsResult.error) {
        throw new Error(projectsResult.error.message);
      }

      if (quotationsResult.error) {
        throw new Error(quotationsResult.error.message);
      }

      const customerData = (customersResult.data ?? []) as Customer[];
      const projectData = (projectsResult.data ?? []) as Project[];
      const quotationData = (quotationsResult.data ?? []) as Quotation[];
      const invoiceData = (invoicesResult.data ?? []) as Invoice[];

      const customerMap = new Map(
        customerData.map((customer) => [customer.id, customer])
      );

      const projectMap = new Map(
        projectData.map((project) => [project.id, project])
      );

      const quotationMap = new Map(
        quotationData.map((quotation) => [quotation.id, quotation])
      );

      const enrichedInvoices = invoiceData.map((invoice) => ({
        ...invoice,
        customer: customerMap.get(invoice.customer_id) ?? null,
        project: invoice.project_id
          ? projectMap.get(invoice.project_id) ?? null
          : null,
        quotation: invoice.quotation_id
          ? quotationMap.get(invoice.quotation_id) ?? null
          : null,
      }));

      setInvoices(enrichedInvoices);
      setCustomers(customerData);
      setProjects(projectData);
      setQuotations(quotationData);
    } catch (err) {
      console.error("Invoice loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load invoice data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredInvoices = useMemo(() => {
    const query = search.toLowerCase().trim();

    return invoices.filter((invoice) => {
      const matchesSearch =
        !query ||
        invoice.invoice_number.toLowerCase().includes(query) ||
        invoice.title.toLowerCase().includes(query) ||
        invoice.customer?.full_name.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  const summary = useMemo(() => {
    const total = invoices.reduce(
      (sum, invoice) => sum + Number(invoice.amount),
      0
    );

    const paid = invoices.reduce(
      (sum, invoice) => sum + Number(invoice.amount_paid),
      0
    );

    const outstanding = Math.max(total - paid, 0);

    const unpaid = invoices.filter(
      (invoice) => invoice.status === "Unpaid"
    ).length;

    const partiallyPaid = invoices.filter(
      (invoice) => invoice.status === "Partially Paid"
    ).length;

    const paidInvoices = invoices.filter(
      (invoice) => invoice.status === "Paid"
    ).length;

    return {
      count: invoices.length,
      total,
      paid,
      outstanding,
      unpaid,
      partiallyPaid,
      paidInvoices,
    };
  }, [invoices]);

  const selectedCustomerProjects = useMemo(() => {
    if (!form.customer_id) return [];

    return projects.filter(
      (project) => project.customer_id === Number(form.customer_id)
    );
  }, [projects, form.customer_id]);

  const selectedCustomerQuotations = useMemo(() => {
    if (!form.customer_id) return [];

    return quotations.filter(
      (quotation) => quotation.customer_id === Number(form.customer_id)
    );
  }, [quotations, form.customer_id]);

  function updateForm<K extends keyof InvoiceForm>(
    field: K,
    value: InvoiceForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateModal() {
    setEditingInvoice(null);

    setForm({
      ...emptyForm,
      invoice_number: `INV-${Date.now().toString().slice(-6)}`,
      issue_date: new Date().toISOString().slice(0, 10),
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  }

  function openEditModal(invoice: Invoice) {
    setEditingInvoice(invoice);

    setForm({
      invoice_number: invoice.invoice_number,
      customer_id: String(invoice.customer_id),
      project_id: invoice.project_id
        ? String(invoice.project_id)
        : "",
      quotation_id: invoice.quotation_id
        ? String(invoice.quotation_id)
        : "",
      title: invoice.title,
      description: invoice.description || "",
      amount: String(invoice.amount),
      amount_paid: String(invoice.amount_paid),
      status: invoice.status,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date || "",
      notes: invoice.notes || "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setEditingInvoice(null);
    setForm(emptyForm);
  }

  function handleCustomerChange(value: string) {
    setForm((current) => ({
      ...current,
      customer_id: value,
      project_id: "",
      quotation_id: "",
    }));
  }

  function handleAmountPaidChange(value: string) {
    const amount = Number(form.amount) || 0;
    const paid = Number(value) || 0;

    let status: InvoiceStatus = "Unpaid";

    if (paid >= amount && amount > 0) {
      status = "Paid";
    } else if (paid > 0) {
      status = "Partially Paid";
    }

    setForm((current) => ({
      ...current,
      amount_paid: value,
      status,
    }));
  }

  async function saveInvoice() {
    setError("");
    setSuccess("");

    const customerId = Number(form.customer_id);
    const amount = Number(form.amount);
    const amountPaid = Number(form.amount_paid) || 0;

    if (!form.invoice_number.trim()) {
      setError("Invoice number is required.");
      return;
    }

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }

    if (!form.title.trim()) {
      setError("Invoice title is required.");
      return;
    }

    if (!Number.isFinite(amount) || amount < 0) {
      setError("Please enter a valid invoice amount.");
      return;
    }

    if (!Number.isFinite(amountPaid) || amountPaid < 0) {
      setError("Please enter a valid amount paid.");
      return;
    }

    if (amountPaid > amount) {
      setError("Amount paid cannot be greater than the invoice amount.");
      return;
    }

    if (!form.issue_date) {
      setError("Issue date is required.");
      return;
    }

    const selectedProject = form.project_id
      ? projects.find(
          (project) => project.id === Number(form.project_id)
        )
      : null;

    if (
      selectedProject &&
      selectedProject.customer_id !== customerId
    ) {
      setError("Selected project does not belong to this customer.");
      return;
    }

    const selectedQuotation = form.quotation_id
      ? quotations.find(
          (quotation) => quotation.id === Number(form.quotation_id)
        )
      : null;

    if (
      selectedQuotation &&
      selectedQuotation.customer_id !== customerId
    ) {
      setError("Selected quotation does not belong to this customer.");
      return;
    }

    let status: InvoiceStatus = "Unpaid";

    if (amountPaid >= amount && amount > 0) {
      status = "Paid";
    } else if (amountPaid > 0) {
      status = "Partially Paid";
    }

    setSaving(true);

    try {
      const payload = {
        invoice_number: form.invoice_number.trim(),
        customer_id: customerId,
        project_id: form.project_id
          ? Number(form.project_id)
          : null,
        quotation_id: form.quotation_id
          ? Number(form.quotation_id)
          : null,
        title: form.title.trim(),
        description: form.description.trim() || null,
        amount,
        amount_paid: amountPaid,
        status,
        issue_date: form.issue_date,
        due_date: form.due_date || null,
        notes: form.notes.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (editingInvoice) {
        const { error: updateError } = await supabase
          .from("invoices")
          .update(payload)
          .eq("id", editingInvoice.id);

        if (updateError) {
          throw new Error(updateError.message);
        }

        setSuccess("Invoice updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("invoices")
          .insert(payload);

        if (insertError) {
          throw new Error(insertError.message);
        }

        setSuccess("Invoice created successfully.");
      }

      await loadData();

      setShowModal(false);
      setEditingInvoice(null);
      setForm(emptyForm);
    } catch (err) {
      console.error("Invoice save error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save invoice."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteInvoice(invoice: Invoice) {
    const confirmed = window.confirm(
      `Delete invoice ${invoice.invoice_number}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const { error: deleteError } = await supabase
        .from("invoices")
        .delete()
        .eq("id", invoice.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setInvoices((current) =>
        current.filter((item) => item.id !== invoice.id)
      );

      setSuccess("Invoice deleted successfully.");
    } catch (err) {
      console.error("Invoice delete error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete invoice."
      );
    }
  }

  function openWhatsApp(invoice: Invoice) {
    const phone = normalizePhone(invoice.customer?.phone || null);

    if (!phone) {
      setError("This customer does not have a phone number.");
      return;
    }

    const balance = Math.max(
      Number(invoice.amount) - Number(invoice.amount_paid),
      0
    );

    const message = `Hello ${invoice.customer?.full_name || "there"}, this is FINETEX INTERIORS regarding invoice ${invoice.invoice_number} for ${invoice.title}. The outstanding balance is ${formatCurrency(
      balance
    )}.`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 size={20} className="animate-spin" />
          Loading invoices...
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
            Billing & Records
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Invoices
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Manage FINETEX invoices and manually track customer payments.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#b58b2a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9d771f]"
        >
          <Plus size={17} />
          New Invoice
        </button>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-700">
            {success}
          </p>
        </div>
      )}

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Invoices
          </p>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {summary.count}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            All invoice records
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Invoice Value
          </p>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {formatCurrency(summary.total)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Total invoiced
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Paid
          </p>

          <p className="mt-4 text-2xl font-bold text-green-700">
            {formatCurrency(summary.paid)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {summary.paidInvoices} paid invoice
            {summary.paidInvoices === 1 ? "" : "s"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Outstanding
          </p>

          <p className="mt-4 text-2xl font-bold text-red-700">
            {formatCurrency(summary.outstanding)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Remaining balance
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Pending
          </p>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {summary.unpaid + summary.partiallyPaid}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Unpaid or partially paid
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-96">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search invoice, title or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              ["All", "Unpaid", "Partially Paid", "Paid"] as const
            ).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  statusFilter === status
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Invoice
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Project
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Balance
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Due
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center"
                  >
                    <FileText
                      size={30}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 text-sm font-medium text-gray-600">
                      No invoices found
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Create your first invoice to start tracking billing.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => {
                  const balance = Math.max(
                    Number(invoice.amount) -
                      Number(invoice.amount_paid),
                    0
                  );

                  return (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-gray-900">
                          {invoice.invoice_number}
                        </p>

                        <p className="mt-1 max-w-[190px] truncate text-xs text-gray-500">
                          {invoice.title}
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          Issued {formatDate(invoice.issue_date)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-800">
                          {invoice.customer?.full_name ||
                            "Unknown Customer"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {invoice.customer?.location || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {invoice.project ? (
                          <>
                            <p className="text-sm font-medium text-gray-800">
                              {invoice.project.project_number}
                            </p>

                            <p className="mt-1 max-w-[170px] truncate text-xs text-gray-500">
                              {invoice.project.project_name}
                            </p>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Not linked
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(Number(invoice.amount))}
                        </p>

                        <p className="mt-1 text-xs text-green-600">
                          Paid:{" "}
                          {formatCurrency(
                            Number(invoice.amount_paid)
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(balance)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-600">
                          {formatDate(invoice.due_date)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openWhatsApp(invoice)}
                            className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                            title="WhatsApp customer"
                          >
                            <MessageCircle size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(invoice)}
                            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
                            title="Edit invoice"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteInvoice(invoice)}
                            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                            title="Delete invoice"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="space-y-4 lg:hidden">
        {filteredInvoices.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <FileText
              size={30}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm font-medium text-gray-600">
              No invoices found
            </p>
          </div>
        ) : (
          filteredInvoices.map((invoice) => {
            const balance = Math.max(
              Number(invoice.amount) -
                Number(invoice.amount_paid),
              0
            );

            return (
              <div
                key={invoice.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {invoice.invoice_number}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {invoice.title}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses(
                      invoice.status
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400">
                      Customer
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {invoice.customer?.full_name ||
                        "Unknown Customer"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400">
                      Amount
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {formatCurrency(Number(invoice.amount))}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400">
                      Paid
                    </p>

                    <p className="mt-1 text-sm font-semibold text-green-700">
                      {formatCurrency(
                        Number(invoice.amount_paid)
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400">
                      Balance
                    </p>

                    <p className="mt-1 text-sm font-bold text-red-700">
                      {formatCurrency(balance)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays size={14} />
                  Due: {formatDate(invoice.due_date)}
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openWhatsApp(invoice)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-green-700"
                  >
                    <MessageCircle size={14} />
                    WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(invoice)}
                    className="rounded-lg border border-gray-200 px-3 py-2.5 text-gray-600 transition hover:bg-gray-50"
                    title="Edit invoice"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteInvoice(invoice)}
                    className="rounded-lg border border-red-100 px-3 py-2.5 text-red-500 transition hover:bg-red-50"
                    title="Delete invoice"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingInvoice
                    ? "Edit Invoice"
                    : "Create New Invoice"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Record billing information manually.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {/* INVOICE NUMBER */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Invoice Number
                </label>

                <input
                  type="text"
                  value={form.invoice_number}
                  onChange={(e) =>
                    updateForm(
                      "invoice_number",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
                  placeholder="INV-000001"
                />
              </div>

              {/* CUSTOMER */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Customer
                </label>

                <select
                  value={form.customer_id}
                  onChange={(e) =>
                    handleCustomerChange(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
                >
                  <option value="">Select customer</option>

                  {customers.map((customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PROJECT + QUOTATION */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-700">
                    Project
                  </label>

                  <select
                    value={form.project_id}
                    onChange={(e) =>
                      updateForm(
                        "project_id",
                        e.target.value
                      )
                    }
                    disabled={!form.customer_id}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-gray-50 focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
                  >
                    <option value="">
                      {form.customer_id
                        ? "No project / select project"
                        : "Select customer first"}
                    </option>

                    {selectedCustomerProjects.map(
                      (project) => (
                        <option
                          key={project.id}
                          value={project.id}
                        >
                          {project.project_number} —{" "}
                          {project.project_name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-700">
                    Quotation
                  </label>

                  <select
                    value={form.quotation_id}
                    onChange={(e) =>
                      updateForm(
                        "quotation_id",
                        e.target.value
                      )
                    }
                    disabled={!form.customer_id}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-gray-50 focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
                  >
                    <option value="">
                      {form.customer_id
                        ? "No quotation / select quotation"
                        : "Select customer first"}
                    </option>

                    {selectedCustomerQuotations.map(
                      (quotation) => (
                        <option
                          key={quotation.id}
                          value={quotation.id}
                        >
                          {quotation.quotation_number} —{" "}
                          {formatCurrency(
                            Number(quotation.amount)
                          )}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* TITLE */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Invoice Title
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    updateForm("title", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
                  placeholder="Kitchen renovation invoice"
                />
              </div>

              {/* AMOUNTS */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-700">
                    Invoice Amount (KES)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) =>
                      updateForm("amount", e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-700">
                    Amount Paid (KES)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount_paid}
                    onChange={(e) =>
                      handleAmountPaidChange(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-700">
                    Balance
                  </label>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900">
                    {formatCurrency(
                      Math.max(
                        (Number(form.amount) || 0) -
                          (Number(form.amount_paid) || 0),
                        0
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* STATUS */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Payment Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    updateForm(
                      "status",
                      e.target.value as InvoiceStatus
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partially Paid">
                    Partially Paid
                  </option>
                  <option value="Paid">Paid</option>
                </select>

                <p className="mt-1 text-[11px] text-gray-400">
                  Status is automatically calculated from the amount
                  paid when saving.
                </p>
              </div>

              {/* DATES */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-700">
                    Issue Date
                  </label>

                  <input
                    type="date"
                    value={form.issue_date}
                    onChange={(e) =>
                      updateForm(
                        "issue_date",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-700">
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(e) =>
                      updateForm(
                        "due_date",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    updateForm(
                      "description",
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
                  placeholder="Describe what the invoice covers..."
                />
              </div>

              {/* NOTES */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Internal Notes
                </label>

                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    updateForm("notes", e.target.value)
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
                  placeholder="Internal billing notes..."
                />
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveInvoice}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#b58b2a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9d771f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {editingInvoice
                  ? "Save Changes"
                  : "Create Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
